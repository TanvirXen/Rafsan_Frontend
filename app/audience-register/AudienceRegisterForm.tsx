"use client";

import { FormEvent, useState } from "react";
import apiList from "@/apiList";

type Phase = "idle" | "loading" | "success" | "error";

export default function AudienceRegisterForm({ show }: { show?: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPhase("loading");
    setMessage("");

    try {
      const response = await fetch(apiList.newsletter.subscribe, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          source: "audience-register",
        }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        already?: boolean;
        emailSent?: boolean;
        message?: string;
      };

      if (!response.ok) throw new Error(data.message || "Registration failed.");

      setPhase("success");
      setMessage(
        data.emailSent
          ? "Thank you for joining the audience list. A confirmation email is on its way, and we will notify you about future events."
          : data.already
            ? "You are already on the audience list. We will notify you about future events."
            : "You joined the audience list, but the confirmation email could not be sent yet. Please try again later."
      );
    } catch (error) {
      setPhase("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <main className="site-shell-wide flex min-h-[calc(100svh-72px)] items-center justify-center py-12 text-white sm:py-16">
      <section className="w-full max-w-[34rem] rounded-[28px] border border-[#00D8FF]/25 bg-[#121212] p-6 shadow-[0_24px_70px_rgba(0,0,0,.45)] sm:p-10">
        <p className="elza text-xs font-bold uppercase tracking-[0.24em] text-[#00D8FF]">Audience list</p>
        <h1 className="recoleta mt-3 text-3xl font-bold text-[#FFD928] sm:text-4xl">Be there for the next show.</h1>
        <p className="elza mt-4 text-sm leading-6 text-white/75">
          {show ? `Join the list for ${show} and get notified when new events are announced.` : "Join the list and get notified when new events are announced."}
        </p>

        {phase === "success" ? (
          <div className="mt-8 rounded-2xl border border-[#00D8FF]/30 bg-[#00D8FF]/10 p-5 text-sm leading-6 text-white/90" role="status">
            {message}
          </div>
        ) : (
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <label className="block elza text-sm font-bold text-white/85">
              Name
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                className="mt-2 block w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-normal text-white outline-none focus:border-[#00D8FF]"
              />
            </label>
            <label className="block elza text-sm font-bold text-white/85">
              Email
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                className="mt-2 block w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 font-normal text-white outline-none focus:border-[#00D8FF]"
              />
            </label>
            <button
              type="submit"
              disabled={phase === "loading"}
              className="elza w-full rounded-full bg-[#00D8FF] px-5 py-3 text-sm font-bold text-[#121212] transition hover:brightness-105 disabled:cursor-wait disabled:opacity-60"
            >
              {phase === "loading" ? "Joining..." : "Join audience list"}
            </button>
            {phase === "error" && <p className="text-sm text-red-300" role="alert">{message}</p>}
          </form>
        )}
      </section>
    </main>
  );
}
