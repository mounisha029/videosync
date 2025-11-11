import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import ConvexClerkProvider from "@/components/ui/providers/ConvexClerkProvider";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "@/components/ui/providers/ThemeProvider";
import { Toaster } from "react-hot-toast";
import ErrorBoundary from "@/components/ErrorBoundary";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "VideoSync - Video Interview Platform",
    template: "%s | VideoSync",
  },
  description: "Professional video interview platform with real-time collaboration, code editor, and comprehensive feedback system. Schedule, conduct, and review technical interviews seamlessly.",
  keywords: [
    "video interview",
    "technical interview",
    "remote interview",
    "coding interview",
    "interview platform",
    "video calling",
    "collaborative coding",
    "interview feedback",
  ],
  authors: [{ name: "VideoSync Team" }],
  creator: "VideoSync",
  publisher: "VideoSync",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "VideoSync - Video Interview Platform",
    description: "Professional video interview platform with real-time collaboration and feedback",
    siteName: "VideoSync",
  },
  twitter: {
    card: "summary_large_image",
    title: "VideoSync - Video Interview Platform",
    description: "Professional video interview platform with real-time collaboration",
    creator: "@videosync",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ErrorBoundary>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SignedIn>
                <div className="min-h-screen">
                  <Navbar />
                  <main className="px-4 sm:px-6 lg:px-8">{children}</main>
                </div>
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </ThemeProvider>
            <Toaster />
          </ErrorBoundary>
        </body>
      </html>
    </ConvexClerkProvider>
  );
}
