import type { Metadata } from "next";
import { Merienda, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/auth-context";

const poppinsFont = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200", "400", "500", "600", "800"],
});

const meriendaFont = Merienda({
  variable: "--font-merienda",
  subsets: ["latin"],
  display: "swap",
  weight: ["700", "600", "800"],
});

export const metadata: Metadata = {
  title: "Blogi | Spread knowledge",
  description: "Simple blog app yet with all features",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppinsFont.variable} ${meriendaFont.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>{children}</AuthProvider>

          <Toaster toastOptions={{ duration: 4000 }} />
        </ThemeProvider>
      </body>
    </html>
  );
}
