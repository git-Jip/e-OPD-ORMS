import logoArtwork from "../../assets/brand/logo-full.webp";

const INK = { x: 24, y: 361, w: 1209, h: 578, canvas: 1254 };

export function HospitalLogo({ className = "", plated = true }: { className?: string; plated?: boolean }) {
  return (
    <div
      className={
        plated
          ? `overflow-hidden rounded-2xl bg-white p-5 ring-1 ring-ink/10 ${className}`
          : `inline-flex shrink-0 overflow-hidden ${className}`
      }
    >
      <div
        className={`relative overflow-hidden ${plated ? "" : "h-full"}`}
        style={{ aspectRatio: `${INK.w} / ${INK.h}` }}
      >
        <img
          alt="Balayan Bayview Hospital and Medical Center"
          className="absolute max-w-none"
          src={logoArtwork}
          style={{
            width: `${(INK.canvas / INK.w) * 100}%`,
            left: `${(-INK.x / INK.w) * 100}%`,
            top: `${(-INK.y / INK.h) * 100}%`,
          }}
        />
      </div>
    </div>
  );
}
