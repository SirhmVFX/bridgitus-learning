// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Create email message
    const msg = {
      to: "sirhmvfx@gmail.com",
      from: process.env.EMAIL_FROM || "noreply@bridgitus.com",
      name: "Bridgitus Learning",
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // Send email
    await sgMail.send(msg);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "Error sending email:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        message: "Failed to send email",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
