"use client";

import Button from "@/components/Button";
import { useState } from "react";

function Register() {
  const [registerData, setRegisterData] = useState({
    organizingFor: "",
    parentFirstName: "",
    parentLastName: "",
    parentEmail: "",
    parentPhone: "",
    parentPostcode: "",
    parentReferredBy: "",
    noOfStudents: "",
    students: [
      {
        firstName: "",
        lastName: "",
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
      },
    ],
  });

  const [openDays, setOpenDays] = useState<Record<number, boolean>>({});

  const toggleDay = (id: number) => {
    setOpenDays((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);
  const [step5, setStep5] = useState(false);
  const [step6, setStep7] = useState(false);

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
            <div className="flex flex-col gap-2 items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-color">
                <h1 className="text-white">1</h1>
              </div>
              <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                You book
              </h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                Let us know about you, your child and how we can help.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                We want to learn as much as we can about your child and what has
                brought you to us - the more detailed you can be, the better our
                tutor match can be!
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                <span className="font-bold">
                  No payment details are required upfront -
                </span>
                this is all discussed after the first lesson.
              </p>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-color">
                <h1 className="text-white">2</h1>
              </div>
              <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                We Assess
              </h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                We carefully assess your child to gain a clear understanding of
                their current level, strengths, and specific learning needs.
                Based on this, we create a tailored academic support plan
                designed to build confidence and foster continuous growth.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                Following the assessment, your child will be paired with a
                qualified tutor who provides structured, step-by-step guidance.
                Our tutors use engaging methods to make learning enjoyable while
                ensuring measurable academic progress.
              </p>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-color">
                <h1 className="text-white">3</h1>
              </div>
              <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                We Tutor
              </h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                We work with your child directly, providing lessons that are
                tailored to their unique needs and learning style.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                From the very first session, our focus is on building
                confidence, improving understanding, making learning enjoyable
                and bridging learning gaps.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
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
            setStep4(false);
            setStep5(true);
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
            {registerData.noOfStudents && registerData.noOfStudents !== "1" && (
              <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                First student details:
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
                  value={registerData.students[0].firstName}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      students: [
                        {
                          ...registerData.students[0],
                          firstName: e.target.value,
                        },
                        ...registerData.students.slice(1),
                      ],
                    })
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
                  value={registerData.students[0].lastName}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      students: [
                        {
                          ...registerData.students[0],
                          lastName: e.target.value,
                        },
                        ...registerData.students.slice(1),
                      ],
                    })
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  What school do they go to?{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={registerData.students[0].school}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      students: [
                        {
                          ...registerData.students[0],
                          school: e.target.value,
                        },
                        ...registerData.students.slice(1),
                      ],
                    })
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
                  value={registerData.students[0].grade}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      students: [
                        {
                          ...registerData.students[0],
                          grade: e.target.value,
                        },
                        ...registerData.students.slice(1),
                      ],
                    })
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

            {registerData.students[0].grade && (
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
                    registerData.students[0].grade
                  ) && (
                    <>
                      {[
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
                            registerData.students[0].subjectHelpNeeded?.includes(
                              subject
                            )
                              ? "bg-primary-color/20 border-primary-color"
                              : "border-gray-300 hover:border-primary-color/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-color focus:ring-primary-color mr-2"
                            checked={
                              registerData.students[0].subjectHelpNeeded?.includes(
                                subject
                              ) || false
                            }
                            onChange={(e) => {
                              const currentSubjects =
                                registerData.students[0].subjectHelpNeeded
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

                              setRegisterData({
                                ...registerData,
                                students: [
                                  {
                                    ...registerData.students[0],
                                    subjectHelpNeeded: newSubjects.join(","),
                                  },
                                  ...registerData.students.slice(1),
                                ],
                              });
                            }}
                          />
                          <span className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
                            {subject}
                          </span>
                        </label>
                      ))}
                    </>
                  )}

                  {/* Middle School (7-10) */}
                  {["7", "8", "9", "10"].includes(
                    registerData.students[0].grade
                  ) && (
                    <>
                      {[
                        "Yrs 7 - 10 General Support",
                        "Yrs 7 - 10 English",
                        "Yrs 7 - 10 Maths",
                        "Yrs 7 - 10 Science",
                        "NAPLAN Preparation",
                        "Selective School Preparation",
                      ].map((subject) => (
                        <label
                          key={subject}
                          className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                            registerData.students[0].subjectHelpNeeded?.includes(
                              subject
                            )
                              ? "bg-primary-color/20 border-primary-color"
                              : "border-gray-300 hover:border-primary-color/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-color focus:ring-primary-color mr-2"
                            checked={
                              registerData.students[0].subjectHelpNeeded?.includes(
                                subject
                              ) || false
                            }
                            onChange={(e) => {
                              const currentSubjects =
                                registerData.students[0].subjectHelpNeeded
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

                              setRegisterData({
                                ...registerData,
                                students: [
                                  {
                                    ...registerData.students[0],
                                    subjectHelpNeeded: newSubjects.join(","),
                                  },
                                  ...registerData.students.slice(1),
                                ],
                              });
                            }}
                          />
                          <span className="text-sm">{subject}</span>
                        </label>
                      ))}
                    </>
                  )}

                  {/* High School (11-12) */}
                  {["11", "12"].includes(registerData.students[0].grade) && (
                    <>
                      {[
                        "HSC or VCE English (Standard)",
                        "HSC or VCE English (Advanced)",
                        "HSC or VCE English Extension 1",
                        "HSC or VCE English Extension 2",
                        "HSC Maths (Standard)",
                        "HSC Maths (Advanced)",
                        "HSC Maths Extension 1",
                        "HSC Maths Extension 2",
                        "HSC General Support",
                        "HSC Chemistry",
                        "HSC Biology",
                        "HSC Physics",
                        "HSC Business Studies",
                        "HSC Legal Studies",
                        "HSC Economics",
                      ].map((subject) => (
                        <label
                          key={subject}
                          className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                            registerData.students[0].subjectHelpNeeded?.includes(
                              subject
                            )
                              ? "bg-primary-color/20 border-primary-color"
                              : "border-gray-300 hover:border-primary-color/50"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-primary-color focus:ring-primary-color mr-2"
                            checked={
                              registerData.students[0].subjectHelpNeeded?.includes(
                                subject
                              ) || false
                            }
                            onChange={(e) => {
                              const currentSubjects =
                                registerData.students[0].subjectHelpNeeded
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

                              setRegisterData({
                                ...registerData,
                                students: [
                                  {
                                    ...registerData.students[0],
                                    subjectHelpNeeded: newSubjects.join(","),
                                  },
                                  ...registerData.students.slice(1),
                                ],
                              });
                            }}
                          />
                          <span className="text-sm">{subject}</span>
                        </label>
                      ))}
                    </>
                  )}
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
                value={registerData.students[0].expectingResult}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    students: [
                      {
                        ...registerData.students[0],
                        expectingResult: e.target.value,
                      },
                      ...registerData.students.slice(1),
                    ],
                  })
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
                value={registerData.students[0].helpComment}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    students: [
                      {
                        ...registerData.students[0],
                        helpComment: e.target.value,
                      },
                      ...registerData.students.slice(1),
                    ],
                  })
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
                    className={`p-2 cursor-pointer rounded-md border ${registerData.students[0].currentPerformance === option ? "bg-primary-color/20 border-2 border-primary-color" : "bg-black/5"} border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]`}
                    onClick={() =>
                      setRegisterData({
                        ...registerData,
                        students: [
                          {
                            ...registerData.students[0],
                            currentPerformance: option,
                          },
                          ...registerData.students.slice(1),
                        ],
                      })
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
                    className={`p-2 rounded-md border ${registerData.students[0].schoolAttitude === option ? "bg-primary-color/20 border-2 border-primary-color" : "bg-black/5"} border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]`}
                    onClick={() =>
                      setRegisterData({
                        ...registerData,
                        students: [
                          {
                            ...registerData.students[0],
                            schoolAttitude: option,
                          },
                          ...registerData.students.slice(1),
                        ],
                      })
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
                      className={`p-2 rounded-md border ${registerData.students[0].mind === option ? "bg-primary-color/20 border-2 border-primary-color" : "bg-black/5"} border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]`}
                      onClick={() =>
                        setRegisterData({
                          ...registerData,
                          students: [
                            {
                              ...registerData.students[0],
                              mind: option,
                            },
                            ...registerData.students.slice(1),
                          ],
                        })
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
                    className={`p-2 rounded-md border ${registerData.students[0].personality === option ? "bg-primary-color/20 border-2 border-primary-color" : "bg-black/5"} border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]`}
                    onClick={() =>
                      setRegisterData({
                        ...registerData,
                        students: [
                          {
                            ...registerData.students[0],
                            personality: option,
                          },
                          ...registerData.students.slice(1),
                        ],
                      })
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
                      registerData.students[0].favouriteThingsToDo.split(",")[
                        index
                      ] || ""
                    }
                    onChange={(e) => {
                      const things =
                        registerData.students[0].favouriteThingsToDo.split(",");
                      things[index] = e.target.value;
                      setRegisterData({
                        ...registerData,
                        students: [
                          {
                            ...registerData.students[0],
                            favouriteThingsToDo: things
                              .join(",")
                              .replace(/^,|,$/g, ""),
                          },
                          ...registerData.students.slice(1),
                        ],
                      });
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

            <Button style="button">Next</Button>
          </div>
        </form>
      ) : step5 ? (
        <div>
          <div>
            <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
              First student availabilities:
            </h1>
            <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
              Please select all the days and times that could work for lessons.
              The more options you provide, the faster we will be able to
              organise the right class for you!
            </p>
          </div>

          <div className="flex flex-col gap-4 py-6">
            {[
              {
                id: 1,
                day: "Monday - Click to view times",
                times: [
                  { id: 1, time1: "Monday 07:00 AM", time2: "Monday 07:00" },
                  { id: 2, time1: "Monday 07:30 AM", time2: "Monday 07:30" },
                  { id: 3, time1: "Monday 02:00 PM", time2: "Monday 14:00" },
                  { id: 4, time1: "Monday 02:30 PM", time2: "Monday 14:30" },
                  { id: 5, time1: "Monday 03:00 PM", time2: "Monday 15:00" },
                  { id: 6, time1: "Monday 03:30 PM", time2: "Monday 15:30" },
                  { id: 7, time1: "Monday 04:00 PM", time2: "Monday 16:00" },
                  { id: 8, time1: "Monday 04:30 PM", time2: "Monday 16:30" },
                  { id: 9, time1: "Monday 05:00 PM", time2: "Monday 17:00" },
                  { id: 10, time1: "Monday 05:30 PM", time2: "Monday 17:30" },
                  { id: 11, time1: "Monday 06:00 PM", time2: "Monday 18:00" },
                  { id: 12, time1: "Monday 06:30 PM", time2: "Monday 18:30" },
                  { id: 13, time1: "Monday 07:00 PM", time2: "Monday 19:00" },
                  { id: 14, time1: "Monday 07:30 PM", time2: "Monday 19:30" },
                ],
              },
              {
                id: 2,
                day: "Tuesday - Click to view times",
                times: [
                  { id: 1, time1: "Tuesday 07:00 AM", time2: "Tuesday 07:00" },
                  { id: 2, time1: "Tuesday 07:30 AM", time2: "Tuesday 07:30" },
                  { id: 3, time1: "Tuesday 02:00 PM", time2: "Tuesday 14:00" },
                  { id: 4, time1: "Tuesday 02:30 PM", time2: "Tuesday 14:30" },
                  { id: 5, time1: "Tuesday 03:00 PM", time2: "Tuesday 15:00" },
                  { id: 6, time1: "Tuesday 03:30 PM", time2: "Tuesday 15:30" },
                  { id: 7, time1: "Tuesday 04:00 PM", time2: "Tuesday 16:00" },
                  { id: 8, time1: "Tuesday 04:30 PM", time2: "Tuesday 16:30" },
                  { id: 9, time1: "Tuesday 05:00 PM", time2: "Tuesday 17:00" },
                  { id: 10, time1: "Tuesday 05:30 PM", time2: "Tuesday 17:30" },
                  { id: 11, time1: "Tuesday 06:00 PM", time2: "Tuesday 18:00" },
                  { id: 12, time1: "Tuesday 06:30 PM", time2: "Tuesday 18:30" },
                  { id: 13, time1: "Tuesday 07:00 PM", time2: "Tuesday 19:00" },
                  { id: 14, time1: "Tuesday 07:30 PM", time2: "Tuesday 19:30" },
                ],
              },
              {
                id: 3,
                day: "Wednessday - Click to view times",
                times: [
                  {
                    id: 1,
                    time1: "Wednessday 07:00 AM",
                    time2: "Wednessday 07:00",
                  },
                  {
                    id: 2,
                    time1: "Wednessday 07:30 AM",
                    time2: "Wednessday 07:30",
                  },
                  {
                    id: 3,
                    time1: "Wednesday 02:00 PM",
                    time2: "Wednesday 14:00",
                  },
                  {
                    id: 4,
                    time1: "Wednesday 02:30 PM",
                    time2: "Wednesday 14:30",
                  },
                  {
                    id: 5,
                    time1: "Wednesday 03:00 PM",
                    time2: "Wednesday 15:00",
                  },
                  {
                    id: 6,
                    time1: "Wednesday 03:30 PM",
                    time2: "Wednesday 15:30",
                  },
                  {
                    id: 7,
                    time1: "Wednesday 04:00 PM",
                    time2: "Wednesday 16:00",
                  },
                  {
                    id: 8,
                    time1: "Wednesday 04:30 PM",
                    time2: "Wednesday 16:30",
                  },
                  {
                    id: 9,
                    time1: "Wednesday 05:00 PM",
                    time2: "Wednesday 17:00",
                  },
                  {
                    id: 10,
                    time1: "Wednesday 05:30 PM",
                    time2: "Wednesday 17:30",
                  },
                  {
                    id: 11,
                    time1: "Wednesday 06:00 PM",
                    time2: "Wednesday 18:00",
                  },
                  {
                    id: 12,
                    time1: "Wednesday 06:30 PM",
                    time2: "Wednesday 18:30",
                  },
                  {
                    id: 13,
                    time1: "Wednesday 07:00 PM",
                    time2: "Wednesday 19:00",
                  },
                  {
                    id: 14,
                    time1: "Wednesday 07:30 PM",
                    time2: "Wednesday 19:30",
                  },
                ],
              },
              {
                id: 4,
                day: "Thursday - Click to view times",
                times: [
                  {
                    id: 1,
                    time1: "Thursday 07:00 AM",
                    time2: "Thursday 07:00",
                  },
                  {
                    id: 2,
                    time1: "Thursday 07:30 AM",
                    time2: "Thursday 07:30",
                  },
                  {
                    id: 3,
                    time1: "Thursday 02:00 PM",
                    time2: "Thursday 14:00",
                  },
                  {
                    id: 4,
                    time1: "Thursday 02:30 PM",
                    time2: "Thursday 14:30",
                  },
                  {
                    id: 5,
                    time1: "Thursday 03:00 PM",
                    time2: "Thursday 15:00",
                  },
                  {
                    id: 6,
                    time1: "Thursday 03:30 PM",
                    time2: "Thursday 15:30",
                  },
                  {
                    id: 7,
                    time1: "Thursday 04:00 PM",
                    time2: "Thursday 16:00",
                  },
                  {
                    id: 8,
                    time1: "Thursday 04:30 PM",
                    time2: "Thursday 16:30",
                  },
                  {
                    id: 9,
                    time1: "Thursday 05:00 PM",
                    time2: "Thursday 17:00",
                  },
                  {
                    id: 10,
                    time1: "Thursday 05:30 PM",
                    time2: "Thursday 17:30",
                  },
                  {
                    id: 11,
                    time1: "Thursday 06:00 PM",
                    time2: "Thursday 18:00",
                  },
                  {
                    id: 12,
                    time1: "Thursday 06:30 PM",
                    time2: "Thursday 18:30",
                  },
                  {
                    id: 13,
                    time1: "Thursday 07:00 PM",
                    time2: "Thursday 19:00",
                  },
                  {
                    id: 14,
                    time1: "Thursday 07:30 PM",
                    time2: "Thursday 19:30",
                  },
                ],
              },
              {
                id: 5,
                day: "Friday - Click to view times",
                times: [
                  { id: 1, time1: "Friday 07:00 AM", time2: "Friday 07:00" },
                  { id: 2, time1: "Friday 07:30 AM", time2: "Friday 07:30" },
                  {
                    id: 3,
                    time1: "Friday 02:00 PM",
                    time2: "Friday 14:00",
                  },
                  {
                    id: 4,
                    time1: "Friday 02:30 PM",
                    time2: "Friday 14:30",
                  },
                  {
                    id: 5,
                    time1: "Friday 03:00 PM",
                    time2: "Friday 15:00",
                  },
                  {
                    id: 6,
                    time1: "Friday 03:30 PM",
                    time2: "Friday 15:30",
                  },
                  {
                    id: 7,
                    time1: "Friday 04:00 PM",
                    time2: "Friday 16:00",
                  },
                  {
                    id: 8,
                    time1: "Friday 04:30 PM",
                    time2: "Friday 16:30",
                  },
                  {
                    id: 9,
                    time1: "Friday 05:00 PM",
                    time2: "Friday 17:00",
                  },
                  {
                    id: 10,
                    time1: "Friday 05:30 PM",
                    time2: "Friday 17:30",
                  },
                  {
                    id: 11,
                    time1: "Friday 06:00 PM",
                    time2: "Friday 18:00",
                  },
                  {
                    id: 12,
                    time1: "Friday 06:30 PM",
                    time2: "Friday 18:30",
                  },
                  {
                    id: 13,
                    time1: "Friday 07:00 PM",
                    time2: "Friday 19:00",
                  },
                  {
                    id: 14,
                    time1: "Friday 07:30 PM",
                    time2: "Friday 19:30",
                  },
                ],
              },
              {
                id: 6,
                day: "Saturday - Click to view times",
                times: [
                  {
                    id: 1,
                    time1: "Saturday 07:30 AM",
                    time2: "Saturday 07:30",
                  },
                  {
                    id: 2,
                    time1: "Saturday 09:00 AM",
                    time2: "Saturday 09:00",
                  },
                  {
                    id: 3,
                    time1: "Saturday 10:30 AM",
                    time2: "Saturday 10:30",
                  },
                  {
                    id: 4,
                    time1: "Saturday 12:00 PM",
                    time2: "Saturday 12:00",
                  },
                  {
                    id: 5,
                    time1: "Saturday 01:15 PM",
                    time2: "Saturday 13:15",
                  },
                  {
                    id: 6,
                    time1: "Saturday 02:30 PM",
                    time2: "Saturday 14:30",
                  },
                  {
                    id: 7,
                    time1: "Saturday 03:50 PM",
                    time2: "Saturday 15:50",
                  },
                  {
                    id: 8,
                    time1: "Saturday 05:10 PM",
                    time2: "Saturday 17:10",
                  },
                  {
                    id: 9,
                    time1: "Saturday 06:30 PM",
                    time2: "Saturday 18:30",
                  },
                  {
                    id: 10,
                    time1: "Saturday 07:45 PM",
                    time2: "Saturday 19:45",
                  },
                ],
              },
              {
                id: 7,
                day: "Sunday - Click to view times",
                times: [
                  {
                    id: 1,
                    time1: "Sunday 07:30 AM",
                    time2: "Sunday 07:30",
                  },
                  {
                    id: 2,
                    time1: "Sunday 09:00 AM",
                    time2: "Sunday 09:00",
                  },
                  {
                    id: 3,
                    time1: "Sunday 10:30 AM",
                    time2: "Sunday 10:30",
                  },
                  {
                    id: 4,
                    time1: "Sunday 12:00 PM",
                    time2: "Sunday 12:00",
                  },
                  {
                    id: 5,
                    time1: "Sunday 01:15 PM",
                    time2: "Sunday 13:15",
                  },
                  {
                    id: 6,
                    time1: "Sunday 02:30 PM",
                    time2: "Sunday 14:30",
                  },
                  {
                    id: 7,
                    time1: "Sunday 03:50 PM",
                    time2: "Sunday 15:50",
                  },
                  {
                    id: 8,
                    time1: "Sunday 05:10 PM",
                    time2: "Sunday 17:10",
                  },
                  {
                    id: 9,
                    time1: "Sunday 06:30 PM",
                    time2: "Sunday 18:30",
                  },
                  {
                    id: 10,
                    time1: "Sunday 07:45 PM",
                    time2: "Sunday 19:45",
                  },
                ],
              },
            ].map((item) => (
              <div key={item.id}>
                <div
                  onClick={() => toggleDay(item.id)}
                  className="flex flex-col gap-2 cursor-pointer border border-gray-300 p-2 transition-all duration-200"
                >
                  <h1 className="md:text-[11px] lg:text-[13px] xl:text-[14px]">
                    {item.day}
                  </h1>
                </div>
                {openDays[item.id] && (
                  <div className="mt-2 pl-4 space-y-2 flex flex-wrap justify-center gap-2">
                    {item.times.map((time) => (
                      <div
                        key={time.id}
                        className="w-[150px] h-[100px] border border-gray-300 p-1 flex flex-col"
                      >
                        <div className="flex flex-col items-center justify-center gap-1 bg-black/5 grow-1 ">
                          <input
                            type="radio"
                            id={`time-${item.id}-${time.id}`}
                            className="rounded border-gray-300 "
                          />
                          <label
                            htmlFor={`time-${item.id}-${time.id}`}
                            className="md:text-[10px] lg:text-[12px] xl:text-[13px] font-bold"
                          >
                            {time.time1}
                          </label>
                        </div>
                        <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] p-2 text-center">
                          {time.time2}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="" className="text-[12px]  font-medium">
              When would you like to start?{" "}
              <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={registerData.parentFirstName}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  parentFirstName: e.target.value,
                })
              }
              className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
            >
              <option value="">Select</option>
              <option value="">As soon as possible</option>
              <option value="">At a later date</option>
            </select>
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
      ) : step6 ? (
        <div>
          <h1>How would you like to have the lessons? *</h1>
          <p>face to face </p>
          <p>Online</p>
        </div>
      ) : step7 ? (
        <div>
          <h1>
            Our commitment to you: We know this is the start of something
            amazing for both you and your child. Greater confidence, focus,
            enthusiasm – and of course, academic success, are all just around
            the corner. We are 100% committed to bringing out the best in your
            child and helping them perform at their full potential. Once you hit
            the button below we will review your details and begin working with
            our team of incredible tutors to pair up the perfect mentor for your
            child. We know that one day you’ll look back on this moment right
            here and be so glad you made this choice.
          </h1>
          <button>Let's do this </button>
        </div>
      ) : (
        <div>
          <h1>stepppp</h1>
        </div>
      )}
    </div>
  );
}

export default Register;
