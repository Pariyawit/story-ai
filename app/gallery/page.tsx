'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { StoryBeat, Language } from '@/types';
import StoryCarousel from '../components/story/StoryCarousel';

// Helper to safely read from localStorage (handles SSR)
function getStoredHistory(): StoryBeat[] {
    if (typeof window === 'undefined') return [];
    try {
        const saved = localStorage.getItem('story-gallery-history');
        return saved ? JSON.parse(saved) : [];
    } catch {
        return [];
    }
}

function getStoredLanguage(): Language {
    if (typeof window === 'undefined') return 'en';
    const saved = localStorage.getItem('story-gallery-language');
    return (saved as Language) || 'en';
}

export default function GalleryPage() {
    const router = useRouter();

    // Use lazy initialization to avoid the lint warning
    const [history] = useState<StoryBeat[]>(() => getStoredHistory());
    const language = useMemo(() => getStoredLanguage(), []);

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 px-4 py-8">
            {/* Header */}
            <div className="mx-auto mb-8 flex max-w-4xl items-center justify-between">
                <button
                    onClick={handleBack}
                    className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 shadow-md backdrop-blur-sm transition-all hover:scale-105 hover:bg-white"
                >
                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-medium text-purple-600">
                        {language === 'th' ? 'กลับ' : 'Back'}
                    </span>
                </button>

                <h1 className="text-2xl font-bold text-purple-700 md:text-3xl">
                    {language === 'th' ? '🎨 แกลเลอรีการผจญภัย' : '🎨 Adventure Gallery'}
                </h1>

                <div className="w-20" /> {/* Spacer for centering */}
            </div>

            {/* Carousel */}
            {history.length > 0 ? (
                <StoryCarousel history={history} language={language} />
            ) : (
                <div className="flex flex-col items-center justify-center gap-4 py-20">
                    <p className="text-xl text-gray-500">
                        {language === 'th'
                            ? '😢 ไม่พบเรื่องราว กรุณากลับไปเล่นก่อน'
                            : '😢 No story found. Please play a story first.'}
                    </p>
                    <button
                        onClick={() => router.push('/')}
                        className="rounded-full bg-purple-500 px-6 py-3 font-bold text-white shadow-lg transition-all hover:scale-105 hover:bg-purple-600"
                    >
                        {language === 'th' ? 'เริ่มเรื่องใหม่' : 'Start New Story'}
                    </button>
                </div>
            )}
        </div>
    );
}
