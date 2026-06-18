"use client";

import { useState } from "react";
import { Volume2, Heart, Copy, Check, Trash2, Pencil } from "lucide-react";
import { Phrase } from "@/types";


interface PhraseCardProps {
  phrase: Phrase;
  isFavorite: boolean;
  isCustom?: boolean;
  currentUserName?: string;
  onToggleFavorite: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function PhraseCard({
  phrase,
  isFavorite,
  isCustom = false,
  currentUserName = "",
  onToggleFavorite,
  onEdit,
  onDelete,
}: PhraseCardProps) {
  // Chỉ hiển thị nút sửa/xóa nếu là câu của chính người dùng này
  const isOwnPhrase = isCustom && currentUserName && phrase.author?.toLowerCase() === currentUserName.toLowerCase();
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);

  const getBestEnglishVoice = (): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    // Ưu tiên giọng chất lượng cao, tránh giọng Google Translate (thường là "Google US English" hoặc "Google Translate")
    const preferredVoices = [
      "Microsoft David",
      "Microsoft Zira",
      "Microsoft Mark",
      "Samantha",
      "Daniel",
      "Karen",
      "Moira",
      "Tingting",
      "Alex",
    ];

    // Tìm giọng ưu tiên trước
    for (const name of preferredVoices) {
      const voice = voices.find((v) => v.name === name && v.lang.startsWith("en"));
      if (voice) return voice;
    }

    // Tìm giọng English không phải Google Translate
    const nonGoogleVoice = voices.find(
      (v) => v.lang.startsWith("en") && !v.name.includes("Google") && !v.name.includes("Translate")
    );
    if (nonGoogleVoice) return nonGoogleVoice;

    // Fallback: lấy giọng English đầu tiên
    const anyEnglishVoice = voices.find((v) => v.lang.startsWith("en"));
    if (anyEnglishVoice) return anyEnglishVoice;

    return null;
  };

  const speak = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase.english_text);
      utterance.lang = "en-US";
      utterance.rate = 0.9;
      utterance.onstart = () => setPlaying(true);
      utterance.onend = () => setPlaying(false);

      const voice = getBestEnglishVoice();
      if (voice) {
        utterance.voice = voice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(phrase.english_text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = phrase.english_text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-gray-200 p-5 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-gray-900 mb-1.5 leading-relaxed group-hover:text-emerald-700 transition-colors">
            {phrase.english_text}
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">{phrase.vietnamese_text}</p>
          {phrase.author && (
            <span className="inline-flex items-center gap-1 mt-2.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              @{phrase.author}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button
            onClick={speak}
            className={`p-2 rounded-lg transition-all ${
              playing
                ? "bg-emerald-100 text-emerald-600 scale-105"
                : "text-gray-400 hover:text-emerald-600 hover:bg-emerald-50"
            }`}
            title="Đọc câu"
          >
            <Volume2 className="w-5 h-5" />
          </button>
          <button
            onClick={copyToClipboard}
            className={`p-2 rounded-lg transition-all ${
              copied
                ? "bg-blue-100 text-blue-600 scale-105"
                : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
            }`}
            title="Sao chép"
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
          <button
            onClick={() => onToggleFavorite(phrase.id)}
            className={`p-2 rounded-lg transition-all ${
              isFavorite
                ? "bg-red-50 text-red-500 scale-105"
                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
            }`}
            title="Yêu thích"
          >
            <Heart
              className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
            />
          </button>
          {isOwnPhrase && onEdit && (
            <button
              onClick={() => onEdit(phrase.id)}
              className="p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
              title="Sửa câu"
            >
              <Pencil className="w-5 h-5" />
            </button>
          )}
          {isOwnPhrase && onDelete && (
            <button
              onClick={() => onDelete(phrase.id)}
              className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
              title="Xóa câu"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}