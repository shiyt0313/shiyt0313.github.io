import { ReactNode } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-6 pb-24 pt-10 md:px-10 md:pt-16">{children}</main>
      <Footer />
    </div>
  );
}
