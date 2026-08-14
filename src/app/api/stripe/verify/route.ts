import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * POST /api/stripe/verify
 * Body: { sessionId: string, studentId: string }
 * Confirms a completed Checkout Session and marks the student as paid.
 */
export async function POST(request: Request) {
  try {
    const { sessionId, studentId } = await request.json();
    if (!sessionId || !studentId) {
      return NextResponse.json(
        { message: "Missing sessionId or studentId" },
        { status: 400 }
      );
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent", "payment_intent.payment_method"],
    });

    if (session.payment_status !== "paid" && session.status !== "complete") {
      return NextResponse.json(
        { message: "Payment was not successful", stripeStatus: session.payment_status },
        { status: 402 }
      );
    }

    const metaStudentId = session.metadata?.studentId || session.client_reference_id;
    if (metaStudentId && metaStudentId !== studentId) {
      return NextResponse.json({ message: "Session does not match this student" }, { status: 403 });
    }

    const planId = session.metadata?.planId ?? "";
    const planTitle = session.metadata?.planTitle ?? "";

    // Optional plan expiry from durationDays
    let planExpiresAt: Date | null = null;
    if (planId) {
      try {
        const planDoc = await getDoc(doc(db, "sitePricingPlans", planId));
        if (planDoc.exists()) {
          const plan = planDoc.data();
          if (plan.durationDays && plan.durationDays > 0) {
            planExpiresAt = new Date(Date.now() + plan.durationDays * 24 * 60 * 60 * 1000);
          }
        }
      } catch { /* best-effort */ }
    }

    // Capture customer + payment method for future auto-pay
    const customerId =
      typeof session.customer === "string" ? session.customer : session.customer?.id;

    let paymentMethodId: string | undefined;
    let cardLast4: string | undefined;
    let cardBrand: string | undefined;
    let expMonth: string | undefined;
    let expYear: string | undefined;

    const pi = session.payment_intent;
    if (pi && typeof pi !== "string") {
      const pm = pi.payment_method;
      if (pm && typeof pm !== "string") {
        paymentMethodId = pm.id;
        if (pm.card) {
          cardLast4 = pm.card.last4 ?? undefined;
          cardBrand = pm.card.brand ?? undefined;
          expMonth = pm.card.exp_month ? String(pm.card.exp_month) : undefined;
          expYear = pm.card.exp_year ? String(pm.card.exp_year) : undefined;
        }
      } else if (typeof pm === "string") {
        paymentMethodId = pm;
      }
    }

    const studentRef = doc(db, "students", studentId);
    await updateDoc(studentRef, {
      paymentStatus: "paid",
      paymentReference: sessionId,
      paymentAmount: session.amount_total ?? 0,
      paymentSubtotal: session.amount_subtotal ?? null,
      paymentTax: session.total_details?.amount_tax ?? null,
      paymentCurrency: session.currency ?? "aud",
      planId: planId || null,
      planTitle: planTitle || null,
      paidAt: serverTimestamp(),
      ...(planExpiresAt ? { planExpiresAt } : {}),
      ...(customerId ? { stripeCustomerId: customerId } : {}),
      ...(paymentMethodId
        ? {
            stripePaymentMethod: {
              paymentMethodId,
              last4: cardLast4 ?? "",
              brand: cardBrand ?? "",
              expMonth: expMonth ?? "",
              expYear: expYear ?? "",
            },
          }
        : {}),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json({
      message: "Payment verified and recorded",
      amount: session.amount_total,
      subtotal: session.amount_subtotal,
      tax: session.total_details?.amount_tax ?? 0,
      currency: session.currency,
    });
  } catch (error: unknown) {
    console.error("Stripe verify error:", error);
    return NextResponse.json(
      {
        message: "Verification failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
