/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Newsletter from "../section/newsletter";
import apiList from "../../apiList";

type FormState = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export default function ConnectPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(null);
    setErrorMsg(null);

    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setErrorMsg("Name, email, and message are required.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(apiList.contact.create, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          subject: form.subject.trim() || undefined,
          message: form.message.trim(),
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          message?: string;
        } | null;
        throw new Error(data?.message || "Failed to submit your message.");
      }

      setSuccessMsg("Thanks! Your message has been submitted.");
      setForm({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (err: any) {
      console.error("Contact submit error:", err);
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className='min-h-screen text-white'>
      <section className='site-shell py-10 md:py-14 lg:py-16'>
        <div className='grid gap-10 lg:grid-cols-12 lg:gap-12'>
          <div className='lg:col-span-5'>
            <h1 className='recoleta mb-4 text-[clamp(2.25rem,6vw,3rem)] font-extrabold leading-[0.95] text-white md:mb-6'>
              Let's Connect
            </h1>

            <div className='elza mb-6 max-w-[34rem] text-[15px] leading-7 text-white/92 md:mb-8 md:text-[22px] md:leading-9 [&>p]:m-0 [&>p+p]:mt-1'>
              <p>Got an idea?</p>
              <p>A brand collaboration?</p>
              <p>Or a speaking engagement?</p>
              <p>Let's talk.</p>
              <p>I'm always ready to create something awesome together.</p>
            </div>

            <div className='mt-4 flex w-full max-w-[24rem] items-center gap-4 pt-2 md:mt-6 md:gap-5'>
              <div className='relative h-16 w-16 shrink-0 overflow-hidden rounded-full sm:h-18 sm:w-18'>
                <Image
                  src='/assets/avatar.png'
                  alt='Support avatar'
                  fill
                  sizes='(max-width: 640px) 64px, 72px'
                  className='object-cover'
                />
              </div>

              <div className='leading-[1.2] [&>p]:m-0 [&>p+p]:mt-1'>
                <p className='elza text-sm text-white/90'>For any kind of query</p>
                <p className='elza text-[15px] font-semibold text-white sm:text-lg md:text-2xl'>
                  Yousha Kabir
                </p>
                <p className='elza text-sm text-white/80 sm:text-[15px]'>Manager</p>
                <p className='elza text-sm font-bold text-white sm:text-[15px]'>
                  info@rafsansabab.com
                </p>
              </div>
            </div>
          </div>

          <div className='lg:col-span-7'>
            <div
              className='w-full max-w-[560px] rounded-[28px] p-6 ring-1 ring-white/10 shadow-2xl sm:p-7 md:ml-auto md:p-8'
              style={{
                background:
                  "radial-gradient(50% 50% at 50% 50%, #000000 0%, #121212 100%)",
              }}
            >
              <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit}>
                <Field label='Name'>
                  <Input
                    placeholder='Enter Your Name'
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                  />
                </Field>

                <Field label='Email'>
                  <Input
                    type='email'
                    placeholder='Enter Your Email'
                    value={form.email}
                    onChange={handleChange("email")}
                    required
                  />
                </Field>

                <Field label='Phone Number'>
                  <Input
                    placeholder='Enter Your Phone Number'
                    value={form.phone}
                    onChange={handleChange("phone")}
                  />
                </Field>

                <Field label='Subject'>
                  <Input
                    placeholder='Enter Subject'
                    value={form.subject}
                    onChange={handleChange("subject")}
                  />
                </Field>

                <Field label='Message'>
                  <Textarea
                    placeholder='Your Message'
                    className='min-h-[96px]'
                    value={form.message}
                    onChange={handleChange("message")}
                    required
                  />
                </Field>

                {(successMsg || errorMsg) && (
                  <div className='pt-1 text-center'>
                    {successMsg && (
                      <p className='text-sm text-emerald-300 md:text-[15px]'>
                        {successMsg}
                      </p>
                    )}
                    {errorMsg && (
                      <p className='text-sm text-red-400 md:text-[15px]'>
                        {errorMsg}
                      </p>
                    )}
                  </div>
                )}

                <div className='flex justify-center pt-2 md:pt-3'>
                  <button
                    type='submit'
                    disabled={submitting}
                    className={`inline-flex h-11 items-center justify-center rounded-full bg-[#FFD928] px-5 text-sm font-bold text-black transition hover:bg-[#ffd10a] md:h-12 md:px-6 md:text-base ${
                      submitting ? "cursor-not-allowed opacity-70" : ""
                    }`}
                  >
                    <Image
                      src='/assets/Icon.png'
                      alt='rocket'
                      width={20}
                      height={20}
                      className='mr-2'
                    />
                    {submitting ? "Sending..." : "Drop it!"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className='relative mt-10 h-px w-full md:mt-16'>
        <span className='absolute left-0 top-0 h-0.5 w-full bg-[linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(0,216,255,0.8)_50%,rgba(0,0,0,0)_100%)]' />
      </div>

      <section>
        <div className='my-8 md:my-10'>
          <Newsletter />
        </div>
      </section>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className='block'>
      <span className='mb-1.5 block text-[12px] leading-[17px] text-[#A2AEC0] md:text-[13px]'>
        {label}
      </span>
      {children}
    </label>
  );
}

function Input({
  className = "",
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...rest}
      className={[
        "h-11 w-full rounded-xl border border-white/20 bg-transparent px-4 text-[14px] leading-6 text-white outline-none transition placeholder:text-[#6E7B92] focus:border-cyan-400 md:h-12 md:text-[16px]",
        className,
      ].join(" ")}
    />
  );
}

function Textarea({
  className = "",
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...rest}
      className={[
        "w-full resize-none rounded-xl border border-white/20 bg-transparent px-4 py-3 text-[14px] leading-6 text-white outline-none transition placeholder:text-[#6E7B92] focus:border-cyan-400 md:text-[16px]",
        className,
      ].join(" ")}
    />
  );
}
