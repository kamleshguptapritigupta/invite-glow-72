import { useState, useEffect, useMemo, useCallback } from 'react';

// Type definitions
export interface Language {
  code: string;
  name: string;
  flag: string;
  direction?: 'ltr' | 'rtl';
}

type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationDictionary = Record<string, TranslationValue>;
type TranslationParams = Record<string, string | number>;

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
  { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
  { code: 'gu', name: 'ગુજરાતી', flag: '🇮🇳' },
  { code: 'kn', name: 'ಕನ್ನಡ', flag: '🇮🇳' },
  { code: 'ml', name: 'മലയാളം', flag: '🇮🇳' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ', flag: '🇮🇳' },
  { code: 'or', name: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'ur', name: 'اردو', flag: '🇵🇰', direction: 'rtl' },
  { code: 'ne', name: 'नेपाली', flag: '🇳🇵' },
  { code: 'si', name: 'සිංහල', flag: '🇱🇰' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦', direction: 'rtl' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'id', name: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷', direction: 'rtl' },
  { code: 'sw', name: 'Kiswahili', flag: '🇰🇪' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'hu', name: 'Magyar', flag: '🇭🇺' },
  { code: 'ro', name: 'Română', flag: '🇷🇴' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'hr', name: 'Hrvatski', flag: '🇭🇷' },
  { code: 'sr', name: 'Српски', flag: '🇷🇸' },
  { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  { code: 'et', name: 'Eesti', flag: '🇪🇪' },
  { code: 'lv', name: 'Latviešu', flag: '🇱🇻' },
  { code: 'lt', name: 'Lietuvių', flag: '🇱🇹' },
  { code: 'mk', name: 'Македонски', flag: '🇲🇰' },
  { code: 'mt', name: 'Malti', flag: '🇲🇹' },
  { code: 'cy', name: 'Cymraeg', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿' },
  { code: 'ga', name: 'Gaeilge', flag: '🇮🇪' },
  { code: 'eu', name: 'Euskera', flag: '🇪🇸' },
  { code: 'ca', name: 'Català', flag: '🇪🇸' }
];

  // Translations for common greeting terms
const translations: TranslationDictionary = {
  'Create Your Greeting': {
    hi: 'अपना अभिवादन बनाएं',
    bn: 'আপনার শুভেচ্ছা তৈরি করুন',
    te: 'మీ శుభాకాంక్షలను సృష్టించండి',
    mr: 'तुमचे अभिवादन तयार करा',
    ta: 'உங்கள் வாழ்த்துக்களை உருவாக்குங்கள்',
    gu: 'તમારા અભિવાદન બનાવો',
    kn: 'ನಿಮ್ಮ ಶುಭಾಶಯಗಳನ್ನು ರಚಿಸಿ',
    ml: 'നിങ്ങളുടെ ആശംസകൾ സൃഷ്ടിക്കുക',
    pa: 'ਆਪਣੀ ਵਧਾਈ ਬਣਾਓ',
    ur: 'اپنا تحیہ بنائیں',
    es: 'Crea tu Saludo',
    fr: 'Créez votre Salutation',
    de: 'Erstellen Sie Ihren Gruß',
    zh: '创建您的问候语',
    ja: 'あいさつを作成',
    ko: '인사말 만들기',
    ar: 'إنشاء تحيتك',
    pt: 'Criar sua Saudação',
    ru: 'Создать приветствие',
    it: 'Crea il tuo Saluto',
     th: 'สร้างการทักทาย',

    vi: 'Tạo lời chào của bạn',

    id: 'Buat Salam Anda',

    ms: 'Cipta Salam Anda',

    tr: 'Selamlama Oluştur',

    fa: 'سلام خود را ایجاد کنید',

    sw: 'Unda Salamu Yako',

    nl: 'Maak je Groet',

    sv: 'Skapa din Hälsning',

    no: 'Lag din Hilsen',

    da: 'Lav din Hilsen',

    fi: 'Luo Tervehdyksesi',

    pl: 'Utwórz Powitanie',

    cs: 'Vytvořte Pozdrav',

    sk: 'Vytvorte Pozdrav',

    hu: 'Készítse el Üdvözlését',

    ro: 'Creează Salutul',

    bg: 'Създайте Поздрав',

    hr: 'Stvori Pozdrav',

    sr: 'Направи Поздрав',

    sl: 'Ustvari Pozdrav',

    et: 'Loo Tervitus',

    lv: 'Izveidot Sveicienu',

    lt: 'Sukurti Sveikinimą',

    mk: 'Создај Поздрав',

    mt: 'Oħloq Tislima',

    cy: 'Creu eich Cyfarchiad',

    ga: 'Cruthaigh do Bheannacht',

    eu: 'Sortu zure Agurra',

    ca: 'Crea la teva Salutació'
  },

  'Beautiful Greetings': {
    hi: 'सुंदर अभिवादन',
    bn: 'সুন্দর শুভেচ্ছা',
    te: 'అందమైన శుభాకాంక్షలు',
    mr: 'सुंदर अभिवादन',
    ta: 'அழகான வாழ்த்துக்கள்',
    gu: 'સુંદર અભિવાદન',
    kn: 'ಸುಂದರ ಶುಭಾಶಯಗಳು',
    ml: 'മനോഹരമായ ആശംസകൾ',
    pa: 'ਸੁੰਦਰ ਵਧਾਈਆਂ',
    ur: 'خوبصورت تحیات',
    es: 'Hermosos Saludos',
    fr: 'Belles Salutations',
    de: 'Schöne Grüße',
    zh: '美丽的问候',
    ja: '美しい挨拶',
    ko: '아름다운 인사말',
    ar: 'تحيات جميلة',
    pt: 'Lindas Saudações',
    ru: 'Красивые Приветствия',
     it: 'Bei Saluti',

    th: 'คำทักทายที่สวยงาม',

    vi: 'Lời chào đẹp',

    id: 'Salam Indah',

    ms: 'Salam Cantik',

    tr: 'Güzel Selamlar',

    fa: 'سلام‌های زیبا',

    sw: 'Salamu Nzuri',

    nl: 'Mooie Groeten',

    sv: 'Vackra Hälsningar',

    no: 'Vakre Hilsener',

    da: 'Smukke Hilsener',

    fi: 'Kauniit Tervehdykset',

    pl: 'Piękne Powitania',

    cs: 'Krásné Pozdravy',

    sk: 'Krásne Pozdravy',

    hu: 'Gyönyörű Üdvözletek',

    ro: 'Saluturi Frumoase',

    bg: 'Красиви Поздрави',

    hr: 'Lijepi Pozdravi',

    sr: 'Лепи Поздрави',

    sl: 'Lepi Pozdravi',

    et: 'Ilusad Tervitused',

    lv: 'Skaisti Sveicieni',

    lt: 'Gražūs Sveikinimai',

    mk: 'Убави Поздрави',

    mt: 'Tislimiet Sbieħ',

    cy: 'Cyfarchion Hardd',

    ga: 'Beannachtaí Áille',

    eu: 'Agur Ederrak',

    ca: 'Salutacions Boniques'
  },
  'For': {
    hi: 'के लिए',
    bn: 'জন্য',
    te: 'కోసం',
    mr: 'साठी',
    ta: 'க்காக',
    gu: 'માટે',
    kn: 'ಗಾಗಿ',
    ml: 'വേണ്ടി',
    pa: 'ਲਈ',
    ur: 'کے لیے',
    es: 'Para',
    fr: 'Pour',
    de: 'Für',
    zh: '为了',
    ja: 'のために',
    ko: '을 위해',
    ar: 'لـ',
    pt: 'Para',
    ru: 'Для',
    it: 'Per',

    th: 'สำหรับ',

    vi: 'Cho',

    id: 'Untuk',

    ms: 'Untuk',

    tr: 'İçin',

    fa: 'برای',

    sw: 'Kwa',

    nl: 'Voor',

    sv: 'För',

    no: 'For',

    da: 'Til',

    fi: 'Varten',

    pl: 'Dla',

    cs: 'Pro',

    sk: 'Pre',

    hu: 'Számára',

    ro: 'Pentru',

    bg: 'За',

    hr: 'Za',

    sr: 'За',

    sl: 'Za',

    et: 'Jaoks',

    lv: 'Priekš',

    lt: 'Skirta',

    mk: 'За',

    mt: 'Għal',

    cy: 'Ar gyfer',

    ga: 'Do',

    eu: 'Honentzat',

    ca: 'Per'
  },
  'With love from': {
    hi: 'प्रेम सहित',
    bn: 'ভালোবাসা সহ',
    te: 'ప్రేమతో',
    mr: 'प्रेमाने',
    ta: 'அன்புடன்',
    gu: 'પ્રેમથી',
    kn: 'ಪ್ರೀತಿಯಿಂದ',
    ml: 'സ്നേഹത്തോടെ',
    pa: 'ਪਿਆਰ ਨਾਲ',
    ur: 'محبت کے ساتھ',
    es: 'Con amor de',
    fr: 'Avec amour de',
    de: 'Mit Liebe von',
    zh: '爱来自',
    ja: '愛をこめて',
    ko: '사랑을 담아',
    ar: 'بحب من',
    pt: 'Com amor de',
    ru: 'С любовью от',
    it: 'Con amore da',

    th: 'ด้วยความรักจาก',

    vi: 'Với tình yêu từ',

    id: 'Dengan cinta dari',

    ms: 'Dengan kasih dari',

    tr: 'Sevgiyle',

    fa: 'با عشق از',

    sw: 'Kwa upendo kutoka',

    nl: 'Met liefde van',

    sv: 'Med kärlek från',

    no: 'Med kjærlighet fra',

    da: 'Med kærlighed fra',

    fi: 'Rakkaudella',

    pl: 'Z miłością od',

    cs: 'S láskou od',

    sk: 'S láskou od',

    hu: 'Szeretettel',

    ro: 'Cu dragoste de la',

    bg: 'С любов от',

    hr: 'S ljubavlju od',

    sr: 'Са љубављу од',

    sl: 'Z ljubeznijo od',

    et: 'Armastusega',

    lv: 'Ar mīlestību no',

    lt: 'Su meile nuo',

    mk: 'Со љубов од',

    mt: 'B\'imħabba minn',

    cy: 'Gyda chariad gan',

    ga: 'Le grá ó',

    eu: 'Maitasunez',

    ca: 'Amb amor de'
  },
  'Customize Your Greeting': {
    en: 'Customize Your Greeting',
    hi: 'अपनी शुभकामना अनुकूलित करें',
    bn: 'আপনার শুভেচ্ছা কাস্টমাইজ করুন',
    te: 'మీ అభినందనను కస్టమైజ్ చేయండి',
    mr: 'तुमचे शुभेच्छा सानुकूलित करा',
    ta: 'உங்கள் வாழ்த்துக்களை தனிப்பயனாக்குங்கள்',
    gu: 'તમારા શુભેચ્છાને કસ્ટમાઇઝ કરો',
    kn: 'ನಿಮ್ಮ ಶುಭಾಶಯಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಿ',
    ml: 'നിങ്ങളുടെ ആശംസകൾ ഇഷ്ടാനുസൃതമാക്കുക',
    pa: 'ਆਪਣੀ ਵਧਾਈ ਨੂੰ ਕਸਟਮਾਈਜ਼ ਕਰੋ',
    ur: 'اپنی مبارکباد کو اپنی مرضی کے مطابق بنائیں',
    es: 'Personaliza tu Saludo',
    fr: 'Personnalisez votre Salutation',
    de: 'Passen Sie Ihren Gruß an',
    zh: '定制您的问候语',
    ja: '挨拶をカスタマイズ',
    ko: '인사말 맞춤 설정',
    ar: 'تخصيص تحيتك',
    pt: 'Personalize sua Saudação',
    ru: 'Настройте свое приветствие',
    it: 'Personalizza il tuo Saluto',
    th: 'ปรับแต่งคำทักทายของคุณ',
    vi: 'Tùy chỉnh lời chào của bạn',
    id: 'Sesuaikan Ucapan Anda',
    ms: 'Sesuaikan Ucapan Anda',
    tr: 'Tebriğinizi Özelleştirin',
    fa: 'سفارشی کردن تبریک شما',
    sw: 'Sanidi Salamu Yako',
    nl: 'Pas uw Groet aan',
    sv: 'Anpassa din Hälsning',
    no: 'Tilpass din Hilsen',
    da: 'Tilpas din Hilsen',
    fi: 'Mukauta tervehdystäsi',
    pl: 'Dostosuj swoje Powitanie',
    cs: 'Přizpůsobte svůj Pozdrav',
    sk: 'Prispôsobte svoj Pozdrav',
    hu: 'Szabja testre Köszöntését',
    ro: 'Personalizați-vă Felicitarea',
    bg: 'Персонализирайте вашия Поздрав',
    hr: 'Prilagodite svoj Pozdrav',
    sr: 'Прилагодите свој Поздрав',
    sl: 'Prilagodite svoje Pozdravilo',
    et: 'Kohandage oma Tervitust',
    lv: 'Pielāgojiet savu Sveicienu',
    lt: 'Tinkinkite savo Sveikinimą',
    mk: 'Прилагодете го вашиот Поздрав',
    mt: 'Ippersonalizza l-Awguri tiegħek',
    cy: 'Cyfaddasu eich Cyfarchiad',
    ga: 'Saincheap do Bheannacht',
    eu: 'Pertsonalizatu zure Agurra',
    ca: 'Personalitzeu la vostra Felicitació'
  },
  'Live Preview (Click to Expand)': {
    en: 'Live Preview (Click to Expand)',
    hi: 'लाइव पूर्वावलोकन (विस्तार के लिए क्लिक करें)',
    bn: 'সরাসরি প্রিভিউ (প্রসারিত করতে ক্লিক করুন)',
    te: 'లైవ్ ప్రివ్యూ (విస్తరించడానికి క్లిక్ చేయండి)',
    mr: 'थेट पूर्वावलोकन (विस्तृत करण्यासाठी क्लिक करा)',
    ta: 'நேரடி முன்னோட்டம் (விரிவாக்க கிளிக் செய்யவும்)',
    gu: 'લાઇવ પ્રિવ્યુ (વિસ્તૃત કરવા માટે ક્લિક કરો)',
    kn: 'ಲೈವ್ ಪೂರ್ವವೀಕ್ಷಣೆ (ವಿಸ್ತರಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ)',
    ml: 'ലൈവ് പ്രിവ്യൂ (വികസിപ്പിക്കാൻ ക്ലിക്ക് ചെയ്യുക)',
    pa: 'ਲਾਈਵ ਪੂਰਵਝਲਕ (ਫੈਲਣ ਲਈ ਕਲਿੱਕ ਕਰੋ)',
    ur: 'لائیو پیش نظارہ (پھیلانے کے لیے کلک کریں)',
    es: 'Vista Previa en Vivo (Haz clic para Expandir)',
    fr: 'Aperçu en Direct (Cliquez pour Développer)',
    de: 'Live-Vorschau (Zum Erweitern klicken)',
    zh: '实时预览（点击展开）',
    ja: 'ライブプレビュー（クリックで展開）',
    ko: '라이브 미리보기 (클릭하여 확장)',
    ar: 'معاينة مباشرة (انقر للتوسيع)',
    pt: 'Pré-visualização ao Vivo (Clique para Expandir)',
    ru: 'Живой Предпросмотр (Нажмите, чтобы Развернуть)',
    it: 'Anteprima Live (Clicca per Espandere)',
    th: 'แสดงตัวอย่างสด (คลิกเพื่อขยาย)',
    vi: 'Xem trước trực tiếp (Nhấn để mở rộng)',
    id: 'Pratinjau Langsung (Klik untuk Memperluas)',
    ms: 'Pratonton Langsung (Klik untuk Kembangkan)',
    tr: 'Canlı Önizleme (Genişletmek için Tıklayın)',
    fa: 'پیش‌نمایش زنده (برای گسترش کلیک کنید)',
    sw: 'Hakiki Kivinjari (Bofya kupanua)',
    nl: 'Live Voorbeeld (Klik om uit te vouwen)',
    sv: 'Live Förhandsgranskning (Klicka för att expandera)',
    no: 'Live Forhåndsvisning (Klikk for å utvide)',
    da: 'Live Eksempel (Klik for at udvide)',
    fi: 'Live-esikatselu (Laajenna napsauttamalla)',
    pl: 'Podgląd na Żywo (Kliknij, aby rozwinąć)',
    cs: 'Živý Náhled (Klikněte pro rozšíření)',
    sk: 'Živá Ukážka (Kliknite pre rozšírenie)',
    hu: 'Élő Előnézet (Kattints a kibontáshoz)',
    ro: 'Previzualizare Live (Faceți clic pentru a extinde)',
    bg: 'Преглед на Живо (Кликнете за разширяване)',
    hr: 'Pregled uživo (Kliknite za proširenje)',
    sr: 'Преглед уживо (Кликните за проширење)',
    sl: 'Predogled v živo (Kliknite za razširitev)',
    et: 'Reaalajas Eelvaade (Klõpsake laiendamiseks)',
    lv: 'Tiešraides Priekšskatījums (Noklikšķiniet, lai paplašinātu)',
    lt: 'Tiesioginė Peržiūra (Spustelėkite, kad išplėstumėte)',
    mk: 'Преглед во живо (Кликнете за проширување)',
    mt: 'Dehri Qabel il-Ħajja (Ikklikkja biex Tespandi)',
    cy: 'Rhagolwg Byw (Cliciwch i Ehangu)',
    ga: 'Réamhamharc Beo (Cliceáil le Leathnú)',
    eu: 'Aurrebista Bizirik (Egin klik Zabaltzeko)',
    ca: 'Previsualització en Directe (Feu clic per Ampliar)'
  },
  'Select an event type to see your greeting preview': {
    en: 'Select an event type to see your greeting preview',
    hi: 'अपने अभिवादन पूर्वावलोकन देखने के लिए एक आयोजन प्रकार चुनें',
    bn: 'আপনার শুভেচ্ছা প্রিভিউ দেখতে একটি ইভেন্ট প্রকার নির্বাচন করুন',
    te: 'మీ అభినందన ప్రివ్యూ చూడటానికి ఈవెంట్ రకాన్ని ఎంచుకోండి',
    mr: 'तुमचे शुभेच्छा पूर्वावलोकन पाहण्यासाठी कार्यक्रम प्रकार निवडा',
    ta: 'உங்கள் வாழ்த்து முன்னோட்டத்தைப் பார்க்க ஒரு நிகழ்வு வகையைத் தேர்ந்தெடுக்கவும்',
    gu: 'તમારી શુભેચ્છાની પૂર્વદર્શન જોવા માટે ઇવેન્ટ પ્રકાર પસંદ કરો',
    kn: 'ನಿಮ್ಮ ಶುಭಾಶಯಗಳ ಪೂರ್ವವೀಕ್ಷಣೆ ನೋಡಲು ಈವೆಂಟ್ ಪ್ರಕಾರವನ್ನು ಆಯ್ಕೆಮಾಡಿ',
    ml: 'നിങ്ങളുടെ ആശംസയുടെ പ്രിവ്യൂ കാണാൻ ഒരു ഇവന്റ് തരം തിരഞ്ഞെടുക്കുക',
    pa: 'ਆਪਣੀ ਵਧਾਈ ਦੀ ਪੂਰਵਝਲਕ ਦੇਖਣ ਲਈ ਇੱਕ ਈਵੈਂਟ ਪ੍ਰਕਾਰ ਚੁਣੋ',
    ur: 'اپنی مبارکباد کا پیش نظارہ دیکھنے کے لیے ایک ایونٹ کی قسم منتخب کریں',
    es: 'Seleccione un tipo de evento para ver la vista previa de su saludo',
    fr: 'Sélectionnez un type d\'événement pour voir l\'aperçu de votre salutation',
    de: 'Wählen Sie einen Veranstaltungstyp, um eine Vorschau Ihrer Begrüßung zu sehen',
    zh: '选择活动类型以查看您的问候语预览',
    ja: 'イベントタイプを選択して挨拶のプレビューを表示',
    ko: '이벤트 유형을 선택하여 인사말 미리보기를 확인하세요',
    ar: 'حدد نوع الحدث لمعاينة تحيتك',
    pt: 'Selecione um tipo de evento para ver a pré-visualização da sua saudação',
    ru: 'Выберите тип мероприятия, чтобы увидеть предпросмотр вашего приветствия',
    it: 'Seleziona un tipo di evento per visualizzare l\'anteprima del tuo saluto',
    th: 'เลือกประเภทกิจกรรมเพื่อดูตัวอย่างคำทักทายของคุณ',
    vi: 'Chọn loại sự kiện để xem trước lời chào của bạn',
    id: 'Pilih jenis acara untuk melihat pratinjau ucapan Anda',
    ms: 'Pilih jenis acara untuk melihat pratonton ucapan anda',
    tr: 'Tebriğinizin önizlemesini görmek için bir etkinlik türü seçin',
    fa: 'یک نوع رویداد را انتخاب کنید تا پیش‌نمایش تبریک خود را ببینید',
    sw: 'Chagua aina ya hafla kuona hakiki ya salamu yako',
    nl: 'Selecteer een gebeurtenistype om uw voorbeeld van de begroeting te zien',
    sv: 'Välj en händelsetyp för att se din förhandsgranskning av hälsningen',
    no: 'Velg en hendelsestype for å se forhåndsvisningen av din hilsen',
    da: 'Vælg en begivenhedstype for at se din forhåndsvisning af hilsen',
    fi: 'Valitse tapahtumatyyppi nähdäksesi tervehdyksesi esikatselu',
    pl: 'Wybierz typ wydarzenia, aby zobaczyć podgląd swojej wiadomości powitalnej',
    cs: 'Vyberte typ události a zobrazte náhled svého pozdravu',
    sk: 'Vyberte typ udalosti, aby ste videli náhľad svojho pozdravu',
    hu: 'Válasszon egy eseménytípust a köszönés előnézetének megtekintéséhez',
    ro: 'Selectați un tip de eveniment pentru a vedea previzualizarea felicitării dvs.',
    bg: 'Изберете тип събитие, за да видите предварителен преглед на вашия поздрав',
    hr: 'Odaberite vrstu događaja da biste vidjeli pregled svoje čestitke',
    sr: 'Изаберите тип догађаја да бисте видели преглед вашег поздрава',
    sl: 'Izberite vrsto dogodka, da si ogledate predogled svojega pozdrava',
    et: 'Valige sündmuse tüüp, et näha oma tervituse eelvaadet',
    lv: 'Atlasiet pasākuma veidu, lai redzētu sava sveiciena priekšskatījumu',
    lt: 'Pasirinkite renginio tipą, kad pamatytumėte savo pasveikinimo peržiūrą',
    mk: 'Изберете тип на настан за да ја видите прегледот на вашиот поздрав',
    mt: 'Agħżel tip ta\' avveniment biex tara l-preview tal-awguri tiegħek',
    cy: 'Dewiswch fath o ddigwyddiad i weld rhagolwg eich cyfarchiad',
    ga: 'Roghnaigh cineál imeachta chun réamhamharc do bheannachta a fheiceáil',
    eu: 'Aukeratu ekitaldi mota bat zure agurraren aurrebista ikusteko',
    ca: 'Seleccioneu un tipus d\'esdeveniment per veure la previsualització de la vostra felicitació'
  },
  // Continue with all other phrases in the exact same format
  'Design a beautiful, personalized greeting to share with someone special': {
    en: 'Design a beautiful, personalized greeting to share with someone special',
    hi: 'किसी खास के साथ साझा करने के लिए एक सुंदर, वैयक्तिकृत अभिवादन डिजाइन करें',
    bn: 'কাউকে বিশেষ ভাগ করে নেওয়ার জন্য একটি সুন্দর, ব্যক্তিগতকৃত শুভেচ্ছা ডিজাইন করুন',
    te: 'ఎవరికైనా ప్రత్యేకంగా పంచుకోవడానికి ఒక అందమైన, వ్యక్తిగతీకరించిన అభినందనను రూపొందించండి',
    mr: 'एखाद्या विशेष व्यक्तीशी सामायिक करण्यासाठी एक सुंदर, वैयक्तिकृत शुभेच्छा डिझाइन करा',
    ta: 'ஒரு சிறப்பான நபருடன் பகிர்ந்து கொள்ள ஒரு அழகான, தனிப்பயனாக்கப்பட்ட வாழ்த்தை வடிவமைக்கவும்',
    gu: 'કોઈ ખાસ સાથે શેર કરવા માટે એક સુંદર, વ્યક્તિગત શુભેચ્છા ડિઝાઇન કરો',
    kn: 'ಯಾರೊಬ್ಬರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಲು ಸುಂದರವಾದ, ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಶುಭಾಶಯವನ್ನು ವಿನ್ಯಾಸಗೊಳಿಸಿ',
    ml: 'ആരെങ്കിലും പ്രത്യേകമായി പങ്കിടാൻ ഒരു മനോഹരവും വ്യക്തിഗതവുമായ ആശംസ രൂപകൽപ്പന ചെയ്യുക',
    pa: 'ਕਿਸੇ ਖਾਸ ਨਾਲ ਸਾਂਝਾ ਕਰਨ ਲਈ ਇੱਕ ਸੁੰਦਰ, ਨਿਜੀਕ੍ਰਿਤ ਵਧਾਈ ਡਿਜ਼ਾਈਨ ਕਰੋ',
    ur: 'کسی خاص کے ساتھ شیئر کرنے کے لیے ایک خوبصورت، ذاتی نوعیت کی مبارکباد ڈیزائن کریں',
    es: 'Diseña un hermoso saludo personalizado para compartir con alguien especial',
    fr: 'Concevez une belle salutation personnalisée à partager avec quelqu\'un de spécial',
    de: 'Gestalten Sie eine schöne, personalisierte Begrüßung, die Sie mit jemand Besonderem teilen können',
    zh: '设计一个美丽、个性化的问候语，与特别的人分享',
    ja: '特別な人と共有するための美しくパーソナライズされた挨拶をデザイン',
    ko: '특별한 사람과 공유할 아름답고 개인화된 인사말을 디자인하세요',
    ar: 'صمم تحية جميلة ومخصصة لمشاركتها مع شخص مميز',
    pt: 'Projete uma bela saudação personalizada para compartilhar com alguém especial',
    ru: 'Создайте красивое, персонализированное приветствие, чтобы поделиться с кем-то особенным',
    it: 'Progetta un bellissimo saluto personalizzato da condividere con qualcuno di speciale',
    th: 'ออกแบบคำทักทายที่สวยงามและเป็นส่วนตัวเพื่อแบ่งปันกับคนพิเศษ',
    vi: 'Thiết kế một lời chào đẹp, cá nhân hóa để chia sẻ với ai đó đặc biệt',
    id: 'Desain ucapan indah yang dipersonalisasi untuk dibagikan dengan seseorang yang spesial',
    ms: 'Reka bentuk ucapan yang indah dan peribadi untuk dikongsi dengan seseorang yang istimewa',
    tr: 'Özel biriyle paylaşmak için güzel, kişiselleştirilmiş bir tebrik tasarlayın',
    fa: 'یک تبریک زیبا و شخصی‌سازی شده برای به اشتراک گذاری با کسی خاص طراحی کنید',
    sw: 'Tengeneza salamu nzuri, maalum kwa kushiriki na mtu maalum',
    nl: 'Ontwerp een mooie, gepersonaliseerde begroeting om met iemand speciaals te delen',
    sv: 'Designa en vacker, personlig hälsning att dela med någon speciell',
    no: 'Design en vakker, personlig hilsen å dele med noen spesielle',
    da: 'Design en smuk, personlig hilsen at dele med en særlig',
    fi: 'Suunnittele kaunis, personoitu tervehdys jaettavaksi jonkun erityisen kanssa',
    pl: 'Zaprojektuj piękne, spersonalizowane powitanie, aby podzielić się z kimś wyjątkowym',
    cs: 'Navrhněte krásné, personalizované pozdravy, které můžete sdílet s někým speciálním',
    sk: 'Navrhnite krásny, personalizovaný pozdrav, ktorý môžete zdieľať s niekým výnimočným',
    hu: 'Tervezz egy gyönyörű, személyre szabott köszöntést, hogy meg tudd osztani valaki különlegessel',
    ro: 'Proiectați o felicitare frumoasă, personalizată pentru a o împărtăși cu cineva special',
    bg: 'Създайте красив, персонализиран поздрав, който да споделите с някой специален',
    hr: 'Dizajnirajte lijepu, personaliziranu čestitku za dijeljenje s nekim posebnim',
    sr: 'Дизајнирајте лепу, персонализовану честитку коју делите са неким посебним',
    sl: 'Oblikujte lepo, personalizirano voščilo, ki ga delite z nekom posebno',
    et: 'Kujundage ilus, isikupärastatud tervitus, mida jagada kellegi erilisega',
    lv: 'Izveidojiet skaistu, personalizētu sveicienu, ko dalīt ar kādu īpašu',
    lt: 'Sukurkite gražų, individualizuotą pasveikinimą, kurį galėtumėte pasidalyti su kažkuo ypatingu',
    mk: 'Дизајнирајте убав, персонализиран поздрав за споделување со некој посебен',
    mt: 'Iddisinja awguri sabiħ, personalizzat biex taqsam ma\' xi ħadd speċjali',
    cy: 'Dyluniwch gyfarchiad hardd, wedi\'i bersonoli i\'w rannu gyda rhywun arbennig',
    ga: 'Dearadh beannacht álainn, pearsanta le roinnt le duine speisialta',
    eu: 'Diseinatu agur eder eta pertsonalizatu bat norbait bereziarekin partekatzeko',
    ca: 'Dissenyeu una felicitació bonica i personalitzada per compartir amb algú especial'
  },
   'Download your greeting or share it with others': {
    en: 'Download your greeting or share it with others',
    hi: 'अपनी शुभकामना डाउनलोड करें या दूसरों के साथ साझा करें',
    bn: 'আপনার শুভেচ্ছা ডাউনলোড করুন বা অন্যদের সাথে শেয়ার করুন',
    te: 'మీ అభినందనను డౌన్లోడ్ చేసుకోండి లేదా ఇతరులతో షేర్ చేయండి',
    mr: 'तुमच्या शुभेच्छा डाउनलोड करा किंवा इतरांसोबत शेअर करा',
    ta: 'உங்கள் வாழ்த்துக்களை பதிவிறக்கவும் அல்லது மற்றவர்களுடன் பகிரவும்',
    gu: 'તમારી શુભેચ્છા ડાઉનલોડ કરો અથવા અન્ય સાથે શેર કરો',
    kn: 'ನಿಮ್ಮ ಶುಭಾಶಯಗಳನ್ನು ಡೌನ್ಲೋಡ್ ಮಾಡಿ ಅಥವಾ ಇತರರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ',
    ml: 'നിങ്ങളുടെ ആശംസ ഡൗൺലോഡ് ചെയ്യുക അല്ലെങ്കിൽ മറ്റുള്ളവരുമായി പങ്കിടുക',
    pa: 'ਆਪਣੀ ਵਧਾਈ ਡਾਊਨਲੋਡ ਕਰੋ ਜਾਂ ਦੂਜਿਆਂ ਨਾਲ ਸਾਂਝੀ ਕਰੋ',
    ur: 'اپنی مبارکباد ڈاؤن لوڈ کریں یا دوسروں کے ساتھ شیئر کریں',
    es: 'Descarga tu saludo o compártelo con otros',
    fr: 'Téléchargez votre salutation ou partagez-la avec d\'autres',
    de: 'Laden Sie Ihren Gruß herunter oder teilen Sie ihn mit anderen',
    zh: '下载您的问候语或与他人分享',
    ja: '挨拶をダウンロードまたは共有',
    ko: '인사말을 다운로드하거나 다른 사람들과 공유하세요',
    ar: 'قم بتنزيل تحيتك أو مشاركتها مع الآخرين',
    pt: 'Baixe sua saudação ou compartilhe com outros',
    ru: 'Скачайте свое приветствие или поделитесь им с другими',
    it: 'Scarica il tuo saluto o condividilo con altri',
    th: 'ดาวน์โหลดคำทักทายของคุณหรือแบ่งปันกับผู้อื่น',
    vi: 'Tải xuống lời chào của bạn hoặc chia sẻ với người khác',
    id: 'Unduh ucapan Anda atau bagikan dengan orang lain',
    ms: 'Muat turun ucapan anda atau kongsi dengan orang lain',
    tr: 'Tebriğinizi indirin veya başkalarıyla paylaşın',
    fa: 'تبریک خود را دانلود کنید یا با دیگران به اشتراک بگذارید',
    sw: 'Pakua salamu yako au ushiriki na wengine',
    nl: 'Download uw groet of deel deze met anderen',
    sv: 'Ladda ner din hälsning eller dela den med andra',
    no: 'Last ned hilsenen din eller del den med andre',
    da: 'Download din hilsen eller del den med andre',
    fi: 'Lataa tervehdys tai jaa se muiden kanssa',
    pl: 'Pobierz swoje powitanie lub udostępnij je innym',
    cs: 'Stáhněte si svůj pozdrav nebo jej sdílejte s ostatními',
    sk: 'Stiahnite si svoj pozdrav alebo ho zdieľajte s ostatnými',
    hu: 'Töltse le köszöntését vagy ossza meg másokkal',
    ro: 'Descărcați-vă felicitarea sau partajați-o cu alții',
    bg: 'Изтеглете поздравлението си или го споделете с други',
    hr: 'Preuzmite svoju čestitku ili je podijelite s drugima',
    sr: 'Преузмите свој поздрав или га поделите са другима',
    sl: 'Prenesite svoje voščilo ali ga delite z drugimi',
    et: 'Laadige oma tervitus alla või jagage seda teistega',
    lv: 'Lejupielādējiet savu sveicienu vai koplietojiet to ar citiem',
    lt: 'Atsisiųskite savo pasveikinimą arba pasidalykite juo su kitais',
    mk: 'Преземете го вашиот поздрав или споделете го со другите',
    mt: 'Niżżel l-awguri tiegħek jew aqsamhom ma\' oħrajn',
    cy: 'Lawrlwythwch eich cyfarchiad neu ei rannu gydag eraill',
    ga: 'Íoslódáil do bheannacht nó roinn é le daoine eile',
    eu: 'Deskargatu zure agurra edo partekatu besteekin',
    ca: 'Baixeu la vostra felicitació o compartiu-la amb altres'
  },
  'Customize and share with others': {
    en: 'Customize and share with others',
    hi: 'अनुकूलित करें और दूसरों के साथ साझा करें',
    bn: 'কাস্টমাইজ করুন এবং অন্যদের সাথে শেয়ার করুন',
    te: 'కస్టమైజ్ చేసుకోండి మరియు ఇతరులతో షేర్ చేయండి',
    mr: 'सानुकूलित करा आणि इतरांसोबत शेअर करा',
    ta: 'தனிப்பயனாக்கி மற்றவர்களுடன் பகிரவும்',
    gu: 'કસ્ટમાઇઝ કરો અને અન્ય સાથે શેર કરો',
    kn: 'ಕಸ್ಟಮೈಸ್ ಮಾಡಿ ಮತ್ತು ಇತರರೊಂದಿಗೆ ಹಂಚಿಕೊಳ್ಳಿ',
    ml: 'ഇഷ്ടാനുസൃതമാക്കുകയും മറ്റുള്ളവരുമായി പങ്കിടുകയും ചെയ്യുക',
    pa: 'ਕਸਟਮਾਈਜ਼ ਕਰੋ ਅਤੇ ਦੂਜਿਆਂ ਨਾਲ ਸਾਂਝੀ ਕਰੋ',
    ur: 'اپنی مرضی کے مطابق بنائیں اور دوسروں کے ساتھ شیئر کریں',
    es: 'Personaliza y comparte con otros',
    fr: 'Personnalisez et partagez avec d\'autres',
    de: 'Passen Sie an und teilen Sie mit anderen',
    zh: '自定义并与他人分享',
    ja: 'カスタマイズして共有',
    ko: '맞춤 설정하고 다른 사람들과 공유하세요',
    ar: 'تخصيص ومشاركة مع الآخرين',
    pt: 'Personalize e compartilhe com outros',
    ru: 'Настройте и поделитесь с другими',
    it: 'Personalizza e condividi con altri',
    th: 'ปรับแต่งและแบ่งปันกับผู้อื่น',
    vi: 'Tùy chỉnh và chia sẻ với người khác',
    id: 'Sesuaikan dan bagikan dengan orang lain',
    ms: 'Sesuaikan dan kongsi dengan orang lain',
    tr: 'Özelleştirin ve başkalarıyla paylaşın',
    fa: 'شخصی‌سازی کنید و با دیگران به اشتراک بگذارید',
    sw: 'Sanidi na kushiriki na wengine',
    nl: 'Pas aan en deel met anderen',
    sv: 'Anpassa och dela med andra',
    no: 'Tilpass og del med andre',
    da: 'Tilpas og del med andre',
    fi: 'Mukauta ja jaa muiden kanssa',
    pl: 'Dostosuj i udostępnij innym',
    cs: 'Přizpůsobte a sdílejte s ostatními',
    sk: 'Prispôsobte a zdieľajte s ostatnými',
    hu: 'Szabja testre és ossza meg másokkal',
    ro: 'Personalizați și partajați cu alții',
    bg: 'Персонализирайте и споделете с други',
    hr: 'Prilagodite i podijelite s drugima',
    sr: 'Прилагодите и поделите са другима',
    sl: 'Prilagodite in delite z drugimi',
    et: 'Kohandage ja jagage teistega',
    lv: 'Pielāgojiet un koplietojiet ar citiem',
    lt: 'Pritaikykite ir pasidalykite su kitais',
    mk: 'Прилагодете и споделете со другите',
    mt: 'Ippersonalizza u aqsam ma\' oħrajn',
    cy: 'Addaswch a rhannwch gydag eraill',
    ga: 'Saincheap agus roinn le daoine eile',
    eu: 'Pertsonalizatu eta partekatu besteekin',
    ca: 'Personalitzeu i compartiu amb altres'
  },
  'Let\'s Get Started!': {
    en: 'Let\'s Get Started!',
    hi: 'आइए शुरू करें!',
    bn: 'চলুন শুরু করা যাক!',
    te: 'ప్రారంభిద్దాం!',
    mr: 'चला सुरु करूया!',
    ta: 'ஆரம்பிக்கலாம்!',
    gu: 'ચાલો શરૂ કરીએ!',
    kn: 'ಪ್ರಾರಂಭಿಸೋಣ!',
    ml: 'നമുക്ക് തുടങ്ങാം!',
    pa: 'ਆਓ ਸ਼ੁਰੂ ਕਰੀਏ!',
    ur: 'آئیے شروع کرتے ہیں!',
    es: '¡Empecemos!',
    fr: 'Commençons!',
    de: 'Lass uns anfangen!',
    zh: '让我们开始吧！',
    ja: '始めましょう！',
    ko: '시작하겠습니다!',
    ar: 'لنبدأ!',
    pt: 'Vamos começar!',
    ru: 'Давайте начнем!',
    it: 'Iniziamo!',
    th: 'มาเริ่มกันเลย!',
    vi: 'Hãy bắt đầu nào!',
    id: 'Ayo mulai!',
    ms: 'Mari kita mulakan!',
    tr: 'Hadi başlayalım!',
    fa: 'بیایید شروع کنیم!',
    sw: 'Tuanze!',
    nl: 'Laten we beginnen!',
    sv: 'Låt oss börja!',
    no: 'La oss komme i gang!',
    da: 'Lad os komme i gang!',
    fi: 'Aloitetaan!',
    pl: 'Zaczynajmy!',
    cs: 'Začněme!',
    sk: 'Začnime!',
    hu: 'Kezdjük!',
    ro: 'Să începem!',
    bg: 'Да започваме!',
    hr: 'Počnimo!',
    sr: 'Почнимо!',
    sl: 'Začnimo!',
    et: 'Alustame!',
    lv: 'Sāksim!',
    lt: 'Pradėkime!',
    mk: 'Да започнеме!',
    mt: 'Nibdew!',
    cy: 'Gadewch i ni ddechrau!',
    ga: 'Tosaímid!',
    eu: 'Hasi dezagun!',
    ca: 'Comencem!'
  },
  'Amazing Features': {
    en: 'Amazing Features',
    hi: 'अद्भुत सुविधाएँ',
    bn: 'আশ্চর্যজনক বৈশিষ্ট্য',
    te: 'అద్భుతమైన లక్షణాలు',
    mr: 'अद्भुत वैशिष्ट्ये',
    ta: 'அற்புதமான அம்சங்கள்',
    gu: 'અદ્ભુત સુવિધાઓ',
    kn: 'ಅದ್ಭುತ ವೈಶಿಷ್ಟ್ಯಗಳು',
    ml: 'അതിശയിപ്പിക്കുന്ന സവിശേഷതകൾ',
    pa: 'ਸ਼ਾਨਦਾਰ ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
    ur: 'حیرت انگیز خصوصیات',
    es: 'Características Increíbles',
    fr: 'Fonctionnalités Incroyables',
    de: 'Erstaunliche Funktionen',
    zh: '惊人的特点',
    ja: '素晴らしい機能',
    ko: '놀라운 기능들',
    ar: 'ميزات مذهلة',
    pt: 'Recursos Incríveis',
    ru: 'Удивительные Особенности',
    it: 'Caratteristiche Straordinarie',
    th: 'คุณสมบัติที่น่าทึ่ง',
    vi: 'Tính năng tuyệt vời',
    id: 'Fitur Menakjubkan',
    ms: 'Ciri-ciri Hebat',
    tr: 'Harika Özellikler',
    fa: 'ویژگی های شگفت انگیز',
    sw: 'Vipengele Vya Kuvutia',
    nl: 'Geweldige Functies',
    sv: 'Fantastiska Funktioner',
    no: 'Fantastiske Funksjoner',
    da: 'Fantastiske Funktioner',
    fi: 'Upeat Ominaisuudet',
    pl: 'Niesamowite Funkcje',
    cs: 'Úžasné Funkce',
    sk: 'Úžasné Funkcie',
    hu: 'Csodálatos Jellemzők',
    ro: 'Caracteristici Uimitoare',
    bg: 'Невероятни Характеристики',
    hr: 'Nevjerojatne Značajke',
    sr: 'Невероватне Карактеристике',
    sl: 'Neverjetne Funkcije',
    et: 'Hämmastavad Funktsioonid',
    lv: 'Apbrīnojamas Iespējas',
    lt: 'Nuostabios Savybės',
    mk: 'Неверојатни Карактеристики',
    mt: 'Karatteristiċi Aqwa',
    cy: 'Nodweddion Rhyfeddol',
    ga: 'Gnéithe Iontacha',
    eu: 'Ezaugarri Harrigarriak',
    ca: 'Característiques Increïbles'
  },
  'Create stunning, personalized greeting cards for any occasion.': {
    en: 'Create stunning, personalized greeting cards for any occasion.',
    hi: 'किसी भी अवसर के लिए आश्चर्यजनक, वैयक्तिकृत शुभकामना कार्ड बनाएं।',
    bn: 'যেকোনো উপলক্ষের জন্য চমৎকার, ব্যক্তিগতকৃত শুভেচ্ছা কার্ড তৈরি করুন।',
    te: 'ఏ సందర్భానికైనా అద్భుతమైన, వ్యక్తిగతీకరించిన శుభాకాంక్షల కార్డులను సృష్టించండి.',
    mr: 'कोणत्याही प्रसंगासाठी आश्चर्यकारक, वैयक्तिकृत शुभेच्छा कार्ड तयार करा.',
    ta: 'எந்தவொரு சந்தர்ப்பத்திற்கும் அற்புதமான, தனிப்பயனாக்கப்பட்ட வாழ்த்து அட்டைகளை உருவாக்கவும்.',
    gu: 'કોઈ પણ પ્રસંગ માટે સુંદર, વ્યક્તિગત શુભેચ્છા કાર્ડ બનાવો.',
    kn: 'ಯಾವುದೇ ಸಂದರ್ಭಕ್ಕೆ ಅದ್ಭುತ, ವೈಯಕ್ತಿಕಗೊಳಿಸಿದ ಶುಭಾಶಯ ಪತ್ರಿಕೆಗಳನ್ನು ರಚಿಸಿ.',
    ml: 'ഏത് സന്ദർഭത്തിനും അതിശയിപ്പിക്കുന്ന, വ്യക്തിഗത ആശംസാ കാർഡുകൾ സൃഷ്ടിക്കുക.',
    pa: 'ਕਿਸੇ ਵੀ ਮੌਕੇ ਲਈ ਸ਼ਾਨਦਾਰ, ਨਿਜੀਕ੍ਰਿਤ ਵਧਾਈ ਕਾਰਡ ਬਣਾਓ.',
    ur: 'کسی بھی موقع کے لیے شاندار، ذاتی نوعیت کے مبارکباد کارڈز بنائیں۔',
    es: 'Crea impresionantes tarjetas de felicitación personalizadas para cualquier ocasión.',
    fr: 'Créez de superbes cartes de vœux personnalisées pour toutes les occasions.',
    de: 'Erstellen Sie atemberaubende, personalisierte Grußkarten für jeden Anlass.',
    zh: '为任何场合创建令人惊叹的个性化贺卡。',
    ja: 'あらゆる機会に素晴らしいパーソナライズされたグリーティングカードを作成します。',
    ko: '모든 행사를 위한 멋진 맞춤형 인사 카드를 만드세요.',
    ar: 'إنشاء بطاقات تهنئة مذهلة ومخصصة لأي مناسبة.',
    pt: 'Crie cartões de felicitações incríveis e personalizados para qualquer ocasião.',
    ru: 'Создавайте потрясающие персонализированные поздравительные открытки для любого случая.',
    it: 'Crea biglietti di auguri personalizzati e straordinari per ogni occasione.',
    th: 'สร้างการ์ดอวยพรที่สวยงามและเป็นส่วนตัวสำหรับทุกโอกาส',
    vi: 'Tạo thiệp chúc mừng cá nhân tuyệt đẹp cho mọi dịp.',
    id: 'Buat kartu ucapan yang menakjubkan dan dipersonalisasi untuk setiap acara.',
    ms: 'Cipta kad ucapan yang menakjubkan dan peribadi untuk sebarang majlis.',
    tr: 'Her türlü etkinlik için harika, kişiselleştirilmiş tebrik kartları oluşturun.',
    fa: 'کارت‌های تبریک خیره‌کننده و شخصی‌سازی شده برای هر مناسبت ایجاد کنید.',
    sw: 'Unda kadi za salamu zenye kuvutia na za kibinafsi kwa hafla yoyote.',
    nl: 'Maak prachtige, gepersonaliseerde wenskaarten voor elke gelegenheid.',
    sv: 'Skapa fantastiska, personliga gratulationskort för alla tillfällen.',
    no: 'Lag fantastiske, personlige gratulasjonskort for enhver anledning.',
    da: 'Lav fantastiske, personlige hilsenskort til enhver lejlighed.',
    fi: 'Luo upeita, personoituja onnittelukortteja kaikkiin tilaisuuksiin.',
    pl: 'Twórz oszałamiające, spersonalizowane karty okolicznościowe na każdą okazję.',
    cs: 'Vytvářejte úžasné, personalizované blahopřání pro jakoukoli příležitost.',
    sk: 'Vytvárajte úžasné, personalizované gratulačné karty na každú príležitosť.',
    hu: 'Készítsen lenyűgöző, személyre szabott üdvözlőlapokat bármilyen alkalomra.',
    ro: 'Creați cărți de felicitare uimitoare și personalizate pentru orice ocazie.',
    bg: 'Създавайте впечатляващи, персонализирани поздравителни карти за всяка повод.',
    hr: 'Stvorite zadivljujuće, personalizirane čestitke za bilo koju priliku.',
    sr: 'Направите невероватне, персонализоване честитке за било коју прилику.',
    sl: 'Ustvarite osupljive, personalizirane voščilne kartice za vsako priložnost.',
    et: 'Looge hämmastavaid, isikupärastatud õnnitluskaarte igaks sündmuseks.',
    lv: 'Izveidojiet aizraujošas, personalizētas apsveikuma kartītes jebkuram gadījumam.',
    lt: 'Sukurkite nuostabius, individualius sveikinimo korteles bet kuriam renginiui.',
    mk: 'Создадете неверојатни, персонализирани честитки за секоја прилика.',
    mt: 'Oħloq karti ta\' awguri personalizzati u aqwa għal kull okkażjoni.',
    cy: 'Creu cardiau cyfarch personol syfrdanol ar gyfer unrhyw achlysur.',
    ga: 'Cruthaigh cártaí beannachta iontacha, pearsanta d\'aon ócáid.',
    eu: 'Sortu txartel zoragarri eta pertsonalizatuak edozein ekitalditarako.',
    ca: 'Creeu targetes de felicitació impressionants i personalitzades per a qualsevol ocasió.'
  },
  'Share joy, love, and celebration with beautiful animations.': {
    en: 'Share joy, love, and celebration with beautiful animations.',
    hi: 'सुंदर एनिमेशन के साथ खुशी, प्यार और उत्सव साझा करें।',
    bn: 'সুন্দর অ্যানিমেশনের সাথে আনন্দ, ভালোবাসা এবং উদযাপন শেয়ার করুন।',
    te: 'అందమైన యానిమేషన్లతో ఆనందం, ప్రేమ మరియు వేడుకలను పంచుకోండి.',
    mr: 'सुंदर ॲनिमेशनसह आनंद, प्रेम आणि उत्सव सामायिक करा.',
    ta: 'அழகான அனிமேஷன்களுடன் மகிழ்ச்சி, அன்பு மற்றும் கொண்டாட்டத்தைப் பகிர்ந்து கொள்ளுங்கள்.',
    gu: 'સુંદર એનિમેશન સાથે આનંદ, પ્રેમ અને ઉજવણી શેર કરો.',
    kn: 'ಸುಂದರವಾದ ಅನಿಮೇಷನ್ಗಳೊಂದಿಗೆ ಸಂತೋಷ, ಪ್ರೀತಿ ಮತ್ತು ಆಚರಣೆಯನ್ನು ಹಂಚಿಕೊಳ್ಳಿ.',
    ml: 'മനോഹരമായ ആനിമേഷനുകൾ ഉപയോഗിച്ച് സന്തോഷം, സ്നേഹം, ആഘോഷങ്ങൾ പങ്കിടുക.',
    pa: 'ਸੁੰਦਰ ਐਨੀਮੇਸ਼ਨਾਂ ਨਾਲ ਖੁਸ਼ੀ, ਪਿਆਰ ਅਤੇ ਜਸ਼ਨ ਸਾਂਝੇ ਕਰੋ.',
    ur: 'خوبصورت اینیمیشنز کے ساتھ خوشی، محبت اور جشن شیئر کریں۔',
    es: 'Comparte alegría, amor y celebración con hermosas animaciones.',
    fr: 'Partagez la joie, l\'amour et la célébration avec de belles animations.',
    de: 'Teilen Sie Freude, Liebe und Feier mit wunderschönen Animationen.',
    zh: '通过精美的动画分享快乐、爱和庆祝。',
    ja: '美しいアニメーションで喜び、愛、お祝いを共有しましょう。',
    ko: '아름다운 애니메이션으로 기쁨, 사랑, 축하를 나누세요.',
    ar: 'شارك الفرح والحب والاحتفال مع رسوم متحركة جميلة.',
    pt: 'Compartilhe alegria, amor e celebração com lindas animações.',
    ru: 'Делитесь радостью, любовью и праздником с красивыми анимациями.',
    it: 'Condividi gioia, amore e celebrazione con bellissime animazioni.',
    th: 'แบ่งปันความสุข ความรัก และการเฉลิมฉลองด้วยภาพเคลื่อนไหวที่สวยงาม',
    vi: 'Chia sẻ niềm vui, tình yêu và lễ kỷ niệm với hình ảnh động đẹp mắt.',
    id: 'Bagikan sukacita, cinta, dan perayaan dengan animasi yang indah.',
    ms: 'Kongsi kegembiraan, cinta dan sambutan dengan animasi yang cantik.',
    tr: 'Güzel animasyonlarla neşe, sevgi ve kutlamayı paylaşın.',
    fa: 'شادی، عشق و جشن را با انیمیشن های زیبا به اشتراک بگذارید.',
    sw: 'Shiriki furaha, upendo na sherehe na uhuishaji mzuri.',
    nl: 'Deel vreugde, liefde en viering met prachtige animaties.',
    sv: 'Dela glädje, kärlek och firande med vackra animationer.',
    no: 'Del glede, kjærlighet og feiring med vakre animasjoner.',
    da: 'Del glæde, kærlighed og fejring med smukke animationer.',
    fi: 'Jaa iloa, rakkautta ja juhlaa kauniiden animaatioiden kanssa.',
    pl: 'Dziel się radością, miłością i świętowaniem z pięknymi animacjami.',
    cs: 'Sdílejte radost, lásku a oslavy s krásnými animacemi.',
    sk: 'Zdieľajte radosť, lásku a oslavy s krásnymi animáciami.',
    hu: 'Ossza meg az örömöt, szeretetet és ünneplést gyönyörű animációkkal.',
    ro: 'Împărtășiți bucurie, dragoste și sărbătoare cu animații frumoase.',
    bg: 'Споделете радост, любов и празненство с красиви анимации.',
    hr: 'Podijelite radost, ljubav i slavlje s prekrasnim animacijama.',
    sr: 'Поделите радост, љубав и прославу са прелепим анимацијама.',
    sl: 'Delite veselje, ljubezen in praznovanje s čudovitimi animacijami.',
    et: 'Jagage rõõmu, armastust ja tähistamist ilusate animatsioonidega.',
    lv: 'Dalieties ar prieku, mīlestību un svinēšanu ar skaistām animācijām.',
    lt: 'Dalinkitės džiaugsmu, meile ir šventėmis su gražiais animacijomis.',
    mk: 'Споделете радост, љубов и прослава со убави анимации.',
    mt: 'Aqsam ferħ, mħabba u ċelebrazzjoni b\'animazzjonijiet sabiħin.',
    cy: 'Rhannwch lawenydd, cariad a dathlu gydag animeiddiadau hyfryd.',
    ga: 'Roinn áthas, grá agus ceiliúradh le beochana álainn.',
    eu: 'Partekatu pozak, maitasuna eta ospakizuna animazio ederrekin.',
    ca: 'Compartiu alegria, amor i celebració amb boniques animacions.'
  },
  'Send your wishes in style with custom messages!': {
    en: 'Send your wishes in style with custom messages!',
    hi: 'कस्टम संदेशों के साथ स्टाइल में अपनी शुभकामनाएं भेजें!',
    bn: 'কাস্টম বার্তা দিয়ে স্টাইলে আপনার শুভেচ্ছা পাঠান!',
    te: 'కస్టమ్ సందేశాలతో స్టైల్‌గా మీ శుభాకాంక్షలను పంపండి!',
    mr: 'कस्टम संदेशांसह स्टाईलमध्ये तुमच्या शुभेच्छा पाठवा!',
    ta: 'தனிப்பயன் செய்திகளுடன் பாணியில் உங்கள் வாழ்த்துக்களை அனுப்பவும்!',
    gu: 'કસ્ટમ સંદેશાઓ સાથે સ્ટાઇલમાં તમારી શુભેચ્છાઓ મોકલો!',
    kn: 'ಕಸ್ಟಮ್ ಸಂದೇಶಗಳೊಂದಿಗೆ ಶೈಲಿಯಲ್ಲಿ ನಿಮ್ಮ ಶುಭಾಶಯಗಳನ್ನು ಕಳುಹಿಸಿ!',
    ml: 'ഇഷ്ടാനുസൃത സന്ദേശങ്ങൾ ഉപയോഗിച്ച് സ്റ്റൈലിൽ നിങ്ങളുടെ ആശംസകൾ അയയ്ക്കുക!',
    pa: 'ਕਸਟਮ ਸੁਨੇਹਿਆਂ ਨਾਲ ਸਟਾਈਲ ਵਿੱਚ ਆਪਣੀਆਂ ਸ਼ੁਭਕਾਮਨਾਵਾਂ ਭੇਜੋ!',
    ur: 'اپنی مرضی کے پیغامات کے ساتھ سٹائل میں اپنی مبارکبادیں بھیجیں!',
    es: '¡Envía tus deseos con estilo con mensajes personalizados!',
    fr: 'Envoyez vos vœux avec style grâce à des messages personnalisés !',
    de: 'Senden Sie Ihre Wünsche stilvoll mit individuellen Nachrichten!',
    zh: '用自定义消息发送您的祝福！',
    ja: 'カスタムメッセージでスタイリッシュに願いを送ろう！',
    ko: '맞춤형 메시지로 스타일리시하게 소원을 보내세요!',
    ar: 'أرسل أمنياتك بأناقة مع رسائل مخصصة!',
    pt: 'Envie seus desejos com estilo com mensagens personalizadas!',
    ru: 'Отправляйте свои пожелания со стилем с индивидуальными сообщениями!',
    it: 'Invia i tuoi auguri con stile con messaggi personalizzati!',
    th: 'ส่งความปรารถนาของคุณอย่างมีสไตล์ด้วยข้อความที่กำหนดเอง!',
    vi: 'Gửi lời chúc của bạn phong cách với tin nhắn tùy chỉnh!',
    id: 'Kirim harapan Anda dengan gaya menggunakan pesan khusus!',
    ms: 'Hantar hasrat anda bergaya dengan mesej tersuai!',
    tr: 'Özel mesajlarla dileklerinizi tarz gönderin!',
    fa: 'آرزوهای خود را با استایل و با پیام های سفارشی ارسال کنید!',
    sw: 'Tuma matakwa yako kwa mtindo na ujumbe maalum!',
    nl: 'Stuur je wensen stijlvol met aangepaste berichten!',
    sv: 'Skicka dina önskningar stilfullt med anpassade meddelanden!',
    no: 'Send ønskene dine med stil med egendefinerte meldinger!',
    da: 'Send dine ønsker med stil med brugerdefinerede beskeder!',
    fi: 'Lähetä toiveesi tyylikkäästi mukautetuilla viesteillä!',
    pl: 'Wyślij swoje życzenia stylowo z niestandardowymi wiadomościami!',
    cs: 'Pošlete svá přání stylově s vlastními zprávami!',
    sk: 'Pošlite svoje priania štýlovo s vlastnými správami!',
    hu: 'Küldje el kívánságait stílusosan egyedi üzenetekkel!',
    ro: 'Trimiteți-vă urările cu stil cu mesaje personalizate!',
    bg: 'Изпратете вашите пожелания със стил с персонализирани съобщения!',
    hr: 'Pošaljite svoje želje sa stilom s prilagođenim porukama!',
    sr: 'Пошаљите своје жеље са стилом са прилагођеним порукама!',
    sl: 'Pošljite svoja voščila z slogom s prilagojenimi sporočili!',
    et: 'Saadake oma soovid stiilselt kohandatud sõnumitega!',
    lv: 'Nosūtiet savus vēlējumus stilā ar pielāgotiem ziņojumiem!',
    lt: 'Siųskite savo linkėjimus stilingai su tinkintais pranešimais!',
    mk: 'Испратете ги вашите желби со стил со прилагодени пораки!',
    mt: 'Ibgħat ix-xewqat tiegħek b\'stil b\'messaġġi personalizzati!',
    cy: 'Anfonwch eich dymuniadau mewn arddull gyda negeseuon wedi\'u personoli!',
    ga: 'Seol do mhianta go stíl le teachtaireachtaí saincheaptha!',
    eu: 'Bidali zure desioak estilo pertsonalizatutako mezoekin!',
    ca: 'Envieu els vostres desitjos amb estil amb missatges personalitzats!'
  },
  // Event-specific translations
  'Birthday': {
    en: 'Birthday',
    hi: 'जन्मदिन',
    bn: 'জন্মদিন',
    te: 'పుట్టినరోజు',
    mr: 'वाढदिवस',
    ta: 'பிறந்தநாள்',
    gu: 'જન્મદિવસ',
    kn: 'ಜನ್ಮದಿನ',
    ml: 'പിറന്നാൾ',
    pa: 'ਜਨਮਦਿਨ',
    ur: 'سالگرہ',
    es: 'Cumpleaños',
    fr: 'Anniversaire',
    de: 'Geburtstag',
    zh: '生日',
    ja: '誕生日',
    ko: '생일',
    ar: 'عيد ميلاد',
    pt: 'Aniversário',
    ru: 'День рождения',
    it: 'Compleanno',
    th: 'วันเกิด',
    vi: 'Sinh nhật',
    id: 'Ulang Tahun',
    ms: 'Hari Jadi',
    tr: 'Doğum Günü',
    fa: 'تولد',
    sw: 'Siku ya Kuzaliwa',
    nl: 'Verjaardag',
    sv: 'Födelsedag',
    no: 'Fødselsdag',
    da: 'Fødselsdag',
    fi: 'Syntymäpäivä',
    pl: 'Urodziny',
    cs: 'Narozeniny',
    sk: 'Narodeniny',
    hu: 'Születésnap',
    ro: 'Zi de naștere',
    bg: 'Рожден ден',
    hr: 'Rođendan',
    sr: 'Рођендан',
    sl: 'Rojstni dan',
    et: 'Sünnipäev',
    lv: 'Dzimšanas diena',
    lt: 'Gimtadienis',
    mk: 'Роденден',
    mt: 'Għeluq snin',
    cy: 'Pen-blwydd',
    ga: 'Lá Breithe',
    eu: 'Urtebetetze',
    ca: 'Aniversari'
  },
  'Wishing you a fantastic birthday filled with joy and happiness!': {
    en: 'Wishing you a fantastic birthday filled with joy and happiness!',
    hi: 'आपको खुशियों और आनंद से भरा एक शानदार जन्मदिन की शुभकामनाएँ!',
    bn: 'আপনাকে আনন্দ ও সুখে পূর্ণ একটি দুর্দান্ত জন্মদিনের শুভেচ্ছা!',
    te: 'మీకు ఆనందం మరియు సంతోషంతో నిండిన అద్భుతమైన పుట్టినరోజు శుభాకాంక్షలు!',
    mr: 'तुम्हाला आनंद आणि आनंदाने भरलेला एक विलक्षण वाढदिवसाच्या शुभेच्छा!',
    ta: 'மகிழ்ச்சியும் மகிழ்ச்சியும் நிறைந்த ஒரு அருமையான பிறந்தநாள் வாழ்த்துக்கள்!',
    gu: 'તમને આનંદ અને સુખથી ભરપૂર એક અદ્ભુત જન્મદિવસની શુભેચ્છા!',
    kn: 'ನಿಮಗೆ ಸಂತೋಷ ಮತ್ತು ಸಂತೋಷದಿಂದ ತುಂಬಿದ ಅದ್ಭುತ ಜನ್ಮದಿನದ ಶುಭಾಶಯಗಳು!',
    ml: 'സന്തോഷവും സന്തോഷവും നിറഞ്ഞ ഒരു അതിശയിപ്പിക്കുന്ന പിറന്നാൾ ആശംസകൾ!',
    pa: 'ਤੁਹਾਨੂੰ ਖੁਸ਼ੀ ਅਤੇ ਖੁਸ਼ੀ ਨਾਲ ਭਰਿਆ ਇੱਕ ਸ਼ਾਨਦਾਰ ਜਨਮਦਿਨ ਦੀਆਂ ਸ਼ੁਭਕਾਮਨਾਵਾਂ!',
    ur: 'آپ کو خوشی اور مسرت سے بھرا ایک شاندار سالگرہ مبارک ہو!',
    es: '¡Deseándote un cumpleaños fantástico lleno de alegría y felicidad!',
    fr: 'Je vous souhaite un anniversaire fantastique rempli de joie et de bonheur !',
    de: 'Ich wünsche dir einen fantastischen Geburtstag voller Freude und Glück!',
    zh: '祝你生日快乐，充满欢乐和幸福！',
    ja: '喜びと幸せに満ちた素晴らしい誕生日をお過ごしください！',
    ko: '기쁨과 행복으로 가득한 멋진 생일을 보내시길 바랍니다!',
    ar: 'أتمنى لك عيد ميلاد رائع مليء بالفرح والسعادة!',
    pt: 'Desejando a você um aniversário fantástico cheio de alegria e felicidade!',
    ru: 'Желаю вам фантастического дня рождения, наполненного радостью и счастьем!',
    it: 'Ti auguro un fantastico compleanno pieno di gioia e felicità!',
    th: 'ขอให้คุณมีวันเกิดที่ยอดเยี่ยมเต็มไปด้วยความสุขและความสุข!',
    vi: 'Chúc bạn một sinh nhật tuyệt vời tràn đầy niềm vui và hạnh phúc!',
    id: 'Semoga Anda mendapatkan ulang tahun yang fantastis penuh sukacita dan kebahagiaan!',
    ms: 'Semoga anda mendapat hari jadi yang hebat penuh kegembiraan dan kebahagiaan!',
    tr: 'Size neşe ve mutluluk dolu harika bir doğum günü diliyorum!',
    fa: 'برای شما یک سالگرد تولد فوق العاده پر از شادی و خوشبختی آرزو می کنم!',
    sw: 'Nakutakia siku ya kuzaliwa yenye furaha na furaha!',
    nl: 'Ik wens je een fantastische verjaardag vol vreugde en geluk!',
    sv: 'Önskar dig en fantastisk födelsedag fylld av glädje och lycka!',
    no: 'Ønsker deg en fantastisk bursdag fylt med glede og lykke!',
    da: 'Ønsker dig en fantastisk fødselsdag fyldt med glæde og lykke!',
    fi: 'Toivotan sinulle upean syntymäpäivän täynnä iloa ja onnea!',
    pl: 'Życzę Ci fantastycznych urodzin pełnych radości i szczęścia!',
    cs: 'Přeji ti fantastické narozeniny plné radosti a štěstí!',
    sk: 'Prajem ti fantastické narodeniny plné radosti a šťastia!',
    hu: 'Kívánok neked egy fantasztikus születésnapot, tele örömmel és boldogsággal!',
    ro: 'Îți doresc un zi de naștere fantastică plină de bucurie și fericire!',
    bg: 'Пожелавам ви фантастичен рожден ден, изпълнен с радост и щастие!',
    hr: 'Želim vam fantastičan rođendan ispunjen radošću i srećom!',
    sr: 'Желим вам фантастичан рођендан испуњен радошћу и срећом!',
    sl: 'Želim vam fantastičen rojstni dan, poln veselja in sreče!',
    et: 'Soovin teile fantastilist sünnipäeva, mis on täis rõõmu ja õnne!',
    lv: 'Novēlu jums fantastisku dzimšanas dienu, pilnu prieka un laimes!',
    lt: 'Linkiu jums nuostabų gimtadienį, pilną džiaugsmo ir laimės!',
    mk: 'Ви посакувам фантастичен роденден исполнет со радост и среќа!',
    mt: 'Nawgurak għalik birthday fantastik mimli bi ferħ u happiness!',
    cy: 'Dymuno pen-blwydd gwych i chi sy\'n llawn o lawenydd a hapusrwydd!',
    ga: 'Guím lá breithe iontach ort atá lán le háthas agus sonas!',
    eu: 'Pozik eta zorionez betetako urtebetetze zoragarria opa dizut!',
    ca: 'Us desitjo un aniversari fantàstic ple d\'alegria i felicitat!'
  },
  
};

// Helper type for plural forms
interface PluralForms {
  zero?: string;
  one?: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
}

export const useLanguageTranslation = () => {
  const [currentLanguage, setCurrentLanguage] = useState<string>(() => {
    if (typeof window === 'undefined') return 'en';
    
    try {
      const savedLang = localStorage.getItem('preferredLanguage');
      if (savedLang && languages.some(l => l.code === savedLang)) {
        return savedLang;
      }

      const browserLang = navigator.language.split('-')[0];
      const matchedLang = languages.find(l => l.code === browserLang);
      return matchedLang?.code || 'en';
    } catch (e) {
      console.error('Language detection failed:', e);
      return 'en';
    }
  });

  const getCurrentLanguage = useMemo((): Language => {
    return languages.find(lang => lang.code === currentLanguage) || languages[0];
  }, [currentLanguage]);

  const isRTL = useMemo(() => getCurrentLanguage.direction === 'rtl', [getCurrentLanguage]);

  const applyLanguageSettings = useCallback((langCode: string): void => {
    try {
      const lang = languages.find(l => l.code === langCode) || languages[0];
      
      // Update HTML attributes
      document.documentElement.lang = langCode;
      document.documentElement.dir = lang.direction || 'ltr';
      
      // Update class for RTL styling
      document.documentElement.classList.toggle('rtl', lang.direction === 'rtl');
    } catch (e) {
      console.error('Failed to apply language settings:', e);
    }
  }, []);

  const changeLanguage = useCallback((langCode: string): void => {
    if (!languages.some(l => l.code === langCode)) {
      console.warn(`Language ${langCode} is not supported`);
      return;
    }
    
    try {
      setCurrentLanguage(langCode);
      localStorage.setItem('preferredLanguage', langCode);
      applyLanguageSettings(langCode);
      
      window.dispatchEvent(new CustomEvent('languageChanged', { 
        detail: { language: langCode } 
      }));
    } catch (e) {
      console.error('Failed to change language:', e);
    }
  }, [applyLanguageSettings]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      applyLanguageSettings(currentLanguage);
    }
  }, [currentLanguage, applyLanguageSettings]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'preferredLanguage' && e.newValue) {
        setCurrentLanguage(e.newValue);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getTranslationValue = useCallback((keys: string[]): TranslationValue | undefined => {
    let value: TranslationValue = translations;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        value = value[k];
      } else {
        return undefined;
      }
    }
    
    return value;
  }, []);

  const translate = useCallback((key: string, params?: TranslationParams): string => {
    try {
      const keys = key.split('.');
      const value = getTranslationValue(keys);
      
      // Get translation with fallbacks
      let translation: string | undefined;
      
      if (typeof value === 'object' && value !== null) {
        translation = value[currentLanguage] as string || value['en'] as string;
      } else if (typeof value === 'string') {
        translation = value;
      }
      
      if (!translation) return key;

      // Handle parameter substitution
      if (params) {
        return Object.entries(params).reduce((str, [k, v]) => {
          return str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
        }, translation);
      }
      
      return translation;
    } catch (e) {
      console.error(`Translation failed for key "${key}":`, e);
      return key;
    }
  }, [currentLanguage, getTranslationValue]);

  const pluralize = useCallback((key: string, count: number): string => {
    try {
      const translation = getTranslationValue(key.split('.'));
      
      if (!translation || typeof translation !== 'object') {
        return typeof translation === 'string' ? translation : key;
      }

      const pluralForms = translation as unknown as PluralForms;
      
      switch (currentLanguage) {
        case 'ar': // Arabic
          if (count === 0) return pluralForms.zero || pluralForms.other || key;
          if (count === 1) return pluralForms.one || pluralForms.other || key;
          if (count === 2) return pluralForms.two || pluralForms.other || key;
          if (count > 2 && count < 11) return pluralForms.few || pluralForms.other || key;
          return pluralForms.other || key;
        
        case 'ru': // Russian
        case 'uk': // Ukrainian
          // Add specific rules as needed
          break;
      }
      
      // Default English-style pluralization
      return count === 1 
        ? pluralForms.one || pluralForms.other || key
        : pluralForms.other || key;
    } catch (e) {
      console.error(`Pluralization failed for key "${key}":`, e);
      return key;
    }
  }, [currentLanguage, getTranslationValue]);

  return {
    currentLanguage,
    changeLanguage,
    translate,
    languages,
    getCurrentLanguage,
    isRTL,
    pluralize,
    t: translate,
    setLanguage: changeLanguage,
    getAvailableLanguages: useCallback(() => languages, []),
    isLanguageSupported: useCallback((code: string) => languages.some(l => l.code === code), []),
  };
}; 