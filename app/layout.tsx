import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: "Story AI - Interactive Children's Storytelling",
  description:
    "An AI-powered interactive storytelling app for kids. Follow the Hero's Journey through 12 magical story beats with beautiful watercolor illustrations and make choices that shape your adventure.",
  keywords: ['storytelling', 'AI', 'children', 'interactive', "hero's journey", 'DALL-E', 'GPT-4'],
  authors: [{ name: 'Pariyawit J' }],
  openGraph: {
    title: "Story AI - Interactive Children's Storytelling",
    description: 'An AI-powered interactive storytelling app for kids with beautiful watercolor illustrations.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
