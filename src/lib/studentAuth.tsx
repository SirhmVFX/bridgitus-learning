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
  signIn: (emailOrStudentId: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshStudent: () => Promise<void>;
}

const StudentAuthContext = createContext<StudentAuthContextType | null>(null);

async function fetchStudentByUid(uid: string): Promise<Student | null> {
  const q = query(collection(db, "students"), where("uid", "==", uid));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const d = snap.docs[0];
  return { id: d.id, ...(d.data() as Student) };
}

async function resolveEmail(emailOrStudentId: string): Promise<string> {
  // If it looks like a student ID (BRG-YYYY-NNNN), look up their email
  if (/^BRG-\d{4}-\d{4}$/i.test(emailOrStudentId.trim())) {
    const q = query(
      collection(db, "students"),
      where("studentId", "==", emailOrStudentId.trim().toUpperCase())
    );
    const snap = await getDocs(q);
    if (snap.empty) throw new Error("Student ID not found.");
    return (snap.docs[0].data() as Student).email;
  }
  return emailOrStudentId.trim();
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
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  async function signIn(emailOrStudentId: string, password: string) {
    const email = await resolveEmail(emailOrStudentId);
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signOut() {
    await firebaseSignOut(auth);
  }

  async function changePassword(currentPassword: string, newPassword: string) {
    if (!user || !user.email) throw new Error("Not authenticated");
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
