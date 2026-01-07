import { Translations } from '../types';

/**
 * Thai translations
 */
const th: Translations = {
  // Start Screen
  'startScreen.subtitle': 'ชื่อของคุณคืออะไร นักสำรวจผู้กล้าหาญ?',
  'startScreen.nameLabel': 'ชื่อของคุณ',
  'startScreen.namePlaceholder': 'ใส่ชื่อของคุณ...',
  'startScreen.genderLabel': 'เพศ',
  'startScreen.genderBoy': '👦 ด.ช.',
  'startScreen.genderGirl': '👧 ด.ญ.',
  'startScreen.languageLabel': 'ภาษา',
  'startScreen.characterDesign': 'ออกแบบตัวละคร',
  'startScreen.storyWorld': 'โลกแห่งเรื่องราว',
  'startScreen.startAdventure': 'เริ่มการผจญภัย',

  // Story Screen
  'storyScreen.summary': '📖 สรุป',
  'storyScreen.galleryView': '🎠 ดูแกลเลอรี',
  'storyScreen.fullStory': '📖 อ่านเรื่องทั้งหมด',
  'storyScreen.completeStory': '📖 เรื่องราวทั้งหมด',
  'storyScreen.pageIndicator': 'หน้า {{current}}/12',

  // Choice Buttons
  'choiceButtons.congratsTitle': 'ยินดีด้วย นักผจญภัยผู้กล้าหาญ!',
  'choiceButtons.congratsMessage': 'คุณได้เสร็จสิ้นการเดินทางมหัศจรรย์แล้ว!',
  'choiceButtons.restartButton': 'จบเรื่อง - เริ่มการผจญภัยใหม่',

  // Export PDF
  'pdf.title': 'การผจญภัยของ',
  'pdf.subtitle': 'หนังสือนิทานส่วนตัว',
  'pdf.scenesCount': '{{count}} ฉาก',
  'pdf.sceneLabel': 'ฉากที่ {{index}}',
  'pdf.choiceLabel': 'คุณเลือก: ',
  'pdf.endText': 'จบ',
  'pdf.congratsText': 'ขอบคุณที่ร่วมผจญภัยไปด้วยกัน!',
  'pdf.creditText': 'สร้างสรรค์โดย {{name}}',
  'pdf.downloadButton': '📥 ดาวน์โหลดหนังสือเรื่องราว (PDF)',
  'pdf.creatingButton': '⏳ กำลังสร้าง PDF...',
  'pdf.errorText': 'ไม่สามารถสร้าง PDF ได้ กรุณาลองใหม่อีกครั้ง',

  // Transition Screen
  'transition.loading': '✨ เวทมนตร์กำลังทำงาน... ✨',

  // Story Carousel
  'carousel.noStory': 'ยังไม่มีเรื่องราว',
  'carousel.noImage': 'ไม่มีรูปภาพ',
  'carousel.youChose': 'คุณเลือก:',
  'carousel.navHint': 'ใช้ลูกศรซ้าย/ขวา หรือกดจุดเพื่อเลือกฉาก',
  'carousel.sceneIndicator': 'ฉาก {{current}} / {{total}}',

  // Speak Button
  'speak.listen': '🔊 ฟัง',
  'speak.stop': '🔇 หยุด',
  'speak.loading': '⏳ กำลังโหลด...',

  // Character Wizard
  'character.designTitle': 'ออกแบบตัวละครของคุณ',
  'character.hairColor': 'สีผม',
  'character.hairStyle': 'ทรงผม',
  'character.outfit': 'ชุด',
  'character.favoriteColor': 'สีโปรด (สำหรับชุด)',

  // Theme Labels
  'theme.enchantedForest': 'ป่าวิเศษ',
  'theme.spaceAdventure': 'ผจญภัยในอวกาศ',
  'theme.underwaterKingdom': 'อาณาจักรใต้ทะเล',
  'theme.dinosaurLand': 'ดินแดนไดโนเสาร์',
  'theme.fairyTaleCastle': 'ปราสาทเทพนิยาย',

  // Character Option Labels - Hair Colors
  'hairColor.brown': 'น้ำตาล',
  'hairColor.black': 'ดำ',
  'hairColor.blonde': 'บลอนด์',
  'hairColor.red': 'แดง',
  'hairColor.blue': 'ฟ้า',
  'hairColor.pink': 'ชมพู',

  // Character Option Labels - Hair Styles
  'hairStyle.short': 'สั้น',
  'hairStyle.long': 'ยาว',
  'hairStyle.curly': 'หยิก',
  'hairStyle.braids': 'ถักเปีย',
  'hairStyle.ponytail': 'มัดหางม้า',

  // Character Option Labels - Outfit Styles
  'outfit.adventurer': 'นักผจญภัย',
  'outfit.princess': 'เจ้าหญิง/เจ้าชาย',
  'outfit.superhero': 'ซูเปอร์ฮีโร่',
  'outfit.wizard': 'พ่อมด/แม่มด',
  'outfit.explorer': 'นักสำรวจ',

  // Character Option Labels - Favorite Colors
  'favoriteColor.purple': 'ม่วง',
  'favoriteColor.blue': 'ฟ้า',
  'favoriteColor.pink': 'ชมพู',
  'favoriteColor.green': 'เขียว',
  'favoriteColor.red': 'แดง',
  'favoriteColor.yellow': 'เหลือง',
};

export default th;
