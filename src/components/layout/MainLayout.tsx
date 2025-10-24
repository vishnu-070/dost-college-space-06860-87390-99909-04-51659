import { ReactNode } from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { TrendingSidebar } from "./TrendingSidebar";

interface MainLayoutProps {
  children: ReactNode;
  showTrending?: boolean;
}

export const MainLayout = ({ children, showTrending = true }: MainLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex relative">
        <Sidebar />
        <main className="flex-1 min-w-0 w-full">{children}</main>
        {showTrending && <TrendingSidebar />}
      </div>
    </div>
  );
};
