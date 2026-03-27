/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import apiList from "@/apiList";

type Phase = "idle" | "loading" | "success";

export type NewsletterSettings = {
  title?: string;
  subtitle?: string;
  shortBlurb?: string;
  longText?: string;
  buttonLabel?: string;
};

type NewsletterProps = {
  settings?: NewsletterSettings | null;
};

export default function Newsletter({ settings }: NewsletterProps) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [email, setEmail] = useState("");

  const normalized = email.trim().toLowerCase();
  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValid) {
      toast.error("Please enter a valid email.", { theme: "dark" });
      return;
    }

    setPhase("loading");

    try {
      const res = await fetch(apiList.newsletter.subscribe, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalized, source: "website-home" }),
      });

      const data = await res.json().catch(() => ({} as any));

      if (data?.already) {
        toast.info("You’re already subscribed ✅", { theme: "dark" });
        setPhase("idle");
        return;
      }

      if (!res.ok) {
        throw new Error(data?.message || "Failed to subscribe.");
      }

      toast.success("Subscribed! 🎉", { theme: "dark" });
      setPhase("success");

      setTimeout(() => {
        setEmail("");
        setPhase("idle");
      }, 1600);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Something went wrong. Please try again.", {
        theme: "dark",
      });
      setPhase("idle");
    }
  };

  const title = settings?.title || "Subscribe to\nMy Newsletter!";
  const subtitle =
    settings?.shortBlurb ||
    settings?.subtitle ||
    "Stay updated on my latest shows and events.";
  const longText =
    settings?.longText ||
    "I use this newsletter to share the most actionable tips from my journey, and the stories behind the shows. Get all the things that truly matter—communication strategies, real-world insights, and moments of sincere humor—delivered straight to your inbox.";
  const buttonLabel = settings?.buttonLabel || "Subscribe";

  return (
    <>
      <ToastContainer
        position='bottom-right'
        closeOnClick
        pauseOnHover
        theme='dark'
      />

      <section className='site-shell mt-[60px]'>
        <div className='mx-auto w-full max-w-[1100px] rounded-[28px] bg-[#4304A2] p-7 md:p-[60px]'>
          <div className='grid items-center gap-2 md:grid-cols-2 md:gap-8'>
            <div>
              <h2 className='recoleta whitespace-pre-line text-[32px] font-bold leading-tight text-[#FFD928] md:text-[36px]'>
                {title}
              </h2>
              <p className='elza mt-4 max-w-[250px] text-[12px] leading-6 text-white/90 md:text-[14px]'>
                {subtitle}
              </p>
            </div>

            <div>
              <p className='elza max-w-md text-[12px] leading-6 text-white/90 md:text-[14px]'>
                {longText}
              </p>

              <form
                className='mt-3 flex flex-col gap-3'
                method='post'
                onSubmit={onSubmit}
              >
                <input
                  type='email'
                  required
                  placeholder='Your email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='
                    block w-full max-w-xs rounded-full bg-white/90 px-4 py-2
                    text-[12px] text-[#121212] placeholder:text-zinc-500 outline-none
                    ring-1 ring-white/50 focus:ring-2 focus:ring-white/80
                    md:w-[400px] md:text-[14px]
                  '
                  disabled={phase === "loading"}
                />

                <div className='flex justify-center lg:block lg:justify-start'>
                  <button
                    type='submit'
                    className='
                      block h-10 w-[80px] max-w-xs rounded-full bg-[#FFD928]
                      text-[12px] font-bold text-[#121212]
                      shadow-[0_8px_16px_rgba(0,0,0,.2)] hover:brightness-105
                      md:w-[240px] md:text-[16px]
                    '
                    disabled={phase === "loading"}
                    aria-label={
                      phase === "loading" ? "Subscribing" : buttonLabel
                    }
                  >
                    {phase === "loading" ? (
                      <span className='inline-flex items-center justify-center gap-2'>
                        <Spinner /> Subscribing…
                      </span>
                    ) : (
                      buttonLabel
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/* Spinner icon */
function Spinner() {
  return (
    <svg
      className='h-4 w-4 animate-spin'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <circle
        cx='12'
        cy='12'
        r='10'
        stroke='currentColor'
        strokeWidth='4'
        fill='none'
        opacity='0.25'
      />
      <path
        d='M22 12a10 10 0 0 0-10-10'
        stroke='currentColor'
        strokeWidth='4'
        fill='none'
      />
    </svg>
  );
}
