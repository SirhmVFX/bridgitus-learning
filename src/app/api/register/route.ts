// src/app/api/contact/route.ts
import { NextResponse } from "next/server";
import sgMail from "@sendgrid/mail";

interface TimeSlot {
  date: string;
  time: string;
}

interface Student {
  firstName: string;
  lastName: string;
  age: string;
  gender: string;
  school: string;
  grade: string;
  subjectHelpNeeded: string;
  expectingResult: string;
  helpComment: string;
  currentPerformance: string;
  schoolAttitude: string;
  mind: string;
  personality: string;
  favouriteThingsToDo: string;
  lessonType: string;
  location: string;
  startPreference: string;
  startDate: string;
  selectedTimeSlots: TimeSlot[];
}

// Initialize SendGrid with your API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

export async function POST(request: Request) {
  try {
    const { registerData } = await request.json();

    // Format student data for email with improved styling
    const formatStudentData = (student: Student) => {
      return `
        <div style="margin-bottom: 25px; padding: 20px; background: #ffffff; border-radius: 12px; border: 1px solid #e0e6ed; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <h3 style="color: #2c3e50; margin: 0 0 15px 0; font-size: 18px; border-bottom: 2px solid #f0f4f8; padding-bottom: 10px;">
            ${student.firstName} ${student.lastName}
          </h3>
          <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 12px; margin-bottom: 10px;">
            <div>
              <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Age</p>
              <p style="margin: 0 0 10px 0; color: #2c3e50;">${student.age || "—"}</p>
            </div>
            <div>
              <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Gender</p>
              <p style="margin: 0 0 10px 0; color: #2c3e50;">${student.gender || "—"}</p>
            </div>
            <div>
              <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">School</p>
              <p style="margin: 0 0 10px 0; color: #2c3e50;">${student.school || "—"}</p>
            </div>
            <div>
              <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Grade</p>
              <p style="margin: 0 0 10px 0; color: #2c3e50;">${student.grade || "—"}</p>
            </div>
          </div>
          <div style="margin-top: 15px;">
            <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Subjects</p>
            <p style="margin: 0 0 15px 0; color: #2c3e50;">${student.subjectHelpNeeded || "Not specified"}</p>
            
            <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Lesson Type</p>
            <p style="margin: 0 0 15px 0; color: #2c3e50;">${student.lessonType || "Not specified"}</p>
            
            <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Location</p>
            <p style="margin: 0 0 15px 0; color: #2c3e50;">${student.location || "Not specified"}</p>
            
            <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Selected Time Slots</p>
            <div style="margin: 0 0 5px 0; color: #2c3e50;">
              ${
                student.selectedTimeSlots?.length
                  ? `<ul style="margin: 0; padding-left: 20px;">${student.selectedTimeSlots
                      .map(
                        (slot) =>
                          `<li style="margin-bottom: 5px;">${new Date(slot.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} at ${slot.time}</li>`
                      )
                      .join("")}</ul>`
                  : "None selected"
              }
            </div>
          </div>
        </div>
      `;
    };

    // Parent Email Template with enhanced design
    const parentEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank You - Bridgitus Learning</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff;">
          <!-- Header -->
          <div style="background-color: #4a6cf7; padding: 30px 40px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Thank You for Your Interest in Bridgitus Learning!</h1>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 40px;">
            <p>Dear <strong>${registerData.parentFirstName} ${registerData.parentLastName}</strong>,</p>
            <p>Thank you for registering your interest in our tutoring services. We're excited to help you achieve your educational goals!</p>
            
            <div style="background: #f8f9ff; border-left: 4px solid #4a6cf7; padding: 15px; margin: 25px 0; border-radius: 0 4px 4px 0;">
              <p style="margin: 0; color: #4a6cf7; font-weight: 500;">What's next?</p>
              <p style="margin: 8px 0 0 0; color: #4a6cf7;">Our team will review your information and contact you within 24 hours to discuss the next steps.</p>
            </div>
            
            <h2 style="color: #2c3e50; font-size: 20px; margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #e0e6ed;">Your Details</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
              <div>
                <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Email</p>
                <p style="margin: 0 0 10px 0;">${registerData.parentEmail}</p>
              </div>
              <div>
                <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Phone</p>
                <p style="margin: 0 0 10px 0;">${registerData.parentPhone}</p>
              </div>
              <div>
                <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Postcode</p>
                <p style="margin: 0 0 10px 0;">${registerData.parentPostcode}</p>
              </div>
              ${
                registerData.parentReferredBy
                  ? `
                <div>
                  <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Referred By</p>
                  <p style="margin: 0 0 10px 0;">${registerData.parentReferredBy}</p>
                </div>
              `
                  : ""
              }
            </div>
            
            <h2 style="color: #2c3e50; font-size: 20px; margin: 30px 0 15px 0; padding-bottom: 8px; border-bottom: 1px solid #e0e6ed;">Student Details</h2>
            ${registerData.students.map((student: Student) => formatStudentData(student)).join("")}
            
            <p style="margin: 30px 0 0 0;">If you have any questions or need to update your information, please don't hesitate to reply to this email.</p>
            
            <p style="margin: 30px 0 0 0;">Best regards,<br><strong>The Bridgitus Team</strong></p>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e6ed; text-align: center; color: #7f8c8d; font-size: 12px;">
              <p>Bridgitus Learning<br>Empowering Students to Achieve Their Full Potential</p>
              <p>© ${new Date().getFullYear()} Bridgitus Learning. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Admin Email Template with enhanced design
    const adminEmailContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Registration - Bridgitus Learning</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #2c3e50; background-color: #f8fafc;">
        <div style="max-width: 700px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <!-- Header -->
          <div style="background-color: #4a6cf7; padding: 25px 40px; color: white;">
            <h1 style="margin: 0; font-size: 22px;">🚨 New Registration Request</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9; font-size: 14px;">${new Date().toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
          
          <!-- Alert Box -->
          <div style="background: #e3f2fd; padding: 15px 40px; border-left: 4px solid #2196f3; margin: 0;">
            <div style="display: flex; align-items: center;">
              <div style="margin-right: 15px; font-size: 20px;">🔔</div>
              <div>
                <h3 style="margin: 0 0 5px 0; color: #0d47a1; font-size: 16px;">Action Required</h3>
                <p style="margin: 0; color: #0d47a1; font-size: 14px;">Please contact the parent within 24 hours to confirm the booking.</p>
              </div>
            </div>
          </div>
          
          <!-- Main Content -->
          <div style="padding: 30px 40px;">
            <h2 style="color: #2c3e50; font-size: 20px; margin: 0 0 20px 0; padding-bottom: 10px; border-bottom: 1px solid #e0e6ed;">
              Parent/Guardian Information
            </h2>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px;">
              <div>
                <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Name</p>
                <p style="margin: 0 0 15px 0; font-weight: 500;">${registerData.parentFirstName} ${registerData.parentLastName}</p>
              </div>
              <div>
                <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Email</p>
                <p style="margin: 0 0 15px 0;">
                  <a href="mailto:${registerData.parentEmail}" style="color: #4a6cf7; text-decoration: none;">
                    ${registerData.parentEmail}
                  </a>
                </p>
              </div>
              <div>
                <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Phone</p>
                <p style="margin: 0 0 15px 0;">
                  <a href="tel:${registerData.parentPhone.replace(/\D/g, "")}" style="color: #4a6cf7; text-decoration: none;">
                    ${registerData.parentPhone}
                  </a>
                </p>
              </div>
              <div>
                <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Postcode</p>
                <p style="margin: 0 0 15px 0;">${registerData.parentPostcode}</p>
              </div>
              ${
                registerData.parentReferredBy
                  ? `
                <div>
                  <p style="color: #7f8c8d; margin: 5px 0; font-size: 13px;">Referred By</p>
                  <p style="margin: 0 0 15px 0;">${registerData.parentReferredBy}</p>
                </div>
              `
                  : ""
              }
            </div>
            
            <h2 style="color: #2c3e50; font-size: 20px; margin: 30px 0 20px 0; padding-bottom: 10px; border-bottom: 1px solid #e0e6ed;">
              Students (${registerData.students.length})
            </h2>
            
            ${registerData.students.map((student: Student) => formatStudentData(student)).join("")}
            
            <div style="margin-top: 40px; padding: 20px; background: #f8f9ff; border-radius: 8px; text-align: center;">
              <a href="mailto:${registerData.parentEmail}?subject=Re: Your Registration with Bridgitus Learning" 
                 style="display: inline-block; background: #4a6cf7; color: white; text-decoration: none; padding: 12px 30px; border-radius: 6px; font-weight: 500; font-size: 15px;">
                Reply to ${registerData.parentFirstName}
              </a>
              <p style="margin: 15px 0 0 0; color: #7f8c8d; font-size: 13px;">
                This registration was submitted on ${new Date().toLocaleString()}
              </p>
            </div>
            
            <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e6ed; text-align: center; color: #7f8c8d; font-size: 12px;">
              <p>Bridgitus Learning Admin Portal</p>
              <p>© ${new Date().getFullYear()} Bridgitus Learning. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email to parent
    const parentEmail = {
      to: registerData.parentEmail,
      from: process.env.EMAIL_FROM || "noreply@bridgitus.com",
      subject: `✅ Expression of Interest Received - 🎉 Thank You for Your Interest in Bridgitus Learning`,
      html: parentEmailContent,
    };

    // Send email to admin
    const adminEmail = {
      to: process.env.ADMIN_EMAIL || "sirhmvfx@gmail.com",
      from: process.env.EMAIL_FROM || "noreply@bridgitus.com",
      subject: `🚨 New Booking Request Registration - BridgitUs Learn: ${registerData.parentFirstName} ${registerData.parentLastName}`,
      html: adminEmailContent,
    };

    // Send both emails in parallel
    await Promise.all([sgMail.send(parentEmail), sgMail.send(adminEmail)]);

    return NextResponse.json(
      { message: "Registration submitted successfully" },
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
