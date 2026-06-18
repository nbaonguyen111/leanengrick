"use client";

import { Volume2, Heart } from "lucide-react";
import cat from "../assets/Ghim trên Sizin Pinleriniz.gif";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-md border-t border-gray-200/60 mt-auto">
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-600 rounded-lg">
              <Volume2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NóiNhanh
            </span>
          </div>

          <p className="text-xs text-gray-500 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for Vietnamese learners
          </p>
             <div className="mascot fixed top-2 right-6 z-50">
              <Image src={cat} alt="mascot" className="w-10" />
            </div>
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} NóiNhanh. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}