# AgriConnect Maharashtra (कृषी जोड महाराष्ट्र)

**Market Intelligence, FPO Lot Aggregation & Guaranteed Escrow Transaction Platform for Maharashtra Agriculture**

Built for the **Government of Maharashtra** problem statement on agricultural price discovery, verified market linkages, and transparent trade settlement. AgriConnect Maharashtra serves smallholders, Farmer Producer Organizations (FPOs), verified institutional buyers, and Maharashtra State Innovation Society (MSIS) regulators under a single, cohesive platform.

[![Vercel Deployment](https://img.shields.io/badge/Vercel-Live%20Deployment-black?logo=vercel&style=for-the-badge)](https://agriconnect-maharashtra.vercel.app)
[![GitHub Repository](https://img.shields.io/badge/GitHub-abdul--halik--ai%2Fagriconnect--maharashtra-181717?logo=github&style=for-the-badge)](https://github.com/abdul-halik-ai/agriconnect-maharashtra)

🌐 **Live URL:** [https://agriconnect-maharashtra.vercel.app](https://agriconnect-maharashtra.vercel.app)

---

## 🌾 Key Product Capabilities

1. **APMC Price Intelligence & Sell/Hold Advisory**
   - Live & historical 30/60/90 day price trends across 6 key Maharashtra mandis: Lasalgaon, Pune, Nashik, Nagpur, Chhatrapati Sambhaji Nagar, and Kolhapur.
   - Plain-language Sell/Hold recommendation engine based on 7-day vs 14-day exponential moving average and market arrival volume slopes (e.g., *"Onion prices in Lasalgaon are up 11.8% this week, might be worth waiting 3 days"*).
   - Nearby Market Arbitrage Matrix: compares neighboring mandis, computes freight costs, and highlights whether an extra trip pays off.

2. **Digital Agricultural Lot Passport with QR Verification**
   - Every lot receives a tamper-proof cryptographic SHA-256 integrity hash and verifiable SVG QR code.
   - Captures moisture content %, visual grade (A/B/C), net quintals, storage location, and harvest provenance.
   - Printable state-grade certificate format with official government watermark seal.

3. **FPO Lot Aggregation & Transparent Farmer Payout Ledger**
   - FPO admins aggregate small farmers' individual contributions of the same crop and grade into institutional-grade bulk lots.
   - Calculates weighted average moisture and records the exact share percentage of each contributing farmer.
   - Automatically computes and distributes proportional escrow disbursements upon deal closure.

4. **Guaranteed 7-Step Deal Lifecycle Pipeline**
   - Both parties follow a visual progress stepper:
     1. `OFFER_ACCEPTED` (Escrow funded)
     2. `LOGISTICS_SCHEDULED` (Vehicle assigned)
     3. `IN_TRANSIT` (Driver details & dispatch live)
     4. `DELIVERED` (Weighment scale slip uploaded)
     5. `QUALITY_CONFIRMED` (Moisture & Grade match passport)
     6. `PAYMENT_RELEASED` (Escrow released to registered bank A/C)
     7. `COMPLETED` (Official transaction receipt)

5. **Logistics & Warehousing Matching**
   - One-click transport booking with seeded Maharashtra carriers (Eicher Pro, Tata 407, Ashok Leyland).
   - Nearby MSWC cold storage facilities with per-quintal monthly tariffs for farmers choosing to hold produce.

6. **State Regulatory Administration (MSIS Oversight)**
   - Macro analytics: Total Gross Trade Value (GMV), Farmer price realization uplift vs mandi modal baseline, active stakeholder counts.
   - Buyer KYC accreditation queue with trade license and GSTIN inspection.
   - Dispute arbitration workbench with weighbridge audit trail and unilateral escrow resolution authority.

---

## 🚀 Quick Start (Local Development)

The application is pre-configured with **SQLite** for zero-dependency local execution (`dev.db`). No external database server installation is required.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure `DATABASE_URL="file:./dev.db"` is set.

### 3. Generate Database & Seed Mock Data
```bash
npx prisma db push
npx tsx prisma/seed.ts
```
*The seed script populates 8 commodities, 6 APMC mandis, 1,728 historical price records over 35 days, 16 farmers, 5 FPOs, 10 verified buyers, 8 transport providers, 6 cold storages, active deals across all 7 pipeline stages, and disputes.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎭 Interactive Demo Role Switcher

Use the **Demo Role Switcher** dropdown in the top navbar to instantly test all 4 personas without manual re-login:

| Persona | Name | Role | Test Features |
| :--- | :--- | :--- | :--- |
| **Farmer** | Ramesh Patil | `FARMER` | Sell/Hold advisory, Lot Passport generation, Deal tracker |
| **FPO Admin** | Prakash Deshmukh | `FPO` | Aggregate member produce, manage pooled lots, payout split ledger |
| **Buyer** | Vikram Singhania | `BUYER` | Post procurement demands, browse lots, make offers, confirm quality |
| **State Admin** | Sunita Kulkarni | `ADMIN` | Platform analytics, Buyer KYC verification, Dispute arbitration |

---

## 🧪 Featured Demo Samples & Live Walkthrough Scenarios

Every feature is seeded with realistic Maharashtra agricultural data. Click any of the scenarios below to evaluate the system live:

### 1. 🌾 Mandi Price Intelligence & Sell/Hold Advisory
- **Live URL:** [https://agriconnect-maharashtra.vercel.app/farmer/prices](https://agriconnect-maharashtra.vercel.app/farmer/prices)
- **What to explore:**
  - Select **Onion (Red Nashik)** in **Lasalgaon APMC**.
  - Review the **Sell/Hold Heuristic Banner**: analyzes 35-day moving averages and market arrivals (shows the intentional **+11.8%** weekly surge and advises farmers to hold for 3 days).
  - Inspect the **Nearby Market Arbitrage Matrix**: compares Lasalgaon prices with Pune, Nashik, and Chhatrapati Sambhaji Nagar, factoring in distance and freight rates (e.g., selling in Pune yields +₹170/qtl net gain).
  - Toggle between English and Marathi (**मराठी**) with the language button.

### 2. 📜 Tamper-Proof Digital Lot Passport (QR Certificate)
- **Sample Lot 1 (Farmer Gate):** [View Lot #MH-NSK-2026-0812 Passport](https://agriconnect-maharashtra.vercel.app/farmer/lots/lot_ramesh_onion/passport)
  - **Commodity:** Red Onion • **Grade:** Grade A (50-70mm uniform) • **Moisture:** 11.2%
  - **Integrity Hash:** Cryptographic SHA-256 state seal (`a4f891b2c3d...`)
  - **Verification:** Scan or click the embedded SVG QR code to verify on-chain certificate authenticity.
- **Sample Lot 2 (FPO Pooled Bulk):** [View Lot #FPO-SYD-2026-0401 Passport](https://agriconnect-maharashtra.vercel.app/farmer/lots/fpo_agg_lot_1/passport)
  - Aggregated bulk lot of 150 Qtl pooled from 4 smallholders with weighted moisture validation.

### 3. 🏢 FPO Produce Pooling & Member Payout Split Ledger
- **Live Pooling Tool:** [https://agriconnect-maharashtra.vercel.app/fpo/lots/aggregate](https://agriconnect-maharashtra.vercel.app/fpo/lots/aggregate)
- **Live Member Payout Ledger:** [https://agriconnect-maharashtra.vercel.app/fpo/payouts](https://agriconnect-maharashtra.vercel.app/fpo/payouts)
- **Sample Scenario:**
  - Sahyadri FPO pooled 150 Qtl of Grade A Onion from 4 smallholder farmers:
    - **Ramesh Patil:** 45 Qtl (30.00% share → **₹1,17,900**)
    - **Suresh Jadhav:** 40 Qtl (26.67% share → **₹1,04,800**)
    - **Kavita Shinde:** 35 Qtl (23.33% share → **₹91,700**)
    - **Dattatray More:** 30 Qtl (20.00% share → **₹78,600**)
  - Total Contract Value: **₹3,93,000**. When the deal closes, each farmer's bank account receives their exact fractional payout automatically.

### 4. 💼 Institutional Buyer Demand Board
- **Live Board:** [https://agriconnect-maharashtra.vercel.app/buyer/demand](https://agriconnect-maharashtra.vercel.app/buyer/demand)
- **Sample Demand Listings:**
  - **ITC Agri Business Division:** 500 Qtl Red Onion @ max ₹2,650/qtl (Delivery to Pimpalgaon processing unit).
  - **Reliance Retail Fresh Sourcing:** 250 Qtl Hybrid Tomato @ max ₹2,150/qtl (Delivery to Chakan DC).
  - **Godrej Agrovet Procurement:** 400 Qtl Soybean JS-335 @ max ₹5,120/qtl (Delivery to Butibori plant).
- **Interactive Action:** Switch role to **Buyer** and click **Post New Procurement Demand** or submit an offer on an existing lot.

### 5. 🤝 Guaranteed 7-Step Deal Lifecycle & Live Logistics
- **Live Deals Tracker:** [https://agriconnect-maharashtra.vercel.app/farmer/deals](https://agriconnect-maharashtra.vercel.app/farmer/deals)
- **Sample Pipeline Deals:**
  - **Deal #DEAL-MH-2026-4401** (`OFFER_ACCEPTED`): ₹3,93,000 escrow locked in state vault.
  - **Deal #DEAL-MH-2026-4402** (`IN_TRANSIT`): Dispatched in Eicher Pro 2049 (Jai Maharashtra Logistics, Driver Sunil Pawar: `+91-9823114455`).
  - **Deal #DEAL-MH-2026-4405** (`COMPLETED`): 450 Qtl Onion delivered to Reliance Fresh; ₹11,70,000 escrow released to Sahyadri FPO account.

### 6. 🏛️ State Oversight, KYC & Dispute Arbitration (MSIS / MSAMB)
- **State Analytics Dashboard:** [https://agriconnect-maharashtra.vercel.app/admin/dashboard](https://agriconnect-maharashtra.vercel.app/admin/dashboard)
  - Displays Total GMV (₹2.48 Cr+), Average Farmer Price Uplift (**+14.8%**), and active stakeholder counts.
- **Buyer KYC Queue:** [https://agriconnect-maharashtra.vercel.app/admin/kyc](https://agriconnect-maharashtra.vercel.app/admin/kyc)
  - Review and approve **KrushiVikas Commodity Traders** (License `APMC/NSK/B-1940`, GSTIN `27ABFFM8912M1ZP`).
- **Dispute Resolution Workbench:** [https://agriconnect-maharashtra.vercel.app/admin/disputes](https://agriconnect-maharashtra.vercel.app/admin/disputes)
  - Arbitrate **Dispute #DISP-MH-2026-001**: Buyer flagged 13.8% moisture on delivery vs 11.2% in digital passport. The state arbitrator can review weighbridge slips and unilaterally resolve funds (`Release to Farmer`, `Refund Buyer`, or `Split 50/50`).

---

## 📊 Seeded Baseline Datasets

### Seed Commodities (8 Crops)
| Crop | Marathi Name | Standard MSP | Typical Moisture | Export / Quality Benchmark |
|---|---|---|---|---|
| **Onion (Red Nashik)** | कांदा (नाशिक लाल) | ₹1,950 / qtl | 11.5% | Grade A: 50-70mm, dry neck |
| **Soybean (JS-335)** | सोयाबीन (पिवळा) | ₹4,892 / qtl | 10.0% | Grade A: Oil >19%, moisture <10% |
| **Cotton (Bt Long Staple)** | कापूस (लांब धागा) | ₹7,121 / qtl | 8.5% | Grade A: Staple >29mm, Micronaire 3.8-4.2 |
| **Tur Dal (Pigeon Pea)** | तूर डाळ (लाल तूर) | ₹7,550 / qtl | 11.0% | Grade A: Bold milling grain |
| **Tomato (Hybrid Vaishali)**| टोमॅटो (वैशाली) | ₹1,350 / qtl | 14.0% | Grade A: Firm breaker-to-red export |
| **Wheat (Sharbati Lokwan)** | गहू (शरबती लोकवान) | ₹2,275 / qtl | 12.0% | Grade A: Golden luster, high gluten |
| **Grapes (Thompson)** | द्राक्षे (थॉमसन) | ₹5,500 / qtl | 16.0% | Grade A: Brix >18, berry >16mm |
| **Orange (Nagpur Mandarin)**| संत्री (नागपूर संत्रा) | ₹2,800 / qtl | 18.0% | Grade A: Thin peel, juice >45% |

### Key APMC Mandis (6 Maharashtra Hubs)
| APMC Mandi | District | Role | Contact |
|---|---|---|---|
| **Lasalgaon APMC** | Nashik | Asia's Largest Onion Hub | +91-2550-266224 |
| **Pune Market Yard** | Pune | Major Central Consumption Hub | +91-20-24262841 |
| **Nashik APMC** | Nashik | Fruit & Vegetable Terminal | +91-253-2512301 |
| **Nagpur APMC (Kalamna)** | Nagpur | Vidarbha Cotton & Orange Hub | +91-712-2680124 |
| **Chhatrapati Sambhaji Nagar** | CSN | Marathwada Grain & Pulse Market | +91-240-2381204 |
| **Kolhapur APMC (Shahu Yard)** | Kolhapur | Western Maharashtra Terminal | +91-231-2651402 |

---

## ☁️ Deployment to Vercel (with Neon / Supabase PostgreSQL)

### Step 1: Switch Prisma to PostgreSQL
Run the automated schema switcher:
```bash
npm run db:switch:postgres
```
This updates `prisma/schema.prisma` to use the `postgresql` provider.

### Step 2: Provision Managed Postgres
Create a free database on [Neon](https://neon.tech) or [Supabase](https://supabase.com) and copy the connection string:
```
DATABASE_URL="postgresql://<user>:<password>@<host>/<dbname>?sslmode=require"
```

### Step 3: Push Schema & Seed Remote Database
```bash
npx prisma db push
npx tsx prisma/seed.ts
```

### Step 4: Deploy to Vercel
1. Push your repository to GitHub / GitLab.
2. Import project in Vercel.
3. Configure Environment Variables:
   - `DATABASE_URL`: Your Neon / Supabase PostgreSQL URL
   - `NEXTAUTH_SECRET`: Any random 32-character string
   - `NEXTAUTH_URL`: Your Vercel production URL (e.g. `https://agriconnect-mh.vercel.app`)
   - `NEXT_PUBLIC_APP_URL`: Your Vercel production URL
4. Deploy!
