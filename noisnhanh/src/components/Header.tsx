"use client";

import { Search, Volume2, Plus, Crown } from "lucide-react";

interface HeaderProps {
  query: string;
  onQueryChange: (value: string) => void;
  onAddClick: () => void;
  hasSubscription?: boolean;
  onUpgradeClick?: () => void;
}

export default function Header({ query, onQueryChange, onAddClick, hasSubscription, onUpgradeClick }: HeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-50 shadow-sm">
      <div className="max-w-3xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-emerald-600 rounded-lg">
              <Volume2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              NóiNhanh
            </h1>
            {hasSubscription && (
              <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full">
                <Crown className="w-3.5 h-3.5 text-white" />
                <span className="text-xs font-bold text-white">Premium</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {!hasSubscription && onUpgradeClick && (
              <button
                onClick={onUpgradeClick}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all shadow-sm hover:shadow-md"
              >
                <Crown className="w-4 h-4" />
                <span>Nâng cấp</span>
              </button>
            )}
            <button
              onClick={onAddClick}
              className="flex items-center gap-1.5 px-4 py-2.5 text-white text-sm font-semibold rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all shadow-sm hover:shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm câu</span>
            </button>
          </div>
        </div>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-emerald-600 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Tìm câu tiếng Anh theo tình huống..."
            className="w-full pl-11 pr-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all placeholder:text-gray-400"
          />
        </div>
      </div>
    </header>
  );
}