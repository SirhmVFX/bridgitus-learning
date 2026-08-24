import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  type UpdateData,
  type DocumentData,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { isFamilyPlan } from "@/lib/pricingPlans";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Collect unique student doc IDs sharing this parent contact email. */
export async function findHouseholdStudentIds(
  parentEmail: string,
  includeDocId?: string
): Promise<string[]> {
  const email = normalizeEmail(parentEmail);
  if (!email) return includeDocId ? [includeDocId] : [];

  const ids = new Set<string>();
  if (includeDocId) ids.add(includeDocId);

  const [byParent, byEmail] = await Promise.all([
    getDocs(query(collection(db, "students"), where("parentEmail", "==", email))),
    getDocs(query(collection(db, "students"), where("email", "==", email))),
  ]);

  for (const snap of [byParent, byEmail]) {
    for (const d of snap.docs) ids.add(d.id);
  }

  return [...ids];
}

/**
 * Apply the same paid/payment fields to every child under a Family Plan household.
 * Non-family plans only update `primaryStudentId`.
 */
export async function applyPaymentToHousehold(options: {
  primaryStudentId: string;
  planTitle?: string | null;
  planId?: string | null;
  paymentFields: UpdateData<DocumentData>;
  maxSiblings?: number;
}): Promise<{ updatedIds: string[]; family: boolean }> {
  const {
    primaryStudentId,
    planTitle,
    planId,
    paymentFields,
    maxSiblings = 3,
  } = options;

  const primaryRef = doc(db, "students", primaryStudentId);
  // Always update primary first
  await updateDoc(primaryRef, paymentFields);

  const family = isFamilyPlan({
    title: planTitle || "",
    badge: "",
  });

  if (!family) {
    return { updatedIds: [primaryStudentId], family: false };
  }

  // Need parent email from the primary student — re-read via query is heavy;
  // callers should pass email when known. Look up from paymentFields is not enough.
  // Fetch via a lightweight path: household search needs email from firestore.
  const { getDoc } = await import("firebase/firestore");
  const primarySnap = await getDoc(primaryRef);
  if (!primarySnap.exists()) {
    return { updatedIds: [primaryStudentId], family: true };
  }
  const data = primarySnap.data();
  const parentEmail = normalizeEmail(
    String(data.parentEmail || data.email || "")
  );
  if (!parentEmail) {
    return { updatedIds: [primaryStudentId], family: true };
  }

  let householdIds = await findHouseholdStudentIds(parentEmail, primaryStudentId);
  // Cap family size
  if (householdIds.length > maxSiblings) {
    // Prefer keeping primary + earliest created if we can; otherwise truncate
    householdIds = [
      primaryStudentId,
      ...householdIds.filter((id) => id !== primaryStudentId).slice(0, maxSiblings - 1),
    ];
  }

  const siblingFields: UpdateData<DocumentData> = {
    ...paymentFields,
    ...(planId ? { planId } : {}),
    ...(planTitle ? { planTitle } : {}),
  };

  await Promise.all(
    householdIds
      .filter((id) => id !== primaryStudentId)
      .map((id) => updateDoc(doc(db, "students", id), siblingFields))
  );

  return { updatedIds: householdIds, family: true };
}
