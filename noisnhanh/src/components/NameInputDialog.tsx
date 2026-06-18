"use client";

import { useState, useEffect, useCallback } from "react";
import ClickToPlayMusic from "@/components/PlayMusic";
interface NameInputDialogProps {
  onSubmit: (name: string) => void;
}

export default function NameInputDialog({ onSubmit }: NameInputDialogProps) {
  const [name, setName] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showInput, setShowInput] = useState(false);
  const [error, setError] = useState("");
  const [showMusicOverlay, setShowMusicOverlay] = useState(true);
  const fullText = "Hey! Nhập tên vào đi ní";

  // Typewriter effect
  useEffect(() => {
    if (!isTyping) return;

    let index = 0;
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setDisplayedText(fullText.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        setShowInput(true);
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [isTyping]);

  const handleSubmit = useCallback(() => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Vui lòng nhập tên của bạn!");
      return;
    }
    if (trimmed.length < 2) {
      setError("Tên phải có ít nhất 2 ký tự!");
      return;
    }
    onSubmit(trimmed);
  }, [name, onSubmit]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && showInput && !isTyping) {
      handleSubmit();
    }
  }, [showInput, isTyping, handleSubmit]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center pb-8 md:pb-16 px-4">
      {/* Background */}
      {showMusicOverlay && (
  <ClickToPlayMusic onStart={() => setShowMusicOverlay(false)} />
)}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-800 to-gray-700">
        {/* Minimal stars */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full"
              style={{
                width: `${Math.random() * 2 + 1}px`,
                height: `${Math.random() * 2 + 1}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 50}%`,
                opacity: Math.random() * 0.6 + 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Character + Dialogue Container */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Dialogue Box */}
        <div className="relative mb-4">
          {/* Arrow pointing down */}
          {/* <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20">
            <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-t-[20px] border-t-white" />
          </div> */}

          {/* Main dialogue box */}
          <div className="relative bg-white rounded-lg shadow-xl border-2 border-gray-300 p-6 md:p-8">
            {/* Character name tag */}
            <div className="inline-block bg-gray-800 text-white px-3 py-1 rounded-t-lg rounded-br-lg text-sm font-bold mb-3">
              Goku
            </div>

            {/* Dialogue text with typewriter */}
            <div className="bg-gray-50 rounded-lg p-4 min-h-[60px] border border-gray-200">
              <p className="text-gray-800 text-lg md:text-xl font-medium">
                {displayedText}
                {isTyping && (
                  <span className="inline-block w-0.5 h-5 bg-gray-800 ml-1 animate-pulse" />
                )}
              </p>
            </div>

            {/* Input area */}
            {showInput && !isTyping && (
              <div className="mt-4 space-y-3">
                <div className="relative bg-white rounded-[2rem] shadow-lg overflow-hidden"
                     style={{
                       boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.8)'
                     }}>
                  {/* Cloud-like border effect */}
                  <div className="absolute inset-0 rounded-[2rem] border-[6px] border-white/80"
                       style={{
                         boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.05), 0 2px 8px rgba(0, 0, 0, 0.1)'
                       }} />
                  <div className="relative flex items-center px-5 py-3">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        setError("");
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Nhập tên của bạn..."
                      className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none font-medium text-lg"
                      autoFocus
                      maxLength={20}
                    />
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 border border-red-300 rounded-lg px-4 py-2">
                    <p className="text-red-600 text-sm font-medium text-center">
                      {error}
                    </p>
                  </div>
                )}

                {/* Submit button */}
                <button
                  onClick={handleSubmit}
                  disabled={!name.trim()}
                  className="w-full py-3 px-6 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-colors"
                >
                  XÁC NHẬN
                </button>
              </div>
            )}

            {/* Hint text while typing */}
            {isTyping && (
              <div className="mt-3 text-center">
                <span className="text-gray-400 text-sm">
                  Đang đọc...
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Character */}
        <div className="relative flex justify-center">
          {/* Character shadow */}
          <div className="absolute bottom-0 w-24 h-3 bg-black/40 rounded-full blur-md" />

          {/* Character */}
          <div className="relative text-8xl md:text-9xl leading-none filter drop-shadow-xl">
            <img src="/nFZpE-Photoroom.png" alt="Mascot" className="w-full h-full md:w-100 md:h-50 object-contain" />
          </div>
        </div>
      </div>
    </div>
  );
}