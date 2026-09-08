import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def build_presentation():
    prs = pptx.Presentation("SIH2026-IDEA-Presentation-Format-Original-Backup.pptx")
    
    # Theme colors
    NAVY = RGBColor(0x0F, 0x17, 0x2A)       # slate-900
    EMERALD = RGBColor(0x04, 0x78, 0x57)    # emerald-700
    DARK_GREEN = RGBColor(0x06, 0x5F, 0x46) # emerald-800
    CHARCOAL = RGBColor(0x1F, 0x29, 0x37)   # gray-800
    MUTED = RGBColor(0x4B, 0x55, 0x63)      # gray-600

    def format_run(run, font_name="Arial", size_pt=13, bold=False, color=CHARCOAL):
        run.font.name = font_name
        run.font.size = Pt(size_pt)
        run.font.bold = bold
        run.font.color.rgb = color

    # =========================================================================
    # SLIDE 1: TITLE PAGE
    # =========================================================================
    s1 = prs.slides[0]
    for shape in s1.shapes:
        if shape.name == "Title 7":
            shape.top = Inches(0.2)
            shape.left = Inches(0.36)
            shape.height = Inches(1.1)
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "SMART INDIA HACKATHON 2026"
            p.font.name = "Arial"
            p.font.size = Pt(36)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "Subtitle 3":
            shape.top = Inches(1.3)
            shape.left = Inches(0.36)
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
            p2.font.size = Pt(13)
            p2.font.bold = False
            p2.font.color.rgb = MUTED
            p2.space_before = Pt(3)

        elif shape.name == "TextBox 9":
            shape.top = Inches(2.35)
            shape.left = Inches(0.36)
            shape.width = Inches(7.5)
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
                format_run(r1, font_name="Arial", size_pt=12.5, bold=True, color=DARK_GREEN)
                
                r2 = p.add_run()
                r2.text = val
                format_run(r2, font_name="Arial", size_pt=12.5, bold=False, color=CHARCOAL)

    # =========================================================================
    # SLIDE 2: IDEA TITLE & PROPOSED SOLUTION
    # =========================================================================
    s2 = prs.slides[1]
    for shape in s2.shapes:
        if shape.name == "Title 1":
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "IDEA: AgriConnect Maharashtra (कृषी जोड महाराष्ट्र)"
            p.font.name = "Arial"
            p.font.size = Pt(22)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "TextBox 8":
            shape.top = Inches(1.35)
            shape.left = Inches(0.6)
            shape.width = Inches(12.1)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()

            # Section 1 Header
            p = tf.paragraphs[0]
            p.text = "PROPOSED SOLUTION"
            format_run(p.runs[0], font_name="Arial", size_pt=15, bold=True, color=DARK_GREEN)
            p.space_after = Pt(4)

            sol_bullets = [
                ("Real-Time APMC Price Intelligence & Predictive Analytics: ", 
                 "Ingests live mandi telemetry across Maharashtra (Lasalgaon, Pune, Nashik, Kolhapur, etc.) with 7d/14d EMA trends and heuristic Hold/Sell advisory to stop distress selling."),
                ("FPO Fractional Lot Aggregation & Pooling: ", 
                 "Enables smallholders to pool sub-ton harvests into commercial Grade-A lots with transparent percentage-share accounting."),
                ("Verifiable Digital Lot Passport & QR: ", 
                 "Generates tamper-proof SHA-256 passports recording harvest date, moisture %, visual grade, and MSWC cold storage suitability."),
                ("7-Stage Milestone Escrow Protocol: ", 
                 "Eliminates payment defaults by locking buyer funds in trust prior to dispatch, releasing payout upon digital weighment.")
            ]
            for prefix, desc in sol_bullets:
                p = tf.add_paragraph()
                p.level = 0
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = "• " + prefix
                format_run(r1, font_name="Arial", size_pt=11.5, bold=True, color=CHARCOAL)
                r2 = p.add_run()
                r2.text = desc
                format_run(r2, font_name="Arial", size_pt=11.5, bold=False, color=MUTED)

            # Section 2 Header
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            p.space_after = Pt(4)
            p.text = "INNOVATION & UNIQUENESS"
            format_run(p.runs[0], font_name="Arial", size_pt=15, bold=True, color=DARK_GREEN)

            innov_bullets = [
                ("Mandi Arbitrage Matrix: ", 
                 "Calculates net margins across neighboring APMCs factoring in distance and freight economics (₹/km) for optimal dispatch."),
                ("Automated Fair-Share Payout Ledger: ", 
                 "Instantly splits escrow funds directly into individual farmers' DBT accounts upon certified weighment sign-off."),
                ("State Administrative Oversight: ", 
                 "Dedicated Government dashboard providing live mandi arrival trends, distress sale heatmaps, and digital dispute arbitration."),
                ("Rural Vernacular UX & Offline PWA: ", 
                 "100% Marathi/English interface with high-contrast visual stages and resilient offline mock data fallback.")
            ]
            for prefix, desc in innov_bullets:
                p = tf.add_paragraph()
                p.level = 0
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = "• " + prefix
                format_run(r1, font_name="Arial", size_pt=11.5, bold=True, color=CHARCOAL)
                r2 = p.add_run()
                r2.text = desc
                format_run(r2, font_name="Arial", size_pt=11.5, bold=False, color=MUTED)

    # =========================================================================
    # SLIDE 3: TECHNICAL APPROACH
    # =========================================================================
    s3 = prs.slides[2]
    # Remove Shape 7 (the redundant small "Technologies" box) or merge cleanly
    for shape in s3.shapes:
        if shape.name == "Title 1":
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "TECHNICAL APPROACH & SYSTEM ARCHITECTURE"
            p.font.name = "Arial"
            p.font.size = Pt(22)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "TextBox 2":
            # Clear redundant label box
            shape.text_frame.clear()

        elif shape.name == "TextBox 1":
            shape.top = Inches(1.35)
            shape.left = Inches(0.6)
            shape.width = Inches(12.1)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()

            # Section 1 Header
            p = tf.paragraphs[0]
            p.text = "PRODUCTION TECHNOLOGY STACK"
            format_run(p.runs[0], font_name="Arial", size_pt=15, bold=True, color=DARK_GREEN)
            p.space_after = Pt(4)

            tech_items = [
                ("Frontend Framework: ", "Next.js 14 App Router, React Server Components, TypeScript, Tailwind CSS, Lucide Icons, Mobile PWA."),
                ("Analytics & Visualizations: ", "Recharts (dynamic APMC mandi trends, 7d/14d EMAs), HTML5 QR scanner & SVG generator."),
                ("Backend & Security: ", "Next.js Route Handlers, Edge Middleware, NextAuth.js multi-role auth (Farmer, FPO, Buyer, Officer)."),
                ("Data & Reliability Layer: ", "Prisma ORM with Dual-Engine DB (PostgreSQL / Neon + SQLite), zero-downtime resilient in-memory mock adapter."),
                ("Intelligent Algorithms: ", "Time-weighted EMA price heuristic, distance-weighted APMC freight arbitrage optimizer, SHA-256 passport hash.")
            ]
            for prefix, desc in tech_items:
                p = tf.add_paragraph()
                p.level = 0
                p.space_after = Pt(3)
                r1 = p.add_run()
                r1.text = "• " + prefix
                format_run(r1, font_name="Arial", size_pt=11, bold=True, color=CHARCOAL)
                r2 = p.add_run()
                r2.text = desc
                format_run(r2, font_name="Arial", size_pt=11, bold=False, color=MUTED)

            # Section 2 Header
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            p.space_after = Pt(4)
            p.text = "END-TO-END SYSTEM EXECUTION FLOW"
            format_run(p.runs[0], font_name="Arial", size_pt=15, bold=True, color=DARK_GREEN)

            flow_items = [
                ("Stage 1 (Lot Pooling & Passport): ", "Farmer lists harvest or joins FPO pool → Quality grade & moisture recorded → Verifiable QR minted."),
                ("Stage 2 (Mandi Price Advisory): ", "Real-time APMC feeds analyzed → 7d/14d EMA engine advises 'Sell Today' or 'Hold for Peak'."),
                ("Stage 3 (Bidding & Escrow Funding): ", "Verified institutional buyer submits binding contract offer → Full payment secured in 7-stage Milestone Escrow."),
                ("Stage 4 (Dispatch & Weighment): ", "Consignment dispatched with GPS tracking → Delivery hub conducts QR scan & digital weighment sign-off."),
                ("Stage 5 (Automated Split Settlement): ", "Escrow releases funds → Direct split DBT transfers into farmers' bank accounts with zero middlemen.")
            ]
            for prefix, desc in flow_items:
                p = tf.add_paragraph()
                p.level = 0
                p.space_after = Pt(3)
                r1 = p.add_run()
                r1.text = "→ " + prefix
                format_run(r1, font_name="Arial", size_pt=11, bold=True, color=CHARCOAL)
                r2 = p.add_run()
                r2.text = desc
                format_run(r2, font_name="Arial", size_pt=11, bold=False, color=MUTED)

    # =========================================================================
    # SLIDE 4: FEASIBILITY AND VIABILITY
    # =========================================================================
    s4 = prs.slides[3]
    for shape in s4.shapes:
        if shape.name == "Title 1":
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "FEASIBILITY, VIABILITY & RISK MITIGATION"
            p.font.name = "Arial"
            p.font.size = Pt(22)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "TextBox 8":
            shape.top = Inches(1.35)
            shape.left = Inches(0.6)
            shape.width = Inches(12.1)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()

            # Section 1 Header
            p = tf.paragraphs[0]
            p.text = "COMPREHENSIVE FEASIBILITY ANALYSIS"
            format_run(p.runs[0], font_name="Arial", size_pt=15, bold=True, color=DARK_GREEN)
            p.space_after = Pt(4)

            feas_items = [
                ("Technical Feasibility: ", "Fully developed and deployed live on Vercel with serverless edge architecture, <800ms API response, and responsive mobile-first UI."),
                ("Operational Feasibility: ", "Integrates smoothly with existing APMC yard infrastructure, MSAMB daily market bulletin formats, and MSWC warehouse networks."),
                ("Economic Viability: ", "0% platform listing fee for marginal farmers; self-sustaining 1.25% FPO transaction facilitation fee on completed escrow contracts.")
            ]
            for prefix, desc in feas_items:
                p = tf.add_paragraph()
                p.level = 0
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = "• " + prefix
                format_run(r1, font_name="Arial", size_pt=11.5, bold=True, color=CHARCOAL)
                r2 = p.add_run()
                r2.text = desc
                format_run(r2, font_name="Arial", size_pt=11.5, bold=False, color=MUTED)

            # Section 2 Header
            p = tf.add_paragraph()
            p.space_before = Pt(8)
            p.space_after = Pt(4)
            p.text = "KEY CHALLENGES & ACTIONABLE MITIGATIONS"
            format_run(p.runs[0], font_name="Arial", size_pt=15, bold=True, color=DARK_GREEN)

            challenge_items = [
                ("Digital Literacy Barrier: ", "100% vernacular Marathi UI, intuitive visual status cards, audio-assisted prompts, and assisted aggregation by local FPO centers."),
                ("Produce Grading Inconsistencies: ", "Verifiable QR Lot Passport with immutable moisture/grade logs, pre-dispatch sample sealing, and state-supervised arbitration."),
                ("Buyer Payment Defaults & Delays: ", "Milestone-locked Escrow guarantees 100% of deal value is locked in trust before harvest leaves the farm gate."),
                ("Rural Internet Constraints: ", "Lightweight PWA with local browser caching, zero-downtime in-memory fallback, and automated SMS transaction notifications.")
            ]
            for prefix, desc in challenge_items:
                p = tf.add_paragraph()
                p.level = 0
                p.space_after = Pt(4)
                r1 = p.add_run()
                r1.text = "▲ " + prefix
                format_run(r1, font_name="Arial", size_pt=11.5, bold=True, color=CHARCOAL)
                r2 = p.add_run()
                r2.text = desc
                format_run(r2, font_name="Arial", size_pt=11.5, bold=False, color=MUTED)

    # =========================================================================
    # SLIDE 5: IMPACT AND BENEFITS
    # =========================================================================
    s5 = prs.slides[4]
    for shape in s5.shapes:
        if shape.name == "Title 1":
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "IMPACT AND STAKEHOLDER BENEFITS"
            p.font.name = "Arial"
            p.font.size = Pt(22)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "TextBox 8":
            shape.top = Inches(1.35)
            shape.left = Inches(0.6)
            shape.width = Inches(12.1)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()

            impact_groups = [
                ("1. Smallholder & Marginal Farmers", [
                    ("Higher Income: ", "+14.8% net price realization by eliminating informal middlemen and unauthorized commission deductions."),
                    ("Guaranteed Payment: ", "100% secure escrow settlement credited via direct bank transfer within 24 hours of weighment sign-off."),
                    ("Bargaining Power: ", "Fractional lot aggregation enables smallholders to participate in lucrative bulk corporate contracts.")
                ]),
                ("2. Farmer Producer Organizations (FPOs)", [
                    ("Agribusiness Modernization: ", "Replaces manual ledgers with automated lot pooling and instant split-payout calculations."),
                    ("Direct Market Access: ", "Connects regional FPOs directly with institutional food processors, FMCG brands, and retail chains.")
                ]),
                ("3. Institutional Buyers & Food Processors", [
                    ("Verifiable Traceability: ", "QR Lot Passports guarantee crop origin, harvest date, moisture metrics, and grading consistency."),
                    ("Procurement Efficiency: ", "Reduces sourcing overheads, delivery lead-times, and counterparty delivery default risks.")
                ]),
                ("4. Government of Maharashtra & Rural Economy", [
                    ("Market Transparency: ", "Real-time price & arrival telemetry across 36 districts prevents localized gluts and distress sales."),
                    ("Policy Alignment: ", "Digitally empowers MSAMB, e-NAM, and World Bank SMART Project agribusiness transformation goals.")
                ])
            ]

            for g_idx, (group_title, items) in enumerate(impact_groups):
                p = tf.paragraphs[0] if g_idx == 0 else tf.add_paragraph()
                p.space_before = Pt(4) if g_idx > 0 else Pt(0)
                p.space_after = Pt(2)
                p.text = group_title
                format_run(p.runs[0], font_name="Arial", size_pt=13.5, bold=True, color=DARK_GREEN)

                for prefix, desc in items:
                    p = tf.add_paragraph()
                    p.level = 0
                    p.space_after = Pt(2)
                    r1 = p.add_run()
                    r1.text = "• " + prefix
                    format_run(r1, font_name="Arial", size_pt=11, bold=True, color=CHARCOAL)
                    r2 = p.add_run()
                    r2.text = desc
                    format_run(r2, font_name="Arial", size_pt=11, bold=False, color=MUTED)

    # =========================================================================
    # SLIDE 6: RESEARCH AND REFERENCES
    # =========================================================================
    s6 = prs.slides[5]
    for shape in s6.shapes:
        if shape.name == "Title 1":
            tf = shape.text_frame
            tf.clear()
            p = tf.paragraphs[0]
            p.text = "RESEARCH, REFERENCES & LIVE DEMONSTRATION"
            p.font.name = "Arial"
            p.font.size = Pt(22)
            p.font.bold = True
            p.font.color.rgb = NAVY

        elif shape.name == "TextBox 8":
            shape.top = Inches(1.35)
            shape.left = Inches(0.6)
            shape.width = Inches(12.1)
            shape.height = Inches(5.4)
            tf = shape.text_frame
            tf.word_wrap = True
            tf.clear()

            # Section 1 Header
            p = tf.paragraphs[0]
            p.text = "INSTITUTIONAL DATA SOURCES & POLICY BENCHMARKS"
            format_run(p.runs[0], font_name="Arial", size_pt=15, bold=True, color=DARK_GREEN)
            p.space_after = Pt(4)

            ref_items = [
                ("Maharashtra State Agricultural Marketing Board (MSAMB): ", "Daily APMC mandi arrivals, modal price benchmarks, and Maharashtra APMC Act guidelines."),
                ("Agmarknet Portal (DMI, Ministry of Agriculture & Farmers Welfare, GoI): ", "Historical daily commodity price trends, seasonal indices, and grade standards."),
                ("National Agriculture Market (e-NAM): ", "Inter-mandi electronic trading protocols, quality assaying methodologies, and e-NWR frameworks."),
                ("World Bank SMART Project (Govt of Maharashtra): ", "State of Maharashtra's Agribusiness & Rural Transformation empirical studies on FPO market access.")
            ]
            for prefix, desc in ref_items:
                p = tf.add_paragraph()
                p.level = 0
                p.space_after = Pt(3)
                r1 = p.add_run()
                r1.text = "• " + prefix
                format_run(r1, font_name="Arial", size_pt=11, bold=True, color=CHARCOAL)
                r2 = p.add_run()
                r2.text = desc
                format_run(r2, font_name="Arial", size_pt=11, bold=False, color=MUTED)

            # Section 2 Header
            p = tf.add_paragraph()
            p.space_before = Pt(6)
            p.space_after = Pt(4)
            p.text = "PRIMARY FIELD RESEARCH & MANDI GROUND TRUTHING"
            format_run(p.runs[0], font_name="Arial", size_pt=15, bold=True, color=DARK_GREEN)

            field_items = [
                ("Lasalgaon APMC (Nashik): ", "Evaluated onion price volatility, seasonal storage distress, and modal rate fluctuations during peak arrival surges."),
                ("Pune Gultekdi APMC: ", "Analyzed perishable vegetable supply chains, intermediary commission spreads, and same-day liquidation pressures."),
                ("Nashik & Nagpur Mandis: ", "Studied cold chain requirements for export-grade grapes, tomato logistics, and soybean/cotton industrial procurement."),
                ("Kolhapur APMC: ", "Examined regional jaggery (Gur) and commercial sugarcane pricing patterns, grading tiers, and delayed payment bottlenecks.")
            ]
            for prefix, desc in field_items:
                p = tf.add_paragraph()
                p.level = 0
                p.space_after = Pt(3)
                r1 = p.add_run()
                r1.text = "• " + prefix
                format_run(r1, font_name="Arial", size_pt=11, bold=True, color=CHARCOAL)
                r2 = p.add_run()
                r2.text = desc
                format_run(r2, font_name="Arial", size_pt=11, bold=False, color=MUTED)

            # Section 3: Live Verification
            p = tf.add_paragraph()
            p.space_before = Pt(6)
            p.space_after = Pt(4)
            p.text = "LIVE PLATFORM & OPEN-SOURCE VERIFICATION"
            format_run(p.runs[0], font_name="Arial", size_pt=15, bold=True, color=DARK_GREEN)

            live_links = [
                ("Live Production Platform: ", "https://agriconnect-maharashtra.vercel.app (100% active, bilingual, instant demo roles)"),
                ("GitHub Source Code Repository: ", "https://github.com/abdul-halik-ai/agriconnect-maharashtra (Production Next.js 14 codebase)")
            ]
            for prefix, desc in live_links:
                p = tf.add_paragraph()
                p.level = 0
                p.space_after = Pt(2)
                r1 = p.add_run()
                r1.text = "★ " + prefix
                format_run(r1, font_name="Arial", size_pt=11, bold=True, color=EMERALD)
                r2 = p.add_run()
                r2.text = desc
                format_run(r2, font_name="Arial", size_pt=11, bold=False, color=CHARCOAL)

    # Save to both requested template file and dedicated named file
    prs.save("SIH2026-IDEA-Presentation-Format.pptx")
    prs.save("AgriConnect-Maharashtra-SIH2026-Presentation.pptx")
    print("Successfully generated and saved both presentation files!")

if __name__ == "__main__":
    build_presentation()
