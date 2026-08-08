"use client";

import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useStudentAuth } from "@/lib/studentAuth";
import { updateStudent } from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import {
  MdPerson, MdEdit, MdSave, MdLock, MdBadge,
  MdSchool, MdEmail, MdPhone, MdUpload, MdCheckCircle,
  MdPayment,
} from "react-icons/md";

export default function AccountPage() {
  const { student, user, changePassword, refreshStudent, loading } = useStudentAuth();

  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(student?.bio ?? "");
  const [saving, setSaving] = useState(false);
  const [saveOk, setSaveOk] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [pwOk, setPwOk] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => { if (student) setBio(student.bio ?? ""); }, [student]);

  async function handleSaveProfile() {
    if (!student?.id) return;
    setSaving(true);
    try {
      await updateStudent(student.id, { bio });
      await refreshStudent();
      setEditing(false); setSaveOk(true);
      setTimeout(() => setSaveOk(false), 3000);
    } finally { setSaving(false); }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !student?.id) return;
    setAvatarUploading(true);
    try {
      const url = await uploadToCloudinary(file, "bridgitus/avatars");
      await updateStudent(student.id, { avatar: url });
      await refreshStudent();
    } catch (err) { alert(err instanceof Error ? err.message : "Upload failed"); }
    finally { setAvatarUploading(false); }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault(); setPwError("");
    if (newPw.length < 8) { setPwError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setPwError("Passwords do not match."); return; }
    setPwSaving(true);
    try {
      await changePassword(currentPw, newPw);
      setPwOk(true); setCurrentPw(""); setNewPw(""); setConfirmPw("");
      setTimeout(() => setPwOk(false), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed";
      setPwError(msg.includes("wrong-password") || msg.includes("invalid-credential")
        ? "Current password is incorrect." : msg);
    } finally { setPwSaving(false); }
  }

  if (loading) {
    return (
      <PortalLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-secondary-color border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-500">Loading your account…</p>
          </div>
        </div>
      </PortalLayout>
    );
  }

  if (!student) {
    return (
      <PortalLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Unable to load your account information.</p>
            <a href="/portal/login" className="text-secondary-color hover:underline">Return to login</a>
          </div>
        </div>
      </PortalLayout>
    );
  }
  const initials = `${student.firstName?.[0] ?? ""}${student.lastName?.[0] ?? ""}`.toUpperCase();

  const paymentColor =
    student.paymentStatus === "paid" ? "bg-emerald-100 text-emerald-700" :
      student.paymentStatus === "waived" ? "bg-blue-100 text-blue-700" :
        student.paymentStatus === "failed" ? "bg-red-100 text-red-700" :
          "bg-amber-100 text-amber-700";
  const paymentLabel =
    student.paymentStatus === "paid" ? "✓ Paid" :
      student.paymentStatus === "waived" ? "Waived" :
        student.paymentStatus === "failed" ? "Failed" : "Pending Payment";

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 text-sm outline-none focus:border-secondary-color transition-colors";

  return (
    <PortalLayout>
      <div className="max-w-3xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage your profile and security settings</p>
        </div>

        {/* Profile card */}
        <div className="bg-white border border-gray-200 p-6">
          <div className="flex items-start gap-5">
            {/* Avatar */}
            <div className="relative shrink-0">
              <div className="w-18 h-18 w-16 h-16 bg-secondary-color flex items-center justify-center overflow-hidden">
                {student.avatar
                  ? <img src={student.avatar} alt="avatar" className="w-full h-full object-cover" /> // eslint-disable-line @next/next/no-img-element
                  : <span className="text-white text-xl font-bold">{initials}</span>}
              </div>
              <label className="absolute -bottom-1 -right-1 w-7 h-7 bg-secondary-color text-white flex items-center justify-center cursor-pointer hover:bg-secondary-color/90 transition-colors">
                {avatarUploading
                  ? <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <MdUpload size={14} />}
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} disabled={avatarUploading} />
              </label>
            </div>

            {/* Name + badges */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{student.firstName} {student.lastName}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-secondary-color/10 text-secondary-color text-xs font-bold px-2 py-0.5">
                  <MdBadge size={12} /> {student.studentId}
                </span>
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-0.5">
                  <MdSchool size={12} /> Grade {student.grade}
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 ${student.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"
                  }`}>{student.status}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 flex items-center gap-1 ${paymentColor}`}>
                  <MdPayment size={11} /> {paymentLabel}
                </span>
              </div>
              <p className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                <MdEmail size={13} /> {student.email}
              </p>
            </div>

            <button onClick={() => setEditing(!editing)}
              className="flex items-center gap-1.5 text-sm text-secondary-color font-medium hover:underline shrink-0">
              <MdEdit size={15} />{editing ? "Cancel" : "Edit"}
            </button>
          </div>

          {/* Bio */}
          <div className="mt-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">About Me</label>
            {editing ? (
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                placeholder="Tell us a bit about yourself…"
                className="w-full p-3 border border-gray-200 text-sm outline-none focus:border-secondary-color resize-none transition-colors" />
            ) : (
              <p className="text-sm text-gray-600 italic">{student.bio || "No bio added yet."}</p>
            )}
          </div>

          {editing && (
            <div className="mt-4 flex items-center gap-3">
              <button onClick={handleSaveProfile} disabled={saving}
                className="flex items-center gap-2 bg-secondary-color text-white text-sm font-semibold px-4 py-2 hover:bg-secondary-color/90 disabled:opacity-60 transition-colors">
                <MdSave size={15} />{saving ? "Saving…" : "Save Changes"}
              </button>
              {saveOk && <span className="flex items-center gap-1 text-sm text-emerald-600"><MdCheckCircle size={15} /> Saved</span>}
            </div>
          )}
        </div>

        {/* Student info */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdPerson size={16} className="text-secondary-color" /> Student Information
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "First Name", value: student.firstName },
              { label: "Last Name", value: student.lastName },
              { label: "Date of Birth", value: student.dateOfBirth },
              { label: "Gender", value: student.gender },
              { label: "School", value: student.school },
              { label: "Grade", value: student.grade },
              { label: "Subjects", value: student.subjects?.join(", ") || "—" },
              { label: "Postcode", value: student.postcode },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-gray-800 font-medium">{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Parent info */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdPhone size={16} className="text-secondary-color" /> Parent / Guardian
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            {[
              { label: "Name", value: `${student.parentFirstName} ${student.parentLastName}` },
              { label: "Email", value: student.parentEmail },
              { label: "Phone", value: student.parentPhone },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-0.5">{label}</p>
                <p className="text-gray-800 font-medium">{value || "—"}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment status */}
        <div className={`border p-5 ${student.paymentStatus === "paid" || student.paymentStatus === "waived" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <MdPayment size={14} /> Payment Status
          </p>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <span className={`text-sm font-bold px-3 py-1 ${paymentColor}`}>{paymentLabel}</span>
              {student.paymentReference && (
                <p className="text-xs text-gray-500 mt-1.5">Ref: <span className="font-mono">{student.paymentReference}</span></p>
              )}
            </div>
            {student.paymentStatus === "pending" && (
              <a href="/portal/payment"
                className="bg-secondary-color text-white text-sm font-semibold px-4 py-2 hover:bg-secondary-color/90 transition-colors">
                Complete Payment →
              </a>
            )}
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-white border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MdLock size={16} className="text-secondary-color" /> Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            {[
              { label: "Current Password", val: currentPw, set: setCurrentPw },
              { label: "New Password", val: newPw, set: setNewPw, min: 8 },
              { label: "Confirm New Password", val: confirmPw, set: setConfirmPw },
            ].map(({ label, val, set, min }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{label}</label>
                <input type="password" value={val} onChange={(e) => set(e.target.value)}
                  required minLength={min} className={inputCls} placeholder="••••••••" />
              </div>
            ))}
            {pwError && <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-4 py-2.5">{pwError}</p>}
            {pwOk && <p className="text-sm text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2.5 flex items-center gap-2"><MdCheckCircle size={15} /> Password changed!</p>}
            <button type="submit" disabled={pwSaving}
              className="flex items-center gap-2 bg-secondary-color text-white text-sm font-semibold px-5 py-2.5 hover:bg-secondary-color/90 disabled:opacity-60 transition-colors">
              <MdLock size={15} />{pwSaving ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>

        {/* Credentials */}
        <div className="bg-secondary-color/5 border border-secondary-color/20 p-5">
          <p className="text-xs font-semibold text-secondary-color uppercase tracking-wide mb-3">Your Login Credentials</p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Student ID</p>
              <p className="font-bold font-mono text-secondary-color text-base">{student.studentId}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-0.5">Email</p>
              <p className="font-medium text-gray-800">{student.email}</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Login with your Student ID <strong>or</strong> email at{" "}
            <a href="/portal/login" className="text-secondary-color hover:underline">bridgitus.com/portal/login</a>
          </p>
        </div>
      </div>
    </PortalLayout>
  );
}
