"use client";

import Button from "@/components/Button";
import { useState, useEffect } from "react";
import { format, isSameDay } from "date-fns";
import CalendarSelector from "@/components/CalendarSelector";
import { SelectedSlot } from "@/types/calendar";

function Register() {
  const [registerData, setRegisterData] = useState({
    organizingFor: "",
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    parentPostcode: "",
    parentReferredBy: "",
    noOfStudents: "1",
    startPreference: "",
    startDate: "",
    students: [
      {
        firstName: "",
        lastName: "",
        age: "",
        gender: "",
        school: "",
        grade: "",
        subjectHelpNeeded: "",
        expectingResult: "",
        helpComment: "",
        currentPerformance: "",
        schoolAttitude: "",
        mind: "",
        personality: "",
        favouriteThingsToDo: "",
        lessonType: "",
        location: "",
        startPreference: "",
        startDate: "",
        selectedTimeSlots: [] as SelectedSlot[],
      },
    ],
  });

  const [openDays, setOpenDays] = useState<Record<number, boolean>>({});
  const [selectedTimes, setSelectedTimes] = useState<Record<string, boolean>>(
    {}
  );

  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [step5, setStep5] = useState(false);
  const [step6, setStep6] = useState(false);
  const [step7, setStep7] = useState(false);

  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);

  const toggleDay = (id: number) => {
    setOpenDays((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleTimeSelect = (
    day: string,
    time1: string,
    time2: string,
    isChecked: boolean
  ) => {
    const timeKey = `${day}-${time1}`;
    setSelectedTimes((prev) => ({
      ...prev,
      [timeKey]: isChecked,
    }));
  };

  const handleStudentChange = (index: number, field: string, value: string) => {
    console.log(`Updating student ${index} field ${field} to`, value);
    setRegisterData((prev) => {
      const updatedStudents = [...prev.students];
      updatedStudents[index] = {
        ...updatedStudents[index],
        [field]: value,
      };
      console.log("Updated students:", updatedStudents);
      return {
        ...prev,
        students: updatedStudents,
      };
    });
  };

  useEffect(() => {
    if (
      registerData.noOfStudents &&
      registerData.students.length < parseInt(registerData.noOfStudents)
    ) {
      const newStudents = [...registerData.students];
      while (newStudents.length < parseInt(registerData.noOfStudents)) {
        newStudents.push({
          firstName: "",
          lastName: "",
          age: "",
          gender: "",
          school: "",
          grade: "",
          subjectHelpNeeded: "",
          expectingResult: "",
          helpComment: "",
          currentPerformance: "",
          schoolAttitude: "",
          mind: "",
          personality: "",
          favouriteThingsToDo: "",
          lessonType: "",
          location: "",
          startPreference: "",
          startDate: "",
          selectedTimeSlots: [] as SelectedSlot[],
        });
      }
      setRegisterData((prev) => ({
        ...prev,
        students: newStudents,
      }));
    }
  }, [registerData.noOfStudents]);

  const handleNextStudent = () => {
    const currentStudent = registerData.students[currentStudentIndex];

    if (
      !currentStudent.firstName ||
      !currentStudent.lastName ||
      !currentStudent.school ||
      !currentStudent.grade
    ) {
      alert("Please fill in all required fields for this student");
      return;
    }

    // Move to availability for current student
    setStep4(false);
    setStep5(true);
  };

  const handleNextAvailability = () => {
    const currentStudent = registerData.students[currentStudentIndex];
    const hasSelectedTimes = currentStudent.selectedTimeSlots?.length > 0;

    if (!hasSelectedTimes) {
      alert("Please select at least one available time slot");
      return;
    }

    // Check if there are more students to process
    if (currentStudentIndex < registerData.students.length - 1) {
      // Move to next student's info
      setCurrentStudentIndex((prev) => prev + 1);
      setStep5(false);
      setStep4(true);
    } else {
      // All students processed, move to next step
      setStep5(false);
      setStep6(true);
    }
  };

  const handleSubmit = () => {
    // Log all form data to console
    console.log("=== Form Submission Data ===");
    console.log("Parent/Guardian Information:", {
      organizingFor: registerData.organizingFor,
      parentFirstName: registerData.parentFirstName,
      parentLastName: registerData.parentLastName,
      parentEmail: registerData.parentEmail,
      parentPhone: registerData.parentPhone,
      parentPostcode: registerData.parentPostcode,
      parentReferredBy: registerData.parentReferredBy,
    });

    console.log("Students Information:");
    registerData.students.forEach((student, index) => {
      console.log(`Student ${index + 1}:`, {
        ...student,
        // Format the selectedTimeSlots for better readability
        selectedTimeSlots: student.selectedTimeSlots.map((slot) => ({
          date: new Date(slot.date).toLocaleDateString(),
          time: slot.time,
        })),
      });
    });

    // Here you would typically send the data to your backend
    // For now, we'll just log it
    console.log("=== End of Form Data ===");

    // Move to the final step
    setStep6(false);
    setStep7(true);
  };

  return (
    <div>
      {step1 ? (
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
              Book your first lesson with a Bridgitus tutor
            </h1>
            <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] font-bold">
              Our booking process is super easy and will just take a few
              minutes:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 md:items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-color">
                <h1 className="text-white">1</h1>
              </div>
              <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                You book
              </h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] md:text-center">
                Let us know about you, your child and how we can help.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] md:text-center">
                We want to learn as much as we can about your child and what has
                brought you to us - the more detailed you can be, the better our
                tutor match can be!
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] md:text-center">
                <span className="font-bold">
                  No payment details are required upfront -
                </span>
                this is all discussed after the first lesson.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-color">
                <h1 className="text-white">2</h1>
              </div>
              <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                We Assess
              </h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] md:text-center">
                We carefully assess your child to gain a clear understanding of
                their current level, strengths, and specific learning needs.
                Based on this, we create a tailored academic support plan
                designed to build confidence and foster continuous growth.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] md:text-center">
                Following the assessment, your child will be paired with a
                qualified tutor who provides structured, step-by-step guidance.
                Our tutors use engaging methods to make learning enjoyable while
                ensuring measurable academic progress.
              </p>
            </div>

            <div className="flex flex-col gap-2 md:items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-color">
                <h1 className="text-white">3</h1>
              </div>
              <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                We Tutor
              </h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] md:text-center">
                We work with your child directly, providing lessons that are
                tailored to their unique needs and learning style.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] md:text-center">
                From the very first session, our focus is on building
                confidence, improving understanding, making learning enjoyable
                and bridging learning gaps.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] md:text-center">
                Most students begin to see positive changes within the first 5
                sessions—whether that’s better grades, stronger skills, or a
                renewed love for learning. And we’ll keep you updated every step
                of the way.
              </p>
            </div>
          </div>

          <Button
            style="button"
            onClick={() => {
              setStep1(false);
              setStep2(true);
            }}
          >
            Get Started
          </Button>
        </div>
      ) : step2 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep2(false);
            setStep3(true);
          }}
          className="flex flex-col gap-10"
        >
          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-[12px]  font-medium">
              First up, who are we organising a tution for?
            </label>
            <select
              required
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  organizingFor: e.target.value,
                })
              }
              className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
            >
              <option value="">select</option>
              <option value="my-child">My Child, (I am the parent)</option>
              <option value="me">Me, (I am the student)</option>
              <option value="someone-else">
                Someone else (I am a carer, teacher, organisation or a family
                member)
              </option>
            </select>
          </div>

          <div>
            {registerData.organizingFor === "me" && (
              <div>
                <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                  We love it when you take the lead in your education!
                </h1>
                <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
                  We will still need to run your booking through a parent or
                  carer so they are aware of the details and costs. Please enter
                  the contact details of one of your parents on the next page
                  and we will send them some information!
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                setStep1(true);
                setStep2(false);
              }}
              type="button"
              className="px-5 py-3  font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 md:text-[8px] lg:text-[11px] xl:text-[12px] bg-black/5 "
            >
              Prev
            </button>

            <Button style="button">Next</Button>
          </div>
        </form>
      ) : step3 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep3(false);
            setStep4(true);
          }}
          className="flex flex-col gap-10"
        >
          {registerData.organizingFor === "my-child" ||
          registerData.organizingFor === "someone-else" ? (
            <div>
              <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                Your details
              </h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
                (This is you, the parent or carer - we will ask more about your
                child next)
              </p>
            </div>
          ) : (
            ""
          )}

          {registerData.organizingFor === "me" && (
            <div>
              <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                Your parent or carer&apos;s details:
              </h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
                We will send them some details about working with us and ensure
                they are in the loop.
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                First name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={registerData.parentFirstName}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    parentFirstName: e.target.value,
                  })
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                Last name <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={registerData.parentLastName}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    parentLastName: e.target.value,
                  })
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="tel"
                value={registerData.parentPhone}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    parentPhone: e.target.value,
                  })
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="email"
                value={registerData.parentEmail}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    parentEmail: e.target.value,
                  })
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                What is your post code <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={registerData.parentPostcode}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    parentPostcode: e.target.value,
                  })
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                If you were referred by a friend, please let us know who:
              </label>
              <input
                type="text"
                value={registerData.parentReferredBy}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    parentReferredBy: e.target.value,
                  })
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep2(true);
                  setStep3(false);
                }}
                className="px-5 py-3  font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 md:text-[8px] lg:text-[11px] xl:text-[12px] bg-black/5 "
              >
                Prev
              </button>

              <Button style="button">Next</Button>
            </div>
          </div>
        </form>
      ) : step4 ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNextStudent();
          }}
          className="flex flex-col gap-10"
        >
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 items-center justify-center p-10 border border-gray-300 rounded-md">
              <input
                type="radio"
                value="1"
                checked={registerData.noOfStudents === "1"}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    noOfStudents: e.target.value,
                  })
                }
              />
              <label htmlFor="" className="text-[12px]  font-medium">
                One Student
              </label>
            </div>

            <div className="flex flex-col gap-2 items-center justify-center p-10 border border-gray-300 rounded-md">
              <input
                type="radio"
                value="2"
                checked={registerData.noOfStudents === "2"}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    noOfStudents: e.target.value,
                  })
                }
              />
              <label htmlFor="" className="text-[12px]  font-medium">
                Two Students
              </label>
            </div>

            <div className="flex flex-col gap-2 items-center justify-center p-10 border border-gray-300 rounded-md">
              <input
                type="radio"
                value="3"
                checked={registerData.noOfStudents === "3"}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    noOfStudents: e.target.value,
                  })
                }
              />
              <label htmlFor="" className="text-[12px]  font-medium">
                Three Students
              </label>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {registerData.noOfStudents !== "1" && (
              <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                {currentStudentIndex === 0
                  ? "First"
                  : currentStudentIndex === 1
                    ? "Second"
                    : "Third"}{" "}
                student details:
              </h1>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  Student first name: <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={registerData.students[currentStudentIndex].firstName}
                  onChange={(e) =>
                    handleStudentChange(
                      currentStudentIndex,
                      "firstName",
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  Student last name: <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={registerData.students[currentStudentIndex].lastName}
                  onChange={(e) =>
                    handleStudentChange(
                      currentStudentIndex,
                      "lastName",
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  Student age: <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={registerData.students[currentStudentIndex].firstName}
                  onChange={(e) =>
                    handleStudentChange(
                      currentStudentIndex,
                      "age",
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  Student gender: <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={registerData.students[currentStudentIndex].gender}
                  onChange={(e) =>
                    handleStudentChange(
                      currentStudentIndex,
                      "gender",
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  What school do they go to?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={registerData.students[currentStudentIndex].school}
                  onChange={(e) =>
                    handleStudentChange(
                      currentStudentIndex,
                      "school",
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  What grade are they in?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={registerData.students[currentStudentIndex].grade}
                  onChange={(e) =>
                    handleStudentChange(
                      currentStudentIndex,
                      "grade",
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                >
                  <option value="">Select grade</option>
                  <option value="Pre-K">Pre-K</option>
                  <option value="K">K</option>
                  {[...Array(12)].map((_, i) => (
                    <option key={i + 1} value={String(i + 1)}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {registerData.students[currentStudentIndex].grade && (
              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  What subject do they need support in?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
                  Please select the subject(s) that best describes their area of
                  need.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mt-2">
                  {/* Elementary School (Pre-K to 6) */}
                  {["Pre-K", "K", "1", "2", "3", "4", "5", "6"].includes(
                    registerData.students[currentStudentIndex].grade
                  ) &&
                    [
                      "Primary School General Support",
                      "Primary School English",
                      "Primary School Maths",
                      "OC Exam Preparation",
                      "NAPLAN Preparation",
                      "HAST Preparation",
                      "Selective School Preparation",
                    ].map((subject) => (
                      <label
                        key={subject}
                        className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                          registerData.students[
                            currentStudentIndex
                          ].subjectHelpNeeded?.includes(subject)
                            ? "bg-primary-color/20 border-primary-color"
                            : "border-gray-300 hover:border-primary-color/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-color focus:ring-primary-color mr-2"
                          checked={
                            registerData.students[
                              currentStudentIndex
                            ].subjectHelpNeeded?.includes(subject) || false
                          }
                          onChange={(e) => {
                            const currentSubjects =
                              registerData.students[
                                currentStudentIndex
                              ].subjectHelpNeeded
                                ?.split(",")
                                .filter(Boolean) || [];
                            let newSubjects;

                            if (e.target.checked) {
                              newSubjects = [
                                ...new Set([...currentSubjects, subject]),
                              ];
                            } else {
                              newSubjects = currentSubjects.filter(
                                (s) => s !== subject
                              );
                            }

                            handleStudentChange(
                              currentStudentIndex,
                              "subjectHelpNeeded",
                              newSubjects.join(",")
                            );
                          }}
                        />
                        <span className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
                          {subject}
                        </span>
                      </label>
                    ))}

                  {["7", "8", "9", "10"].includes(
                    registerData.students[currentStudentIndex].grade
                  ) &&
                    [
                      "Yrs 7 - 10 General Support",
                      "Yrs 7- 10 English",
                      "Yrs 7- 10 Maths",
                      "Yrs 7- 10 Science",
                      "NAPLAN Preparation",
                      "Selective School Preparation",
                    ].map((subject) => (
                      <label
                        key={subject}
                        className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                          registerData.students[
                            currentStudentIndex
                          ].subjectHelpNeeded?.includes(subject)
                            ? "bg-primary-color/20 border-primary-color"
                            : "border-gray-300 hover:border-primary-color/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-color focus:ring-primary-color mr-2"
                          checked={
                            registerData.students[
                              currentStudentIndex
                            ].subjectHelpNeeded?.includes(subject) || false
                          }
                          onChange={(e) => {
                            const currentSubjects =
                              registerData.students[
                                currentStudentIndex
                              ].subjectHelpNeeded
                                ?.split(",")
                                .filter(Boolean) || [];
                            let newSubjects;

                            if (e.target.checked) {
                              newSubjects = [
                                ...new Set([...currentSubjects, subject]),
                              ];
                            } else {
                              newSubjects = currentSubjects.filter(
                                (s) => s !== subject
                              );
                            }

                            handleStudentChange(
                              currentStudentIndex,
                              "subjectHelpNeeded",
                              newSubjects.join(",")
                            );
                          }}
                        />
                        <span className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
                          {subject}
                        </span>
                      </label>
                    ))}

                  {["11", "12"].includes(
                    registerData.students[currentStudentIndex].grade
                  ) &&
                    [
                      "HSC & VCE English (Standard)",
                      "HSC & VCE English (Advanced)",
                      "HSC & VCE English Extension",
                      "HSC & VCE English Extension 2",
                      "HSC & VCE Maths (Standard)",
                      "HSC & VCE Maths (Advanced)",
                      "HSC & VCE Maths Extension",
                      "HSC & VCE Maths Extension 2",
                      "HSC General Support",
                      "HSC Chemistry",
                      "HSC Physics",
                      "HSC Biology",
                      "HSC Business Studies",
                      "HSC Legal Studies",
                      "HSC Economics",
                    ].map((subject) => (
                      <label
                        key={subject}
                        className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                          registerData.students[
                            currentStudentIndex
                          ].subjectHelpNeeded?.includes(subject)
                            ? "bg-primary-color/20 border-primary-color"
                            : "border-gray-300 hover:border-primary-color/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-primary-color focus:ring-primary-color mr-2"
                          checked={
                            registerData.students[
                              currentStudentIndex
                            ].subjectHelpNeeded?.includes(subject) || false
                          }
                          onChange={(e) => {
                            const currentSubjects =
                              registerData.students[
                                currentStudentIndex
                              ].subjectHelpNeeded
                                ?.split(",")
                                .filter(Boolean) || [];
                            let newSubjects;

                            if (e.target.checked) {
                              newSubjects = [
                                ...new Set([...currentSubjects, subject]),
                              ];
                            } else {
                              newSubjects = currentSubjects.filter(
                                (s) => s !== subject
                              );
                            }

                            handleStudentChange(
                              currentStudentIndex,
                              "subjectHelpNeeded",
                              newSubjects.join(",")
                            );
                          }}
                        />
                        <span className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
                          {subject}
                        </span>
                      </label>
                    ))}
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                What is the main result you are looking for?{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={
                  registerData.students[currentStudentIndex].expectingResult
                }
                onChange={(e) =>
                  handleStudentChange(
                    currentStudentIndex,
                    "expectingResult",
                    e.target.value
                  )
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
              >
                <option value="">Select expected result</option>
                <option value="Get better at school">
                  Get better at school
                </option>
                <option value="Boost confidence">Boost confidence</option>
                <option value="Enjoy the learning experience">
                  Enjoy the learning experience
                </option>
                <option value="A mix of all">A mix of all</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                How can we help?
              </label>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
                Please provide as much info about your child as you can - why
                you are seeking a tutor, if and what struggles they have at
                school and any other details that may be relevant in matching
                them up with the right tutor.
              </p>
              <textarea
                value={registerData.students[currentStudentIndex].helpComment}
                onChange={(e) =>
                  handleStudentChange(
                    currentStudentIndex,
                    "helpComment",
                    e.target.value
                  )
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px h-[200px]"
              ></textarea>
            </div>

            <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
              We would love to know more about the student so we can match them
              with the perfect tutor for them:
            </p>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                How would you describe their current performance at school?
              </label>
              <div className="flex gap-2">
                {[
                  "Struggling at school",
                  "Excelling at school",
                  "Somewhere in between",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`p-2 cursor-pointer rounded-md border ${registerData.students[currentStudentIndex].currentPerformance === option ? "bg-primary-color/20 border-2 border-primary-color" : "bg-black/5"} border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]`}
                    onClick={() =>
                      handleStudentChange(
                        currentStudentIndex,
                        "currentPerformance",
                        option
                      )
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                How would you describe their attitude towards school?
              </label>
              <div className="flex gap-2">
                {[
                  "They love school",
                  "They dislike school",
                  "Somewhere in between",
                ].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`p-2 rounded-md cursor-pointer border ${registerData.students[currentStudentIndex].schoolAttitude === option ? "bg-primary-color/20 border-2 border-primary-color" : "bg-black/5"} border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]`}
                    onClick={() =>
                      handleStudentChange(
                        currentStudentIndex,
                        "schoolAttitude",
                        option
                      )
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                How would you describe their mind?
              </label>
              <div className="flex gap-2">
                {["Creative", "Analytical", "Somewhere in between"].map(
                  (option) => (
                    <button
                      key={option}
                      type="button"
                      className={`p-2 cursor-pointer rounded-md border ${registerData.students[currentStudentIndex].mind === option ? "bg-primary-color/20 border-2 border-primary-color" : "bg-black/5"} border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]`}
                      onClick={() =>
                        handleStudentChange(currentStudentIndex, "mind", option)
                      }
                    >
                      {option}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                How would you describe their personality?
              </label>
              <div className="flex gap-2">
                {["Shy", "Outgoing", "Somewhere in between"].map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`p-2 cursor-pointer rounded-md border ${registerData.students[currentStudentIndex].personality === option ? "bg-primary-color/20 border-2 border-primary-color" : "bg-black/5"} border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]`}
                    onClick={() =>
                      handleStudentChange(
                        currentStudentIndex,
                        "personality",
                        option
                      )
                    }
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                What are their 3 favourite things to do (ie. video games,
                soccer, swimming)
              </label>
              <div className="grid md:grid-cols-3 gap-2">
                {[0, 1, 2].map((index) => (
                  <input
                    key={index}
                    type="text"
                    placeholder={`Favorite thing ${index + 1}`}
                    value={
                      registerData.students[
                        currentStudentIndex
                      ].favouriteThingsToDo.split(",")[index] || ""
                    }
                    onChange={(e) => {
                      const things =
                        registerData.students[
                          currentStudentIndex
                        ].favouriteThingsToDo.split(",");
                      things[index] = e.target.value;
                      handleStudentChange(
                        currentStudentIndex,
                        "favouriteThingsToDo",
                        things.join(",")
                      );
                    }}
                    className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setStep3(true);
                setStep4(false);
              }}
              className="px-5 py-3  font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 md:text-[8px] lg:text-[11px] xl:text-[12px] bg-black/5 "
            >
              Prev
            </button>

            <button
              type="submit"
              className="px-5 py-3 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer bg-secondary-color text-white md:text-[8px] lg:text-[11px] xl:text-[12px]"
            >
              Next
            </button>
          </div>
        </form>
      ) : step5 ? (
        <div>
          <div>
            <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
              {registerData.students[currentStudentIndex].firstName}&apos;s
              Availability:
            </h1>
            <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
              Please select all the days and times that could work for lessons.
            </p>
          </div>

          <div className="flex flex-col gap-4 py-6">
            <CalendarSelector
              selectedSlots={
                registerData.students[currentStudentIndex].selectedTimeSlots
              }
              onSlotToggle={(date, time) => {
                const updatedStudents = [...registerData.students];
                const currentSlots = [
                  ...updatedStudents[currentStudentIndex].selectedTimeSlots,
                ];

                const dateString = date.toISOString();

                // Check if this slot is already selected
                const existingIndex = currentSlots.findIndex(
                  (slot) =>
                    isSameDay(new Date(slot.date), date) && slot.time === time
                );

                if (existingIndex >= 0) {
                  // Remove the slot if it exists
                  currentSlots.splice(existingIndex, 1);
                } else {
                  // Add the slot if it doesn't exist
                  currentSlots.push({ date: dateString, time });
                }

                updatedStudents[currentStudentIndex].selectedTimeSlots =
                  currentSlots;
                setRegisterData({
                  ...registerData,
                  students: updatedStudents,
                });
              }}
            />
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleNextAvailability();
            }}
            className="flex flex-col gap-10"
          >
            <div className="flex flex-col gap-2">
              <label
                htmlFor={`startPreference-${currentStudentIndex}`}
                className="text-[12px] font-medium"
              >
                When would you like to start?{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                id={`startPreference-${currentStudentIndex}`}
                required
                value={
                  registerData.students[currentStudentIndex].startPreference ||
                  ""
                }
                onChange={(e) =>
                  handleStudentChange(
                    currentStudentIndex,
                    "startPreference",
                    e.target.value
                  )
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]"
              >
                <option value="">Select</option>
                <option value="asap">As soon as possible</option>
                <option value="later">At a later date</option>
              </select>
              {registerData.students[currentStudentIndex].startPreference ===
                "later" && (
                <div className="mt-2">
                  <label
                    htmlFor={`startDate-${currentStudentIndex}`}
                    className="text-[12px] font-medium block mb-1"
                  >
                    Select start date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id={`startDate-${currentStudentIndex}`}
                    required
                    value={
                      registerData.students[currentStudentIndex].startDate || ""
                    }
                    onChange={(e) =>
                      handleStudentChange(
                        currentStudentIndex,
                        "startDate",
                        e.target.value
                      )
                    }
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]"
                  />
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep4(true);
                  setStep5(false);
                }}
                className="px-5 py-3  font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 md:text-[8px] lg:text-[11px] xl:text-[12px] bg-black/5 "
              >
                Back to Student Info
              </button>

              <button
                type="submit"
                className="px-5 py-3 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer bg-secondary-color text-white md:text-[8px] lg:text-[11px] xl:text-[12px]"
              >
                {currentStudentIndex < registerData.students.length - 1
                  ? "Save & Add Next Student"
                  : "Continue"}
              </button>
            </div>
          </form>
        </div>
      ) : step6 ? (
        <div className="flex flex-col gap-6">
          <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
            Review Your Information
          </h1>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">
              Parent/Guardian Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p>
                  {registerData.parentFirstName} {registerData.parentLastName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p>{registerData.parentEmail}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p>{registerData.parentPhone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Postcode</p>
                <p>{registerData.parentPostcode}</p>
              </div>
            </div>
          </div>

          {registerData.students.map((student, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold mb-4">
                Student {index + 1}: {student.firstName} {student.lastName}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">School</p>
                  <p>{student.school}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grade</p>
                  <p>{student.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Subjects</p>
                  <p>{student.subjectHelpNeeded?.split(",").join(", ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Selected Time Slots</p>
                  <div className="space-y-1">
                    {student.selectedTimeSlots.map((slot, i) => (
                      <div key={i} className="text-sm">
                        {format(new Date(slot.date), "EEEE, MMMM d, yyyy")} at{" "}
                        {slot.time}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => {
                setStep6(false);
                setStep5(true);
              }}
              className="px-5 py-3 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer transition-all duration-200 md:text-[8px] lg:text-[11px] xl:text-[12px] bg-black/5"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-3 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer bg-secondary-color text-white md:text-[8px] lg:text-[11px] xl:text-[12px]"
            >
              Submit Registration
            </button>
          </div>
        </div>
      ) : step7 ? (
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold text-green-600 mb-4">
            Registration Submitted Successfully!
          </h1>
          <p className="mb-6">
            Thank you for registering with Bridgtus. We&apos;ll be in touch
            shortly to confirm your booking.
          </p>
          <p className="text-sm text-gray-500">
            Check your browser&apos;s console to see the submitted data.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default Register;
