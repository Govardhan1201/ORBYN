import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Toaster } from '@/components/ui/Toaster';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Orbyn — Your Mind, Mapped',
    template: '%s | Orbyn',
  },
  description: 'A visual second-brain and personal knowledge graph. Save, connect, and explore your knowledge universe.',
  keywords: ['knowledge graph', 'second brain', 'personal knowledge management', 'note taking', 'PKM'],
  authors: [{ name: 'Orbyn' }],
  creator: 'Orbyn',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    title: 'Orbyn — Your Mind, Mapped',
    description: 'A visual second-brain and personal knowledge graph.',
    siteName: 'Orbyn',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orbyn — Your Mind, Mapped',
    description: 'A visual second-brain and personal knowledge graph.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <SessionProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
