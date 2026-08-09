/** @type {import('next').NextConfig} */
function normalizeOrigin(input: string | undefined) {
  const raw = String(input || "").trim().replace(/\/+$/, "");
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

const uploadsOrigin = normalizeOrigin(
  process.env.NEXT_PUBLIC_UPLOADS_ORIGIN ||
    process.env.UPLOADS_ORIGIN ||
    "https://api.rafsansabab.com"
);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.rafsansabab.com",
        pathname: "/uploads/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4000",
        pathname: "/uploads/**",
      },

      // ✅ YouTube channel avatar host
      {
        protocol: "https",
        hostname: "yt3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
  async rewrites() {
    if (!uploadsOrigin) return [];

    const target = new URL(uploadsOrigin);
    return [
      {
        source: "/uploads/:path*",
        destination: `${target.origin}/uploads/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
