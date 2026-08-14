"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { auth, db } from "./firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import type { Student } from "./firestore";

interface StudentAuthContextType {
  user: User | null;
  student: Student | null;
  loading: boolean;
  /** Login with Student ID + password only (not email). */
  signIn: (studentId: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshStudent: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthContextType | null>(null);

const STUDENT_ID_RE = /^BRG-\d{4}-\d{4}$/i;
const ACTIVE_STUDENT_KEY = "bridgitus_active_student_id";

async function fetchStudentByUid(uid: string): Promise<Student | null> {
  const q = query(collection(db, "students"), where("uid", "==", uid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  // Prefer the Student ID chosen at login when multiple docs exist (legacy edge cases)
  const preferred = typeof window !== "undefined" ? localStorage.getItem(ACTIVE_STUDENT_KEY) : null;
  const match = preferred
    ? snap.docs.find((d) => (d.data() as Student).studentId === preferred)
    : undefined;
  const d = match ?? snap.docs[0];
  return { id: d.id, ...(d.data() as Student) };
}

async function fetchStudentByStudentId(studentId: string): Promise<Student | null> {
  const id = studentId.trim().toUpperCase();
  const q = query(collection(db, "students"), where("studentId", "==", id));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Student) };
}

export function StudentAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        const s = await fetchStudentByUid(firebaseUser.uid);
        setStudent(s);
      } else {
        setStudent(null);
        if (typeof window !== "undefined") localStorage.removeItem(ACTIVE_STUDENT_KEY);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signIn(studentIdInput: string, password: string) {
    const studentId = studentIdInput.trim().toUpperCase();
    if (!STUDENT_ID_RE.test(studentId)) {
      throw new Error("Enter your Student ID (e.g. BRG-2026-0001). Email login is not supported.");
    }

    const record = await fetchStudentByStudentId(studentId);
    if (!record) throw new Error("Student ID not found.");

    // New accounts use authEmail; older accounts used contact email for Auth
    const authEmail = record.authEmail || record.email;
    if (!authEmail) throw new Error("This student account is missing login details. Contact support.");

    await signInWithEmailAndPassword(auth, authEmail, password);
    if (typeof window !== "undefined") {
      localStorage.setItem(ACTIVE_STUDENT_KEY, studentId);
    }
    // Ensure the correct student profile is loaded immediately
    setStudent(record);
  }

  async function signOut() {
    if (typeof window !== "undefined") localStorage.removeItem(ACTIVE_STUDENT_KEY);
    await firebaseSignOut(auth);
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    if (!user?.email) throw new Error("Not authenticated");
    const cred = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, cred);
    await updatePassword(user, newPassword);
  }

  async function refreshStudent() {
    if (user) {
      const s = await fetchStudentByUid(user.uid);
      setStudent(s);
    }
  }

  return (
    <StudentAuthContext.Provider
      value={{ user, student, loading, signIn, signOut, changePassword, refreshStudent }}
    >
      {children}
    </StudentAuthContext.Provider>
  );
}

export function useStudentAuth() {
  const ctx = useContext(StudentAuthContext);
  if (!ctx)
    throw new Error("useStudentAuth must be used within StudentAuthProvider");
  return ctx;
}
