// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import NavHeader from "@/components/navigation/nav-header";
import { Viewport } from "next";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/navigation/footer";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata: Metadata = {
  title: "Revenue",
  description: "Add products",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="flex flex-col h-full">
        <AuthProvider>
          <ThemeProvider  
            attribute="class"
            defaultTheme="system"
            enableSystem={true}
            disableTransitionOnChange={true}
          >
            <div className="flex flex-col min-h-screen bg-[var(--background)] text-[var(--foreground)]">
              <NavHeader />
              <main className="flex-1">
                {children}
                <Toaster />
              </main>
              <Footer/>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}