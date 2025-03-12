import { Navbar } from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ReactNode } from "react";

const MainLayout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <div className="w-full min-h-screen flex flex-col">
        <Navbar/>
        <main className="flex-1 px-2 py-3 md:px-4 pt-[4.5rem]">{children}</main>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
