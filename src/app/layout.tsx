import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Script from "next/script";

import "react-toastify/dist/ReactToastify.css";
import { SessionProvider } from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";
import TrialDataCleaner from "./(frontend)/core/components/molecules/TrialDataCleaner/TrialDataCleaner";
import { GA_MEASUREMENT_ID } from "./(frontend)/core/utils/analytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Note",
  description: "The intelligent note-taking app",
  icons: {
    icon: "/logo.png?v=2", // Add version to bust cache
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {GA_MEASUREMENT_ID && (
        <>
          <Script
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  page_path: window.location.pathname,
                });
              `,
            }}
          />
        </>
      )}
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider attribute="class">
            <TrialDataCleaner />
            {children}
            <ToastContainer
              position="bottom-right"
              autoClose={2000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
              toastClassName="!bg-card !text-card-foreground !border !border-border !shadow-lg"
              bodyClassName="text-sm"
            />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
