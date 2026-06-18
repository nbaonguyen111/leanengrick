"use client";

import {
  UtensilsCrossed,
  Hotel,
  Car,
  ShoppingBag,
  Ambulance,
  Heart,
  Plane,
} from "lucide-react";
import { Group } from "@/types";

const iconMap: Record<string, React.ReactNode> = {
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
  Hotel: <Hotel className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
  Ambulance: <Ambulance className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Plane: <Plane className="w-5 h-5" />,
};

interface CategoriesProps {
  groups: Group[];
  selectedGroup: string | null;
  onSelectGroup: (groupId: string | null) => void;
}

export default function Categories({
  groups,
  selectedGroup,
  onSelectGroup,
}: CategoriesProps) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
        Danh mục
      </h2>
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => onSelectGroup(null)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selectedGroup === null
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => onSelectGroup(group.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              selectedGroup === group.id
                ? "bg-emerald-600 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {iconMap[group.icon]}
            <span>{group.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}