// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { name, email, message, phone } = await request.json();

    // Format the current date and time
    const formattedDate = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    // Create HTML email template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission - Bridgitus Learning</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background-color: #4a6cf7; padding: 25px 40px; color: white;">
            <h1 style="margin: 0; font-size: 22px;">New Contact Form Submission</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">${formattedDate}</p>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px 40px;">
            <div style="margin-bottom: 30px;
                        background: #f8f9ff;
                        border-radius: 8px;
                        padding: 20px;
                        border-left: 4px solid #4a6cf7;">
              <p style="margin: 0;">${message.replace(/\n/g, "<br>")}</p>
            </div>
            
            <h2 style="color: #2c3e50; font-size: 18px; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #e0e6ed;">
              Contact Information
            </h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-bottom: 25px;">
              <div>
                <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Name</p>
                <p style="margin: 0 0 15px 0; font-weight: 500;">${name}</p>
              </div>
              <div>
                <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Email</p>
                <p style="margin: 0 0 15px 0;">
                  <a href="mailto:${email}" style="color: #4a6cf7; text-decoration: none;">
                    ${email}
                  </a>
                </p>
              </div>
              ${
                phone
                  ? `
                <div>
                  <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Phone</p>
                  <p style="margin: 0 0 15px 0;">
                    <a href="tel:${phone.replace(/\D/g, "")}" style="color: #4a6cf7; text-decoration: none;">
                      ${phone}
                    </a>
                  </p>
                </div>
              `
                  : ""
              }
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e6ed; text-align: center;">
              <a href="mailto:${email}?subject=Re: Your Message to Bridgitus Learning" 
                 style="display: inline-block; background: #4a6cf7; color: white; text-decoration: none; padding: 12px 25px; border-radius: 6px; font-weight: 500; font-size: 15px;">
                Reply to ${name.split(" ")[0]}
              </a>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e6ed; text-align: center; color: #7f8c8d; font-size: 12px;">
              <p>Bridgitus Learning Contact Form</p>
              <p>This message was sent from the contact form on ${process.env.NEXT_PUBLIC_SITE_URL || "your website"}.</p>
              <p>&copy; ${new Date().getFullYear()} Bridgitus Learning. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create text version for email clients that don't support HTML
    const textContent = `New Contact Form Submission

From: ${name} <${email}>
${phone ? `Phone: ${phone}\n` : ""}
Message:
${message}

---
This message was sent from the contact form on ${process.env.NEXT_PUBLIC_SITE_URL || "your website"}.
&copy; ${new Date().getFullYear()} Bridgitus Learning. All rights reserved.`;

    // Create email message
    const msg = {
      to: "sirhmvfx@gmail.com",
      from: process.env.EMAIL_FROM || "noreply@bridgitus.com",
      subject: `New Contact Enquiry: ${name} - Bridgitus Learning`,
      text: textContent,
      html: htmlContent,
      replyTo: email,
    };

    // Send email
    await sgMail.send(msg);

    return NextResponse.json(
      {
        message:
          "Your message has been sent successfully! We'll get back to you soon.",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error(
      "Error sending email:",
      error instanceof Error ? error.message : String(error)
    );
    return NextResponse.json(
      {
        message: "Failed to send message. Please try again later.",
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
