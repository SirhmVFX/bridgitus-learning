"use client";
import { useState } from "react";
import Button from "@/components/Button";
import Link from "next/link";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", message: "", agree: false });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.agree) { setStatus({ ok: false, msg: "Please agree to the privacy policy." }); return; }
    setSubmitting(true); setStatus(null);
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.name, email: form.email, message: form.message }) });
      const data = await res.json();
      if (res.ok) { setStatus({ ok: true, msg: "Message sent! We'll get back to you soon." }); setForm({ name: "", email: "", message: "", agree: false }); }
      else throw new Error(data.message);
    } catch (err) { setStatus({ ok: false, msg: "Failed to send. Please try again." }); }
    finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-left">Leave us your info</h2>
      <input type="text" name="name" value={form.name} onChange={handleChange} required placeholder="Your Name"
        className="w-full bg-transparent p-4 border border-gray-300 text-sm outline-none focus:border-secondary-color transition-colors" />
      <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="Your Email"
        className="w-full bg-transparent p-4 border border-gray-300 text-sm outline-none focus:border-secondary-color transition-colors" />
      <textarea name="message" value={form.message} onChange={handleChange} required placeholder="Your Message" rows={5}
        className="w-full bg-transparent p-4 border border-gray-300 text-sm outline-none focus:border-secondary-color resize-none transition-colors" />
      <label className="flex items-start gap-2 text-sm cursor-pointer">
        <input type="checkbox" name="agree" checked={form.agree as boolean} onChange={handleChange} className="mt-0.5" />
        <span>You agree to our <Link href="/privacy-policy" className="text-secondary-color hover:underline">privacy policy</Link></span>
      </label>
      <Button style="button" disabled={submitting}>{submitting ? "Sending…" : "Send Message"}</Button>
      {status && <p className={`text-sm mt-1 ${status.ok ? "text-emerald-600" : "text-red-600"}`}>{status.msg}</p>}
    </form>
  );
}
