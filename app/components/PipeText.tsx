"use client";

import React from "react";

export function PipeText({
  text,
  pipeClassName = "recoleta",
  pipe = "|",
}: {
  text: string;
  pipeClassName?: string;
  pipe?: string;
}) {
  const parts = (text ?? "").split(pipe);

  return (
    <>
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {part}
          {i < parts.length - 1 && (
            <span className={pipeClassName}>{" | "}</span>
          )}
        </React.Fragment>
      ))}
    </>
  );
}
