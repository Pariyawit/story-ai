"use client";

import { useState } from "react";

import { Gender, Language, StoryTheme } from "@/types";

import Button from "../common/Button";
import Card from "../common/Card";
import Input from "../common/Input";

// Theme configuration with labels
const THEMES: { id: StoryTheme; emoji: string; labelEn: string; labelTh: string }[] = [
  { id: "enchanted_forest", emoji: "🌳", labelEn: "Enchanted Forest", labelTh: "ป่าวิเศษ" },
  { id: "space_adventure", emoji: "🚀", labelEn: "Space Adventure", labelTh: "ผจญภัยอวกาศ" },
  {
    id: "underwater_kingdom",
    emoji: "🌊",
    labelEn: "Underwater Kingdom",
    labelTh: "อาณาจักรใต้น้ำ",
  },
  { id: "dinosaur_land", emoji: "🦕", labelEn: "Dinosaur Land", labelTh: "ดินแดนไดโนเสาร์" },
  { id: "fairy_tale_castle", emoji: "🏰", labelEn: "Fairy Tale Castle", labelTh: "ปราสาทเทพนิยาย" },
];

interface StartScreenProps {
  nameInput: string;
  gender: Gender;
  language: Language;
  theme: StoryTheme;
  onNameChange: (name: string) => void;
  onGenderChange: (gender: Gender) => void;
  onLanguageChange: (language: Language) => void;
  onThemeChange: (theme: StoryTheme) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export default function StartScreen({
  nameInput,
  gender,
  language,
  theme,
  onNameChange,
  onGenderChange,
  onLanguageChange,
  onThemeChange,
  onSubmit,
  isLoading = false,
}: StartScreenProps) {
  const [isThemeExpanded, setIsThemeExpanded] = useState(false);

  const selectedTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="w-full max-w-md px-8">
        <Card className="p-8 shadow-lg">
          <h1 className="mb-6 text-center text-4xl font-bold text-purple-600">Story Adventure</h1>
          <p className="mb-8 text-center text-lg text-purple-500">
            {language === "th"
              ? "ชื่อของคุณคืออะไร นักสำรวจผู้กล้าหาญ?"
              : "What's your name, brave explorer?"}
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              id="name-input"
              label={language === "th" ? "ชื่อของคุณ" : "Your name"}
              value={nameInput}
              onChange={onNameChange}
              placeholder={language === "th" ? "ใส่ชื่อของคุณ..." : "Enter your name..."}
              autoFocus
            />

            {/* Gender Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-700">
                {language === "th" ? "เพศ" : "Gender"}
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onGenderChange("boy")}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 text-lg font-medium transition-all ${
                    gender === "boy"
                      ? "border-blue-400 bg-blue-100 text-blue-700"
                      : "border-purple-200 bg-white text-purple-600 hover:border-purple-300"
                  }`}
                >
                  {language === "th" ? "👦 ด.ช." : "👦 Boy"}
                </button>
                <button
                  type="button"
                  onClick={() => onGenderChange("girl")}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 text-lg font-medium transition-all ${
                    gender === "girl"
                      ? "border-pink-400 bg-pink-100 text-pink-700"
                      : "border-purple-200 bg-white text-purple-600 hover:border-purple-300"
                  }`}
                >
                  {language === "th" ? "👧 ด.ญ." : "👧 Girl"}
                </button>
              </div>
            </div>

            {/* Language Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-purple-700">
                {language === "th" ? "ภาษา" : "Language"}
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => onLanguageChange("en")}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 text-lg font-medium transition-all ${
                    language === "en"
                      ? "border-purple-400 bg-purple-100 text-purple-700"
                      : "border-purple-200 bg-white text-purple-600 hover:border-purple-300"
                  }`}
                >
                  🇺🇸 English
                </button>
                <button
                  type="button"
                  onClick={() => onLanguageChange("th")}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 text-lg font-medium transition-all ${
                    language === "th"
                      ? "border-purple-400 bg-purple-100 text-purple-700"
                      : "border-purple-200 bg-white text-purple-600 hover:border-purple-300"
                  }`}
                >
                  🇹🇭 ไทย
                </button>
              </div>
            </div>

            {/* Theme Selection - Collapsible */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => setIsThemeExpanded(!isThemeExpanded)}
                className="flex w-full items-center justify-between rounded-2xl border-2 border-purple-200 bg-white px-4 py-3 text-left transition-all hover:border-purple-300"
              >
                <span className="text-sm font-medium text-purple-700">
                  {language === "th" ? "โลกแห่งเรื่องราว" : "Story World"}
                </span>
                <span className="flex items-center gap-2 text-purple-600">
                  <span className="text-xl">{selectedTheme.emoji}</span>
                  <span className="text-sm font-medium">
                    {language === "th" ? selectedTheme.labelTh : selectedTheme.labelEn}
                  </span>
                  <span
                    className={`text-lg transition-transform ${isThemeExpanded ? "rotate-180" : ""}`}
                  >
                    ▼
                  </span>
                </span>
              </button>

              {isThemeExpanded && (
                <div className="grid grid-cols-2 gap-2 pt-2 md:grid-cols-3">
                  {THEMES.map(({ id, emoji, labelEn, labelTh }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => {
                        onThemeChange(id);
                        setIsThemeExpanded(false);
                      }}
                      className={`rounded-2xl border-2 p-3 text-center transition-all ${
                        theme === id
                          ? "border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700 shadow-md"
                          : "border-purple-200 bg-white text-purple-600 hover:border-purple-300 hover:bg-purple-50"
                      }`}
                    >
                      <span className="text-2xl">{emoji}</span>
                      <p className="mt-1 text-xs font-medium">
                        {language === "th" ? labelTh : labelEn}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button type="submit" disabled={!nameInput.trim() || isLoading} fullWidth>
              {language === "th" ? "เริ่มการผจญภัย" : "Start Adventure"}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
