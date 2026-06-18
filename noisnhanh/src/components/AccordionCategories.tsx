"use client";

import { useState } from "react";
import {
  ChevronDown,
  UtensilsCrossed,
  Hotel,
  Car,
  ShoppingBag,
  Ambulance,
  Heart,
  Plane,
} from "lucide-react";
import { Group, Phrase, CustomGroup } from "@/types";
import PhraseCard from "./PhraseCard";
import CustomGroupList from "./CustomGroupList";
import { useFavorites } from "@/hooks/useFavorites";

const iconMap: Record<string, React.ReactNode> = {
  UtensilsCrossed: <UtensilsCrossed className="w-5 h-5" />,
  Hotel: <Hotel className="w-5 h-5" />,
  Car: <Car className="w-5 h-5" />,
  ShoppingBag: <ShoppingBag className="w-5 h-5" />,
  Ambulance: <Ambulance className="w-5 h-5" />,
  Heart: <Heart className="w-5 h-5" />,
  Plane: <Plane className="w-5 h-5" />,
};

interface AccordionCategoriesProps {
  groups: Group[];
  allPhrases: Phrase[];
  customGroups: CustomGroup[];
  getPhrasesByCustomGroup: (groupId: string) => Phrase[];
  isCustomPhrase: (id: number) => boolean;
  removePhrase: (id: number) => void;
  onEditPhrase?: (id: number) => void;
  currentUserName?: string;
}

export default function AccordionCategories({
  groups,
  allPhrases,
  customGroups,
  getPhrasesByCustomGroup,
  isCustomPhrase,
  removePhrase,
  onEditPhrase,
  currentUserName,
}: AccordionCategoriesProps) {
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const { isFavorite, toggleFavorite } = useFavorites();

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pb-8 space-y-3 pt-2">
      {groups.map((group) => {
        const isOpen = openGroups.has(group.id);
        const groupPhrases = allPhrases.filter(
          (p) => p.group_id === group.id && !p.custom_group_id
        );
        const relatedCustomGroups = customGroups.filter(
          (g) => g.parent_group_id === group.id
        );
        const totalPhrases =
          groupPhrases.length +
          relatedCustomGroups.reduce(
            (sum, g) => sum + getPhrasesByCustomGroup(g.id).length,
            0
          );

        return (
          <div
            key={group.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md overflow-hidden transition-all duration-200"
          >
            {/* Accordion Header */}
            <button
              onClick={() => toggleGroup(group.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                  {iconMap[group.icon]}
                </div>
                <span className="font-semibold text-gray-900 text-[15px]">
                  {group.name}
                </span>
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                  {totalPhrases} câu
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Accordion Content */}
            {isOpen && (
              <div className="border-t border-gray-100 p-4 space-y-3 animate-fade-in">
                {/* Custom groups trước */}
                <CustomGroupList
                  customGroups={relatedCustomGroups}
                  getPhrasesByCustomGroup={getPhrasesByCustomGroup}
                  isCustomPhrase={isCustomPhrase}
                  removePhrase={removePhrase}
                  onEditPhrase={onEditPhrase}
                  currentUserName={currentUserName}
                />

                {/* Built-in phrases */}
                {groupPhrases.length > 0 && (
                  <>
                    {relatedCustomGroups.length > 0 && (
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-1 h-5 bg-gray-300 rounded-full" />
                        <h3 className="text-sm font-semibold text-gray-500">
                          Câu mẫu
                        </h3>
                      </div>
                    )}
                    <div className="space-y-3">
                      {groupPhrases.map((phrase) => (
                        <PhraseCard
                          key={phrase.id}
                          phrase={phrase}
                          isFavorite={isFavorite(phrase.id)}
                          isCustom={isCustomPhrase(phrase.id)}
                          currentUserName={currentUserName}
                          onToggleFavorite={toggleFavorite}
                          onEdit={
                            isCustomPhrase(phrase.id) ? onEditPhrase : undefined
                          }
                          onDelete={
                            isCustomPhrase(phrase.id) ? removePhrase : undefined
                          }
                        />
                      ))}
                    </div>
                  </>
                )}

                {groupPhrases.length === 0 &&
                  relatedCustomGroups.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-sm text-gray-400">
                        Chưa có câu nào trong chủ đề này
                      </p>
                    </div>
                  )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}