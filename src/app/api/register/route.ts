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

    const formatStudentData = (student: Student) => {
      return `
        First Name: ${student.firstName}
        Last Name: ${student.lastName}
        Age: ${student.age}
        Gender: ${student.gender}
        School: ${student.school}
        Grade: ${student.grade}
        Subjects: ${student.subjectHelpNeeded}
        Lesson Type: ${student.lessonType}
        Location: ${student.location}
        Selected Time Slots: ${
          student.selectedTimeSlots
            ?.map(
              (slot) =>
                `${new Date(slot.date).toLocaleDateString()} at ${slot.time}`
            )
            .join(", ") || "None"
        }
      `;
    };

    const textContent = `
      Parent/Guardian Information:
      Name: ${registerData.parentFirstName} ${registerData.parentLastName}
      Email: ${registerData.parentEmail}
      Phone: ${registerData.parentPhone}
      Postcode: ${registerData.parentPostcode}
      Referred By: ${registerData.parentReferredBy || "N/A"}
      
      Students (${registerData.students.length}):
      ${registerData.students
        .map(
          (student: Student, index: number) => `
        Student ${index + 1}:${formatStudentData(student)}
      `
        )
        .join("\n")}
    `;

    const htmlContent = `
      <h2>Parent/Guardian Information</h2>
      <p><strong>Name:</strong> ${registerData.parentFirstName} ${registerData.parentLastName}</p>
      <p><strong>Email:</strong> ${registerData.parentEmail}</p>
      <p><strong>Phone:</strong> ${registerData.parentPhone}</p>
      <p><strong>Postcode:</strong> ${registerData.parentPostcode}</p>
      <p><strong>Referred By:</strong> ${registerData.parentReferredBy || "N/A"}</p>
      
      <h2>Students (${registerData.students.length})</h2>
      ${registerData.students
        .map(
          (student: Student, index: number) => `
        <div style="margin-bottom: 20px; padding: 10px; border: 1px solid #eee; border-radius: 5px;">
          <h3>Student ${index + 1}</h3>
          <p><strong>First Name:</strong> ${student.firstName}</p>
          <p><strong>Last Name:</strong> ${student.lastName}</p>
          <p><strong>Age:</strong> ${student.age}</p>
          <p><strong>Gender:</strong> ${student.gender}</p>
          <p><strong>School:</strong> ${student.school}</p>
          <p><strong>Grade:</strong> ${student.grade}</p>
          <p><strong>Subjects:</strong> ${student.subjectHelpNeeded}</p>
          <p><strong>Lesson Type:</strong> ${student.lessonType}</p>
          <p><strong>Location:</strong> ${student.location}</p>
          <p><strong>Selected Time Slots:</strong> ${
            student.selectedTimeSlots
              ?.map(
                (slot) =>
                  `${new Date(slot.date).toLocaleDateString()} at ${slot.time}`
              )
              .join(", ") || "None"
          }</p>
        </div>
      `
        )
        .join("")}
    `;

    const msg = {
      to: "sirhmvfx@gmail.com",
      from: process.env.EMAIL_FROM || "noreply@bridgitus.com",
      name: "Bridgitus Learning",
      subject: `New Registration: ${registerData.parentFirstName} ${registerData.parentLastName}`,
      text: textContent,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6;">${htmlContent}</div>`,
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
