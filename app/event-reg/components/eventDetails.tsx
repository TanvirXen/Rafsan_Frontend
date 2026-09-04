/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import React from "react";
import imageCompression from "browser-image-compression";
import apiList from "@/apiList";

const MAX_REGISTRATION_IMAGE_BYTES = 2 * 1024 * 1024;

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
  type: "text" | "email" | "phone" | "number" | "select" | "textarea" | "image";
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

  /** Optional array of all available dates to allow multi-registration */
  availableDates?: { iso: string; label: string; ended: boolean }[];
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
  availableDates = [],
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

  const hasEnded = React.useMemo(() => {
    if (!eventDateISO) return false;
    try {
      return new Date(eventDateISO).getTime() < Date.now();
    } catch {
      return false;
    }
  }, [eventDateISO]);

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
  const [uploadingField, setUploadingField] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  const [selectedDates, setSelectedDates] = React.useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = React.useState<Record<string, string>>({});
  const [successMsg, setSuccessMsg] = React.useState("Registration received! We’ll email you with updates.");

  React.useEffect(() => {
    return () => {
      Object.values(imagePreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  React.useEffect(() => {
    if (eventDateISO) {
      setSelectedDates([eventDateISO]);
    } else {
      setSelectedDates([]);
    }
  }, [eventDateISO]);

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

  async function uploadRegistrationImage(fieldName: string, file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    try {
      setUploadingField(fieldName);
      setError(null);

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        initialQuality: 0.8,
        fileType: "image/jpeg",
      });

      if (compressedFile.size > MAX_REGISTRATION_IMAGE_BYTES) {
        throw new Error("Image must be 2MB or smaller after compression.");
      }

      const data = new FormData();
      data.append(
        "image",
        new File([compressedFile], "registration-image.jpg", {
          type: "image/jpeg",
        })
      );
      const response = await fetch(apiList.registrationImages.upload, {
        method: "POST",
        body: data,
      });
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.imageId) {
        throw new Error(result?.error || "Image upload failed.");
      }
      setForm((prev) => ({ ...prev, [fieldName]: String(result.imageId) }));
      setImagePreviews((prev) => {
        if (prev[fieldName]) URL.revokeObjectURL(prev[fieldName]);
        return { ...prev, [fieldName]: URL.createObjectURL(compressedFile) };
      });
    } catch (uploadError: any) {
      setError(uploadError?.message || "Image upload failed.");
    } finally {
      setUploadingField(null);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (success) return;

    // Verify at least one date is valid
    const validDates = selectedDates.filter((iso) => {
      const isEnded = availableDates.find((d) => d.iso === iso)?.ended;
      if (isEnded) return false;
      try {
        return new Date(iso).getTime() >= Date.now();
      } catch {
        return true;
      }
    });

    if (validDates.length === 0 && !hasEnded && eventDateISO) {
      validDates.push(eventDateISO);
    }
    if (validDates.length === 0) {
      setError("Please select at least one valid upcoming date.");
      return;
    }

    if (hasEnded && validDates.length === 1 && validDates[0] === eventDateISO) {
       return;
    }

    setError(null);
    setSuccess(false);

    const v = useDynamic ? validateDynamic() : validateFallback();
    if (v) {
      setError(v);
      return;
    }

    setSubmitting(true);
    try {
      const results = await Promise.allSettled(
        validDates.map((iso) =>
          fetch(apiList.registrations.list, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              eventId,
              occurrenceDate: iso,
              fields: form,
            }),
          }).then(async (res) => {
            if (!res.ok) {
              let msg = `HTTP ${res.status}`;
              try {
                const j = await res.json();
                if (j?.message) msg = j.message;
              } catch {}
              throw new Error(msg);
            }
            return true;
          })
        )
      );

      const failed = results.filter((r) => r.status === "rejected");
      if (failed.length > 0) {
        if (failed.length === validDates.length) {
          throw new Error(
            (failed[0] as PromiseRejectedResult).reason?.message ||
              "We could not complete your registration. Please try again."
          );
        } else {
          throw new Error(
            `Partial success. ${failed.length} date(s) failed to register.`
          );
        }
      }

      setSuccess(true);
      setSuccessMsg(
        validDates.length > 1
          ? `Successfully registered for ${validDates.length} dates! We'll email you with updates.`
          : "Registration received! We'll email you with updates."
      );

      // clear values
      setForm((prev) => {
        const cleared: Record<string, string> = {};
        for (const k of Object.keys(prev)) cleared[k] = "";
        return cleared;
      });
      if (eventDateISO) setSelectedDates([eventDateISO]);
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

          {/* Keep validation and server errors near the form heading. */}
          {error && (
            <div className='mb-4 rounded-md bg-red-600/15 px-3 py-2 text-sm text-red-300 ring-1 ring-red-600/30'>
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className='space-y-5 text-[14px]'>
            {availableDates && availableDates.length > 1 && (
              <div className='mb-7'>
                <label className='mb-3 block text-white text-lg font-bold'>
                  Which dates do you want to register for?
                </label>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 pb-1 custom-scrollbar'>
                  {Object.entries(
                    availableDates.reduce((acc, d) => {
                      const dateLabel = d.label.split(' - ')[0];
                      if (!acc[dateLabel]) acc[dateLabel] = [];
                      acc[dateLabel].push(d);
                      return acc;
                    }, {} as Record<string, typeof availableDates>)
                  ).map(([dateLabel, slots]) => (
                    <div key={dateLabel} className="col-span-full mb-2">
                      <p className="mb-2 text-[#00D8FF] font-bold border-b border-white/10 pb-1">{dateLabel}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {slots.map((d) => {
                          const isChecked = selectedDates.includes(d.iso);
                          const disabled = d.ended;
                          const timeLabel = d.label.split(' - ')[1] || "All Day";
                          return (
                            <label
                              key={d.iso}
                              className={`group flex items-start gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                                isChecked 
                                  ? "border-[#00D8FF] bg-[#00D8FF]/10 shadow-[0_0_15px_rgba(0,216,255,0.15)]" 
                                  : "border-white/10 bg-black/30 hover:border-white/25 hover:bg-black/40"
                              } ${disabled ? "opacity-50 grayscale cursor-not-allowed" : "cursor-pointer"}`}
                            >
                              <div className="flex h-5 items-center mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  disabled={disabled}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedDates((prev) => [...prev, d.iso]);
                                    } else {
                                      setSelectedDates((prev) => prev.filter((iso) => iso !== d.iso));
                                    }
                                  }}
                                  className="h-4 w-4 rounded border-white/20 text-[#00D8FF] focus:ring-[#00D8FF] focus:ring-offset-black bg-black/50 transition-colors"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-[14px] font-semibold leading-5 ${isChecked ? "text-white" : "text-white/80"} ${disabled ? "line-through text-white/50" : ""}`}>
                                  {timeLabel}
                                  {disabled && <span className="uppercase text-[10px] ml-2 font-bold text-red-400">Ended</span>}
                                </p>
                              </div>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

                    {f.type === "image" ? (
                      <div className='rounded-md border border-dashed border-white/30 bg-black/20 p-4'>
                        <input
                          id={f.id}
                          type='file'
                          accept='image/jpeg,image/png,image/webp,image/avif'
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) void uploadRegistrationImage(f.name, file);
                          }}
                          className='w-full text-sm text-white file:mr-3 file:rounded-md file:border-0 file:bg-[#00D8FF] file:px-3 file:py-2 file:font-semibold file:text-black'
                          required={f.required && !val}
                          disabled={submitting || hasEnded || uploadingField === f.name}
                        />
                        <p className='mt-2 text-xs text-white/65'>
                          {uploadingField === f.name
                            ? "Uploading securely..."
                            : val
                              ? "Image uploaded securely."
                              : "Images are compressed automatically and must be 2MB or smaller."}
                        </p>
                        {imagePreviews[f.name] && (
                          <Image
                            src={imagePreviews[f.name]}
                            alt={`${f.label} preview`}
                            width={240}
                            height={160}
                            unoptimized
                            className='mt-3 max-h-40 w-auto rounded-lg border border-white/20 object-contain'
                          />
                        )}
                      </div>
                    ) : f.type === "textarea" ? (
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
                        disabled={submitting || hasEnded}
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
                        disabled={submitting || hasEnded}
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
                        disabled={submitting || hasEnded}
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
                    disabled={submitting || hasEnded}
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
                    disabled={submitting || hasEnded}
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
                    disabled={submitting || hasEnded}
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
                disabled={submitting || success || hasEnded}
                className={`mx-auto block rounded-full px-[26px] py-3 text-[16px] font-bold shadow-[0_10px_24px_rgba(0,0,0,.25)] transition ${
                  hasEnded || success
                    ? 'bg-white/20 text-white/50 border border-white/10 cursor-not-allowed'
                    : 'bg-[#FFD928] text-black hover:brightness-95 disabled:opacity-60'
                }`}
              >
                {submitting
                  ? "Submitting..."
                  : success
                    ? "Submitted"
                    : hasEnded
                      ? "Ended"
                      : "Submit"}
              </button>
            </div>
            {success && (
              <div className='rounded-md bg-green-600/15 px-3 py-2 text-sm text-green-300 ring-1 ring-green-600/30'>
                {successMsg}
              </div>
            )}
          </form>
        </div>
      </div>

      <div className='mx-auto mt-14 h-0.5 w-[520px] max-w-full rounded-full bg-[linear-gradient(90deg,transparent,#00D8FF_50%,transparent)]' />
    </section>
  );
}
