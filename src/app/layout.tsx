import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TrialDataCleaner from "./(frontend)/core/components/molecules/TrialDataCleaner/TrialDataCleaner";
import { I18nProvider } from "./(frontend)/core/i18n/I18nProvider";
import { config, isProduction } from "./(frontend)/core/config";
import { GA_MEASUREMENT_ID } from "./(frontend)/core/utils/analytics";
import "./globals.css";
import { SessionProvider } from "./SessionProvider";
import { ThemeProvider } from "./ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

// Get base title with environment suffix
const getTitle = () => {
  const baseTitle = config.app.name;
  return isProduction ? baseTitle : `${baseTitle} (Staging)`;
};

// Viewport configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(config.auth.nextAuthUrl),
  title: getTitle(),
  description:
    "AI Note - Intelligent note-taking app powered by AI. Take smarter notes, organize better, and find information faster with our AI-powered note-taking solution.",
  keywords: [
    "AI notes",
    "note-taking app",
    "intelligent notes",
    "note organizer",
    "AI productivity",
    "smart notes",
    "note search",
  ],
  authors: [{ name: "Lio Nguyen" }],
  creator: "Lio Nguyen",
  publisher: "Lio Nguyen",
  icons: {
    icon: "/logo.png?v=2", // Add version to bust cache
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: getTitle(),
    title: getTitle(),
    description:
      "AI Note - Intelligent note-taking app powered by AI. Take smarter notes, organize better, and find information faster.",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "AI Note - Intelligent Note Taking App",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: getTitle(),
    description:
      "AI Note - Intelligent note-taking app powered by AI. Take smarter notes, organize better, and find information faster.",
    images: ["/logo.png"],
    creator: "@lionguyen",
  },
  robots: "index, follow",
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
            <I18nProvider>
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
            </I18nProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
