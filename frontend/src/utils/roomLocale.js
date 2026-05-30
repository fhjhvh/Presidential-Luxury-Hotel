// ════════════════════════════════════════════════════════════════
//  Room value localization — maps the English values stored in the DB
//  (views, bed types, bathroom types/features, services) to TR/AR.
//  Amenities are keyed by their object key (e.g. smart_tv).
//  Shared by Rooms listing and RoomDetails so localization is consistent.
// ════════════════════════════════════════════════════════════════

const TR = {
  views: {
    'City View': 'Şehir Manzarası', 'Ocean View': 'Deniz Manzarası',
    'Pool View': 'Havuz Manzarası', 'Garden View': 'Bahçe Manzarası',
    'Panoramic City': 'Panoramik Şehir', 'Skyline Panorama': 'Şehir Silüeti Panoraması',
    '360° Panorama': '360° Panorama', '360° Horizon': '360° Ufuk',
    'Panoramic Skyline': 'Panoramik Silüet',
  },
  bedTypes: {
    'King Bed': 'King Yatak', 'Queen Bed': 'Queen Yatak',
    'Single Bed': 'Tek Kişilik Yatak', 'Queen + Bunk': 'Queen + Ranza',
    'Emperor Bed': 'Emperor Yatak', 'Emperor + King': 'Emperor + King',
    'Twin Beds': 'İkiz Yataklar',
  },
  bathroomTypes: {
    'Standard Bath': 'Standart Banyo', 'Luxury Bath': 'Lüks Banyo',
    'Marble Bathroom': 'Mermer Banyo', 'Rain Shower': 'Yağmur Duşu',
    'Steam Shower': 'Buhar Duşu', 'Jacuzzi Bath': 'Jakuzili Banyo',
    'Double Vanity': 'Çift Lavabo', 'En-suite Bathroom': 'Özel Banyo',
  },
  bathroomFeatures: {
    'Shower': 'Duş', 'Bathtub': 'Küvet', 'Hair Dryer': 'Saç Kurutma Makinesi',
    'Magnifying Mirror': 'Büyüteçli Ayna', 'Premium Toiletries': 'Premium Tuvalet Malzemeleri',
    'Heated Floor': 'Isıtmalı Zemin', 'Rain Shower': 'Yağmur Duşu', 'Dual Sink': 'Çift Lavabo',
    'Soaking Tub': 'Banyolu Küvet', 'Bidet': 'Bide', 'Luxury Toiletries': 'Lüks Tuvalet Malzemeleri',
    'Towels': 'Havlu', 'Bathrobes': 'Bornoz', 'Slippers': 'Terlik',
    'Separate Shower': 'Ayrı Duş', 'Steam Room': 'Buhar Odası',
  },
  services: {
    'Daily Housekeeping': 'Günlük Oda Temizliği', '24/7 Room Service': '7/24 Oda Servisi',
    'Room Service': 'Oda Servisi', 'Turndown Service': 'Yataktan Hazırlama Servisi',
    'Laundry Service': 'Çamaşır Servisi', 'Concierge Service': 'Concierge Hizmeti',
    'Airport Transfer': 'Havalimanı Transferi', 'Valet Parking': 'Vale Park',
    'Business Services': 'İş Hizmetleri', 'Wake-up Call': 'Uyandırma Servisi',
    'Newspaper Delivery': 'Gazete Servisi', 'Welcome Drink': 'Karşılama İçeceği',
    'Dedicated Butler Service': 'Kişisel Butler Hizmeti', 'Butler Service': 'Butler Hizmeti',
    'Private Check-in': 'Özel Check-in', 'In-Suite Dining': 'Oda İçi Yemek',
    'Complimentary Breakfast': 'Ücretsiz Kahvaltı', 'Spa Access': 'Spa Girişi',
    'Fitness Center Access': 'Fitness Merkezi Girişi', 'Pool Access': 'Havuz Girişi',
    'Pressing Service': 'Ütüleme Hizmeti', 'Free WiFi': 'Ücretsiz Wi-Fi', 'Free Parking': 'Ücretsiz Otopark',
  },
  amenities: {
    wifi: 'Wi-Fi', tv: 'TV', smart_tv: 'Akıllı TV', air_conditioning: 'Klima',
    minibar: 'Mini Bar', safe: 'Kasa', hairdryer: 'Saç Kurutma Makinesi', iron: 'Ütü',
    desk: 'Çalışma Masası', espresso_machine: 'Espresso Makinesi', nespresso: 'Nespresso',
    bathrobes: 'Bornoz', slippers: 'Terlik', bluetooth_speaker: 'Bluetooth Hoparlör',
    sound_system: 'Ses Sistemi', wine_fridge: 'Şarap Buzdolabı', premium_toiletries: 'Premium Tuvalet Malzemeleri',
    yoga_mat: 'Yoga Matı', smart_home: 'Akıllı Ev', home_theater: 'Ev Sineması', full_bar: 'Tam Bar',
    jacuzzi: 'Jakuzi', butler_pantry: 'Butler Servisi', luxury_linens: 'Lüks Nevresim',
    pillow_menu: 'Yastık Menüsü', video_conferencing: 'Video Konferans', multi_room_audio: 'Çok Odalı Ses',
    wine_cellar: 'Şarap Mahzeni', massage_chair: 'Masaj Koltuğu', butler_service: 'Butler Hizmeti',
    printer: 'Yazıcı', standing_desk: 'Ayaklı Çalışma Masası', smart_home_automation: 'Akıllı Ev Otomasyonu',
    private_cinema: 'Özel Sinema', chef_kitchen: 'Şef Mutfağı', wine_room: 'Şarap Odası',
    helipad_access: 'Helipad Erişimi', limousine_service: 'Limuzin Hizmeti', everything_included: 'Her Şey Dahil',
    personal_staff: 'Kişisel Personel', private_chef: 'Özel Şef', chauffeur: 'Şoför',
    yacht_access: 'Yat Erişimi', helicopter_transfers: 'Helikopter Transferi', concierge_24h: '7/24 Concierge',
    balcony: 'Balkon', private_pool: 'Özel Havuz', separate_living: 'Ayrı Oturma Odası',
    separate_living_area: 'Ayrı Yaşam Alanı', dining_area: 'Yemek Alanı',
  },
  typeDescriptions: {
    STANDARD: 'Modern olanaklara ve şehir manzarasına sahip konforlu standart oda.',
    SINGLE: 'Solo gezginler için kompakt ve şık tek kişilik oda.',
    COUPLE: 'Premium olanaklar ve zarif tasarıma sahip romantik çift kişilik oda.',
    FAMILY: 'Birden fazla yatak ve havuz manzarasıyla geniş aile odası.',
    DELUXE: 'Panoramik manzara ve mermer banyoyla sofistike deluxe oda.',
    JUNIOR_SUITE: 'Ayrı oturma alanı ve premium olanaklar sunan zarif junior süit.',
    EXECUTIVE_SUITE: 'Lüks ve profesyonel işlevselliği bir araya getiren executive süit.',
    FAMILY_SUITE: 'Ailenizin her konforu için geniş ve tam donanımlı aile süiti.',
    PRESIDENTIAL_SUITE: 'Özel hizmetler ve eşsiz konforla başkanlık süiti.',
    ROYAL_SUITE: 'En yüksek standartlarda olağanüstü kraliyet konaklaması.',
  },
};

const AR = {
  views: {
    'City View': 'إطلالة على المدينة', 'Ocean View': 'إطلالة على المحيط',
    'Pool View': 'إطلالة على المسبح', 'Garden View': 'إطلالة على الحديقة',
    'Panoramic City': 'إطلالة بانورامية على المدينة', 'Skyline Panorama': 'بانوراما أفق المدينة',
    '360° Panorama': 'بانوراما 360°', '360° Horizon': 'أفق 360°',
    'Panoramic Skyline': 'أفق بانورامي',
  },
  bedTypes: {
    'King Bed': 'سرير كينج', 'Queen Bed': 'سرير كوين',
    'Single Bed': 'سرير فردي', 'Queen + Bunk': 'كوين + سرير بطابقين',
    'Emperor Bed': 'سرير إمبراطوري', 'Emperor + King': 'إمبراطوري + كينج',
    'Twin Beds': 'سريران منفصلان',
  },
  bathroomTypes: {
    'Standard Bath': 'حمام قياسي', 'Luxury Bath': 'حمام فاخر',
    'Marble Bathroom': 'حمام رخامي', 'Rain Shower': 'دش مطري',
    'Steam Shower': 'دش بخاري', 'Jacuzzi Bath': 'حمام جاكوزي',
    'Double Vanity': 'مغسلتان', 'En-suite Bathroom': 'حمام خاص',
  },
  bathroomFeatures: {
    'Shower': 'دش', 'Bathtub': 'حوض استحمام', 'Hair Dryer': 'مجفف شعر',
    'Magnifying Mirror': 'مرآة مكبّرة', 'Premium Toiletries': 'مستلزمات استحمام فاخرة',
    'Heated Floor': 'أرضية مدفأة', 'Rain Shower': 'دش مطري', 'Dual Sink': 'مغسلتان',
    'Soaking Tub': 'حوض نقع', 'Bidet': 'بيديه', 'Luxury Toiletries': 'مستلزمات استحمام فاخرة',
    'Towels': 'مناشف', 'Bathrobes': 'أرواب حمام', 'Slippers': 'نعال',
    'Separate Shower': 'دش منفصل', 'Steam Room': 'غرفة بخار',
  },
  services: {
    'Daily Housekeeping': 'تنظيف يومي للغرفة', '24/7 Room Service': 'خدمة الغرف على مدار الساعة',
    'Room Service': 'خدمة الغرف', 'Turndown Service': 'خدمة تجهيز السرير',
    'Laundry Service': 'خدمة غسيل الملابس', 'Concierge Service': 'خدمة الكونسيرج',
    'Airport Transfer': 'نقل من وإلى المطار', 'Valet Parking': 'خدمة صف السيارات',
    'Business Services': 'خدمات الأعمال', 'Wake-up Call': 'خدمة الإيقاظ',
    'Newspaper Delivery': 'توصيل الصحف', 'Welcome Drink': 'مشروب ترحيبي',
    'Dedicated Butler Service': 'خدمة بتلر شخصية', 'Butler Service': 'خدمة البتلر',
    'Private Check-in': 'تسجيل وصول خاص', 'In-Suite Dining': 'تناول الطعام في الجناح',
    'Complimentary Breakfast': 'فطور مجاني', 'Spa Access': 'دخول السبا',
    'Fitness Center Access': 'دخول مركز اللياقة', 'Pool Access': 'دخول المسبح',
    'Pressing Service': 'خدمة الكي', 'Free WiFi': 'واي فاي مجاني', 'Free Parking': 'موقف مجاني',
  },
  amenities: {
    wifi: 'واي فاي', tv: 'تلفاز', smart_tv: 'تلفاز ذكي', air_conditioning: 'تكييف',
    minibar: 'ميني بار', safe: 'خزنة', hairdryer: 'مجفف شعر', iron: 'مكواة',
    desk: 'مكتب', espresso_machine: 'ماكينة إسبريسو', nespresso: 'نسبريسو',
    bathrobes: 'أرواب حمام', slippers: 'نعال', bluetooth_speaker: 'مكبر صوت بلوتوث',
    sound_system: 'نظام صوتي', wine_fridge: 'ثلاجة نبيذ', premium_toiletries: 'مستلزمات استحمام فاخرة',
    yoga_mat: 'سجادة يوغا', smart_home: 'منزل ذكي', home_theater: 'مسرح منزلي', full_bar: 'بار كامل',
    jacuzzi: 'جاكوزي', butler_pantry: 'مخزن البتلر', luxury_linens: 'أغطية فاخرة',
    pillow_menu: 'قائمة الوسائد', video_conferencing: 'مؤتمرات فيديو', multi_room_audio: 'صوت متعدد الغرف',
    wine_cellar: 'قبو نبيذ', massage_chair: 'كرسي تدليك', butler_service: 'خدمة البتلر',
    printer: 'طابعة', standing_desk: 'مكتب واقف', smart_home_automation: 'أتمتة المنزل الذكي',
    private_cinema: 'سينما خاصة', chef_kitchen: 'مطبخ الشيف', wine_room: 'غرفة النبيذ',
    helipad_access: 'مهبط طائرات مروحية', limousine_service: 'خدمة ليموزين', everything_included: 'كل شيء مشمول',
    personal_staff: 'طاقم شخصي', private_chef: 'شيف خاص', chauffeur: 'سائق خاص',
    yacht_access: 'دخول اليخت', helicopter_transfers: 'نقل بالمروحية', concierge_24h: 'كونسيرج 24/7',
    balcony: 'شرفة', private_pool: 'مسبح خاص', separate_living: 'غرفة معيشة منفصلة',
    separate_living_area: 'منطقة معيشة منفصلة', dining_area: 'منطقة طعام',
  },
  typeDescriptions: {
    STANDARD: 'غرفة قياسية مريحة بإطلالة على المدينة ووسائل راحة عصرية.',
    SINGLE: 'غرفة فردية أنيقة وعملية للمسافر المنفرد.',
    COUPLE: 'غرفة رومانسية للزوجين بتصميم أنيق ووسائل راحة فاخرة.',
    FAMILY: 'غرفة عائلية واسعة بأسرّة متعددة وإطلالة على المسبح.',
    DELUXE: 'غرفة ديلوكس راقية بإطلالة بانورامية وحمام رخامي.',
    JUNIOR_SUITE: 'جناح جونيور أنيق بمنطقة جلوس منفصلة ووسائل راحة فاخرة.',
    EXECUTIVE_SUITE: 'جناح تنفيذي يجمع بين الفخامة والوظائف المهنية.',
    FAMILY_SUITE: 'جناح عائلي واسع ومجهّز بالكامل لراحة جميع أفراد العائلة.',
    PRESIDENTIAL_SUITE: 'جناح رئاسي بخدمات حصرية وراحة لا مثيل لها.',
    ROYAL_SUITE: 'إقامة ملكية استثنائية بأعلى المعايير.',
  },
};

const ROOM_VALUE_MAPS = { tr: TR, ar: AR };

const asText = (v) => (typeof v === 'string' || typeof v === 'number') ? String(v) : '';
const titleCase = (k) => String(k || '').replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

// Returns a set of translators for the given language. Falls back to the raw
// (English) DB value when no localized mapping exists — never throws.
export function getRoomTranslators(language) {
  const lang = (language || 'en').split('-')[0];
  const m = ROOM_VALUE_MAPS[lang] || null;
  return {
    tView:     (v) => asText(m?.views?.[v] ?? v),
    tBed:      (v) => asText(m?.bedTypes?.[v] ?? v),
    tBathType: (v) => asText(m?.bathroomTypes?.[v] ?? v),
    tBathFeat: (v) => asText(m?.bathroomFeatures?.[v] ?? v),
    tService:  (v) => asText(m?.services?.[v] ?? v),
    tAmenity:  (k) => m?.amenities?.[k] || titleCase(k),
    tDescription: (type, desc) => m?.typeDescriptions?.[type] || asText(desc),
  };
}

export default ROOM_VALUE_MAPS;
