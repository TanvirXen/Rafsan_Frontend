import { NextRequest, NextResponse } from "next/server";
import {
  fetchPortfolioNotableEvents,
  isPortfolioType,
  PORTFOLIO_TYPES,
  type PortfolioNotableEventsByType,
} from "@/app/lib/portfolioNotableEvents";

export const revalidate = 60;

const CACHE_CONTROL = "public, s-maxage=60, stale-while-revalidate=300";

function parseLimit(value: string | null) {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) return undefined;
  return Math.floor(parsed);
}

function sliceCategories(
  categories: PortfolioNotableEventsByType,
  limit?: number
): PortfolioNotableEventsByType {
  if (!limit) return categories;

  return {
    "Event Hosting": categories["Event Hosting"].slice(0, limit),
    "Sessions & Workshops": categories["Sessions & Workshops"].slice(0, limit),
    "Brand Collaboration": categories["Brand Collaboration"].slice(0, limit),
    "Corporate Shows": categories["Corporate Shows"].slice(0, limit),
  };
}

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type")?.trim();
  const limit = parseLimit(request.nextUrl.searchParams.get("limit"));
  const categories = sliceCategories(await fetchPortfolioNotableEvents(), limit);

  if (type) {
    if (!isPortfolioType(type)) {
      return NextResponse.json(
        {
          error: "Unsupported portfolio type.",
          supportedTypes: PORTFOLIO_TYPES,
        },
        {
          status: 400,
          headers: { "Cache-Control": CACHE_CONTROL },
        }
      );
    }

    return NextResponse.json(
      {
        type,
        events: categories[type],
        count: categories[type].length,
      },
      {
        headers: { "Cache-Control": CACHE_CONTROL },
      }
    );
  }

  const count = PORTFOLIO_TYPES.reduce(
    (total, itemType) => total + categories[itemType].length,
    0
  );

  return NextResponse.json(
    {
      types: PORTFOLIO_TYPES,
      categories,
      count,
    },
    {
      headers: { "Cache-Control": CACHE_CONTROL },
    }
  );
}
