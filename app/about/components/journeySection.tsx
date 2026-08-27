"use client";

import { useEffect, useState } from "react";
import Journey1 from "./journey1";
import Journey2 from "./journey2";
import Journey3 from "./journey3";
import StoryFlipCard from "./storyFlipCard";
import apiList from "@/apiList";

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

function toMonthYear(dateStr: string) {
  const d = new Date(dateStr);
  const month = d.toLocaleString("en-US", { month: "long" });
  const year = d.getFullYear().toString();
  return { month, year };
}

// Helper: chunk extras into groups of 3 for Journey3 layout
function chunk<T>(arr: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
}

export default function JourneySection() {
  const [slots, setSlots] = useState<SlotMap>({});
  const [journeyExtras, setJourneyExtras] = useState<TimelineItem[]>([]);

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
        const extra: TimelineItem[] = [];

        for (const it of items) {
          if (it.slotKey) {
            if (!map[it.slotKey]) map[it.slotKey] = it;
          } else {
            if (it.section === "journey") {
              extra.push(it);
            }
          }
        }

        setSlots(map);
        setJourneyExtras(extra);
      } catch (e) {
        console.error("Error loading timeline", e);
      }
    })();
  }, []);

  // ---- Hero card ----
  const heroItem = slots["journeyHero"];
  const heroImg = heroItem?.imageLink ?? "/assets/shot3.jpg";
  const heroCaption =
    heroItem?.description ??
    "From the classrooms of IBA to the bright lights of the stage and screen";
  const heroMonthYear = heroItem
    ? toMonthYear(heroItem.date)
    : { month: "May", year: "2024" };

  // ---- Journey 1 / 2 / 3 ----
  const j1LeftItem = slots["journey1Left"];
  const j1RightItem = slots["journey1Right"];
  const j2LeftItem = slots["journey2Left"];
  const j2RightItem = slots["journey2Right"];
  const j3LeftItem = slots["journey3Left"];
  const j3TopRightItem = slots["journey3TopRight"];
  const j3BottomRightItem = slots["journey3BottomRight"];

  // ---- Extra journey items grouped in 3s for Journey3 layout ----
  const extraGroups = chunk(journeyExtras, 3);
  const hasJourneyContent =
    !!heroItem ||
    !!j1LeftItem ||
    !!j1RightItem ||
    !!j2LeftItem ||
    !!j2RightItem ||
    !!j3LeftItem ||
    !!j3TopRightItem ||
    !!j3BottomRightItem ||
    extraGroups.length > 0;

  if (!hasJourneyContent) return null;

  return (
    <>
      {/* HERO */}
      {heroItem && (
        <section className="w-full mt-10 lg:mt-[60px]">
          <div className="site-shell mx-auto w-full max-w-6xl">
            <div className="mx-auto grid w-full max-w-[1080px] grid-cols-[140px_minmax(0,1fr)] items-center gap-4 md:grid-cols-[minmax(240px,360px)_minmax(0,1fr)] md:gap-10">
              <figure className="relative h-[170px] w-[140px] justify-self-center overflow-hidden rounded-2xl md:h-[300px] md:w-full md:max-w-[360px] md:justify-self-start md:rounded-[26px]">
                <StoryFlipCard
                  img={heroImg}
                  alt="Journey story"
                  month={heroMonthYear.month}
                  year={heroMonthYear.year}
                  caption={heroCaption}
                  sizes="(max-width:768px) 140px, 360px"
                  className="h-full w-full"
                />
              </figure>

              <div className="mt-6 max-w-[560px] self-start leading-none text-left lg:mt-0">
                <h2 className="recoleta text-[36px] leading-none text-[#FFD928] md:text-[96px]">
                  The
                  <br />
                  Journey
                </h2>
                <p className="recoleta mt-1 text-[20px] text-[#00D8FF] md:text-[40px]">
                  Stories
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* JOURNEY SECTIONS (mapped slots) */}
      <div className="mt-10 space-y-10">
        {j1LeftItem && j1RightItem && (
          <Journey1
            left={{
              img: j1LeftItem.imageLink,
              alt: j1LeftItem.description,
              month: toMonthYear(j1LeftItem.date).month,
              year: toMonthYear(j1LeftItem.date).year,
              caption: j1LeftItem.description,
            }}
            right={{
              img: j1RightItem.imageLink,
              alt: j1RightItem.description,
              month: toMonthYear(j1RightItem.date).month,
              year: toMonthYear(j1RightItem.date).year,
              caption: j1RightItem.description,
            }}
          />
        )}

        {j2LeftItem && j2RightItem && (
          <Journey2
            left={{
              img: j2LeftItem.imageLink,
              alt: j2LeftItem.description,
              month: toMonthYear(j2LeftItem.date).month,
              year: toMonthYear(j2LeftItem.date).year,
              caption: j2LeftItem.description,
            }}
            right={{
              img: j2RightItem.imageLink,
              alt: j2RightItem.description,
              month: toMonthYear(j2RightItem.date).month,
              year: toMonthYear(j2RightItem.date).year,
              caption: j2RightItem.description,
            }}
          />
        )}

        {(j3LeftItem || j3TopRightItem || j3BottomRightItem) && (
          <Journey3
            left={
              j3LeftItem
                ? {
                    img: j3LeftItem.imageLink,
                    alt: j3LeftItem.description,
                    month: toMonthYear(j3LeftItem.date).month,
                    year: toMonthYear(j3LeftItem.date).year,
                    caption: j3LeftItem.description,
                  }
                : undefined
            }
            topRight={
              j3TopRightItem
                ? {
                    img: j3TopRightItem.imageLink,
                    alt: j3TopRightItem.description,
                    month: toMonthYear(j3TopRightItem.date).month,
                    year: toMonthYear(j3TopRightItem.date).year,
                    caption: j3TopRightItem.description,
                  }
                : undefined
            }
            bottomRight={
              j3BottomRightItem
                ? {
                    img: j3BottomRightItem.imageLink,
                    alt: j3BottomRightItem.description,
                    month: toMonthYear(j3BottomRightItem.date).month,
                    year: toMonthYear(j3BottomRightItem.date).year,
                    caption: j3BottomRightItem.description,
                  }
                : undefined
            }
          />
        )}
      </div>

      {/* EXTRA UNMAPPED JOURNEY CARDS – alternating reversed/original */}
      {extraGroups.length > 0 && (
        <section className="mx-auto mt-10 max-w-6xl px-4 space-y-10">
          {extraGroups.map((group, idx) => {
            const [left, topRight, bottomRight] = group;

            // first group reversed, then original, reversed, original...
            const reverse = idx % 2 === 0;

            return (
              <Journey3
                key={group[0]._id ?? idx}
                reverse={reverse}
                left={
                  left
                    ? {
                        img: left.imageLink,
                        alt: left.description,
                        month: toMonthYear(left.date).month,
                        year: toMonthYear(left.date).year,
                        caption: left.description,
                      }
                    : undefined
                }
                topRight={
                  topRight
                    ? {
                        img: topRight.imageLink,
                        alt: topRight.description,
                        month: toMonthYear(topRight.date).month,
                        year: toMonthYear(topRight.date).year,
                        caption: topRight.description,
                      }
                    : undefined
                }
                bottomRight={
                  bottomRight
                    ? {
                        img: bottomRight.imageLink,
                        alt: bottomRight.description,
                        month: toMonthYear(bottomRight.date).month,
                        year: toMonthYear(bottomRight.date).year,
                        caption: bottomRight.description,
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
