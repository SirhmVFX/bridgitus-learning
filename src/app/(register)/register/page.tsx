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

  return (
    <div>
      {step1 ? (
        <div className="flex flex-col items-center gap-10">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
              Book your first lesson with a Bridgitus tutor
            </h1>
            <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
              Our booking process is super easy and will just take a few
              minutes:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2 items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-color">
                <h1 className="text-white">1</h1>
              </div>
              <h1>You book</h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                Let us know about you, your child and how we can help.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                We want to learn as much as we can about your child and what has
                bought you to us - the more detailed you can be, the better our
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
              <h1>We match</h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                We talk with our team to organise a tutor that best matches your
                child&apos;s needs.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                Once we&apos;ve confirmed the first lesson, we&apos;ll send you
                through their profile by email and they&apos;ll give you a call
                to introduce themselves.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                We get most students paired up with a tutor within 72 hours, but
                we&apos;ll keep you updated if there are delays.
              </p>
            </div>

            <div className="flex flex-col gap-2 items-center">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary-color">
                <h1 className="text-white">3</h1>
              </div>
              <h1>The magic happens.</h1>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                The first lesson arrives!
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                This lesson is designed for your tutor to see how your child is
                currently doing - so they&apos;ll come prepared with our first
                session assessment to go through.
              </p>
              <p className="md:text-[10px] lg:text-[12px] xl:text-[13px] text-center">
                We&apos;ll check in with you after the session - you can
                schedule in your next lesson and submit payment information
                easily from there.
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
              First up, who are we organising a tutor for?
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
            (registerData.organizingFor === "someone-else" && (
              <div>
                <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
                  Your details
                </h1>
                <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
                  (This is you, the parent or carer - we will ask more about
                  your child next)
                </p>
              </div>
            ))}

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
        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="" className="text-[12px]  font-medium">
                One Student
              </label>
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
            </div>

            <div>
              <label htmlFor="" className="text-[12px]  font-medium">
                Two Students
              </label>
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
            </div>

            <div>
              <label htmlFor="" className="text-[12px]  font-medium">
                Three Students
              </label>
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
                  Student first name: *
                </label>
                <input
                  type="text"
                  placeholder="Enter your first name"
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      organizingFor: e.target.value,
                    })
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  Student last name: *
                </label>
                <input
                  type="text"
                  placeholder="Enter your last name"
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      organizingFor: e.target.value,
                    })
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  What school do they go to?
                </label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      organizingFor: e.target.value,
                    })
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="" className="text-[12px]  font-medium">
                  What grade are they in? *
                </label>
                <select
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      organizingFor: e.target.value,
                    })
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                >
                  <option value="">Pre-K</option>
                  <option value="">K</option>
                  <option value="">1</option>
                  <option value="">2</option>
                  <option value="">3</option>
                  <option value="">4</option>
                  <option value="">5</option>
                  <option value="">6</option>
                  <option value="">7</option>
                  <option value="">8</option>
                  <option value="">9</option>
                  <option value="">10</option>
                  <option value="">11</option>
                  <option value="">12</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                What subject do they need support in? *
              </label>
              <select
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    organizingFor: e.target.value,
                  })
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
              >
                <option value="">Math</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                What is the main result you are looking for? *
              </label>
              <select
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    organizingFor: e.target.value,
                  })
                }
                className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
              >
                <option value="">Get better at school</option>
                <option value="">Boost confidence</option>
                <option value="">Enjoy the learning experience</option>
                <option value="">A mix of all</option>
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
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    organizingFor: e.target.value,
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
                How can we help?
              </label>
              <div className="flex gap-2">
                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  Struggling at school
                </button>
                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  Excelling at school
                </button>

                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  Somewhere in between
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                How would you describe their attitude towards school?
              </label>
              <div className="flex gap-2">
                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  They love school
                </button>
                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  They dislike school
                </button>

                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  Somewhere in between
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                How would you describe their mind?
              </label>
              <div className="flex gap-2">
                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  Creative
                </button>
                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  Analytical
                </button>

                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  Somewhere in between
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                How would you describe their personality?
              </label>
              <div className="flex gap-2">
                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  Shy
                </button>
                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  Outgoing
                </button>

                <button className="p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px] bg-black/5">
                  Somewhere in between
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="" className="text-[12px]  font-medium">
                What are their 3 favourite things to do (ie. video games,
                soccer, swimming)
              </label>
              <div className="grid md:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Enter your first name"
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      organizingFor: e.target.value,
                    })
                  }
                  className="w-full bg-transparent p-2 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px"
                />
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

            <Button
              style="button"
              onClick={() => {
                setStep4(false);
                setStep5(true);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      ) : step5 ? (
        <div>
          <div>
            <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
              First student availabilities:
            </h1>
            <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
              Please select all the days and times that could work for lessons.
              The more options you provide, the faster we will be able to
              organise the right tutor for you!
            </p>
          </div>

          {[
            {
              id: 1,
              day: "Monday - Click to view times",
              times: [
                { id: 1, time1: "Monday 07:00 AM", time2: "Monday 07:00" },
                { id: 2, time1: "Monday 07:30 AM", time2: "Monday 07:30" },
              ],
            },
            {
              id: 2,
              day: "Tuesday - Click to view times",
              times: [
                { id: 1, time1: "Tuesday 07:00 AM", time2: "Tuesday 07:00" },
                { id: 2, time1: "Tuesday 07:30 AM", time2: "Tuesday 07:30" },
              ],
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => toggleDay(item.id)}
              className="flex flex-col gap-2"
            >
              <h1>{item.day}</h1>
              {openDays[item.id] && (
                <div className="mt-2 pl-4 space-y-2">
                  {item.times.map((time) => (
                    <div key={time.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`time-${item.id}-${time.id}`}
                        className="rounded border-gray-300"
                      />
                      <label
                        htmlFor={`time-${item.id}-${time.id}`}
                        className="text-sm"
                      >
                        {time.time1}
                      </label>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
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
