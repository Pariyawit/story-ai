'use client';

import { useState, useRef, useCallback } from 'react';
import { Language } from '@/types';
import { fetchSpeech } from '@/services/ttsClient';

interface SpeakButtonProps {
  text: string;
  language: Language;
  className?: string;
}

export default function SpeakButton({ text, language, className = '' }: SpeakButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
  }, []);

  const handleSpeak = async () => {
    // If already playing, stop the audio
    if (isPlaying) {
      stopAudio();
      return;
    }

    // If no text, do nothing
    if (!text) return;

    setIsLoading(true);

    try {
      // Fetch the audio from the TTS API
      const audioBlob = await fetchSpeech(text, language);

      // Clean up previous audio URL if exists
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }

      // Create a new audio URL
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;

      // Create and play the audio
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
      };

      audio.onerror = () => {
        setIsPlaying(false);
        console.error('Audio playback error');
      };

      await audio.play();
      setIsPlaying(true);
    } catch (error) {
      console.error('Failed to play speech:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonLabel = language === 'th' 
    ? (isPlaying ? '🔇 หยุด' : '🔊 ฟัง') 
    : (isPlaying ? '🔇 Stop' : '🔊 Listen');

  const loadingLabel = language === 'th' ? '⏳ กำลังโหลด...' : '⏳ Loading...';

  return (
    <button
      onClick={handleSpeak}
      disabled={isLoading || !text}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium 
        transition-all duration-200
        ${isPlaying 
          ? 'bg-pink-500 text-white hover:bg-pink-600' 
          : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
        }
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}`}
      aria-label={isPlaying ? 'Stop narration' : 'Play narration'}
    >
      {isLoading ? loadingLabel : buttonLabel}
    </button>
  );
}
