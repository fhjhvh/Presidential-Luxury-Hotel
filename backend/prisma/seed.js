import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ── Image pools by perspective ────────────────────────────────────
const IMG = {
  STD_BED: [
    'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564078516393-cf04bd676897?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=800&auto=format&fit=crop',
  ],
  SINGLE_BED: [
    'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1515592302748-6c5ea1e0e40c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&auto=format&fit=crop',
  ],
  COUPLE_BED: [
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1560185127-6a8c596e5a1d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1540802942855-dd4aeec50e62?w=800&auto=format&fit=crop',
  ],
  FAMILY_BED: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1587985064135-0366536eab42?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1529290130-4ca3753253ae?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523755231516-e43fd2e8dca5?w=800&auto=format&fit=crop',
  ],
  DELUXE_BED: [
    'https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551516594-56cb78394645?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1519974719765-e6559eac2575?w=800&auto=format&fit=crop',
  ],
  BATH_STD: [
    'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564540586988-aa4e53c3d799?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1620626011761-996317702782?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1552242718-c5360894aecd?w=800&auto=format&fit=crop',
  ],
  BATH_LUX: [
    'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&auto=format&fit=crop',
  ],
  VIEW: [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1430285561322-7808604715df?w=800&auto=format&fit=crop',
  ],
  SUITE_LIVING: [
    'https://images.unsplash.com/photo-1602002418082-a4443e081dd1?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1590073844006-33379778ae09?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop',
  ],
  PENTHOUSE: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&auto=format&fit=crop',
  ],
  POOL_TERRACE: [
    'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop',
  ],
};

// pick image cycling through the pool
const pick = (pool, i) => pool[i % pool.length];

async function main() {
  console.log('🌱 Starting full hotel database seeding...');

  const hashedPassword = await bcrypt.hash('password123', 10);

  // ── Staff & Admin accounts ────────────────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hotel.com' },
    update: {},
    create: { email: 'admin@hotel.com', password: hashedPassword, role: 'ADMIN', firstName: 'Admin', lastName: 'User', phone: '+1234567890' },
  });

  const staff = [
    { email: 'reception@hotel.com', role: 'STAFF_RECEPTION', firstName: 'Sarah', lastName: 'Johnson', dept: 'RECEPTION', position: 'Reception Manager', salary: 45000 },
    { email: 'nursing@hotel.com', role: 'STAFF_NURSING', firstName: 'Emily', lastName: 'Chen', dept: 'NURSING', position: 'Head Nurse', salary: 55000 },
    { email: 'maintenance@hotel.com', role: 'STAFF_MAINTENANCE', firstName: 'John', lastName: 'Smith', dept: 'MAINTENANCE', position: 'Maintenance Supervisor', salary: 48000 },
    { email: 'accounting@hotel.com', role: 'STAFF_ACCOUNTING', firstName: 'Michael', lastName: 'Brown', dept: 'ACCOUNTING', position: 'Chief Accountant', salary: 60000 },
  ];

  for (const s of staff) {
    const u = await prisma.user.upsert({
      where: { email: s.email },
      update: {},
      create: { email: s.email, password: hashedPassword, role: s.role, firstName: s.firstName, lastName: s.lastName },
    });
    await prisma.staffProfile.upsert({
      where: { userId: u.id },
      update: {},
      create: { userId: u.id, department: s.dept, position: s.position, salary: s.salary },
    });
  }

  await prisma.user.upsert({
    where: { email: 'guest@example.com' },
    update: {},
    create: { email: 'guest@example.com', password: hashedPassword, role: 'GUEST_RETURNING', firstName: 'Jane', lastName: 'Doe' },
  });

  console.log('✅ Users seeded');

  // ── Floors ────────────────────────────────────────────────────
  const floorsData = [
    { floorNumber: -2, name: 'B2 — Parking & Utilities', order: 0 },
    { floorNumber: -1, name: 'B1 — Parking & Storage', order: 1 },
    { floorNumber: 0, name: 'Ground — Lobby & Restaurant', order: 2 },
    { floorNumber: 1, name: 'Floor 1 — Standard & Single', order: 3 },
    { floorNumber: 2, name: 'Floor 2 — Standard', order: 4 },
    { floorNumber: 3, name: 'Floor 3 — Couple & Family', order: 5 },
    { floorNumber: 4, name: 'Floor 4 — Family & Deluxe', order: 6 },
    { floorNumber: 5, name: 'Floor 5 — Deluxe', order: 7 },
    { floorNumber: 6, name: 'Floor 6 — Deluxe Premium', order: 8 },
    { floorNumber: 7, name: 'Floor 7 — Junior Suites', order: 9 },
    { floorNumber: 8, name: 'Floor 8 — Executive & Family Suites', order: 10 },
    { floorNumber: 9, name: 'Floor 9 — Spa & Wellness', order: 11 },
    { floorNumber: 10, name: 'Floor 10 — Presidential Suites', order: 12 },
    { floorNumber: 11, name: 'Floor 11 — Royal Suites & Helipad', order: 13 },
  ];
  for (const f of floorsData) {
    await prisma.floor.upsert({ where: { floorNumber: f.floorNumber }, update: {}, create: { ...f, isActive: true } });
  }
  console.log('✅ Floors seeded');

  // ── Room definitions ──────────────────────────────────────────
  const rooms = [];

  // ─── STANDARD ROOMS — Floor 1 (101–110) ──────────────────────
  const stdViews = ['City View', 'Garden View', 'Courtyard View', 'Pool View', 'Street View', 'Park View', 'Mountain View', 'Garden View', 'City View', 'Courtyard View'];
  const stdBeds = ['Queen Bed', 'King Bed', 'Queen Bed', 'King Bed', 'Queen Bed', 'King Bed', 'Queen Bed', 'Queen Bed', 'King Bed', 'Queen Bed'];
  const stdDescs = [
    'Comfortable city-view room with plush queen bed, ergonomic workspace, and premium bath amenities. Ideal for the business traveler.',
    'Elegantly appointed standard room featuring a king bed, warm lighting, and complimentary high-speed WiFi throughout.',
    'Classic comfort with garden views, a luxurious rain shower, and all essential amenities for a relaxing stay.',
    'Modern standard room with pool view, king bed, and well-designed workspace perfect for short and extended stays.',
    'Cozy, well-lit room with a queen bed, minibar, and street-facing views of the vibrant cityscape.',
    'Park-view standard room with premium linens, a refined décor, and a spacious ensuite bathroom.',
    'Airy standard room with mountain view, soft furnishings, and complimentary breakfast service.',
    'Garden-facing retreat featuring a plush queen bed, serene views, and a refreshing rain shower.',
    'Urban king room with city skyline views, smart TV, and premium toiletries for a complete comfort experience.',
    'Sophisticated standard room with courtyard view, upscale bedding, and a beautifully tiled bathroom.',
  ];
  for (let i = 0; i < 10; i++) {
    rooms.push({
      roomNumber: `${100 + i + 1}`,
      floor: 1, section: ['A','B','C','D','E'][i % 5],
      type: 'STANDARD', status: 'AVAILABLE',
      capacity: i % 3 === 2 ? 3 : 2,
      size: 28 + (i % 5) * 2,
      basePrice: 150 + i * 12,
      currentPrice: 150 + i * 12,
      description: stdDescs[i],
      images: JSON.stringify([pick(IMG.STD_BED, i), pick(IMG.BATH_STD, i), pick(IMG.VIEW, i), pick(IMG.STD_BED, i + 4)]),
      features: JSON.stringify({
        rating: parseFloat((4.0 + (i % 5) * 0.1).toFixed(1)),
        view: stdViews[i], bed_type: stdBeds[i], beds: 1, bathrooms: 1,
        bathroom: { type: 'Standard Bath', features: ['Rain Shower', 'Premium Toiletries', 'Hairdryer', 'Heated Towels'] },
        services: ['Daily Housekeeping', '24/7 Room Service', 'Free WiFi', 'Concierge'],
        wifi: true, ac: true, tv: true, minibar: i % 2 === 0, safe: true, work_friendly: true,
        category: 'STANDARD',
      }),
      amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: i % 2 === 0, safe: true, hairdryer: true, desk: true }),
    });
  }

  // ─── SINGLE ROOMS — Floor 1 (111–115) ────────────────────────
  const singleDescs = [
    'Compact, stylish single room designed for the solo traveler. Queen bed, smart workstation, and all essential comforts.',
    'Efficient and elegant single accommodation with garden view, plush twin bed, and modern ensuite facilities.',
    'Thoughtfully designed solo room featuring warm tones, a comfortable single bed, and complimentary high-speed WiFi.',
    'Minimalist single room with city view, smart storage, and a sleek bathroom — perfect for business stays.',
    'Cozy single retreat with courtyard view, a premium single bed, and calming neutral décor throughout.',
  ];
  for (let i = 0; i < 5; i++) {
    rooms.push({
      roomNumber: `11${i + 1}`,
      floor: 1, section: ['A','B','C','D','E'][i],
      type: 'SINGLE', status: 'AVAILABLE',
      capacity: 1,
      size: 22 + i * 2,
      basePrice: 120 + i * 15,
      currentPrice: 120 + i * 15,
      description: singleDescs[i],
      images: JSON.stringify([pick(IMG.SINGLE_BED, i), pick(IMG.BATH_STD, i + 1), pick(IMG.VIEW, i + 2), pick(IMG.STD_BED, i + 6)]),
      features: JSON.stringify({
        rating: parseFloat((4.0 + (i % 3) * 0.1).toFixed(1)),
        view: ['City View', 'Garden View', 'Courtyard View', 'Park View', 'Street View'][i],
        bed_type: 'Single Bed', beds: 1, bathrooms: 1,
        bathroom: { type: 'Compact Bath', features: ['Shower', 'Premium Toiletries', 'Hairdryer'] },
        services: ['Daily Housekeeping', 'Room Service', 'Free WiFi'],
        wifi: true, ac: true, tv: true, safe: true, work_friendly: true,
        category: 'SINGLE',
      }),
      amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, safe: true, hairdryer: true, desk: true }),
    });
  }

  // ─── STANDARD ROOMS — Floor 2 (201–210) ──────────────────────
  const std2Descs = [
    'Elevated standard room on Floor 2 with panoramic city views and upgraded furnishings throughout.',
    'Relaxing standard room featuring a king bed, Nespresso machine, and calming neutral palette.',
    'Garden-view comfort room with plush queen bedding, marble-finish bathroom, and enhanced amenities.',
    'Stylish standard room with balcony access, king bed, and floor-to-ceiling city-facing windows.',
    'Contemporary standard room with sunset views, a curated minibar, and premium designer toiletries.',
    'Premium standard room with park views, bespoke furnishings, and complimentary spa access.',
    'Bright standard room featuring harbor views, a king bed, and in-room entertainment system.',
    'Serene retreat with mountain views, queen bed, rainfall shower, and aromatic bath amenities.',
    'Modern city room with smart lighting, king bed, and full marble ensuite on the second floor.',
    'Refined standard accommodation with garden views, queen bed, and a Nespresso station.',
  ];
  for (let i = 0; i < 10; i++) {
    rooms.push({
      roomNumber: `${200 + i + 1}`,
      floor: 2, section: ['A','B','C','D','E'][i % 5],
      type: 'STANDARD', status: 'AVAILABLE',
      capacity: i % 4 === 3 ? 3 : 2,
      size: 30 + (i % 5) * 2,
      basePrice: 170 + i * 11,
      currentPrice: 170 + i * 11,
      description: std2Descs[i],
      images: JSON.stringify([pick(IMG.STD_BED, i + 2), pick(IMG.BATH_STD, i + 2), pick(IMG.VIEW, i + 1), pick(IMG.STD_BED, i + 7)]),
      features: JSON.stringify({
        rating: parseFloat((4.1 + (i % 5) * 0.1).toFixed(1)),
        view: ['Panoramic City', 'Garden View', 'Garden View', 'City Balcony', 'Sunset View', 'Park View', 'Harbor View', 'Mountain View', 'City Skyline', 'Garden View'][i],
        bed_type: i % 2 === 0 ? 'King Bed' : 'Queen Bed', beds: 1, bathrooms: 1,
        bathroom: { type: i % 2 === 0 ? 'Marble Bath' : 'Standard Bath', features: ['Rain Shower', 'Soaking Tub', 'Premium Toiletries', 'Bathrobes'] },
        services: ['Daily Housekeeping', '24/7 Room Service', 'Free WiFi', 'Concierge', 'Express Laundry'],
        wifi: true, ac: true, tv: true, minibar: true, safe: true, nespresso: true,
        balcony: i % 4 === 3, work_friendly: true, city_view: i % 2 === 0,
        category: 'STANDARD',
      }),
      amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, hairdryer: true, desk: true, nespresso: true }),
    });
  }

  // ─── COUPLE / ROMANTIC ROOMS — Floor 3 (301–305) ─────────────
  const coupleDescs = [
    'Intimate romantic suite with rose-petal turndown service, champagne on arrival, king bed, and jacuzzi for two.',
    'Enchanting couple room with ocean views, king bed, candlelit jacuzzi, and personalized butler touch-down service.',
    'Romantic haven with private balcony, sunset panorama, plush king bed, and in-room champagne service.',
    'Sensual retreat with city views, king bed, deep-soak bathtub, rose petal arrangements, and gourmet minibar.',
    'Luxurious couple room with panoramic rooftop views, silk bedding, spa bath, and a private terrace for two.',
  ];
  const coupleViews = ['Ocean View', 'Ocean Panorama', 'Sunset View', 'City View', 'Rooftop Panorama'];
  for (let i = 0; i < 5; i++) {
    const price = 320 + i * 30;
    rooms.push({
      roomNumber: `30${i + 1}`,
      floor: 3, section: ['A','B','C','D','E'][i],
      type: 'COUPLE', status: 'AVAILABLE',
      capacity: 2,
      size: 42 + i * 4,
      basePrice: price, currentPrice: price,
      description: coupleDescs[i],
      images: JSON.stringify([pick(IMG.COUPLE_BED, i), pick(IMG.BATH_LUX, i), pick(IMG.VIEW, i + 2), pick(IMG.COUPLE_BED, i + 2), pick(IMG.POOL_TERRACE, i)]),
      features: JSON.stringify({
        rating: parseFloat((4.5 + (i % 3) * 0.1).toFixed(1)),
        view: coupleViews[i], bed_type: 'King Bed', beds: 1, bathrooms: 1,
        bathroom: { type: 'Romantic Spa Bath', features: ['Jacuzzi Tub', 'Rain Shower', 'His & Hers Robes', 'Champagne Bar', 'Rose Petal Service'] },
        services: ['Champagne on Arrival', 'Rose Petal Turndown', 'Couples Spa Access', 'Private Butler', 'In-Room Dining'],
        wifi: true, ac: true, tv: true, minibar: true, safe: true, jacuzzi: true,
        balcony: i % 2 === 0, rose_setup: true, champagne: true, romantic_lighting: true,
        category: 'COUPLE',
      }),
      amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, jacuzzi: true, balcony: i % 2 === 0, rose_service: true }),
    });
  }

  // ─── FAMILY ROOMS — Floor 3 (306–308) ────────────────────────
  const familyDescs = [
    'Spacious family room on Floor 3 with two queen beds, a cozy lounge corner, and a family-friendly bathroom.',
    'Warm family accommodation featuring a king bed plus bunk beds, dining nook, and a full family bathroom.',
    'Generous family room with interconnecting layout, multiple beds, children\'s amenities, and pool view balcony.',
    'Family-friendly suite with dual queen beds, separate living zone, in-room games, and enhanced child amenities.',
    'Bright family room with triple beds, large ensuite, dedicated children\'s corner, and panoramic garden view.',
    'Interconnecting family room offering two double beds, dining space, kids\' bath amenities, and city view.',
    'Expansive family accommodation with bunk beds, lounging area, full kitchenette, and rooftop garden access.',
    'Premium family room with master king bed, twin children\'s beds, private dining area, and park view.',
  ];
  const familyViews = ['Pool View', 'Garden View', 'City View', 'Park View', 'Garden Panorama', 'City & Park', 'Rooftop Garden', 'Park Panorama'];
  for (let i = 0; i < 3; i++) {
    const price = 380 + i * 40;
    rooms.push({
      roomNumber: `30${i + 6}`,
      floor: 3, section: ['C','D','E'][i],
      type: 'FAMILY', status: 'AVAILABLE',
      capacity: 4 + (i % 2),
      size: 62 + i * 8,
      basePrice: price, currentPrice: price,
      description: familyDescs[i],
      images: JSON.stringify([pick(IMG.FAMILY_BED, i), pick(IMG.BATH_STD, i + 2), pick(IMG.VIEW, i + 3), pick(IMG.FAMILY_BED, i + 3), pick(IMG.STD_BED, i + 8)]),
      features: JSON.stringify({
        rating: parseFloat((4.2 + (i % 3) * 0.1).toFixed(1)),
        view: familyViews[i], bed_type: 'Queen + Bunk Beds', beds: 3, bathrooms: 1,
        bathroom: { type: 'Family Bath', features: ['Bathtub', 'Shower', 'Family Toiletries', 'Kids Amenities'] },
        services: ['Daily Housekeeping', 'Kids Club Access', 'Family Dining', 'Babysitting Available', 'Board Games'],
        wifi: true, ac: true, tv: true, minibar: true, safe: true, crib_available: true,
        separate_living: i % 2 === 0, dining_area: true, kids_amenities: true,
        category: 'FAMILY',
      }),
      amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, crib: true, dining_area: true }),
    });
  }

  // ─── FAMILY ROOMS — Floor 4 (401–405) ────────────────────────
  for (let i = 0; i < 5; i++) {
    const price = 420 + i * 28;
    rooms.push({
      roomNumber: `40${i + 1}`,
      floor: 4, section: ['A','B','C','D','E'][i],
      type: 'FAMILY', status: 'AVAILABLE',
      capacity: 5 + (i % 2),
      size: 70 + i * 6,
      basePrice: price, currentPrice: price,
      description: familyDescs[i + 3],
      images: JSON.stringify([pick(IMG.FAMILY_BED, i + 2), pick(IMG.BATH_LUX, i + 1), pick(IMG.VIEW, i), pick(IMG.FAMILY_BED, i + 5), pick(IMG.POOL_TERRACE, i + 1)]),
      features: JSON.stringify({
        rating: parseFloat((4.3 + (i % 3) * 0.1).toFixed(1)),
        view: familyViews[i + 3], bed_type: 'King + Twin Beds', beds: 3, bathrooms: 2,
        bathroom: { type: 'Family Marble Bath', features: ['Soaking Tub', 'Rain Shower', 'Kids Bath', 'Heated Floor'] },
        services: ['Daily Housekeeping', 'In-Room Dining', 'Kids Pool Access', 'Family Butler', 'Babysitting'],
        wifi: true, ac: true, tv: true, minibar: true, safe: true, separate_living: true,
        dining_area: true, kids_amenities: true, pool_access: true,
        category: 'FAMILY',
      }),
      amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, dining_area: true, kids_pool: true }),
    });
  }

  // ─── DELUXE ROOMS — Floor 4 (406–412) ────────────────────────
  const deluxeDescs = [
    'Sophisticated deluxe room with panoramic city views, king bed, marble bathroom with soaking tub, and Nespresso.',
    'Expansive deluxe retreat featuring ocean views, king bed, private balcony, and spa-inspired marble bathroom.',
    'Contemporary deluxe room with floor-to-ceiling windows, designer furnishings, jacuzzi tub, and sunset panorama.',
    'Refined deluxe accommodation with mountain views, king bed, walk-in closet, and premium in-room dining service.',
    'Opulent deluxe room with harbor views, bespoke Italian furnishings, soaking tub, and personalized concierge.',
    'Elegant deluxe retreat on upper floor with city skyline views, king bed, and a luxurious spa bathroom.',
    'Serene deluxe room with garden panorama, king bed, rain shower, and complimentary premium minibar.',
    'Stylish deluxe accommodation with park views, soft luxury linens, marble bathroom, and private terrace.',
    'Grand deluxe room featuring 180-degree ocean views, premium furnishings, jacuzzi, and butler service.',
    'Distinguished deluxe retreat with rooftop terrace access, king bed, and a spectacular panoramic view.',
    'Modern deluxe haven with city view, king bed, designer artwork, soaking tub, and a curated wine selection.',
    'Prestigious deluxe room with skyline views, king bed, en-suite marble bathroom, and 24/7 concierge.',
  ];
  const deluxeViews = ['Panoramic City', 'Ocean View', 'Sunset Panorama', 'Mountain View', 'Harbor View', 'City Skyline', 'Garden Panorama', 'Park View', 'Ocean Front', 'Rooftop Terrace', 'City View', 'Skyline View'];
  for (let i = 0; i < 7; i++) {
    const price = 350 + i * 32;
    rooms.push({
      roomNumber: `${400 + i + 6}`,
      floor: 4, section: ['A','B','C','D','E','A','B'][i],
      type: 'DELUXE', status: 'AVAILABLE',
      capacity: i % 3 === 0 ? 4 : 2,
      size: 48 + i * 4,
      basePrice: price, currentPrice: price,
      description: deluxeDescs[i],
      images: JSON.stringify([pick(IMG.DELUXE_BED, i), pick(IMG.BATH_LUX, i), pick(IMG.VIEW, i + 1), pick(IMG.DELUXE_BED, i + 3), pick(IMG.POOL_TERRACE, i + 2)]),
      features: JSON.stringify({
        rating: parseFloat((4.4 + (i % 4) * 0.1).toFixed(1)),
        view: deluxeViews[i], bed_type: 'King Bed', beds: 1, bathrooms: 1,
        bathroom: { type: 'Marble Spa Bath', features: ['Soaking Tub', 'Rain Shower', 'Dual Vanity', 'Heated Floor', 'Premium Robes'] },
        services: ['24/7 Room Service', 'Turndown Service', 'Express Laundry', 'Spa Access', 'Personal Concierge', 'Airport Transfer'],
        wifi: true, ac: true, tv: true, minibar: true, safe: true, jacuzzi: i % 2 === 0,
        balcony: i % 3 === 0, panoramic_view: true, nespresso: true,
        category: 'DELUXE',
      }),
      amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, jacuzzi: i % 2 === 0, nespresso: true }),
    });
  }

  // ─── DELUXE ROOMS — Floor 5 (501–505) ────────────────────────
  for (let i = 0; i < 5; i++) {
    const price = 480 + i * 20;
    rooms.push({
      roomNumber: `50${i + 1}`,
      floor: 5, section: ['A','B','C','D','E'][i],
      type: 'DELUXE', status: 'AVAILABLE',
      capacity: 2,
      size: 55 + i * 4,
      basePrice: price, currentPrice: price,
      description: deluxeDescs[i + 7],
      images: JSON.stringify([pick(IMG.DELUXE_BED, i + 4), pick(IMG.BATH_LUX, i + 2), pick(IMG.VIEW, i + 3), pick(IMG.SUITE_LIVING, i), pick(IMG.VIEW, i + 5)]),
      features: JSON.stringify({
        rating: parseFloat((4.5 + (i % 3) * 0.1).toFixed(1)),
        view: deluxeViews[i + 7], bed_type: 'King Bed', beds: 1, bathrooms: 1,
        bathroom: { type: 'Premium Marble Bath', features: ['Deep Soak Tub', 'Multi-Jet Shower', 'Dual Vanity', 'Chromotherapy', 'Designer Amenities'] },
        services: ['24/7 Butler', 'Turndown Service', 'Wine on Arrival', 'Personal Concierge', 'Spa Credits'],
        wifi: true, ac: true, tv: true, minibar: true, safe: true, jacuzzi: true,
        balcony: true, floor_to_ceiling_windows: true, butler_available: true,
        category: 'DELUXE',
      }),
      amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, jacuzzi: true, balcony: true }),
    });
  }

  // ─── JUNIOR SUITES — Floor 7 (701–702) ───────────────────────
  rooms.push({
    roomNumber: '701',
    floor: 7, section: 'A',
    type: 'JUNIOR_SUITE', status: 'AVAILABLE',
    capacity: 4, size: 90,
    basePrice: 750, currentPrice: 750,
    description: 'Elegant Junior Suite featuring a separate living room, panoramic city views, a marble spa bathroom with jacuzzi, and dedicated butler service. A seamless blend of comfort and sophistication.',
    images: JSON.stringify([pick(IMG.SUITE_LIVING, 0), pick(IMG.DELUXE_BED, 0), pick(IMG.BATH_LUX, 0), pick(IMG.VIEW, 0), pick(IMG.POOL_TERRACE, 0)]),
    features: JSON.stringify({
      rating: 4.6,
      view: 'Panoramic City', bed_type: 'King Bed', beds: 1, bathrooms: 2,
      bathroom: { type: 'Marble Spa', features: ['Jacuzzi', 'Rain Shower', 'Double Vanity', 'Heated Floor', 'Premium Robes'] },
      services: ['Butler Service', 'Club Lounge Access', 'Private Check-in', 'Limousine Service', 'Spa Credits'],
      wifi: true, ac: true, tv: true, minibar: true, safe: true, jacuzzi: true,
      separate_living: true, butler_service: true, private_checkin: true, club_lounge: true,
      category: 'JUNIOR_SUITE',
    }),
    amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, jacuzzi: true, butler: true, lounge_access: true }),
  });

  rooms.push({
    roomNumber: '702',
    floor: 7, section: 'B',
    type: 'JUNIOR_SUITE', status: 'AVAILABLE',
    capacity: 4, size: 95,
    basePrice: 850, currentPrice: 850,
    description: 'Refined Junior Suite with ocean-facing panorama, private terrace, king bed, spa bathroom with soaking tub, and personalised butler service. Perfect for a premium luxury stay.',
    images: JSON.stringify([pick(IMG.SUITE_LIVING, 1), pick(IMG.COUPLE_BED, 3), pick(IMG.BATH_LUX, 1), pick(IMG.VIEW, 2), pick(IMG.POOL_TERRACE, 1)]),
    features: JSON.stringify({
      rating: 4.7,
      view: 'Ocean Panorama', bed_type: 'King Bed', beds: 1, bathrooms: 2,
      bathroom: { type: 'Luxury Spa Bath', features: ['Soaking Tub', 'Steam Shower', 'Chromotherapy', 'Private Sauna', 'Designer Amenities'] },
      services: ['Butler Service', 'Yacht Access', 'Club Lounge', 'Personal Shopping', 'Spa Credits'],
      wifi: true, ac: true, tv: true, minibar: true, safe: true, jacuzzi: true,
      balcony: true, separate_living: true, butler_service: true, sauna: true,
      category: 'JUNIOR_SUITE',
    }),
    amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, jacuzzi: true, sauna: true, butler: true }),
  });

  // ─── EXECUTIVE SUITES — Floor 8 (801–802) ────────────────────
  rooms.push({
    roomNumber: '801',
    floor: 8, section: 'A',
    type: 'EXECUTIVE_SUITE', status: 'AVAILABLE',
    capacity: 4, size: 120,
    basePrice: 950, currentPrice: 950,
    description: 'Distinguished Executive Suite with a private home office, conference facilities, panoramic skyline views, and bespoke butler service. The definitive choice for the luxury business traveler.',
    images: JSON.stringify([pick(IMG.SUITE_LIVING, 2), pick(IMG.DELUXE_BED, 2), pick(IMG.BATH_LUX, 2), pick(IMG.VIEW, 4), pick(IMG.POOL_TERRACE, 2)]),
    features: JSON.stringify({
      rating: 4.7,
      view: 'Skyline Panorama', bed_type: 'King Bed', beds: 1, bathrooms: 2,
      bathroom: { type: 'Executive Spa', features: ['Whirlpool Tub', 'Multi-Jet Shower', 'Steam Room', 'His & Hers Vanities', 'Chromotherapy'] },
      services: ['24/7 Butler', 'Private Check-in', 'Limousine', 'Secretarial Support', 'Meeting Room'],
      wifi: true, ac: true, tv: true, minibar: true, safe: true, work_friendly: true,
      private_office: true, meeting_room: true, video_conferencing: true, city_view: true,
      butler_service: true, club_lounge: true, separate_living: true,
      category: 'EXECUTIVE_SUITE',
    }),
    amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, jacuzzi: true, office: true, butler: true }),
  });

  rooms.push({
    roomNumber: '802',
    floor: 8, section: 'B',
    type: 'EXECUTIVE_SUITE', status: 'AVAILABLE',
    capacity: 5, size: 135,
    basePrice: 1100, currentPrice: 1100,
    description: 'Prestigious Executive Suite with sweeping ocean views, a private study with video conferencing, spa bathroom, and exclusive club lounge access. Designed for the most discerning business guests.',
    images: JSON.stringify([pick(IMG.SUITE_LIVING, 3), pick(IMG.DELUXE_BED, 5), pick(IMG.BATH_LUX, 3), pick(IMG.VIEW, 5), pick(IMG.POOL_TERRACE, 3)]),
    features: JSON.stringify({
      rating: 4.8,
      view: 'Ocean & City', bed_type: 'King Bed', beds: 1, bathrooms: 2,
      bathroom: { type: 'Master Spa Suite', features: ['Infinity Tub', 'Rain Forest Shower', 'Steam Room', 'Dressing Area', 'Smart Controls'] },
      services: ['24/7 Butler', 'Helicopter Transfer', 'Personal Chef', 'Yacht Charter', 'Spa Credits'],
      wifi: true, ac: true, tv: true, minibar: true, safe: true, work_friendly: true,
      private_office: true, butler_service: true, helicopter_available: true, floor_to_ceiling_windows: true,
      separate_living: true, dining_area: true, category: 'EXECUTIVE_SUITE',
    }),
    amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, jacuzzi: true, butler: true, helicopter: true }),
  });

  // ─── FAMILY SUITES — Floor 8 (803–804) ───────────────────────
  rooms.push({
    roomNumber: '803',
    floor: 8, section: 'C',
    type: 'FAMILY_SUITE', status: 'AVAILABLE',
    capacity: 6, size: 145,
    basePrice: 1000, currentPrice: 1000,
    description: 'Magnificent Family Suite with two master bedrooms, a grand living and dining area, kids\' entertainment zone, and a fully-staffed butler service. The ultimate family luxury retreat.',
    images: JSON.stringify([pick(IMG.FAMILY_BED, 7), pick(IMG.SUITE_LIVING, 4), pick(IMG.BATH_LUX, 4), pick(IMG.VIEW, 3), pick(IMG.POOL_TERRACE, 1)]),
    features: JSON.stringify({
      rating: 4.7,
      view: 'Park Panorama', bed_type: 'King + Twin Beds', beds: 4, bathrooms: 3,
      bathroom: { type: 'Family Spa Suite', features: ['Soaking Tub', 'Rain Shower', 'Kids Bathtub', 'Double Vanity', 'Heated Floor'] },
      services: ['Family Butler', 'Kids Club', 'In-Suite Dining', 'Babysitting', 'Games Room Access', 'Private Pool'],
      wifi: true, ac: true, tv: true, minibar: true, safe: true, separate_living: true,
      dining_area: true, kids_amenities: true, butler_service: true, pool_access: true,
      category: 'FAMILY_SUITE',
    }),
    amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, butler: true, kids_pool: true, games_room: true }),
  });

  rooms.push({
    roomNumber: '804',
    floor: 8, section: 'D',
    type: 'FAMILY_SUITE', status: 'AVAILABLE',
    capacity: 8, size: 160,
    basePrice: 1200, currentPrice: 1200,
    description: 'Sprawling Family Suite spanning the corner of Floor 8 — three bedrooms, a grand entertaining lounge, private dining room, kids\' recreation room, and panoramic views. An entire home above the clouds.',
    images: JSON.stringify([pick(IMG.FAMILY_BED, 6), pick(IMG.SUITE_LIVING, 5), pick(IMG.BATH_LUX, 4), pick(IMG.VIEW, 4), pick(IMG.POOL_TERRACE, 2)]),
    features: JSON.stringify({
      rating: 4.8,
      view: 'City & Ocean Panorama', bed_type: 'King + Double + Twin', beds: 5, bathrooms: 3,
      bathroom: { type: 'Grand Family Spa', features: ['Private Pool', 'Kids Bath', 'Adult Jacuzzi', 'Steam Room', 'Hammam'] },
      services: ['24/7 Family Butler', 'Private Chef', 'Kids Club', 'Nanny Service', 'Private Pool', 'Cinema Room'],
      wifi: true, ac: true, tv: true, minibar: true, safe: true, separate_living: true,
      dining_area: true, kids_amenities: true, butler_service: true, private_pool: true, cinema: true,
      category: 'FAMILY_SUITE',
    }),
    amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, butler: true, private_pool: true, cinema: true }),
  });

  // ─── PRESIDENTIAL SUITES — Floor 10 (1001–1002) ──────────────
  rooms.push({
    roomNumber: '1001',
    floor: 10, section: 'A',
    type: 'PRESIDENTIAL_SUITE', status: 'AVAILABLE',
    capacity: 6, size: 250,
    basePrice: 2500, currentPrice: 2500,
    description: 'The Presidential Suite — an entire floor of uncompromising luxury. Private elevator, panoramic rooftop infinity pool, bespoke interior by Champalimaud, personal chef, cinema room, and 360° city views. A private sky residence.',
    images: JSON.stringify([pick(IMG.PENTHOUSE, 0), pick(IMG.SUITE_LIVING, 0), pick(IMG.BATH_LUX, 4), pick(IMG.VIEW, 0), pick(IMG.POOL_TERRACE, 0)]),
    features: JSON.stringify({
      rating: 4.9,
      view: '360° City Panorama', bed_type: 'Emperor Bed', beds: 2, bathrooms: 3,
      bathroom: { type: 'Presidential Spa', features: ['Private Spa Pool', 'Hammam', 'Vitality Pool', 'Treatment Room', 'Personal Attendant'] },
      services: ['24/7 Butler', 'Private Chef', 'Helicopter Transfer', 'Yacht Charter', 'Personal Trainer', 'In-room Spa', 'Chauffeur'],
      wifi: true, ac: true, tv: true, minibar: true, safe: true, private_pool: true,
      private_elevator: true, butler_service: true, private_chef: true, cinema: true,
      rooftop_garden: true, helipad_access: true, floor_to_ceiling_windows: true,
      category: 'PRESIDENTIAL_SUITE',
    }),
    amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, private_pool: true, butler: true, helicopter: true, cinema: true }),
  });

  rooms.push({
    roomNumber: '1002',
    floor: 10, section: 'B',
    type: 'PRESIDENTIAL_SUITE', status: 'AVAILABLE',
    capacity: 6, size: 280,
    basePrice: 3500, currentPrice: 3500,
    description: 'Our most coveted Presidential Suite — museum-quality art, bespoke Italian furnishings, a rooftop terrace with private pool, wine cellar for 500 bottles, personal stylist, and unmatched 360° panoramic views.',
    images: JSON.stringify([pick(IMG.PENTHOUSE, 1), pick(IMG.SUITE_LIVING, 2), pick(IMG.BATH_LUX, 4), pick(IMG.VIEW, 5), pick(IMG.POOL_TERRACE, 3)]),
    features: JSON.stringify({
      rating: 5.0,
      view: 'Rooftop Terrace View', bed_type: 'Emperor Bed', beds: 3, bathrooms: 4,
      bathroom: { type: 'Ultimate Wellness', features: ['Infinity Plunge Pool', 'Cryotherapy', 'Float Tank', 'Massage Suite', '24/7 Spa Butler'] },
      services: ['24/7 Butler', 'Private Chef', 'Helicopter Transfer', 'Personal Stylist', 'Wine Sommelier', 'Personal Trainer', 'Yacht'],
      wifi: true, ac: true, tv: true, minibar: true, safe: true, private_pool: true,
      private_elevator: true, butler_service: true, private_chef: true, wine_cellar: true,
      rooftop_terrace: true, helipad_access: true, grand_piano: true,
      category: 'PRESIDENTIAL_SUITE',
    }),
    amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, private_pool: true, butler: true, helicopter: true, wine_cellar: true }),
  });

  // ─── ROYAL SUITES — Floor 11 (1101–1102) ─────────────────────
  rooms.push({
    roomNumber: '1101',
    floor: 11, section: 'A',
    type: 'ROYAL_SUITE', status: 'AVAILABLE',
    capacity: 8, size: 380,
    basePrice: 5000, currentPrice: 5000,
    description: 'The Royal Suite — a sovereign sky palace spanning the entire 11th floor. Helipad access, private infinity pool, cinema, library, grand piano, chef\'s kitchen, butler staff of three, and unrivalled 360° panoramic views across the entire horizon.',
    images: JSON.stringify([pick(IMG.PENTHOUSE, 2), pick(IMG.SUITE_LIVING, 4), pick(IMG.BATH_LUX, 3), pick(IMG.VIEW, 0), pick(IMG.POOL_TERRACE, 3)]),
    features: JSON.stringify({
      rating: 5.0,
      view: '360° Horizon', bed_type: 'Emperor + King Beds', beds: 4, bathrooms: 5,
      bathroom: { type: 'Royal Wellness Suite', features: ['Indoor Pool', 'Turkish Bath', 'Snow Room', 'Salt Room', 'Personal Therapist'] },
      services: ['3 Dedicated Butlers', 'Executive Chef', 'Helicopter Transfer', 'Yacht Charter', 'Private Security', 'Personal Sommelier'],
      wifi: true, ac: true, tv: true, minibar: true, safe: true, private_pool: true,
      private_elevator: true, butler_service: true, private_chef: true, cinema: true,
      grand_piano: true, library: true, wine_cellar: true, helipad_access: true,
      rooftop_garden: true, infinity_pool: true,
      category: 'ROYAL_SUITE',
    }),
    amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, private_pool: true, butler: true, helicopter: true, cinema: true, library: true }),
  });

  rooms.push({
    roomNumber: '1102',
    floor: 11, section: 'B',
    type: 'ROYAL_SUITE', status: 'AVAILABLE',
    capacity: 8, size: 420,
    basePrice: 6000, currentPrice: 6000,
    description: 'The Crown Jewel of Presidential Luxury Hotel. Our flagship Royal Suite offers an unmatched 420m² of grandeur: private rooftop garden, heated infinity pool, helipad, master wine cellar, three butler staff, private cinema, and impeccable personalised service.',
    images: JSON.stringify([pick(IMG.PENTHOUSE, 3), pick(IMG.PENTHOUSE, 4), pick(IMG.BATH_LUX, 4), pick(IMG.VIEW, 2), pick(IMG.POOL_TERRACE, 0)]),
    features: JSON.stringify({
      rating: 5.0,
      view: 'Full 360° Panorama + Rooftop', bed_type: 'Emperor + King + Twin', beds: 5, bathrooms: 6,
      bathroom: { type: 'Crown Jewel Spa', features: ['Heated Indoor Pool', 'Hammam', 'Cryotherapy', 'Float Pod', 'Personal Therapist', '24h Spa Butler'] },
      services: ['4 Dedicated Butlers', 'Private Chef', 'Helicopter Transfer', 'Mega-Yacht Access', 'Personal Security', 'Event Planning'],
      wifi: true, ac: true, tv: true, minibar: true, safe: true, private_pool: true,
      private_elevator: true, butler_service: true, private_chef: true, cinema: true,
      grand_piano: true, library: true, wine_cellar: true, helipad_access: true,
      rooftop_garden: true, infinity_pool: true, private_gym: true,
      category: 'ROYAL_SUITE',
    }),
    amenities: JSON.stringify({ wifi: true, tv: true, air_conditioning: true, minibar: true, safe: true, private_pool: true, butler: true, helicopter: true, cinema: true, gym: true }),
  });

  // ── Upsert all rooms ──────────────────────────────────────────
  let created = 0, updated = 0;
  for (const room of rooms) {
    const existing = await prisma.room.findUnique({ where: { roomNumber: room.roomNumber } });
    if (existing) {
      await prisma.room.update({ where: { roomNumber: room.roomNumber }, data: room });
      updated++;
    } else {
      await prisma.room.create({ data: room });
      created++;
    }
  }

  console.log(`✅ Rooms: ${created} created, ${updated} updated (${rooms.length} total)`);
  console.log('   Distribution:');
  console.log('   • Standard (20): Floors 1–2 (101–115, 201–210)');
  console.log('   • Single   (5):  Floor 1   (111–115)');
  console.log('   • Couple   (5):  Floor 3   (301–305)');
  console.log('   • Family   (8):  Floors 3–4 (306–308, 401–405)');
  console.log('   • Deluxe   (12): Floors 4–5 (406–412, 501–505)');
  console.log('   • Junior Suite   (2): Floor 7  (701–702)');
  console.log('   • Executive Suite(2): Floor 8  (801–802)');
  console.log('   • Family Suite   (2): Floor 8  (803–804)');
  console.log('   • Presidential   (2): Floor 10 (1001–1002)');
  console.log('   • Royal Suite    (2): Floor 11 (1101–1102)');
  console.log(`   TOTAL: ${rooms.length} rooms`);

  // ── Store items (preserve existing) ──────────────────────────
  const storeExists = await prisma.storeItem.count();
  if (storeExists === 0) {
    await prisma.storeItem.createMany({
      data: [
        { name: 'Premium Cashews', nameAr: 'كاجو فاخر', category: 'snacks', price: 8.50, quantity: 50, image: 'https://images.unsplash.com/photo-1543352632-5a4b24e4d2a6?w=300', isAvailable: true },
        { name: 'Artisan Chocolate Bar', nameAr: 'شوكولاتة حرفية', category: 'candy', price: 6.00, quantity: 80, image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=300', isAvailable: true },
        { name: 'Sparkling Water 500ml', nameAr: 'مياه فوارة', category: 'drinks', price: 4.50, quantity: 120, image: 'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=300', isAvailable: true },
        { name: 'Truffle Crisps', nameAr: 'رقائق الكمأة', category: 'chips', price: 7.00, quantity: 60, image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=300', isAvailable: true },
        { name: 'Earl Grey Tea Set', nameAr: 'طقم شاي إيرل غري', category: 'drinks', price: 9.00, quantity: 40, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300', isAvailable: true },
        { name: 'Belgian Butter Cookies', nameAr: 'بسكويت بلجيكي', category: 'biscuits', price: 5.50, quantity: 70, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300', isAvailable: true },
      ],
    });
    console.log('✅ Store items seeded');
  }

  // ── Demo Guest Users ──────────────────────────────────────────
  console.log('\n📊 Seeding demo data...');

  const guestData = [
    { firstName: 'James',     lastName: 'Harrison',   email: 'james.harrison@plhms-demo.com',   phone: '+1-212-555-0142',  idNumber: 'US-DM-001', role: 'GUEST_RETURNING', stays: 5, spent: 4800 },
    { firstName: 'Sophia',    lastName: 'Laurent',    email: 'sophia.laurent@plhms-demo.com',    phone: '+33-1-5555-0199',  idNumber: 'FR-DM-002', role: 'GUEST_RETURNING', stays: 3, spent: 2900 },
    { firstName: 'Mohammed',  lastName: 'Al-Rashidi', email: 'mohammed.rashidi@plhms-demo.com',  phone: '+971-50-555-0103', idNumber: 'AE-DM-003', role: 'GUEST_NEW',       stays: 1, spent: 1200 },
    { firstName: 'Emma',      lastName: 'Thornton',   email: 'emma.thornton@plhms-demo.com',     phone: '+44-20-5555-0104', idNumber: 'GB-DM-004', role: 'GUEST_RETURNING', stays: 7, spent: 8200 },
    { firstName: 'Carlos',    lastName: 'Vega',       email: 'carlos.vega@plhms-demo.com',       phone: '+34-91-555-0105',  idNumber: 'ES-DM-005', role: 'GUEST_NEW',       stays: 1, spent: 750  },
    { firstName: 'Yuki',      lastName: 'Nakamura',   email: 'yuki.nakamura@plhms-demo.com',     phone: '+81-3-5555-0106',  idNumber: 'JP-DM-006', role: 'GUEST_RETURNING', stays: 4, spent: 5400 },
    { firstName: 'Fatima',    lastName: 'Al-Zahrawi', email: 'fatima.alzahrawi@plhms-demo.com',  phone: '+966-50-555-0107', idNumber: 'SA-DM-007', role: 'GUEST_NEW',       stays: 2, spent: 1800 },
    { firstName: 'Alexander', lastName: 'Petrov',     email: 'alexander.petrov@plhms-demo.com',  phone: '+7-495-555-0108',  idNumber: 'RU-DM-008', role: 'GUEST_RETURNING', stays: 6, spent: 7100 },
    { firstName: 'Isabella',  lastName: 'Moretti',    email: 'isabella.moretti@plhms-demo.com',  phone: '+39-06-555-0109',  idNumber: 'IT-DM-009', role: 'GUEST_NEW',       stays: 1, spent: 920  },
    { firstName: 'Lucas',     lastName: 'Mueller',    email: 'lucas.mueller@plhms-demo.com',     phone: '+49-30-555-0110',  idNumber: 'DE-DM-010', role: 'GUEST_RETURNING', stays: 3, spent: 3200 },
    { firstName: 'Aisha',     lastName: 'Khalid',     email: 'aisha.khalid@plhms-demo.com',      phone: '+971-55-555-0111', idNumber: 'AE-DM-011', role: 'GUEST_NEW',       stays: 1, spent: 1500 },
    { firstName: 'William',   lastName: 'Chen',       email: 'william.chen@plhms-demo.com',      phone: '+1-415-555-0112',  idNumber: 'US-DM-012', role: 'GUEST_RETURNING', stays: 8, spent: 9600 },
    { firstName: 'Amelia',    lastName: 'Fischer',    email: 'amelia.fischer@plhms-demo.com',    phone: '+43-1-5555-0113',  idNumber: 'AT-DM-013', role: 'GUEST_NEW',       stays: 1, spent: 680  },
    { firstName: 'Omar',      lastName: 'Benali',     email: 'omar.benali@plhms-demo.com',       phone: '+213-21-555-0114', idNumber: 'DZ-DM-014', role: 'GUEST_RETURNING', stays: 2, spent: 2100 },
    { firstName: 'Priya',     lastName: 'Sharma',     email: 'priya.sharma@plhms-demo.com',      phone: '+91-98-555-0115',  idNumber: 'IN-DM-015', role: 'GUEST_NEW',       stays: 1, spent: 880  },
    { firstName: 'Henrik',    lastName: 'Andersen',   email: 'henrik.andersen@plhms-demo.com',   phone: '+45-33-555-0116',  idNumber: 'DK-DM-016', role: 'GUEST_RETURNING', stays: 4, spent: 4300 },
    { firstName: 'Layla',     lastName: 'Hassan',     email: 'layla.hassan@plhms-demo.com',      phone: '+20-2-5555-0117',  idNumber: 'EG-DM-017', role: 'GUEST_NEW',       stays: 1, spent: 1100 },
    { firstName: 'Sebastian', lastName: 'Dupont',     email: 'sebastian.dupont@plhms-demo.com',  phone: '+32-2-5555-0118',  idNumber: 'BE-DM-018', role: 'GUEST_RETURNING', stays: 5, spent: 5900 },
    { firstName: 'Mei',       lastName: 'Zhang',      email: 'mei.zhang@plhms-demo.com',         phone: '+86-10-555-0119',  idNumber: 'CN-DM-019', role: 'GUEST_NEW',       stays: 2, spent: 1950 },
    { firstName: 'Rafael',    lastName: 'Santos',     email: 'rafael.santos@plhms-demo.com',     phone: '+55-11-555-0120',  idNumber: 'BR-DM-020', role: 'GUEST_RETURNING', stays: 3, spent: 3400 },
    { firstName: 'Natasha',   lastName: 'Ivanova',    email: 'natasha.ivanova@plhms-demo.com',   phone: '+7-812-555-0121',  idNumber: 'RU-DM-021', role: 'GUEST_NEW',       stays: 1, spent: 790  },
    { firstName: 'Ahmed',     lastName: 'Al-Farsi',   email: 'ahmed.alfarsi@plhms-demo.com',     phone: '+968-99-555-0122', idNumber: 'OM-DM-022', role: 'GUEST_RETURNING', stays: 6, spent: 6800 },
    { firstName: 'Chloe',     lastName: 'Martin',     email: 'chloe.martin@plhms-demo.com',      phone: '+33-1-5555-0123',  idNumber: 'FR-DM-023', role: 'GUEST_NEW',       stays: 1, spent: 960  },
    { firstName: 'David',     lastName: 'Kim',        email: 'david.kim@plhms-demo.com',         phone: '+82-2-5555-0124',  idNumber: 'KR-DM-024', role: 'GUEST_RETURNING', stays: 2, spent: 2600 },
    { firstName: 'Zara',      lastName: 'Al-Amiri',   email: 'zara.alamiri@plhms-demo.com',      phone: '+971-56-555-0125', idNumber: 'AE-DM-025', role: 'GUEST_NEW',       stays: 1, spent: 1350 },
  ];

  const createdGuests = [];
  for (const g of guestData) {
    const u = await prisma.user.upsert({
      where: { email: g.email },
      update: {},
      create: {
        email: g.email, password: hashedPassword,
        role: g.role, firstName: g.firstName, lastName: g.lastName,
        phone: g.phone, idNumber: g.idNumber,
      },
    });
    if (g.stays > 1) {
      await prisma.guestProfile.upsert({
        where: { userId: u.id },
        update: {},
        create: {
          userId: u.id, isFirstVisit: false, totalStays: g.stays, totalSpent: g.spent,
          discountRate: g.stays >= 5 ? 0.10 : g.stays >= 3 ? 0.05 : 0,
        },
      });
    }
    createdGuests.push(u);
  }
  console.log(`✅ ${createdGuests.length} demo guest users seeded`);

  // ── Extra Store Items ──────────────────────────────────────────
  await prisma.storeItem.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Nespresso Coffee Pods x10',   nameAr: 'كبسولات نسبريسو',      category: 'drinks',     price: 12.00, quantity:  30, isAvailable: true },
      { name: 'Fresh Orange Juice 330ml',    nameAr: 'عصير برتقال طازج',      category: 'drinks',     price:  5.50, quantity:  60, isAvailable: true },
      { name: 'Red Bull Energy 250ml',       nameAr: 'ريد بول',               category: 'drinks',     price:  4.00, quantity:  80, isAvailable: true },
      { name: 'Premium Still Water 1L',      nameAr: 'مياه معدنية',           category: 'drinks',     price:  3.50, quantity: 100, isAvailable: true },
      { name: 'Coconut Water 500ml',         nameAr: 'ماء جوز الهند',         category: 'drinks',     price:  6.00, quantity:  50, isAvailable: true },
      { name: 'Iced Matcha Latte Can',       nameAr: 'ماتشا لاتيه',           category: 'drinks',     price:  7.50, quantity:  40, isAvailable: true },
      { name: 'Gourmet Mixed Nuts 100g',     nameAr: 'مكسرات مشكلة',          category: 'snacks',     price:  9.00, quantity:  55, isAvailable: true },
      { name: 'Protein Bar Chocolate',       nameAr: 'بروتين بار شوكولاتة',   category: 'snacks',     price:  5.00, quantity:  65, isAvailable: true },
      { name: 'Honey & Oat Granola Bar',     nameAr: 'قرانولا بار',           category: 'snacks',     price:  4.50, quantity:  70, isAvailable: true },
      { name: 'Dried Mango Slices 80g',      nameAr: 'شرائح المانجو المجففة', category: 'snacks',     price:  6.50, quantity:  45, isAvailable: true },
      { name: 'Sea Salt Popcorn 50g',        nameAr: 'بوب كورن ملح البحر',    category: 'snacks',     price:  4.00, quantity:  90, isAvailable: true },
      { name: 'Trail Mix with Cranberries',  nameAr: 'خليط المكسرات',         category: 'snacks',     price:  7.00, quantity:  55, isAvailable: true },
      { name: 'Premium Gummy Bears',         nameAr: 'دببة جيلي',             category: 'candy',      price:  5.00, quantity:  75, isAvailable: true },
      { name: 'Luxury Mint Tin',             nameAr: 'نعناع فاخر',            category: 'candy',      price:  3.50, quantity:  60, isAvailable: true },
      { name: 'Dental Hygiene Travel Kit',   nameAr: 'طقم العناية بالأسنان',  category: 'essentials', price:  8.00, quantity:  40, isAvailable: true },
      { name: 'Shaving Essentials Kit',      nameAr: 'طقم الحلاقة',           category: 'essentials', price: 12.00, quantity:  30, isAvailable: true },
      { name: 'SPF 50 Sunscreen 100ml',      nameAr: 'واقي شمس',              category: 'essentials', price: 14.00, quantity:  25, isAvailable: true },
      { name: 'Hair Care Travel Set',        nameAr: 'طقم العناية بالشعر',    category: 'essentials', price: 16.00, quantity:  20, isAvailable: true },
      { name: 'Sleep Mask & Earplugs Set',   nameAr: 'قناع نوم وسدادات',      category: 'essentials', price:  7.50, quantity:  35, isAvailable: true },
      { name: 'Paracetamol 500mg 12-Pack',   nameAr: 'باراسيتامول',           category: 'essentials', price:  6.00, quantity:  50, isAvailable: true },
      { name: 'Hand & Body Lotion 200ml',    nameAr: 'لوشن الجسم',            category: 'essentials', price: 11.00, quantity:  30, isAvailable: true },
      { name: 'Peanut Butter Protein Bites', nameAr: 'لقيمات زبدة الفول',     category: 'snacks',     price:  6.50, quantity:  45, isAvailable: true },
    ],
  });
  const allStoreItems = await prisma.storeItem.findMany({ where: { isAvailable: true } });
  console.log(`✅ Store items: ${allStoreItems.length} total`);

  // ── Demo Bookings ──────────────────────────────────────────────
  const allRooms  = await prisma.room.findMany();
  const roomByNum = Object.fromEntries(allRooms.map(r => [r.roomNumber, r]));

  const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); d.setHours(14, 0, 0, 0); return d; };
  const daysFwd = (n) => { const d = new Date(); d.setDate(d.getDate() + n); d.setHours(14, 0, 0, 0); return d; };

  // [guestIdx, roomNumber, checkInOffset, checkOutOffset, status, numGuests, specialReq]
  // negative offset = days ago, positive = days from now
  const bookingDefs = [
    // ── Completed past stays ──────────────────────────────────────
    [ 0, '201',  -60, -55, 'COMPLETED',  2, 'Late checkout requested'],
    [ 1, '302',  -58, -53, 'COMPLETED',  2, 'Anniversary setup, rose petals'],
    [ 2, '105',  -55, -52, 'COMPLETED',  1, null],
    [ 3, '401',  -50, -44, 'COMPLETED',  4, 'Extra cot needed'],
    [ 4, '503',  -48, -45, 'COMPLETED',  2, 'Non-smoking floor preference'],
    [ 5, '701',  -45, -40, 'COMPLETED',  2, 'VIP welcome amenity'],
    [ 6, '208',  -44, -40, 'COMPLETED',  2, null],
    [ 7, '801',  -40, -35, 'COMPLETED',  2, 'Business center access required'],
    [ 8, '113',  -38, -36, 'COMPLETED',  1, null],
    [ 9, '305',  -35, -29, 'COMPLETED',  2, 'Champagne on arrival'],
    [10, '203',  -32, -28, 'COMPLETED',  2, null],
    [11, '1001', -30, -23, 'COMPLETED',  4, 'Helicopter pickup arranged'],
    [12, '111',  -28, -26, 'COMPLETED',  1, null],
    [13, '405',  -25, -20, 'COMPLETED',  4, 'Family welcome pack requested'],
    [14, '501',  -22, -19, 'COMPLETED',  2, null],
    [15, '702',  -20, -15, 'COMPLETED',  2, 'Spa package requested'],
    [16, '307',  -18, -14, 'COMPLETED',  3, null],
    // ── Currently checked-in ─────────────────────────────────────
    [17, '204',   -3,   4, 'CHECKED_IN', 2, 'Pillow menu preference'],
    [18, '303',   -2,   5, 'CHECKED_IN', 2, 'Romantic getaway'],
    [19, '403',   -1,   6, 'CHECKED_IN', 3, null],
    [20, '502',   -2,   3, 'CHECKED_IN', 2, null],
    [21, '802',   -1,   7, 'CHECKED_IN', 2, 'Corner suite preference'],
    [22, '103',   -3,   2, 'CHECKED_IN', 1, null],
    // ── Future confirmed ──────────────────────────────────────────
    [23, '301',    5,   9, 'CONFIRMED',  2, 'Honeymoon setup requested'],
    [ 0, '803',    7,  14, 'CONFIRMED',  5, 'Family reunion — extra beds'],
    [ 1, '206',    8,  12, 'CONFIRMED',  2, null],
    [ 3, '505',   10,  15, 'CONFIRMED',  2, 'Airport transfer needed'],
    [ 5, '702',   12,  18, 'CONFIRMED',  2, 'VIP status — personal butler'],
    [ 7, '1002',  15,  22, 'CONFIRMED',  4, 'Chauffeur service required'],
    [ 9, '304',   18,  22, 'CONFIRMED',  2, 'In-room spa session'],
    [11, '404',   20,  27, 'CONFIRMED',  4, 'Kids pool access'],
    [13, '207',   22,  26, 'CONFIRMED',  2, null],
    [15, '501',   25,  30, 'CONFIRMED',  2, 'Gym access required'],
    [17, '701',   28,  35, 'CONFIRMED',  2, 'Early check-in requested'],
    [21, '1101',  35,  45, 'CONFIRMED',  6, 'Royal suite full package'],
  ];

  const createdBookings = [];
  for (let i = 0; i < bookingDefs.length; i++) {
    const [gIdx, roomNum, ciOff, coOff, status, numGuests, specialReq] = bookingDefs[i];
    const guest = createdGuests[gIdx];
    const room  = roomByNum[roomNum];
    if (!guest || !room) { createdBookings.push(null); continue; }

    const checkIn  = ciOff < 0 ? daysAgo(-ciOff) : daysFwd(ciOff);
    const checkOut = coOff < 0 ? daysAgo(-coOff) : daysFwd(coOff);
    const nights   = Math.max(1, Math.round((checkOut - checkIn) / 86400000));
    const total    = Math.round(room.currentPrice * nights * 100) / 100;
    const bkNum    = `BKD-2025-DM${String(i + 1).padStart(3, '0')}`;

    let bk = await prisma.booking.findUnique({ where: { bookingNumber: bkNum } });
    if (!bk) {
      bk = await prisma.booking.create({
        data: {
          bookingNumber: bkNum, userId: guest.id, roomId: room.id,
          checkInDate: checkIn, checkOutDate: checkOut,
          numberOfGuests: numGuests, status,
          totalPrice: total, discountApplied: 0, finalPrice: total,
          specialRequests: specialReq ?? null,
        },
      });
    }
    createdBookings.push(bk);
  }
  const validBookings = createdBookings.filter(Boolean).length;
  console.log(`✅ ${validBookings} demo bookings seeded`);

  // ── Demo Market Orders (with OrderItems) ──────────────────────
  const pickRandom = (pool, n) =>
    [...pool].sort(() => Math.random() - 0.5).slice(0, Math.min(n, pool.length));

  // [guestIdx, bookingIdx, itemCount, hoursAgo, status]
  const orderDefs = [
    [ 0,  0, 3, 1440, 'DELIVERED'],
    [ 1,  1, 2, 1380, 'DELIVERED'],
    [ 2,  2, 1, 1320, 'DELIVERED'],
    [ 3,  3, 4, 1200, 'DELIVERED'],
    [ 4,  4, 2, 1100, 'DELIVERED'],
    [ 5,  5, 3,  960, 'DELIVERED'],
    [ 7,  7, 2,  900, 'DELIVERED'],
    [ 9,  9, 3,  840, 'DELIVERED'],
    [11, 11, 5,  720, 'DELIVERED'],
    [13, 13, 2,  600, 'DELIVERED'],
    [15, 15, 3,  480, 'DELIVERED'],
    [16, 16, 2,  430, 'DELIVERED'],
    [17, 17, 2,   72, 'DELIVERED'],
    [18, 18, 3,   48, 'DELIVERED'],
    [19, 19, 2,   36, 'DELIVERED'],
    [20, 20, 4,   24, 'DELIVERED'],
    [21, 21, 3,   12, 'DELIVERED'],
    [22, 22, 1,    6, 'DELIVERED'],
    [17, 17, 2,    3, 'PREPARING'],
    [18, 18, 1,    2, 'PREPARING'],
    [19, 19, 3,    1, 'PENDING'  ],
    [20, 20, 2,  0.5, 'PENDING'  ],
    [21, 21, 2, 0.25, 'PENDING'  ],
  ];

  let ordersSeeded = 0;
  for (let i = 0; i < orderDefs.length; i++) {
    const [gIdx, bkIdx, itemCount, hoursAgo, status] = orderDefs[i];
    const guest   = createdGuests[gIdx];
    const booking = createdBookings[bkIdx];
    if (!guest || !booking) continue;

    const ordNum  = `ORD-DM-${String(i + 1).padStart(3, '0')}`;
    const already = await prisma.order.findUnique({ where: { orderNumber: ordNum } });
    if (already) { ordersSeeded++; continue; }

    const picked     = pickRandom(allStoreItems, itemCount);
    const quantities = picked.map(() => Math.floor(Math.random() * 2) + 1);
    const total      = Math.round(picked.reduce((s, it, j) => s + it.price * quantities[j], 0) * 100) / 100;
    const createdAt  = new Date(Date.now() - hoursAgo * 3600000);
    const roomRef    = allRooms.find(r => r.id === booking.roomId);

    await prisma.order.create({
      data: {
        orderNumber:   ordNum,
        userId:        guest.id,
        roomBookingId: booking.id,
        clientName:    `${guest.firstName} ${guest.lastName}`,
        roomNumber:    roomRef?.roomNumber ?? '101',
        orderType:     'MARKET',
        status,
        totalPrice:    total,
        createdAt,
        items: {
          create: picked.map((it, j) => ({
            itemId: it.id, quantity: quantities[j], price: it.price,
          })),
        },
      },
    });
    ordersSeeded++;
  }
  console.log(`✅ ${ordersSeeded} demo market orders seeded`);

  // ── Demo Service Bookings ──────────────────────────────────────
  // [guestIdx, bookingIdx, serviceType, dayOffset, time, duration, price, status, notes]
  // dayOffset: negative = days ago, positive = days from now
  const svcDefs = [
    [ 0,  0, 'spa',    -55, '10:00', '90min',              252, 'COMPLETED', null],
    [ 1,  1, 'butler', -54, '09:00', 'full_day',          1200, 'COMPLETED', 'Anniversary arrangements'],
    [ 3,  3, 'gym',    -49, '07:00', '7',                  250, 'COMPLETED', null],
    [ 5,  5, 'driver', -43, '08:30', 'full_day',           800, 'COMPLETED', 'Airport pickup + city tour'],
    [ 7,  7, 'pool',   -39, '10:00', '2hours',             216, 'COMPLETED', 'Private pool session'],
    [ 9,  9, 'spa',    -34, '14:00', '120min',             504, 'COMPLETED', 'Couples deep tissue'],
    [11, 11, 'butler', -28, '08:00', 'full_day',          1600, 'COMPLETED', 'Presidential suite service'],
    [13, 13, 'gym',    -24, '06:30', '14',                 400, 'COMPLETED', 'Fitness program'],
    [15, 15, 'driver', -18, '09:00', 'city_tour',          400, 'COMPLETED', 'City highlights tour'],
    [16, 16, 'spa',    -16, '11:00', '60min',              180, 'COMPLETED', null],
    [17, 17, 'spa',     -1, '11:00', '60min',              180, 'CONFIRMED', null],
    [18, 18, 'butler',   0, '08:00', 'half_day',           750, 'CONFIRMED', 'Romantic arrangements'],
    [19, 19, 'pool',     1, '09:00', 'half_day',           360, 'CONFIRMED', null],
    [20, 20, 'gym',      0, '07:00', '3',                  125, 'CONFIRMED', null],
    [21, 21, 'driver',   2, '10:00', 'airport_transfer',   260, 'CONFIRMED', 'Airport departure transfer'],
    [22, 22, 'spa',      0, '15:00', '60min',              180, 'CONFIRMED', null],
    [23, 23, 'butler',   6, '09:00', 'full_day',          1200, 'CONFIRMED', 'Honeymoon personal butler'],
    [ 5, 27, 'driver',  13, '08:00', 'full_day',           800, 'CONFIRMED', 'VIP city transfer'],
    [ 7, 28, 'spa',     16, '14:00', '90min',              252, 'CONFIRMED', null],
    [ 9, 29, 'butler',  19, '09:00', 'half_day',           750, 'CONFIRMED', null],
    [11, 30, 'pool',    21, '10:00', 'full_day',           600, 'CONFIRMED', 'Full day private pool'],
    [13, 31, 'gym',     23, '07:00', '7',                  250, 'CONFIRMED', null],
    [15, 32, 'driver',  26, '09:00', 'city_tour',          400, 'CONFIRMED', null],
    [17, 33, 'spa',     29, '11:00', '120min',             504, 'CONFIRMED', null],
    [21, 34, 'butler',  36, '08:00', 'full_day',          1600, 'CONFIRMED', 'Royal suite butler package'],
  ];

  let svcSeeded = 0;
  for (let i = 0; i < svcDefs.length; i++) {
    const [gIdx, bkIdx, serviceType, dayOff, time, duration, price, status, notes] = svcDefs[i];
    const guest   = createdGuests[gIdx];
    const booking = createdBookings[bkIdx] ?? null;
    if (!guest) continue;

    const abbr   = serviceType.substring(0, 3).toUpperCase();
    const svcNum = `SVC-DM-${abbr}-${String(i + 1).padStart(3, '0')}`;
    const exists = await prisma.serviceBooking.findUnique({ where: { bookingNumber: svcNum } });
    if (exists) { svcSeeded++; continue; }

    const bookDate = dayOff < 0 ? daysAgo(-dayOff) : daysFwd(dayOff);
    const roomRef  = booking ? allRooms.find(r => r.id === booking.roomId) : null;

    await prisma.serviceBooking.create({
      data: {
        bookingNumber: svcNum,
        serviceType,
        userId:        guest.id,
        roomBookingId: booking?.id ?? null,
        guestName:    `${guest.firstName} ${guest.lastName}`,
        guestEmail:    guest.email,
        guestPhone:    guest.phone ?? null,
        roomNumber:    roomRef?.roomNumber ?? null,
        bookingDate:   bookDate,
        startTime:     time,
        duration,
        totalPrice:    price,
        status,
        notes:         notes ?? null,
        formData:      JSON.stringify({ duration, serviceType }),
      },
    });
    svcSeeded++;
  }
  console.log(`✅ ${svcSeeded} demo service bookings seeded`);

  console.log('\n🏨 Presidential Luxury Hotel — Database Fully Seeded!');
  console.log('   ─────────────────────────────────────────────────');
  console.log(`   • Rooms          : ${rooms.length}`);
  console.log(`   • Guest users    : ${createdGuests.length}`);
  console.log(`   • Store items    : ${allStoreItems.length}`);
  console.log(`   • Bookings       : ${validBookings}`);
  console.log(`   • Market orders  : ${ordersSeeded}`);
  console.log(`   • Service bookings: ${svcSeeded}`);
  console.log('   ─────────────────────────────────────────────────');
  console.log('   Default password for all demo accounts: password123');
}

main()
  .catch(e => { console.error('❌ Seed failed:', e); process.exit(1); })
  .finally(() => prisma.$disconnect());
