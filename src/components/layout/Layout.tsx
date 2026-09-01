import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { CommandSearchProvider } from "@/features/search/CommandSearchContext";

export function Layout() {
  return (
    <CommandSearchProvider>
      <div className="flex min-h-screen flex-col bg-bg">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
        >
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-8 sm:px-6 lg:py-10">
          <Outlet />
        </main>
        <Footer />
      </div>
    </CommandSearchProvider>
  );
}
