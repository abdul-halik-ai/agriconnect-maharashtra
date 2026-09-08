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
