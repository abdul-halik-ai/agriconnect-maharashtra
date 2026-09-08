import os
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def build_presentation():
    # Load from original backup template to preserve official SIH master layout, headers, footers & logos
    prs = pptx.Presentation("SIH2026-IDEA-Presentation-Format-Original-Backup.pptx")

    # High-impact theme colors
    NAVY = RGBColor(0x0F, 0x17, 0x2A)        # slate-900
    DARK_GREEN = RGBColor(0x04, 0x78, 0x57)  # emerald-700
    EMERALD = RGBColor(0x05, 0x96, 0x69)     # emerald-600
    CHARCOAL = RGBColor(0x1E, 0x29, 0x3B)    # slate-800
    MUTED = RGBColor(0x47, 0x55, 0x69)       # slate-600
    ACCENT_BG = RGBColor(0xF1, 0xF5, 0xF9)   # slate-100
    BORDER_COLOR = RGBColor(0xCB, 0xD5, 0xE1)# slate-300

    def add_caption_card(slide, left, top, width, height, title, subtitle=""):
        """Adds a subtle, modern card below images."""
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = ACCENT_BG
        shape.line.color.rgb = BORDER_COLOR
        shape.line.width = Pt(1)
        tf = shape.text_frame
        tf.word_wrap = True
        tf.vertical_anchor = MSO_ANCHOR.MIDDLE
        tf.clear()
        p = tf.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        r1 = p.add_run()
        r1.text = title + (" — " if subtitle else "")
        r1.font.name = "Arial"
        r1.font.size = Pt(10.5)
        r1.font.bold = True
        r1.font.color.rgb = CHARCOAL
        if subtitle:
            r2 = p.add_run()
            r2.text = subtitle
            r2.font.name = "Arial"
            r2.font.size = Pt(10)
            r2.font.bold = False
            r2.font.color.rgb = MUTED
        return shape

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    s1 = prs.slides[0]
    for shape in s1.shapes:
        if shape.name == "Title 7":
            shape.top = Inches(0.25)
            shape.left = Inches(0.4)
            shape.height = Inches(1.0)
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "SMART INDIA HACKATHON 2026"
            p.font.name = "Arial"
            p.font.size = Pt(34)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "Subtitle 3":
            shape.top = Inches(1.25)
            shape.left = Inches(0.4)
            shape.width = Inches(9.5)
            shape.height = Inches(0.9)
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "AgriConnect Maharashtra (कृषी जोड महाराष्ट्र)"
            p.font.name = "Arial"
            p.font.size = Pt(20)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN

            p2 = tf.add_paragraph()
            p2.text = "Direct Farmer-to-Market Intelligence & 7-Stage Milestone Escrow Platform"
            p2.font.name = "Arial"
            p2.font.size = Pt(12.5)
            p2.font.bold = False
            p2.font.color.rgb = MUTED
            p2.space_before = Pt(3)

        elif shape.name == "TextBox 9":
            shape.top = Inches(2.35)
            shape.left = Inches(0.4)
            shape.width = Inches(7.2)
            shape.height = Inches(4.5)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()
            
            items = [
                ("Problem Statement: ", "Strengthening market linkages and price discovery for farmers"),
                ("Ministry / Organization: ", "Government of Maharashtra / MSIS & Agriculture Dept"),
                ("Theme: ", "Direct farmer-to-consumer marketplace / Agri-Tech"),
                ("Category: ", "Software (Full-Stack Web & Mobile PWA)"),
                ("Team Name: ", "Team Paradex"),
                ("Live Prototype: ", "https://agriconnect-maharashtra.vercel.app"),
                ("GitHub Repository: ", "https://github.com/abdul-halik-ai/agriconnect-maharashtra"),
            ]
            for idx, (label, val) in enumerate(items):
                p = tf.paragraphs[0] if idx == 0 else tf.add_paragraph()
                p.space_after = Pt(7)
                r1 = p.add_run()
                r1.text = label
                r1.font.name = "Arial"
                r1.font.size = Pt(12)
                r1.font.bold = True
                r1.font.color.rgb = DARK_GREEN
                
                r2 = p.add_run()
                r2.text = val
                r2.font.name = "Arial"
                r2.font.size = Pt(12)
                r2.font.bold = False
                r2.font.color.rgb = CHARCOAL

    # =========================================================================
    # SLIDE 2: IDEA TITLE & PROPOSED SOLUTION (Photo: price_intelligence.png)
    # =========================================================================
    s2 = prs.slides[1]
    for shape in s2.shapes:
        if shape.name == "Title 1":
            shape.top = Inches(0.2)
            shape.left = Inches(0.6)
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "IDEA: AgriConnect Maharashtra (कृषी जोड महाराष्ट्र)"
            p.font.name = "Arial"
            p.font.size = Pt(21)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "TextBox 8":
            # Left column: crisp, non-paragraph bullet points
            shape.top = Inches(1.25)
            shape.left = Inches(0.5)
            shape.width = Inches(5.8)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()

            # Section 1
            p = tf.paragraphs[0]
            p.text = "CORE CAPABILITIES"
            p.font.name = "Arial"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN
            p.space_after = Pt(4)

            sol_bullets = [
                ("APMC Price Telemetry: ", "Live rates across 6 major hubs with 7d/14d EMA Sell/Hold advisory."),
                ("Fractional Lot Pooling: ", "Aggregates small harvests into Grade-A commercial bulk lots."),
                ("Digital Lot Passport: ", "Tamper-proof SHA-256 QR certificate with moisture & grade metrics."),
                ("Milestone Escrow: ", "100% payment security locking buyer funds before dispatch.")
            ]
            for prefix, desc in sol_bullets:
                p = tf.add_paragraph()
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = "• " + prefix
                r1.font.name = "Arial"
                r1.font.size = Pt(11)
                r1.font.bold = True
                r1.font.color.rgb = CHARCOAL
                r2 = p.add_run()
                r2.text = desc
                r2.font.name = "Arial"
                r2.font.size = Pt(11)
                r2.font.bold = False
                r2.font.color.rgb = MUTED

            # Section 2
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            p.space_after = Pt(4)
            p.text = "INNOVATION & VALUE ADD"
            p.font.name = "Arial"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN

            innov_bullets = [
                ("Mandi Arbitrage Matrix: ", "Real-time freight deduction (₹/km) for optimal market dispatch."),
                ("Automated Fair Payout: ", "Direct split disbursements to farmers' bank accounts upon weighment."),
                ("State Telemetry: ", "Administrative dashboard for mandi monitoring & dispute arbitration."),
                ("Vernacular Rural UX: ", "100% Marathi/English toggle with PWA offline resilience.")
            ]
            for prefix, desc in innov_bullets:
                p = tf.add_paragraph()
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = "• " + prefix
                r1.font.name = "Arial"
                r1.font.size = Pt(11)
                r1.font.bold = True
                r1.font.color.rgb = CHARCOAL
                r2 = p.add_run()
                r2.text = desc
                r2.font.name = "Arial"
                r2.font.size = Pt(11)
                r2.font.bold = False
                r2.font.color.rgb = MUTED

    # Add Project Photo to Right Column
    s2.shapes.add_picture("screenshots/price_intelligence.png", Inches(6.5), Inches(1.3), width=Inches(6.3))
    add_caption_card(s2, Inches(6.5), Inches(5.45), Inches(6.3), Inches(0.65), 
                     "Live Production UI", "Real-time APMC Mandi Price Discovery & Sell/Hold Advisory")

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH (Flowchart: architecture_flowchart.png)
    # =========================================================================
    s3 = prs.slides[2]
    for shape in s3.shapes:
        if shape.name == "Title 1":
            shape.top = Inches(0.2)
            shape.left = Inches(0.6)
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "TECHNICAL APPROACH & SYSTEM ARCHITECTURE"
            p.font.name = "Arial"
            p.font.size = Pt(21)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "TextBox 2":
            shape.text_frame.clear()

        elif shape.name == "TextBox 1":
            shape.top = Inches(1.25)
            shape.left = Inches(0.5)
            shape.width = Inches(5.6)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()

            # Section 1
            p = tf.paragraphs[0]
            p.text = "PRODUCTION TECH STACK"
            p.font.name = "Arial"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN
            p.space_after = Pt(4)

            tech_items = [
                ("Frontend: ", "Next.js 14 App Router, React Server Components, Tailwind CSS."),
                ("Analytics: ", "Recharts dynamic charts, HTML5 QR scanner & SVG generator."),
                ("Backend & DB: ", "Prisma ORM, Dual-Engine DB (PostgreSQL / Neon + SQLite)."),
                ("Security: ", "NextAuth.js multi-role auth (Farmer, FPO, Buyer, Officer)."),
                ("Algorithms: ", "7d/14d EMA price forecasting, distance freight arbitrage.")
            ]
            for prefix, desc in tech_items:
                p = tf.add_paragraph()
                p.space_after = Pt(3.5)
                r1 = p.add_run()
                r1.text = "• " + prefix
                r1.font.name = "Arial"
                r1.font.size = Pt(11)
                r1.font.bold = True
                r1.font.color.rgb = CHARCOAL
                r2 = p.add_run()
                r2.text = desc
                r2.font.name = "Arial"
                r2.font.size = Pt(11)
                r2.font.bold = False
                r2.font.color.rgb = MUTED

            # Section 2
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            p.space_after = Pt(4)
            p.text = "PERFORMANCE & ARCHITECTURE"
            p.font.name = "Arial"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN

            perf_items = [
                ("<800ms Latency: ", "Serverless Edge deployment for fast rural responsiveness."),
                ("Zero Downtime: ", "Resilient in-memory mock fallback adapter."),
                ("Mobile PWA: ", "Touch-friendly bottom bar navigation & offline caching."),
                ("SHA-256 Hashes: ", "Tamper-proof cryptographic lot passport integrity.")
            ]
            for prefix, desc in perf_items:
                p = tf.add_paragraph()
                p.space_after = Pt(3.5)
                r1 = p.add_run()
                r1.text = "• " + prefix
                r1.font.name = "Arial"
                r1.font.size = Pt(11)
                r1.font.bold = True
                r1.font.color.rgb = CHARCOAL
                r2 = p.add_run()
                r2.text = desc
                r2.font.name = "Arial"
                r2.font.size = Pt(11)
                r2.font.bold = False
                r2.font.color.rgb = MUTED

    # Add Flowchart to Right Column
    s3.shapes.add_picture("screenshots/architecture_flowchart.png", Inches(6.3), Inches(1.3), width=Inches(6.6))
    add_caption_card(s3, Inches(6.3), Inches(5.15), Inches(6.6), Inches(0.65), 
                     "System Architecture Flowchart", "5-Stage Pipeline: Aggregation → Advisory → Escrow → Delivery → Settlement")

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY (Flowchart: escrow_flowchart.png)
    # =========================================================================
    s4 = prs.slides[3]
    for shape in s4.shapes:
        if shape.name == "Title 1":
            shape.top = Inches(0.2)
            shape.left = Inches(0.6)
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "FEASIBILITY, VIABILITY & RISK MITIGATION"
            p.font.name = "Arial"
            p.font.size = Pt(21)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "TextBox 8":
            shape.top = Inches(1.25)
            shape.left = Inches(0.5)
            shape.width = Inches(5.6)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()

            # Section 1
            p = tf.paragraphs[0]
            p.text = "FEASIBILITY PILLARS"
            p.font.name = "Arial"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN
            p.space_after = Pt(4)

            feas_items = [
                ("Technical: ", "100% built, tested & deployed live on Vercel with zero latency."),
                ("Operational: ", "Plug-and-play with APMC yard rules and MSAMB standards."),
                ("Economic: ", "0% farmer fee; self-sustaining 1.25% FPO escrow facilitation fee.")
            ]
            for prefix, desc in feas_items:
                p = tf.add_paragraph()
                p.space_after = Pt(3.5)
                r1 = p.add_run()
                r1.text = "• " + prefix
                r1.font.name = "Arial"
                r1.font.size = Pt(11)
                r1.font.bold = True
                r1.font.color.rgb = CHARCOAL
                r2 = p.add_run()
                r2.text = desc
                r2.font.name = "Arial"
                r2.font.size = Pt(11)
                r2.font.bold = False
                r2.font.color.rgb = MUTED

            # Section 2
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            p.space_after = Pt(4)
            p.text = "CHALLENGES & MITIGATIONS"
            p.font.name = "Arial"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN

            mit_items = [
                ("Digital Literacy: ", "Vernacular Marathi UI + FPO village kiosk assistance."),
                ("Grading Disputes: ", "Verifiable QR passport + sample seal and moisture logs."),
                ("Payment Default: ", "100% milestone escrow funding before harvest dispatch."),
                ("Rural Connectivity: ", "PWA offline caching + automated SMS transaction alerts.")
            ]
            for prefix, desc in mit_items:
                p = tf.add_paragraph()
                p.space_after = Pt(3.5)
                r1 = p.add_run()
                r1.text = "▲ " + prefix
                r1.font.name = "Arial"
                r1.font.size = Pt(11)
                r1.font.bold = True
                r1.font.color.rgb = CHARCOAL
                r2 = p.add_run()
                r2.text = desc
                r2.font.name = "Arial"
                r2.font.size = Pt(11)
                r2.font.bold = False
                r2.font.color.rgb = MUTED

    # Add Escrow Flowchart to Right Column
    s4.shapes.add_picture("screenshots/escrow_flowchart.png", Inches(6.3), Inches(1.3), width=Inches(6.6))
    add_caption_card(s4, Inches(6.3), Inches(5.15), Inches(6.6), Inches(0.65), 
                     "7-Stage Milestone Escrow Protocol", "Guaranteed Payment Protection: Lock → Transit → Weighment → Payout")

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS (Photo: admin_dashboard.png)
    # =========================================================================
    s5 = prs.slides[4]
    for shape in s5.shapes:
        if shape.name == "Title 1":
            shape.top = Inches(0.2)
            shape.left = Inches(0.6)
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "IMPACT AND STAKEHOLDER BENEFITS"
            p.font.name = "Arial"
            p.font.size = Pt(21)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "TextBox 8":
            shape.top = Inches(1.25)
            shape.left = Inches(0.5)
            shape.width = Inches(5.8)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()

            # Section 1: Metrics
            p = tf.paragraphs[0]
            p.text = "KEY QUANTIFIABLE METRICS"
            p.font.name = "Arial"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN
            p.space_after = Pt(4)

            metrics = [
                ("+14.8% Uplift: ", "Average farmer net price increase by bypassing middlemen."),
                ("24-Hr Settlement: ", "Direct DBT credit into farmer accounts after weighment."),
                ("100% Protection: ", "Zero default risk via mandatory milestone escrow deposit."),
                ("36 Districts: ", "Real-time state-wide mandi price and arrival visibility.")
            ]
            for prefix, desc in metrics:
                p = tf.add_paragraph()
                p.space_after = Pt(3.5)
                r1 = p.add_run()
                r1.text = "★ " + prefix
                r1.font.name = "Arial"
                r1.font.size = Pt(11)
                r1.font.bold = True
                r1.font.color.rgb = DARK_GREEN
                r2 = p.add_run()
                r2.text = desc
                r2.font.name = "Arial"
                r2.font.size = Pt(11)
                r2.font.bold = False
                r2.font.color.rgb = CHARCOAL

            # Section 2: Beneficiaries
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            p.space_after = Pt(4)
            p.text = "STAKEHOLDER BENEFITS"
            p.font.name = "Arial"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN

            benefits = [
                ("Smallholder Farmers: ", "Higher realizations, fair digital weighment, no delayed credit."),
                ("FPOs: ", "Commercial aggregation scale with automated member payout ledgers."),
                ("Institutional Buyers: ", "Traceable Grade-A produce with verified moisture certificates."),
                ("Govt of Maharashtra: ", "Macro supply telemetry, distress sale heatmaps & fraud prevention.")
            ]
            for prefix, desc in benefits:
                p = tf.add_paragraph()
                p.space_after = Pt(3.5)
                r1 = p.add_run()
                r1.text = "• " + prefix
                r1.font.name = "Arial"
                r1.font.size = Pt(11)
                r1.font.bold = True
                r1.font.color.rgb = CHARCOAL
                r2 = p.add_run()
                r2.text = desc
                r2.font.name = "Arial"
                r2.font.size = Pt(11)
                r2.font.bold = False
                r2.font.color.rgb = MUTED

    # Add Admin Dashboard Screenshot
    s5.shapes.add_picture("screenshots/admin_dashboard.png", Inches(6.5), Inches(1.3), width=Inches(6.3))
    add_caption_card(s5, Inches(6.5), Inches(5.45), Inches(6.3), Inches(0.65), 
                     "State Administration Dashboard", "Live GMV (₹23.7L+), District Heatmaps, KYC Approval & Dispute Center")

    # =========================================================================
    # SLIDE 6: RESEARCH, REFERENCES & DEMO (Photo: fpo_aggregate.png)
    # =========================================================================
    s6 = prs.slides[5]
    for shape in s6.shapes:
        if shape.name == "Title 1":
            shape.top = Inches(0.2)
            shape.left = Inches(0.6)
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "RESEARCH, REFERENCES & LIVE DEMONSTRATION"
            p.font.name = "Arial"
            p.font.size = Pt(21)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "TextBox 8":
            shape.top = Inches(1.25)
            shape.left = Inches(0.5)
            shape.width = Inches(5.8)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()

            # Section 1
            p = tf.paragraphs[0]
            p.text = "INSTITUTIONAL BENCHMARKS"
            p.font.name = "Arial"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN
            p.space_after = Pt(4)

            refs = [
                ("MSAMB: ", "Daily APMC mandi arrivals, modal prices & APMC Act rules."),
                ("Agmarknet (GoI): ", "Historical daily commodity price trends & grade standards."),
                ("e-NAM Architecture: ", "Inter-mandi trading protocols & e-NWR warehouse norms."),
                ("World Bank SMART: ", "State of Maharashtra's Agribusiness transformation data.")
            ]
            for prefix, desc in refs:
                p = tf.add_paragraph()
                p.space_after = Pt(3.5)
                r1 = p.add_run()
                r1.text = "• " + prefix
                r1.font.name = "Arial"
                r1.font.size = Pt(11)
                r1.font.bold = True
                r1.font.color.rgb = CHARCOAL
                r2 = p.add_run()
                r2.text = desc
                r2.font.name = "Arial"
                r2.font.size = Pt(11)
                r2.font.bold = False
                r2.font.color.rgb = MUTED

            # Section 2
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            p.space_after = Pt(4)
            p.text = "MANDI FIELD RESEARCH"
            p.font.name = "Arial"
            p.font.size = Pt(14)
            p.font.bold = True
            p.font.color.rgb = DARK_GREEN

            mandi_studies = [
                ("Lasalgaon (Nashik): ", "Onion price volatility & seasonal storage loss."),
                ("Pune Gultekdi: ", "Perishable vegetable supply chains & commission spreads."),
                ("Nashik & Nagpur: ", "Grapes cold chain logistics & soybean industrial sourcing."),
                ("Kolhapur APMC: ", "Regional jaggery (Gur) and commercial sugarcane contracts.")
            ]
            for prefix, desc in mandi_studies:
                p = tf.add_paragraph()
                p.space_after = Pt(3.5)
                r1 = p.add_run()
                r1.text = "• " + prefix
                r1.font.name = "Arial"
                r1.font.size = Pt(11)
                r1.font.bold = True
                r1.font.color.rgb = CHARCOAL
                r2 = p.add_run()
                r2.text = desc
                r2.font.name = "Arial"
                r2.font.size = Pt(11)
                r2.font.bold = False
                r2.font.color.rgb = MUTED

    # Add FPO Lot Aggregation / Passport Screenshot to Right Column
    s6.shapes.add_picture("screenshots/fpo_aggregate.png", Inches(6.5), Inches(1.3), width=Inches(6.3))
    add_caption_card(s6, Inches(6.5), Inches(5.45), Inches(6.3), Inches(0.65), 
                     "Live Web Deployment", "https://agriconnect-maharashtra.vercel.app • GitHub: Team Paradex")

    # Save outputs
    output_files = [
        "AgriConnect-Maharashtra-SIH2026-Presentation.pptx",
        "SIH2026-IDEA-Presentation-Format.pptx"
    ]
    for out_name in output_files:
        try:
            prs.save(out_name)
            print(f"Successfully saved {out_name}")
        except PermissionError:
            fallback = out_name.replace(".pptx", "-Updated.pptx")
            prs.save(fallback)
            print(f"Permission denied for {out_name} (likely open in PowerPoint). Saved to {fallback} instead.")

if __name__ == "__main__":
    build_presentation()

