import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { withBasePath } from "@/lib/paths";

interface LiveWheelClockProps {
  image: string;
  name: string;
}

export default function LiveWheelClock({ image, name }: LiveWheelClockProps) {
  const hourHandRef = useRef<HTMLDivElement>(null);
  const minuteHandRef = useRef<HTMLDivElement>(null);
  const secondHandRef = useRef<HTMLDivElement>(null);
  const rotateXMotion = useMotionValue(0);
  const rotateYMotion = useMotionValue(0);
  const rotateX = useSpring(rotateXMotion, { stiffness: 140, damping: 18, mass: 0.5 });
  const rotateY = useSpring(rotateYMotion, { stiffness: 140, damping: 18, mass: 0.5 });
  const glareX = useTransform(rotateY, [-10, 10], ["35%", "65%"]);
  const glareY = useTransform(rotateX, [-10, 10], ["30%", "60%"]);

  useEffect(() => {
    let frame = 0;

    const updateHands = () => {
      const current = new Date();
      const seconds = current.getSeconds() + current.getMilliseconds() / 1000;
      const minutes = current.getMinutes() + seconds / 60;
      const hours = (current.getHours() % 12) + minutes / 60;

      if (secondHandRef.current) {
        secondHandRef.current.style.transform = `rotate(${seconds * 6}deg)`;
      }
      if (minuteHandRef.current) {
        minuteHandRef.current.style.transform = `rotate(${minutes * 6}deg)`;
      }
      if (hourHandRef.current) {
        hourHandRef.current.style.transform = `rotate(${hours * 30}deg)`;
      }

      frame = window.requestAnimationFrame(updateHands);
    };

    updateHands();
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="relative mx-auto flex w-full max-w-[34rem] min-w-0 items-center justify-center [perspective:1400px]">
      <div className="pointer-events-none absolute inset-x-8 bottom-2 h-10 rounded-full bg-black/20 blur-2xl dark:bg-accent/15" />
      <div className="relative w-full overflow-hidden rounded-[2rem]">
        <div className="pointer-events-none block pt-[100%]" />
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
            WebkitTransformStyle: "preserve-3d",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
            const offsetY = (event.clientY - rect.top) / rect.height - 0.5;
            rotateXMotion.set(offsetY * -10);
            rotateYMotion.set(offsetX * 12);
          }}
          onMouseLeave={() => {
            rotateXMotion.set(0);
            rotateYMotion.set(0);
          }}
          whileHover={{ rotateZ: 3, scale: 1.015 }}
          transition={{ type: "spring", stiffness: 180, damping: 20 }}
          className="absolute inset-0 overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_rgba(255,255,255,0)_45%),linear-gradient(145deg,_rgba(255,255,255,0.12),_rgba(0,0,0,0.16))] p-4 shadow-[0_40px_90px_rgba(15,23,42,0.25)] backdrop-blur-sm sm:p-5 md:p-6"
        >
        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_35%,_rgba(255,255,255,0.26),_rgba(255,255,255,0)_35%),linear-gradient(145deg,_rgba(255,255,255,0.2),_rgba(0,0,0,0.35))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-30px_60px_rgba(0,0,0,0.25)]">
          <div className="absolute inset-[10%] rounded-full border border-white/14 bg-black/15 shadow-[inset_0_18px_35px_rgba(255,255,255,0.12),inset_0_-24px_40px_rgba(0,0,0,0.3)]" />
          <div className="absolute inset-[18%] overflow-hidden rounded-full border border-white/12 shadow-[0_18px_44px_rgba(2,6,23,0.34)]">
            <img src={withBasePath(image)} alt={name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0)_44%,_rgba(15,23,42,0.34)_100%)]" />

            <div className="pointer-events-none absolute inset-0">
              <div ref={hourHandRef} className="absolute inset-0 origin-center will-change-transform">
                <div className="absolute bottom-1/2 left-1/2 h-[14%] w-[4.5%] -translate-x-1/2 overflow-hidden rounded-full bg-[#101820] shadow-[0_1px_5px_rgba(0,0,0,0.6)]">
                  <div className="absolute inset-x-[29%] top-[8%] bottom-[12%] rounded-full bg-[#ef3129]" />
                </div>
              </div>
              <div ref={minuteHandRef} className="absolute inset-0 origin-center will-change-transform">
                <div className="absolute bottom-1/2 left-1/2 h-[25%] w-[3.2%] -translate-x-1/2 overflow-hidden rounded-full bg-[#101820] shadow-[0_1px_6px_rgba(0,0,0,0.62)]">
                  <div className="absolute inset-x-[30%] top-[6%] bottom-[10%] rounded-full bg-[#ef3129]" />
                </div>
              </div>
              <div ref={secondHandRef} className="absolute inset-0 origin-center will-change-transform">
                <div className="absolute bottom-1/2 left-1/2 h-[34%] w-[1.5%] -translate-x-1/2 rounded-full bg-[#ff2d24] shadow-[0_0_10px_rgba(239,68,68,0.5),0_1px_4px_rgba(0,0,0,0.55)]" />
                <div className="absolute left-1/2 top-[15%] h-[3.4%] w-[3.4%] -translate-x-1/2 rounded-full bg-[#ff2d24] shadow-[0_0_9px_rgba(239,68,68,0.48)]" />
              </div>
              <div className="absolute left-1/2 top-1/2 h-[6.4%] w-[6.4%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-200/45 bg-[#ef3b2f] shadow-[0_3px_12px_rgba(0,0,0,0.55),0_0_14px_rgba(239,68,68,0.35)]" />
            </div>
          </div>

          {[...Array(12)].map((_, index) => (
            <div
              key={index}
              className="absolute h-full w-full"
              style={{ transform: `rotate(${index * 30}deg)` }}
            >
              <div className="mx-auto mt-5 h-6 w-[2px] rounded-full bg-white/70 shadow-[0_0_12px_rgba(255,255,255,0.3)]" />
            </div>
          ))}

          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0)_42%,_rgba(255,255,255,0.14)_70%,_rgba(255,255,255,0.22)_100%)]" />
          <motion.div
            style={{ left: glareX, top: glareY }}
            className="absolute h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/18 blur-3xl"
          />

          <div className="absolute h-4 w-4 rounded-full border border-white/25 bg-accent/90 shadow-[0_0_22px_rgba(234,88,12,0.42)]" />
        </div>
      </motion.div>
      </div>
    </div>
  );
}
