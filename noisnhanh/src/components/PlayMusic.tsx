"use client";

import { useEffect, useRef } from "react";

export default function ClickToPlayMusic({
  onStart,
}: {
  onStart: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/audiobg.mp3");
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
  }, []);

  const handleClick = () => {
    audioRef.current?.play().catch(() => {});
    onStart(); // <-- đóng overlay
  };

  return (
    <div
      onClick={handleClick}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80"
    >
      <p className="text-white text-xl animate-pulse">
        Click bất kỳ để phát nhạc
      </p>
    </div>
  );
}