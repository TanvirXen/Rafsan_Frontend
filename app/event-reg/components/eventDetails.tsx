/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React from "react";
import apiList from "@/apiList";

function IconBadge({ src, alt }: { src: string; alt: string }) {
  return (
    <span className='inline-flex h-8 w-8 items-center justify-center -mt-0.5 sm:h-9 sm:w-9'>
      <Image src={src} alt={alt} width={24} height={24} />
    </span>
  );
}

type CustomField = {
  id?: string;
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "number" | "select" | "textarea";
  required?: boolean;
  options?: string[];
};

type Props = {
  /** required to register against a real event */
  eventId: string;
  /** NEW: which occurrence (date) the user is registering for */
  eventDateISO?: string;

  primaryDate?: string;
  timeText?: string;
  venue?: string;
  notes?: string[];

  /** When provided, the form below is rendered dynamically from these fields */
  customFields?: CustomField[];
};

export default function EventDetailsSection({
  eventId,
  eventDateISO,
  primaryDate,
  timeText,
  venue,
  notes = [
    "Limited seats available; early booking recommended.",
    "Doors open 1 hour before recording starts.",
    "Audience must be 16+ (younger attendees allowed with guardians).",
    "No outside recording devices allowed inside.",
    "T&C apply.",
  ],
  customFields = [],
}: Props) {
  // Normalize custom fields (stable ids + defaults)
  const fields = React.useMemo<Required<CustomField>[]>(() => {
    const mkId = () => `${Math.random().toString(36).slice(2)}-${Date.now()}`;
    return (customFields || []).map((f) => ({
      id: f.id || mkId(),
      name: f.name || "",
      label: f.label || f.name || "Field",
      type: (f.type || "text") as CustomField["type"],
      required: !!f.required,
      options: Array.isArray(f.options) ? f.options.filter(Boolean) : [],
    }));
  }, [customFields]);

  // Fallback defaults (when no customFields provided)
  const useDynamic = fields.length > 0;

  // State for dynamic OR fallback fields
  const [form, setForm] = React.useState<Record<string, string>>(() => {
    if (fields.length > 0) {
      const init: Record<string, string> = {};
      for (const f of fields) init[f.name] = "";
      return init;
    }
    // fallback defaults
    return { name: "", email: "", phone: "" };
  });

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  // Keep state keys in sync if fields prop changes later
  React.useEffect(() => {
    if (useDynamic) {
      setForm((prev) => {
        const next: Record<string, string> = {};
        for (const f of fields) next[f.name] = prev[f.name] ?? "";
        return next;
      });
    }
  }, [useDynamic, fields]);

  function validateFallback() {
    const name = (form["name"] || "").trim();
    const email = (form["email"] || "").trim();
    const phone = (form["phone"] || "").trim();
    if (!name) return "Please enter your name.";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return "Please enter a valid email.";
    if (!phone) return "Please enter your phone number.";
    return null;
  }

  function validateDynamic() {
    for (const f of fields) {
      const val = String(form[f.name] ?? "").trim();
      if (f.required && !val) {
        return `Please fill "${f.label}".`;
      }
      if (
        val &&
        f.type === "email" &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
      ) {
        return `Please enter a valid email for "${f.label}".`;
      }
    }
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const v = useDynamic ? validateDynamic() : validateFallback();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(apiList.registrations.list, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId,
          occurrenceDate: eventDateISO, // keep your existing payload shape
          fields: form, // dynamic or fallback fields map
        }),
      });

      if (!res.ok) {
        let msg = `Registration failed (HTTP ${res.status}).`;
        try {
          const j = await res.json();
          if (j?.message) msg = j.message;
        } catch {}
        throw new Error(msg);
      }

      setSuccess(true);
      // clear values
      setForm((prev) => {
        const cleared: Record<string, string> = {};
        for (const k of Object.keys(prev)) cleared[k] = "";
        return cleared;
      });
    } catch (err: any) {
      setError(err?.message || "Something went wrong while registering.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className='mx-auto mt-14 max-w-6xl px-6 text-white'>
      <div className='grid grid-cols-1 gap-8 md:grid-cols-[minmax(0,1fr)_420px] md:items-start'>
        {/* Left: details */}
        <div>
          <h2 className='recoleta mb-4 text-[28px] leading-tight sm:text-[34px] md:text-[30px]'>
            Event Details
          </h2>

          {primaryDate && (
            <div className='mb-4 flex items-start gap-3'>
              <IconBadge src='/assets/icon (4).png' alt='Calendar' />
              <p className='elza text-xl font-bold text-[#00D8FF] sm:text-2xl'>
                {primaryDate}
              </p>
            </div>
          )}

          {timeText && (
            <div className='mb-4 flex items-start gap-3'>
              <IconBadge src='/assets/icon (5).png' alt='Time' />
              <p className='elza text-xl font-bold text-[#00D8FF] sm:text-2xl'>
                {timeText}
              </p>
            </div>
          )}

          {venue && (
            <div className='mb-6 flex items-start gap-3'>
              <IconBadge src='/assets/icon (6).png' alt='Location' />
              <p className='elza text-xl font-bold text-[#00D8FF] sm:text-2xl'>
                {venue}
              </p>
            </div>
          )}

          <ul className='space-y-1 text-sm leading-6 text-white/85 sm:text-base md:text-lg'>
            {notes.map((n, i) => (
              <li key={i}>– {n}</li>
            ))}
          </ul>
        </div>

        {/* Right: registration form */}
        <div className='rounded-[20px] p-5 ring-1 ring-white/10 shadow-2xl sm:p-6'>
          <p className='mb-3 text-lg font-bold text-white/90 sm:text-2xl'>
            Fill Up this Form
          </p>

          {/* success/error banners */}
          {success && (
            <div className='mb-4 rounded-md bg-green-600/15 px-3 py-2 text-sm text-green-300 ring-1 ring-green-600/30'>
              Registration received! We’ll email you with updates.
            </div>
          )}
          {error && (
            <div className='mb-4 rounded-md bg-red-600/15 px-3 py-2 text-sm text-red-300 ring-1 ring-red-600/30'>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className='space-y-5 text-[14px]'>
            {useDynamic ? (
              /* --- dynamic fields rendering --- */
              fields.map((f) => {
                const val = form[f.name] ?? "";
                return (
                  <div key={f.id} className='space-y-2'>
                    <label className='mb-2 block text-white' htmlFor={f.id}>
                      {f.label}{" "}
                      {f.required ? (
                        <span className='opacity-70'>*</span>
                      ) : null}
                    </label>

                    {f.type === "textarea" ? (
                      <textarea
                        id={f.id}
                        placeholder={f.label}
                        value={val}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, [f.name]: e.target.value }))
                        }
                        className='w-full rounded-md bg-black/30 px-4 py-3 outline-none ring-1 ring-white/30 placeholder:text-white/70 focus:ring-2 focus:ring-white/40'
                        rows={4}
                        required={f.required}
                        disabled={submitting}
                      />
                    ) : f.type === "select" ? (
                      <select
                        id={f.id}
                        value={val}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, [f.name]: e.target.value }))
                        }
                        className='w-full rounded-md bg-black/30 px-4 py-3 outline-none ring-1 ring-white/30 focus:ring-2 focus:ring-white/40'
                        required={f.required}
                        disabled={submitting}
                      >
                        <option value='' disabled>
                          {`Select ${f.label}`}
                        </option>
                        {(f.options || []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={f.id}
                        type={f.type === "phone" ? "tel" : f.type}
                        placeholder={f.label}
                        value={val}
                        onChange={(e) =>
                          setForm((p) => ({ ...p, [f.name]: e.target.value }))
                        }
                        className='w-full rounded-md bg-black/30 px-4 py-3 outline-none ring-1 ring-white/30 placeholder:text-white/70 focus:ring-2 focus:ring-white/40'
                        required={f.required}
                        disabled={submitting}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              /* --- original fallback fields --- */
              <>
                <div>
                  <label className='mb-2 block text-white'>Name</label>
                  <input
                    type='text'
                    placeholder='Enter Your Name'
                    value={form["name"] ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, name: e.target.value }))
                    }
                    className='w-full rounded-md bg-black/30 px-4 py-3 outline-none ring-1 ring-white/30 placeholder:text-white/70 focus:ring-2 focus:ring-white/40'
                    disabled={submitting}
                    required
                  />
                </div>
                <div>
                  <label className='mb-2 block text-white'>Email</label>
                  <input
                    type='email'
                    placeholder='Enter Your Email'
                    value={form["email"] ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    className='w-full rounded-md bg-black/30 px-4 py-3 outline-none ring-1 ring-white/30 placeholder:text-white/70 focus:ring-2 focus:ring-white/40'
                    disabled={submitting}
                    required
                  />
                </div>
                <div>
                  <label className='mb-2 block text-white'>Phone Number</label>
                  <input
                    type='tel'
                    placeholder='Enter Your Phone Number'
                    value={form["phone"] ?? ""}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: e.target.value }))
                    }
                    className='w-full rounded-md bg-black/30 px-4 py-3 outline-none ring-1 ring-white/30 placeholder:text-white/70 focus:ring-2 focus:ring-white/40'
                    disabled={submitting}
                    required
                  />
                </div>
              </>
            )}

            {/* Hidden helpers (aid debugging) */}
            <input type='hidden' value={eventId} readOnly />
            {eventDateISO && (
              <input type='hidden' value={eventDateISO} readOnly />
            )}

            <div className='pt-1'>
              <button
                type='submit'
                disabled={submitting}
                className='mx-auto block rounded-full bg-[#FFD928] px-[26px] py-3 text-[16px] font-bold text-black shadow-[0_10px_24px_rgba(0,0,0,.25)] hover:brightness-95 disabled:opacity-60'
              >
                {submitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className='mx-auto mt-14 h-0.5 w-[520px] max-w-full rounded-full bg-[linear-gradient(90deg,transparent,#00D8FF_50%,transparent)]' />
    </section>
  );
}
