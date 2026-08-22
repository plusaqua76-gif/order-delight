import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useMotionValue } from "motion/react";
import { NubexLogo } from "@/components/NubexLogo";
import { DELIVERY_FEE } from "@/data/demo";
import { cop } from "@/lib/format";

interface ParallaxHeroProps {
  onSearchFocus?: () => void;
}

export function ParallaxHero({ onSearchFocus }: ParallaxHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const bgY = useTransform(smoothProgress, [0, 1], ["0%", "35%"]);
  const orb1Y = useTransform(smoothProgress, [0, 1], ["0%", "-40%"]);
  const orb2Y = useTransform(smoothProgress, [0, 1], ["0%", "50%"]);
  const floatingBadgeY = useTransform(smoothProgress, [0, 1], ["0%", "-25%"]);
  const textY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  const opacity = useTransform(smoothProgress, [0, 0.8], [1, 0.3]);

  // Cursor 3D Tilt Parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [8, -8]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-8, 8]), {
    stiffness: 150,
    damping: 20,
  });
  const shineX = useTransform(mouseX, [-0.5, 0.5], ["0%", "100%"]);
  const shineY = useTransform(mouseY, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative mt-4 perspective-[1000px] select-none"
    >
      <motion.section
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="hero-gradient relative overflow-hidden rounded-3xl p-6 sm:p-10 text-primary-foreground shadow-[0_20px_50px_rgba(0,174,255,0.22)] border border-cyan-500/30 transition-shadow duration-300"
      >
        {/* Dynamic Sheen/Gloss following mouse in 3D */}
        <motion.div
          className="pointer-events-none absolute -inset-full opacity-20 transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(0,229,255,0.3) 30%, transparent 70%)",
            left: shineX,
            top: shineY,
          }}
        />

        {/* Parallax Layer 1: Background Nebulas & Glow Orbs */}
        <motion.div
          style={{ y: bgY }}
          className="pointer-events-none absolute -top-24 -left-24 size-80 rounded-full bg-cyan-500/20 blur-3xl"
        />
        <motion.div
          style={{ y: orb1Y }}
          className="pointer-events-none absolute -bottom-20 -right-20 size-72 rounded-full bg-blue-600/30 blur-3xl"
        />
        <motion.div
          style={{ y: orb2Y }}
          className="pointer-events-none absolute top-1/2 left-1/3 size-48 rounded-full bg-cyan-300/15 blur-2xl"
        />

        {/* Parallax Layer 2: Floating Ambient Tech Grid Lines */}
        <motion.div
          style={{ y: bgY }}
          className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#00E5FF_1px,transparent_1px)] [background-size:20px_20px]"
        />

        {/* Content Container (Layer with mid depth) */}
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          {/* Left Column: Text & Badges */}
          <motion.div style={{ y: textY, opacity }} className="max-w-xl translate-z-8">
            {/* Top Pill with live pulse */}
            <div className="inline-flex items-center gap-2 rounded-full bg-black/40 backdrop-blur-md px-3.5 py-1.5 text-xs font-semibold tracking-wide text-cyan-200 border border-cyan-400/30 shadow-sm">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-cyan-300" />
              </span>
              <span>Pitalito · Huila · Domicilios al instante</span>
            </div>

            {/* Main Headline */}
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl text-white tracking-tight">
              Tu comida favorita llega en minutos con{" "}
              <span className="bg-gradient-to-r from-white via-cyan-200 to-[#38BDF8] bg-clip-text text-transparent drop-shadow-sm">
                Domicilios Nubex
              </span>
            </h1>

            <p className="mt-3.5 max-w-md text-sm sm:text-base text-cyan-100/90 leading-relaxed font-normal">
              Elige tu restaurante aliado en Pitalito, personaliza tu orden y confírmala directo por
              WhatsApp. Domicilio fijo de{" "}
              <strong className="text-white font-bold underline decoration-cyan-400/60 underline-offset-4">
                {cop(DELIVERY_FEE)}
              </strong>{" "}
              en toda la ciudad.
            </p>

            {/* Parallax Floating Feature Chips */}
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <motion.span
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-black/30 backdrop-blur border border-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-sm"
              >
                <span>⚡</span>
                <span>Entrega rápida</span>
              </motion.span>

              <motion.span
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-black/30 backdrop-blur border border-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-sm"
              >
                <span>🛵</span>
                <span>Tarifa fija {cop(DELIVERY_FEE)}</span>
              </motion.span>

              <motion.span
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-1.5 rounded-xl bg-black/30 backdrop-blur border border-white/10 px-3 py-1.5 text-xs font-medium text-white shadow-sm"
              >
                <span>💬</span>
                <span>Directo a WhatsApp</span>
              </motion.span>
            </div>
          </motion.div>

          {/* Right Column: 3D Parallax Badge & Interactive Logo Card */}
          <motion.div
            style={{ y: floatingBadgeY }}
            className="relative flex flex-col items-center justify-center translate-z-12"
          >
            {/* Floating Decorative mini-badge 1 (Top Left) */}
            <motion.div
              animate={{
                y: [0, -6, 0],
                rotate: [0, -2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="hidden lg:flex absolute -top-5 -left-6 z-20 items-center gap-1.5 rounded-xl bg-cyan-950/80 backdrop-blur-md border border-cyan-400/40 px-2.5 py-1 text-[11px] font-bold text-cyan-200 shadow-lg"
            >
              <span>🛵</span>
              <span>Huila Express</span>
            </motion.div>

            {/* Floating Decorative mini-badge 2 (Bottom Right) */}
            <motion.div
              animate={{
                y: [0, 6, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="hidden lg:flex absolute -bottom-4 -right-4 z-20 items-center gap-1.5 rounded-xl bg-black/80 backdrop-blur-md border border-cyan-400/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300 shadow-lg"
            >
              <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
              <span>100% Pitalito</span>
            </motion.div>

            {/* Central Glassmorphic Card */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="flex flex-col items-center justify-center p-6 sm:p-7 rounded-2xl bg-black/35 backdrop-blur-xl border border-cyan-400/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] relative group cursor-pointer"
              onClick={onSearchFocus}
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-cyan-400/10 to-transparent pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />

              <NubexLogo size="lg" subtitleText="Pitalito, Huila" />

              <div className="mt-3 flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-cyan-400" />
                <span className="text-xs text-cyan-100 font-semibold tracking-wide">
                  Central de Domicilios Activa
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}
