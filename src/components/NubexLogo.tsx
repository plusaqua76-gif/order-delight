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
  variant = "vector-delivery",
}: NubexLogoProps) {
  const iconDimensions = {
    sm: "w-10 h-7",
    md: "w-13 h-9",
    lg: "w-18 h-12",
    xl: "w-24 h-16",
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
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Nubex Delivery Icon: Glowing Cloud + Bold N + Fast Delivery Scooter & Speed Trails */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconDimensions[size]}`}>
        <svg
          viewBox="0 0 84 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full overflow-visible drop-shadow-[0_0_14px_rgba(0,174,255,0.45)]"
        >
          <defs>
            {/* Gradients combining White with Electric Blue & Cyan */}
            <linearGradient
              id="nubexNGrad"
              x1="6"
              y1="6"
              x2="26"
              y2="46"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="20%" stopColor="#E0F7FF" />
              <stop offset="50%" stopColor="#38BDF8" />
              <stop offset="80%" stopColor="#0088FF" />
              <stop offset="100%" stopColor="#0052CC" />
            </linearGradient>

            <linearGradient
              id="nGlossGrad"
              x1="6"
              y1="8"
              x2="20"
              y2="28"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#E0F2FE" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </linearGradient>

            <linearGradient
              id="cloudStrokeGrad"
              x1="4"
              y1="4"
              x2="78"
              y2="48"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#BAE6FD" />
              <stop offset="60%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0066CC" />
            </linearGradient>

            <linearGradient
              id="scooterGrad"
              x1="40"
              y1="20"
              x2="75"
              y2="45"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="35%" stopColor="#E0F2FE" />
              <stop offset="70%" stopColor="#00E5FF" />
              <stop offset="100%" stopColor="#0066D6" />
            </linearGradient>

            <linearGradient
              id="headlightBeam"
              x1="72"
              y1="36"
              x2="84"
              y2="40"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="40%" stopColor="#38BDF8" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#00AEFF" stopOpacity="0" />
            </linearGradient>

            <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Speed Wind Streaks behind delivery vehicle & cloud */}
          <g className={animated ? "animate-nubex-speed-trails" : ""}>
            <line
              x1="28"
              y1="20"
              x2="16"
              y2="20"
              stroke="#00E5FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.6"
            />
            <line
              x1="38"
              y1="14"
              x2="26"
              y2="14"
              stroke="#38BDF8"
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.45"
            />
            <line
              x1="32"
              y1="46"
              x2="18"
              y2="46"
              stroke="#00A3FF"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.7"
            />
            <line
              x1="42"
              y1="49"
              x2="28"
              y2="49"
              stroke="#00E5FF"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.4"
            />
          </g>

          {/* Glowing Animated Cloud Contour (Nubex Identity) */}
          <g className={animated ? "animate-nubex-cloud" : ""}>
            {/* Outer soft glow blur */}
            <path
              d="M22 17C22 10.37 27.37 5 34 5C39.6 5 44.3 8.8 45.6 14C47.1 13.3 48.7 13 50.5 13C56.3 13 61 17.7 61 23.5C61 24.3 60.9 25.1 60.7 25.8C63.8 27.2 66 30.3 66 34C66 38.97 61.97 43 57 43H26C20.48 43 16 38.52 16 33C16 30.7 16.8 28.6 18.1 27C16.8 25.4 16 23.3 16 21C16 18.5 17.1 16.3 18.8 14.8"
              stroke="#00AEFF"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.25"
              filter="url(#neonGlow)"
            />

            {/* Main Crisp Neon Cloud Path */}
            <path
              d="M22 17C22 10.37 27.37 5 34 5C39.6 5 44.3 8.8 45.6 14C47.1 13.3 48.7 13 50.5 13C56.3 13 61 17.7 61 23.5C61 24.3 60.9 25.1 60.7 25.8C63.8 27.2 66 30.3 66 34C66 38.97 61.97 43 57 43H26C20.48 43 16 38.52 16 33C16 30.7 16.8 28.6 18.1 27C16.8 25.4 16 23.3 16 21C16 18.5 17.1 16.3 18.8 14.8"
              stroke="url(#cloudStrokeGrad)"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* Delivery Elements: Fast Moto / Scooter Silhouette emerging from cloud */}
          <g className={animated ? "animate-nubex-scooter" : ""}>
            {/* Headlight Beam Projector */}
            <polygon points="72,36 84,33 84,42" fill="url(#headlightBeam)" />

            {/* Scooter Back Wheel */}
            <circle cx="49" cy="41" r="5" stroke="#00E5FF" strokeWidth="2" fill="#0B1317" />
            <circle cx="49" cy="41" r="2" fill="#FFFFFF" />

            {/* Scooter Front Wheel */}
            <circle cx="70" cy="41" r="5" stroke="#00E5FF" strokeWidth="2" fill="#0B1317" />
            <circle cx="70" cy="41" r="2" fill="#FFFFFF" />

            {/* Delivery Box / Mochila on back */}
            <rect
              x="43"
              y="25"
              width="9"
              height="10"
              rx="2"
              fill="url(#scooterGrad)"
              stroke="#FFFFFF"
              strokeWidth="1"
            />
            {/* Box handle / cross line */}
            <line
              x1="45"
              y1="30"
              x2="50"
              y2="30"
              stroke="#0B1317"
              strokeWidth="1"
              strokeLinecap="round"
            />

            {/* Scooter Frame & Handlebars */}
            <path
              d="M49 41L55 37H63L68 28H71"
              stroke="url(#scooterGrad)"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M63 37L70 41"
              stroke="url(#scooterGrad)"
              strokeWidth="2.4"
              strokeLinecap="round"
            />

            {/* Courier Rider Helmet */}
            <circle cx="58" cy="24" r="3.5" fill="#FFFFFF" />
            <path d="M57 23.5H61.5" stroke="#00C8FF" strokeWidth="1.2" strokeLinecap="round" />

            {/* Glowing Headlamp dot */}
            <circle
              cx="71"
              cy="29"
              r="1.5"
              fill="#FFFFFF"
              className={animated ? "animate-ping" : ""}
            />
          </g>

          {/* Prominent Bold Stylized Capital 'N' (Nubex Brand Monogram) */}
          <g className={animated ? "animate-nubex-n" : ""}>
            {/* Soft Shadow underneath N */}
            <path
              d="M6 44V10C6 8.9 6.9 8 8 8H12C13.1 8 14 8.9 14 10V28.5L23.8 9.5C24.5 8.6 25.6 8 26.8 8H29C30.1 8 31 8.9 31 10V44C31 45.1 30.1 46 29 46H25C23.9 46 23 45.1 23 44V25.5L13.2 44.5C12.5 45.4 11.4 46 10.2 46H8C6.9 46 6 45.1 6 44Z"
              fill="rgba(0, 0, 0, 0.45)"
              transform="translate(1, 2)"
            />

            {/* Main Gradient 'N' Shape */}
            <path
              d="M6 43V11C6 9.34 7.34 8 9 8H11.5C13.16 8 14.5 9.34 14.5 11V27L23.2 10.1C23.9 8.8 25.3 8 26.8 8H28.5C30.16 8 31.5 9.34 31.5 11V43C31.5 44.66 30.16 46 28.5 46H26C24.34 46 23 44.66 23 43V27L14.3 43.9C13.6 45.2 12.2 46 10.7 46H9C7.34 46 6 44.66 6 43Z"
              fill="url(#nubexNGrad)"
            />

            {/* Gloss & Light Reflection on Top of N blending white to blue */}
            <path
              d="M6 24V11C6 9.34 7.34 8 9 8H11.5C13.16 8 14.5 9.34 14.5 11V20L23.2 10.1C23.9 8.8 25.3 8 26.8 8H28.5C30.16 8 31.5 9.34 31.5 11V18L14.3 32L6 24Z"
              fill="url(#nGlossGrad)"
            />

            {/* Highlights on the Left Vertical Bar */}
            <path
              d="M8 12C8 10.9 8.9 10 10 10C11.1 10 12 10.9 12 12V42C12 43.1 11.1 44 10 44C8.9 44 8 43.1 8 42V12Z"
              fill="#FFFFFF"
              opacity="0.45"
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
                className={`font-black uppercase ${badgeSizes[size]} text-[#00E5FF] tracking-[0.24em]`}
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {categoryText}
              </span>
              <span className="size-1 rounded-full bg-[#00E5FF] animate-ping" />
            </div>
          )}

          {/* Main Title: NUBEX (with cyan dot on X) */}
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
                  className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]"
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
              className={`mt-0.5 block font-semibold uppercase ${subtextSizes[size]} text-cyan-200/70`}
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
