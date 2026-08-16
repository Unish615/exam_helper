import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nyoria | Interactive Study & Exam Preparation Platform",
  description: "Transform your lecture notes, PDFs, and study materials into accurate practice questions, interactive MCQs, long essay prompts, 3D flashcards, and visual diagrams.",
  keywords: ["study assistant", "exam question generator", "MCQ practice", "flashcards", "study notes to quiz", "Nyoria"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100 font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
