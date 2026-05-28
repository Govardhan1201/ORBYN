import type { Metadata } from 'next';
import { Sora, Hanken_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { Toaster } from '@/components/ui/Toaster';

const hanken = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-inter', // keep variable names to not break tailwind config yet, or map them
  display: 'swap',
});

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
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
      <body className={`${hanken.variable} ${sora.variable} ${jetbrains.variable} antialiased`}>
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
