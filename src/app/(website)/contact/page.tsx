"use client";

import Button from "@/components/Button";
import Link from "next/link";
import { useState } from "react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    agree: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.agree) {
      setSubmitStatus({
        success: false,
        message: "Please agree to the privacy policy",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({
          success: true,
          message: "Message sent successfully! We'll get back to you soon.",
        });
        // Reset form
        setFormData({
          name: "",
          email: "",
          message: "",
          agree: false,
        });
      } else {
        throw new Error(data.message || "Failed to send message");
      }
    } catch (error) {
      setSubmitStatus({
        success: false,
        message: "Failed to send message. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main>
      {/* <section className="  relative  flex items-center justify-center md:h-[250px] lg:h-[300px] xl:h-[400px] h-[300px] ">
        <Image
          src="/assets/line2.png"
          alt="cta"
          width={1000}
          height={1000}
          className="w-full h-full object-cover absolute top-0 left-0 bottom-0"
        />

        <div className="flex flex-col gap-5 items-center justify-center absolute top-0 left-0 bottom-0 right-0 pt-20 ">
          <h1 className="md:w-2/3 text-2xl md:text-5xl text-white text-center">
            Get In Touch with us
          </h1>
          <p className="text-sm md:text-lg text-white/50">
            Let&apos;s build success together
          </p>
        </div>
      </section> */}

      <section
        id="contact"
        className="md:pt-32 lg:pt:40 xl:pt-52 bg-background pt-28"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center flex flex-col gap-4">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                📞 Contact Us
              </h2>
              <p className="text-lg text-black/70 mb-12">
                Ready to start your learning journey? Reach out to us for more
                information or to schedule a session!
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="p-6 rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300">
                <div className="text-3xl mb-4">📧</div>
                <h3 className="font-semibold text-foreground mb-2">Email</h3>
                <p className="text-black/70">info@bridgitus.com</p>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="font-semibold text-foreground mb-2">Phone</h3>
                <a
                  href="tel:+61433600592"
                  className="text-black/70 hover:text-primary transition-colors cursor-pointer"
                >
                  +61 433 600 592
                </a>
              </div>
              <div className="p-6 rounded-2xl bg-card border border-black/10 hover:shadow-elegant transition-all duration-300">
                <div className="text-3xl mb-4">☎️</div>
                <h3 className="font-semibold text-foreground mb-2">
                  Alternate Phone
                </h3>
                <a
                  href="tel:+61402173788"
                  className="text-black/70 hover:text-primary transition-colors cursor-pointer"
                >
                  +61 402 173 788
                </a>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4 items-start mt-8"
            >
              <h1 className="text-xl font-medium">Leave us your info </h1>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent p-4 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]"
                placeholder="Your Name"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent p-4 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]"
                placeholder="Your Email"
                required
              />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent p-4 rounded-md border border-gray-300 md:text-[10px] lg:text-[12px] xl:text-[13px]"
                placeholder="Your Message"
                rows={5}
                required
              ></textarea>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="agree"
                  checked={formData.agree as boolean}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                <label htmlFor="agree">
                  You agree to our friendly{" "}
                  <Link href="/privacy-policy" className="text-primary-color">
                    privacy policy
                  </Link>
                </label>
              </div>
              <Button style="button" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
              {submitStatus && (
                <div
                  className={`mt-2 text-sm ${submitStatus.success ? "text-green-600" : "text-red-600"}`}
                >
                  {submitStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      <div>
        {/* <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto p-4 mx-auto pt-24 md:py-32 md:flex items-center gap-4">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-medium md:w-1/2">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-gray-500 text-base md:text-lg md:w-1/2">
            Have questions, suggestions, or want to partner with us? Reach out
            today and let’s work together to make a difference!
          </p>
        </div> */}

        <div className="md:w-[800px] lg:w-[1000px] xl:w-[1250px] md:mx-auto mx-auto py-4  items-center gap-4">
          <div className=" flex md:flex-row flex-col gap-8 p-6 rounded-lg w-full md:w-2/3 mx-auto"></div>
        </div>
      </div>
    </main>
  );
}

export default Contact;
