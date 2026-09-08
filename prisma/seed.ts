import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

function generatePassportHash(lotNumber: string, farmerName: string, commodity: string, date: string, moisture: number, grade: string) {
  return crypto.createHash('sha256').update(`${lotNumber}-${farmerName}-${commodity}-${date}-${moisture}-${grade}-MAHA-AGRI-VERIFIED`).digest('hex');
}

async function main() {
  console.log('🌱 Starting database seed for AgriConnect Maharashtra...');

  // Clean existing data
  await prisma.notification.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.demandListing.deleteMany();
  await prisma.lotContribution.deleteMany();
  await prisma.lot.deleteMany();
  await prisma.priceRecord.deleteMany();
  await prisma.storageFacility.deleteMany();
  await prisma.transportProvider.deleteMany();
  await prisma.farmerProfile.deleteMany();
  await prisma.fpoProfile.deleteMany();
  await prisma.buyerProfile.deleteMany();
  await prisma.market.deleteMany();
  await prisma.commodity.deleteMany();
  await prisma.user.deleteMany();

  // 1. Commodities
  console.log('📦 Seeding commodities...');
  const commodities = await Promise.all([
    prisma.commodity.create({
      data: {
        id: 'c_onion',
        nameEn: 'Onion (Red Nashik)',
        nameMr: 'कांदा (नाशिक लाल)',
        category: 'Vegetables',
        mspPrice: 1950,
        typicalMoistureStandard: 11.5,
        gradeSpecs: 'Grade A (50-70mm uniform, dry neck, <12% moisture), Grade B (40-50mm), Grade C (under 40mm processing)',
        imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80'
      }
    }),
    prisma.commodity.create({
      data: {
        id: 'c_tomato',
        nameEn: 'Tomato (Hybrid Vaishali)',
        nameMr: 'टोमॅटो (वैशाली हायब्रिड)',
        category: 'Vegetables',
        mspPrice: 1350,
        typicalMoistureStandard: 14.0,
        gradeSpecs: 'Grade A (Firm, deep red, no blemishes, export standard), Grade B (firm breaker stage), Grade C (pulp/ketchup)',
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
      }
    }),
    prisma.commodity.create({
      data: {
        id: 'c_soybean',
        nameEn: 'Soybean (Yellow JS-335)',
        nameMr: 'सोयाबीन (पिवळा JS-335)',
        category: 'Oilseeds',
        mspPrice: 4892,
        typicalMoistureStandard: 10.0,
        gradeSpecs: 'Grade A (Oil >19%, moisture <10%, foreign matter <1%), Grade B (moisture 10-12%), Grade C (cracked/high moisture)',
        imageUrl: 'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80'
      }
    }),
    prisma.commodity.create({
      data: {
        id: 'c_cotton',
        nameEn: 'Cotton (Bt Long Staple)',
        nameMr: 'कापूस (लांब धागा)',
        category: 'Cash Crop',
        mspPrice: 7121,
        typicalMoistureStandard: 8.5,
        gradeSpecs: 'Grade A (Staple >29mm, Micronaire 3.8-4.2, moisture <8.5%), Grade B (Staple 27-28mm), Grade C (short staple)',
        imageUrl: 'https://images.unsplash.com/photo-1594897030560-6979679f2430?w=600&auto=format&fit=crop&q=80'
      }
    }),
    prisma.commodity.create({
      data: {
        id: 'c_turdal',
        nameEn: 'Tur Dal (Pigeon Pea Red)',
        nameMr: 'तूर डाळ (लाल तूर)',
        category: 'Pulses',
        mspPrice: 7550,
        typicalMoistureStandard: 11.0,
        gradeSpecs: 'Grade A (Bold grain, moisture <11%, unblemished), Grade B (standard milling grade), Grade C (small grain)',
        imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80'
      }
    }),
    prisma.commodity.create({
      data: {
        id: 'c_wheat',
        nameEn: 'Wheat (Sharbati Lokwan)',
        nameMr: 'गहू (शरबती लोकवान)',
        category: 'Cereals',
        mspPrice: 2275,
        typicalMoistureStandard: 12.0,
        gradeSpecs: 'Grade A (Lustrous amber grain, gluten >11%, moisture <12%), Grade B (commercial standard), Grade C (feed grain)',
        imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'
      }
    }),
    prisma.commodity.create({
      data: {
        id: 'c_grapes',
        nameEn: 'Grapes (Thompson Seedless)',
        nameMr: 'द्राक्षे (थॉमसन सीडलेस)',
        category: 'Fruits',
        mspPrice: 3400,
        typicalMoistureStandard: 16.0,
        gradeSpecs: 'Grade A (Berry diameter >18mm, Brix >17, Export quality with APEDA residual limit), Grade B (Domestic table), Grade C (Raisin)',
        imageUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80'
      }
    }),
    prisma.commodity.create({
      data: {
        id: 'c_orange',
        nameEn: 'Orange (Nagpur Santra)',
        nameMr: 'संत्रा (नागपूर संत्रा)',
        category: 'Fruits',
        mspPrice: 2900,
        typicalMoistureStandard: 15.0,
        gradeSpecs: 'Grade A (Uniform color, juice >42%, Brix >10, diameter >65mm), Grade B (diameter 55-65mm), Grade C (Juice grade)',
        imageUrl: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop&q=80'
      }
    })
  ]);

  // 2. APMC Mandis
  console.log('🏛️ Seeding APMC Mandis...');
  const mandis = await Promise.all([
    prisma.market.create({
      data: {
        id: 'm_lasalgaon',
        nameEn: 'Lasalgaon APMC',
        nameMr: 'लासलगाव कृषी उत्पन्न बाजार समिती',
        district: 'Nashik',
        latitude: 20.1472,
        longitude: 74.2267,
        isMajorHub: true,
        contactPhone: '+91-2550-266224'
      }
    }),
    prisma.market.create({
      data: {
        id: 'm_pune',
        nameEn: 'Pune Market Yard (Gultekdi)',
        nameMr: 'पुणे कृषी उत्पन्न बाजार समिती (गुलटेकडी)',
        district: 'Pune',
        latitude: 18.4965,
        longitude: 73.8682,
        isMajorHub: true,
        contactPhone: '+91-20-24262841'
      }
    }),
    prisma.market.create({
      data: {
        id: 'm_nashik',
        nameEn: 'Nashik APMC (Panchavati)',
        nameMr: 'नाशिक कृषी उत्पन्न बाजार समिती (पंचवटी)',
        district: 'Nashik',
        latitude: 20.0110,
        longitude: 73.7903,
        isMajorHub: true,
        contactPhone: '+91-253-2512301'
      }
    }),
    prisma.market.create({
      data: {
        id: 'm_nagpur',
        nameEn: 'Nagpur APMC (Kalamna)',
        nameMr: 'नागपूर कृषी उत्पन्न बाजार समिती (कळमना)',
        district: 'Nagpur',
        latitude: 21.1738,
        longitude: 79.1366,
        isMajorHub: true,
        contactPhone: '+91-712-2680124'
      }
    }),
    prisma.market.create({
      data: {
        id: 'm_aurangabad',
        nameEn: 'Chhatrapati Sambhaji Nagar APMC (Jadhavwadi)',
        nameMr: 'छत्रपती संभाजीनगर बाजार समिती (जाधववाडी)',
        district: 'Chhatrapati Sambhaji Nagar',
        latitude: 19.9075,
        longitude: 75.3533,
        isMajorHub: true,
        contactPhone: '+91-240-2381204'
      }
    }),
    prisma.market.create({
      data: {
        id: 'm_kolhapur',
        nameEn: 'Kolhapur APMC (Shahu Market Yard)',
        nameMr: 'कोल्हापूर शाहू छत्रपती बाजार समिती',
        district: 'Kolhapur',
        latitude: 16.6946,
        longitude: 74.2433,
        isMajorHub: true,
        contactPhone: '+91-231-2651402'
      }
    })
  ]);

  // 3. Historical Price Records (35 days of realistic data)
  console.log('📈 Seeding 35 days of mandi price trends...');
  const basePrices: Record<string, Record<string, number>> = {
    c_onion: { m_lasalgaon: 2450, m_nashik: 2380, m_pune: 2620, m_aurangabad: 2320, m_nagpur: 2750, m_kolhapur: 2540 },
    c_tomato: { m_lasalgaon: 1800, m_nashik: 1850, m_pune: 2100, m_aurangabad: 1750, m_nagpur: 2250, m_kolhapur: 2000 },
    c_soybean: { m_lasalgaon: 4950, m_nashik: 4920, m_pune: 5080, m_aurangabad: 4900, m_nagpur: 5120, m_kolhapur: 4980 },
    c_cotton: { m_lasalgaon: 7200, m_nashik: 7180, m_pune: 7350, m_aurangabad: 7250, m_nagpur: 7450, m_kolhapur: 7220 },
    c_turdal: { m_lasalgaon: 9200, m_nashik: 9150, m_pune: 9450, m_aurangabad: 9100, m_nagpur: 9600, m_kolhapur: 9350 },
    c_wheat: { m_lasalgaon: 2580, m_nashik: 2550, m_pune: 2720, m_aurangabad: 2500, m_nagpur: 2680, m_kolhapur: 2650 },
    c_grapes: { m_lasalgaon: 6800, m_nashik: 7100, m_pune: 7400, m_aurangabad: 6700, m_nagpur: 7800, m_kolhapur: 7200 },
    c_orange: { m_lasalgaon: 3400, m_nashik: 3450, m_pune: 3800, m_aurangabad: 3350, m_nagpur: 4200, m_kolhapur: 3650 },
  };

  const today = new Date();
  const priceRecordsToInsert = [];

  for (let dayOffset = 35; dayOffset >= 0; dayOffset--) {
    const recordDate = new Date(today);
    recordDate.setDate(today.getDate() - dayOffset);

    for (const commodity of commodities) {
      for (const mandi of mandis) {
        const base = basePrices[commodity.id]?.[mandi.id] || 2500;
        // Introduce natural wave, weekend dips, and commodity specific spikes
        // For Lasalgaon Onion, create an intentional +12% surge in last 7 days as described in prompt!
        let trendFactor = 0;
        if (commodity.id === 'c_onion' && mandi.id === 'm_lasalgaon') {
          if (dayOffset <= 7) {
            trendFactor = (7 - dayOffset) * 42; // +₹294 over 7 days (~12% up)
          } else {
            trendFactor = Math.sin(dayOffset * 0.3) * 30;
          }
        } else if (commodity.id === 'c_tomato') {
          trendFactor = Math.sin(dayOffset * 0.8) * 140; // High volatility
        } else if (commodity.id === 'c_soybean') {
          trendFactor = (35 - dayOffset) * 8 + Math.cos(dayOffset) * 25; // Gentle upward
        } else {
          trendFactor = Math.sin((dayOffset + mandi.nameEn.length) * 0.4) * 50;
        }

        const modal = Math.round(base + trendFactor);
        const min = Math.round(modal * 0.91);
        const max = Math.round(modal * 1.09);
        const arrivalVol = Math.round(1500 + Math.abs(Math.sin(dayOffset * 0.5)) * 8500);
        const slope = dayOffset <= 7 ? 1.8 : 0.2;

        priceRecordsToInsert.push({
          commodityId: commodity.id,
          marketId: mandi.id,
          date: recordDate,
          minPrice: min,
          maxPrice: max,
          modalPrice: modal,
          arrivalVolume: arrivalVol,
          trendSlope: slope
        });
      }
    }
  }

  // Insert in chunks of 500
  for (let i = 0; i < priceRecordsToInsert.length; i += 500) {
    await prisma.priceRecord.createMany({
      data: priceRecordsToInsert.slice(i, i + 500)
    });
  }
  console.log(`✅ Seeded ${priceRecordsToInsert.length} price records.`);

  // 4. Transport Providers (8 seeded)
  console.log('🚛 Seeding Transport Providers...');
  const transporters = await Promise.all([
    prisma.transportProvider.create({
      data: {
        id: 'tp_1',
        companyName: 'Jai Maharashtra Agro Transport',
        contactName: 'Santosh Shinde',
        phone: '+91-9823114455',
        vehicleType: 'Eicher Pro 2049 (4 MT Reefer)',
        capacityMT: 4.0,
        ratePerKm: 28.0,
        baseDistrict: 'Nashik',
        rating: 4.8,
        isAvailable: true
      }
    }),
    prisma.transportProvider.create({
      data: {
        id: 'tp_2',
        companyName: 'Shivneri Kisan Logistics',
        contactName: 'Nitin Gaikwad',
        phone: '+91-9823225566',
        vehicleType: 'Tata 407 (2.5 MT Closed Body)',
        capacityMT: 2.5,
        ratePerKm: 22.0,
        baseDistrict: 'Pune',
        rating: 4.7,
        isAvailable: true
      }
    }),
    prisma.transportProvider.create({
      data: {
        id: 'tp_3',
        companyName: 'Vidarbha Agro Express',
        contactName: 'Rahul Deshmukh',
        phone: '+91-9823336677',
        vehicleType: 'Ashok Leyland 1618 (14 MT Open Body)',
        capacityMT: 14.0,
        ratePerKm: 46.0,
        baseDistrict: 'Nagpur',
        rating: 4.9,
        isAvailable: true
      }
    }),
    prisma.transportProvider.create({
      data: {
        id: 'tp_4',
        companyName: 'Sahyadri Cold Chain Logistics',
        contactName: 'Amol Borse',
        phone: '+91-9823447788',
        vehicleType: 'BharatBenz Multi-Axle Reefer (12 MT)',
        capacityMT: 12.0,
        ratePerKm: 52.0,
        baseDistrict: 'Nashik',
        rating: 4.9,
        isAvailable: true
      }
    }),
    prisma.transportProvider.create({
      data: {
        id: 'tp_5',
        companyName: 'Marathwada Freight Movers',
        contactName: 'Vijay Chavan',
        phone: '+91-9823558899',
        vehicleType: 'Tata 1109 (7 MT Tarpaulin Body)',
        capacityMT: 7.0,
        ratePerKm: 34.0,
        baseDistrict: 'Chhatrapati Sambhaji Nagar',
        rating: 4.6,
        isAvailable: true
      }
    }),
    prisma.transportProvider.create({
      data: {
        id: 'tp_6',
        companyName: 'Shahu Cargo Lines',
        contactName: 'Pravin Patil',
        phone: '+91-9823669900',
        vehicleType: 'Mahindra Bolero Maxi Truck (1.5 MT)',
        capacityMT: 1.5,
        ratePerKm: 18.0,
        baseDistrict: 'Kolhapur',
        rating: 4.8,
        isAvailable: true
      }
    }),
    prisma.transportProvider.create({
      data: {
        id: 'tp_7',
        companyName: 'Kisan Express Tempo Services',
        contactName: 'Dnyaneshwar Kale',
        phone: '+91-9823770011',
        vehicleType: 'Tata Ace Gold (1 MT Mini Truck)',
        capacityMT: 1.0,
        ratePerKm: 15.0,
        baseDistrict: 'Ahmednagar',
        rating: 4.5,
        isAvailable: true
      }
    }),
    prisma.transportProvider.create({
      data: {
        id: 'tp_8',
        companyName: 'AgroLink Fast Haulers',
        contactName: 'Sachin Jagtap',
        phone: '+91-9823881122',
        vehicleType: 'Tata Prima 2828 (20 MT Bulk Container)',
        capacityMT: 20.0,
        ratePerKm: 64.0,
        baseDistrict: 'Pune',
        rating: 4.9,
        isAvailable: true
      }
    })
  ]);

  // 5. Storage Facilities (6 seeded)
  console.log('🏬 Seeding Warehouses and Cold Storages...');
  const storages = await Promise.all([
    prisma.storageFacility.create({
      data: {
        id: 'sf_1',
        name: 'MSWC Central Warehouse Lasalgaon',
        facilityType: 'MSWC_WAREHOUSE',
        district: 'Nashik',
        location: 'Near APMC Yard, Lasalgaon',
        totalCapacityMT: 6000.0,
        availableCapacityMT: 2450.0,
        monthlyRatePerQuintal: 18.0,
        humidityControlled: false,
        contactPhone: '+91-2550-266180'
      }
    }),
    prisma.storageFacility.create({
      data: {
        id: 'sf_2',
        name: 'Sahyadri Controlled Atmosphere Cold Store',
        facilityType: 'COLD_STORAGE',
        district: 'Nashik',
        location: 'Mohadi Post-Harvest Complex, Nashik',
        totalCapacityMT: 3500.0,
        availableCapacityMT: 1100.0,
        monthlyRatePerQuintal: 48.0,
        humidityControlled: true,
        contactPhone: '+91-253-2970110'
      }
    }),
    prisma.storageFacility.create({
      data: {
        id: 'sf_3',
        name: 'Gultekdi State Warehousing Complex',
        facilityType: 'MSWC_WAREHOUSE',
        district: 'Pune',
        location: 'Gate 4, Market Yard, Gultekdi, Pune',
        totalCapacityMT: 8000.0,
        availableCapacityMT: 3200.0,
        monthlyRatePerQuintal: 22.0,
        humidityControlled: false,
        contactPhone: '+91-20-24269910'
      }
    }),
    prisma.storageFacility.create({
      data: {
        id: 'sf_4',
        name: 'Nagpur Mandi Citrus & Grain Cold Hub',
        facilityType: 'COLD_STORAGE',
        district: 'Nagpur',
        location: 'Kalamna Industrial Zone, Nagpur',
        totalCapacityMT: 4500.0,
        availableCapacityMT: 1900.0,
        monthlyRatePerQuintal: 42.0,
        humidityControlled: true,
        contactPhone: '+91-712-2681550'
      }
    }),
    prisma.storageFacility.create({
      data: {
        id: 'sf_5',
        name: 'MSWC Grain Silo & Warehouse Jadhavwadi',
        facilityType: 'MSWC_WAREHOUSE',
        district: 'Chhatrapati Sambhaji Nagar',
        location: 'Plot 12, APMC Bypass Road',
        totalCapacityMT: 5000.0,
        availableCapacityMT: 2100.0,
        monthlyRatePerQuintal: 17.5,
        humidityControlled: false,
        contactPhone: '+91-240-2384910'
      }
    }),
    prisma.storageFacility.create({
      data: {
        id: 'sf_6',
        name: 'Shahu Agro Dry Godown',
        facilityType: 'DRY_GODOWN',
        district: 'Kolhapur',
        location: 'Shahu Market Yard Complex, Kolhapur',
        totalCapacityMT: 3000.0,
        availableCapacityMT: 1400.0,
        monthlyRatePerQuintal: 19.0,
        humidityControlled: false,
        contactPhone: '+91-231-2658800'
      }
    })
  ]);

  // 6. Users: Admin
  console.log('👤 Seeding Platform Admin...');
  const adminUser = await prisma.user.create({
    data: {
      id: 'u_admin_msis',
      name: 'Sunita Kulkarni (MSIS Officer)',
      email: 'admin@msis.gov.in',
      phone: '9822044444',
      password: 'demo123',
      role: 'ADMIN',
      district: 'Mumbai / Pune',
      taluka: 'HQ Mantralaya',
      language: 'en'
    }
  });

  // 7. Users: 5 FPOs
  console.log('🏢 Seeding 5 FPOs...');
  const fposData = [
    {
      userId: 'u_fpo_sahyadri',
      name: 'Prakash Deshmukh (Sahyadri FPO Admin)',
      email: 'admin@sahyadrifpo.org',
      phone: '9822022222',
      district: 'Nashik',
      taluka: 'Dindori',
      fpoName: 'Sahyadri Farmers Producer Co. Ltd.',
      regNo: 'U01403MH2011PTC212345',
      estYear: 2011,
      members: 480,
      warehouseCap: 1500.0
    },
    {
      userId: 'u_fpo_mahaagri',
      name: 'Bhausaheb Thorat (MahaAgri FPO)',
      email: 'info@mahaagrifpo.com',
      phone: '9822022223',
      district: 'Ahmednagar',
      taluka: 'Sangamner',
      fpoName: 'MahaAgri Kisan Producer Co.',
      regNo: 'U01409MH2016PTC284910',
      estYear: 2016,
      members: 340,
      warehouseCap: 800.0
    },
    {
      userId: 'u_fpo_vidarbha',
      name: 'Sureshrao Wankhede (Vidarbha Agro FPO)',
      email: 'contact@vidarbhaagro.in',
      phone: '9822022224',
      district: 'Nagpur',
      taluka: 'Katol',
      fpoName: 'Vidarbha Agro Farmer Producer Co.',
      regNo: 'U01400MH2018PTC309123',
      estYear: 2018,
      members: 290,
      warehouseCap: 950.0
    },
    {
      userId: 'u_fpo_godavari',
      name: 'Kailas Jadhav (Godavari Collective)',
      email: 'team@godavarikisan.org',
      phone: '9822022225',
      district: 'Chhatrapati Sambhaji Nagar',
      taluka: 'Gangapur',
      fpoName: 'Godavari Valley Kisan Producer Co.',
      regNo: 'U01402MH2019PTC320491',
      estYear: 2019,
      members: 220,
      warehouseCap: 600.0
    },
    {
      userId: 'u_fpo_shahu',
      name: 'Ananda Chougule (Western Ghats FPO)',
      email: 'office@westernghatsfpo.com',
      phone: '9822022226',
      district: 'Kolhapur',
      taluka: 'Karvir',
      fpoName: 'Western Ghats Agri Producers Co.',
      regNo: 'U01405MH2020PTC345109',
      estYear: 2020,
      members: 195,
      warehouseCap: 500.0
    }
  ];

  const createdFpoProfiles: Record<string, string> = {};
  for (const f of fposData) {
    const u = await prisma.user.create({
      data: {
        id: f.userId,
        name: f.name,
        email: f.email,
        phone: f.phone,
        password: 'demo123',
        role: 'FPO',
        district: f.district,
        taluka: f.taluka,
        language: 'en'
      }
    });

    const prof = await prisma.fpoProfile.create({
      data: {
        userId: u.id,
        fpoName: f.fpoName,
        registrationNo: f.regNo,
        establishedYear: f.estYear,
        memberCount: f.members,
        operationalDistricts: `${f.district}, neighboring talukas`,
        officeAddress: `Plot 45, APMC Road, ${f.taluka}, Dist. ${f.district}`,
        warehouseCapacityMT: f.warehouseCap,
        verifiedByAdmin: true
      }
    });
    createdFpoProfiles[f.userId] = prof.id;
  }

  // 8. Users: 10 Verified Buyers
  console.log('🏢 Seeding 10 Verified Institutional Buyers...');
  const buyersData = [
    {
      userId: 'u_buyer_itc',
      name: 'Vikram Singhania (ITC Agri Business)',
      email: 'vikram@itcagri.com',
      phone: '9822033333',
      company: 'ITC Agri Business Division',
      type: 'Processor & Exporter',
      apmcLicense: 'APMC/NSK/B-8910',
      gstin: '27AAACI1681G1Z9',
      reliability: 4.9,
      volume: 4500,
      terms: '100% Escrow T+1 upon quality check',
      kyc: 'VERIFIED'
    },
    {
      userId: 'u_buyer_sahyadripol',
      name: 'Vilas Shinde (Sahyadri Post-Harvest)',
      email: 'procure@sahyadrifarms.com',
      phone: '9822033334',
      company: 'Sahyadri Farm Post-Harvest Care Ltd',
      type: 'Exporter',
      apmcLicense: 'APMC/NSK/B-7721',
      gstin: '27AASCS3920F1ZQ',
      reliability: 4.9,
      volume: 3800,
      terms: 'Immediate Escrow T+2',
      kyc: 'VERIFIED'
    },
    {
      userId: 'u_buyer_reliance',
      name: 'Rajesh Nair (Reliance Retail Fresh)',
      email: 'fresh.procure@ril.com',
      phone: '9822033335',
      company: 'Reliance Retail Fresh Sourcing',
      type: 'Institutional Buyer',
      apmcLicense: 'APMC/PUN/B-4501',
      gstin: '27AAACR4441L1ZF',
      reliability: 4.8,
      volume: 6200,
      terms: 'Direct Escrow settlement T+3',
      kyc: 'VERIFIED'
    },
    {
      userId: 'u_buyer_bigbasket',
      name: 'Deepak Varma (BigBasket FarmerConnect)',
      email: 'kisan@bigbasket.com',
      phone: '9822033336',
      company: 'Innovative Retail Concepts (BigBasket)',
      type: 'Retail E-commerce',
      apmcLicense: 'APMC/PUN/B-6091',
      gstin: '27AABCI4892K1Z8',
      reliability: 4.8,
      volume: 3100,
      terms: 'Direct digital payout in 24 hours',
      kyc: 'VERIFIED'
    },
    {
      userId: 'u_buyer_dehaat',
      name: 'Alok Roy (DeHaat Supply Chain)',
      email: 'supply@dehaat.in',
      phone: '9822033337',
      company: 'Green Agrevolution Pvt Ltd (DeHaat)',
      type: 'Agri Platform',
      apmcLicense: 'APMC/AUR/B-3312',
      gstin: '27AABCG9102B1ZX',
      reliability: 4.7,
      volume: 2400,
      terms: 'Escrow upon depot weighment',
      kyc: 'VERIFIED'
    },
    {
      userId: 'u_buyer_godrej',
      name: 'Sameer Kulkarni (Godrej Agrovet)',
      email: 'sourcing@godrejagrovet.com',
      phone: '9822033338',
      company: 'Godrej Agrovet Procurement',
      type: 'Processor',
      apmcLicense: 'APMC/NAG/B-5219',
      gstin: '27AAACG1923C1ZM',
      reliability: 4.9,
      volume: 5100,
      terms: 'Escrow T+2 after oil & moisture test',
      kyc: 'VERIFIED'
    },
    {
      userId: 'u_buyer_olam',
      name: 'Tanmay Mehta (Olam Agri India)',
      email: 'cotton.desk@olamagri.com',
      phone: '9822033339',
      company: 'Olam Agri India Pvt Ltd',
      type: 'Global Trader & Exporter',
      apmcLicense: 'APMC/NAG/B-9022',
      gstin: '27AAACT2941P1ZN',
      reliability: 4.9,
      volume: 8500,
      terms: 'Letter of Credit / Escrow T+1',
      kyc: 'VERIFIED'
    },
    {
      userId: 'u_buyer_mahafpc',
      name: 'Yogesh Thorat (MahaFPC Trading)',
      email: 'trade@mahafpc.org',
      phone: '9822033340',
      company: 'MahaFPC Federation Apex Body',
      type: 'Institutional Consortium',
      apmcLicense: 'APMC/PUN/B-1102',
      gstin: '27AAATM4912J1ZR',
      reliability: 4.8,
      volume: 4200,
      terms: 'State NAFED/FPC escrow guarantee',
      kyc: 'VERIFIED'
    },
    {
      userId: 'u_buyer_desai',
      name: 'Ajit Desai (Desai Agri Export)',
      email: 'exports@desaiagri.in',
      phone: '9822033341',
      company: 'Desai Fresh Fruits & Agri Exports',
      type: 'Fresh Produce Exporter',
      apmcLicense: 'APMC/KOL/B-2891',
      gstin: '27AACCD9182H1ZB',
      reliability: 4.6,
      volume: 1800,
      terms: 'Cold chain receipt T+2',
      kyc: 'VERIFIED'
    },
    {
      userId: 'u_buyer_krushivikas',
      name: 'Manish Agarwal (KrushiVikas Traders)',
      email: 'manish@krushivikas.com',
      phone: '9822033342',
      company: 'KrushiVikas Commodity Traders',
      type: 'Wholesale Trader',
      apmcLicense: 'APMC/NSK/B-1940',
      gstin: '27ABFFM8912M1ZP',
      reliability: 4.4,
      volume: 1200,
      terms: 'APMC mandi settlement',
      kyc: 'PENDING' // Seeded as PENDING for Admin KYC verification queue demo!
    }
  ];

  for (const b of buyersData) {
    const u = await prisma.user.create({
      data: {
        id: b.userId,
        name: b.name,
        email: b.email,
        phone: b.phone,
        password: 'demo123',
        role: 'BUYER',
        district: 'Pune',
        taluka: 'Haveli',
        language: 'en'
      }
    });

    await prisma.buyerProfile.create({
      data: {
        userId: u.id,
        companyName: b.company,
        businessType: b.type,
        apmcLicenseNo: b.apmcLicense,
        gstin: b.gstin,
        reliabilityScore: b.reliability,
        tradeVolumeMT: b.volume,
        paymentTerms: b.terms,
        kycStatus: b.kyc,
        verifiedAt: b.kyc === 'VERIFIED' ? new Date() : null
      }
    });
  }

  // 9. Users: 16 Farmers across Maharashtra
  console.log('🌾 Seeding 16 Farmers with profiles and crop acreage...');
  const farmersData = [
    { id: 'u_farmer_ramesh', name: 'Ramesh Patil (Demo Farmer)', phone: '9822012345', email: 'ramesh.patil@kisan.in', district: 'Nashik', taluka: 'Niphad', acres: 4.5, crops: 'Onion, Grapes', fpoKey: 'u_fpo_sahyadri' },
    { id: 'u_farmer_baburao', name: 'Baburao Shinde', phone: '9822012346', email: 'baburao@kisan.in', district: 'Nashik', taluka: 'Yeola', acres: 3.2, crops: 'Onion, Tomato', fpoKey: 'u_fpo_sahyadri' },
    { id: 'u_farmer_sunita', name: 'Sunita Jadhav', phone: '9822012347', email: 'sunita.j@kisan.in', district: 'Nashik', taluka: 'Dindori', acres: 5.0, crops: 'Grapes, Tomato', fpoKey: 'u_fpo_sahyadri' },
    { id: 'u_farmer_sambhaji', name: 'Sambhaji More', phone: '9822012348', email: 'sambhaji@kisan.in', district: 'Ahmednagar', taluka: 'Sangamner', acres: 6.0, crops: 'Soybean, Onion', fpoKey: 'u_fpo_mahaagri' },
    { id: 'u_farmer_ganesh', name: 'Ganesh Kadam', phone: '9822012349', email: 'ganesh.k@kisan.in', district: 'Ahmednagar', taluka: 'Rahata', acres: 3.8, crops: 'Soybean, Wheat', fpoKey: 'u_fpo_mahaagri' },
    { id: 'u_farmer_maruti', name: 'Maruti Pawar', phone: '9822012350', email: 'maruti.p@kisan.in', district: 'Pune', taluka: 'Junnar', acres: 2.5, crops: 'Tomato, Onion', fpoKey: null },
    { id: 'u_farmer_vishnu', name: 'Vishnu Deshmukh', phone: '9822012351', email: 'vishnu.d@kisan.in', district: 'Pune', taluka: 'Shirur', acres: 7.2, crops: 'Soybean, Wheat', fpoKey: null },
    { id: 'u_farmer_bhagwan', name: 'Bhagwan Rathod', phone: '9822012352', email: 'bhagwan.r@kisan.in', district: 'Nagpur', taluka: 'Katol', acres: 8.5, crops: 'Orange, Cotton', fpoKey: 'u_fpo_vidarbha' },
    { id: 'u_farmer_ashok', name: 'Ashok Tayade', phone: '9822012353', email: 'ashok.t@kisan.in', district: 'Nagpur', taluka: 'Saoner', acres: 6.2, crops: 'Orange, Soybean', fpoKey: 'u_fpo_vidarbha' },
    { id: 'u_farmer_prabhakar', name: 'Prabhakar Kale', phone: '9822012354', email: 'prabhakar@kisan.in', district: 'Chhatrapati Sambhaji Nagar', taluka: 'Paithan', acres: 4.8, crops: 'Cotton, Tur Dal', fpoKey: 'u_fpo_godavari' },
    { id: 'u_farmer_sudam', name: 'Sudam Gaydhane', phone: '9822012355', email: 'sudam.g@kisan.in', district: 'Chhatrapati Sambhaji Nagar', taluka: 'Gangapur', acres: 5.5, crops: 'Soybean, Tur Dal', fpoKey: 'u_fpo_godavari' },
    { id: 'u_farmer_digambar', name: 'Digambar Patil', phone: '9822012356', email: 'digambar@kisan.in', district: 'Kolhapur', taluka: 'Hatkanangle', acres: 4.0, crops: 'Soybean, Wheat', fpoKey: 'u_fpo_shahu' },
    { id: 'u_farmer_tanaji', name: 'Tanaji Kamble', phone: '9822012357', email: 'tanaji.k@kisan.in', district: 'Kolhapur', taluka: 'Shirol', acres: 3.5, crops: 'Vegetables, Wheat', fpoKey: 'u_fpo_shahu' },
    { id: 'u_farmer_dattatray', name: 'Dattatray Gaikwad', phone: '9822012358', email: 'dattatray@kisan.in', district: 'Solapur', taluka: 'Barshi', acres: 6.5, crops: 'Tur Dal, Onion', fpoKey: null },
    { id: 'u_farmer_tukaram', name: 'Tukaram Munde', phone: '9822012359', email: 'tukaram.m@kisan.in', district: 'Beed', taluka: 'Georai', acres: 5.2, crops: 'Cotton, Soybean', fpoKey: null },
    { id: 'u_farmer_pandurang', name: 'Pandurang Sutar', phone: '9822012360', email: 'pandurang@kisan.in', district: 'Nashik', taluka: 'Sinnar', acres: 3.0, crops: 'Onion, Tomato', fpoKey: 'u_fpo_sahyadri' },
  ];

  for (const f of farmersData) {
    const u = await prisma.user.create({
      data: {
        id: f.id,
        name: f.name,
        email: f.email,
        phone: f.phone,
        password: 'demo123',
        role: 'FARMER',
        district: f.district,
        taluka: f.taluka,
        language: 'mr' // Default to Marathi for farmers
      }
    });

    await prisma.farmerProfile.create({
      data: {
        userId: u.id,
        landSizeAcres: f.acres,
        aadharVerified: true,
        kisanCreditCard: true,
        primaryCrops: f.crops,
        bankAccountNo: `4190823${Math.floor(10000 + Math.random() * 90000)}`,
        ifscCode: 'MAHB0000312',
        fpoId: f.fpoKey ? createdFpoProfiles[f.fpoKey] : null
      }
    });
  }

  // 10. Digital Lots (Farmer Individual Lots & FPO Aggregated Lots)
  console.log('🏷️ Seeding Farmer Lots and FPO Aggregated Lots with Digital Passports...');
  
  // Ramesh Patil's Lots (Demo Farmer)
  const lot1Hash = generatePassportHash('MH-NSK-2026-0812', 'Ramesh Patil', 'Onion', '2026-09-01', 11.2, 'A');
  const lot1 = await prisma.lot.create({
    data: {
      id: 'lot_ramesh_onion',
      lotNumber: 'MH-NSK-2026-0812',
      ownerType: 'FARMER',
      creatorId: 'u_farmer_ramesh',
      commodityId: 'c_onion',
      marketId: 'm_lasalgaon',
      quantityQuintals: 75.0,
      basePriceExpected: 2550.0,
      moisturePercent: 11.2,
      visualGrade: 'A',
      status: 'AVAILABLE',
      digitalPassportHash: lot1Hash,
      qrCodeData: `https://agriconnect.maharashtra.gov.in/passport/MH-NSK-2026-0812?hash=${lot1Hash.slice(0, 16)}`,
      photoUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'
      ]),
      storageLocation: 'Farm Gate, Niphad, Nashik',
      isAggregated: false
    }
  });

  const lot2Hash = generatePassportHash('MH-NSK-2026-0813', 'Ramesh Patil', 'Grapes', '2026-09-03', 15.5, 'A');
  const lot2 = await prisma.lot.create({
    data: {
      id: 'lot_ramesh_grapes',
      lotNumber: 'MH-NSK-2026-0813',
      ownerType: 'FARMER',
      creatorId: 'u_farmer_ramesh',
      commodityId: 'c_grapes',
      marketId: 'm_nashik',
      quantityQuintals: 40.0,
      basePriceExpected: 7200.0,
      moisturePercent: 15.5,
      visualGrade: 'A',
      status: 'UNDER_OFFER',
      digitalPassportHash: lot2Hash,
      qrCodeData: `https://agriconnect.maharashtra.gov.in/passport/MH-NSK-2026-0813?hash=${lot2Hash.slice(0, 16)}`,
      photoUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80'
      ]),
      storageLocation: 'Cold Room, Niphad, Nashik',
      isAggregated: false
    }
  });

  // Baburao Shinde Lot (for active transaction)
  const lot3Hash = generatePassportHash('MH-NSK-2026-0814', 'Baburao Shinde', 'Tomato', '2026-09-02', 13.8, 'A');
  const lot3 = await prisma.lot.create({
    data: {
      id: 'lot_baburao_tomato',
      lotNumber: 'MH-NSK-2026-0814',
      ownerType: 'FARMER',
      creatorId: 'u_farmer_baburao',
      commodityId: 'c_tomato',
      marketId: 'm_nashik',
      quantityQuintals: 60.0,
      basePriceExpected: 1950.0,
      moisturePercent: 13.8,
      visualGrade: 'A',
      status: 'SOLD',
      digitalPassportHash: lot3Hash,
      qrCodeData: `https://agriconnect.maharashtra.gov.in/passport/MH-NSK-2026-0814?hash=${lot3Hash.slice(0, 16)}`,
      photoUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
      ]),
      storageLocation: 'Crate Storage, Yeola, Nashik',
      isAggregated: false
    }
  });

  // Sunita Jadhav Lot
  const lot4Hash = generatePassportHash('MH-NSK-2026-0815', 'Sunita Jadhav', 'Grapes', '2026-09-04', 15.2, 'A');
  const lot4 = await prisma.lot.create({
    data: {
      id: 'lot_sunita_grapes',
      lotNumber: 'MH-NSK-2026-0815',
      ownerType: 'FARMER',
      creatorId: 'u_farmer_sunita',
      commodityId: 'c_grapes',
      marketId: 'm_nashik',
      quantityQuintals: 45.0,
      basePriceExpected: 7300.0,
      moisturePercent: 15.2,
      visualGrade: 'A',
      status: 'SOLD',
      digitalPassportHash: lot4Hash,
      qrCodeData: `https://agriconnect.maharashtra.gov.in/passport/MH-NSK-2026-0815?hash=${lot4Hash.slice(0, 16)}`,
      photoUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80'
      ]),
      storageLocation: 'Dindori Farm Shade',
      isAggregated: false
    }
  });

  // Sambhaji More Lot (Soybean)
  const lot5Hash = generatePassportHash('MH-AHM-2026-0901', 'Sambhaji More', 'Soybean', '2026-09-03', 9.8, 'A');
  const lot5 = await prisma.lot.create({
    data: {
      id: 'lot_sambhaji_soybean',
      lotNumber: 'MH-AHM-2026-0901',
      ownerType: 'FARMER',
      creatorId: 'u_farmer_sambhaji',
      commodityId: 'c_soybean',
      marketId: 'm_pune',
      quantityQuintals: 80.0,
      basePriceExpected: 5050.0,
      moisturePercent: 9.8,
      visualGrade: 'A',
      status: 'SOLD',
      digitalPassportHash: lot5Hash,
      qrCodeData: `https://agriconnect.maharashtra.gov.in/passport/MH-AHM-2026-0901?hash=${lot5Hash.slice(0, 16)}`,
      photoUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80'
      ]),
      storageLocation: 'Sangamner Warehouse',
      isAggregated: false
    }
  });

  // Bhagwan Rathod Lot (Orange)
  const lot6Hash = generatePassportHash('MH-NAG-2026-1011', 'Bhagwan Rathod', 'Orange', '2026-09-05', 14.5, 'A');
  const lot6 = await prisma.lot.create({
    data: {
      id: 'lot_bhagwan_orange',
      lotNumber: 'MH-NAG-2026-1011',
      ownerType: 'FARMER',
      creatorId: 'u_farmer_bhagwan',
      commodityId: 'c_orange',
      marketId: 'm_nagpur',
      quantityQuintals: 90.0,
      basePriceExpected: 3950.0,
      moisturePercent: 14.5,
      visualGrade: 'A',
      status: 'AVAILABLE',
      digitalPassportHash: lot6Hash,
      qrCodeData: `https://agriconnect.maharashtra.gov.in/passport/MH-NAG-2026-1011?hash=${lot6Hash.slice(0, 16)}`,
      photoUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop&q=80'
      ]),
      storageLocation: 'Katol Orchard Hub',
      isAggregated: false
    }
  });

  // Prabhakar Kale Lot (Cotton)
  const lot7Hash = generatePassportHash('MH-AUR-2026-1102', 'Prabhakar Kale', 'Cotton', '2026-09-02', 8.2, 'A');
  const lot7 = await prisma.lot.create({
    data: {
      id: 'lot_prabhakar_cotton',
      lotNumber: 'MH-AUR-2026-1102',
      ownerType: 'FARMER',
      creatorId: 'u_farmer_prabhakar',
      commodityId: 'c_cotton',
      marketId: 'm_aurangabad',
      quantityQuintals: 100.0,
      basePriceExpected: 7350.0,
      moisturePercent: 8.2,
      visualGrade: 'A',
      status: 'SOLD',
      digitalPassportHash: lot7Hash,
      qrCodeData: `https://agriconnect.maharashtra.gov.in/passport/MH-AUR-2026-1102?hash=${lot7Hash.slice(0, 16)}`,
      photoUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1594897030560-6979679f2430?w=600&auto=format&fit=crop&q=80'
      ]),
      storageLocation: 'Paithan Ginning Shed',
      isAggregated: false
    }
  });

  // Digambar Patil Lot (Tur Dal)
  const lot8Hash = generatePassportHash('MH-KOL-2026-1205', 'Digambar Patil', 'Tur Dal', '2026-09-04', 10.5, 'A');
  const lot8 = await prisma.lot.create({
    data: {
      id: 'lot_digambar_turdal',
      lotNumber: 'MH-KOL-2026-1205',
      ownerType: 'FARMER',
      creatorId: 'u_farmer_digambar',
      commodityId: 'c_turdal',
      marketId: 'm_kolhapur',
      quantityQuintals: 50.0,
      basePriceExpected: 9350.0,
      moisturePercent: 10.5,
      visualGrade: 'A',
      status: 'AVAILABLE',
      digitalPassportHash: lot8Hash,
      qrCodeData: `https://agriconnect.maharashtra.gov.in/passport/MH-KOL-2026-1205?hash=${lot8Hash.slice(0, 16)}`,
      photoUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80'
      ]),
      storageLocation: 'Hatkanangle Godown',
      isAggregated: false
    }
  });

  // FPO Aggregated Lot 1: Sahyadri FPO pooled 300 Quintals Onion from 4 farmers!
  const fpoLot1Hash = generatePassportHash('FPO-SYD-2026-0401', 'Sahyadri FPO Pool', 'Onion', '2026-09-02', 11.4, 'A');
  const fpoAggregatedLot1 = await prisma.lot.create({
    data: {
      id: 'lot_fpo_sahyadri_onion_300',
      lotNumber: 'FPO-SYD-2026-0401',
      ownerType: 'FPO',
      creatorId: 'u_fpo_sahyadri',
      commodityId: 'c_onion',
      marketId: 'm_lasalgaon',
      quantityQuintals: 300.0,
      basePriceExpected: 2600.0,
      moisturePercent: 11.4,
      visualGrade: 'A',
      status: 'UNDER_OFFER',
      digitalPassportHash: fpoLot1Hash,
      qrCodeData: `https://agriconnect.maharashtra.gov.in/passport/FPO-SYD-2026-0401?hash=${fpoLot1Hash.slice(0, 16)}`,
      photoUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'
      ]),
      storageLocation: 'Sahyadri FPO Central Depot, Mohadi, Nashik',
      isAggregated: true
    }
  });

  // Contributions for FPO Aggregated Lot 1
  await prisma.lotContribution.createMany({
    data: [
      {
        aggregatedLotId: fpoAggregatedLot1.id,
        farmerId: 'u_farmer_ramesh',
        contributedWeight: 90.0,
        moisturePercent: 11.2,
        visualGrade: 'A',
        sharePercentage: 30.0,
        payoutAmount: 231660.0,
        payoutStatus: 'PENDING'
      },
      {
        aggregatedLotId: fpoAggregatedLot1.id,
        farmerId: 'u_farmer_baburao',
        contributedWeight: 75.0,
        moisturePercent: 11.5,
        visualGrade: 'A',
        sharePercentage: 25.0,
        payoutAmount: 193050.0,
        payoutStatus: 'PENDING'
      },
      {
        aggregatedLotId: fpoAggregatedLot1.id,
        farmerId: 'u_farmer_pandurang',
        contributedWeight: 75.0,
        moisturePercent: 11.6,
        visualGrade: 'A',
        sharePercentage: 25.0,
        payoutAmount: 193050.0,
        payoutStatus: 'PENDING'
      },
      {
        aggregatedLotId: fpoAggregatedLot1.id,
        farmerId: 'u_farmer_sunita',
        contributedWeight: 60.0,
        moisturePercent: 11.3,
        visualGrade: 'A',
        sharePercentage: 20.0,
        payoutAmount: 154440.0,
        payoutStatus: 'PENDING'
      }
    ]
  });

  // FPO Aggregated Lot 2: MahaAgri FPO pooled 240 Quintals Soybean from 3 farmers
  const fpoLot2Hash = generatePassportHash('FPO-MAG-2026-0502', 'MahaAgri FPO Pool', 'Soybean', '2026-09-03', 9.9, 'A');
  const fpoAggregatedLot2 = await prisma.lot.create({
    data: {
      id: 'lot_fpo_mahaagri_soybean_240',
      lotNumber: 'FPO-MAG-2026-0502',
      ownerType: 'FPO',
      creatorId: 'u_fpo_mahaagri',
      commodityId: 'c_soybean',
      marketId: 'm_pune',
      quantityQuintals: 240.0,
      basePriceExpected: 5100.0,
      moisturePercent: 9.9,
      visualGrade: 'A',
      status: 'AVAILABLE',
      digitalPassportHash: fpoLot2Hash,
      qrCodeData: `https://agriconnect.maharashtra.gov.in/passport/FPO-MAG-2026-0502?hash=${fpoLot2Hash.slice(0, 16)}`,
      photoUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80'
      ]),
      storageLocation: 'Sangamner Agri Complex Silo',
      isAggregated: true
    }
  });

  await prisma.lotContribution.createMany({
    data: [
      {
        aggregatedLotId: fpoAggregatedLot2.id,
        farmerId: 'u_farmer_sambhaji',
        contributedWeight: 100.0,
        moisturePercent: 9.8,
        visualGrade: 'A',
        sharePercentage: 41.67,
        payoutAmount: 502350.0,
        payoutStatus: 'PENDING'
      },
      {
        aggregatedLotId: fpoAggregatedLot2.id,
        farmerId: 'u_farmer_ganesh',
        contributedWeight: 80.0,
        moisturePercent: 10.0,
        visualGrade: 'A',
        sharePercentage: 33.33,
        payoutAmount: 401880.0,
        payoutStatus: 'PENDING'
      },
      {
        aggregatedLotId: fpoAggregatedLot2.id,
        farmerId: 'u_farmer_vishnu',
        contributedWeight: 60.0,
        moisturePercent: 9.9,
        visualGrade: 'A',
        sharePercentage: 25.0,
        payoutAmount: 301410.0,
        payoutStatus: 'PENDING'
      }
    ]
  });

  // 11. Buyer Demand Listings (8 seeded open demands)
  console.log('📋 Seeding Buyer Demand Listings...');
  const demand1 = await prisma.demandListing.create({
    data: {
      id: 'dem_itc_onion',
      buyerId: 'u_buyer_itc',
      commodityId: 'c_onion',
      targetGrade: 'A',
      minMoisture: 9.0,
      maxMoisture: 12.0,
      requiredQuantity: 500.0,
      minPrice: 2500.0,
      maxPrice: 2680.0,
      deliveryLocation: 'ITC Processing Hub, Pimpalgaon, Nashik',
      deliveryTerms: 'Buyer Warehouse Gate with Digital Weighment',
      expiryDate: new Date(Date.now() + 14 * 86400000),
      status: 'OPEN'
    }
  });

  const demand2 = await prisma.demandListing.create({
    data: {
      id: 'dem_reliance_tomato',
      buyerId: 'u_buyer_reliance',
      commodityId: 'c_tomato',
      targetGrade: 'A',
      minMoisture: 12.0,
      maxMoisture: 15.0,
      requiredQuantity: 200.0,
      minPrice: 1900.0,
      maxPrice: 2150.0,
      deliveryLocation: 'Reliance Distribution Centre, Chakan, Pune',
      deliveryTerms: 'Cold Van Delivery / Immediate Crate Unload',
      expiryDate: new Date(Date.now() + 10 * 86400000),
      status: 'OPEN'
    }
  });

  const demand3 = await prisma.demandListing.create({
    data: {
      id: 'dem_godrej_soybean',
      buyerId: 'u_buyer_godrej',
      commodityId: 'c_soybean',
      targetGrade: 'A',
      minMoisture: 8.0,
      maxMoisture: 10.5,
      requiredQuantity: 800.0,
      minPrice: 5000.0,
      maxPrice: 5200.0,
      deliveryLocation: 'Godrej Solvent Plant, Butibori, Nagpur',
      deliveryTerms: 'Bulk Hopper Unload, Escrow Release in 24 Hrs',
      expiryDate: new Date(Date.now() + 21 * 86400000),
      status: 'OPEN'
    }
  });

  const demand4 = await prisma.demandListing.create({
    data: {
      id: 'dem_bigbasket_grapes',
      buyerId: 'u_buyer_bigbasket',
      commodityId: 'c_grapes',
      targetGrade: 'A',
      minMoisture: 14.0,
      maxMoisture: 16.5,
      requiredQuantity: 150.0,
      minPrice: 7100.0,
      maxPrice: 7500.0,
      deliveryLocation: 'BigBasket Fulfillment Centre, Moshi, Pune',
      deliveryTerms: 'Insulated Crates, Temp <10°C',
      expiryDate: new Date(Date.now() + 12 * 86400000),
      status: 'OPEN'
    }
  });

  const demand5 = await prisma.demandListing.create({
    data: {
      id: 'dem_olam_cotton',
      buyerId: 'u_buyer_olam',
      commodityId: 'c_cotton',
      targetGrade: 'A',
      minMoisture: 7.0,
      maxMoisture: 9.0,
      requiredQuantity: 1000.0,
      minPrice: 7300.0,
      maxPrice: 7550.0,
      deliveryLocation: 'Olam Ginning & Pressing Depot, Wardha Road, Nagpur',
      deliveryTerms: 'Baled Lot Passport Verified',
      expiryDate: new Date(Date.now() + 30 * 86400000),
      status: 'OPEN'
    }
  });

  // 12. Offers & Seeded 7-Step Transactions!
  console.log('🤝 Seeding Offers and Deals across the 7-step pipeline...');

  // DEAL 1: OFFER_ACCEPTED stage (Sahyadri FPO to ITC Agri)
  const offer1 = await prisma.offer.create({
    data: {
      id: 'off_deal_1',
      demandListingId: demand1.id,
      lotId: fpoAggregatedLot1.id,
      buyerId: 'u_buyer_itc',
      sellerId: 'u_fpo_sahyadri',
      offeredPrice: 2620.0,
      offeredQuantity: 150.0,
      deliveryLocation: 'ITC Processing Hub, Pimpalgaon, Nashik',
      paymentTerms: '100% Escrow deposit upon acceptance',
      notes: 'High-grade Nashik Red Onion with digital passport inspection approved.',
      status: 'ACCEPTED'
    }
  });

  const deal1 = await prisma.transaction.create({
    data: {
      id: 'deal_1_offer_accepted',
      dealNumber: 'DEAL-MH-2026-4401',
      offerId: offer1.id,
      buyerId: 'u_buyer_itc',
      sellerId: 'u_fpo_sahyadri',
      lotId: fpoAggregatedLot1.id,
      commodityId: 'c_onion',
      agreedPrice: 2620.0,
      agreedQuantity: 150.0,
      totalAmount: 393000.0,
      escrowStatus: 'HELD', // Escrow funds held
      stage: 'OFFER_ACCEPTED', // Step 1
      deliveryLocation: 'ITC Processing Hub, Pimpalgaon, Nashik',
      qualityInspectorNote: 'Awaiting dispatch and transit schedule.'
    }
  });

  // DEAL 2: IN_TRANSIT stage (Ramesh Patil to Godrej Agrovet via Transport Booking)
  const offer2 = await prisma.offer.create({
    data: {
      id: 'off_deal_2',
      demandListingId: demand3.id,
      lotId: lot5.id,
      buyerId: 'u_buyer_godrej',
      sellerId: 'u_farmer_ramesh',
      offeredPrice: 5080.0,
      offeredQuantity: 70.0,
      deliveryLocation: 'Godrej Solvent Plant, Butibori, Nagpur',
      paymentTerms: 'Escrow funded, release upon weighment and moisture <10%',
      notes: 'Direct farm gate dispatch via verified Jai Maharashtra logistics.',
      status: 'ACCEPTED'
    }
  });

  const deal2 = await prisma.transaction.create({
    data: {
      id: 'deal_2_in_transit',
      dealNumber: 'DEAL-MH-2026-4402',
      offerId: offer2.id,
      buyerId: 'u_buyer_godrej',
      sellerId: 'u_farmer_ramesh',
      lotId: lot5.id,
      commodityId: 'c_soybean',
      agreedPrice: 5080.0,
      agreedQuantity: 70.0,
      totalAmount: 355600.0,
      escrowStatus: 'HELD',
      stage: 'IN_TRANSIT', // Step 3
      deliveryLocation: 'Godrej Solvent Plant, Butibori, Nagpur',
      qualityInspectorNote: 'Dispatched in Eicher Pro 2049. Driver contact: +91-9823114455. Expected arrival 18:00 hrs.'
    }
  });

  // Associated Booking for Deal 2
  await prisma.booking.create({
    data: {
      transactionId: deal2.id,
      userId: 'u_farmer_ramesh',
      bookingType: 'TRANSPORT',
      transportProviderId: 'tp_1',
      durationDays: 1,
      estimatedCost: 14500.0,
      status: 'CONFIRMED'
    }
  });

  // DEAL 3: DELIVERED stage (Baburao Shinde to Reliance Fresh)
  const offer3 = await prisma.offer.create({
    data: {
      id: 'off_deal_3',
      demandListingId: demand2.id,
      lotId: lot3.id,
      buyerId: 'u_buyer_reliance',
      sellerId: 'u_farmer_baburao',
      offeredPrice: 2050.0,
      offeredQuantity: 60.0,
      deliveryLocation: 'Reliance Distribution Centre, Chakan, Pune',
      paymentTerms: 'Escrow T+1 upon weighment slip issuance',
      notes: 'Arrived at Chakan bay 3. Weighment completed.',
      status: 'ACCEPTED'
    }
  });

  const deal3 = await prisma.transaction.create({
    data: {
      id: 'deal_3_delivered',
      dealNumber: 'DEAL-MH-2026-4403',
      offerId: offer3.id,
      buyerId: 'u_buyer_reliance',
      sellerId: 'u_farmer_baburao',
      lotId: lot3.id,
      commodityId: 'c_tomato',
      agreedPrice: 2050.0,
      agreedQuantity: 60.0,
      totalAmount: 123000.0,
      escrowStatus: 'HELD',
      stage: 'DELIVERED', // Step 4
      deliveryLocation: 'Reliance Distribution Centre, Chakan, Pune',
      weighmentSlipUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      qualityInspectorNote: 'Gross Weight: 8,420 kg, Tare: 2,420 kg. Net Received: 6,000 kg (60 Quintals). Moisture sampling underway.'
    }
  });

  // DEAL 4: QUALITY_CONFIRMED stage (Sunita Jadhav to BigBasket)
  const offer4 = await prisma.offer.create({
    data: {
      id: 'off_deal_4',
      demandListingId: demand4.id,
      lotId: lot4.id,
      buyerId: 'u_buyer_bigbasket',
      sellerId: 'u_farmer_sunita',
      offeredPrice: 7350.0,
      offeredQuantity: 40.0,
      deliveryLocation: 'BigBasket Fulfillment Centre, Moshi, Pune',
      paymentTerms: 'Escrow release trigger on grade confirmation',
      notes: 'Quality inspection verified Brix 17.5, diameter >18mm.',
      status: 'ACCEPTED'
    }
  });

  const deal4 = await prisma.transaction.create({
    data: {
      id: 'deal_4_quality_confirmed',
      dealNumber: 'DEAL-MH-2026-4404',
      offerId: offer4.id,
      buyerId: 'u_buyer_bigbasket',
      sellerId: 'u_farmer_sunita',
      lotId: lot4.id,
      commodityId: 'c_grapes',
      agreedPrice: 7350.0,
      agreedQuantity: 40.0,
      totalAmount: 294000.0,
      escrowStatus: 'HELD',
      stage: 'QUALITY_CONFIRMED', // Step 5
      deliveryLocation: 'BigBasket Fulfillment Centre, Moshi, Pune',
      confirmedMoisture: 15.1,
      confirmedGrade: 'Grade A (Export Match)',
      qualityInspectorNote: 'Passed all APEDA export residue norms and sweetness Brix test. Authorized for instant payment release.'
    }
  });

  // DEAL 5: PAYMENT_RELEASED stage (Vidarbha FPO to Olam Agri)
  const offer5 = await prisma.offer.create({
    data: {
      id: 'off_deal_5',
      demandListingId: demand5.id,
      lotId: lot7.id,
      buyerId: 'u_buyer_olam',
      sellerId: 'u_fpo_vidarbha',
      offeredPrice: 7420.0,
      offeredQuantity: 100.0,
      deliveryLocation: 'Olam Ginning Depot, Wardha Road, Nagpur',
      paymentTerms: 'Digital Escrow direct bank RTGS release',
      notes: 'Staple length 29.4mm verified by digital lab.',
      status: 'ACCEPTED'
    }
  });

  const deal5 = await prisma.transaction.create({
    data: {
      id: 'deal_5_payment_released',
      dealNumber: 'DEAL-MH-2026-4405',
      offerId: offer5.id,
      buyerId: 'u_buyer_olam',
      sellerId: 'u_fpo_vidarbha',
      lotId: lot7.id,
      commodityId: 'c_cotton',
      agreedPrice: 7420.0,
      agreedQuantity: 100.0,
      totalAmount: 742000.0,
      escrowStatus: 'RELEASED',
      stage: 'PAYMENT_RELEASED', // Step 6
      deliveryLocation: 'Olam Ginning Depot, Wardha Road, Nagpur',
      confirmedMoisture: 8.1,
      confirmedGrade: 'A',
      qualityInspectorNote: 'Payment of ₹7,42,000 successfully debited from Escrow and disbursed to Vidarbha Agro FPO bank account.'
    }
  });

  // DEAL 6: COMPLETED stage
  const offer6 = await prisma.offer.create({
    data: {
      id: 'off_deal_6',
      lotId: lot8.id,
      buyerId: 'u_buyer_itc',
      sellerId: 'u_farmer_digambar',
      offeredPrice: 9400.0,
      offeredQuantity: 50.0,
      deliveryLocation: 'ITC Processing Hub, Kolhapur',
      paymentTerms: 'Escrow T+1',
      notes: 'Full settlement completed.',
      status: 'ACCEPTED'
    }
  });

  await prisma.transaction.create({
    data: {
      id: 'deal_6_completed',
      dealNumber: 'DEAL-MH-2026-4400',
      offerId: offer6.id,
      buyerId: 'u_buyer_itc',
      sellerId: 'u_farmer_digambar',
      lotId: lot8.id,
      commodityId: 'c_turdal',
      agreedPrice: 9400.0,
      agreedQuantity: 50.0,
      totalAmount: 470000.0,
      escrowStatus: 'RELEASED',
      stage: 'COMPLETED', // Step 7
      deliveryLocation: 'ITC Processing Hub, Kolhapur',
      confirmedMoisture: 10.4,
      confirmedGrade: 'A',
      qualityInspectorNote: 'Transaction closed smoothly. Mutual 5-star feedback exchanged.'
    }
  });

  // 13. Seeded Disputes for Admin Review Demo
  console.log('⚖️ Seeding Disputes for Admin Arbitration Demo...');
  await prisma.dispute.create({
    data: {
      id: 'disp_1_open',
      transactionId: deal3.id,
      raisedById: 'u_buyer_reliance',
      reasonCategory: 'WEIGHT_DISCREPANCY',
      description: 'Buyer weighbridge recorded 58.2 Quintals instead of invoice 60.0 Quintals (-1.8 Qtl discrepancy, approx ₹3,690 difference). Requesting administrative reconciliation or pro-rata escrow deduction.',
      evidenceUrls: JSON.stringify([
        'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
      ]),
      status: 'OPEN',
      resolutionNotes: null
    }
  });

  await prisma.dispute.create({
    data: {
      id: 'disp_2_resolved',
      transactionId: deal5.id,
      raisedById: 'u_fpo_vidarbha',
      reasonCategory: 'PAYMENT_DELAY',
      description: 'Delay of 14 hours in bank release acknowledgment post quality sign-off.',
      evidenceUrls: '[]',
      status: 'RESOLVED',
      resolutionNotes: 'Bank clearing gateway technical lag resolved. Escrow cleared in full with priority fast-track.',
      resolvedById: 'u_admin_msis',
      resolvedAt: new Date(Date.now() - 2 * 86400000)
    }
  });

  // 14. Notifications
  console.log('🔔 Seeding in-app notifications across roles...');
  await prisma.notification.createMany({
    data: [
      {
        userId: 'u_farmer_ramesh',
        title: 'New Offer Received on Onion Lot #MH-NSK-2026-0812',
        message: 'ITC Agri Business has sent an offer of ₹2,620/qtl for 150 quintals. Check your deals tab.',
        link: '/farmer/deals/deal_1_offer_accepted',
        type: 'OFFER'
      },
      {
        userId: 'u_farmer_ramesh',
        title: 'Deal #DEAL-MH-2026-4402 Dispatched',
        message: 'Your Soybean lot is now IN TRANSIT with Jai Maharashtra Agro Transport. Driver: Santosh Shinde (+91-9823114455).',
        link: '/farmer/deals/deal_2_in_transit',
        type: 'DEAL_STAGE'
      },
      {
        userId: 'u_fpo_sahyadri',
        title: 'Escrow Funded for Deal #DEAL-MH-2026-4401',
        message: 'ITC Agri has deposited ₹3,93,000 into secure Escrow for your pooled Onion lot.',
        link: '/fpo/payouts',
        type: 'PAYMENT'
      },
      {
        userId: 'u_buyer_itc',
        title: 'New Aggregated Lot Matched: Sahyadri FPO Onion',
        message: 'Sahyadri FPO listed 300 Quintals of Grade A Onion matching your open demand listing.',
        link: '/buyer/browse-lots',
        type: 'OFFER'
      },
      {
        userId: 'u_admin_msis',
        title: 'Action Required: Open Dispute on Deal #DEAL-MH-2026-4403',
        message: 'Reliance Retail raised a weight discrepancy dispute against Baburao Shinde. Review evidence.',
        link: '/admin/disputes',
        type: 'DISPUTE'
      },
      {
        userId: 'u_admin_msis',
        title: 'New Buyer KYC Verification Pending',
        message: 'KrushiVikas Commodity Traders (GSTIN: 27ABFFM8912M1ZP) has applied for APMC trading verification.',
        link: '/admin/kyc',
        type: 'PRICE_ALERT'
      }
    ]
  });

  console.log('🎉 Database seeding complete! AgriConnect Maharashtra is now 100% demo-ready.');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
