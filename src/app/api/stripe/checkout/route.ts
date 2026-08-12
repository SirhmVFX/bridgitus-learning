import { NextResponse } from "next/server";
import { getStripe, STRIPE_CURRENCY } from "@/lib/stripe";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

/**
 * POST /api/stripe/checkout
 * Body: { studentId, planId, planTitle, amountCents, successUrl?, cancelUrl? }
 * Creates a Stripe Checkout Session (AUD) and returns { url }.
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
    }

    const origin = new URL(request.url).origin;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: customerId,
      client_reference_id: studentId,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: STRIPE_CURRENCY,
            unit_amount: Math.round(amountCents),
            product_data: {
              name: planTitle || "Bridgitus Learning Plan",
              description: "Portal access for Bridgitus Learning",
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
    });
  } catch (error: unknown) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      {
        message: "Could not create checkout session",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
