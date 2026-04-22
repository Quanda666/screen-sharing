import { ClarityScript } from "@/components/clarity-script";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const noto = Noto_Sans_SC({
    subsets: ["latin"],
    variable: "--font-noto-sans-sc",
    weight: ["400", "500", "700"]
});

export const metadata = {
    title: "屏幕共享 - 即时共享您的屏幕",
    description: "使用简单的房间代码即可立即与任何人共享您的屏幕。无需下载或注册。",
    keywords: ["屏幕共享", "webrtc", "在线屏幕共享", "浏览器屏幕共享", "免费屏幕共享", "共享您的屏幕", "共享屏幕", "屏幕分享"],
    other: {
        "google-site-verification": process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || ""
    }
} satisfies Metadata;

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="zh-CN">
            <body className={`${noto.variable} antialiased`}>
                <main className="from-background to-muted flex min-h-screen flex-col justify-between bg-linear-to-b">{children}</main>
                <ClarityScript />
                <Toaster richColors />
            </body>
        </html>
    );
}
