import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import Header from "./_components/Header";
import { TRPCReactProvider } from "~/trpc/react";

export const metadata: Metadata = {
  title: "Marzano",
  description: "A simple and easy to use task management app",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="dark:bg-gray-900 dark:text-white">
        <TRPCReactProvider>
          <Header />
          <main className="container mx-auto min-h-screen max-w-lg p-4 pt-32 dark:bg-gray-900 dark:text-white">
            {children}
          </main>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
