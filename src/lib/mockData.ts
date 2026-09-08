// Comprehensive In-Memory Demo Samples & Fallback Dataset
// Ensures instant, zero-failure presentation on Vercel and offline demos

export interface MockCommodity {
  id: string;
  nameEn: string;
  nameMr: string;
  category: string;
  mspPrice: number;
  typicalMoistureStandard: number;
  gradeSpecs: string;
  imageUrl: string;
}

export interface MockMarket {
  id: string;
  nameEn: string;
  nameMr: string;
  district: string;
  isMajorHub: boolean;
  contactPhone: string;
}

export const MOCK_COMMODITIES: MockCommodity[] = [
  {
    id: "c_onion",
    nameEn: "Onion (Red Nashik)",
    nameMr: "कांदा (नाशिक लाल)",
    category: "Vegetables",
    mspPrice: 1950,
    typicalMoistureStandard: 11.5,
    gradeSpecs: "Grade A (50-70mm uniform, dry neck, <12% moisture), Grade B (40-50mm), Grade C (under 40mm processing)",
    imageUrl: "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_tomato",
    nameEn: "Tomato (Hybrid Vaishali)",
    nameMr: "टोमॅटो (वैशाली हायब्रिड)",
    category: "Vegetables",
    mspPrice: 1350,
    typicalMoistureStandard: 14.0,
    gradeSpecs: "Grade A (Firm, deep red, no blemishes, export standard), Grade B (firm breaker stage), Grade C (pulp/ketchup)",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_soybean",
    nameEn: "Soybean (Yellow JS-335)",
    nameMr: "सोयाबीन (पिवळा JS-335)",
    category: "Oilseeds",
    mspPrice: 4892,
    typicalMoistureStandard: 10.0,
    gradeSpecs: "Grade A (Oil >19%, moisture <10%, foreign matter <1%), Grade B (moisture 10-12%), Grade C (cracked/high moisture)",
    imageUrl: "https://images.unsplash.com/photo-1599940824399-b87987ceb72a?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_cotton",
    nameEn: "Cotton (Bt Long Staple)",
    nameMr: "कापूस (लांब धागा)",
    category: "Cash Crop",
    mspPrice: 7121,
    typicalMoistureStandard: 8.5,
    gradeSpecs: "Grade A (Staple >29mm, Micronaire 3.8-4.2, moisture <8.5%), Grade B (Staple 27-28mm), Grade C (short staple)",
    imageUrl: "https://images.unsplash.com/photo-1594897030560-6979679f2430?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_turdal",
    nameEn: "Tur Dal (Pigeon Pea Red)",
    nameMr: "तूर डाळ (लाल तूर)",
    category: "Pulses",
    mspPrice: 7550,
    typicalMoistureStandard: 11.0,
    gradeSpecs: "Grade A (Bold grain, moisture <11%, unblemished), Grade B (standard milling grade), Grade C (small grain)",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_wheat",
    nameEn: "Wheat (Sharbati Lokwan)",
    nameMr: "गहू (शरबती लोकवान)",
    category: "Cereals",
    mspPrice: 2275,
    typicalMoistureStandard: 12.0,
    gradeSpecs: "Grade A (Golden luster, high gluten, <11% moisture), Grade B (standard milling), Grade C (feed)",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_grapes",
    nameEn: "Grapes (Thompson Seedless)",
    nameMr: "द्राक्षे (थॉमसन सीडलेस)",
    category: "Fruits",
    mspPrice: 5500,
    typicalMoistureStandard: 16.0,
    gradeSpecs: "Grade A (Brix >18, berry size >16mm, export grade), Grade B (Brix 16-18), Grade C (raisin/domestic)",
    imageUrl: "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80"
  },
  {
    id: "c_orange",
    nameEn: "Orange (Nagpur Mandarin)",
    nameMr: "संत्री (नागपूर संत्रा)",
    category: "Fruits",
    mspPrice: 2800,
    typicalMoistureStandard: 18.0,
    gradeSpecs: "Grade A (Uniform orange, thin peel, juicy >45%), Grade B (medium grade), Grade C (juice processing)",
    imageUrl: "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop&q=80"
  }
];

export const MOCK_MARKETS: MockMarket[] = [
  {
    id: "m_lasalgaon",
    nameEn: "Lasalgaon APMC (Asia's Largest Onion Market)",
    nameMr: "लासलगाव कृषी उत्पन्न बाजार समिती",
    district: "Nashik",
    isMajorHub: true,
    contactPhone: "+91-2550-266224"
  },
  {
    id: "m_pune",
    nameEn: "Pune Market Yard (Gultekdi)",
    nameMr: "पुणे कृषी उत्पन्न बाजार समिती (गुलटेकडी)",
    district: "Pune",
    isMajorHub: true,
    contactPhone: "+91-20-24262841"
  },
  {
    id: "m_nashik",
    nameEn: "Nashik APMC (Panchavati)",
    nameMr: "नाशिक कृषी उत्पन्न बाजार समिती (पंचवटी)",
    district: "Nashik",
    isMajorHub: true,
    contactPhone: "+91-253-2512301"
  },
  {
    id: "m_nagpur",
    nameEn: "Nagpur APMC (Kalamna)",
    nameMr: "नागपूर कृषी उत्पन्न बाजार समिती (कळमना)",
    district: "Nagpur",
    isMajorHub: true,
    contactPhone: "+91-712-2680124"
  },
  {
    id: "m_aurangabad",
    nameEn: "Chhatrapati Sambhaji Nagar APMC (Jadhavwadi)",
    nameMr: "छत्रपती संभाजीनगर बाजार समिती (जाधववाडी)",
    district: "Chhatrapati Sambhaji Nagar",
    isMajorHub: true,
    contactPhone: "+91-240-2381204"
  },
  {
    id: "m_kolhapur",
    nameEn: "Kolhapur APMC (Shahu Market Yard)",
    nameMr: "कोल्हापूर शाहू छत्रपती बाजार समिती",
    district: "Kolhapur",
    isMajorHub: true,
    contactPhone: "+91-231-2651402"
  }
];

// Helper to generate 35 days of deterministic price series
export function generateMockPriceHistory(commodityId: string, marketId: string, days: number = 30) {
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

  const base = basePrices[commodityId]?.[marketId] || 2500;
  const today = new Date();
  const records = [];

  for (let i = days; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    let trendFactor = 0;
    if (commodityId === 'c_onion' && marketId === 'm_lasalgaon') {
      trendFactor = i <= 7 ? (7 - i) * 42 : Math.sin(i * 0.3) * 30;
    } else if (commodityId === 'c_tomato') {
      trendFactor = Math.sin(i * 0.8) * 140;
    } else if (commodityId === 'c_soybean') {
      trendFactor = (days - i) * 8 + Math.cos(i) * 25;
    } else {
      trendFactor = Math.sin(i * 0.4) * 45;
    }

    const modal = Math.round(base + trendFactor);
    const min = Math.round(modal * 0.91);
    const max = Math.round(modal * 1.09);
    const arrivals = Math.round(1800 + Math.sin(i * 0.5) * 600);

    records.push({
      id: `rec_${commodityId}_${marketId}_${i}`,
      commodityId,
      marketId,
      date: d.toISOString(),
      minPrice: min,
      maxPrice: max,
      modalPrice: modal,
      arrivalVolume: arrivals,
    });
  }

  return records;
}

export const MOCK_LOTS = [
  {
    id: "lot_ramesh_onion",
    lotNumber: "MH-NSK-2026-0812",
    ownerType: "FARMER",
    creatorId: "u_farmer_ramesh",
    commodityId: "c_onion",
    marketId: "m_lasalgaon",
    quantityQuintals: 75.0,
    basePriceExpected: 2550.0,
    moisturePercent: 11.2,
    visualGrade: "A",
    status: "AVAILABLE",
    digitalPassportHash: "a4f891b2c3d4e5f67890123456789abcdef0123456789abcdef0123456789abcd",
    qrCodeData: "https://agriconnect-maharashtra.vercel.app/farmer/lots/lot_ramesh_onion/passport",
    photoUrls: JSON.stringify([
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80"
    ]),
    storageLocation: "Farm Gate, Niphad, Nashik",
    isAggregated: false,
    commodity: MOCK_COMMODITIES[0],
    market: MOCK_MARKETS[0],
    creator: {
      name: "Ramesh Patil",
      phone: "9822012345",
      district: "Nashik",
      farmerProfile: {
        village: "Niphad",
        taluka: "Niphad",
        landHoldingAcres: 4.5,
        bankVerified: true
      }
    },
    harvestDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString()
  },
  {
    id: "lot_ramesh_grapes",
    lotNumber: "MH-NSK-2026-0813",
    ownerType: "FARMER",
    creatorId: "u_farmer_ramesh",
    commodityId: "c_grapes",
    marketId: "m_nashik",
    quantityQuintals: 40.0,
    basePriceExpected: 7200.0,
    moisturePercent: 15.5,
    visualGrade: "A",
    status: "UNDER_OFFER",
    digitalPassportHash: "b8e192c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2",
    qrCodeData: "https://agriconnect-maharashtra.vercel.app/farmer/lots/lot_ramesh_grapes/passport",
    photoUrls: JSON.stringify([
      "https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=600&auto=format&fit=crop&q=80"
    ]),
    storageLocation: "Cold Room, Niphad, Nashik",
    isAggregated: false,
    commodity: MOCK_COMMODITIES[6],
    market: MOCK_MARKETS[2],
    creator: {
      name: "Ramesh Patil",
      phone: "9822012345",
      district: "Nashik",
      farmerProfile: {
        village: "Niphad",
        taluka: "Niphad",
        landHoldingAcres: 4.5,
        bankVerified: true
      }
    },
    harvestDate: new Date(Date.now() - 86400000 * 4).toISOString(),
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "fpo_agg_lot_1",
    lotNumber: "FPO-SYD-2026-0401",
    ownerType: "FPO",
    creatorId: "u_fpo_sahyadri",
    commodityId: "c_onion",
    marketId: "m_lasalgaon",
    quantityQuintals: 150.0,
    basePriceExpected: 2620.0,
    moisturePercent: 11.3,
    visualGrade: "A",
    status: "SOLD",
    digitalPassportHash: "c9f203d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3",
    qrCodeData: "https://agriconnect-maharashtra.vercel.app/farmer/lots/fpo_agg_lot_1/passport",
    photoUrls: JSON.stringify([
      "https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80"
    ]),
    storageLocation: "Sahyadri Central Aggregation Hub, Mohadi, Nashik",
    isAggregated: true,
    commodity: MOCK_COMMODITIES[0],
    market: MOCK_MARKETS[0],
    creator: {
      name: "Prakash Deshmukh (Sahyadri FPO Admin)",
      phone: "9822022222",
      district: "Nashik",
      fpoProfile: {
        fpoName: "Sahyadri Farmers Producer Co. Ltd.",
        registrationNumber: "U01403MH2011PTC212345",
        memberCount: 480
      }
    },
    contributions: [
      { id: "c1", farmer: { name: "Ramesh Patil" }, farmerName: "Ramesh Patil", contributedWeight: 45.0, quantityQuintals: 45.0, moisturePercent: 11.2, visualGrade: "A", sharePercentage: 30.0, sharePercent: 30.0 },
      { id: "c2", farmer: { name: "Suresh Jadhav" }, farmerName: "Suresh Jadhav", contributedWeight: 40.0, quantityQuintals: 40.0, moisturePercent: 11.4, visualGrade: "A", sharePercentage: 26.67, sharePercent: 26.67 },
      { id: "c3", farmer: { name: "Kavita Shinde" }, farmerName: "Kavita Shinde", contributedWeight: 35.0, quantityQuintals: 35.0, moisturePercent: 11.1, visualGrade: "A", sharePercentage: 23.33, sharePercent: 23.33 },
      { id: "c4", farmer: { name: "Dattatray More" }, farmerName: "Dattatray More", contributedWeight: 30.0, quantityQuintals: 30.0, moisturePercent: 11.5, visualGrade: "A", sharePercentage: 20.0, sharePercent: 20.0 }
    ],
    harvestDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    createdAt: new Date(Date.now() - 172800000).toISOString()
  }
];

export const MOCK_DEMANDS = [
  {
    id: "dem_1_itc",
    buyerId: "u_buyer_itc",
    commodityId: "c_onion",
    marketId: "m_lasalgaon",
    requiredQuantity: 500.0,
    maxPriceOffer: 2650.0,
    targetDeliveryDate: new Date(Date.now() + 604800000).toISOString(),
    expiryDate: new Date(Date.now() + 604800000).toISOString(),
    qualitySpecs: "Nashik Red Onion, Grade A, 50-70mm uniform diameter, moisture <11.5%, dry outer skin",
    deliveryLocation: "ITC Agri Food Processing Center, Pimpalgaon, Nashik",
    status: "ACTIVE",
    buyer: {
      name: "Vikram Singhania",
      buyerProfile: {
        companyName: "ITC Agri Business Division",
        businessType: "Processor & Exporter",
        reliabilityScore: 4.9,
        paymentTerms: "100% Escrow T+1 upon quality confirmation"
      }
    },
    commodity: MOCK_COMMODITIES[0],
    market: MOCK_MARKETS[0],
    offersCount: 3,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "dem_2_reliance",
    buyerId: "u_buyer_reliance",
    commodityId: "c_tomato",
    marketId: "m_pune",
    requiredQuantity: 250.0,
    maxPriceOffer: 2150.0,
    targetDeliveryDate: new Date(Date.now() + 345600000).toISOString(),
    expiryDate: new Date(Date.now() + 345600000).toISOString(),
    qualitySpecs: "Hybrid Vaishali Tomato, Grade A, firm breaker-to-red stage, crates required",
    deliveryLocation: "Reliance Fresh DC, Chakan Midc, Pune",
    status: "ACTIVE",
    buyer: {
      name: "Rajesh Nair",
      buyerProfile: {
        companyName: "Reliance Retail Fresh Sourcing",
        businessType: "Institutional Retailer",
        reliabilityScore: 4.8,
        paymentTerms: "Direct Escrow release T+3"
      }
    },
    commodity: MOCK_COMMODITIES[1],
    market: MOCK_MARKETS[1],
    offersCount: 2,
    createdAt: new Date(Date.now() - 172800000).toISOString()
  },
  {
    id: "dem_3_godrej",
    buyerId: "u_buyer_godrej",
    commodityId: "c_soybean",
    marketId: "m_nagpur",
    requiredQuantity: 400.0,
    maxPriceOffer: 5120.0,
    targetDeliveryDate: new Date(Date.now() + 864000000).toISOString(),
    expiryDate: new Date(Date.now() + 864000000).toISOString(),
    qualitySpecs: "Yellow JS-335, Oil content >19%, moisture <10%, foreign matter <1%",
    deliveryLocation: "Godrej Solvent Extraction Hub, Butibori, Nagpur",
    status: "ACTIVE",
    buyer: {
      name: "Sameer Kulkarni",
      buyerProfile: {
        companyName: "Godrej Agrovet Procurement",
        businessType: "Processor",
        reliabilityScore: 4.9,
        paymentTerms: "Escrow T+2 after oil & moisture test"
      }
    },
    commodity: MOCK_COMMODITIES[2],
    market: MOCK_MARKETS[3],
    offersCount: 4,
    createdAt: new Date(Date.now() - 259200000).toISOString()
  }
];

export const MOCK_DEALS = [
  {
    id: "deal_1_offer_accepted",
    dealNumber: "DEAL-MH-2026-4401",
    buyerId: "u_buyer_itc",
    sellerId: "u_fpo_sahyadri",
    lotId: "fpo_agg_lot_1",
    commodityId: "c_onion",
    agreedPrice: 2620.0,
    agreedQuantity: 150.0,
    totalAmount: 393000.0,
    escrowStatus: "HELD",
    stage: "OFFER_ACCEPTED",
    deliveryLocation: "ITC Processing Hub, Pimpalgaon, Nashik",
    qualityInspectorNote: "Awaiting dispatch and logistics schedule.",
    commodity: MOCK_COMMODITIES[0],
    lot: MOCK_LOTS[2],
    buyer: {
      name: "Vikram Singhania",
      buyerProfile: {
        companyName: "ITC Agri Business Division",
        reliabilityScore: 4.9
      }
    },
    seller: {
      name: "Sahyadri Farmers Producer Co. Ltd.",
      phone: "9822022222"
    },
    createdAt: new Date(Date.now() - 43200000).toISOString()
  },
  {
    id: "deal_2_in_transit",
    dealNumber: "DEAL-MH-2026-4402",
    buyerId: "u_buyer_godrej",
    sellerId: "u_farmer_ramesh",
    lotId: "lot_ramesh_onion",
    commodityId: "c_onion",
    agreedPrice: 2550.0,
    agreedQuantity: 70.0,
    totalAmount: 178500.0,
    escrowStatus: "HELD",
    stage: "IN_TRANSIT",
    deliveryLocation: "Godrej Agrovet Logistics Yard, Butibori, Nagpur",
    qualityInspectorNote: "Dispatched in Eicher Pro 2049. Driver contact: +91-9823114455. Expected arrival 18:00 hrs.",
    commodity: MOCK_COMMODITIES[0],
    lot: MOCK_LOTS[0],
    buyer: {
      name: "Sameer Kulkarni",
      buyerProfile: {
        companyName: "Godrej Agrovet Procurement",
        reliabilityScore: 4.9
      }
    },
    seller: {
      name: "Ramesh Patil",
      phone: "9822012345"
    },
    booking: {
      transportProvider: {
        companyName: "Jai Maharashtra Logistics",
        vehicleType: "Eicher Pro 2049 (4 MT)",
        contactName: "Sunil Pawar",
        phone: "+91-9823114455"
      }
    },
    createdAt: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: "deal_3_completed",
    dealNumber: "DEAL-MH-2026-4405",
    buyerId: "u_buyer_reliance",
    sellerId: "u_fpo_sahyadri",
    lotId: "fpo_agg_lot_1",
    commodityId: "c_onion",
    agreedPrice: 2600.0,
    agreedQuantity: 450.0,
    totalAmount: 1170000.0,
    escrowStatus: "RELEASED",
    stage: "COMPLETED",
    deliveryLocation: "Reliance Fresh DC, Chakan, Pune",
    qualityInspectorNote: "Official assay grade verified (Moisture 11.2%, Size 62mm). Escrow released to Sahyadri FPO account.",
    commodity: MOCK_COMMODITIES[0],
    lot: MOCK_LOTS[2],
    buyer: {
      name: "Rajesh Nair",
      buyerProfile: {
        companyName: "Reliance Retail Fresh Sourcing",
        reliabilityScore: 4.8
      }
    },
    seller: {
      name: "Sahyadri Farmers Producer Co. Ltd.",
      phone: "9822022222"
    },
    createdAt: new Date(Date.now() - 432000000).toISOString()
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: "notif_1",
    userId: "u_farmer_ramesh",
    titleEn: "Sell Advisory Alert: Onion Surge",
    titleMr: "विक्री सल्ला अलर्ट: कांदा भाव वाढ",
    messageEn: "Lasalgaon onion rates are up +11.8% this week. Strong recommendation to HOLD for 3 days or dispatch to Pune Market Yard for +₹170/qtl extra realization.",
    messageMr: "लासलगावमध्ये कांद्याचे भाव चालू आठवड्यात ११.८% ने वाढले आहेत. पुढील ३ दिवस माल राखून ठेवण्याचा किंवा पुण्यात पाठवण्याचा सल्ला आहे.",
    type: "PRICE_ALERT",
    isRead: false,
    createdAt: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "notif_2",
    userId: "u_farmer_ramesh",
    titleEn: "New Buyer Offer Received",
    titleMr: "नवीन खरेदीदार ऑफर प्राप्त झाली",
    messageEn: "Godrej Agrovet placed a formal digital offer of ₹5,080/qtl for your 70 Qtl Soybean lot. Escrow is 100% funded.",
    messageMr: "गोदरेज अ‍ॅग्रोव्हेटने तुमच्या ७० क्विंटल सोयाबीनसाठी ₹५,०८०/क्विंटल दराने ऑफर दिली आहे. एस्क्रो रक्कम जमा आहे.",
    type: "OFFER_RECEIVED",
    isRead: false,
    createdAt: new Date(Date.now() - 14400000).toISOString()
  },
  {
    id: "notif_3",
    userId: "u_farmer_ramesh",
    titleEn: "Deal #DEAL-MH-2026-4402 Dispatched",
    titleMr: "व्यवहार #DEAL-MH-2026-4402 रवाना झाला",
    messageEn: "Truck Eicher Pro 2049 has departed from your farm gate. Live tracking active towards Nagpur depot.",
    messageMr: "आयशर प्रो २०४९ ट्रक शेतावरून रवाना झाला आहे. नागपूर केंद्राकडे थेट ट्रॅकिंग सुरू आहे.",
    type: "DEAL_UPDATE",
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const MOCK_DISPUTES = [
  {
    id: "disp_1_moisture",
    disputeNumber: "DISP-MH-2026-001",
    transactionId: "deal_2_in_transit",
    raisedById: "u_buyer_godrej",
    category: "QUALITY_MISMATCH",
    description: "Buyer lab inspection reported 13.8% moisture on delivery vs 11.2% specified on digital lot passport certificate.",
    evidenceUrls: JSON.stringify([
      "https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=600&auto=format&fit=crop&q=80"
    ]),
    status: "UNDER_REVIEW",
    arbitratorNotes: "MSIS Quality Officer visiting warehouse for joint assay sampling. Escrow ₹1,78,500 held in state security vault.",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export const MOCK_ADMIN_METRICS = {
  totalTradesCount: 148,
  totalGmvAmount: 24850000,
  averageUpliftPercent: 14.8,
  activeFarmersCount: 1240,
  registeredFposCount: 42,
  verifiedBuyersCount: 68,
  pendingKycCount: 3,
  openDisputesCount: 1
};

export const MOCK_TRANSPORTERS = [
  {
    id: "tp_1",
    companyName: "Jai Maharashtra Logistics",
    contactName: "Sunil Pawar",
    phone: "+91-9823114455",
    vehicleType: "Eicher Pro 2049 (4 MT)",
    capacityMT: 4.0,
    ratePerKm: 24.0,
    baseDistrict: "Nashik",
    rating: 4.9,
    isAvailable: true
  },
  {
    id: "tp_2",
    companyName: "Sahyadri Agro Transporters",
    contactName: "Ganesh Shinde",
    phone: "+91-9823225566",
    vehicleType: "Tata 407 LPT (2.5 MT)",
    capacityMT: 2.5,
    ratePerKm: 20.0,
    baseDistrict: "Nashik",
    rating: 4.8,
    isAvailable: true
  },
  {
    id: "tp_3",
    companyName: "Pune Kisan Freight Carriers",
    contactName: "Mahesh Jagtap",
    phone: "+91-9823336677",
    vehicleType: "Ashok Leyland Dost+ (1.5 MT)",
    capacityMT: 1.5,
    ratePerKm: 16.0,
    baseDistrict: "Pune",
    rating: 4.7,
    isAvailable: true
  },
  {
    id: "tp_4",
    companyName: "Vidarbha Super Express",
    contactName: "Vijay Deshmukh",
    phone: "+91-9823447788",
    vehicleType: "BharatBenz 1217R (8 MT)",
    capacityMT: 8.0,
    ratePerKm: 38.0,
    baseDistrict: "Nagpur",
    rating: 4.9,
    isAvailable: true
  }
];

export const MOCK_STORAGES = [
  {
    id: "sf_1",
    name: "MSWC Central Warehouse Lasalgaon",
    facilityType: "MSWC_WAREHOUSE",
    district: "Nashik",
    location: "Near APMC Yard, Lasalgaon",
    totalCapacityMT: 6000.0,
    availableCapacityMT: 2450.0,
    monthlyRatePerQuintal: 18.0,
    humidityControlled: false,
    contactPhone: "+91-2550-266180"
  },
  {
    id: "sf_2",
    name: "Sahyadri Controlled Atmosphere Cold Store",
    facilityType: "COLD_STORAGE",
    district: "Nashik",
    location: "Mohadi Post-Harvest Complex, Nashik",
    totalCapacityMT: 3500.0,
    availableCapacityMT: 1100.0,
    monthlyRatePerQuintal: 48.0,
    humidityControlled: true,
    contactPhone: "+91-253-2970110"
  },
  {
    id: "sf_3",
    name: "Gultekdi State Warehousing Complex",
    facilityType: "MSWC_WAREHOUSE",
    district: "Pune",
    location: "Gate 4, Market Yard, Gultekdi, Pune",
    totalCapacityMT: 8000.0,
    availableCapacityMT: 3200.0,
    monthlyRatePerQuintal: 22.0,
    humidityControlled: false,
    contactPhone: "+91-20-24269910"
  }
];
