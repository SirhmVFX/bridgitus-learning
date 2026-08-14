import { NextResponse } from "next/server";
import { getStripe, STRIPE_CURRENCY } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

/**
 * POST /api/stripe/checkout
 * Body: { studentId, planId, planTitle, amountCents, successUrl?, cancelUrl? }
 * Creates a Stripe Checkout Session (AUD) with tax (Stripe Tax) on each transaction.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      studentId,
      planId,
      planTitle,
      amountCents,
      successUrl,
      cancelUrl,
    } = body as {
      studentId: string;
      planId?: string;
      planTitle?: string;
      amountCents: number;
      successUrl?: string;
      cancelUrl?: string;
    };

    if (!studentId || !amountCents || amountCents <= 0) {
      return NextResponse.json({ message: "Missing studentId or amountCents" }, { status: 400 });
    }

    const studentSnap = await getDoc(doc(db, "students", studentId));
    if (!studentSnap.exists()) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }
    const student = studentSnap.data();
    const stripe = getStripe();

    // Reuse existing Stripe customer when available
    let customerId: string | undefined = student.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: student.email,
        name: `${student.firstName} ${student.lastName}`,
        metadata: {
          studentId,
          studentIdCode: student.studentId ?? "",
        },
      });
      customerId = customer.id;
      try {
        await updateDoc(doc(db, "students", studentId), { stripeCustomerId: customerId });
      } catch { /* non-fatal */ }
    }

    // Tax: exclusive = plan price + tax (e.g. GST) at checkout. Requires Stripe Tax in Dashboard.
    const taxEnabled = process.env.STRIPE_AUTOMATIC_TAX !== "false";
    const taxBehavior =
      (process.env.STRIPE_TAX_BEHAVIOR as "exclusive" | "inclusive" | undefined) || "exclusive";

    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: studentId,
      billing_address_collection: "required",
      customer_update: {
        address: "auto",
        name: "auto",
      },
      ...(taxEnabled ? { automatic_tax: { enabled: true } } : {}),
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: STRIPE_CURRENCY,
            unit_amount: Math.round(amountCents),
            tax_behavior: taxBehavior,
            product_data: {
              name: planTitle || "Bridgitus Learning Plan",
              description: "Portal access for Bridgitus Learning",
              // General - Electronically Supplied Services (override via STRIPE_TAX_CODE if needed)
              tax_code: process.env.STRIPE_TAX_CODE || "txcd_10000000",
            },
          },
        },
      ],
      payment_intent_data: {
        setup_future_usage: "off_session",
        metadata: {
          studentId,
          planId: planId ?? "",
          planTitle: planTitle ?? "",
        },
      },
      metadata: {
        studentId,
        planId: planId ?? "",
        planTitle: planTitle ?? "",
        taxEnabled: String(taxEnabled),
      },
      success_url:
        successUrl ||
        `${origin}/portal/payment?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/portal/payment?cancelled=1`,
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      customerId,
      taxEnabled,
    });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    const detail = error instanceof Error ? error.message : "Unknown error";
    const taxHint = /tax/i.test(detail)
      ? " Enable Stripe Tax in Dashboard → Tax, or set STRIPE_AUTOMATIC_TAX=false to skip."
      : "";
    return NextResponse.json(
      {
        message: detail.includes("API Key") || detail.includes("Invalid API Key")
          ? "Stripe API key is invalid. Check STRIPE_SECRET_KEY in .env.local (live keys must start with sk_live_)."
          : `Could not create checkout session.${taxHint}`,
        error: detail,
      },
      { status: 500 }
    );
  }
}
