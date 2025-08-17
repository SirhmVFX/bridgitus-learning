"use client";

import Button from "@/components/Button";
import { useState } from "react";

function Register() {
  const [step1, setStep1] = useState(true);
  const [step2, setStep2] = useState(false);
  const [step3, setStep3] = useState(false);
  const [step4, setStep4] = useState(false);

  return (
    <div>
      {step1 ? (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="md:text-[20px] lg:text-[22px] xl:text-[24px] font-bold">
              Book your first lesson with a Bridgitus tutor
            </h1>
            <p className="md:text-[10px] lg:text-[12px] xl:text-[13px]">
              Our booking process is super easy and will just take a few
              minutes:
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
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
            type="button"
            onClick={() => (setStep1(false), () => setStep2(true))}
          >
            Get Started
          </Button>
        </div>
      ) : step2 ? (
        <div>
          <h1>Step 2</h1>
        </div>
      ) : step3 ? (
        <div>
          <h1>Step 3</h1>
        </div>
      ) : step4 ? (
        <div>
          <h1>Step 4</h1>
        </div>
      ) : (
        <div>
          <h1>Step 1</h1>
        </div>
      )}
    </div>
  );
}

export default Register;
