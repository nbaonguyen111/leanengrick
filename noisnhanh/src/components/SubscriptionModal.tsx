"use client";

import { X, Check, Crown } from "lucide-react";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
  isLoading: boolean;
}

export default function SubscriptionModal({
  isOpen,
  onClose,
  onPurchase,
  isLoading,
}: SubscriptionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Nâng cấp Premium
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            disabled={isLoading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-5 mb-5 border border-amber-100">
            <div className="text-center mb-4">
              <div className="inline-flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900">20.000đ</span>
                <span className="text-gray-600">/tháng</span>
              </div>
              <p className="text-sm text-gray-600">
                Mở khóa tính năng thêm câu tiếng Anh cá nhân
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 bg-emerald-100 rounded-full mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Thêm câu tiếng Anh không giới hạn
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Tự do thêm các câu giao tiếp theo nhu cầu cá nhân
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 bg-emerald-100 rounded-full mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Tạo nhóm câu riêng
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Phân loại câu theo chủ đề cá nhân
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 bg-emerald-100 rounded-full mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Chỉnh sửa & xóa câu của bạn
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Quản lý toàn bộ câu bạn đã thêm
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-1 bg-emerald-100 rounded-full mt-0.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Truy cập tất cả câu mẫu miễn phí
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Hơn 500+ câu tiếng Anh thực tế
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-5">
            <p className="text-xs text-blue-800 text-center">
              💡 Sau khi thanh toán, bạn sẽ nhận được hướng dẫn kích hoạt qua email/Zalo
            </p>
          </div>

          <button
            onClick={onPurchase}
            disabled={isLoading}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 active:scale-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Đang xử lý...
              </span>
            ) : (
              "Mua gói Premium - 20.000đ/tháng"
            )}
          </button>

          <p className="text-xs text-gray-400 text-center mt-3">
            Thanh toán an toàn qua Momo/ZaloPay
          </p>
        </div>
      </div>
    </div>
  );
}