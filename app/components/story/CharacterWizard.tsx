'use client';

import { CharacterCustomization, HairColor, HairStyle, OutfitStyle, FavoriteColor, Language, Gender } from '@/types';

interface CharacterWizardProps {
  character: CharacterCustomization;
  gender: Gender;
  language: Language;
  onChange: (character: CharacterCustomization) => void;
}

// Option configurations with emojis and labels
const hairColorOptions: { id: HairColor; emoji: string; labelEn: string; labelTh: string }[] = [
  { id: 'brown', emoji: '🟤', labelEn: 'Brown', labelTh: 'น้ำตาล' },
  { id: 'black', emoji: '⚫', labelEn: 'Black', labelTh: 'ดำ' },
  { id: 'blonde', emoji: '🟡', labelEn: 'Blonde', labelTh: 'บลอนด์' },
  { id: 'red', emoji: '🔴', labelEn: 'Red', labelTh: 'แดง' },
  { id: 'blue', emoji: '🔵', labelEn: 'Blue', labelTh: 'ฟ้า' },
  { id: 'pink', emoji: '🩷', labelEn: 'Pink', labelTh: 'ชมพู' },
];

const hairStyleOptions: { id: HairStyle; emoji: string; labelEn: string; labelTh: string }[] = [
  { id: 'short', emoji: '💇', labelEn: 'Short', labelTh: 'สั้น' },
  { id: 'long', emoji: '💇‍♀️', labelEn: 'Long', labelTh: 'ยาว' },
  { id: 'curly', emoji: '🦱', labelEn: 'Curly', labelTh: 'หยิก' },
  { id: 'braids', emoji: '👧', labelEn: 'Braids', labelTh: 'ถักเปีย' },
  { id: 'ponytail', emoji: '🙋', labelEn: 'Ponytail', labelTh: 'มัดหางม้า' },
];

const outfitStyleOptions: { id: OutfitStyle; emoji: string; labelEn: string; labelTh: string }[] = [
  { id: 'adventurer', emoji: '🎒', labelEn: 'Adventurer', labelTh: 'นักผจญภัย' },
  { id: 'princess', emoji: '👗', labelEn: 'Royal', labelTh: 'เจ้าหญิง/เจ้าชาย' },
  { id: 'superhero', emoji: '🦸', labelEn: 'Superhero', labelTh: 'ซูเปอร์ฮีโร่' },
  { id: 'wizard', emoji: '🧙', labelEn: 'Wizard', labelTh: 'พ่อมด/แม่มด' },
  { id: 'explorer', emoji: '🧭', labelEn: 'Explorer', labelTh: 'นักสำรวจ' },
];

const favoriteColorOptions: { id: FavoriteColor; emoji: string; labelEn: string; labelTh: string }[] = [
  { id: 'purple', emoji: '💜', labelEn: 'Purple', labelTh: 'ม่วง' },
  { id: 'blue', emoji: '💙', labelEn: 'Blue', labelTh: 'ฟ้า' },
  { id: 'pink', emoji: '💖', labelEn: 'Pink', labelTh: 'ชมพู' },
  { id: 'green', emoji: '💚', labelEn: 'Green', labelTh: 'เขียว' },
  { id: 'red', emoji: '❤️', labelEn: 'Red', labelTh: 'แดง' },
  { id: 'yellow', emoji: '💛', labelEn: 'Yellow', labelTh: 'เหลือง' },
];

// Get display name for current selection
const getSelectedDisplay = (character: CharacterCustomization, language: Language): string => {
  const hairColor = hairColorOptions.find((o) => o.id === character.hairColor);
  const hairStyle = hairStyleOptions.find((o) => o.id === character.hairStyle);
  const outfit = outfitStyleOptions.find((o) => o.id === character.outfitStyle);
  const color = favoriteColorOptions.find((o) => o.id === character.favoriteColor);

  if (language === 'th') {
    return `${hairColor?.emoji} ${hairStyle?.emoji} ${outfit?.emoji} ${color?.emoji}`;
  }
  return `${hairColor?.emoji} ${hairStyle?.emoji} ${outfit?.emoji} ${color?.emoji}`;
};

export default function CharacterWizard({ character, gender, language, onChange }: CharacterWizardProps) {
  const updateField = <K extends keyof CharacterCustomization>(field: K, value: CharacterCustomization[K]) => {
    onChange({ ...character, [field]: value });
  };

  return (
    <div className="space-y-4">
      {/* Section Title */}
      <div className="text-center">
        <span className="text-xl">✨</span>
        <span className="ml-2 text-sm font-medium text-purple-600">
          {language === 'th' ? 'ออกแบบตัวละครของคุณ' : 'Design Your Character'}
        </span>
        <span className="ml-2 text-xl">✨</span>
      </div>

      {/* Hair Color */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-purple-700">{language === 'th' ? 'สีผม' : 'Hair Color'}</label>
        <div className="grid grid-cols-6 gap-2">
          {hairColorOptions.map(({ id, emoji, labelEn, labelTh }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateField('hairColor', id)}
              title={language === 'th' ? labelTh : labelEn}
              className={`flex items-center justify-center rounded-xl p-2 text-xl transition-all ${
                character.hairColor === id
                  ? 'scale-110 bg-purple-500 shadow-lg ring-2 ring-purple-400 ring-offset-1'
                  : 'bg-white/70 hover:bg-white hover:shadow-md'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Hair Style */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-purple-700">
          {language === 'th' ? 'ทรงผม' : 'Hair Style'}
        </label>
        <div className="grid grid-cols-5 gap-2">
          {hairStyleOptions.map(({ id, emoji, labelEn, labelTh }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateField('hairStyle', id)}
              className={`flex flex-col items-center rounded-xl border-2 p-2 transition-all ${
                character.hairStyle === id
                  ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 shadow-md'
                  : 'border-purple-200 bg-white/70 hover:border-purple-300 hover:bg-white'
              }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="mt-1 text-xs font-medium text-purple-600">{language === 'th' ? labelTh : labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Outfit Style */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-purple-700">{language === 'th' ? 'ชุด' : 'Outfit'}</label>
        <div className="grid grid-cols-5 gap-2">
          {outfitStyleOptions.map(({ id, emoji, labelEn, labelTh }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateField('outfitStyle', id)}
              className={`flex flex-col items-center rounded-xl border-2 p-2 transition-all ${
                character.outfitStyle === id
                  ? 'border-purple-400 bg-gradient-to-br from-purple-100 to-pink-100 shadow-md'
                  : 'border-purple-200 bg-white/70 hover:border-purple-300 hover:bg-white'
              }`}
            >
              <span className="text-xl">{emoji}</span>
              <span className="mt-1 text-xs font-medium text-purple-600">{language === 'th' ? labelTh : labelEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Favorite Color */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-purple-700">
          {language === 'th' ? 'สีโปรด (สำหรับชุด)' : 'Favorite Color (for outfit)'}
        </label>
        <div className="grid grid-cols-6 gap-2">
          {favoriteColorOptions.map(({ id, emoji, labelEn, labelTh }) => (
            <button
              key={id}
              type="button"
              onClick={() => updateField('favoriteColor', id)}
              title={language === 'th' ? labelTh : labelEn}
              className={`flex items-center justify-center rounded-xl p-2 text-xl transition-all ${
                character.favoriteColor === id
                  ? 'scale-110 bg-purple-500 shadow-lg ring-2 ring-purple-400 ring-offset-1'
                  : 'bg-white/70 hover:bg-white hover:shadow-md'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
