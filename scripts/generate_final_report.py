import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def set_cell_background(cell, fill_hex):
    shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading)

def set_cell_border(cell, **kwargs):
    """
    kwargs: top, bottom, left, right
    values: dict(val='single', sz='4', color='CCCCCC', space='0')
    """
    tcPr = cell._tc.get_or_add_tcPr()
    tcBorders = OxmlElement('w:tcBorders')
    for border_name, border_props in kwargs.items():
        node = OxmlElement(f'w:{border_name}')
        for key, val in border_props.items():
            node.set(qn(f'w:{key}'), str(val))
        tcBorders.append(node)
    tcPr.append(tcBorders)

def add_page_number_to_run(run):
    fldChar1 = parse_xml(r'<w:fldChar %s w:fldCharType="begin"/>' % nsdecls('w'))
    instrText = parse_xml(r'<w:instrText %s xml:space="preserve"> PAGE </w:instrText>' % nsdecls('w'))
    fldChar2 = parse_xml(r'<w:fldChar %s w:fldCharType="separate"/>' % nsdecls('w'))
    fldChar3 = parse_xml(r'<w:fldChar %s w:fldCharType="end"/>' % nsdecls('w'))
    run._r.append(fldChar1)
    run._r.append(instrText)
    run._r.append(fldChar2)
    run._r.append(fldChar3)

def add_box_border(section):
    sectPr = section._sectPr
    pgBorders = parse_xml(
        r'<w:pgBorders %s w:offsetFrom="page">'
        r'<w:top w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        r'<w:left w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        r'<w:bottom w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        r'<w:right w:val="single" w:sz="12" w:space="24" w:color="000000"/>'
        r'</w:pgBorders>' % nsdecls('w')
    )
    sectPr.append(pgBorders)

def create_report():
    doc = Document()
    
    # Page Setup
    section = doc.sections[0]
    section.top_margin = Inches(1.0)
    section.bottom_margin = Inches(1.0)
    section.left_margin = Inches(1.0)
    section.right_margin = Inches(1.0)
    section.different_first_page_header_footer = True
    add_box_border(section)
    
    # Configure Header & Footer for normal pages
    footer = section.footer
    f_p = footer.paragraphs[0]
    f_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    f_run = f_p.add_run("Page ")
    f_run.font.name = "Times New Roman"
    f_run.font.size = Pt(10)
    f_run.font.color.rgb = RGBColor(100, 100, 100)
    add_page_number_to_run(f_run)
    f_run2 = f_p.add_run(" | ICT2142 E-Business Systems - nr-accessories.lk")
    f_run2.font.name = "Times New Roman"
    f_run2.font.size = Pt(10)
    f_run2.font.color.rgb = RGBColor(100, 100, 100)
    
    header = section.header
    h_p = header.paragraphs[0]
    h_p.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    h_run = h_p.add_run("Mini Project Report | Student: TG/2024/2147")
    h_run.font.name = "Times New Roman"
    h_run.font.size = Pt(9)
    h_run.font.italic = True
    h_run.font.color.rgb = RGBColor(120, 120, 120)

    # Helper functions for text
    def add_title(text):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(16)
        run.font.bold = True
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_subheading(text, level=2):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(10 if level==2 else 6)
        p.paragraph_format.space_after = Pt(4 if level==2 else 2)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(14 if level==2 else 12)
        run.font.bold = True
        run.font.color.rgb = RGBColor(30, 41, 59)
        return p

    def add_body(text, bold_prefix=None, space_after=6):
        p = doc.add_paragraph()
        p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(space_after)
        if bold_prefix:
            b_run = p.add_run(bold_prefix)
            b_run.font.name = "Times New Roman"
            b_run.font.size = Pt(12)
            b_run.font.bold = True
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_bullet(text, bold_prefix=None):
        p = doc.add_paragraph(style='List Bullet')
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.line_spacing = 1.15
        p.paragraph_format.space_after = Pt(4)
        if bold_prefix:
            b_run = p.add_run(bold_prefix)
            b_run.font.name = "Times New Roman"
            b_run.font.size = Pt(12)
            b_run.font.bold = True
        run = p.add_run(text)
        run.font.name = "Times New Roman"
        run.font.size = Pt(12)
        run.font.color.rgb = RGBColor(0, 0, 0)
        return p

    def add_image_figure(img_path, caption_text, width=Inches(5.8)):
        if os.path.exists(img_path):
            p_img = doc.add_paragraph()
            p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_img.paragraph_format.space_before = Pt(8)
            p_img.paragraph_format.space_after = Pt(4)
            p_img.paragraph_format.keep_with_next = True
            run = p_img.add_run()
            run.add_picture(img_path, width=width)
            
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p_cap.paragraph_format.space_before = Pt(2)
            p_cap.paragraph_format.space_after = Pt(10)
            c_run = p_cap.add_run(caption_text)
            c_run.font.name = "Times New Roman"
            c_run.font.size = Pt(10.5)
            c_run.font.italic = True
            c_run.font.color.rgb = RGBColor(70, 70, 70)

    # =========================================================================
    # COVER PAGE
    # =========================================================================
    p_top_space = doc.add_paragraph()
    p_top_space.paragraph_format.space_before = Pt(72)

    # a. Course Title and course code (Centered, Times New Roman, Bold, 20)
    p_course = doc.add_paragraph()
    p_course.alignment = WD_ALIGN_PARAGRAPH.CENTER
    run_course = p_course.add_run("ICT2142 – E-Business Systems")
    run_course.font.name = "Times New Roman"
    run_course.font.size = Pt(20)
    run_course.font.bold = True

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_after = Pt(90)
    run_sub = p_sub.add_run("Mini Project Final Evaluation Report")
    run_sub.font.name = "Times New Roman"
    run_sub.font.size = Pt(14)
    run_sub.font.italic = True
    run_sub.font.color.rgb = RGBColor(90, 90, 90)

    # b. Title of the selected business (Right Aligned, Times New Roman (Body), 18)
    p_biz = doc.add_paragraph()
    p_biz.alignment = WD_ALIGN_PARAGRAPH.RIGHT
    run_biz = p_biz.add_run("“E-Commerce Platform for nr-accessories.lk”\nSmartphone Accessories Sri Lanka")
    run_biz.font.name = "Times New Roman"
    run_biz.font.size = Pt(18)
    run_biz.font.bold = True
    p_biz.paragraph_format.space_after = Pt(110)

    # c. Name and registration number of the student (Right Aligned table, Times New Roman, 14)
    table_cov = doc.add_table(rows=5, cols=2)
    table_cov.alignment = WD_TABLE_ALIGNMENT.RIGHT
    table_cov.autofit = False

    details = [
        ("Student Name:", "Nadula Ranathunga"),
        ("Registration Number:", "TG/2024/2147"),
        ("Degree Programme:", "Bachelor of Technology (ICT)"),
        ("Faculty / Department:", "Faculty of Technology"),
        ("Submission Date:", "November 06, 2026")
    ]

    for i, (label, val) in enumerate(details):
        row = table_cov.rows[i]
        c0 = row.cells[0]
        c1 = row.cells[1]
        c0.width = Inches(2.2)
        c1.width = Inches(3.2)
        
        p0 = c0.paragraphs[0]
        p0.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r0 = p0.add_run(label)
        r0.font.name = "Times New Roman"
        r0.font.size = Pt(14)
        r0.font.bold = True

        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.LEFT
        r1 = p1.add_run(val)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(14)
        
        set_cell_margins(c0, top=60, bottom=60, left=80, right=80)
        set_cell_margins(c1, top=60, bottom=60, left=80, right=80)
        border_spec = {'val': 'none', 'sz': '0', 'color': 'auto'}
        set_cell_border(c0, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)
        set_cell_border(c1, top=border_spec, bottom=border_spec, left=border_spec, right=border_spec)

    doc.add_page_break()

    # =========================================================================
    # TABLE OF CONTENTS
    # =========================================================================
    add_title("Table of Contents")
    p_toc_note = doc.add_paragraph()
    p_toc_note.paragraph_format.space_after = Pt(12)
    r_tn = p_toc_note.add_run("The following table outlines the structured sections of this project evaluation report:")
    r_tn.font.name = "Times New Roman"
    r_tn.font.size = Pt(11)
    r_tn.font.italic = True

    toc_items = [
        ("1. Introduction", "3"),
        ("   1.1 Background of the Study", "3"),
        ("   1.2 Problem Statement", "3"),
        ("   1.3 Purpose and Project Scope", "3"),
        ("   1.4 Objectives of the System", "4"),
        ("2. Business Description", "4"),
        ("   2.1 Business Overview: nr-accessories.lk", "4"),
        ("   2.2 Product Catalog and Categories", "4"),
        ("   2.3 Target Market and Customer Persona", "5"),
        ("   2.4 Revenue Model and Value Proposition", "5"),
        ("   2.5 Competitive Advantage in Sri Lankan Market", "5"),
        ("3. System Architecture", "6"),
        ("   3.1 Architectural Overview (3-Tier MVC Pattern)", "6"),
        ("   3.2 Frontend Client Layer", "6"),
        ("   3.3 Backend Application Layer", "7"),
        ("   3.4 Database and Storage Layer", "7"),
        ("   3.5 External Integrations (Payment Gateway)", "7"),
        ("4. Tools and Technologies Used for Development", "8"),
        ("5. Database Design", "9"),
        ("   5.1 Database Architecture Rationale", "9"),
        ("   5.2 Entity-Relationship (ER) Overview", "9"),
        ("   5.3 Detailed Collection Schemas", "10"),
        ("   5.4 Data Integrity, Foreign Keys, and Indexing", "11"),
        ("6. UI Screenshots and Functional Walkthrough", "12"),
        ("   6.1 User Management Functionalities", "12"),
        ("   6.2 Product Browsing, Search, and Filtering", "13"),
        ("   6.3 Shopping Cart System and Local Persistence", "14"),
        ("   6.4 Checkout Process and Real-Time Form Validation", "15"),
        ("   6.5 Order Confirmation and Customer Order History Tracking", "16"),
        ("   6.6 Admin Management Suite (Dashboard, CRUD, Fulfillment)", "17"),
        ("   6.7 Mobile Usability and Responsive Viewports (375px+)", "18"),
        ("7. Security Features Implemented", "19"),
        ("   7.1 Cryptographic Password Hashing (Bcrypt)", "19"),
        ("   7.2 Stateless Authentication via JSON Web Tokens (JWT)", "19"),
        ("   7.3 Role-Based Access Control (RBAC) Route Guards", "19"),
        ("   7.4 Input Sanitization and Dual-Layer Validation", "20"),
        ("   7.5 Payment Hash Signature Verification (MD5 Hashing)", "20"),
        ("   7.6 CORS and Environment Isolation", "20"),
        ("8. Payment Workflow Explanation", "21"),
        ("   8.1 PayHere Gateway Integration Architecture", "21"),
        ("   8.2 End-to-End Payment Sequence", "21"),
        ("   8.3 Security Hash Generation Mechanism", "22"),
        ("   8.4 Order Status Lifecycle", "22"),
        ("9. Testing and Quality Assurance Results", "23"),
        ("   9.1 Usability Testing & UX Audits", "23"),
        ("   9.2 Automated End-to-End Testing (Puppeteer QA)", "23"),
        ("   9.3 Test Case Execution Matrix", "23"),
        ("10. Conclusion and Future Enhancements", "24"),
        ("   10.1 Project Summary", "24"),
        ("   10.2 Challenges Encountered and Solutions", "24"),
        ("   10.3 Future System Enhancements", "24"),
        ("11. References", "25")
    ]

    t_toc = doc.add_table(rows=len(toc_items), cols=2)
    t_toc.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_toc.autofit = False

    for idx, (title_str, page_str) in enumerate(toc_items):
        row = t_toc.rows[idx]
        c0, c1 = row.cells[0], row.cells[1]
        c0.width = Inches(5.5)
        c1.width = Inches(0.8)
        
        p0 = c0.paragraphs[0]
        p0.paragraph_format.line_spacing = 1.1
        p0.paragraph_format.space_after = Pt(2)
        r0 = p0.add_run(title_str)
        r0.font.name = "Times New Roman"
        r0.font.size = Pt(11)
        if title_str.strip().startswith(('1.', '2.', '3.', '4.', '5.', '6.', '7.', '8.', '9.', '10.', '11.')):
            r0.font.bold = True
            
        p1 = c1.paragraphs[0]
        p1.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        p1.paragraph_format.line_spacing = 1.1
        p1.paragraph_format.space_after = Pt(2)
        r1 = p1.add_run(page_str)
        r1.font.name = "Times New Roman"
        r1.font.size = Pt(11)
        
        set_cell_margins(c0, top=30, bottom=30, left=40, right=40)
        set_cell_margins(c1, top=30, bottom=30, left=40, right=40)
        b_spec = {'val': 'none', 'sz': '0', 'color': 'auto'}
        set_cell_border(c0, top=b_spec, bottom=b_spec, left=b_spec, right=b_spec)
        set_cell_border(c1, top=b_spec, bottom=b_spec, left=b_spec, right=b_spec)

    doc.add_page_break()

    # =========================================================================
    # 1. INTRODUCTION
    # =========================================================================
    add_title("1. Introduction")

    add_subheading("1.1 Background of the Study")
    add_body("Over the past decade, electronic commerce has transformed retail trade worldwide, migrating consumer transactions from conventional brick-and-mortar storefronts to omnichannel digital touchpoints. In Sri Lanka, the rapid penetration of high-speed 4G/5G mobile broadband, combined with the widespread adoption of digital wallets and central-bank-approved payment gateways, has spurred significant demand for online consumer electronics. Among consumer electronic segments, smartphone accessories—including protective shockproof phone cases, 9H tempered glass screen protectors, GaN fast chargers, braided USB-C cables, TWS wireless earbuds, and smartwatch straps—represent one of the fastest-moving, high-turnover consumer goods categories.")

    add_subheading("1.2 Problem Statement")
    add_body("Despite the soaring consumer demand for smartphone accessories in Sri Lanka, the local market remains heavily fragmented and burdened by persistent retail challenges:")
    add_bullet(" Retail storefronts often sell sub-standard third-party chargers and cables lacking safety certifications, leading to device battery degradation and potential hardware damage.", "1. Proliferation of Counterfeit Accessories:")
    add_bullet(" Many domestic accessory websites feature clunky, non-responsive interfaces that fail on mobile devices (375px viewports), lack real-time stock synchronisation, and suffer from confusing, tedious checkout processes.", "2. Poor Online Buying Experiences:")
    add_bullet(" Consumers are frequently left uninformed regarding their order status, while websites either force cash-on-delivery or implement error-prone, insecure payment mechanisms.", "3. Inadequate Order Tracking & Inflexible Payment:")
    add_bullet(" Small and medium retailers face inventory discrepancies between their warehouse and digital storefronts, leading to out-of-stock items being inadvertently purchased.", "4. Disjointed Inventory & Catalog Control:")

    add_subheading("1.3 Purpose and Project Scope")
    add_body("The primary purpose of this project is to research, design, architect, and deploy a robust, secure, and modern full-stack web application titled nr-accessories.lk. The platform provides a specialized e-commerce ecosystem tailored for smartphone users across Sri Lanka. The scope encompasses:")
    add_bullet("A responsive storefront built with modern React.js and Tailwind CSS, featuring an intuitive product catalog, multi-criteria filtering, live keyword search, dynamic product detail views, real-time input validations with instant visual feedback, and a persistent shopping cart.")
    add_bullet("A secure backend powered by Node.js and Express.js adhering to the Model-View-Controller (MVC) architectural pattern.")
    add_bullet("A scalable, document-oriented database using MongoDB and Mongoose ODM.")
    add_bullet("Full integration with the PayHere Sandbox payment gateway for secure local LKR card transactions using backend MD5 hash generation.")
    add_bullet("A comprehensive, role-protected Store Administrator Management Suite enabling real-time catalog CRUD (Create, Read, Update, Delete) operations, inventory tracking, and customer order fulfillment lifecycle management.")

    add_subheading("1.4 Objectives of the System")
    add_bullet("Implement secure user registration, bcrypt password hashing, stateless JWT session authentication, and persistent customer delivery profile management.", "• User Management: ")
    add_bullet("Provide dynamic product catalogs with instant keyword search, category filtering, live inventory indicators, and promotional discount calculations.", "• Product Management: ")
    add_bullet("Engineer a frictionless shopping cart backed by browser local storage caching and responsive client-side form validation.", "• Cart & Checkout: ")
    add_bullet("Integrate the PayHere payment gateway with cryptographic server-side MD5 signature calculation to prevent price tampering.", "• Financial Security: ")
    add_bullet("Equip store operators with an analytical dashboard to manage products, monitor low inventory levels, and update order statuses.", "• Administrative Control: ")
    add_bullet("Ensure 100% responsiveness on mobile devices down to 375px viewports without horizontal clipping or broken elements.", "• Usability Assurance: ")

    # =========================================================================
    # 2. BUSINESS DESCRIPTION
    # =========================================================================
    add_title("2. Business Description")

    add_subheading("2.1 Business Overview: nr-accessories.lk")
    add_body("nr-accessories.lk is an online specialized retail business focusing exclusively on premium, authentic smartphone accessories and peripherals. Operating on a direct-to-consumer (D2C) e-business model, the venture eliminates middleman markups and physical store overheads, passing on savings to tech-savvy Sri Lankan consumers while guaranteeing product authenticity.")
    add_bullet("Modern, reliable, customer-centric, and technology-focused.", "Brand Identity: ")
    add_bullet("Islandwide delivery across all 25 administrative districts of Sri Lanka, with expedited 24–48 hour delivery within the Western Province (Colombo, Gampaha, Kalutara).", "Geographical Coverage: ")

    add_subheading("2.2 Product Catalog and Categories")
    add_body("The product inventory of nr-accessories.lk is structured into five core high-demand accessory categories:")
    add_bullet("Heavy-duty MagSafe cases, crystal-clear anti-yellowing TPU cases, slim matte silicone bumpers, and leather folio covers for flagship Apple iPhone, Samsung Galaxy, Google Pixel, and Xiaomi devices.", "1. Cases & Protective Covers: ")
    add_bullet("9H hardness tempered glass, edge-to-edge privacy filters, matte anti-glare screen protectors, and sapphire camera ring protectors.", "2. Screen & Camera Lens Protectors: ")
    add_bullet("Gallium Nitride (GaN) fast wall chargers (20W, 30W, 65W, 100W PD), Qi-certified wireless charging pads, multi-device charging stations, and high-capacity power banks (10,000mAh to 30,000mAh).", "3. Chargers & Power Adapters: ")
    add_bullet("MFi-certified USB-C to Lightning cables, 100W/240W braided USB-C to USB-C fast charging cables, durable audio jack adapters, and OTG adapters.", "4. Cables & Interconnects: ")
    add_bullet("True Wireless Stereo (TWS) low-latency earbuds, active noise-cancelling (ANC) headphones, sports neckbands, silicone smartwatch replacement straps, and protective smartwatch bumpers.", "5. Audio & Wearables: ")

    add_subheading("2.3 Target Market and Customer Persona")
    add_body("The primary target market consists of:")
    add_bullet("Consumers who own mid-to-high-end smartphones and prioritize premium protective gear, fast charging capabilities, and authentic branded accessories (e.g., Anker, Spigen, Baseus, Ugreen).", "• Tech Enthusiasts & Young Professionals (Ages 18–35): ")
    add_bullet("Price-conscious consumers seeking durable, high-performance cables, low-latency gaming earphones, and long-lasting screen guards.", "• University Students & Mobile Gamers: ")
    add_bullet("Busy corporate workers seeking reliable home delivery and hassle-free online card payments for their mobile accessory replacements.", "• Secondary Market: ")

    add_subheading("2.4 Revenue Model and Value Proposition")
    add_body("Revenue is primarily generated through retail profit margins on imported and locally sourced authentic accessory inventory. The key value propositions include:")
    add_bullet("100% genuine products backed by a 6-month replacement warranty on charging equipment and adapters.", "1. Guaranteed Authenticity: ")
    add_bullet("Complimentary islandwide courier delivery on orders exceeding Rs. 7,500.", "2. Free Delivery Threshold: ")
    add_bullet("Support for online credit/debit card payments via PayHere Sandbox, Buy-Now-Pay-Later (Koko roadmap), and Cash on Delivery.", "3. Payment Flexibility: ")

    add_subheading("2.5 Competitive Advantage in Sri Lankan Market")
    add_body("Unlike generic e-commerce marketplaces (e.g., Daraz) where finding high-quality smartphone accessories can be tedious due to counterfeit duplicates, nr-accessories.lk provides a curated, vetted inventory with clear compatibility tables, a lightning-fast ad-free interface built on modern Single Page Application architecture, and real-time automated stock tracking ensuring customers never order out-of-stock items.")

    # =========================================================================
    # 3. SYSTEM ARCHITECTURE
    # =========================================================================
    add_title("3. System Architecture")

    add_subheading("3.1 Architectural Overview (3-Tier MVC Pattern)")
    add_body("The nr-accessories.lk platform utilizes an industry-standard Three-Tier Architecture, separating concerns across Presentation, Business Logic, and Data Persistence layers. This decoupled structure guarantees modularity, maintainability, and horizontal scalability.")

    # ASCII representation of Architecture in neat table
    t_arch = doc.add_table(rows=5, cols=1)
    t_arch.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_arch.autofit = False
    
    arch_layers = [
        ("PRESENTATION TIER (CLIENT LAYER)", "React 18.2 SPA | TypeScript 5 | Vite 5.4 | Tailwind CSS 3.4 | Context API\nStorefront Catalog, Cart Drawer, Validated Checkout Form, Profile Suite, Admin Portal", "F1F5F9"),
        ("REST API / JSON PROTOCOL (HTTPS / JWT AUTH HEADER)", "Secure bi-directional communication between Client Browser and Application Server", "E2E8F0"),
        ("APPLICATION TIER (BUSINESS LOGIC LAYER)", "Node.js Runtime | Express.js Framework (MVC Controller Structure)\nControllers: authController, productController, orderController, paymentController\nMiddleware: auth.js, adminGuard, CORS, Express JSON Parser", "F1F5F9"),
        ("DATA ACCESS & VERIFICATION PROTOCOLS", "Mongoose 8.x ODM Queries <---> MD5 Payment Signature Cryptographic Calculation", "E2E8F0"),
        ("DATA & EXTERNAL SERVICE TIER", "MongoDB Database (Collections: Users, Products, Categories, Orders)\nExternal Integration: PayHere Payment Gateway (CBSL Approved Sandbox)", "F8FAFC")
    ]
    
    for idx, (head_str, body_str, bg) in enumerate(arch_layers):
        cell = t_arch.rows[idx].cells[0]
        cell.width = Inches(6.2)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(4)
        r_head = p.add_run(head_str + "\n")
        r_head.font.name = "Times New Roman"
        r_head.font.size = Pt(11)
        r_head.font.bold = True
        r_head.font.color.rgb = RGBColor(15, 23, 42)
        r_body = p.add_run(body_str)
        r_body.font.name = "Times New Roman"
        r_body.font.size = Pt(9.5)
        r_body.font.color.rgb = RGBColor(71, 85, 105)
        set_cell_background(cell, bg)
        set_cell_margins(cell, top=80, bottom=80, left=100, right=100)
        border_s = {'val': 'single', 'sz': '4', 'color': 'CBD5E1'}
        set_cell_border(cell, top=border_s, bottom=border_s, left=border_s, right=border_s)

    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_after = Pt(6)

    add_subheading("3.2 Frontend Client Layer")
    add_body("The frontend is constructed as a high-performance Single Page Application (SPA) utilizing React 18.2, TypeScript 5.0, and Vite 5.4. The layout is designed mobile-first using Tailwind CSS 3.4. Global application state—such as user authentication sessions, role permissions, and shopping cart persistence—is orchestrated using the React Context API (AuthContext and CartContext) coupled with browser localStorage caching.")

    add_subheading("3.3 Backend Application Layer")
    add_body("The backend is powered by Node.js running an Express.js RESTful API server. The API strictly follows the Model-View-Controller (MVC) paradigm:")
    add_bullet("Define URL route endpoints (/api/products, /api/orders, /api/auth, /api/payment) and route incoming requests.", "• Routes: ")
    add_bullet("Encapsulate business logic, such as catalog filtering, inventory deduction, payment signature generation, and password verification.", "• Controllers: ")
    add_bullet("Handle cross-cutting concerns including JSON parsing, CORS headers, JWT verification (auth.js), and Administrator privilege guards (adminGuard).", "• Middleware: ")

    add_subheading("3.4 Database and Storage Layer")
    add_body("A MongoDB NoSQL document database acts as the primary datastore, interfaced via Mongoose 8.x Object Data Modeling (ODM). MongoDB was selected for its high write throughput, dynamic schema flexibility for diverse product attributes, and seamless JSON serialization with Express.")

    add_subheading("3.5 External Integrations (Payment Gateway)")
    add_body("The platform integrates the PayHere Sandbox Payment Gateway (approved by the Central Bank of Sri Lanka). Financial transactions are authenticated via MD5 cryptographic hashing calculated on the backend to guarantee zero client-side price tampering.")

    # =========================================================================
    # 4. TOOLS AND TECHNOLOGIES USED FOR DEVELOPMENT
    # =========================================================================
    add_title("4. Tools and Technologies Used for Development")
    add_body("The development of nr-accessories.lk leveraged modern, production-grade open-source tools across all architectural tiers. The table below summarizes the chosen technology stack along with technical justifications:")

    tech_data = [
        ("Layer / Category", "Technology", "Version", "Technical Justification & Purpose"),
        ("Frontend Framework", "React.js", "18.2.0", "Declarative component-based UI delivering fast Virtual DOM reconciliation and responsive state binding."),
        ("Language", "TypeScript", "5.0+", "Strongly-typed superset of JavaScript preventing compile-time bugs and enforcing data schemas."),
        ("Build Tool", "Vite", "5.4", "Ultra-fast Hot Module Replacement (HMR) and optimized ES-module build bundling."),
        ("Styling & CSS", "Tailwind CSS", "3.4", "Utility-first responsive styling framework enabling fluid mobile-first layouts without custom CSS bloat."),
        ("Iconography", "Lucide React", "0.344", "Crisp, lightweight SVG icons for navigation, cart badges, star ratings, and admin controls."),
        ("State Management", "React Context API", "Native", "Centralized global state management for User Authentication and Shopping Cart persistence."),
        ("Backend Runtime", "Node.js", "v18+", "Event-driven, non-blocking asynchronous JavaScript execution environment."),
        ("Web Framework", "Express.js", "4.19", "Robust REST routing framework supporting middleware chains and MVC controllers."),
        ("Database", "MongoDB", "7.0+", "High-throughput NoSQL document database ideal for flexible JSON-like product catalogs."),
        ("Database ODM", "Mongoose", "8.3", "Schema validation library enforcing referential integrity and population across documents."),
        ("Authentication", "JSON Web Tokens", "9.0", "Stateless cryptographic bearer token authentication for client-server sessions."),
        ("Password Security", "Bcrypt.js", "2.4", "Industry-standard salted password hashing algorithm preventing dictionary attacks."),
        ("Payment Gateway", "PayHere Sandbox", "v1.0", "Central Bank of Sri Lanka compliant payment aggregator for local card transactions."),
        ("QA & Verification", "Puppeteer", "22.0+", "Headless Chrome browser automation framework for automated mobile audits and test validation."),
        ("Version Control", "Git & GitHub", "Latest", "Distributed source control for codebase versioning, tracking, and collaboration.")
    ]

    t_tech = doc.add_table(rows=len(tech_data), cols=4)
    t_tech.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_tech.autofit = False

    for row_idx, row_values in enumerate(tech_data):
        row = t_tech.rows[row_idx]
        is_header = (row_idx == 0)
        widths = [Inches(1.4), Inches(1.1), Inches(0.8), Inches(2.9)]
        
        for col_idx, val in enumerate(row_values):
            cell = row.cells[col_idx]
            cell.width = widths[col_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.05
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.space_before = Pt(2)
            if col_idx == 2:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(10 if not is_header else 10.5)
            if is_header:
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
            else:
                run.font.color.rgb = RGBColor(0, 0, 0)
                
            if is_header:
                set_cell_background(cell, "1E293B")
            elif row_idx % 2 == 1:
                set_cell_background(cell, "F8FAFC")
            else:
                set_cell_background(cell, "FFFFFF")
                
            set_cell_margins(cell, top=60, bottom=60, left=80, right=80)
            b_s = {'val': 'single', 'sz': '4', 'color': 'CBD5E1'}
            set_cell_border(cell, top=b_s, bottom=b_s, left=b_s, right=b_s)

    p_sp2 = doc.add_paragraph()
    p_sp2.paragraph_format.space_after = Pt(6)

    # =========================================================================
    # 5. DATABASE DESIGN
    # =========================================================================
    add_title("5. Database Design")

    add_subheading("5.1 Database Architecture Rationale")
    add_body("A document-based database model using MongoDB was chosen because e-commerce catalogs contain semi-structured product specifications (e.g., varying cable lengths, charger wattages, case colors, and warranty terms) that fit naturally into flexible JSON documents. Foreign key references (ObjectId) are utilized to maintain relational links between users, products, categories, and orders.")

    add_subheading("5.2 Entity-Relationship (ER) Overview")
    add_body("The data architecture comprises four interconnected collections: Users, Categories, Products, and Orders. The entity-relationship model establishes one-to-many associations between Categories and Products, as well as between Users and Orders.")

    # Embed ER Diagram
    add_image_figure("document/evidence/evidence_database_er_diagram.png", "Figure 5.1: Complete Entity-Relationship (ER) Diagram of nr-accessories.lk Database Architecture", width=Inches(5.6))

    add_subheading("5.3 Detailed Collection Schemas")

    add_body("5.3.1 Users Collection (User.js): Holds registered customer profiles and store administrator credentials.", bold_prefix=None)
    add_bullet("_id: ObjectId (Primary Key, unique document identifier)", "• ")
    add_bullet("name: String (Required, customer's full name)", "• ")
    add_bullet("email: String (Required, unique indexed, lowercased)", "• ")
    add_bullet("password: String (Required, Bcrypt 10-round salted hash)", "• ")
    add_bullet("role: String (Enum: 'customer' | 'admin', default: 'customer')", "• ")
    add_bullet("phone: String (Customer contact phone number)", "• ")
    add_bullet("addresses: Array of Subdocuments [addressLine1, city, district, postalCode]", "• ")
    add_bullet("createdAt, updatedAt: Date (Automated timestamps)", "• ")

    add_body("5.3.2 Products Collection (Product.js): Stores smartphone accessories, live stock counts, and pricing.", bold_prefix=None)
    add_bullet("_id: ObjectId (Primary Key)", "• ")
    add_bullet("title: String (Product title, e.g., 'Anker 30W GaN Fast Charger')", "• ")
    add_bullet("brand: String (Manufacturer, e.g., 'Anker', 'Spigen', 'Baseus', 'Apple')", "• ")
    add_bullet("category: ObjectId (Foreign key reference to Category._id)", "• ")
    add_bullet("description: String (Comprehensive specifications and compatibility notes)", "• ")
    add_bullet("price: Number (Regular retail price in LKR)", "• ")
    add_bullet("discountPrice: Number (Promotional selling price in LKR, optional)", "• ")
    add_bullet("stockQuantity: Number (Real-time available inventory counter)", "• ")
    add_bullet("imageURL: String (Local image path or web URL, e.g., '/images/anker_30w.jpg')", "• ")
    add_bullet("isFeatured: Boolean (Flags product for promotional hero sections)", "• ")

    add_body("5.3.3 Categories Collection (Category.js): Classifies accessories into structured catalog taxonomy.", bold_prefix=None)
    add_bullet("_id: ObjectId (Primary Key)", "• ")
    add_bullet("name: String (Category title, e.g., 'Cases & Covers', 'Chargers & Adapters')", "• ")
    add_bullet("slug: String (URL-friendly string, e.g., 'cases-covers')", "• ")
    add_bullet("description: String (Taxonomy overview)", "• ")

    add_body("5.3.4 Orders Collection (Order.js): Captures customer checkout records, payment statuses, and fulfillment.", bold_prefix=None)
    add_bullet("_id: ObjectId (Primary Key)", "• ")
    add_bullet("user: ObjectId (Foreign key reference to User._id)", "• ")
    add_bullet("items: Array of embedded items [{ product: ObjectId, title: String, quantity: Number, unitPrice: Number }]", "• ")
    add_bullet("deliveryAddress: Embedded object { fullName, phone, streetAddress, city, district }", "• ")
    add_bullet("paymentMethod: String (Enum: 'payhere' | 'cash_on_delivery')", "• ")
    add_bullet("paymentStatus: String (Enum: 'pending' | 'paid' | 'failed')", "• ")
    add_bullet("orderStatus: String (Enum: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')", "• ")
    add_bullet("subtotal: Number, deliveryCharge: Number, totalAmount: Number (Calculated on server)", "• ")

    add_subheading("5.4 Data Integrity, Foreign Keys, and Indexing")
    add_body("To maintain relational consistency in a NoSQL environment, Mongoose population middleware dynamically resolves references. A unique index on User.email prevents duplicate registrations. Stock decrement operations ($inc: { stockQuantity: -quantity }) execute atomically upon payment verification to prevent race conditions.")

    # =========================================================================
    # 6. UI SCREENSHOTS AND FUNCTIONAL WALKTHROUGH
    # =========================================================================
    add_title("6. User Interface (UI) Screenshots and Functional Walkthrough")
    add_body("This section demonstrates the complete functional walkthrough of nr-accessories.lk across all mandatory evaluation categories, accompanied by authentic system screenshots.")

    add_subheading("6.1 User Management Functionalities")
    add_body("The user management module provides a secure onboarding experience. New visitors can register via /register with real-time validation checking email syntax and password length. Existing users authenticate at /login, receiving a signed JWT stored securely in the browser session. Upon authentication, the header dynamically updates to display the customer's name and profile menu.")
    add_body("In the Customer Profile (/profile), users can review their order history and update their personal delivery address (street address, city, district, contact number). Updated profiles are written directly to MongoDB and automatically pre-fill the checkout form on future visits.")

    add_image_figure("document/evidence/evidence_user_login.png", "Figure 6.1 (a): Customer Sign In Authentication Screen with JWT Issuance", width=Inches(5.5))
    add_image_figure("document/evidence/evidence_user_profile.png", "Figure 6.1 (b): Customer Profile Management and Delivery Address Update Interface", width=Inches(5.5))

    add_subheading("6.2 Product Browsing, Search, and Filtering")
    add_body("The product catalog (/shop) presents all active accessories in a responsive grid layout. Each product card displays a high-resolution image, brand tag, title, regular price, promotional discount percentage, and a live inventory badge (In Stock vs. Out of Stock).")
    add_body("The platform features instant keyword search: typing brand names (e.g., 'Anker', 'Spigen') or product keywords instantly updates the catalog without page reloads. In addition, users can filter by Category (Cases, Screen Protectors, Chargers, Audio), Brand, and Price Range sliders.")
    add_body("Clicking any product opens the Product Details Page (/product/:id), featuring a photo gallery with hover zoom, technical specifications, device compatibility charts, warranty information, and an interactive quantity selector automatically bounded by available inventory.")

    add_image_figure("document/evidence/evidence_shop_catalog.png", "Figure 6.2 (a): Product Listing Catalog with Real-Time Search Bar and Category Filter Controls", width=Inches(5.5))
    add_image_figure("document/evidence/evidence_product_detail.png", "Figure 6.2 (b): Product Details Page Featuring Dynamic Quantity Selector and Specifications", width=Inches(5.5))

    add_subheading("6.3 Shopping Cart System and Local Persistence")
    add_body("Customers can add items to their cart directly from product cards or detail pages. The Shopping Cart is accessible via a slide-over drawer or dedicated /cart page. Key capabilities include:")
    add_bullet("Users can increment or decrement item quantities; line item subtotals, courier delivery fees, and net grand totals recalculate instantaneously.", "Dynamic Quantity Steppers: ")
    add_bullet("Items can be removed with a single click, instantly updating total costs.", "Item Removal: ")
    add_bullet("Cart state is synchronized with localStorage. Even if the customer refreshes the browser or closes the tab, cart items and quantities remain completely intact.", "Session Persistence: ")

    add_image_figure("document/evidence/evidence_cart_quantity_math.png", "Figure 6.3 (a): Shopping Cart Summary Demonstrating Real-Time Quantity Arithmetic and Subtotal Math", width=Inches(5.5))
    add_image_figure("document/evidence/evidence_cart_refresh_persistence.png", "Figure 6.3 (b): Verified Cart Session Persistence Preserved in Local Storage Across Page Refresh", width=Inches(5.5))

    add_subheading("6.4 Checkout Process and Real-Time Form Validation")
    add_body("The checkout module (/checkout) adopts a conversion-optimized two-column layout. The right column displays an itemized order summary, including courier charges (free shipping on orders above Rs. 7,500). The left column presents the delivery contact form.")
    add_body("A distinctive usability feature of nr-accessories.lk is Real-Time Visual Validation: as users type their full name, email, Sri Lankan phone number (e.g., 070 388 8085), and street address, fields provide immediate visual feedback with a vibrant green border and a green checkmark (✓). If an invalid entry is made, an alert message gently clarifies the required format prior to submission.")

    add_image_figure("document/evidence/evidence_usability_form_validation.png", "Figure 6.4 (a): Real-Time Form Validation with Instant Green Checkmark Feedback", width=Inches(5.5))
    add_image_figure("document/evidence/evidence_checkout_payhere_total.png", "Figure 6.4 (b): Checkout Page Order Summary with Net Total Calculation Prior to Payment", width=Inches(5.5))

    add_subheading("6.5 Order Confirmation and Customer Order History Tracking")
    add_body("Upon successful transaction verification, customers are directed to the Order Confirmation Page (/order-success/:id). The confirmation screen presents the unique Order ID, receipt summary, delivery address breakdown, and estimated delivery timeline. Customers can also revisit their personal Order History under My Profile to track order fulfillment stages.")

    add_image_figure("document/evidence/evidence_order_confirmation.png", "Figure 6.5 (a): Customer Order Receipt and Confirmation Screen", width=Inches(5.5))
    add_image_figure("document/evidence/evidence_payment_success_verified.png", "Figure 6.5 (b): Verified Payment Success Confirmation Screen with Order Reference", width=Inches(5.5))

    add_subheading("6.6 Admin Management Suite (Dashboard, Product CRUD, Fulfillment)")
    add_body("The Store Administrator Suite (/admin) fulfills all administrative evaluation requirements and is protected by role-based JWT route guards:")
    add_bullet("Presents high-level business analytics: Total Revenue, Total Orders Placed, Active Products in Catalog, and a Low Stock Alert counter (stock <= 5 items).", "1. Analytical Dashboard Overview: ")
    add_bullet("Admins can create new items using an interactive modal with live image thumbnail previews, edit existing prices and inventory, or safely delete discontinued accessories.", "2. Product Inventory CRUD: ")
    add_bullet("Admins inspect incoming customer orders, customer contact phone numbers, and delivery addresses, and transition order statuses (Pending -> Processing -> Shipped -> Delivered).", "3. Order Fulfillment Management: ")
    add_bullet("View registered user accounts and manage administrative privileges.", "4. User Management: ")

    add_image_figure("document/evidence/evidence_admin_dashboard.png", "Figure 6.6 (a): Admin Dashboard Overview with Key Performance Indicator (KPI) Metric Cards", width=Inches(5.5))
    add_image_figure("document/evidence/evidence_admin_product_crud.png", "Figure 6.6 (b): Admin Product CRUD Management Modal with Real-Time Thumbnail Image Preview", width=Inches(5.5))
    add_image_figure("document/evidence/evidence_admin_order_management.png", "Figure 6.6 (c): Admin Order Management Dashboard with Status Dropdown Controls", width=Inches(5.5))

    add_subheading("6.7 Mobile Usability and Responsive Viewports (375px+)")
    add_body("Recognizing that the vast majority of e-commerce traffic in Sri Lanka originates from mobile devices, the platform underwent rigorous mobile usability auditing on a 375px viewport (representing Apple iPhone SE, iPhone 13 mini, and standard Android screens). The audit confirmed zero horizontal overflow, fluid touch drawers, and a persistent Bottom Mobile Tab Bar providing single-thumb access to Home, Shop, Cart, and Profile.")

    add_image_figure("document/evidence/evidence_mobile_responsive_375px.png", "Figure 6.7 (a): Audited 375px Mobile Viewport Showing Zero Sideways Scroll and Fluid Layout", width=Inches(4.5))
    add_image_figure("document/evidence/evidence_mobile_drawer_menu.png", "Figure 6.7 (b): Off-Canvas Mobile Navigation Drawer and Touch-Friendly Navigation Controls", width=Inches(4.5))

    # =========================================================================
    # 7. SECURITY FEATURES IMPLEMENTED
    # =========================================================================
    add_title("7. Security Features Implemented")
    add_body("The nr-accessories.lk platform integrates multiple layers of security to protect consumer personal data and guarantee the integrity of financial transactions:")

    add_subheading("7.1 Cryptographic Password Hashing (Bcrypt)")
    add_body("Plaintext passwords are never stored in the database. During user registration, the system invokes bcrypt.genSalt(10) to generate a 10-round salted one-way cryptographic hash. Even in the event of an unauthorized database dump, passwords cannot be reversed or cracked using rainbow table attacks.")

    add_subheading("7.2 Stateless Authentication via JSON Web Tokens (JWT)")
    add_body("User sessions are managed statelessly using cryptographically signed JSON Web Tokens (JWT). When a user logs in, the Express server signs a token payload containing their user ID and role using a secret environment key (JWT_SECRET) with a 7-day expiration. The client includes this token in the HTTP Authorization: Bearer header for protected API calls.")

    add_subheading("7.3 Role-Based Access Control (RBAC) Route Guards")
    add_body("To prevent unauthorized manipulation of catalog data or administrative views, the backend implements two-tiered middleware guards: auth.js verifies the authenticity of the JWT token, while adminGuard inspects the decoded user role. Non-admin requests attempting to perform CRUD actions on /api/products or view all orders are rejected with HTTP 403 Forbidden.")

    add_subheading("7.4 Input Sanitization and Dual-Layer Validation")
    add_body("Security validation is enforced across both client and server boundaries. The frontend verifies email syntax and Sri Lankan mobile numbers via regex patterns. On the backend, Mongoose schema validators enforce data types, required constraints, and positive number boundaries (preventing negative prices or negative stock quantities).")

    add_subheading("7.5 Payment Hash Signature Verification (MD5 Hashing)")
    add_body("To prevent malicious actors from altering order amounts using browser developer tools, payment hashes are calculated strictly on the backend. The server generates an MD5 hash combining the Merchant ID, Order ID, Formatted Amount, Currency, and the hashed Merchant Secret. The PayHere gateway validates this cryptographic signature before accepting payment.")

    add_subheading("7.6 CORS and Environment Isolation")
    add_body("Cross-Origin Resource Sharing (CORS) middleware restricts API access exclusively to authorized frontend origins. Sensitive credentials—including MongoDB Atlas connection strings, JWT secret keys, and PayHere merchant secrets—are isolated inside server/.env files and excluded from version control via .gitignore.")

    # =========================================================================
    # 8. PAYMENT WORKFLOW EXPLANATION
    # =========================================================================
    add_title("8. Payment Workflow Explanation")

    add_subheading("8.1 PayHere Payment Gateway Integration Architecture")
    add_body("PayHere is the leading Central Bank of Sri Lanka (CBSL) approved payment aggregator, supporting Visa, MasterCard, AMEX, and digital banking methods in Sri Lankan Rupees (LKR). The nr-accessories.lk platform integrates PayHere Sandbox via an asynchronous modal popup workflow.")

    add_subheading("8.2 End-to-End Payment Sequence")
    add_body("The payment transaction proceeds through seven distinct phases:")
    add_bullet("Customer clicks 'Pay with PayHere' on the checkout page.", "1. Checkout Initiation: ")
    add_bullet("The client sends a POST request with line items and delivery address to /api/orders.", "2. Order Staging: ")
    add_bullet("The server calculates net totals, creates a MongoDB order record with status 'pending', and generates an MD5 verification hash token.", "3. Cryptographic Signature: ")
    add_bullet("The frontend initializes the official PayHere Javascript SDK (payhere.startPayment) with merchant credentials and generated hash.", "4. Modal Launch: ")
    add_bullet("The customer enters sandbox card details (4111 1111 1111 1111), expiry date, CVV, and OTP.", "5. Card Verification: ")
    add_bullet("PayHere validates credentials and triggers the onCompleted callback.", "6. Callback Verification: ")
    add_bullet("The backend transitions the order status to 'paid', decrements inventory stock atomically, and redirects the user to the Order Confirmation page.", "7. Fulfillment & Stock Decrement: ")

    add_image_figure("document/evidence/evidence_payhere_sandbox_modal.png", "Figure 8.1: Official PayHere Sandbox Payment Gateway Checkout Modal with Test Card Processing", width=Inches(5.5))

    add_subheading("8.3 Security Hash Generation Mechanism")
    add_body("The backend calculates the verification hash using Node.js's native crypto module according to PayHere's security specification:")
    add_body("hash = MD5(merchant_id + order_id + amountFormatted + currency + MD5(merchant_secret))", bold_prefix="Formula: ")
    add_body("To prevent floating-point precision mismatch, amounts are strictly formatted to two decimal places (amount.toFixed(2)). The merchant secret is stored securely on the server and is never exposed to the client browser.")

    add_subheading("8.4 Order Status Lifecycle")
    add_body("The order fulfillment lifecycle is tracked through five progressive statuses:")
    add_bullet("Order created in database, awaiting customer payment.", "• Pending: ")
    add_bullet("Payment verified through PayHere; product stock quantities decremented.", "• Paid: ")
    add_bullet("Store administrator packs accessories and generates dispatch airway bills.", "• Processing: ")
    add_bullet("Order handed over to courier service with tracking consignment number.", "• Shipped: ")
    add_bullet("Package safely delivered and signed for by the customer.", "• Delivered: ")

    # =========================================================================
    # 9. TESTING AND QUALITY ASSURANCE RESULTS
    # =========================================================================
    add_title("9. Testing and Quality Assurance Results")

    add_subheading("9.1 Usability Testing & UX Audits")
    add_body("Usability testing was conducted with a representative group of five target users to assess task completion rates, interface clarity, and friction points:")
    add_bullet("All users located a specific phone case and fast charger within 15 seconds using the top search bar and category chips.", "• Search & Filter Efficiency: ")
    add_bullet("Users noted that the real-time green checkmarks (✓) gave them high confidence that their phone number and delivery address were properly entered.", "• Input Validation Clarity: ")
    add_bullet("Users tested closing their browser with items in the cart; upon reopening, 100% of items and quantities were restored from localStorage.", "• Cart Resilience: ")

    add_subheading("9.2 Automated End-to-End Testing (Puppeteer QA)")
    add_body("To guarantee rigorous software quality assurance, an automated browser testing suite was implemented using Puppeteer (scripts/run_qa_verification.cjs). The script launches headless Chrome instances, emulates realistic mobile viewports, executes user workflows, and records photographic evidence to document/evidence/.")

    add_subheading("9.3 Test Case Execution Matrix")
    add_body("The results of the automated and manual test cases are summarized in the execution matrix below:")

    test_matrix = [
        ("Test ID", "Test Scenario", "Execution Procedure", "Expected Result", "Status"),
        ("TC-MOB-01", "375px Mobile Viewport Audit", "Emulate 375px width in headless Chrome; inspect overflow.", "Zero horizontal scroll bar; touch targets >= 48px.", "PASSED"),
        ("TC-VAL-01", "Real-Time Input Validation", "Enter valid and invalid phone numbers & emails into form.", "Instant green border & checkmark (✓) on valid input.", "PASSED"),
        ("TC-CRT-01", "Cart Arithmetic & Subtotals", "Increment item quantity by +1 and +2; check net totals.", "Subtotal and delivery charge recalculate in real-time.", "PASSED"),
        ("TC-PER-01", "Cart Session Persistence", "Add items to cart, trigger hard browser reload (Cmd+R).", "Cart items, quantities, and totals 100% preserved.", "PASSED"),
        ("TC-PAY-01", "PayHere Gateway Precision", "Send cart total to backend cryptographic hash generator.", "MD5 hash generated matching PayHere two-decimal spec.", "PASSED"),
        ("TC-ADM-01", "Admin Product CRUD", "Create new product via admin modal; verify in storefront.", "Product saved to MongoDB and immediately displayed in catalog.", "PASSED"),
        ("TC-SEC-01", "Admin Route Guard Check", "Attempt to access /admin using standard customer JWT.", "Request rejected with HTTP 403 Forbidden / redirected.", "PASSED")
    ]

    t_test = doc.add_table(rows=len(test_matrix), cols=5)
    t_test.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_test.autofit = False

    for row_idx, row_values in enumerate(test_matrix):
        row = t_test.rows[row_idx]
        is_header = (row_idx == 0)
        widths = [Inches(1.0), Inches(1.3), Inches(1.5), Inches(1.8), Inches(0.7)]
        
        for col_idx, val in enumerate(row_values):
            cell = row.cells[col_idx]
            cell.width = widths[col_idx]
            p = cell.paragraphs[0]
            p.paragraph_format.line_spacing = 1.05
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.space_before = Pt(2)
            if col_idx in [0, 4]:
                p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            else:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                
            run = p.add_run(val)
            run.font.name = "Times New Roman"
            run.font.size = Pt(9.5 if not is_header else 10)
            if is_header:
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
            elif col_idx == 4:
                run.font.bold = True
                run.font.color.rgb = RGBColor(22, 101, 52)  # Dark green for PASSED
            else:
                run.font.color.rgb = RGBColor(0, 0, 0)
                
            if is_header:
                set_cell_background(cell, "1E293B")
            elif row_idx % 2 == 1:
                set_cell_background(cell, "F8FAFC")
            else:
                set_cell_background(cell, "FFFFFF")
                
            set_cell_margins(cell, top=50, bottom=50, left=70, right=70)
            b_s = {'val': 'single', 'sz': '4', 'color': 'CBD5E1'}
            set_cell_border(cell, top=b_s, bottom=b_s, left=b_s, right=b_s)

    p_sp3 = doc.add_paragraph()
    p_sp3.paragraph_format.space_after = Pt(6)

    # =========================================================================
    # 10. CONCLUSION AND FUTURE ENHANCEMENTS
    # =========================================================================
    add_title("10. Conclusion and Future Enhancements")

    add_subheading("10.1 Project Summary")
    add_body("The development of nr-accessories.lk successfully fulfilled all academic and practical requirements specified in the ICT2142 E-Business Systems curriculum. The platform delivers an authentic, high-speed, and secure online shopping experience tailored specifically for the Sri Lankan smartphone accessories market. By coupling a React-based Single Page Application with a Node.js/Express REST backend and MongoDB persistence, the system demonstrates high performance, elegant UI ergonomics, and rock-solid financial security via PayHere integration.")

    add_subheading("10.2 Challenges Encountered and Solutions")
    add_bullet("PayHere rejected payment verification tokens due to subtle differences between JavaScript floating-point numbers and PayHere's expected two-decimal string format. Solution: Implemented standardized .toFixed(2) currency formatting across all backend hash calculations.", "1. Handling Currency Precision in Payment Hashing: ")
    add_bullet("Product comparison tables and navigation menus caused horizontal clipping on 375px mobile screens. Solution: Redesigned the mobile navigation to feature a fixed bottom tab bar (MobileTabBar.tsx) and an off-canvas drawer (MobileMenu.tsx).", "2. Mobile Viewport Overflow on Small Devices: ")
    add_bullet("Refreshing the page caused React state to reset to empty. Solution: Built an automatic persistence bridge linking React Context with browser localStorage.", "3. Cart Synchronization Across Page Refreshes: ")

    add_subheading("10.3 Future System Enhancements")
    add_bullet("Connect the backend directly with third-party logistics APIs (e.g., Pronto, Domex, Koombiyo) to automatically generate tracking waybills and return real-time courier GPS tracking.", "• Integration with Local Courier APIs: ")
    add_bullet("Integrate localized installment payment methods (Koko and Mintpay) to enhance affordability for high-ticket charging stations and premium audio gear.", "• Buy Now Pay Later (BNPL) Integration: ")
    add_bullet("Introduce an intelligent search widget where customers select their exact smartphone model (e.g., iPhone 15 Pro Max) to receive an automatically filtered, curated bundle of compatible cases, screen protectors, and fast chargers.", "• AI-Driven Compatibility Recommender: ")
    add_bullet("Send automated dispatch confirmations and delivery PINs to customers' mobile phones upon status changes.", "• Automated SMS & WhatsApp Alerts: ")

    # =========================================================================
    # 11. REFERENCES
    # =========================================================================
    add_title("11. References")
    
    references = [
        "Chaffey, D. (2019). Digital Business and E-Commerce Management: Strategy, Implementation and Practice. 7th edn. Pearson Education.",
        "Laudon, K.C. and Traver, C.G. (2022). E-Commerce: Business, Technology, Society. 17th edn. London: Pearson.",
        "React Documentation (2024). React 18 Architecture and Hooks Reference. Meta Platforms, Inc. Available at: https://react.dev/ (Accessed: 15 October 2026).",
        "Express.js Foundation (2024). Express 4.x - Fast, unopinionated, minimalist web framework for Node.js. Available at: https://expressjs.com/ (Accessed: 18 October 2026).",
        "MongoDB, Inc. (2024). MongoDB Documentation: High-performance NoSQL Document Datastore and Mongoose 8.x ODM Guides. Available at: https://www.mongodb.com/docs/ (Accessed: 20 October 2026).",
        "PayHere Knowledge Base (2024). PayHere Payment Gateway Merchant Integration Manual and MD5 Security Hash Calculation. PayHere (Pvt) Ltd, Sri Lanka. Available at: https://support.payhere.lk/ (Accessed: 22 October 2026).",
        "Central Bank of Sri Lanka (2023). Payments Bulletin: Trends in Electronic Payments and Mobile Financial Services in Sri Lanka. CBSL Publications.",
        "Mozilla Developer Network (MDN) (2024). Web Security: Cross-Origin Resource Sharing (CORS) and Password Hashing Mechanisms. Available at: https://developer.mozilla.org/ (Accessed: 24 October 2026)."
    ]

    for ref in references:
        add_bullet(ref)

    # Save document
    output_path = "document/TG20242147_ICT2142_Final_Report.docx"
    doc.save(output_path)
    print(f"Report successfully saved to: {output_path}")

if __name__ == "__main__":
    create_report()

