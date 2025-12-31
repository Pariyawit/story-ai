"use client";

import { useState, useEffect } from "react";

import { Language } from "@/types";

import Card from "../common/Card";
import SpeakButton from "../common/SpeakButton";

interface TransitionScreenProps {
  transitionTexts: string[];
  language?: Language;
}

export default function TransitionScreen({
  transitionTexts,
  language = "en",
}: TransitionScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [completedTexts, setCompletedTexts] = useState<string[]>([]);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const loadingText =
    language === "th" ? "✨ เวทมนตร์กำลังทำงาน... ✨" : "✨ Magic is happening... ✨";

  // Combine all transition texts for TTS
  const fullTransitionText = transitionTexts.join(" ");

  // Reset when transitionTexts changes
  useEffect(() => {
    setCurrentIndex(0);
    setCompletedTexts([]);
    setDisplayedText("");
    setIsTyping(true);
  }, [transitionTexts]);

  // Typewriter effect for current sentence
  useEffect(() => {
    if (currentIndex >= transitionTexts.length) {
      // Stay on the last sentence - the component will be unmounted when API responds
      return;
    }

    const currentText = transitionTexts[currentIndex];
    let charIndex = 0;
    setDisplayedText("");
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (charIndex < currentText.length) {
        setDisplayedText(currentText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);

        // Add completed text to the array
        setCompletedTexts((prev) => [...prev, currentText]);
        setDisplayedText(""); // Clear for next line

        // Wait before showing next sentence (only if there are more sentences)
        if (currentIndex < transitionTexts.length - 1) {
          setTimeout(() => {
            setCurrentIndex((prev) => prev + 1);
          }, 2000); // Wait 2 seconds before next sentence
        }
        // If this is the last sentence, just stay here until API responds
      }
    }, 50); // 50ms per character for typing effect

    return () => clearInterval(typingInterval);
  }, [currentIndex, transitionTexts]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50 p-4">
      <div className="w-full max-w-2xl">
        <Card className="text-center">
          {/* Progress dots */}
          <div className="mb-6 flex justify-center gap-2">
            {transitionTexts.map((_, index) => (
              <div
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index < currentIndex
                    ? "bg-purple-500"
                    : index === currentIndex
                      ? "bg-purple-400 animate-pulse"
                      : "bg-purple-200"
                }`}
              />
            ))}
          </div>

          {/* Text display area - stacked with spacing */}
          <div className="min-h-[200px] space-y-4">
            {/* Completed lines - appear instantly, no typewriter */}
            {completedTexts.map((text, index) => (
              <p key={index} className="text-lg leading-relaxed text-purple-800">
                {text}
              </p>
            ))}

            {/* Current line being typed - with typewriter effect */}
            {displayedText && (
              <p className="text-lg leading-relaxed text-purple-800">
                {displayedText}
                {isTyping && (
                  <span className="ml-1 inline-block h-6 w-0.5 animate-pulse bg-purple-600" />
                )}
              </p>
            )}
          </div>

          {/* Speak button */}
          <div className="mt-4 flex justify-center">
            <SpeakButton text={fullTransitionText} language={language} />
          </div>

          {/* Loading indicator */}
          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex gap-1">
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-pink-400"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-purple-400"
                style={{ animationDelay: "300ms" }}
              />
            </div>
            <p className="text-sm text-purple-500">{loadingText}</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
