import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

/**
 * POST /api/paystack/verify
 * Body: { reference: string, studentId: string }
 *
 * 1. Verifies the transaction with Paystack's API
 * 2. On success, updates the student doc in Firestore via client SDK
 */
export async function POST(request: Request) {
  try {
    const { reference, studentId } = await request.json();

    if (!reference || !studentId) {
      return NextResponse.json(
        { message: "Missing reference or studentId" },
        { status: 400 }
      );
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey || !secretKey.startsWith("sk_")) {
      return NextResponse.json(
        { message: "Paystack secret key is not configured on the server." },
        { status: 500 }
      );
    }

    // Verify with Paystack REST API
    const res = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        // Prevent Next.js from caching this fetch
        cache: "no-store",
      }
    );

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json(
        { message: `Paystack API error: ${res.status} ${body}` },
        { status: 502 }
      );
    }

    const data = await res.json();

    if (!data.status || data.data?.status !== "success") {
      return NextResponse.json(
        {
          message: "Payment was not successful",
          paystackStatus: data.data?.status ?? "unknown",
        },
        { status: 402 }
      );
    }

    // Update student payment status using the client-side Firestore SDK
    // Note: This runs on the server (Next.js API route), so it will succeed
    // as long as Firestore security rules allow authenticated writes OR
    // the student's own auth token is passed.
    // For server-side writes we use the client SDK with the student's doc ID directly.
    const studentRef = doc(db, "students", studentId);
    await updateDoc(studentRef, {
      paymentStatus: "paid",
      paymentReference: reference,
      paymentAmount: data.data.amount,
      paidAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    return NextResponse.json(
      {
        message: "Payment verified and recorded",
        amount: data.data.amount,
        currency: data.data.currency,
        paidAt: data.data.paid_at,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("Paystack verify error:", error);
    return NextResponse.json(
      {
        message: "Verification failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
