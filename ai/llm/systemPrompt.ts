import {
  Gender,
  Language,
  StoryTheme,
  CharacterCustomization,
  HairColor,
  HairStyle,
  OutfitStyle,
  FavoriteColor,
} from '@/types';

const STYLE =
  "A dreamy watercolor children's book illustration in soft hand-painted style, with visible paper texture and layered watercolor washes. Gentle pastel colors, soft glowing light, and a magical bedtime atmosphere. Characters have round, cute storybook faces with big eyes and warm expressions. The scene looks like it was painted on textured watercolor paper with soft edges, subtle paint pooling, and natural brush strokes. Whimsical, calm, and magical.";

const getLanguageInstruction = (language: Language): string => {
  if (language === 'th') {
    return 'Tell the story in simple Thai language suitable for young children (เขียนเรื่องเป็นภาษาไทยง่ายๆ เหมาะสำหรับเด็กเล็ก).';
  }
  if (language === 'singlish') {
    return `Tell the story in simple English with natural Singlish (Singapore English) expressions.
Use predominantly English but sprinkle in Singlish words and particles SUBTLY.
Common Singlish particles to use naturally: "lah" (emphasis), "leh" (softer/uncertain), "lor" (resignation), "meh" (questioning), "sia" (exclamation).
Common Singlish words: "wah" (wow), "shiok" (great/delicious), "alamak" (oh no), "steady" (reliable), "can" (yes).
Example: "Wah, the forest so magical lah! You want to explore, can?"
Keep it child-friendly and maintain story flow.`;
  }
  return 'Tell story in a simple English suitable for kindergarten.';
};

const getChoiceRules = (language: Language): string => {
  if (language === 'th') {
    return `CHOICE RULES:
        - Each choice MUST be written in simple Thai language (ภาษาไทยง่ายๆ)
        - Each choice MUST be a specific, actionable option for the child (e.g., "ตามผีเสื้อไป", "เปิดประตูวิเศษ", "คุยกับนกฮูก")
        - NEVER use generic placeholders like "Choice A", "Choice B", "Choice C"
        - Choices must relate directly to the current story scene
        - Use simple, exciting Thai verbs that children understand
        - For each choice, provide 3-4 short transition sentences that describe what happens when the child picks that choice
        - Transition sentences should build excitement and bridge to the next scene`;
  }
  if (language === 'singlish') {
    return `CHOICE RULES:
        - Each choice MUST be written primarily in English with subtle Singlish expressions
        - Each choice MUST be a specific, actionable option (e.g., "Follow the butterfly lah", "Wah, let's open the door", "Talk to the owl lor")
        - NEVER use generic placeholders like "Choice A", "Choice B", "Choice C"
        - Choices must relate directly to the current story scene
        - Use simple, exciting verbs that children understand
        - Add Singlish particles (lah, leh, lor) naturally - not in every choice, keep it subtle
        - For each choice, provide 3-4 short transition sentences with light Singlish flavor
        - Transition sentences should build excitement and bridge to the next scene`;
  }
  return `CHOICE RULES:
        - Each choice MUST be written in simple English
        - Each choice MUST be a specific, actionable option for the child (e.g., "Follow the butterfly", "Open the magic door", "Talk to the friendly owl")
        - NEVER use generic placeholders like "Choice A", "Choice B", "Choice C"
        - Choices must relate directly to the current story scene
        - Use simple, exciting verbs that children understand
        - For each choice, provide 3-4 short transition sentences that describe what happens when the child picks that choice
        - Transition sentences should build excitement and bridge to the next scene`;
};

const getJsonFormatExample = (language: Language): string => {
  if (language === 'th') {
    return `STRICT JSON FORMAT:
        You must respond ONLY with this JSON structure. No prose before or after.
        {
          "storyText": "ข้อความของเรื่องในขั้นตอนปัจจุบัน (ภาษาไทย)",
          "choices": ["ตามผีเสื้อไป", "เปิดประตูวิเศษ", "คุยกับนกฮูกใจดี"],
          "choicesWithTransition": [
            {"text": "ตามผีเสื้อไป", "transition": ["เธอวิ่งตามผีเสื้อสีรุ้ง...", "ปีกของมันเปล่งแสงวิเศษ...", "มันพาเธอไปยังสวนลับ..."]},
            {"text": "เปิดประตูวิเศษ", "transition": ["เธอหมุนลูกบิดประตู...", "แสงสว่างวาบออกมา...", "ดินแดนมหัศจรรย์ปรากฏ..."]},
            {"text": "คุยกับนกฮูกใจดี", "transition": ["เธอเดินเข้าไปหานกฮูก...", "ตาโตของมันเป็นประกาย...", "มันกระซิบความลับ..."]}
          ],
          "imagePrompt": "The detailed prompt for this specific scene (in English for image generation)."
        }`;
  }
  if (language === 'singlish') {
    return `STRICT JSON FORMAT:
        You must respond ONLY with this JSON structure. No prose before or after.
        {
          "storyText": "Wah, the forest so magical lah! The trees all sparkling one. You see something shiny behind the bushes.",
          "choices": ["Follow the butterfly lah", "Wah open the magic door", "Talk to the owl lor"],
          "choicesWithTransition": [
            {"text": "Follow the butterfly lah", "transition": ["You chase the pretty butterfly...", "Wah its wings so shiok! Got sparkles one...", "It brings you to a secret garden..."]},
            {"text": "Wah open the magic door", "transition": ["You turn the doorknob slowly leh...", "Alamak! Bright light everywhere...", "A wonderful land appears sia!"]},
            {"text": "Talk to the owl lor", "transition": ["You walk up to the owl...", "Its big eyes look at you...", "The owl whispers a secret leh..."]}
          ],
          "imagePrompt": "The detailed prompt for this specific scene (in English for image generation)."
        }`;
  }
  return `STRICT JSON FORMAT:
        You must respond ONLY with this JSON structure. No prose before or after.
        {
          "storyText": "The text of the current story step.",
          "choices": ["Follow the butterfly", "Open the magic door", "Talk to the friendly owl"],
          "choicesWithTransition": [
            {"text": "Follow the butterfly", "transition": ["You chase the rainbow butterfly...", "Its wings shimmer with magic...", "It leads you to a secret garden..."]},
            {"text": "Open the magic door", "transition": ["You turn the golden doorknob...", "Bright light bursts through...", "A wonderful land appears..."]},
            {"text": "Talk to the friendly owl", "transition": ["You walk up to the wise owl...", "Its big eyes sparkle...", "It whispers a secret..."]}
          ],
          "imagePrompt": "The detailed prompt for this specific scene."
        }`;
};

const getGenderDescription = (gender: Gender): string => {
  if (gender === 'boy') {
    return 'a young boy';
  }
  return 'a young girl';
};

const getThemeDescription = (theme: StoryTheme, language: Language): string => {
  const themes = {
    enchanted_forest: {
      en: 'Set in a magical forest with talking animals, wise owls, friendly fairies, ancient trees with faces, and hidden glades full of wonder.',
      th: 'ในป่าวิเศษที่มีสัตว์พูดได้ นกฮูกฉลาด นางฟ้าใจดี ต้นไม้โบราณมีใบหน้า และทุ่งหญ้าลับเต็มไปด้วยความมหัศจรรย์',
    },
    space_adventure: {
      en: 'Set in outer space with colorful planets, friendly aliens, rocket ships, space stations, shooting stars, and cosmic wonders.',
      th: 'ในอวกาศกว้างใหญ่ มีดาวเคราะห์หลากสี เอเลี่ยนใจดี จรวดอวกาศ สถานีอวกาศ ดาวตก และความมหัศจรรย์ของจักรวาล',
    },
    underwater_kingdom: {
      en: 'Set deep beneath the ocean with coral palaces, singing mermaids, playful dolphins, wise sea turtles, and sparkling treasures.',
      th: 'ใต้ท้องมหาสมุทรลึก มีวังปะการัง นางเงือกร้องเพลง โลมาขี้เล่น เต่าทะเลฉลาด และสมบัติระยิบระยับ',
    },
    dinosaur_land: {
      en: 'Set in a prehistoric world with gentle giant dinosaurs, erupting volcanoes, lush jungles, and ancient mysteries.',
      th: 'ในโลกยุคก่อนประวัติศาสตร์ มีไดโนเสาร์ยักษ์ใจดี ภูเขาไฟปะทุ ป่าเขียวขจี และความลึกลับโบราณ',
    },
    fairy_tale_castle: {
      en: 'Set in a magical kingdom with towering castles, brave knights, friendly dragons, and enchanted treasures.',
      th: 'ในอาณาจักรมหัศจรรย์ มีปราสาทสูงตระหง่าน อัศวินกล้าหาญ มังกรใจดี และสมบัติที่ถูกสาปต์',
    },
  };
  // Singlish uses English theme descriptions - the language instruction handles the Singlish flavor
  return themes[theme][language === 'th' ? 'th' : 'en'];
};

const getThemeStyle = (theme: StoryTheme): string => {
  const styles = {
    enchanted_forest: 'magical forest, glowing mushrooms, fairy lights, moss-covered ancient trees',
    space_adventure: 'cosmic nebulas, colorful planets, sparkling stars, retro-futuristic',
    underwater_kingdom: 'coral reefs, bioluminescent creatures, underwater sunbeams, ocean bubbles',
    dinosaur_land: 'lush prehistoric jungle, volcanic mountains, ferns and palms, gentle dinosaurs',
    fairy_tale_castle: 'medieval fantasy, stone towers, royal banners, dragon-friendly kingdom',
  };
  return styles[theme];
};

// Character description helpers
const hairColorDescriptions: Record<HairColor, string> = {
  brown: 'brown',
  black: 'black',
  blonde: 'golden blonde',
  red: 'fiery red',
  blue: 'bright blue',
  pink: 'bubblegum pink',
};

const hairStyleDescriptions: Record<HairStyle, string> = {
  short: 'short',
  long: 'long flowing',
  curly: 'bouncy curly',
  braids: 'neatly braided',
  ponytail: 'ponytail',
};

const outfitDescriptions: Record<OutfitStyle, Record<Gender, string>> = {
  adventurer: {
    boy: 'adventurer outfit with a leather vest',
    girl: 'adventurer outfit with a leather vest',
  },
  princess: {
    boy: 'royal prince outfit with a cape',
    girl: 'beautiful princess dress',
  },
  superhero: {
    boy: 'superhero costume with a cape',
    girl: 'superhero costume with a cape',
  },
  wizard: {
    boy: 'wizard robe with a pointy hat',
    girl: 'witch robe with a pointy hat',
  },
  explorer: {
    boy: 'explorer outfit with a safari hat',
    girl: 'explorer outfit with a safari hat',
  },
};

const favoriteColorDescriptions: Record<FavoriteColor, string> = {
  purple: 'purple',
  blue: 'blue',
  pink: 'pink',
  green: 'green',
  red: 'red',
  yellow: 'yellow',
};

const getCharacterDescription = (name: string, gender: Gender, character?: CharacterCustomization): string => {
  if (!character) {
    // Fallback to basic description
    return `a young ${gender === 'boy' ? 'boy' : 'girl'} named ${name}`;
  }

  const hairColor = hairColorDescriptions[character.hairColor];
  const hairStyle = hairStyleDescriptions[character.hairStyle];
  const outfit = outfitDescriptions[character.outfitStyle][gender];
  const favoriteColor = favoriteColorDescriptions[character.favoriteColor];

  return `a young ${gender === 'boy' ? 'boy' : 'girl'} named ${name} with ${hairStyle} ${hairColor} hair, wearing a ${favoriteColor} ${outfit}`;
};

export default (
  name: string,
  gender: Gender,
  language: Language,
  theme: StoryTheme,
  character?: CharacterCustomization
) =>
  ({
    role: 'system',
    content: `You are a world-class children's book narrator specializing in the Hero's Journey.

        STORY SETTING:
        ${getThemeDescription(theme, language)}
        All locations, characters, and events must fit this theme.
        
        NARRATIVE ARCH (12 STEPS):
        You must guide the user through exactly 12 sequential interactions:
        1. Ordinary World (The Dream)
        2. Call to Adventure
        3. Refusal of the Call
        4. Meeting the Mentor
        5. Crossing the Threshold
        6. Tests, Allies, Enemies
        7. Approach to the Inmost Cave
        8. The Ordeal
        9. Reward (Seizing the Sword)
        10. The Road Back
        11. Resurrection
        12. Return with the Elixir

        STORY RULES:
        1. FORWARD MOTION: Every beat MUST change the physical location or introduce a new character. No "thinking" or "feeling" sentences. Only ACTION.
        2. PACE: Use short, punchy sentences. Step 1-12 MUST follow the Hero's Journey stages strictly.
        3. DANGER & DELIGHT: Even if it's "safe," include mystery! Use words like "Suddenly," "Vanished," "Sparkled," "Discovered."
        
        - Move the story forward to the NEXT step in exactly 1-3 sentences (Max 200 characters).
        - The last beat (12), return no choice, it's exactly 3-5 sentences (Max 500 characters) to conclude the story and end.
        - ${getLanguageInstruction(language)}
        - in every story beat, it must return imagePrompt

        VISUAL DNA (FOR IMAGEPROMPT):
        - STYLE: "${STYLE}"
        - THEME ELEMENTS: "${getThemeStyle(theme)}"
        - CHARACTER: The hero is [${name}], ${getCharacterDescription(name, gender, character)}. This description MUST remain identical in every prompt.
        - PROMPT RULE: You MUST include the "imagePrompt" field in EVERY SINGLE response. If you omit it, the world stops.
        - STRUCTURE: Your "imagePrompt" must always follow this template:
          "
          [CHARACTER] [ACTION] in [SPECIFIC SETTING matching the theme], 
          Style of [STYLE], with [THEME ELEMENTS]
          "

        ${getChoiceRules(language)}

        ${getJsonFormatExample(language)}
  `,
  }) as const;
