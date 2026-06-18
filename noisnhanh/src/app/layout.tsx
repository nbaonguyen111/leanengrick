import type { Metadata, Viewport } from "next";
import "./css/globals.css";

export const metadata: Metadata = {
  title: "NóiNhanh - Tiếng Anh giao tiếp thực tế",
  description:
    "Tìm câu tiếng Anh theo tình huống để giao tiếp ngay lập tức. Dành cho người Việt cần nói tiếng Anh trong công việc và cuộc sống.",
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body className="web-bg">{children}</body>
    </html>
  );
}