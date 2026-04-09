"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endDate: Date;
  style?: "digital" | "circular" | "minimal";
  label?: string;
  onExpire?: () => void;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(endDate: Date): TimeLeft | null {
  const diff = endDate.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ endDate, style = "digital", label = "Sale ends in", onExpire }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(getTimeLeft(endDate));

  useEffect(() => {
    const timer = setInterval(() => {
      const tl = getTimeLeft(endDate);
      setTimeLeft(tl);
      if (!tl) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [endDate, onExpire]);

  if (!timeLeft) {
    return <p className="text-xs text-red font-medium">Sale ended</p>;
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  if (style === "minimal") {
    return (
      <div className="flex items-center gap-1.5 text-red">
        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="text-xs font-semibold">
          {timeLeft.days > 0 && `${timeLeft.days}d `}{pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
        </span>
      </div>
    );
  }

  if (style === "circular") {
    const units = [
      { label: "Days", value: timeLeft.days, max: 30 },
      { label: "Hrs", value: timeLeft.hours, max: 24 },
      { label: "Min", value: timeLeft.minutes, max: 60 },
      { label: "Sec", value: timeLeft.seconds, max: 60 },
    ];

    return (
      <div>
        {label && <p className="text-[10px] text-text-4 uppercase tracking-wider font-semibold mb-2">{label}</p>}
        <div className="flex gap-2">
          {units.map((u) => {
            const pct = (u.value / u.max) * 100;
            const r = 18;
            const c = 2 * Math.PI * r;
            const offset = c - (pct / 100) * c;
            return (
              <div key={u.label} className="flex flex-col items-center">
                <div className="relative w-12 h-12">
                  <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r={r} fill="none" stroke="#e5e7eb" strokeWidth="3" />
                    <circle cx="22" cy="22" r={r} fill="none" stroke="#C8191C" strokeWidth="3"
                      strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
                      className="transition-all duration-1000" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-text-1">
                    {pad(u.value)}
                  </span>
                </div>
                <span className="text-[9px] text-text-4 mt-0.5">{u.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Digital style (default)
  const blocks = [
    { label: "Days", value: pad(timeLeft.days) },
    { label: "Hrs", value: pad(timeLeft.hours) },
    { label: "Min", value: pad(timeLeft.minutes) },
    { label: "Sec", value: pad(timeLeft.seconds) },
  ];

  return (
    <div>
      {label && <p className="text-[10px] text-text-4 uppercase tracking-wider font-semibold mb-2">{label}</p>}
      <div className="flex gap-1.5">
        {blocks.map((b, i) => (
          <div key={b.label} className="flex items-center gap-1.5">
            <div className="bg-navy text-white rounded-lg w-11 h-11 flex flex-col items-center justify-center">
              <span className="text-base font-bold leading-none">{b.value}</span>
              <span className="text-[7px] text-white/50 uppercase">{b.label}</span>
            </div>
            {i < blocks.length - 1 && <span className="text-text-4 font-bold text-sm">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
