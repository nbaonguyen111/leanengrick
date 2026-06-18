"use client";

import { useState, useEffect } from "react";
import { X, Plus, Loader2 } from "lucide-react";
import { Group, CustomGroup, Phrase } from "@/types";

interface AddPhraseModalProps {
  groups: Group[];
  customGroups: CustomGroup[];
  authorName: string;
  editPhrase?: Phrase | null;
  onAdd: (data: {
    english_text: string;
    vietnamese_text: string;
    group_id: string;
    keywords: string[];
    author: string;
    custom_group_id?: string;
  }) => void;
  onUpdate?: (id: number, data: Partial<Omit<Phrase, "id">>) => void;
  onAddCustomGroup: (group: {
    name: string;
    parent_group_id: string;
    author: string;
  }) => void;
  onClose: () => void;
}

export default function AddPhraseModal({
  groups,
  customGroups,
  authorName,
  editPhrase,
  onAdd,
  onUpdate,
  onAddCustomGroup,
  onClose,
}: AddPhraseModalProps) {
  const [english, setEnglish] = useState("");
  const [vietnamese, setVietnamese] = useState("");
  const [group_id, setGroupId] = useState(groups[0]?.id ?? "");
  const [customGroupId, setCustomGroupId] = useState("__none__");
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [author, setAuthor] = useState(authorName);
  const [loading, setLoading] = useState(false);

  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");

  const isEditing = !!editPhrase;

  // Fill form when editing
  useEffect(() => {
    if (editPhrase) {
      setEnglish(editPhrase.english_text);
      setVietnamese(editPhrase.vietnamese_text);
      setGroupId(editPhrase.group_id);
      setCustomGroupId(editPhrase.custom_group_id ?? "__none__");
      setKeywords(editPhrase.keywords);
      setAuthor(editPhrase.author || authorName);
    }
  }, [editPhrase, authorName]);

  const filteredCustomGroups = customGroups.filter(
    (g) => g.parent_group_id === group_id
  );

  const addKeyword = () => {
    const kw = keywordInput.trim().toLowerCase();
    if (kw && !keywords.includes(kw)) {
      setKeywords((prev) => [...prev, kw]);
    }
    setKeywordInput("");
  };

  const handleCreateGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    onAddCustomGroup({
      name,
      parent_group_id: group_id,
      author: author.trim() || "Anonymous",
    });
    setNewGroupName("");
    setShowNewGroup(false);
  };

  const handleSubmit = () => {
    if (!english.trim()) {
      setError("Vui lòng nhập câu tiếng Anh");
      return;
    }
    if (!vietnamese.trim()) {
      setError("Vui lòng nhập câu tiếng Việt");
      return;
    }
    if (!group_id) {
      setError("Vui lòng chọn chủ đề");
      return;
    }
    if (!author.trim()) {
      setError("Vui lòng nhập tên của bạn");
      return;
    }
    setError("");
    setLoading(true);

    const data = {
      english_text: english.trim(),
      vietnamese_text: vietnamese.trim(),
      group_id,
      keywords: keywords.length > 0 ? keywords : [vietnamese.trim().toLowerCase()],
      author: author.trim(),
      custom_group_id:
        customGroupId && customGroupId !== "__none__"
          ? customGroupId
          : undefined,
    };

    // Simulate small delay for UX
    setTimeout(() => {
      if (isEditing && onUpdate && editPhrase) {
        onUpdate(editPhrase.id, data);
      } else {
        onAdd(data);
      }
      setLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {isEditing ? "Sửa câu" : "Thêm câu mới"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-100 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Tên người tạo */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Tên của bạn <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="VD: anhane, nguyenvan_a, ..."
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 transition-all"
              disabled={loading}
            />
            <p className="text-xs text-gray-400 mt-1.5">
              Người khác có thể search theo tên này để tìm câu của bạn
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Câu tiếng Anh <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={english}
              onChange={(e) => setEnglish(e.target.value)}
              placeholder="Hello, how are you?"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 transition-all"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Câu tiếng Việt <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={vietnamese}
              onChange={(e) => setVietnamese(e.target.value)}
              placeholder="Xin chào, bạn khỏe không?"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 transition-all"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Chủ đề <span className="text-red-500">*</span>
            </label>
            <select
              value={group_id}
              onChange={(e) => {
                setGroupId(e.target.value);
                setCustomGroupId("__none__");
              }}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 transition-all"
              disabled={loading}
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Nhóm con (tùy chọn - để phân loại câu của bạn)
            </label>
            <div className="flex gap-2">
              <select
                value={customGroupId}
                onChange={(e) => setCustomGroupId(e.target.value)}
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 transition-all"
                disabled={loading}
              >
                <option value="__none__">-- Không có nhóm --</option>
                {filteredCustomGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => setShowNewGroup(!showNewGroup)}
                className="px-3.5 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 text-sm transition-colors"
                title="Tạo nhóm mới"
                disabled={loading}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {showNewGroup && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="VD: Câu chào hỏi, Câu gọi món..."
                  className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 transition-all"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleCreateGroup();
                    }
                  }}
                  disabled={loading}
                />
                <button
                  onClick={handleCreateGroup}
                  className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-medium rounded-xl hover:bg-emerald-700 transition-colors"
                  disabled={loading}
                >
                  Tạo
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Từ khóa (tùy chọn - giúp tìm kiếm dễ hơn)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addKeyword();
                  }
                }}
                placeholder="Nhập từ khóa..."
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-gray-50/50 transition-all"
                disabled={loading}
              />
              <button
                onClick={addKeyword}
                className="px-3.5 py-2.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 text-sm transition-colors"
                disabled={loading}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium border border-emerald-100"
                  >
                    {kw}
                    <button
                      onClick={() => {
                        setKeywords((prev) => prev.filter((k) => k !== kw));
                      }}
                      className="hover:text-red-500 transition-colors"
                      disabled={loading}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 justify-end p-5 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
            disabled={loading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:scale-95 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading
              ? "Đang xử lý..."
              : isEditing
              ? "Lưu thay đổi"
              : "Thêm câu"}
          </button>
        </div>
      </div>
    </div>
  );
}