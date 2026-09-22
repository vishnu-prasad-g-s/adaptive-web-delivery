import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import VitalsCollector from "@/components/VitalsCollector";

export const metadata: Metadata = {
  title: "AdaptiStore — Network & Device Adaptive Web App (WA-5)",
  description: "Next.js e-commerce demo application detecting network conditions and device capabilities in real time to adapt quality, defer components, and optimize Web Vitals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col">
        <VitalsCollector />
        <Navbar />
        <div className="flex-1">
          {children}
        </div>
        <footer className="border-t border-slate-900 bg-slate-950 text-center py-6 text-xs text-slate-500">
          AdaptiStore — Built for Adaptive Web Delivery (WA-5) | Powered by Next.js 14 & Browser Telemetry
        </footer>
      </body>
    </html>
  );
}
