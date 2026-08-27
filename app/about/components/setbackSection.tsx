"use client";

import Image from "next/image";
import { motion, type MotionProps, type Transition } from "framer-motion";
import { useEffect, useState } from "react";
import Setback1 from "./setback1";
import apiList from "@/apiList";

type Item = {
  img: string;
  alt?: string;
  monthYear: string;
  caption: string;
};

type MosaicCard = {
  img: string;
  alt?: string;
  title: string;
  caption: string;
};

type TimelineItem = {
  _id: string;
  date: string;
  imageLink: string;
  description: string;
  cardUrl?: string;
  slotKey?: string;
  section?: "journey" | "setback";
};

type SlotMap = Record<string, TimelineItem>;

const spring: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 16,
  mass: 0.6,
};

const zig = (from: "left" | "right", delay = 0): MotionProps => ({
  initial: { opacity: 0, x: from === "left" ? -64 : 64, y: 12 },
  whileInView: { opacity: 1, x: 0, y: 0 },
  transition: { ...spring, delay },
  viewport: { once: true, amount: 0.35 },
});

function toMonthYearMultiline(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear().toString();
  return `${month}\n${year}`;
}

function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function SetbackSection({
  left: leftProp,
  right: rightProp,
}: {
  left?: Item;
  right?: Item;
}) {
  const [slots, setSlots] = useState<SlotMap>({});
  const [setbackExtras, setSetbackExtras] = useState<TimelineItem[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(apiList.timeline.list);
        if (!res.ok) {
          console.error("Failed to load timeline", await res.text());
          return;
        }
        const json = await res.json();
        const items: TimelineItem[] = json.items || [];

        const map: SlotMap = {};
        const extras: TimelineItem[] = [];

        for (const it of items) {
          if (it.slotKey) {
            if (!map[it.slotKey]) map[it.slotKey] = it;
          } else if (it.section === "setback") {
            extras.push(it);
          }
        }

        setSlots(map);
        setSetbackExtras(extras);
      } catch (e) {
        console.error("Error loading timeline", e);
      }
    })();
  }, []);

  const mainLeftItem = slots["setbackMainLeft"];
  const mainRightItem = slots["setbackMainRight"];

  const left: Item | undefined =
    leftProp ||
    (mainLeftItem
      ? {
          img: mainLeftItem.imageLink,
          alt: mainLeftItem.description,
          monthYear: toMonthYearMultiline(mainLeftItem.date),
          caption: mainLeftItem.description,
        }
      : undefined);

  const right: Item | undefined =
    rightProp ||
    (mainRightItem
      ? {
          img: mainRightItem.imageLink,
          alt: mainRightItem.description,
          monthYear: toMonthYearMultiline(mainRightItem.date),
          caption: mainRightItem.description,
        }
      : undefined);

  const mosaicLeftItem = slots["setbackMosaicLeft"];
  const mosaicTopRightItem = slots["setbackMosaicTopRight"];
  const mosaicBottomRightItem = slots["setbackMosaicBottomRight"];

  const mosaicLeft: MosaicCard | undefined = mosaicLeftItem
    ? {
        img: mosaicLeftItem.imageLink,
        alt: mosaicLeftItem.description,
        title: toMonthYearMultiline(mosaicLeftItem.date),
        caption: mosaicLeftItem.description,
      }
    : undefined;

  const mosaicTopRight: MosaicCard | undefined = mosaicTopRightItem
    ? {
        img: mosaicTopRightItem.imageLink,
        alt: mosaicTopRightItem.description,
        title: toMonthYearMultiline(mosaicTopRightItem.date),
        caption: mosaicTopRightItem.description,
      }
    : undefined;

  const mosaicBottomRight: MosaicCard | undefined = mosaicBottomRightItem
    ? {
        img: mosaicBottomRightItem.imageLink,
        alt: mosaicBottomRightItem.description,
        title: toMonthYearMultiline(mosaicBottomRightItem.date),
        caption: mosaicBottomRightItem.description,
      }
    : undefined;

  const extraGroups = chunk(setbackExtras, 3);
  const hasSetbackContent =
    !!left ||
    !!right ||
    !!mosaicLeft ||
    !!mosaicTopRight ||
    !!mosaicBottomRight ||
    extraGroups.length > 0;

  if (!hasSetbackContent) return null;

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 pt-10 overflow-x-hidden lg:overflow-visible">
        {(left || right) && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-[440px_minmax(0,1fr)] md:items-start">
            {left && (
              <div className="flex flex-col gap-3">
                <h2 className="recoleta text-[30px] text-right text-white md:text-[34px]">
                  Setback
                </h2>

                <motion.figure
                  {...zig("left", 0.05)}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="relative h-80 overflow-hidden rounded-3xl sm:h-[420px] md:h-[500px]"
                >
                  <Image
                    src={left.img}
                    alt={left.alt || "Setback left"}
                    fill
                    className="object-cover grayscale"
                    sizes="(max-width: 768px) calc(100vw - 2rem), 440px"
                    priority
                  />
                  <div className="absolute inset-0 bg-[radial-gradient(80%_65%_at_50%_30%,rgba(0,0,0,0)_0%,rgba(0,0,0,.15)_45%,rgba(0,0,0,.55)_100%)]" />
                  <div className="recoleta absolute right-5 top-[68%] -translate-y-1/2 text-right leading-[1.05] text-white lg:top-[75%]">
                    {left.monthYear.split("\n").map((l, i) => (
                      <div key={i} className={i === 0 ? "text-[36px]" : "text-[40px]"}>
                        {l}
                      </div>
                    ))}
                  </div>
                  <figcaption className="elza absolute bottom-5 left-5 right-5 text-right text-[12px] leading-5 text-white/90 md:text-[18px]">
                    {left.caption}
                  </figcaption>
                </motion.figure>
              </div>
            )}

            {right && (
              <motion.figure
                {...zig("right", 0.12)}
                whileHover={{ y: -4, scale: 1.01 }}
                className="relative h-[500px] overflow-hidden rounded-[28px] sm:h-[420px] md:h-[564px]"
              >
                <Image
                  src={right.img}
                  alt={right.alt || "Setback right"}
                  fill
                  className="object-cover grayscale"
                  sizes="(max-width: 768px) calc(100vw - 2rem), 740px"
                />
                <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_50%_35%,rgba(0,0,0,0)_0%,rgba(0,0,0,.18)_52%,rgba(0,0,0,.60)_100%)]" />
                <div className="recoleta absolute left-6 top-[78%] -translate-y-1/2 text-left leading-[1.05] text-white lg:top-[75%]">
                  {right.monthYear.split("\n").map((l, i) => (
                    <div key={i} className={i === 0 ? "text-[36px]" : "text-[40px]"}>
                      {l}
                    </div>
                  ))}
                </div>
                <figcaption className="elza absolute bottom-6 left-6 right-6 text-[12px] leading-5 text-white/90 md:text-[18px]">
                  {right.caption}
                </figcaption>
              </motion.figure>
            )}
          </div>
        )}

        {(mosaicLeft || mosaicTopRight || mosaicBottomRight) && (
          <Setback1
            left={mosaicLeft}
            topRight={mosaicTopRight}
            bottomRight={mosaicBottomRight}
            reverse={false}
          />
        )}
      </section>

      {extraGroups.length > 0 && (
        <section className="mx-auto mt-10 max-w-6xl space-y-10 px-6">
          {extraGroups.map((group, idx) => {
            const [leftExtra, topExtra, bottomExtra] = group;
            const reverse = idx % 2 === 0;
            const toTitle = (item?: TimelineItem) =>
              item ? toMonthYearMultiline(item.date) : "";

            return (
              <Setback1
                key={leftExtra?._id ?? idx}
                reverse={reverse}
                left={
                  leftExtra
                    ? {
                        img: leftExtra.imageLink,
                        alt: leftExtra.description,
                        title: toTitle(leftExtra),
                        caption: leftExtra.description,
                      }
                    : undefined
                }
                topRight={
                  topExtra
                    ? {
                        img: topExtra.imageLink,
                        alt: topExtra.description,
                        title: toTitle(topExtra),
                        caption: topExtra.description,
                      }
                    : undefined
                }
                bottomRight={
                  bottomExtra
                    ? {
                        img: bottomExtra.imageLink,
                        alt: bottomExtra.description,
                        title: toTitle(bottomExtra),
                        caption: bottomExtra.description,
                      }
                    : undefined
                }
              />
            );
          })}
        </section>
      )}
    </>
  );
}
