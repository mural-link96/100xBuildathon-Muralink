import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SessionProvider from "./components/providers/SessionProvider";
import ReduxProvider from "./components/providers/ReduxProvider";
import { ProfileInitializer } from "./components/profile/ProfileInitializer";
import { ProfileModal } from "./components/profile/ProfileModal";
import { ProfileReminder } from "./components/profile/ProfileReminder";

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
  title: "Muralink",
  description: "Design by Muralink",
  icons:{
    icon: "images/logo/muralink-logo.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <SessionProvider>
            <ProfileInitializer />
            {children}
            <ProfileModal />
            <ProfileReminder />
          </SessionProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
