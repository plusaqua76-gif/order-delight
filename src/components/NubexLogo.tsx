import React from "react";

interface NubexLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  showSubtitle?: boolean;
  categoryText?: string;
  subtitleText?: string;
  className?: string;
  animated?: boolean;
  variant?: "vector-delivery" | "classic-cloud" | "image-emblem";
}

export function NubexLogo({
  size = "md",
  showText = true,
  showSubtitle = true,
  categoryText = "CENTRAL DE ACARREOS",
  subtitleText = "PITALITO · HUILA",
  className = "",
  animated = true,
}: NubexLogoProps) {
  const iconDimensions = {
    sm: "w-11 h-8",
    md: "w-14 h-10",
    lg: "w-20 h-14",
    xl: "w-28 h-18",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-lg",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  const badgeSizes = {
    sm: "text-[7px] tracking-[0.22em]",
    md: "text-[8.5px] tracking-[0.24em]",
    lg: "text-[10px] tracking-[0.26em]",
    xl: "text-xs tracking-[0.28em]",
  };

  const subtextSizes = {
    sm: "text-[7px] tracking-[0.16em]",
    md: "text-[8px] tracking-[0.18em]",
    lg: "text-[9.5px] tracking-[0.2em]",
    xl: "text-[11px] tracking-[0.22em]",
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Nubex Truck / Cargo Acarreos Icon: Glowing Cloud + Bold N + Modern Transport Truck & Speed Trails */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions[size]}`}>
        <svg
          viewBox="0 0 92 56"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-[0_0_16px_rgba(0,229,255,0.65)]"
        >
          <defs>
            {/* Gradients for Bold 'N' */}
            <linearGradient
              id="nubexNGrad"
              x1="4"
              y1="6"
              x2="26"
              y2="48"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="20%" stopColor="#E0F7FF" />
              <stop offset="55%" stopColor="#00E5FF" />
              <stop offset="85%" stopColor="#0088FF" />
              <stop offset="100%" stopColor="#0047BA" />
            </linearGradient>

            <linearGradient
              id="nGlossGrad"
              x1="4"
              y1="8"
              x2="20"
              y2="28"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="60%" stopColor="#E0F2FE" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>

            {/* Cloud Outline Gradient */}
            <linearGradient
              id="cloudStrokeGrad"
              x1="4"
              y1="4"
              x2="86"
              y2="52"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="30%" stopColor="#BAE6FD" />
              <stop offset="70%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0077FF" />
            </linearGradient>

            {/* High-visibility Truck Gradient (Cyan to Electric Sky Blue) */}
            <linearGradient
              id="truckCabinGrad"
              x1="65"
              y1="22"
              x2="84"
              y2="45"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#E0F7FF" />
              <stop offset="60%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0077EE" />
            </linearGradient>

            {/* Truck Cargo Body Gradient (High Contrast) */}
            <linearGradient
              id="cargoBoxGrad"
              x1="40"
              y1="18"
              x2="66"
              y2="42"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="40%" stopColor="#00AEFF" />
              <stop offset="100%" stopColor="#0055CC" />
            </linearGradient>

            {/* Headlight Beam Projector */}
            <linearGradient
              id="truckBeamGrad"
              x1="82"
              y1="38"
              x2="94"
              y2="42"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
              <stop offset="35%" stopColor="#00E5FF" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#00AEFF" stopOpacity="0" />
            </linearGradient>

            <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Speed Wind Streaks behind Truck & Cloud */}
          <g className={animated ? "animate-nubex-speed-trails" : ""}>
            <line
              x1="26"
              y1="22"
              x2="14"
              y2="22"
              stroke="#00E5FF"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.8"
            />
            <line
              x1="36"
              y1="15"
              x2="22"
              y2="15"
              stroke="#38BDF8"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.6"
            />
            <line
              x1="32"
              y1="48"
              x2="16"
              y2="48"
              stroke="#00E5FF"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.85"
            />
            <line
              x1="42"
              y1="51"
              x2="26"
              y2="51"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.5"
            />
          </g>

          {/* Glowing Animated Cloud Contour (Nubex Identity) */}
          <g className={animated ? "animate-nubex-cloud" : ""}>
            {/* Outer soft glow blur */}
            <path
              d="M20 18C20 11.37 25.37 6 32 6C37.6 6 42.3 9.8 43.6 15C45.1 14.3 46.7 14 48.5 14C54.3 14 59 18.7 59 24.5C59 25.3 58.9 26.1 58.7 26.8C61.8 28.2 64 31.3 64 35C64 39.97 59.97 44 55 44H24C18.48 44 14 39.52 14 34C14 31.7 14.8 29.6 16.1 28C14.8 26.4 14 24.3 14 22C14 19.5 15.1 17.3 16.8 15.8"
              stroke="#00E5FF"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.35"
              filter="url(#neonGlow)"
            />

            {/* Main Crisp Neon Cloud Path */}
            <path
              d="M20 18C20 11.37 25.37 6 32 6C37.6 6 42.3 9.8 43.6 15C45.1 14.3 46.7 14 48.5 14C54.3 14 59 18.7 59 24.5C59 25.3 58.9 26.1 58.7 26.8C61.8 28.2 64 31.3 64 35C64 39.97 59.97 44 55 44H24C18.48 44 14 39.52 14 34C14 31.7 14.8 29.6 16.1 28C14.8 26.4 14 24.3 14 22C14 19.5 15.1 17.3 16.8 15.8"
              stroke="url(#cloudStrokeGrad)"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* ACARREOS EMBLEM: High-Visibility Transport & Cargo Truck */}
          <g className={animated ? "animate-nubex-scooter" : ""}>
            {/* Headlight Powerful Beam */}
            <polygon points="82,37 94,32 94,44" fill="url(#truckBeamGrad)" />

            {/* Truck Cargo Body / Furgón (High Contrast Blue) */}
            <rect
              x="42"
              y="20"
              width="25"
              height="18"
              rx="3"
              fill="url(#cargoBoxGrad)"
              stroke="#FFFFFF"
              strokeWidth="1.6"
            />

            {/* Cargo Stripes / Estacas details */}
            <line x1="50" y1="20" x2="50" y2="38" stroke="#E0F2FE" strokeWidth="1" opacity="0.6" />
            <line x1="58" y1="20" x2="58" y2="38" stroke="#E0F2FE" strokeWidth="1" opacity="0.6" />
            <line x1="42" y1="29" x2="67" y2="29" stroke="#E0F2FE" strokeWidth="1" opacity="0.5" />

            {/* Acarreos Fast Box Symbol on Cargo */}
            <path
              d="M51 24.5L54.5 22.5L58 24.5L54.5 26.5L51 24.5Z"
              fill="#FFFFFF"
              stroke="#00E5FF"
              strokeWidth="0.8"
            />

            {/* Truck Cabin (Bright White/Cyan Gradient) */}
            <path
              d="M67 25H76L81 31V38H67V25Z"
              fill="url(#truckCabinGrad)"
              stroke="#FFFFFF"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />

            {/* Cabin Windshield Window */}
            <path d="M69 27H75L78.5 31H69V27Z" fill="#08141D" stroke="#00E5FF" strokeWidth="1" />

            {/* Front Bumper & Grill */}
            <path d="M81 35H84V39H81V35Z" fill="#00E5FF" stroke="#FFFFFF" strokeWidth="0.8" />

            {/* Truck Wheels (Heavy Duty with Chrome & Cyan Glow Hubs) */}
            {/* Wheel 1 (Rear) */}
            <circle cx="48" cy="42" r="5.5" stroke="#00E5FF" strokeWidth="2.2" fill="#070E14" />
            <circle cx="48" cy="42" r="2.5" fill="#FFFFFF" />

            {/* Wheel 2 (Middle) */}
            <circle cx="61" cy="42" r="5.5" stroke="#00E5FF" strokeWidth="2.2" fill="#070E14" />
            <circle cx="61" cy="42" r="2.5" fill="#FFFFFF" />

            {/* Wheel 3 (Front Steering) */}
            <circle cx="76" cy="42" r="5.5" stroke="#00E5FF" strokeWidth="2.2" fill="#070E14" />
            <circle cx="76" cy="42" r="2.5" fill="#FFFFFF" />

            {/* Glowing Front Headlight Dot */}
            <circle
              cx="82"
              cy="36"
              r="2"
              fill="#FFFFFF"
              className={animated ? "animate-ping" : ""}
            />
          </g>

          {/* Prominent Bold Stylized Capital 'N' (Nubex Monogram) */}
          <g className={animated ? "animate-nubex-n" : ""}>
            {/* Soft Shadow underneath N */}
            <path
              d="M4 45V9C4 7.9 4.9 7 6 7H10C11.1 7 12 7.9 12 9V28.5L21.8 8.5C22.5 7.6 23.6 7 24.8 7H27C28.1 7 29 7.9 29 9V45C29 46.1 28.1 47 27 47H23C21.9 47 21 46.1 21 45V25.5L11.2 45.5C10.5 46.4 9.4 47 8.2 47H6C4.9 47 4 46.1 4 45Z"
              fill="rgba(0, 0, 0, 0.5)"
              transform="translate(1, 2)"
            />

            {/* Main Gradient 'N' Shape */}
            <path
              d="M4 44V10C4 8.34 5.34 7 7 7H9.5C11.16 7 12.5 8.34 12.5 10V27L21.2 9.1C21.9 7.8 23.3 7 24.8 7H26.5C28.16 7 29.5 8.34 29.5 10V44C29.5 45.66 28.16 47 26.5 47H24C22.34 47 21 45.66 21 44V27L12.3 44.9C11.6 46.2 10.2 47 8.7 47H7C5.34 47 4 45.66 4 44Z"
              fill="url(#nubexNGrad)"
            />

            {/* Gloss & Light Reflection on Top of N */}
            <path
              d="M4 24V10C4 8.34 5.34 7 7 7H9.5C11.16 7 12.5 8.34 12.5 10V20L21.2 9.1C21.9 7.8 23.3 7 24.8 7H26.5C28.16 7 29.5 8.34 29.5 10V18L12.3 32L4 24Z"
              fill="url(#nGlossGrad)"
            />

            {/* Highlights on the Left Vertical Bar */}
            <path
              d="M6 11C6 9.9 6.9 9 8 9C9.1 9 10 9.9 10 11V43C10 44.1 9.1 45 8 45C6.9 45 6 44.1 6 43V11Z"
              fill="#FFFFFF"
              opacity="0.5"
            />
          </g>
        </svg>
      </div>

      {/* Typography: NUBEX CENTRAL DE ACARREOS */}
      {showText && (
        <div className="flex flex-col justify-center leading-none">
          {/* Top Category Badge */}
          {categoryText && (
            <div className="flex items-center gap-1.5">
              <span
                className={`font-black uppercase ${badgeSizes[size]} text-[#00E5FF] tracking-[0.24em] drop-shadow-[0_0_8px_rgba(0,229,255,0.7)]`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {categoryText}
              </span>
              <span className="size-1.5 rounded-full bg-[#00E5FF] animate-ping" />
            </div>
          )}

          {/* Main Title: NUBEX */}
          <div className="flex items-center -mt-0.5">
            <span
              className={`font-display font-black tracking-tight text-white uppercase ${textSizes[size]} flex items-center`}
              style={{ fontFamily: "'Outfit', 'Montserrat', 'Inter', sans-serif" }}
            >
              NUBE
              {/* Stylized 'X' with cyan spark dot */}
              <span className="relative inline-block">
                X
                <span
                  className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]"
                  style={{
                    animation: animated ? "nubex-dot-glow 2s ease-in-out infinite" : "none",
                  }}
                />
              </span>
            </span>
          </div>

          {/* Subtitle: PITALITO · HUILA */}
          {showSubtitle && (
            <span
              className={`mt-0.5 block font-bold uppercase ${subtextSizes[size]} text-cyan-200/90 tracking-[0.2em]`}
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {subtitleText}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
