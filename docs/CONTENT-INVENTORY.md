# Content inventory of the old Wix site

Source: <https://nora936.wixsite.com/radikal> (Wix free plan), crawled on 2026-11-25.
Every page reachable from the menu, footer and in-page links was fetched (server-rendered HTML,
plus a real browser for client-rendered widgets). The cleaned crawl is kept in
[`docs/source/wix/`](source/wix/) and drives the automated parity check
([`CONTENT-PARITY.md`](CONTENT-PARITY.md), `npm run content:parity`).

Wix advertising banners ("This website was built on Wix…", "Get Started") were ignored.

## Site-wide facts

| Item                   | Value on the Wix site                                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pages                  | 15 (11 in the menu, 4 legal pages in the footer)                                                                                                                                                             |
| Languages              | English only (`<html lang="en">`), no language switcher, no hreflang                                                                                                                                         |
| Logo                   | Black tree with roots and the word RADIKAL (`3685dd_bea7e75cbd894bc7b437fe94fa70cc82~mv2.png`, 5434×4500) → `public/images/radikal-logo.png`                                                                 |
| Share image (og:image) | The same logo                                                                                                                                                                                                |
| Title pattern          | `<Page> \| RADIKAL` (home: `Home \| RADIKAL`)                                                                                                                                                                |
| Meta descriptions      | None on any page                                                                                                                                                                                             |
| Favicon                | Wix default (no custom favicon)                                                                                                                                                                              |
| Phone                  | 877-723-4525                                                                                                                                                                                                 |
| Email                  | info@radikal.co (the Wix link actually pointed to `mailto:info@mysite.com`)                                                                                                                                  |
| Location               | Haiti                                                                                                                                                                                                        |
| Social                 | LinkedIn `https://www.linkedin.com/company/radikal-col`, Facebook `https://www.facebook.com/radikal.coop/`, Instagram `https://www.instagram.com/radikal.coop`, TikTok `https://www.tiktok.com/@radikal.co`  |
| Copyright              | © 2035 by radikal.co. Powered and secured by Wix                                                                                                                                                             |
| Skip link              | "Skip to Main Content"                                                                                                                                                                                       |
| Colours                | deep green `#052812` (text), moss `#445D4A` (hero, buttons), sage `#9DB39F` (bands), pale green `#D4E9CF` (panels), cream `#FFFAF1` (background)                                                             |
| Fonts                  | Headings "Fraunces 120pt Light" (→ Fraunces, Google Fonts); body "Avenir LT 35 Light" (→ Nunito Sans, closest free match)                                                                                    |
| Layout                 | Sticky header with a "Menu" button (left; opens the full menu on every screen size), centred logo, "Invest" button (right); full-width colour bands; footer with logo, contact, social icons and legal links |

### Main menu

- Who We Are (group): Our Story `/our-story`, Our Values `/our-values`
- What We Do (group): Our Solutions `/s-projects-side-by-side`, Our Impact `/our-impact`
- Invest in Saradi `/investinsaradi`
- Our Initiatives `/projects-6`: Hurricane Melissa Relief `/melissahurricanerelief`, Fund Our Initiatives `/fundourinitiatives`
- Join the Movement (group): Take Action `/get-involved`
- FAQ `/faq`

### Footer links

Privacy Policy `/blank`, Accessibility Statement `/blank-1`, Terms & Conditions `/blank-2`,
Refund Policy `/blank-3`.

### Forms and widgets

| Where                     | What                                                                        | Fields / labels                                                                                                                                                                                                                                                                                         |
| ------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Invest in Saradi          | Wix donation form (Wix Payments)                                            | "Frequency": One time / Monthly; "Amount": 4 options + "Other"; "Comment (optional)" (0/100); button "Invest $… Monthly"; share: Facebook, X (Twitter), WhatsApp, Copy link                                                                                                                             |
| Hurricane Melissa Relief  | Wix donation form                                                           | "Amount": 5 options + "Other"; "Comment (optional)"; button "Donate $…"; share buttons                                                                                                                                                                                                                  |
| Fund Our Initiatives (×3) | Wix donation forms                                                          | "Frequency", "Amount" (5 options each), "Comment (optional)"; button "Contribute $… Monthly"; share buttons                                                                                                                                                                                             |
| Take Action               | Newsletter form                                                             | Heading "Be the first to know"; "Enter your email here" (email); button "Sign Up"; confirmation "Thanks for submitting!"                                                                                                                                                                                |
| Home                      | Instagram feed widget (@radikal.coop)                                       | "Follow us on Instagram", "@radikal.coop", "Load more"                                                                                                                                                                                                                                                  |
| Home, Take Action         | Instagram feed widget (therootingproject), titled "Our Podcast" / "Podcast" | Profile picture, "therootingproject", "The Rooting Project", bio, link `https://podcasts.apple.com/us/podcast/the-rooting-project/id1498319102`, button "Follow" (opens instagram.com), 10 posts (picture, caption, date) in a collage of 5 with "Load More"; each post opens a viewer with its caption |

## Needs the owner

Nothing below was guessed. Each item is either kept exactly as on Wix or replaced by the most
neutral working option, and needs a decision from Nora.

1. **Donations and payments.** The Wix donation forms used Wix Payments, which does not exist
   outside Wix. Each donation section now lists the same giving levels and a button that opens an
   email to info@radikal.co. Please provide the payment page to use (for example a Stripe Payment
   Link, PayPal, Givebutter or Donorbox page) for: Invest in Saradi, Hurricane Melissa Relief,
   Makaya, Clean Water & Coastlines and Pathway to Stability. It is one field per section in the
   content (`button.href` of the donation section). The "Other" amount, comment box and "Copy link" were not carried over.
2. **Newsletter.** "Sign Up" on Take Action opens an email to info@radikal.co. Provide a
   newsletter sign-up link (Mailchimp, Buttondown, etc.) to replace it.
3. **Legal pages are unedited Wix templates.** Privacy Policy, Accessibility Statement, Terms &
   Conditions and Refund Policy contain Wix's own instructions ("[enter relevant date]", "check out
   our article…", "you need to delete this section"). They were copied word for word as required,
   are hidden from search engines (`noindex`) and left out of the sitemap. Real text is needed.
4. **Copyright line** "© 2035 by radikal.co." — 2035 comes from the Wix template. "Powered and
   secured by Wix" was removed because it is no longer true. Confirm the year.
5. **Email link** pointed to `mailto:info@mysite.com` (a Wix placeholder) although it showed
   info@radikal.co. The new site uses info@radikal.co. Confirm.
6. **LinkedIn URL** is `linkedin.com/company/radikal-col`, possibly a typo for `radikal-co`. Kept as is.
7. **Truncated text** on Fund Our Initiatives, Pathway to Stability, $125: "…focusing on upskilling
   in areas like digital lite" (cut off on Wix). Kept as is; please provide the full sentence.
8. **Naming differences** kept as on Wix: "Pathways to Stability" (Our Initiatives) vs "Pathway to
   Stability" (Fund Our Initiatives); "Clean Water and Coastlines" vs "Clean Water & Coastlines".
9. **"Four-fold impact"** (Invest in Saradi) is followed by three effects (Economic Stability,
   Gender Empowerment, Local Value Chain Strength). A fourth may be missing.
10. **Podcast.** The Wix "Our Podcast" / "Podcast" blocks were an Instagram feed of
    _therootingproject_. They are rebuilt as static content: profile picture, bio, Apple Podcasts
    link, "Follow" button to `https://www.instagram.com/therootingproject/`, and all 10 posts with
    their captions and dates, transcribed from the widget. Instagram does not offer the original
    files without a login, so the post pictures (about 440 px) and the profile picture (50 px) were
    captured from the widget as displayed; two posts were videos and are shown as a still. Please
    replace them with the original pictures for sharper images. Likes and comments were not copied.
11. **Instagram posts** (home feed) are live third-party content with expiring image URLs and were
    not copied. The section links to @radikal.coop instead.
12. **Alt text.** Wix had no alt text (only camera file names such as "IMG_2720_edited.jpg").
    Descriptive alt texts were written from what each photo shows; please review them.
13. **Search descriptions.** Wix had none. Each page's description is a sentence taken word for
    word from that page; adjust in each page's `seo.description`.
14. **New interface texts** that did not exist on Wix (needed for accessibility and the menu):
    "Close", "Main menu", "Legal", "Social media", "Share", gallery "Close / Previous / Next", the
    breadcrumb name "Home", and the 404 page ("Page not found" / "The page you are looking for does
    not exist or has moved." / "Home"). All editable in Site settings.
15. **Video.** Wix serves the relief video publicly only at 360p. Send the original file for better
    quality, and a captions file (.vtt) if people speak in it.
16. **Pathways to Stability image** is the RADIKAL logo (as on Wix); a photo may work better.
17. **Phone number** 877-723-4525 kept as on Wix; confirm it is current.

## Page by page

Text is reproduced exactly as crawled (whitespace normalised). Images are listed with their Wix
media id and the local file they were downloaded to at full resolution (EXIF/GPS metadata
removed for privacy; pixels unchanged).

### Home

- URL: https://nora936.wixsite.com/radikal
- Title tag: `Home | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/`

- **H1:** Welcome to RADIKAL
- Paragraph: a pioneering social enterprise at the
- Paragraph: intersection of technology, food systems, and
- Paragraph: community empowerment.
- Paragraph: we are building sustainable futures by investing in local communities, fostering economic self-sufficiency, and championing environmental resilience in Haiti and beyond.
- Image: `3685dd_32977ef51477442da80a5427b12c3d8d~mv2.jpg` (no alt text on Wix) → `public/images/home-street-food-vendor.jpg`
- **H2:** Rooting Livelihoods. Cultivating Sovereignty.
- Paragraph: Empowering women to lead, RADIKAL cultivates sovereignty and resilience across Haiti and its diaspora. We're transforming communities through sustainable micro-enterprise, planting the seeds for a self-determined future.
- **H2:** The Power of the Madan Sara: The Origin
- Image: `3685dd_fa274908553649429648f83c9753c832~mv2.png` (no alt text on Wix) → `public/images/madan-sara-bird.png`
- **H2:** Our Aspiration. Their Legacy.
- Paragraph: At RADIKAL, our work is built upon the fierce, indispensable legacy of the Madan Sara; the legendary women traders who serve as the economic and literal backbone of Haiti.
- Link/button: "Learn More" → `https://nora936.wixsite.com/radikal/investinsaradi`
- Image: `3685dd_8f1107b99d204d82927125a9faac0d7d~mv2.jpeg` (no alt text on Wix) → `public/images/home-our-aspiration.jpg`
- **H1:** Invest in Women
- Paragraph: Cultivating Sovereignty. Empowering Women. Building Resilience.
- Link/button: "Start Now" → `https://nora936.wixsite.com/radikal/investinsaradi`
- **H2:** Follow us on Instagram
- Link/button: "@radikal.coop" → `https://www.instagram.com/radikal.coop`
- Button: "Load more"
- **H2:** Our Podcast
- Embedded widget: Instagram Feed (third-party iframe)

### Invest in Saradi

- URL: https://nora936.wixsite.com/radikal/investinsaradi
- Title tag: `Invest in Saradi | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/invest-in-saradi`

- Image: `3685dd_fa274908553649429648f83c9753c832~mv2.png` (no alt text on Wix) → `public/images/madan-sara-bird.png`
- **H1:** SARADI
- Paragraph: a powerful combination that takes its inspiration from the revered figure of the Madan Sara, and fuses it with our name, RADIKAL
- Link/button: "Support Saradi" → `https://nora936.wixsite.com/radikal/investinsaradi`
- **H1:** Saradi: Our Spirit
- Paragraph: The name Saradi is a tribute to the legendary Madan Sara, the tenacious market women of Haiti. Named after a bustling, fast-moving bird, the Madan Sara is the quintessential enterprising woman, the backbone of the country's informal economy. These resilient micro entrepreneurs are responsible for transporting, distributing, and selling nearly all local goods, from farm to market.
- Paragraph: They are symbols of courage, ingenuity, and relentless economic independence, often navigating treacherous conditions to feed and support their families. They embody the very spirit of grassroots enterprise and self-determination that RADIKAL champions.
- Paragraph: Our women entrepreneurs are the modern Madan Sara. We are building on this legacy by equipping them with RADIKAL solutions : our deep-rooted commitment to sustainable financial empowerment, ecosystem protection, and community mobilization.
- Paragraph: Saradi represents the powerful union of the indispensable spirit of these women and our bold, sustainable framework. It signifies our dedication to fueling women's entrepreneurship while ensuring their work is resilient to climate change, securing sovereignty and prosperity for generations to come.
- Image: `3685dd_648fdf8d137749faa7731cfe05b11fa5~mv2.jpg` (no alt text on Wix) → `public/images/saradi-our-spirit.jpg`
- **H1:** Make a difference
- Paragraph: Change starts with people like you. Your donation helps make a real impact, one action at a time. Together, we can do more.
- Paragraph: Frequency
- Form input: radio "One time"
- Form label: "One time"
- Paragraph: One time
- Form input: radio "Monthly"
- Form label: "Monthly"
- Paragraph: Monthly
- Paragraph: Amount
- Form input: radio
- Form label: "Option"
- Paragraph: Training & Certification : funds one woman's comprehensive training in business management, food safety, and sanitation, giving her the professional skills to succeed.
- Paragraph: $350
- Form input: radio
- Form label: "Option"
- Paragraph: Equipment Kit : provides a Saradi with essential, high-quality tools, including a clean, efficient cookstove and safe prep equipment, enabling her to operate a sustainable, healthy business.
- Paragraph: $875
- Form input: radio
- Form label: "Option"
- Paragraph: Seed Capital & Inventory : supplies the initial micro-financing for a Saradi to purchase inventory and organic ingredients directly from local farmers, kickstarting her social business.
- Paragraph: $1,900
- Form input: radio
- Form label: "Option"
- Paragraph: Micro-Franchise Launch : fully funds the start-up of a new woman-led micro-franchise, covering training, equipment and food cart, initial inventory, and continuous upskilling in our 18-month program.
- Paragraph: $2,500
- Form input: radio "Other"
- Form label: "Other"
- Paragraph: Other
- Form textarea (comment, 100 characters max)
- Paragraph: 0/100
- Paragraph: Comment (optional)
- Button: "Invest $2,500 Monthly"
- Link/button: "Facebook" → `https://facebook.com/sharer/sharer.php?u=https://nora936.wixsite.com/radikal/investinsaradi`
- Link/button: "X (Twitter)" → `https://twitter.com/intent/tweet?url=https://nora936.wixsite.com/radikal/investinsaradi`
- Link/button: "WhatsApp" → `https://api.whatsapp.com/send/?phone&text=https://nora936.wixsite.com/radikal/investinsaradi`
- Button: "Copy link"
- **H2:** Your Investment. Their Autonomy.
- Paragraph: Every dollar invested in this pillar is a direct investment in a woman's economic autonomy and ability to lift her family and community out of poverty. When you invest in a Saradi, you are generating a four-fold impact that ripples across the entire community.
- **H3:** The RADIKAL Effect
- Paragraph: Economic Stability
- Paragraph: The Saradi moves from precarious daily income to running a stable, revenue-generating enterprise. This secures her family’s housing, education, and healthcare.
- Paragraph: Gender Empowerment
- Paragraph: We help women secure their financial independence, increasing their voice and influence both in their households and in community decisions. Women become the chief wealth-cultivators of their regions.
- Paragraph: Local Value Chain Strength
- Paragraph: Your investment strengthens the entire Haitian economy by keeping money local. It provides a reliable market for Haitian farmers and supports local women-run processing cooperatives, reducing the reliance on unstable imports. By linking vendors to local smallholder farmers, we ensure they have consistent access to fresh, healthy ingredients. The Saradi then provides hundreds of affordable, nutritious meals daily to low-income urban communities, directly combatting hunger.
- **H1:** Empowering Saradi. Building the Future.
- Paragraph: Investing in a Saradi is the most direct path to community-wide prosperity. In Haiti, the women we refer to as the Saradi are the foundation of the economy, yet they often lack access to capital, training, and secure supply chains.
- Paragraph: Our approach doesn't offer temporary aid; it offers entrepreneurial opportunity. By transforming informal product stalls into structured, profitable micro-businesses, we unleash the economic power of these women, creating a powerful engine for financial security and self-sufficiency for thousands of families.

### Our Story

- URL: https://nora936.wixsite.com/radikal/our-story
- Title tag: `Our Story | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/our-story`

- **H1:** About
- Paragraph: The Full Story
- Paragraph: The seedbed for RADIKAL : the devastation of the 2010 earthquake, which highlighted the urgent need for resilient, homegrown economic solutions in Haiti. By 2016, our company’s first iteration launched with a model inspired by micro-enterprise giants, focusing on creating a sustainable market for natural personal care products crafted from local crops like cacao. This early phase successfully validated the power of empowering local entrepreneurs.
- Paragraph: The arrival of COVID-19 acted as a pivotal moment, forcing a radical shift in our model. Our established network of small farmers and Madan Sara (the resilient women street vendors) was urgently repurposed to deliver critical food aid. The profound impact achieved during this emergency period demonstrated that our true strength lay in connecting community networks to address food security and economic empowerment. This moment influenced our evolution to a long-term focus on sustainable food systems.
- Paragraph: RADIKAL fully committed to a grassroots business model centered on the Madan Sara. These women are the historical linchpin, connecting domestic agriculture and rural farms with urban markets. Recognizing that this vital relationship had been broken by cheap imported goods, RADIKAL stepped in to mend it. By sourcing produce directly from smallholder farmers and implementing eco-friendly production practices in our facilities, we re-establish these crucial, sustainable connections.
- Image: `3685dd_f74ac1edb98645448a61fdf6eef2deb4~mv2.jpeg` (no alt text on Wix) → `public/images/our-story-full-story.jpg`
- **H2:** Our Mission
- Paragraph: At RADIKAL, we believe that empowering women and youth is the most powerful path to a resilient future.
- Paragraph: Our mission is simple: build robust networks for fair market access, implement comprehensive climate resilient strategies, and equip community leaders to fully control their livelihoods, creating an equitable, thriving society.
- **H2:** Our Vision
- Paragraph: Our vision is a resilient and prosperous future for Haiti and its diaspora, where communities achieve sovereignty and are fully equipped to thrive. We see a world where women are empowered as recognized economic and environmental leaders, successfully running sustainable enterprises that drastically reduce poverty and replace forced migration with community stability and self-determination. We envision thriving communities rooted in local resources, where sustainable agriculture rejuvenates the land and sets the standard for ecological health and prosperity for generations to come.
- Image: `3685dd_45c026f9b4184782b1d642fafcd49ea8~mv2.jpg` (no alt text on Wix) → `public/images/our-story-vision.jpg`

### Our Values

- URL: https://nora936.wixsite.com/radikal/our-values
- Title tag: `Our Values | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/our-values`

- **H1:** Our Values
- Paragraph: Building strong roots for a sustainable future.
- Paragraph: The MAPOU tree is a symbol of strength, deep roots, and resilience in the Caribbean. It represents the four core values that drive our work at RADIKAL, ensuring our projects are community-owned, sustainable, and impactful.
- Paragraph: Mityèl
- Paragraph: (mutual aid)
- Paragraph: We organize and empower farmer and artisan networks through collective effort, believing that the greatest solutions are found together.
- Paragraph: Agrikilti
- Paragraph: (agriculture)
- Paragraph: Our commitment to eco-friendly and climate-resilient practices ensures we are not just solving today's problems but are protecting the land for future generations.
- Paragraph: Patisipasyon
- Paragraph: (participation)
- Paragraph: We insist that all project design and implementation be led and owned by the local communities, guaranteeing relevance and long-term success.
- Paragraph: Ouvèti
- Paragraph: (opportunity & ownership)
- Paragraph: We focus on creating viable economic opportunities and ensuring that communities gain full ownership of the resources and benefits generated.
- Image: `3685dd_ba4149dccb2548a08e35143cf8c5df51~mv2.jpg` (no alt text on Wix) → `public/images/mapou-tree-roots.jpg`

### Our Solutions

- URL: https://nora936.wixsite.com/radikal/s-projects-side-by-side
- Title tag: `Our Solutions | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/our-solutions`

- **H1:** Our RADIKAL Model
- Paragraph: Our model is built on fusing three powerful elements to create a self-sustaining system. Unlike traditional approaches, we don't treat these problems in isolation. We integrate sustainable investment to launch women's enterprises, back this with integrated supply chain development to guarantee market access, and complete the cycle with a climate-smart technical approach to rejuvenate the land. This interlocking framework ensures profitability and environmental well-being grow together.
- Paragraph: 01
- **H2:** Sustainable Investment
- Image: `3685dd_31af94b461604b45ae9f6a0ad34ef9f2~mv2.jpg` (Wix file name used as alt: "PHOTO-2024-02-26-21-19-00_edited.jpg") → `public/images/solution-sustainable-investment.jpg`
- Paragraph: We provide resources and mentorship directly to women and youth entrepreneurs to launch and scale their micro businesses. Unlike traditional aid, this investment is structured to promote ownership and long-term growth, ensuring profits are reinvested back into the enterprise and the community. This pillar fuels the initial transformation from economic hardship to a resilient, women-led micro-economy.
- Paragraph: 02
- **H2:** Integrated Supply Chain
- Paragraph: We build a streamlined, ethical network that connects local, sustainably grown produce directly to end consumers via our women entrepreneurs (the Saradi). This process eliminates predatory middlemen, ensures fair wages for farmers, and guarantees a consistent supply of organic and healthy products. By controlling the entire journey from farm to market, we maximize efficiency, stability, and profit for all participants.
- Image: `3685dd_8ce8e617ef9d447f9f700e8f7d178e7a~mv2.jpg` (Wix file name used as alt: "IMG_0034 (1)_edited.jpg") → `public/images/solution-integrated-supply-chain.jpg`
- Paragraph: 03
- **H2:** Climate-Smart Approach
- Image: `3685dd_e7407799833f43778575147428acd1aa~mv2.jpeg` (Wix file name used as alt: "IMG_2265.jpeg") → `public/images/solution-climate-smart-approach.jpg`
- Paragraph: We equip smallholder farmers with specialized climate-smart practices, like agroforestry, that boost productivity while actively protecting ecosystems and restoring soil health. Crucially, this extends beyond the farm to include eco-friendly packaging and the integration of clean energy solutions throughout our processing facilities and Saradi points of sale. This approach is critical for adapting to climate change, securing sustainable local sourcing, and guaranteeing the long-term, low-carbon viability of the entire supply chain.
- **H2:** A Women-Led Grassroots Blueprint
- Paragraph: We have adapted the legacy of the Madan Sara into a modern, replicable enterprise model supporting our Saradi. This process rigorously trains and equips women to manage the entire cycle from sustainable sourcing to profitable sales. The result is a network of women-led micro-enterprises that stabilize food supply, improve local consumption, and create a resilient economic safety net in communities.

### Our Impact

- URL: https://nora936.wixsite.com/radikal/our-impact
- Title tag: `Our Impact | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/our-impact`

- **H2:** Our Approach
- Paragraph: We don't just talk about change—we cultivate it! Our approach commits to integrating community-driven initiatives that directly support women's economic empowerment and foster sustainable agricultural practices. From training micro-entrepreneurs to establishing climate-smart farms, we are building lasting resilience.
- **H3:** Training
- Paragraph: Skill Enhancement
- Paragraph: We equip farmers with climate-smart practices and sustainable techniques that dramatically boost crop yields while protecting the vital local environment, ensuring higher productivity and long-term ecological health.
- **H3:** Cooperatives
- Paragraph: Community Building
- Paragraph: Our collaborative networks unite local farmers and craftspeople, breaking down barriers to market access and ensuring they receive fair value for their high-quality products.
- **H3:** Microfinance
- Paragraph: Financial Support
- Paragraph: Our targeted microfinance programs provide Saradi with the essential capital and resources needed to launch and grow their own sustainable businesses, investing directly in their futures and families.
- **H2:** Our Impact and the SDGs
- Paragraph: Our impact is directly aligned with several critical UN Sustainable Development Goals (SDGs), notably with SDG 1 (No Poverty) and SDG 2 (Zero Hunger) by equipping women with the resources to run profitable micro-enterprises and ensuring community food sovereignty. Our dedication to empowering women and reducing inequality advances SDG 5 (Gender Equality) and SDG 10 (Reduced Inequalities). Our focus on optimizing supply chains and sustainable practices, including eco-friendly packaging, directly supports SDG 12 (Responsible Consumption and Production), ensuring our economic activities are environmentally sound and resilient. By emphasizing climate-smart practices and ecosystem protection, we champion SDG 13 (Climate Action).
- Link/button: "Support Us" → `https://nora936.wixsite.com/radikal/investinsaradi`
- Image: `3685dd_174bb3be698c460dbb654763a1562111~mv2.png` (no alt text on Wix) → `public/images/our-impact.png`

### Our Initiatives

- URL: https://nora936.wixsite.com/radikal/projects-6
- Title tag: `Our Initiatives | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/our-initiatives`

- **H1:** Our Initiatives
- Paragraph: Our initiatives are a direct response to the systemic vulnerabilities that undermine the stability and self-sufficiency the Saradi, artisans and farmers work so hard to achieve. They are critical support structures necessary for our economic empowerment efforts to succeed long-term.
- **H2:** Makaya : Roots of Resilience (links to https://nora936.wixsite.com/radikal/fundourinitiatives)
- Paragraph: On Pic Makaya National Park, we aim to restore critical biodiversity and enhance climate resilience in Haiti's vital southern mountain range. Pic Makaya National Park is a critical global biodiversity hotspot and holds Haiti's last significant primary cloud forest. Reforestation here is essential not only for climate change mitigation and sequestering carbon but also for stabilizing soil to prevent deadly landslides and for protecting the fresh water sources that sustain the local population and downstream agriculture.
- Image: `3685dd_d5b3d089f07749cd808e1abbafcb5ebf~mv2.jpg` (Wix file name used as alt: "IMG_0849_edited_edited.jpg") → `public/images/makaya-initiative.jpg`
- **H2:** Clean Water and Coastlines (links to https://nora936.wixsite.com/radikal/fundourinitiatives)
- Paragraph: Ocean and water health are intrinsically linked to economic survival. Coastal communities depend on fishing and healthy marine life, while inland communities rely on clean, stable watersheds. This initiative, aligned with RADIKAL’s community approach, focuses on preventing pollution at its source (inland) and cleaning the affected coastal zones, ensuring both human health and the vitality of Haiti’s essential marine ecosystems.
- Image: `3685dd_ff933bed17c9429a8e445281839ed5bf~mv2.jpg` (Wix file name used as alt: "View recent photos_edited.jpg") → `public/images/clean-water-and-coastlines.jpg`
- **H2:** Pathways to Stability (links to https://nora936.wixsite.com/radikal/fundourinitiatives)
- Paragraph: Fostering belonging and stability for Haitian migrants in LATAM through skill-building, employment support, and community forums for successful, long-term integration. We started this initiative because of the severe crisis and displacement currently impacting Haitian communities, and a desire to extend our proven model of empowerment and stability to a rapidly growing and highly vulnerable population in the wider Caribbean and Latin America (LATAM).
- Image: `3685dd_bdf422817bab4914b629c57eddc26862~mv2.png` (Wix file name used as alt: "RADIKAL_logo.png") → `public/images/radikal-logo.png`

### Hurricane Melissa Relief

- URL: https://nora936.wixsite.com/radikal/melissahurricanerelief
- Title tag: `Hurricane Melissa Relief | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/hurricane-melissa-relief`

- **H2:** Hurricane Melissa Relief Efforts
- Image: `3685dd_0af5c86c17524562baea192367f46eef~mv2.jpg` (no alt text on Wix) → `public/images/hurricane-melissa-relief-1.jpg`
- Image: `3685dd_3ae55cb092df4c73a9aec2b38110cc8c~mv2.jpg` (no alt text on Wix) → `public/images/hurricane-melissa-relief-2.jpg`
- **H1:** Make a difference
- Paragraph: Change starts with people like you. Your donation helps make a real impact, one action at a time. Together, we can do more.
- Paragraph: Amount
- Form input: radio
- Form label: "Option"
- Paragraph: Funds a sanitation/hygiene kit and a meal voucher for one affected family (6). This ensures their access to clean water at a selected Saradi vendor's cart and provides one subsidized nutritious meal.
- Paragraph: $50
- Form input: radio
- Form label: "Option"
- Paragraph: Activates one Saradi as a temporary mobile cash/food voucher disbursement point, covering their setup for critical transfers, ensuring money and food reaches vulnerable families immediately
- Paragraph: $125
- Form input: radio
- Form label: "Option"
- Paragraph: Provides comprehensive assistance for one struggling farmer. This includes basic farming tools, organic seeds, and a small mobile cash grant to cover urgent debris removal and clean-up labor.
- Paragraph: $250
- Form input: radio
- Form label: "Option"
- Paragraph: Establishes a permanent clean water station at a Saradi's location, supplying enough water filters and purification tablets to serve their immediate area for weeks, anchoring community health efforts
- Paragraph: $500
- Form input: radio
- Form label: "Option"
- Paragraph: Provides an advance purchase agreement to a recovering farmer. This guaranteed income allows them to repair irrigation/storage damage and ensures RADIKAL's future local supply chain is maintained.
- Paragraph: $1,000
- Form input: radio "Other"
- Form label: "Other"
- Paragraph: Other
- Form textarea (comment, 100 characters max)
- Paragraph: 0/100
- Paragraph: Comment (optional)
- Button: "Donate $500"
- Link/button: "Facebook" → `https://facebook.com/sharer/sharer.php?u=https://nora936.wixsite.com/radikal/melissahurricanerelief`
- Link/button: "X (Twitter)" → `https://twitter.com/intent/tweet?url=https://nora936.wixsite.com/radikal/melissahurricanerelief`
- Link/button: "WhatsApp" → `https://api.whatsapp.com/send/?phone&text=https://nora936.wixsite.com/radikal/melissahurricanerelief`
- Button: "Copy link"
- Image: `3685dd_4193477cd1e44becb6c7e5273c9818b3~mv2.jpg` (no alt text on Wix) → `public/images/hurricane-melissa-relief-3.jpg`
- **H1:** Your support helps.
- Paragraph: Your contribution immediately translates into targeted support for Haitian families, focusing on direct cash aid and agricultural recovery to build long-term stability.
- Video: `https://video.wixstatic.com/video/3685dd_8427ca99a90345b5bbc6d6cb5f1b5b68/360p/mp4/file.mp4` (360p is the highest rendition Wix serves publicly) → `public/videos/hurricane-melissa-relief.mp4`
- Image: `3685dd_8427ca99a90345b5bbc6d6cb5f1b5b68f000.jpg` (no alt text on Wix) → `public/images/hurricane-melissa-video-poster.jpg`

### Fund Our Initiatives

- URL: https://nora936.wixsite.com/radikal/fundourinitiatives
- Title tag: `Fund Our Initiatives | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/fund-our-initiatives`

- Image: `3685dd_9fd2ff696dea43d6b9815301507151b7~mv2.jpg` (no alt text on Wix) → `public/images/makaya-roots-of-resilience.jpg`
- **H2:** Makaya : Roots of Resilience
- Paragraph: This reforestation initiative, on Pic Makaya National Park, aims to restore critical biodiversity and enhance climate resilience in Haiti's vital southern mountain range.
- **H1:** Make a difference
- Paragraph: Change starts with people like you. Your donation helps make a real impact, one action at a time. Together, we can do more.
- Paragraph: Frequency
- Form input: radio "One time"
- Form label: "One time"
- Paragraph: One time
- Form input: radio "Monthly"
- Form label: "Monthly"
- Paragraph: Monthly
- Paragraph: Amount
- Form input: radio
- Form label: "Option"
- Paragraph: Plant 10 Trees: Your donation covers the cost of 10 native tree seedlings and ensures their initial planting on the Makaya slopes. You are helping to lay the very foundation for the forest's return.
- Paragraph: $25
- Form input: radio
- Form label: "Option"
- Paragraph: Sponsor 20 Trees : This level funds 20 trees plus the essential tools (shovels, hoes) and water needed for the first crucial months of growth. You're giving the trees a fighting chance for survival.
- Paragraph: $50
- Form input: radio
- Form label: "Option"
- Paragraph: Support 40 Trees & Farmer Training: Your generous gift supports 40 trees and contributes to training a local farmer in agroforestry and soil conservation techniques.
- Paragraph: $100
- Form input: radio
- Form label: "Option"
- Paragraph: Protect a Small Plot (100 Trees) & Monitoring: This contribution plants 100 trees and provides resources for long-term monitoring by ORE staff. This ensures the saplings are guarded against threats.
- Paragraph: $250
- Form input: radio
- Form label: "Option"
- Paragraph: Restore Biodiversity & Create a Local Job: Your significant support plants 200+ trees and creates a temporary green job for a community member, employing them to run the tree nursery.
- Paragraph: $500
- Form textarea (comment, 100 characters max)
- Paragraph: 0/100
- Paragraph: Comment (optional)
- Button: "Contribute $250 Monthly"
- Link/button: "Facebook" → `https://facebook.com/sharer/sharer.php?u=https://nora936.wixsite.com/radikal/fundourinitiatives`
- Link/button: "X (Twitter)" → `https://twitter.com/intent/tweet?url=https://nora936.wixsite.com/radikal/fundourinitiatives`
- Link/button: "WhatsApp" → `https://api.whatsapp.com/send/?phone&text=https://nora936.wixsite.com/radikal/fundourinitiatives`
- Button: "Copy link"
- Image: `3685dd_ff933bed17c9429a8e445281839ed5bf~mv2.jpg` (no alt text on Wix) → `public/images/clean-water-and-coastlines.jpg`
- **H2:** Clean Water & Coastlines
- Paragraph: Our clean water initiative supports watershed protection, waste management, and sustainable resource use to prevent inland pollution from reaching the ocean.
- **H1:** Make a difference
- Paragraph: Change starts with people like you. Your donation helps make a real impact, one action at a time. Together, we can do more.
- Paragraph: Frequency
- Form input: radio "One time"
- Form label: "One time"
- Paragraph: One time
- Form input: radio "Monthly"
- Form label: "Monthly"
- Paragraph: Monthly
- Paragraph: Amount
- Form input: radio
- Form label: "Option"
- Paragraph: Fund Coastal Clean-Up for 1 Day: Your donation directly supports one community member for a full day of coastal clean-up, removing marine plastic and trash from critical fishing and mangrove areas.
- Paragraph: $35
- Form input: radio
- Form label: "Option"
- Paragraph: Supply 10 Vetiver Bundles: This funds materials to plant bundles in a vulnerable watershed. These deep-rooted plants stop soil erosion and prevent sediment from washing into the ocean.
- Paragraph: $75
- Form input: radio
- Form label: "Option"
- Paragraph: Water Hygiene Workshop: This level covers the supplies and resources for a local workshop focused on waterborne disease prevention, safe water storage, and sanitation practices for one community.
- Paragraph: $150
- Form input: radio
- Form label: "Option"
- Paragraph: Empower a Fishing Cooperative: This helps a local cooperative to acquire sustainable fishing gear or invest in educational materials to promote responsible harvesting, protecting fragile coral stocks.
- Paragraph: $300
- Form input: radio
- Form label: "Option"
- Paragraph: Launch a New Waste Collection Point: This funds the establishment of a community-managed trash collection point near a coastal area, preventing tons of plastic waste from ever reaching the ocean.
- Paragraph: $750
- Form textarea (comment, 100 characters max)
- Paragraph: 0/100
- Paragraph: Comment (optional)
- Button: "Contribute $150 Monthly"
- Link/button: "Facebook" → `https://facebook.com/sharer/sharer.php?u=https://nora936.wixsite.com/radikal/fundourinitiatives`
- Link/button: "X (Twitter)" → `https://twitter.com/intent/tweet?url=https://nora936.wixsite.com/radikal/fundourinitiatives`
- Link/button: "WhatsApp" → `https://api.whatsapp.com/send/?phone&text=https://nora936.wixsite.com/radikal/fundourinitiatives`
- Button: "Copy link"
- **H2:** Pathway to Stability
- Paragraph: In collaboration with our partners in the region, this initiative is fostering belonging and stability for Haitian migrants in LATAM through skill-building, employment support, and community forums for successful, long-term integration.
- **H1:** Make a difference
- Paragraph: Change starts with people like you. Your donation helps make a real impact, one action at a time. Together, we can do more.
- Paragraph: Frequency
- Form input: radio "One time"
- Form label: "One time"
- Paragraph: One time
- Form input: radio "Monthly"
- Form label: "Monthly"
- Paragraph: Monthly
- Paragraph: Amount
- Form input: radio
- Form label: "Option"
- Paragraph: Provide 1 Migrant with Access to Essential Services: your donation covers the cost for a migrant to access a vital social service—like initial legal consultation or enrollment in a language class.
- Paragraph: $50
- Form input: radio
- Form label: "Option"
- Paragraph: Sponsor 1 Migrant in a Professional Workshop: this funds the material and instruction costs for one migrant to attend a professional training session, focusing on upskilling in areas like digital lite
- Paragraph: $125
- Form input: radio
- Form label: "Option"
- Paragraph: Host a Community Integration Forum: your support covers the logistics (eg. space rental) to host a community forum that brings migrants and local residents together, fostering dialogue and belonging.
- Paragraph: $250
- Form input: radio
- Form label: "Option"
- Paragraph: Equip 1 Migrant to Start a Small Business : this gift provides the start-up resources—like tools, initial inventory, or registration fees—for a skilled migrant to launch a small activity or business.
- Paragraph: $500
- Form input: radio
- Form label: "Option"
- Paragraph: Provide Holistic Package: your support funds a comprehensive package for a migrant; business support, advanced training, and continuous mentorship to ensure their adaptation in their new environment.
- Paragraph: $1,000
- Button: "Contribute $125 Monthly"
- Link/button: "Facebook" → `https://facebook.com/sharer/sharer.php?u=https://nora936.wixsite.com/radikal/fundourinitiatives`
- Link/button: "X (Twitter)" → `https://twitter.com/intent/tweet?url=https://nora936.wixsite.com/radikal/fundourinitiatives`
- Link/button: "WhatsApp" → `https://api.whatsapp.com/send/?phone&text=https://nora936.wixsite.com/radikal/fundourinitiatives`
- Button: "Copy link"

### Take Action

- URL: https://nora936.wixsite.com/radikal/get-involved
- Title tag: `Take Action | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/get-involved`

- Image: `3685dd_1fe71cdd343a4a3699b2d4430b56a67a~mv2.jpg` (no alt text on Wix) → `public/images/take-action.jpg`
- **H2:** Be the first to know
- Paragraph: Subscribe to our newsletter to receive news and updates.
- Form label: "Enter your email here"
- Form input: email
- Button: "Sign Up"
- Paragraph: Thanks for submitting!
- **H2:** Podcast
- Embedded widget: Instagram Feed (third-party iframe)

### FAQ

- URL: https://nora936.wixsite.com/radikal/faq
- Title tag: `FAQ | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/faq`

- **H1:** Questions
- Paragraph: At RADIKAL, we understand that you may have questions about our mission and impact. Here, we provide answers to some frequently asked questions to shed light on our initiatives and their significance.
- Paragraph: We Can Help
- **H2:** How do we empower women?
- Paragraph: We empower women through comprehensive training programs that focus on giving them skills to improve their livelihoods. Additionally, we create and support farmer and artisan collectives, and we provide access to market opportunities that foster economic independence.
- **H2:** What are microfranchise opportunities?
- Paragraph: Microfranchise opportunities allow women to start their own small businesses with the support of our organization. By providing mentorship and microfinance resources, we enable sustainable economic development for marginalized groups.
- **H2:** How can I contribute to RADIKAL?
- Paragraph: You can contribute by participating in our fundraising initiatives, becoming a partner, or volunteering your time. Every effort, no matter how small, has the potential to create significant change in the lives of women and youth.
- **H2:** Who do we serve?
- Paragraph: RADIKAL primarily serves marginalized groups in Haiti and its diaspora, focusing on women and youth. By addressing the unique challenges they face, we strive to create equitable opportunities for personal and professional growth.

### Privacy Policy

- URL: https://nora936.wixsite.com/radikal/blank
- Title tag: `Privacy Policy | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/privacy-policy`

- **H1:** Privacy Policy
- **H2:** A legal disclaimer
- Paragraph: The explanations and information provided on this page are only general and high-level explanations and information on how to write your own document of a Privacy Policy. You should not rely on this article as legal advice or as recommendations regarding what you should actually do, because we cannot know in advance what are the specific privacy policies you wish to establish between your business and your customers and visitors. We recommend that you seek legal advice to help you understand and to assist you in the creation of your own Privacy Policy.
- **H2:** Privacy Policy - the basics
- Paragraph: Having said that, a privacy policy is a statement that discloses some or all of the ways a website collects, uses, discloses, processes, and manages the data of its visitors and customers. It usually also includes a statement regarding the website’s commitment to protecting its visitors’ or customers’ privacy, and an explanation about the different mechanisms the website is implementing in order to protect privacy.
- Paragraph: Different jurisdictions have different legal obligations of what must be included in a Privacy Policy. You are responsible to make sure you are following the relevant legislation to your activities and location.
- **H2:** What to include in the Privacy Policy
- Paragraph: Generally speaking, a Privacy Policy often addresses these types of issues: the types of information the website is collecting and the manner in which it collects the data; an explanation about why is the website collecting these types of information; what are the website’s practices on sharing the information with third parties; ways in which your visitors and customers can exercise their rights according to the relevant privacy legislation; the specific practices regarding minors’ data collection; and much, much more.
- Paragraph: To learn more about this, check out our article “Creating a Privacy Policy”. — inline link(s): Creating a Privacy Policy>https://support.wix.com/en/article/creating-a-privacy-policy

### Accessibility Statement

- URL: https://nora936.wixsite.com/radikal/blank-1
- Title tag: `Accessibility Statement | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/accessibility-statement`

- Paragraph: The purpose of the following template is to assist you in writing your accessibility statement. Please note that you are responsible for ensuring that your site's statement meets the requirements of the local law in your area or region. *Note: This page currently has two sections. Once you complete editing the Accessibility Statement below, you need to delete this section. To learn more about this, check out our article “Accessibility: Adding an Accessibility Statement to Your Site”. — inline link(s): “Accessibility: Adding an Accessibility Statement to Your Site”.>https://support.wix.com/en/article/accessibility-adding-an-accessibility-statement-to-your-site
- **H1:** Accessibility Statement
- Paragraph: This statement was last updated on [enter relevant date]. We at [enter organization / business name] are working to make our site [enter site name and address] accessible to people with disabilities.
- **H2:** What web accessibility is
- Paragraph: An accessible site allows visitors with disabilities to browse the site with the same or a similar level of ease and enjoyment as other visitors. This can be achieved with the capabilities of the system on which the site is operating, and through assistive technologies.
- **H2:** Accessibility adjustments on this site
- Paragraph: We have adapted this site in accordance with WCAG [2.0 / 2.1 / 2.2 - select relevant option] guidelines, and have made the site accessible to the level of [A / AA / AAA - select relevant option]. This site's contents have been adapted to work with assistive technologies, such as screen readers and keyboard use. As part of this effort, we have also [remove irrelevant information]:
  - List item: Used the Accessibility Wizard to find and fix potential accessibility issues
  - List item: Set the language of the site
  - List item: Set the content order of the site’s pages
  - List item: Defined clear heading structures on all of the site’s pages
  - List item: Added alternative text to images
  - List item: Implemented color combinations that meet the required color contrast
  - List item: Reduced the use of motion on the site
  - List item: Ensured all videos, audio, and files on the site are accessible
- **H2:** Declaration of partial compliance with the standard due to third-party content [only add if relevant]
- Paragraph: The accessibility of certain pages on the site depend on contents that do not belong to the organization, and instead belong to [enter relevant third-party name]. The following pages are affected by this: [list the URLs of the pages]. We therefore declare partial compliance with the standard for these pages.
- **H2:** Accessibility arrangements in the organization [only add if relevant]
- Paragraph: [Enter a description of the accessibility arrangements in the physical offices / branches of your site's organization or business. The description can include all current accessibility arrangements - starting from the beginning of the service (e.g., the parking lot and / or public transportation stations) to the end (such as the service desk, restaurant table, classroom etc.). It is also required to specify any additional accessibility arrangements, such as disabled services and their location, and accessibility accessories (e.g. in audio inductions and elevators) available for use]
- **H2:** Requests, issues, and suggestions
- Paragraph: If you find an accessibility issue on the site, or if you require further assistance, you are welcome to contact us through the organization's accessibility coordinator:
  - List item: [Name of the accessibility coordinator]
  - List item: [Telephone number of the accessibility coordinator]
  - List item: [Email address of the accessibility coordinator]
  - List item: [Enter any additional contact details if relevant / available]

### Terms & Conditions

- URL: https://nora936.wixsite.com/radikal/blank-2
- Title tag: `Terms & Conditions | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/terms-and-conditions`

- **H1:** Terms & Conditions
- **H2:** A legal disclaimer
- Paragraph: The explanations and information provided on this page are only general and high-level explanations and information on how to write your own document of Terms & Conditions. You should not rely on this article as legal advice or as recommendations regarding what you should actually do, because we cannot know in advance what are the specific terms you wish to establish between your business and your customers and visitors. We recommend that you seek legal advice to help you understand and to assist you in the creation of your own Terms & Conditions.
- **H2:** Terms & Conditions - the basics
- Paragraph: Having said that, Terms and Conditions (“T&C”) are a set of legally binding terms defined by you, as the owner of this website. The T&C set forth the legal boundaries governing the activities of the website visitors, or your customers, while they visit or engage with this website. The T&C are meant to establish the legal relationship between the site visitors and you as the website owner.
- Paragraph: T&C should be defined according to the specific needs and nature of each website. For example, a website offering products to customers in e-commerce transactions requires T&C that are different from the T&C of a website only providing information (like a blog, a landing page, and so on).
- Paragraph: T&C provide you as the website owner the ability to protect yourself from potential legal exposure, but this may differ from jurisdiction to jurisdiction, so make sure to receive local legal advice if you are trying to protect yourself from legal exposure.
- **H2:** What to include in the T&C document
- Paragraph: Generally speaking, T&C often address these types of issues: Who is allowed to use the website; the possible payment methods; a declaration that the website owner may change his or her offering in the future; the types of warranties the website owner gives his or her customers; a reference to issues of intellectual property or copyrights, where relevant; the website owner’s right to suspend or cancel a member’s account; and much, much more.
- Paragraph: To learn more about this, check out our article “Creating a Terms and Conditions Policy”. — inline link(s): Creating a Terms and Conditions Policy>https://support.wix.com/en/article/creating-a-terms-and-conditions-policy

### Refund Policy

- URL: https://nora936.wixsite.com/radikal/blank-3
- Title tag: `Refund Policy | RADIKAL`
- Language: `en` (no other languages, no hreflang)
- New URL: `/refund-policy`

- **H1:** Refund Policy
- **H2:** A legal disclaimer
- Paragraph: The explanations and information provided on this page are only general and high-level explanations and information on how to write your own document of a Refund Policy. You should not rely on this article as legal advice or as recommendations regarding what you should actually do, because we cannot know in advance what are the specific refund policies that you wish to establish between your business and your customers. We recommend that you seek legal advice to help you understand and to assist you in the creation of your own Refund Policy.
- **H2:** Refund Policy - the basics
- Paragraph: Having said that, a Refund Policy is a legally binding document that is meant to establish the legal relations between you and your customers regarding how and if you will provide them with a refund. Online businesses selling products are sometimes required (depending on local laws and regulations) to present their product return policy and refund policy. In some jurisdictions, this is needed in order to comply with consumer protection laws. It may also help you avoid legal claims from customers that are not satisfied with the products they purchased.
- **H2:** What to include in the Refund Policy
- Paragraph: Generally speaking, a Refund Policy often addresses these types of issues: the timeframe for asking for a refund; will the refund be full or partial; under which conditions will the customer receive a refund; and much, much more.
