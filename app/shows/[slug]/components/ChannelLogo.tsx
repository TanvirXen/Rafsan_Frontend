import Image from "next/image";

const CHANNEL_URL = "https://www.youtube.com/@WHATASHOW_OFFICIAL";
const CHANNEL_LOGO =
  "https://yt3.googleusercontent.com/ytc/AIdro_mHX9Gl029qT8Y8qDC9TScKeEqpEU4TNbKdNtcXUzriKMw=s160-c-k-c0x00ffffff-no-rj";

export function ChannelLogo() {
  return (
    <a
      href={CHANNEL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3"
      title="Open channel"
    >
      <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/15 bg-white/5 shadow-[0_10px_26px_rgba(0,0,0,.45)] transition-transform duration-200 group-hover:scale-[1.03]">
        <Image
          src={CHANNEL_LOGO}
          alt="WHAT A SHOW channel"
          fill
          className="object-cover"
          sizes="40px"
          priority
        />
      </div>
    </a>
  );
}
