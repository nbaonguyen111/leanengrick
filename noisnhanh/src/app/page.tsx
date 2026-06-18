"use client";

import { useState, useMemo, useCallback } from "react";
import { Search } from "lucide-react";
import Header from "@/components/Header";
import PhraseCard from "@/components/PhraseCard";
import AccordionCategories from "@/components/AccordionCategories";
import AddPhraseModal from "@/components/AddPhraseModal";
import { usePhrases } from "@/hooks/usePhrases";
import { useSearch } from "@/hooks/useSearch";
import { useFavorites } from "@/hooks/useFavorites";
import { useCustomPhrases } from "@/hooks/useCustomPhrases";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useSubscription } from "@/hooks/useSubscription";
import { Phrase } from "@/types";
import SubscriptionModal from "@/components/SubscriptionModal";

export default function Home() {
  const { data, loading: phrasesLoading, error: phrasesError } = usePhrases();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editPhrase, setEditPhrase] = useState<Phrase | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const { name: authorName, updateName } = useUserProfile();
  const { subscription, purchaseSubscription, canAddPhrase } = useSubscription();
  const {
    customPhrases,
    customGroups,
    loading: customLoading,
    addPhrase,
    updatePhrase,
    removePhrase,
    isCustomPhrase,
    addCustomGroup,
    getPhrasesByCustomGroup,
  } = useCustomPhrases();

  // Merge dữ liệu gốc + custom phrases
  const allPhrases = useMemo(() => {
    const base = data?.phrases ?? [];
    return [...customPhrases, ...base];
  }, [data, customPhrases]);

  const { query, setQuery, results } = useSearch(allPhrases);
  const { isFavorite, toggleFavorite } = useFavorites();

  const handleAdd = useCallback(
    (phraseData: {
      english_text: string;
      vietnamese_text: string;
      group_id: string;
      keywords: string[];
      author: string;
      custom_group_id?: string;
    }) => {
      addPhrase(phraseData);
      if (phraseData.author && phraseData.author !== authorName) {
        updateName(phraseData.author);
      }
    },
    [addPhrase, authorName, updateName]
  );

  const handleUpdate = useCallback(
    (id: number, data: Partial<Omit<Phrase, "id">>) => {
      updatePhrase(id, data);
    },
    [updatePhrase]
  );

  const handleAddCustomGroup = useCallback(
    (group: { name: string; parent_group_id: string; author: string }) => {
      addCustomGroup(group);
    },
    [addCustomGroup]
  );

  const handleEdit = useCallback((id: number) => {
    const phrase = customPhrases.find((p) => p.id === id);
    if (phrase) {
      setEditPhrase(phrase);
      setShowAddModal(true);
    }
  }, [customPhrases]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditPhrase(null);
  }, []);

  // Các hooks phải đứng TRƯỚC early return
  const isSearching = query.trim().length > 0;

  const searchResultsByAuthor = useMemo<[string, Phrase[]][]>(() => {
    if (!isSearching) return [];
    const groups: Record<string, Phrase[]> = {};
    for (const p of results) {
      const key = p.author || "__builtin__";
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }
    return Object.entries(groups).sort(([a], [b]) => {
      if (a === "__builtin__") return 1;
      if (b === "__builtin__") return -1;
      return a.localeCompare(b);
    });
  }, [results, isSearching]);

  if (phrasesLoading || customLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (phrasesError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-2">Không thể tải dữ liệu</p>
          <p className="text-gray-400 text-sm">{phrasesError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        query={query}
        onQueryChange={setQuery}
        onAddClick={() => {
          if (!canAddPhrase) {
            setShowSubscriptionModal(true);
            return;
          }
          setEditPhrase(null);
          setShowAddModal(true);
        }}
        hasSubscription={subscription.isActive}
        onUpgradeClick={() => setShowSubscriptionModal(true)}
      />

      {isSearching ? (
        <main className="max-w-3xl mx-auto px-4 pt-6 pb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
              Kết quả tìm kiếm
            </h2>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
              {results.length} câu
            </span>
          </div>
          {results.length === 0 ? (
            <div className="text-center py-16 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-1">Không tìm thấy câu nào phù hợp</p>
              <p className="text-gray-400 text-sm">
                Hãy thử tìm kiếm với từ khóa khác hoặc{" "}
                {canAddPhrase ? (
                  <button
                    onClick={() => {
                      setEditPhrase(null);
                      setShowAddModal(true);
                    }}
                    className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors"
                  >
                    thêm câu mới
                  </button>
                ) : (
                  <button
                    onClick={() => setShowSubscriptionModal(true)}
                    className="text-amber-600 hover:text-amber-700 font-semibold transition-colors"
                  >
                    nâng cấp Premium
                  </button>
                )}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {searchResultsByAuthor.map(([author, phrases]) => (
                <div key={author} className="animate-slide-up">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div className="w-1 h-5 bg-emerald-500 rounded-full" />
                    <h3 className="text-sm font-bold text-gray-800">
                      {author === "__builtin__" ? "Câu mẫu" : `@${author}`}
                    </h3>
                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                      {phrases.length} câu
                    </span>
                  </div>
                  <div className="space-y-3">
                    {phrases.map((phrase) => (
                      <PhraseCard
                        key={phrase.id}
                        phrase={phrase}
                        isFavorite={isFavorite(phrase.id)}
                        isCustom={isCustomPhrase(phrase.id)}
                        currentUserName={authorName}
                        onToggleFavorite={toggleFavorite}
                        onEdit={isCustomPhrase(phrase.id) ? handleEdit : undefined}
                        onDelete={isCustomPhrase(phrase.id) ? removePhrase : undefined}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      ) : (
        <AccordionCategories
          groups={data.groups}
          allPhrases={allPhrases}
          customGroups={customGroups}
          getPhrasesByCustomGroup={getPhrasesByCustomGroup}
          isCustomPhrase={isCustomPhrase}
          removePhrase={removePhrase}
          onEditPhrase={handleEdit}
          currentUserName={authorName}
        />
      )}

      {showAddModal && (
        <AddPhraseModal
          groups={data.groups}
          customGroups={customGroups}
          authorName={authorName}
          editPhrase={editPhrase}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onAddCustomGroup={handleAddCustomGroup}
          onClose={handleCloseModal}
        />
      )}

      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        onPurchase={async () => {
          setIsPurchasing(true);
          // Simulate payment processing
          await new Promise((resolve) => setTimeout(resolve, 1500));
          purchaseSubscription();
          setIsPurchasing(false);
          setShowSubscriptionModal(false);
        }}
        isLoading={isPurchasing}
      />
    </div>
  );
}
