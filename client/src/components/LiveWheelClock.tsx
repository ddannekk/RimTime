import { useEffect, useMemo, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface LiveWheelClockProps {
  image: string;
  name: string;
}

export default function LiveWheelClock({ image, name }: LiveWheelClockProps) {
  const [time, setTime] = useState(() => Date.now());
  const rotateXMotion = useMotionValue(0);
  const rotateYMotion = useMotionValue(0);
  const rotateX = useSpring(rotateXMotion, { stiffness: 140, damping: 18, mass: 0.5 });
  const rotateY = useSpring(rotateYMotion, { stiffness: 140, damping: 18, mass: 0.5 });
  const glareX = useTransform(rotateY, [-10, 10], ["35%", "65%"]);
  const glareY = useTransform(rotateX, [-10, 10], ["30%", "60%"]);

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      setTime(Date.now());
      frame = window.requestAnimationFrame(tick);
    };

    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const rotations = useMemo(() => {
    const current = new Date(time);
    const seconds = current.getSeconds() + current.getMilliseconds() / 1000;
    const minutes = current.getMinutes() + seconds / 60;
    const hours = (current.getHours() % 12) + minutes / 60;

    return {
      second: seconds * 6,
      minute: minutes * 6,
      hour: hours * 30,
    };
  }, [time]);

  return (
    <div className="relative mx-auto flex w-full max-w-[34rem] items-center justify-center [perspective:1400px]">
      <div className="pointer-events-none absolute inset-x-8 bottom-2 h-10 rounded-full bg-black/20 blur-2xl dark:bg-accent/15" />
      <motion.div
        style={{ rotateX, rotateY }}
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
        className="relative aspect-square w-full rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.28),_rgba(255,255,255,0)_45%),linear-gradient(145deg,_rgba(255,255,255,0.12),_rgba(0,0,0,0.16))] p-6 shadow-[0_40px_90px_rgba(15,23,42,0.25)] backdrop-blur-sm"
      >
        <div className="relative flex h-full items-center justify-center overflow-hidden rounded-full border border-white/10 bg-[radial-gradient(circle_at_50%_35%,_rgba(255,255,255,0.26),_rgba(255,255,255,0)_35%),linear-gradient(145deg,_rgba(255,255,255,0.2),_rgba(0,0,0,0.35))] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),inset_0_-30px_60px_rgba(0,0,0,0.25)]">
          <div className="absolute inset-[10%] rounded-full border border-white/14 bg-black/15 shadow-[inset_0_18px_35px_rgba(255,255,255,0.12),inset_0_-24px_40px_rgba(0,0,0,0.3)]" />
          <div className="absolute inset-[18%] rounded-full overflow-hidden border border-white/12">
            <img src={image} alt={name} className="h-full w-full object-cover" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(15,23,42,0)_35%,_rgba(15,23,42,0.58)_100%)]" />
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

          <motion.div
            animate={{ rotate: rotations.hour }}
            transition={{ duration: 0.12, ease: "linear" }}
            className="absolute h-[28%] w-1.5 origin-bottom rounded-full bg-slate-100 shadow-[0_0_16px_rgba(255,255,255,0.35)]"
            style={{ bottom: "50%" }}
          />
          <motion.div
            animate={{ rotate: rotations.minute }}
            transition={{ duration: 0.12, ease: "linear" }}
            className="absolute h-[36%] w-1 origin-bottom rounded-full bg-orange-200 shadow-[0_0_16px_rgba(251,146,60,0.35)]"
            style={{ bottom: "50%" }}
          />
          <motion.div
            animate={{ rotate: rotations.second }}
            transition={{ duration: 0.06, ease: "linear" }}
            className="absolute h-[40%] w-[2px] origin-bottom rounded-full bg-accent shadow-[0_0_18px_rgba(234,88,12,0.65)]"
            style={{ bottom: "50%" }}
          />
          <div className="absolute h-5 w-5 rounded-full border border-white/30 bg-accent shadow-[0_0_25px_rgba(234,88,12,0.6)]" />
        </div>
      </motion.div>
    </div>
  );
}
