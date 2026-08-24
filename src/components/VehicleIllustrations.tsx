import React from "react";

interface VehicleIllustrationProps {
  type: "motocarro" | "camioneta" | "turbo" | "camion";
  className?: string;
  size?: "sm" | "md" | "lg";
}

/**
 * Ilustraciones vectoriales realistas y detalladas para vehículos de transporte y acarreo en Colombia:
 * 1. Motocarguero / Motocarro de carga (3 ruedas con platón de estacas y cabina)
 * 2. Camioneta de Platón / Estacas (Estilo LUV DMax / Hilux con estacas y carpa)
 * 3. Camión Turbo (Cabina chata NHR/NKR con furgón y estacas)
 * 4. Camión Grande / Sencillo (Carga pesada con carrocería larga y doble llanta)
 */
export function VehicleIllustration({
  type,
  className = "",
  size = "md",
}: VehicleIllustrationProps) {
  switch (type) {
    case "motocarro":
      return <MotocargueroIllustration className={className} size={size} />;
    case "camioneta":
      return <CamionetaIllustration className={className} size={size} />;
    case "turbo":
      return <CamionTurboIllustration className={className} size={size} />;
    case "camion":
      return <CamionGrandeIllustration className={className} size={size} />;
    default:
      return null;
  }
}

/**
 * 1. MOTOCARGUERO REALISTA (Motocarro de Carga de 3 Ruedas con Platón de Estacas)
 */
export function MotocargueroIllustration({
  className = "",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto drop-shadow-md ${className}`}
    >
      <defs>
        <linearGradient
          id="motoCabGrad"
          x1="20"
          y1="30"
          x2="60"
          y2="80"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="60%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#B45309" />
        </linearGradient>

        <linearGradient
          id="motoPlatonGrad"
          x1="60"
          y1="35"
          x2="180"
          y2="75"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#1D4ED8" />
          <stop offset="100%" stopColor="#1E40AF" />
        </linearGradient>

        <linearGradient
          id="motoChassisGrad"
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>

        <linearGradient
          id="motoTireGrad"
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#09090B" />
        </linearGradient>

        <linearGradient id="motoRimGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#E4E4E7" />
          <stop offset="100%" stopColor="#71717A" />
        </linearGradient>

        <filter id="motoShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="100" cy="108" rx="85" ry="6" fill="#000000" opacity="0.45" />

      <g filter="url(#motoShadow)">
        {/* MAIN CHASSIS FRAME */}
        <path
          d="M32 90H175C178 90 180 87 180 84V78H55L32 90Z"
          fill="url(#motoChassisGrad)"
          stroke="#1F2937"
          strokeWidth="1.5"
        />

        {/* REAR CARGO BED (PLATÓN METÁLICO CON ESTACAS Y REFUERZOS) */}
        <rect
          x="62"
          y="42"
          width="118"
          height="40"
          rx="3"
          fill="url(#motoPlatonGrad)"
          stroke="#3B82F6"
          strokeWidth="1.5"
        />

        {/* Top Cargo Railing Bar */}
        <rect
          x="60"
          y="38"
          width="122"
          height="4"
          rx="2"
          fill="#E2E8F0"
          stroke="#94A3B8"
          strokeWidth="0.8"
        />

        {/* Vertical Estacas Ribs / Refuerzos del Platón */}
        <line
          x1="82"
          y1="42"
          x2="82"
          y2="82"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="102"
          y1="42"
          x2="102"
          y2="82"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="122"
          y1="42"
          x2="122"
          y2="82"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="142"
          y1="42"
          x2="142"
          y2="82"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <line
          x1="162"
          y1="42"
          x2="162"
          y2="82"
          stroke="#60A5FA"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Horizontal Groove in Side Panel */}
        <line x1="64" y1="62" x2="178" y2="62" stroke="#1E3A8A" strokeWidth="2" />
        <line x1="64" y1="63" x2="178" y2="63" stroke="#93C5FD" strokeWidth="0.8" opacity="0.6" />

        {/* Reflective tape (Amarillo/Blanco reglamentario) */}
        <rect x="65" y="74" width="20" height="3" fill="#FACC15" rx="0.5" />
        <rect x="90" y="74" width="20" height="3" fill="#F8FAFC" rx="0.5" />
        <rect x="115" y="74" width="20" height="3" fill="#FACC15" rx="0.5" />
        <rect x="140" y="74" width="20" height="3" fill="#F8FAFC" rx="0.5" />
        <rect x="165" y="74" width="12" height="3" fill="#EF4444" rx="0.5" />

        {/* Rear Mudguard */}
        <path
          d="M125 78Q148 68 172 78"
          fill="none"
          stroke="#111827"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* FRONT CABIN & MOTORCYCLE FRONT SECTION */}
        {/* Driver Seat & Engine Cover Area */}
        <path d="M48 60H65V85H44L48 60Z" fill="#18181B" stroke="#27272A" strokeWidth="1.2" />
        {/* Engine detail fins */}
        <line
          x1="50"
          y1="72"
          x2="62"
          y2="72"
          stroke="#71717A"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="50"
          y1="76"
          x2="62"
          y2="76"
          stroke="#71717A"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="51"
          y1="80"
          x2="60"
          y2="80"
          stroke="#71717A"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Ergonomic Driver Cushion Seat */}
        <path
          d="M45 58C45 56 48 54 54 54H64C65.5 54 66 56 66 58V61H45V58Z"
          fill="#09090B"
          stroke="#3F3F46"
          strokeWidth="1"
        />

        {/* Motocarguero Front Cowl / Cabin Shell */}
        <path
          d="M18 82L24 50C25 45 28 42 34 40L48 38V85H30L18 82Z"
          fill="url(#motoCabGrad)"
          stroke="#F59E0B"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Aerodynamic Windshield / Parabrisas */}
        <path
          d="M26 48L32 25C33 22 36 20 40 20H45V38L32 40L26 48Z"
          fill="#0EA5E9"
          fillOpacity="0.4"
          stroke="#7DD3FC"
          strokeWidth="1.2"
        />
        {/* Windshield Glare Reflection */}
        <line
          x1="36"
          y1="23"
          x2="29"
          y2="44"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Tubular Roof / Canopy Frame */}
        <path
          d="M43 20L44 14C44 12 46 11 49 11H68L66 38"
          fill="none"
          stroke="#CBD5E1"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <path d="M42 12H72L70 16H40L42 12Z" fill="#1E293B" stroke="#0F172A" strokeWidth="1" />

        {/* Front Headlight (Farola potente) */}
        <circle cx="16" cy="62" r="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
        <circle cx="16" cy="62" r="4" fill="#FEF08A" />
        <ellipse cx="14.5" cy="60.5" rx="1.5" ry="2" fill="#FFFFFF" />

        {/* Rearview Mirror */}
        <path d="M30 30L25 24" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
        <rect
          x="21"
          y="20"
          width="5"
          height="8"
          rx="1.5"
          fill="#1E293B"
          stroke="#475569"
          strokeWidth="0.8"
        />

        {/* Front Motorcycle Fork & Suspension */}
        <line
          x1="28"
          y1="62"
          x2="30"
          y2="92"
          stroke="#94A3B8"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="30"
          y1="78"
          x2="31"
          y2="92"
          stroke="#E2E8F0"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {/* Front Fender */}
        <path
          d="M16 82C18 73 28 72 38 77"
          fill="none"
          stroke="#D97706"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* FRONT WHEEL (Rueda Delantera) */}
        <g>
          <circle
            cx="31"
            cy="94"
            r="14"
            fill="url(#motoTireGrad)"
            stroke="#18181B"
            strokeWidth="1"
          />
          <circle cx="31" cy="94" r="9" fill="url(#motoRimGrad)" stroke="#52525B" strokeWidth="1" />
          <circle cx="31" cy="94" r="4" fill="#18181B" />
          <circle cx="31" cy="94" r="2" fill="#F4F4F5" />
          <line x1="24" y1="94" x2="38" y2="94" stroke="#A1A1AA" strokeWidth="1" />
          <line x1="31" y1="87" x2="31" y2="101" stroke="#A1A1AA" strokeWidth="1" />
        </g>

        {/* REAR WHEELS (Ruedas Traseras de Carga de 3 Ruedas) */}
        <g>
          <circle
            cx="148"
            cy="94"
            r="15"
            fill="url(#motoTireGrad)"
            stroke="#18181B"
            strokeWidth="1"
          />
          <circle
            cx="148"
            cy="94"
            r="9.5"
            fill="url(#motoRimGrad)"
            stroke="#52525B"
            strokeWidth="1.2"
          />
          <circle cx="148" cy="94" r="4.5" fill="#27272A" />
          <circle cx="145" cy="91" r="1" fill="#FAFAFA" />
          <circle cx="151" cy="91" r="1" fill="#FAFAFA" />
          <circle cx="145" cy="97" r="1" fill="#FAFAFA" />
          <circle cx="151" cy="97" r="1" fill="#FAFAFA" />
        </g>

        {/* Exhaust Pipe */}
        <path d="M58 88L75 88L95 86" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
        <rect
          x="75"
          y="84"
          width="22"
          height="5"
          rx="2"
          fill="#475569"
          stroke="#94A3B8"
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

/**
 * 2. CAMIONETA PLATÓN / ESTACAS REALISTA (Pick-up Acarreos Colombia)
 */
export function CamionetaIllustration({
  className = "",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto drop-shadow-md ${className}`}
    >
      <defs>
        <linearGradient
          id="pickCabGrad"
          x1="20"
          y1="35"
          x2="80"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#94A3B8" />
        </linearGradient>

        <linearGradient
          id="estacasWood"
          x1="0"
          y1="0"
          x2="0"
          y2="100"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0369A1" />
        </linearGradient>

        <linearGradient
          id="tarpGrad"
          x1="75"
          y1="20"
          x2="185"
          y2="55"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="60%" stopColor="#0891B2" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>

        <filter id="truckShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="100" cy="108" rx="88" ry="6" fill="#000000" opacity="0.45" />

      <g filter="url(#truckShadow)">
        {/* MAIN CHASSIS UNDERBODY */}
        <rect
          x="25"
          y="85"
          width="160"
          height="9"
          rx="2"
          fill="#18181B"
          stroke="#27272A"
          strokeWidth="1"
        />

        {/* CARPADO SUPERIOR / CARGA ELEVADA */}
        <path
          d="M82 22C82 20 85 18 90 18H175C179 18 182 21 182 25V52H82V22Z"
          fill="url(#tarpGrad)"
          stroke="#22D3EE"
          strokeWidth="1.2"
        />
        {/* Carpa Ropes */}
        <line
          x1="102"
          y1="22"
          x2="100"
          y2="52"
          stroke="#ECFEFF"
          strokeWidth="1.2"
          strokeDasharray="3 2"
          opacity="0.8"
        />
        <line
          x1="125"
          y1="22"
          x2="123"
          y2="52"
          stroke="#ECFEFF"
          strokeWidth="1.2"
          strokeDasharray="3 2"
          opacity="0.8"
        />
        <line
          x1="150"
          y1="22"
          x2="148"
          y2="52"
          stroke="#ECFEFF"
          strokeWidth="1.2"
          strokeDasharray="3 2"
          opacity="0.8"
        />
        <line
          x1="172"
          y1="22"
          x2="170"
          y2="52"
          stroke="#ECFEFF"
          strokeWidth="1.2"
          strokeDasharray="3 2"
          opacity="0.8"
        />

        {/* ESTACAS CARGO BED */}
        <rect
          x="80"
          y="52"
          width="105"
          height="34"
          rx="2"
          fill="url(#estacasWood)"
          stroke="#0284C7"
          strokeWidth="1.5"
        />
        {/* Estacas Horizontal Wooden Planks */}
        <line x1="82" y1="60" x2="183" y2="60" stroke="#38BDF8" strokeWidth="1.5" />
        <line x1="82" y1="68" x2="183" y2="68" stroke="#38BDF8" strokeWidth="1.5" />
        <line x1="82" y1="76" x2="183" y2="76" stroke="#38BDF8" strokeWidth="1.5" />
        {/* Vertical Stakes */}
        <line x1="98" y1="52" x2="98" y2="86" stroke="#0C4A6E" strokeWidth="3" />
        <line x1="120" y1="52" x2="120" y2="86" stroke="#0C4A6E" strokeWidth="3" />
        <line x1="145" y1="52" x2="145" y2="86" stroke="#0C4A6E" strokeWidth="3" />
        <line x1="168" y1="52" x2="168" y2="86" stroke="#0C4A6E" strokeWidth="3" />

        {/* Rear Wheel Well Cutout */}
        <path d="M135 86A18 18 0 0 1 171 86Z" fill="#0F172A" />

        {/* CABINA PICK-UP */}
        <path
          d="M18 84L22 66C23 63 26 60 30 60H38L52 38C54 35 58 34 63 34H80V86H32L18 84Z"
          fill="url(#pickCabGrad)"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        {/* Front Hood Line */}
        <line x1="22" y1="63" x2="44" y2="61" stroke="#94A3B8" strokeWidth="1" />

        {/* Windshield & Side Windows */}
        <path
          d="M43 57L54 38C55 36 57 36 60 36H66V57H43Z"
          fill="#0284C7"
          fillOpacity="0.45"
          stroke="#38BDF8"
          strokeWidth="1"
        />
        <path
          d="M68 36H77V57H68V36Z"
          fill="#0284C7"
          fillOpacity="0.45"
          stroke="#38BDF8"
          strokeWidth="1"
        />
        <line x1="48" y1="54" x2="58" y2="39" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.8" />

        {/* Door Seam & Handle */}
        <path d="M64 58V84" stroke="#64748B" strokeWidth="1.2" />
        <rect x="67" y="64" width="6" height="2" rx="1" fill="#1E293B" />

        {/* Front Headlight */}
        <path
          d="M17 65C17 62 20 60 23 60H25V70H20L17 65Z"
          fill="#FEF08A"
          stroke="#FDE047"
          strokeWidth="1"
        />

        {/* Chrome Front Grill & Bumper */}
        <path
          d="M14 74H24V85H16C14.5 85 13.5 83.5 14 82L14 74Z"
          fill="#475569"
          stroke="#64748B"
          strokeWidth="1"
        />
        <line x1="16" y1="77" x2="22" y2="77" stroke="#E2E8F0" strokeWidth="1.5" />
        <line x1="16" y1="81" x2="22" y2="81" stroke="#E2E8F0" strokeWidth="1.5" />

        {/* Side Mirror */}
        <rect
          x="44"
          y="52"
          width="6"
          height="8"
          rx="2"
          fill="#0F172A"
          stroke="#475569"
          strokeWidth="0.8"
        />

        {/* Front Wheel Well Cutout */}
        <path d="M28 86A18 18 0 0 1 64 86Z" fill="#0F172A" />

        {/* 4X4 ALL-TERRAIN WHEELS */}
        {/* Front Wheel */}
        <g>
          <circle cx="46" cy="91" r="16" fill="#18181B" stroke="#09090B" strokeWidth="1.5" />
          <circle cx="46" cy="91" r="10" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          <circle cx="46" cy="91" r="4.5" fill="#0F172A" />
          <line x1="46" y1="83" x2="46" y2="99" stroke="#475569" strokeWidth="2" />
          <line x1="39" y1="87" x2="53" y2="95" stroke="#475569" strokeWidth="2" />
          <line x1="39" y1="95" x2="53" y2="87" stroke="#475569" strokeWidth="2" />
          <circle cx="46" cy="91" r="2.5" fill="#CBD5E1" />
        </g>

        {/* Rear Wheel */}
        <g>
          <circle cx="153" cy="91" r="16" fill="#18181B" stroke="#09090B" strokeWidth="1.5" />
          <circle cx="153" cy="91" r="10" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          <circle cx="153" cy="91" r="4.5" fill="#0F172A" />
          <line x1="153" y1="83" x2="153" y2="99" stroke="#475569" strokeWidth="2" />
          <line x1="146" y1="87" x2="160" y2="95" stroke="#475569" strokeWidth="2" />
          <line x1="146" y1="95" x2="160" y2="87" stroke="#475569" strokeWidth="2" />
          <circle cx="153" cy="91" r="2.5" fill="#CBD5E1" />
        </g>
      </g>
    </svg>
  );
}

/**
 * 3. CAMIÓN TURBO REALISTA (NHR / NKR Furgón Mudancero)
 */
export function CamionTurboIllustration({
  className = "",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto drop-shadow-md ${className}`}
    >
      <defs>
        <linearGradient
          id="turboCabGrad"
          x1="15"
          y1="25"
          x2="65"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="60%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        <linearGradient
          id="turboFurgonGrad"
          x1="60"
          y1="12"
          x2="185"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#047857" />
          <stop offset="100%" stopColor="#064E3B" />
        </linearGradient>

        <linearGradient
          id="roofDeflector"
          x1="15"
          y1="10"
          x2="60"
          y2="30"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#047857" />
        </linearGradient>

        <filter id="turboShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="100" cy="108" rx="88" ry="6" fill="#000000" opacity="0.45" />

      <g filter="url(#turboShadow)">
        {/* MAIN HEAVY STEEL CHASSIS RAILS */}
        <rect
          x="25"
          y="84"
          width="162"
          height="10"
          rx="2"
          fill="#0F172A"
          stroke="#1E293B"
          strokeWidth="1"
        />
        <rect
          x="75"
          y="86"
          width="28"
          height="7"
          rx="3"
          fill="#94A3B8"
          stroke="#CBD5E1"
          strokeWidth="0.8"
        />
        <rect
          x="108"
          y="86"
          width="20"
          height="7"
          rx="1.5"
          fill="#334155"
          stroke="#475569"
          strokeWidth="0.8"
        />

        {/* FURGÓN / CARROCERÍA DE CARGA CERRADA */}
        <rect
          x="62"
          y="14"
          width="125"
          height="72"
          rx="3"
          fill="url(#turboFurgonGrad)"
          stroke="#34D399"
          strokeWidth="1.5"
        />

        {/* Roof Trim & Corner Protectors */}
        <rect
          x="60"
          y="12"
          width="129"
          height="4"
          rx="1.5"
          fill="#E2E8F0"
          stroke="#94A3B8"
          strokeWidth="0.8"
        />
        <rect
          x="184"
          y="12"
          width="4"
          height="74"
          rx="1"
          fill="#E2E8F0"
          stroke="#94A3B8"
          strokeWidth="0.8"
        />

        {/* Vertical Corrugated Aluminum Panels */}
        <line x1="85" y1="16" x2="85" y2="84" stroke="#065F46" strokeWidth="2" />
        <line x1="86" y1="16" x2="86" y2="84" stroke="#6EE7B7" strokeWidth="0.8" opacity="0.5" />

        <line x1="110" y1="16" x2="110" y2="84" stroke="#065F46" strokeWidth="2" />
        <line x1="111" y1="16" x2="111" y2="84" stroke="#6EE7B7" strokeWidth="0.8" opacity="0.5" />

        <line x1="135" y1="16" x2="135" y2="84" stroke="#065F46" strokeWidth="2" />
        <line x1="136" y1="16" x2="136" y2="84" stroke="#6EE7B7" strokeWidth="0.8" opacity="0.5" />

        <line x1="160" y1="16" x2="160" y2="84" stroke="#065F46" strokeWidth="2" />
        <line x1="161" y1="16" x2="161" y2="84" stroke="#6EE7B7" strokeWidth="0.8" opacity="0.5" />

        {/* Side Access Cargo Door */}
        <rect
          x="92"
          y="30"
          width="36"
          height="50"
          rx="1"
          fill="none"
          stroke="#A7F3D0"
          strokeWidth="1.2"
          strokeDasharray="4 2"
        />
        <rect
          x="124"
          y="52"
          width="3"
          height="7"
          rx="1"
          fill="#E2E8F0"
          stroke="#475569"
          strokeWidth="0.8"
        />

        {/* Reflective Safety Tape Strip */}
        <rect x="64" y="78" width="18" height="3" fill="#FACC15" rx="0.5" />
        <rect x="85" y="78" width="18" height="3" fill="#FFFFFF" rx="0.5" />
        <rect x="106" y="78" width="18" height="3" fill="#FACC15" rx="0.5" />
        <rect x="127" y="78" width="18" height="3" fill="#FFFFFF" rx="0.5" />
        <rect x="148" y="78" width="18" height="3" fill="#FACC15" rx="0.5" />
        <rect x="169" y="78" width="16" height="3" fill="#EF4444" rx="0.5" />

        {/* CABINA CHATA TIPO NHR/NKR */}
        <path
          d="M26 28L58 14H64V36H24L26 28Z"
          fill="url(#roofDeflector)"
          stroke="#10B981"
          strokeWidth="1.2"
        />

        <path
          d="M14 84L15 42C15 38 18 36 22 36H62V86H18L14 84Z"
          fill="url(#turboCabGrad)"
          stroke="#CBD5E1"
          strokeWidth="1.5"
        />

        {/* Panoramic Wide Windshield */}
        <path
          d="M16 43H58V62H16V43Z"
          fill="#0284C7"
          fillOpacity="0.4"
          stroke="#38BDF8"
          strokeWidth="1.2"
        />
        <line
          x1="22"
          y1="60"
          x2="42"
          y2="45"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />
        <line
          x1="25"
          y1="62"
          x2="33"
          y2="52"
          stroke="#1E293B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="42"
          y1="62"
          x2="50"
          y2="52"
          stroke="#1E293B"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Side Door Window & Line */}
        <path
          d="M46 45H58V58H46V45Z"
          fill="#0284C7"
          fillOpacity="0.45"
          stroke="#38BDF8"
          strokeWidth="0.8"
        />
        <line x1="44" y1="42" x2="44" y2="82" stroke="#94A3B8" strokeWidth="1" />
        <rect x="47" y="66" width="5" height="2" rx="0.5" fill="#334155" />

        {/* Front Double Mirrors */}
        <path d="M12 40L6 44V60" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" />
        <rect
          x="3"
          y="44"
          width="5"
          height="12"
          rx="1.5"
          fill="#0F172A"
          stroke="#475569"
          strokeWidth="0.8"
        />
        <rect
          x="3"
          y="58"
          width="5"
          height="6"
          rx="1"
          fill="#0F172A"
          stroke="#475569"
          strokeWidth="0.8"
        />

        {/* Front Headlight Cluster */}
        <rect
          x="13"
          y="68"
          width="5"
          height="11"
          rx="1"
          fill="#FEF08A"
          stroke="#FACC15"
          strokeWidth="1"
        />
        <rect x="13" y="68" width="5" height="4" fill="#FB923C" />

        {/* Front Bumper & Low Fog Lights */}
        <path
          d="M11 78H26V86H13C11.5 86 10.5 84.5 11 83V78Z"
          fill="#334155"
          stroke="#475569"
          strokeWidth="1"
        />
        <circle cx="15" cy="82" r="1.8" fill="#FEF08A" />

        {/* Wheel Wells */}
        <path d="M22 86A16 16 0 0 1 54 86Z" fill="#0F172A" />
        <path d="M136 86A18 18 0 0 1 174 86Z" fill="#0F172A" />

        {/* FRONT HEAVY-DUTY WHEEL */}
        <g>
          <circle cx="38" cy="91" r="15" fill="#18181B" stroke="#09090B" strokeWidth="1.5" />
          <circle cx="38" cy="91" r="9.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          <circle cx="38" cy="91" r="4.5" fill="#0F172A" />
          <circle cx="36" cy="89" r="1" fill="#18181B" />
          <circle cx="40" cy="89" r="1" fill="#18181B" />
          <circle cx="36" cy="93" r="1" fill="#18181B" />
          <circle cx="40" cy="93" r="1" fill="#18181B" />
          <circle cx="38" cy="91" r="2" fill="#E2E8F0" />
        </g>

        {/* REAR DUAL WHEEL ASSEMBLY */}
        <g>
          <circle cx="151" cy="91" r="15" fill="#09090B" />
          <circle cx="155" cy="91" r="15" fill="#18181B" stroke="#09090B" strokeWidth="1.5" />
          <circle cx="155" cy="91" r="9.5" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          <circle cx="155" cy="91" r="4.5" fill="#0F172A" />
          <circle cx="153" cy="89" r="1" fill="#18181B" />
          <circle cx="157" cy="89" r="1" fill="#18181B" />
          <circle cx="153" cy="93" r="1" fill="#18181B" />
          <circle cx="157" cy="93" r="1" fill="#18181B" />
          <circle cx="155" cy="91" r="2" fill="#E2E8F0" />
        </g>
      </g>
    </svg>
  );
}

/**
 * 4. CAMIÓN GRANDE / SENCILLO REALISTA (Carga Pesada & Mudanza Nacional)
 */
export function CamionGrandeIllustration({
  className = "",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <svg
      viewBox="0 0 200 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-full h-auto drop-shadow-md ${className}`}
    >
      <defs>
        <linearGradient
          id="heavyCabGrad"
          x1="10"
          y1="20"
          x2="60"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="50%" stopColor="#6D28D9" />
          <stop offset="100%" stopColor="#4C1D95" />
        </linearGradient>

        <linearGradient
          id="heavyBodyGrad"
          x1="55"
          y1="10"
          x2="190"
          y2="85"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#374151" />
          <stop offset="60%" stopColor="#1F2937" />
          <stop offset="100%" stopColor="#111827" />
        </linearGradient>

        <linearGradient
          id="heavyTarpGrad"
          x1="55"
          y1="10"
          x2="190"
          y2="40"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        <filter id="heavyShadow" x="-10%" y="-10%" width="120%" height="130%">
          <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Ground Shadow */}
      <ellipse cx="100" cy="108" rx="90" ry="6" fill="#000000" opacity="0.45" />

      <g filter="url(#heavyShadow)">
        {/* HEAVY REINFORCED CHASSIS FRAME */}
        <rect
          x="20"
          y="85"
          width="172"
          height="10"
          rx="2"
          fill="#09090B"
          stroke="#27272A"
          strokeWidth="1"
        />
        <rect
          x="68"
          y="85"
          width="35"
          height="9"
          rx="3.5"
          fill="#CBD5E1"
          stroke="#F1F5F9"
          strokeWidth="1"
        />
        <rect
          x="108"
          y="86"
          width="22"
          height="7"
          rx="1.5"
          fill="#475569"
          stroke="#64748B"
          strokeWidth="0.8"
        />

        {/* CARROCERÍA EXTRA LARGA */}
        <path
          d="M58 14C58 12 60 10 64 10H186C189 10 191 12 191 15V44H58V14Z"
          fill="url(#heavyTarpGrad)"
          stroke="#C4B5FD"
          strokeWidth="1.2"
        />
        {/* Carpa Straps & Fasteners */}
        <line
          x1="80"
          y1="12"
          x2="78"
          y2="44"
          stroke="#EDE9FE"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <line
          x1="105"
          y1="12"
          x2="103"
          y2="44"
          stroke="#EDE9FE"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <line
          x1="130"
          y1="12"
          x2="128"
          y2="44"
          stroke="#EDE9FE"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <line
          x1="155"
          y1="12"
          x2="153"
          y2="44"
          stroke="#EDE9FE"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />
        <line
          x1="178"
          y1="12"
          x2="176"
          y2="44"
          stroke="#EDE9FE"
          strokeWidth="1.5"
          strokeDasharray="3 2"
        />

        {/* Lower High-Capacity Stake Body */}
        <rect
          x="58"
          y="44"
          width="133"
          height="42"
          rx="2"
          fill="url(#heavyBodyGrad)"
          stroke="#4B5563"
          strokeWidth="1.5"
        />
        <line x1="60" y1="54" x2="190" y2="54" stroke="#9CA3AF" strokeWidth="1.5" opacity="0.6" />
        <line x1="60" y1="64" x2="190" y2="64" stroke="#9CA3AF" strokeWidth="1.5" opacity="0.6" />
        <line x1="60" y1="74" x2="190" y2="74" stroke="#9CA3AF" strokeWidth="1.5" opacity="0.6" />

        {/* Vertical Heavy Steel Stakes */}
        <line x1="75" y1="44" x2="75" y2="86" stroke="#1F2937" strokeWidth="3.5" />
        <line x1="95" y1="44" x2="95" y2="86" stroke="#1F2937" strokeWidth="3.5" />
        <line x1="115" y1="44" x2="115" y2="86" stroke="#1F2937" strokeWidth="3.5" />
        <line x1="135" y1="44" x2="135" y2="86" stroke="#1F2937" strokeWidth="3.5" />
        <line x1="155" y1="44" x2="155" y2="86" stroke="#1F2937" strokeWidth="3.5" />
        <line x1="175" y1="44" x2="175" y2="86" stroke="#1F2937" strokeWidth="3.5" />

        {/* National Highway Safety Reflectors */}
        <rect x="60" y="80" width="18" height="3" fill="#FACC15" rx="0.5" />
        <rect x="82" y="80" width="18" height="3" fill="#FFFFFF" rx="0.5" />
        <rect x="104" y="80" width="18" height="3" fill="#FACC15" rx="0.5" />
        <rect x="126" y="80" width="18" height="3" fill="#FFFFFF" rx="0.5" />
        <rect x="148" y="80" width="18" height="3" fill="#FACC15" rx="0.5" />
        <rect x="170" y="80" width="20" height="3" fill="#EF4444" rx="0.5" />

        {/* Vertical Exhaust Stack */}
        <line
          x1="56"
          y1="8"
          x2="56"
          y2="70"
          stroke="#E2E8F0"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <line
          x1="56"
          y1="6"
          x2="59"
          y2="4"
          stroke="#CBD5E1"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <rect
          x="54"
          y="24"
          width="4"
          height="30"
          rx="1"
          fill="#94A3B8"
          stroke="#F1F5F9"
          strokeWidth="0.5"
        />

        {/* Aerodynamic Roof Sun Visor with Clearance Marker Lights */}
        <path d="M12 28L18 24H54V32H16L12 28Z" fill="#1E1B4B" stroke="#6D28D9" strokeWidth="1" />
        <circle cx="24" cy="26" r="1.5" fill="#FEF08A" />
        <circle cx="34" cy="26" r="1.5" fill="#FEF08A" />
        <circle cx="44" cy="26" r="1.5" fill="#FEF08A" />

        {/* Cabin Shell */}
        <path
          d="M12 85L13 46C13 42 16 38 22 36H56V86H18L12 85Z"
          fill="url(#heavyCabGrad)"
          stroke="#8B5CF6"
          strokeWidth="1.5"
        />

        {/* Deep Windshield with Sunband Tint */}
        <path
          d="M15 44H52V62H15V44Z"
          fill="#0284C7"
          fillOpacity="0.45"
          stroke="#38BDF8"
          strokeWidth="1.2"
        />
        <rect x="15" y="44" width="37" height="4" fill="#0369A1" fillOpacity="0.7" />
        <line
          x1="20"
          y1="60"
          x2="38"
          y2="46"
          stroke="#FFFFFF"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.8"
        />

        {/* Door Panel & Handle */}
        <line x1="42" y1="44" x2="42" y2="82" stroke="#4C1D95" strokeWidth="1.5" />
        <rect x="44" y="65" width="5" height="2" rx="0.5" fill="#E2E8F0" />

        {/* West-Coast Heavy Dual Mirrors */}
        <path d="M10 40L4 44V64" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
        <rect
          x="1"
          y="44"
          width="5"
          height="14"
          rx="1.5"
          fill="#0F172A"
          stroke="#E2E8F0"
          strokeWidth="1"
        />
        <rect
          x="1"
          y="60"
          width="5"
          height="6"
          rx="1"
          fill="#0F172A"
          stroke="#E2E8F0"
          strokeWidth="1"
        />

        {/* Heavy Duty Chrome Front Bumper & Headlights */}
        <path
          d="M8 76H22V86H10C8.5 86 7.5 84.5 8 83V76Z"
          fill="#E2E8F0"
          stroke="#FFFFFF"
          strokeWidth="1.2"
        />
        <rect x="9" y="78" width="4" height="4" rx="0.5" fill="#FEF08A" />
        <rect x="9" y="82" width="4" height="2.5" rx="0.5" fill="#FB923C" />

        {/* HEAVY COMMERCIAL WHEELSETS */}
        {/* Front Steer Wheel */}
        <g>
          <circle cx="35" cy="92" r="16" fill="#18181B" stroke="#09090B" strokeWidth="1.5" />
          <circle cx="35" cy="92" r="10" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          <circle cx="35" cy="92" r="5" fill="#0F172A" />
          <circle cx="35" cy="86" r="0.8" fill="#18181B" />
          <circle cx="39" cy="88" r="0.8" fill="#18181B" />
          <circle cx="41" cy="92" r="0.8" fill="#18181B" />
          <circle cx="39" cy="96" r="0.8" fill="#18181B" />
          <circle cx="35" cy="98" r="0.8" fill="#18181B" />
          <circle cx="31" cy="96" r="0.8" fill="#18181B" />
          <circle cx="29" cy="92" r="0.8" fill="#18181B" />
          <circle cx="31" cy="88" r="0.8" fill="#18181B" />
          <circle cx="35" cy="92" r="2.5" fill="#CBD5E1" />
        </g>

        {/* Rear Dual Wheels */}
        <g>
          <circle cx="145" cy="92" r="16" fill="#09090B" />
          <circle cx="150" cy="92" r="16" fill="#18181B" stroke="#09090B" strokeWidth="1.5" />
          <circle cx="150" cy="92" r="10" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          <circle cx="150" cy="92" r="5" fill="#0F172A" />
          <circle cx="150" cy="92" r="2.5" fill="#CBD5E1" />
        </g>

        <g>
          <circle cx="170" cy="92" r="16" fill="#09090B" />
          <circle cx="175" cy="92" r="16" fill="#18181B" stroke="#09090B" strokeWidth="1.5" />
          <circle cx="175" cy="92" r="10" fill="#E2E8F0" stroke="#64748B" strokeWidth="1.2" />
          <circle cx="175" cy="92" r="5" fill="#0F172A" />
          <circle cx="175" cy="92" r="2.5" fill="#CBD5E1" />
        </g>
      </g>
    </svg>
  );
}
