import type { BannerTemplate, BannerSizeTemplate, QuickStartTemplate } from "@/lib/types/banner";

// ==========================================
// SECTION A: BASIC CONFIGURATION
// ==========================================

// ==========================================
// 1. BANNER TYPE / PURPOSE (~25 presets)
// ==========================================
export const bannerTypeTemplates: BannerTemplate[] = [
  // Promotional
  {
    id: "banner-type-sale",
    name: "Sale Banner",
    description: "Promotional banner for sales and discounts",
    promptFragment: "sale promotion banner, discount announcement, shopping incentive design",
  },
  {
    id: "banner-type-discount-offer",
    name: "Discount Offer",
    description: "Special discount promotion banner",
    promptFragment: "discount offer banner, percentage off promotion, special deal announcement",
  },
  {
    id: "banner-type-limited-time",
    name: "Limited Time Deal",
    description: "Urgent limited-time offer banner",
    promptFragment: "limited time offer banner, urgent deal promotion, countdown sale design",
  },
  {
    id: "banner-type-flash-sale",
    name: "Flash Sale",
    description: "Quick flash sale announcement",
    promptFragment: "flash sale banner, quick deal promotion, lightning sale design, urgent shopping",
  },
  {
    id: "banner-type-clearance",
    name: "Clearance Sale",
    description: "Clearance and end-of-stock promotion",
    promptFragment: "clearance sale banner, stock clearance promotion, final sale design",
  },
  {
    id: "banner-type-bundle",
    name: "Bundle Offer",
    description: "Product bundle promotion",
    promptFragment: "bundle offer banner, package deal promotion, combo savings design",
  },
  // Product
  {
    id: "banner-type-product-launch",
    name: "Product Launch",
    description: "New product announcement banner",
    promptFragment: "product launch banner, new release announcement, debut promotion design",
  },
  {
    id: "banner-type-new-arrival",
    name: "New Arrival",
    description: "New arrivals showcase banner",
    promptFragment: "new arrival banner, fresh products showcase, latest items promotion",
  },
  {
    id: "banner-type-best-seller",
    name: "Best Seller",
    description: "Popular products highlight",
    promptFragment: "best seller banner, popular products showcase, top-rated items promotion",
  },
  {
    id: "banner-type-featured-product",
    name: "Featured Product",
    description: "Single product spotlight",
    promptFragment: "featured product banner, spotlight showcase, hero product promotion",
  },
  {
    id: "banner-type-product-showcase",
    name: "Product Showcase",
    description: "Multiple products display",
    promptFragment: "product showcase banner, catalog display, multiple items promotion",
  },
  // Event
  {
    id: "banner-type-event",
    name: "Event Announcement",
    description: "General event promotion",
    promptFragment: "event announcement banner, happening promotion, occasion marketing design",
  },
  {
    id: "banner-type-webinar",
    name: "Webinar",
    description: "Online webinar promotion",
    promptFragment: "webinar banner, online event promotion, digital seminar announcement",
  },
  {
    id: "banner-type-conference",
    name: "Conference",
    description: "Conference or summit promotion",
    promptFragment: "conference banner, summit promotion, professional event announcement",
  },
  {
    id: "banner-type-holiday-sale",
    name: "Holiday Sale",
    description: "Seasonal holiday promotion",
    promptFragment: "holiday sale banner, seasonal promotion, festive shopping announcement",
  },
  {
    id: "banner-type-seasonal",
    name: "Seasonal Promotion",
    description: "Season-specific campaign",
    promptFragment: "seasonal promotion banner, time-of-year marketing, periodic sale design",
  },
  // Brand
  {
    id: "banner-type-brand-awareness",
    name: "Brand Awareness",
    description: "Brand recognition campaign",
    promptFragment: "brand awareness banner, company recognition, brand identity promotion",
  },
  {
    id: "banner-type-company-intro",
    name: "Company Introduction",
    description: "About us / company intro",
    promptFragment: "company introduction banner, about us promotion, business presentation design",
  },
  {
    id: "banner-type-service-highlight",
    name: "Service Highlight",
    description: "Service promotion banner",
    promptFragment: "service highlight banner, offering showcase, professional service promotion",
  },
  // Action
  {
    id: "banner-type-newsletter",
    name: "Newsletter Signup",
    description: "Email subscription promotion",
    promptFragment: "newsletter signup banner, email subscription promotion, mailing list design",
  },
  {
    id: "banner-type-app-download",
    name: "App Download",
    description: "Mobile app promotion",
    promptFragment: "app download banner, mobile application promotion, download now design",
  },
  {
    id: "banner-type-free-trial",
    name: "Free Trial",
    description: "Free trial offer promotion",
    promptFragment: "free trial banner, try for free promotion, no-cost trial design",
  },
  {
    id: "banner-type-contact",
    name: "Contact Us",
    description: "Contact/inquiry promotion",
    promptFragment: "contact us banner, inquiry promotion, get in touch design",
  },
  {
    id: "banner-type-lead-gen",
    name: "Lead Generation",
    description: "Lead capture campaign",
    promptFragment: "lead generation banner, lead capture promotion, signup incentive design",
  },
  // Social
  {
    id: "banner-type-social-ad",
    name: "Social Media Ad",
    description: "Social platform advertisement",
    promptFragment: "social media ad banner, social platform promotion, social advertising design",
  },
  // Informational / Company
  {
    id: "banner-type-about-us",
    name: "About Us",
    description: "Company story and team showcase",
    promptFragment: "about us banner, company story showcase, team introduction design, who we are presentation",
  },
  {
    id: "banner-type-our-services",
    name: "Our Services",
    description: "Services overview banner",
    promptFragment: "services overview banner, what we offer showcase, service listing design, capabilities presentation",
  },
  {
    id: "banner-type-our-team",
    name: "Our Team",
    description: "Team members showcase",
    promptFragment: "team showcase banner, staff introduction design, meet the team presentation, employee highlight",
  },
  {
    id: "banner-type-company-values",
    name: "Company Values",
    description: "Core values and mission banner",
    promptFragment: "company values banner, mission statement design, core principles showcase, brand values presentation",
  },
  {
    id: "banner-type-case-study",
    name: "Case Study",
    description: "Success story or portfolio piece",
    promptFragment: "case study banner, success story showcase, portfolio piece design, client results presentation",
  },
  {
    id: "banner-type-testimonials",
    name: "Testimonials",
    description: "Customer reviews and testimonials",
    promptFragment: "testimonials banner, customer review showcase, social proof design, client feedback presentation",
  },
  // Content
  {
    id: "banner-type-blog-post",
    name: "Blog Post Promotion",
    description: "Article or blog feature banner",
    promptFragment: "blog post banner, article promotion design, content feature showcase, editorial announcement",
  },
  {
    id: "banner-type-portfolio",
    name: "Portfolio Showcase",
    description: "Work samples display banner",
    promptFragment: "portfolio showcase banner, work samples display, creative gallery design, project highlight",
  },
  {
    id: "banner-type-faq-help",
    name: "FAQ / Help",
    description: "Help section or FAQ banner",
    promptFragment: "FAQ banner, help section design, support information showcase, customer assistance presentation",
  },
  {
    id: "banner-type-coming-soon",
    name: "Coming Soon",
    description: "Pre-launch teaser banner",
    promptFragment: "coming soon banner, pre-launch teaser design, anticipation builder, upcoming release announcement",
  },
  // Trust / Social Proof
  {
    id: "banner-type-awards",
    name: "Awards & Recognition",
    description: "Certifications and awards banner",
    promptFragment: "awards banner, recognition showcase, certification display, achievement presentation design",
  },
  {
    id: "banner-type-partnership",
    name: "Partnership",
    description: "Partner or client logos banner",
    promptFragment: "partnership banner, client logos showcase, trusted by design, business partners presentation",
  },
  {
    id: "banner-type-press-media",
    name: "Press / Media",
    description: "Media mentions and press banner",
    promptFragment: "press banner, media mentions showcase, featured in design, news coverage presentation",
  },
];

// ==========================================
// 2. BANNER SIZE / FORMAT (~25 presets)
// ==========================================
export const bannerSizeTemplates: BannerSizeTemplate[] = [
  // Google Display Ads (IAB Standard) - Leaderboard
  {
    id: "size-leaderboard-728x90",
    name: "Leaderboard (728x90)",
    description: "Standard horizontal banner for website headers",
    promptFragment: "horizontal leaderboard format, wide banner layout, header placement design",
    width: 728,
    height: 90,
    platform: "google-ads",
    category: "leaderboard",
  },
  {
    id: "size-large-leaderboard-970x90",
    name: "Large Leaderboard (970x90)",
    description: "Extended horizontal banner for wide headers",
    promptFragment: "large leaderboard format, extended wide banner, premium header placement",
    width: 970,
    height: 90,
    platform: "google-ads",
    category: "leaderboard",
  },
  // Rectangle
  {
    id: "size-medium-rectangle-300x250",
    name: "Medium Rectangle (300x250)",
    description: "Most versatile ad size, fits most placements",
    promptFragment: "medium rectangle format, versatile banner layout, sidebar content design",
    width: 300,
    height: 250,
    platform: "google-ads",
    category: "rectangle",
  },
  {
    id: "size-large-rectangle-336x280",
    name: "Large Rectangle (336x280)",
    description: "Larger rectangle for better visibility",
    promptFragment: "large rectangle format, enhanced visibility banner, content area design",
    width: 336,
    height: 280,
    platform: "google-ads",
    category: "rectangle",
  },
  {
    id: "size-half-page-300x600",
    name: "Half Page (300x600)",
    description: "Tall rectangle for sidebar placement",
    promptFragment: "half page format, tall vertical banner, prominent sidebar design",
    width: 300,
    height: 600,
    platform: "google-ads",
    category: "rectangle",
  },
  // Skyscraper
  {
    id: "size-wide-skyscraper-160x600",
    name: "Wide Skyscraper (160x600)",
    description: "Vertical sidebar banner",
    promptFragment: "wide skyscraper format, vertical banner layout, sidebar tower design",
    width: 160,
    height: 600,
    platform: "google-ads",
    category: "skyscraper",
  },
  {
    id: "size-skyscraper-120x600",
    name: "Skyscraper (120x600)",
    description: "Narrow vertical banner",
    promptFragment: "skyscraper format, narrow vertical banner, slim sidebar design",
    width: 120,
    height: 600,
    platform: "google-ads",
    category: "skyscraper",
  },
  // Billboard
  {
    id: "size-billboard-970x250",
    name: "Billboard (970x250)",
    description: "Large premium placement banner",
    promptFragment: "billboard format, premium large banner, high-impact header design",
    width: 970,
    height: 250,
    platform: "google-ads",
    category: "billboard",
  },
  // Mobile
  {
    id: "size-mobile-banner-320x50",
    name: "Mobile Banner (320x50)",
    description: "Standard mobile leaderboard",
    promptFragment: "mobile banner format, smartphone leaderboard, compact mobile design",
    width: 320,
    height: 50,
    platform: "google-ads",
    category: "mobile",
  },
  {
    id: "size-mobile-large-320x100",
    name: "Large Mobile Banner (320x100)",
    description: "Enhanced mobile banner",
    promptFragment: "large mobile banner format, enhanced smartphone banner, mobile prominent design",
    width: 320,
    height: 100,
    platform: "google-ads",
    category: "mobile",
  },
  {
    id: "size-mobile-small-300x50",
    name: "Small Mobile Banner (300x50)",
    description: "Compact mobile banner",
    promptFragment: "small mobile banner format, compact smartphone banner, minimal mobile design",
    width: 300,
    height: 50,
    platform: "google-ads",
    category: "mobile",
  },
  // Facebook/Instagram - Feed
  {
    id: "size-facebook-feed-1200x628",
    name: "Facebook Feed (1200x628)",
    description: "Standard Facebook news feed image",
    promptFragment: "Facebook feed format, social news feed image, landscape social design",
    width: 1200,
    height: 628,
    platform: "facebook",
    category: "feed",
  },
  {
    id: "size-facebook-square-1080x1080",
    name: "Facebook Square (1080x1080)",
    description: "Square format for Facebook feed",
    promptFragment: "Facebook square format, social square image, 1:1 social design",
    width: 1080,
    height: 1080,
    platform: "facebook",
    category: "feed",
  },
  {
    id: "size-facebook-cover-820x312",
    name: "Facebook Cover (820x312)",
    description: "Facebook page cover photo",
    promptFragment: "Facebook cover format, page header image, social cover design",
    width: 820,
    height: 312,
    platform: "facebook",
    category: "cover",
  },
  // Instagram
  {
    id: "size-instagram-square-1080x1080",
    name: "Instagram Square (1080x1080)",
    description: "Standard Instagram post",
    promptFragment: "Instagram square format, social post image, Instagram feed design",
    width: 1080,
    height: 1080,
    platform: "instagram",
    category: "feed",
  },
  {
    id: "size-instagram-portrait-1080x1350",
    name: "Instagram Portrait (1080x1350)",
    description: "Vertical Instagram post (4:5)",
    promptFragment: "Instagram portrait format, vertical social post, tall Instagram design",
    width: 1080,
    height: 1350,
    platform: "instagram",
    category: "feed",
  },
  {
    id: "size-instagram-story-1080x1920",
    name: "Instagram Story (1080x1920)",
    description: "Full-screen Instagram story",
    promptFragment: "Instagram story format, full-screen vertical, story design 9:16",
    width: 1080,
    height: 1920,
    platform: "instagram",
    category: "story",
  },
  // Website Banners - Hero
  {
    id: "size-hero-1920x600",
    name: "Hero Banner (1920x600)",
    description: "Full-width website hero banner",
    promptFragment: "hero banner format, full-width website header, prominent homepage design",
    width: 1920,
    height: 600,
    platform: "website",
    category: "hero",
  },
  {
    id: "size-hero-1920x800",
    name: "Large Hero (1920x800)",
    description: "Tall full-width hero banner",
    promptFragment: "large hero format, tall website header, immersive homepage design",
    width: 1920,
    height: 800,
    platform: "website",
    category: "hero",
  },
  {
    id: "size-hero-1440x600",
    name: "Standard Hero (1440x600)",
    description: "Standard width hero banner",
    promptFragment: "standard hero format, website header image, homepage banner design",
    width: 1440,
    height: 600,
    platform: "website",
    category: "hero",
  },
  {
    id: "size-hero-1440x768",
    name: "Extended Hero 1 (1440x768)",
    description: "Extended height hero banner",
    promptFragment: "extended hero format, tall website header image, prominent homepage banner design",
    width: 1440,
    height: 768,
    platform: "website",
    category: "hero",
  },
  // Website - Sidebar
  {
    id: "size-sidebar-300x250",
    name: "Sidebar (300x250)",
    description: "Website sidebar banner",
    promptFragment: "sidebar banner format, website side placement, content area design",
    width: 300,
    height: 250,
    platform: "website",
    category: "sidebar",
  },
  {
    id: "size-sidebar-tall-300x600",
    name: "Tall Sidebar (300x600)",
    description: "Tall website sidebar banner",
    promptFragment: "tall sidebar format, vertical website placement, prominent side design",
    width: 300,
    height: 600,
    platform: "website",
    category: "sidebar",
  },
  // Website - Full Width
  {
    id: "size-full-width-1920x400",
    name: "Full Width (1920x400)",
    description: "Full-width promotional banner",
    promptFragment: "full width format, wide promotional banner, section divider design",
    width: 1920,
    height: 400,
    platform: "website",
    category: "hero",
  },
  {
    id: "size-medium-width-1440x400",
    name: "Medium Width (1440x400)",
    description: "Medium full-width banner",
    promptFragment: "medium width format, promotional section banner, content divider design",
    width: 1440,
    height: 400,
    platform: "website",
    category: "hero",
  },
  // CTA Banners
  {
    id: "size-cta-800x200",
    name: "CTA Banner (800x200)",
    description: "Call-to-action banner",
    promptFragment: "CTA banner format, action-focused design, conversion banner layout",
    width: 800,
    height: 200,
    platform: "website",
    category: "cta",
  },
  {
    id: "size-cta-1200x300",
    name: "Large CTA (1200x300)",
    description: "Large call-to-action banner",
    promptFragment: "large CTA format, prominent action banner, conversion-focused design",
    width: 1200,
    height: 300,
    platform: "website",
    category: "cta",
  },
  // Custom Size
  {
    id: "size-custom",
    name: "Custom Size",
    description: "Enter your own custom dimensions",
    promptFragment: "custom dimensions banner format",
    width: 0,
    height: 0,
    platform: "custom",
    category: "custom",
  },
];

// ==========================================
// 3. INDUSTRY / NICHE (~40 presets)
// ==========================================
export const industryTemplates: BannerTemplate[] = [
  // E-commerce
  {
    id: "industry-fashion",
    name: "Fashion & Apparel",
    description: "Clothing, accessories, and fashion retail",
    promptFragment: "fashion industry style, clothing retail aesthetic, apparel brand design",
  },
  {
    id: "industry-electronics",
    name: "Electronics & Tech",
    description: "Consumer electronics and gadgets",
    promptFragment: "electronics industry style, tech gadget aesthetic, consumer technology design",
  },
  {
    id: "industry-beauty",
    name: "Beauty & Cosmetics",
    description: "Skincare, makeup, and beauty products",
    promptFragment: "beauty industry style, cosmetics aesthetic, skincare brand design",
  },
  {
    id: "industry-home-garden",
    name: "Home & Garden",
    description: "Home decor, furniture, and gardening",
    promptFragment: "home and garden style, interior decor aesthetic, home improvement design",
  },
  {
    id: "industry-food-beverage",
    name: "Food & Beverage",
    description: "Food products, drinks, and grocery",
    promptFragment: "food and beverage style, culinary aesthetic, grocery brand design",
  },
  {
    id: "industry-jewelry",
    name: "Jewelry & Accessories",
    description: "Fine jewelry and fashion accessories",
    promptFragment: "jewelry industry style, luxury accessories aesthetic, precious items design",
  },
  {
    id: "industry-sports",
    name: "Sports & Outdoor",
    description: "Athletic gear and outdoor equipment",
    promptFragment: "sports industry style, athletic aesthetic, outdoor gear design",
  },
  {
    id: "industry-toys-games",
    name: "Toys & Games",
    description: "Children's toys and gaming products",
    promptFragment: "toys and games style, playful aesthetic, children's product design",
  },
  // Services
  {
    id: "industry-saas",
    name: "SaaS & Software",
    description: "Software as a service and applications",
    promptFragment: "SaaS industry style, software aesthetic, tech platform design",
  },
  {
    id: "industry-consulting",
    name: "Consulting & Advisory",
    description: "Business consulting and advisory services",
    promptFragment: "consulting industry style, professional advisory aesthetic, business service design",
  },
  {
    id: "industry-healthcare",
    name: "Healthcare & Medical",
    description: "Medical services and healthcare",
    promptFragment: "healthcare industry style, medical aesthetic, health service design",
  },
  {
    id: "industry-finance",
    name: "Finance & Banking",
    description: "Financial services and banking",
    promptFragment: "finance industry style, banking aesthetic, financial service design",
  },
  {
    id: "industry-insurance",
    name: "Insurance",
    description: "Insurance services and products",
    promptFragment: "insurance industry style, protection aesthetic, coverage service design",
  },
  {
    id: "industry-education",
    name: "Education & E-Learning",
    description: "Educational services and online learning",
    promptFragment: "education industry style, learning aesthetic, e-learning platform design",
  },
  {
    id: "industry-legal",
    name: "Legal Services",
    description: "Law firms and legal services",
    promptFragment: "legal industry style, law firm aesthetic, professional legal design",
  },
  // Entertainment
  {
    id: "industry-gaming",
    name: "Gaming & Esports",
    description: "Video games and esports",
    promptFragment: "gaming industry style, esports aesthetic, video game design",
  },
  {
    id: "industry-music",
    name: "Music & Audio",
    description: "Music streaming, instruments, and audio",
    promptFragment: "music industry style, audio aesthetic, musical brand design",
  },
  {
    id: "industry-movies",
    name: "Movies & Entertainment",
    description: "Film, TV, and streaming content",
    promptFragment: "entertainment industry style, movie aesthetic, streaming platform design",
  },
  {
    id: "industry-sports-media",
    name: "Sports Media",
    description: "Sports broadcasting and media",
    promptFragment: "sports media style, athletic broadcasting aesthetic, sports content design",
  },
  {
    id: "industry-travel",
    name: "Travel & Tourism",
    description: "Travel agencies and tourism",
    promptFragment: "travel industry style, tourism aesthetic, vacation destination design",
  },
  // B2B
  {
    id: "industry-enterprise",
    name: "Enterprise Solutions",
    description: "Large-scale business solutions",
    promptFragment: "enterprise industry style, corporate solution aesthetic, B2B platform design",
  },
  {
    id: "industry-startup",
    name: "Startup & Tech",
    description: "Technology startups and innovation",
    promptFragment: "startup industry style, tech innovation aesthetic, disruptive design",
  },
  {
    id: "industry-agency",
    name: "Creative Agency",
    description: "Marketing and creative agencies",
    promptFragment: "creative agency style, marketing aesthetic, agency portfolio design",
  },
  {
    id: "industry-manufacturing",
    name: "Manufacturing & Industrial",
    description: "Manufacturing and industrial products",
    promptFragment: "manufacturing industry style, industrial aesthetic, B2B product design",
  },
  {
    id: "industry-logistics",
    name: "Logistics & Shipping",
    description: "Shipping and logistics services",
    promptFragment: "logistics industry style, shipping aesthetic, supply chain design",
  },
  // Local Business
  {
    id: "industry-restaurant",
    name: "Restaurant & Dining",
    description: "Restaurants, cafes, and food service",
    promptFragment: "restaurant industry style, dining aesthetic, food service design",
  },
  {
    id: "industry-real-estate",
    name: "Real Estate",
    description: "Property and real estate services",
    promptFragment: "real estate industry style, property aesthetic, housing market design",
  },
  {
    id: "industry-automotive",
    name: "Automotive",
    description: "Cars, dealerships, and auto services",
    promptFragment: "automotive industry style, car dealership aesthetic, vehicle brand design",
  },
  {
    id: "industry-fitness",
    name: "Fitness & Wellness",
    description: "Gyms, fitness, and wellness centers",
    promptFragment: "fitness industry style, wellness aesthetic, gym brand design",
  },
  {
    id: "industry-salon-spa",
    name: "Salon & Spa",
    description: "Beauty salons and spa services",
    promptFragment: "salon and spa style, beauty service aesthetic, relaxation design",
  },
  {
    id: "industry-hotel",
    name: "Hotel & Hospitality",
    description: "Hotels and hospitality services",
    promptFragment: "hospitality industry style, hotel aesthetic, accommodation design",
  },
  {
    id: "industry-pet",
    name: "Pet Services",
    description: "Pet stores and pet services",
    promptFragment: "pet industry style, animal care aesthetic, pet brand design",
  },
  // Non-profit
  {
    id: "industry-charity",
    name: "Charity & Non-Profit",
    description: "Charitable organizations",
    promptFragment: "charity style, non-profit aesthetic, donation campaign design",
  },
  {
    id: "industry-environmental",
    name: "Environmental",
    description: "Environmental and green causes",
    promptFragment: "environmental cause style, green initiative aesthetic, eco-friendly design",
  },
  {
    id: "industry-social-cause",
    name: "Social Cause",
    description: "Social activism and awareness",
    promptFragment: "social cause style, awareness campaign aesthetic, advocacy design",
  },
  {
    id: "industry-community",
    name: "Community Organization",
    description: "Community groups and local organizations",
    promptFragment: "community organization style, local group aesthetic, neighborhood design",
  },
  // Specialized
  {
    id: "industry-crypto",
    name: "Crypto & Blockchain",
    description: "Cryptocurrency and blockchain",
    promptFragment: "crypto industry style, blockchain aesthetic, digital currency design",
  },
  {
    id: "industry-ai-ml",
    name: "AI & Machine Learning",
    description: "Artificial intelligence services",
    promptFragment: "AI industry style, machine learning aesthetic, intelligent technology design",
  },
  {
    id: "industry-cybersecurity",
    name: "Cybersecurity",
    description: "Security and protection services",
    promptFragment: "cybersecurity industry style, digital protection aesthetic, security design",
  },
  {
    id: "industry-pharma",
    name: "Pharmaceutical",
    description: "Pharmaceutical and medical products",
    promptFragment: "pharmaceutical industry style, medical product aesthetic, healthcare brand design",
  },
  // Tech Services
  {
    id: "industry-phone-repair",
    name: "Phone Repair",
    description: "Mobile device repair services",
    promptFragment: "phone repair service style, mobile device fix aesthetic, smartphone repair design",
  },
  {
    id: "industry-laptop-repair",
    name: "Laptop Repair",
    description: "Computer and laptop repair services",
    promptFragment: "laptop repair service style, computer fix aesthetic, PC repair design",
  },
  {
    id: "industry-it-outsourcing",
    name: "IT Outsourcing",
    description: "IT staffing and outsourcing services",
    promptFragment: "IT outsourcing style, tech staffing aesthetic, managed services design",
  },
  {
    id: "industry-nanotechnology",
    name: "Nanotechnology",
    description: "Nanotech research and products",
    promptFragment: "nanotechnology industry style, nano-scale aesthetic, advanced materials design",
  },
  {
    id: "industry-data-center",
    name: "Data Center",
    description: "Data center and hosting services",
    promptFragment: "data center style, server hosting aesthetic, infrastructure design",
  },
  {
    id: "industry-cloud-services",
    name: "Cloud Services",
    description: "Cloud computing and SaaS hosting",
    promptFragment: "cloud services style, SaaS hosting aesthetic, cloud computing design",
  },
  // Additional Tech
  {
    id: "industry-3d-printing",
    name: "3D Printing",
    description: "Additive manufacturing services",
    promptFragment: "3D printing industry style, additive manufacturing aesthetic, rapid prototyping design",
  },
  {
    id: "industry-drone-services",
    name: "Drone Services",
    description: "Commercial drone operations",
    promptFragment: "drone services style, aerial operations aesthetic, UAV business design",
  },
  {
    id: "industry-ev-electric",
    name: "EV & Electric",
    description: "Electric vehicles and charging",
    promptFragment: "electric vehicle style, EV charging aesthetic, sustainable transport design",
  },
  {
    id: "industry-solar-renewable",
    name: "Solar & Renewable",
    description: "Solar panels and green energy",
    promptFragment: "solar energy style, renewable power aesthetic, green energy design",
  },
  {
    id: "industry-smart-home",
    name: "Smart Home",
    description: "IoT and home automation",
    promptFragment: "smart home style, IoT aesthetic, home automation design",
  },
  {
    id: "industry-telecom",
    name: "Telecommunications",
    description: "Telecommunications services",
    promptFragment: "telecom industry style, telecommunications aesthetic, connectivity design",
  },
];

// ==========================================
// SECTION B: VISUAL STYLE
// ==========================================

// ==========================================
// 4. DESIGN STYLE (~35 presets)
// ==========================================
export const designStyleTemplates: BannerTemplate[] = [
  // Modern
  {
    id: "design-minimalist",
    name: "Minimalist",
    description: "Clean, simple design with lots of whitespace",
    promptFragment: "minimalist design, clean layout, simple aesthetic, generous whitespace",
  },
  {
    id: "design-clean",
    name: "Clean Modern",
    description: "Polished, contemporary clean look",
    promptFragment: "clean modern design, polished aesthetic, contemporary layout",
  },
  {
    id: "design-flat",
    name: "Flat Design",
    description: "2D design without shadows or depth",
    promptFragment: "flat design style, 2D aesthetic, no shadows, crisp edges",
  },
  {
    id: "design-material",
    name: "Material Design",
    description: "Google Material Design principles",
    promptFragment: "material design style, subtle shadows, layered surfaces, responsive motion",
  },
  {
    id: "design-neumorphism",
    name: "Neumorphism",
    description: "Soft UI with subtle shadows",
    promptFragment: "neumorphic design, soft UI, subtle shadows, extruded elements",
  },
  {
    id: "design-glassmorphism",
    name: "Glassmorphism",
    description: "Frosted glass effect with transparency",
    promptFragment: "glassmorphism design, frosted glass effect, transparent layers, blur backdrop",
  },
  // Bold
  {
    id: "design-vibrant",
    name: "Vibrant",
    description: "Bold, eye-catching colors",
    promptFragment: "vibrant design, bold colors, eye-catching palette, dynamic energy",
  },
  {
    id: "design-high-contrast",
    name: "High Contrast",
    description: "Strong contrast between elements",
    promptFragment: "high contrast design, stark differences, bold visual separation",
  },
  {
    id: "design-neon",
    name: "Neon Glow",
    description: "Glowing neon aesthetic",
    promptFragment: "neon glow design, glowing elements, bright luminous colors",
  },
  {
    id: "design-gradient",
    name: "Gradient Rich",
    description: "Smooth color gradients",
    promptFragment: "gradient rich design, smooth color transitions, flowing gradients",
  },
  {
    id: "design-duotone",
    name: "Duotone",
    description: "Two-color design aesthetic",
    promptFragment: "duotone design, two-color aesthetic, filtered imagery, limited palette",
  },
  // Professional
  {
    id: "design-corporate",
    name: "Corporate",
    description: "Business-appropriate professional design",
    promptFragment: "corporate design, business professional aesthetic, formal layout",
  },
  {
    id: "design-business",
    name: "Business Modern",
    description: "Modern professional business style",
    promptFragment: "modern business design, professional aesthetic, corporate contemporary",
  },
  {
    id: "design-executive",
    name: "Executive",
    description: "Premium executive style",
    promptFragment: "executive design, premium professional aesthetic, high-end corporate",
  },
  {
    id: "design-enterprise",
    name: "Enterprise",
    description: "Large-scale enterprise design",
    promptFragment: "enterprise design, large-scale professional aesthetic, institutional look",
  },
  {
    id: "design-formal",
    name: "Formal",
    description: "Traditional formal aesthetic",
    promptFragment: "formal design, traditional aesthetic, conventional professional layout",
  },
  // Creative
  {
    id: "design-artistic",
    name: "Artistic",
    description: "Creative artistic expression",
    promptFragment: "artistic design, creative expression, unique visual approach",
  },
  {
    id: "design-abstract",
    name: "Abstract",
    description: "Non-representational abstract forms",
    promptFragment: "abstract design, non-representational forms, conceptual visual",
  },
  {
    id: "design-geometric",
    name: "Geometric",
    description: "Shapes and geometric patterns",
    promptFragment: "geometric design, shape-based patterns, mathematical aesthetic",
  },
  {
    id: "design-illustrated",
    name: "Illustrated",
    description: "Hand-drawn illustration style",
    promptFragment: "illustrated design, hand-drawn elements, custom illustration aesthetic",
  },
  {
    id: "design-hand-drawn",
    name: "Hand-Drawn",
    description: "Sketchy hand-drawn look",
    promptFragment: "hand-drawn design, sketch aesthetic, organic line work",
  },
  // Retro
  {
    id: "design-vintage",
    name: "Vintage",
    description: "Classic vintage aesthetic",
    promptFragment: "vintage design, classic retro aesthetic, nostalgic style",
  },
  {
    id: "design-retro-80s",
    name: "80s Retro",
    description: "1980s nostalgic design",
    promptFragment: "80s retro design, synthwave aesthetic, neon 1980s style",
  },
  {
    id: "design-retro-90s",
    name: "90s Style",
    description: "1990s inspired design",
    promptFragment: "90s style design, millennium aesthetic, nineties nostalgia",
  },
  {
    id: "design-art-deco",
    name: "Art Deco",
    description: "1920s Art Deco style",
    promptFragment: "Art Deco design, 1920s geometric style, golden age aesthetic",
  },
  {
    id: "design-mid-century",
    name: "Mid-Century Modern",
    description: "1950s-60s design aesthetic",
    promptFragment: "mid-century modern design, atomic age aesthetic, retro futurism",
  },
  // Tech
  {
    id: "design-futuristic",
    name: "Futuristic",
    description: "Forward-looking sci-fi style",
    promptFragment: "futuristic design, sci-fi aesthetic, advanced technology look",
  },
  {
    id: "design-cyberpunk",
    name: "Cyberpunk",
    description: "High-tech dystopian style",
    promptFragment: "cyberpunk design, dystopian tech aesthetic, neon noir style",
  },
  {
    id: "design-tech-startup",
    name: "Tech Startup",
    description: "Modern tech startup aesthetic",
    promptFragment: "tech startup design, innovation aesthetic, modern digital style",
  },
  {
    id: "design-digital",
    name: "Digital",
    description: "Digital-first design approach",
    promptFragment: "digital design, tech-forward aesthetic, online-first visual",
  },
  {
    id: "design-holographic",
    name: "Holographic",
    description: "Iridescent holographic style",
    promptFragment: "holographic design, iridescent aesthetic, rainbow shimmer effect",
  },
  // Organic
  {
    id: "design-natural",
    name: "Natural",
    description: "Nature-inspired organic design",
    promptFragment: "natural design, nature-inspired aesthetic, organic visual elements",
  },
  {
    id: "design-eco-friendly",
    name: "Eco-Friendly",
    description: "Sustainable green design",
    promptFragment: "eco-friendly design, sustainable aesthetic, green environmental style",
  },
  {
    id: "design-botanical",
    name: "Botanical",
    description: "Plant and floral themed",
    promptFragment: "botanical design, plant-inspired aesthetic, floral elements",
  },
  {
    id: "design-earthy",
    name: "Earthy",
    description: "Earth tones and natural feel",
    promptFragment: "earthy design, natural earth tones, grounded aesthetic",
  },
  {
    id: "design-sustainable",
    name: "Sustainable",
    description: "Conscious sustainable design",
    promptFragment: "sustainable design, conscious aesthetic, environmentally aware style",
  },
];

// ==========================================
// 5. COLOR SCHEME (~30 presets)
// ==========================================
export const colorSchemeTemplates: BannerTemplate[] = [
  // Monochromatic
  {
    id: "color-black-white",
    name: "Black & White",
    description: "Classic monochrome palette",
    promptFragment: "black and white color scheme, monochrome palette, grayscale design",
  },
  {
    id: "color-grayscale",
    name: "Grayscale",
    description: "Shades of gray",
    promptFragment: "grayscale color scheme, gray tones palette, neutral monochrome",
  },
  {
    id: "color-single-hue",
    name: "Single Hue",
    description: "Variations of one color",
    promptFragment: "monochromatic color scheme, single hue variations, tonal palette",
  },
  // Primary Colors
  {
    id: "color-bold-red",
    name: "Bold Red",
    description: "Powerful red-based palette",
    promptFragment: "bold red color scheme, vibrant crimson palette, powerful red tones",
  },
  {
    id: "color-electric-blue",
    name: "Electric Blue",
    description: "Vibrant blue palette",
    promptFragment: "electric blue color scheme, vibrant azure palette, bright blue tones",
  },
  {
    id: "color-sunny-yellow",
    name: "Sunny Yellow",
    description: "Bright yellow palette",
    promptFragment: "sunny yellow color scheme, bright golden palette, cheerful yellow tones",
  },
  {
    id: "color-forest-green",
    name: "Forest Green",
    description: "Natural green palette",
    promptFragment: "forest green color scheme, natural emerald palette, deep green tones",
  },
  {
    id: "color-royal-purple",
    name: "Royal Purple",
    description: "Rich purple palette",
    promptFragment: "royal purple color scheme, rich violet palette, regal purple tones",
  },
  // Warm Colors
  {
    id: "color-sunset-orange",
    name: "Sunset Orange",
    description: "Warm orange tones",
    promptFragment: "sunset orange color scheme, warm amber palette, golden orange tones",
  },
  {
    id: "color-coral-pink",
    name: "Coral Pink",
    description: "Soft coral and pink",
    promptFragment: "coral pink color scheme, soft peach palette, warm pink tones",
  },
  {
    id: "color-golden-yellow",
    name: "Golden Yellow",
    description: "Rich golden tones",
    promptFragment: "golden yellow color scheme, rich gold palette, warm honey tones",
  },
  {
    id: "color-terracotta",
    name: "Terracotta",
    description: "Earthy rust tones",
    promptFragment: "terracotta color scheme, earthy rust palette, warm clay tones",
  },
  {
    id: "color-warm-neutrals",
    name: "Warm Neutrals",
    description: "Warm beige and cream",
    promptFragment: "warm neutral color scheme, beige cream palette, cozy neutral tones",
  },
  // Cool Colors
  {
    id: "color-ocean-blue",
    name: "Ocean Blue",
    description: "Deep sea blues",
    promptFragment: "ocean blue color scheme, deep sea palette, aquatic blue tones",
  },
  {
    id: "color-mint-green",
    name: "Mint Green",
    description: "Fresh mint palette",
    promptFragment: "mint green color scheme, fresh seafoam palette, cool green tones",
  },
  {
    id: "color-lavender",
    name: "Lavender",
    description: "Soft purple lavender",
    promptFragment: "lavender color scheme, soft purple palette, gentle violet tones",
  },
  {
    id: "color-ice-blue",
    name: "Ice Blue",
    description: "Cool icy tones",
    promptFragment: "ice blue color scheme, cool frost palette, icy winter tones",
  },
  {
    id: "color-cool-gray",
    name: "Cool Gray",
    description: "Modern cool grays",
    promptFragment: "cool gray color scheme, modern slate palette, sophisticated gray tones",
  },
  // Vibrant
  {
    id: "color-neon",
    name: "Neon Colors",
    description: "Bright fluorescent palette",
    promptFragment: "neon color scheme, fluorescent bright palette, glowing vivid tones",
  },
  {
    id: "color-rainbow",
    name: "Rainbow",
    description: "Full spectrum colors",
    promptFragment: "rainbow color scheme, full spectrum palette, multicolor vibrant",
  },
  {
    id: "color-candy",
    name: "Candy Colors",
    description: "Sweet pastel brights",
    promptFragment: "candy color scheme, sweet bright palette, playful pastel tones",
  },
  {
    id: "color-pop-art",
    name: "Pop Art",
    description: "Bold pop art colors",
    promptFragment: "pop art color scheme, bold contrast palette, comic bright tones",
  },
  // Elegant
  {
    id: "color-gold-black",
    name: "Gold & Black",
    description: "Luxury gold and black",
    promptFragment: "gold and black color scheme, luxury metallic palette, premium elegant tones",
  },
  {
    id: "color-silver-navy",
    name: "Silver & Navy",
    description: "Sophisticated silver navy",
    promptFragment: "silver and navy color scheme, sophisticated metallic palette, classic elegant tones",
  },
  {
    id: "color-rose-gold",
    name: "Rose Gold",
    description: "Feminine rose gold",
    promptFragment: "rose gold color scheme, feminine metallic palette, warm elegant tones",
  },
  {
    id: "color-champagne",
    name: "Champagne",
    description: "Soft champagne tones",
    promptFragment: "champagne color scheme, soft celebration palette, luxe neutral tones",
  },
  // Seasonal
  {
    id: "color-spring-pastels",
    name: "Spring Pastels",
    description: "Soft spring colors",
    promptFragment: "spring pastel color scheme, soft blooming palette, fresh seasonal tones",
  },
  {
    id: "color-summer-brights",
    name: "Summer Brights",
    description: "Vibrant summer palette",
    promptFragment: "summer bright color scheme, vibrant tropical palette, sunny seasonal tones",
  },
  {
    id: "color-autumn-warm",
    name: "Autumn Warm",
    description: "Fall harvest colors",
    promptFragment: "autumn warm color scheme, harvest palette, fall seasonal tones",
  },
  {
    id: "color-winter-cool",
    name: "Winter Cool",
    description: "Cool winter palette",
    promptFragment: "winter cool color scheme, frosty palette, cold seasonal tones",
  },
];

// ==========================================
// 6. MOOD / EMOTION (~20 presets)
// ==========================================
export const moodTemplates: BannerTemplate[] = [
  // Positive
  {
    id: "mood-exciting",
    name: "Exciting",
    description: "High energy and thrilling",
    promptFragment: "exciting mood, high energy atmosphere, thrilling dynamic feel",
  },
  {
    id: "mood-joyful",
    name: "Joyful",
    description: "Happy and cheerful",
    promptFragment: "joyful mood, happy cheerful atmosphere, uplifting positive feel",
  },
  {
    id: "mood-inspiring",
    name: "Inspiring",
    description: "Motivational and uplifting",
    promptFragment: "inspiring mood, motivational atmosphere, empowering uplifting feel",
  },
  {
    id: "mood-trustworthy",
    name: "Trustworthy",
    description: "Reliable and dependable",
    promptFragment: "trustworthy mood, reliable atmosphere, dependable professional feel",
  },
  {
    id: "mood-friendly",
    name: "Friendly",
    description: "Warm and approachable",
    promptFragment: "friendly mood, warm approachable atmosphere, welcoming feel",
  },
  {
    id: "mood-playful",
    name: "Playful",
    description: "Fun and lighthearted",
    promptFragment: "playful mood, fun lighthearted atmosphere, whimsical feel",
  },
  {
    id: "mood-energetic",
    name: "Energetic",
    description: "Dynamic and active",
    promptFragment: "energetic mood, dynamic active atmosphere, vibrant feel",
  },
  // Serious
  {
    id: "mood-professional",
    name: "Professional",
    description: "Business-like and competent",
    promptFragment: "professional mood, business-like atmosphere, competent corporate feel",
  },
  {
    id: "mood-authoritative",
    name: "Authoritative",
    description: "Expert and commanding",
    promptFragment: "authoritative mood, expert commanding atmosphere, leadership feel",
  },
  {
    id: "mood-luxurious",
    name: "Luxurious",
    description: "Premium and high-end",
    promptFragment: "luxurious mood, premium high-end atmosphere, opulent feel",
  },
  {
    id: "mood-sophisticated",
    name: "Sophisticated",
    description: "Refined and elegant",
    promptFragment: "sophisticated mood, refined elegant atmosphere, cultured feel",
  },
  {
    id: "mood-premium",
    name: "Premium",
    description: "High-quality exclusive",
    promptFragment: "premium mood, high-quality exclusive atmosphere, upscale feel",
  },
  // Urgent
  {
    id: "mood-urgent",
    name: "Urgent",
    description: "Time-sensitive and pressing",
    promptFragment: "urgent mood, time-sensitive pressing atmosphere, immediate action feel",
  },
  {
    id: "mood-fomo",
    name: "FOMO",
    description: "Fear of missing out",
    promptFragment: "FOMO mood, fear of missing out atmosphere, exclusive opportunity feel",
  },
  {
    id: "mood-limited",
    name: "Limited",
    description: "Scarce and exclusive",
    promptFragment: "limited mood, scarce exclusive atmosphere, rare opportunity feel",
  },
  {
    id: "mood-exclusive",
    name: "Exclusive",
    description: "Special and select",
    promptFragment: "exclusive mood, special select atmosphere, VIP privileged feel",
  },
  {
    id: "mood-last-chance",
    name: "Last Chance",
    description: "Final opportunity",
    promptFragment: "last chance mood, final opportunity atmosphere, now or never feel",
  },
  // Calm
  {
    id: "mood-peaceful",
    name: "Peaceful",
    description: "Calm and tranquil",
    promptFragment: "peaceful mood, calm tranquil atmosphere, serene relaxed feel",
  },
  {
    id: "mood-relaxing",
    name: "Relaxing",
    description: "Soothing and restful",
    promptFragment: "relaxing mood, soothing restful atmosphere, comfortable feel",
  },
  {
    id: "mood-zen",
    name: "Zen",
    description: "Mindful and balanced",
    promptFragment: "zen mood, mindful balanced atmosphere, harmonious feel",
  },
];

// ==========================================
// 7. SEASONAL / HOLIDAY THEMES (~25 presets)
// ==========================================
export const seasonalTemplates: BannerTemplate[] = [
  // Seasons
  {
    id: "seasonal-spring",
    name: "Spring Fresh",
    description: "Fresh spring renewal theme",
    promptFragment: "spring theme, fresh renewal aesthetic, blooming seasonal design",
  },
  {
    id: "seasonal-summer",
    name: "Summer Vibes",
    description: "Warm summer energy",
    promptFragment: "summer theme, warm sunny aesthetic, vacation seasonal design",
  },
  {
    id: "seasonal-autumn",
    name: "Autumn Harvest",
    description: "Fall harvest theme",
    promptFragment: "autumn theme, harvest aesthetic, fall foliage seasonal design",
  },
  {
    id: "seasonal-winter",
    name: "Winter Wonderland",
    description: "Snowy winter magic",
    promptFragment: "winter theme, snowy wonderland aesthetic, frosty seasonal design",
  },
  // Major Holidays
  {
    id: "holiday-christmas",
    name: "Christmas",
    description: "Festive Christmas theme",
    promptFragment: "Christmas theme, festive holiday aesthetic, red green seasonal design",
  },
  {
    id: "holiday-new-year",
    name: "New Year",
    description: "New Year celebration",
    promptFragment: "New Year theme, celebration aesthetic, midnight countdown design",
  },
  {
    id: "holiday-valentines",
    name: "Valentine's Day",
    description: "Romantic Valentine's theme",
    promptFragment: "Valentine's Day theme, romantic love aesthetic, hearts seasonal design",
  },
  {
    id: "holiday-easter",
    name: "Easter",
    description: "Spring Easter theme",
    promptFragment: "Easter theme, spring celebration aesthetic, pastel seasonal design",
  },
  {
    id: "holiday-halloween",
    name: "Halloween",
    description: "Spooky Halloween theme",
    promptFragment: "Halloween theme, spooky celebration aesthetic, orange black seasonal design",
  },
  {
    id: "holiday-thanksgiving",
    name: "Thanksgiving",
    description: "Gratitude Thanksgiving theme",
    promptFragment: "Thanksgiving theme, gratitude aesthetic, harvest celebration design",
  },
  {
    id: "holiday-independence",
    name: "Independence Day",
    description: "Patriotic celebration",
    promptFragment: "Independence Day theme, patriotic aesthetic, national celebration design",
  },
  {
    id: "holiday-st-patrick",
    name: "St. Patrick's Day",
    description: "Irish celebration theme",
    promptFragment: "St. Patrick's Day theme, Irish celebration aesthetic, green lucky design",
  },
  // Sales Events
  {
    id: "event-black-friday",
    name: "Black Friday",
    description: "Black Friday sales event",
    promptFragment: "Black Friday theme, massive sale aesthetic, shopping event design",
  },
  {
    id: "event-cyber-monday",
    name: "Cyber Monday",
    description: "Cyber Monday deals",
    promptFragment: "Cyber Monday theme, digital deals aesthetic, online sale design",
  },
  {
    id: "event-boxing-day",
    name: "Boxing Day",
    description: "Boxing Day sales",
    promptFragment: "Boxing Day theme, post-holiday sale aesthetic, clearance design",
  },
  {
    id: "event-end-season",
    name: "End of Season",
    description: "Seasonal clearance event",
    promptFragment: "end of season theme, clearance sale aesthetic, seasonal transition design",
  },
  // Special Days
  {
    id: "special-mothers-day",
    name: "Mother's Day",
    description: "Mother's Day celebration",
    promptFragment: "Mother's Day theme, maternal celebration aesthetic, caring tribute design",
  },
  {
    id: "special-fathers-day",
    name: "Father's Day",
    description: "Father's Day celebration",
    promptFragment: "Father's Day theme, paternal celebration aesthetic, dad tribute design",
  },
  {
    id: "special-back-school",
    name: "Back to School",
    description: "School season start",
    promptFragment: "back to school theme, academic season aesthetic, learning start design",
  },
  {
    id: "special-summer-sale",
    name: "Summer Sale",
    description: "Summer shopping event",
    promptFragment: "summer sale theme, hot deals aesthetic, seasonal shopping design",
  },
  {
    id: "special-spring-sale",
    name: "Spring Sale",
    description: "Spring shopping event",
    promptFragment: "spring sale theme, fresh deals aesthetic, renewal shopping design",
  },
  {
    id: "special-labor-day",
    name: "Labor Day",
    description: "Labor Day weekend",
    promptFragment: "Labor Day theme, worker celebration aesthetic, long weekend design",
  },
  {
    id: "special-memorial-day",
    name: "Memorial Day",
    description: "Memorial Day remembrance",
    promptFragment: "Memorial Day theme, remembrance aesthetic, patriotic tribute design",
  },
  {
    id: "special-earth-day",
    name: "Earth Day",
    description: "Environmental awareness",
    promptFragment: "Earth Day theme, environmental awareness aesthetic, green planet design",
  },
  {
    id: "special-singles-day",
    name: "Singles' Day",
    description: "11.11 Shopping festival",
    promptFragment: "Singles' Day theme, shopping festival aesthetic, 11.11 sale design",
  },
];

// ==========================================
// SECTION C: VISUAL ELEMENTS
// ==========================================

// ==========================================
// 8. BACKGROUND STYLE (~35 presets)
// ==========================================
export const backgroundStyleTemplates: BannerTemplate[] = [
  // Solid
  {
    id: "bg-solid-color",
    name: "Solid Color",
    description: "Single color background",
    promptFragment: "solid color background, single uniform color, flat backdrop",
  },
  {
    id: "bg-split-color",
    name: "Split Color",
    description: "Two-color split background",
    promptFragment: "split color background, two-tone divided, dual color backdrop",
  },
  {
    id: "bg-color-block",
    name: "Color Block",
    description: "Multiple color blocks",
    promptFragment: "color block background, geometric color sections, blocked color backdrop",
  },
  // Gradient
  {
    id: "bg-smooth-gradient",
    name: "Smooth Gradient",
    description: "Gentle color transition",
    promptFragment: "smooth gradient background, gentle color transition, seamless gradient backdrop",
  },
  {
    id: "bg-vivid-gradient",
    name: "Vivid Gradient",
    description: "Bold color gradient",
    promptFragment: "vivid gradient background, bold color transition, vibrant gradient backdrop",
  },
  {
    id: "bg-pastel-gradient",
    name: "Pastel Gradient",
    description: "Soft pastel gradient",
    promptFragment: "pastel gradient background, soft color transition, gentle gradient backdrop",
  },
  {
    id: "bg-dark-gradient",
    name: "Dark Gradient",
    description: "Deep dark gradient",
    promptFragment: "dark gradient background, deep color transition, moody gradient backdrop",
  },
  {
    id: "bg-radial-gradient",
    name: "Radial Gradient",
    description: "Circular color gradient",
    promptFragment: "radial gradient background, circular color transition, spotlight gradient backdrop",
  },
  {
    id: "bg-mesh-gradient",
    name: "Mesh Gradient",
    description: "Complex multi-point gradient",
    promptFragment: "mesh gradient background, multi-point color blend, organic gradient backdrop",
  },
  // Pattern
  {
    id: "bg-geometric-pattern",
    name: "Geometric Pattern",
    description: "Shapes and geometric forms",
    promptFragment: "geometric pattern background, shape-based design, mathematical pattern backdrop",
  },
  {
    id: "bg-organic-pattern",
    name: "Organic Pattern",
    description: "Nature-inspired patterns",
    promptFragment: "organic pattern background, nature-inspired design, flowing pattern backdrop",
  },
  {
    id: "bg-abstract-pattern",
    name: "Abstract Pattern",
    description: "Non-representational patterns",
    promptFragment: "abstract pattern background, artistic design, creative pattern backdrop",
  },
  {
    id: "bg-polka-dots",
    name: "Polka Dots",
    description: "Classic dot pattern",
    promptFragment: "polka dot background, circular dot pattern, playful spotted backdrop",
  },
  {
    id: "bg-stripes",
    name: "Stripes",
    description: "Linear stripe pattern",
    promptFragment: "striped background, linear line pattern, parallel stripes backdrop",
  },
  {
    id: "bg-chevron",
    name: "Chevron",
    description: "Zigzag chevron pattern",
    promptFragment: "chevron background, zigzag pattern, V-shaped lines backdrop",
  },
  {
    id: "bg-grid",
    name: "Grid Pattern",
    description: "Regular grid lines",
    promptFragment: "grid pattern background, regular lines, squared backdrop",
  },
  // Photo
  {
    id: "bg-blurred-photo",
    name: "Blurred Photo",
    description: "Soft blurred image background",
    promptFragment: "blurred photo background, soft focus image, bokeh backdrop",
  },
  {
    id: "bg-tinted-photo",
    name: "Tinted Photo",
    description: "Color-tinted photograph",
    promptFragment: "tinted photo background, color overlay image, filtered backdrop",
  },
  {
    id: "bg-overlay-photo",
    name: "Overlay Photo",
    description: "Photo with color overlay",
    promptFragment: "overlay photo background, gradient over image, enhanced photo backdrop",
  },
  {
    id: "bg-split-photo",
    name: "Split with Photo",
    description: "Half photo, half solid",
    promptFragment: "split photo background, partial image design, divided backdrop",
  },
  // Abstract
  {
    id: "bg-abstract-shapes",
    name: "Abstract Shapes",
    description: "Floating abstract forms",
    promptFragment: "abstract shapes background, floating forms, artistic shapes backdrop",
  },
  {
    id: "bg-fluid-shapes",
    name: "Fluid Shapes",
    description: "Organic flowing forms",
    promptFragment: "fluid shapes background, organic flowing forms, liquid shapes backdrop",
  },
  {
    id: "bg-geometric-shapes",
    name: "Geometric Shapes",
    description: "Angular geometric forms",
    promptFragment: "geometric shapes background, angular forms, mathematical shapes backdrop",
  },
  {
    id: "bg-line-art",
    name: "Line Art",
    description: "Artistic line drawings",
    promptFragment: "line art background, artistic lines, drawn stroke backdrop",
  },
  {
    id: "bg-wave",
    name: "Wave Pattern",
    description: "Flowing wave design",
    promptFragment: "wave pattern background, flowing curves, undulating backdrop",
  },
  // Textured
  {
    id: "bg-concrete",
    name: "Concrete Texture",
    description: "Urban concrete surface",
    promptFragment: "concrete texture background, urban surface, industrial backdrop",
  },
  {
    id: "bg-marble",
    name: "Marble Texture",
    description: "Luxurious marble pattern",
    promptFragment: "marble texture background, luxury stone surface, veined backdrop",
  },
  {
    id: "bg-paper",
    name: "Paper Texture",
    description: "Subtle paper texture",
    promptFragment: "paper texture background, subtle grain surface, natural backdrop",
  },
  {
    id: "bg-canvas",
    name: "Canvas Texture",
    description: "Artistic canvas feel",
    promptFragment: "canvas texture background, artistic fabric surface, woven backdrop",
  },
  {
    id: "bg-digital-noise",
    name: "Digital Noise",
    description: "Subtle digital grain",
    promptFragment: "digital noise background, subtle grain texture, static backdrop",
  },
  // Themed
  {
    id: "bg-nature",
    name: "Nature Scene",
    description: "Natural environment background",
    promptFragment: "nature scene background, natural environment, outdoor backdrop",
  },
  {
    id: "bg-urban",
    name: "Urban Scene",
    description: "City environment background",
    promptFragment: "urban scene background, city environment, metropolitan backdrop",
  },
  {
    id: "bg-technology",
    name: "Technology",
    description: "Tech-themed background",
    promptFragment: "technology background, digital tech theme, futuristic backdrop",
  },
  {
    id: "bg-space",
    name: "Space",
    description: "Cosmic space background",
    promptFragment: "space background, cosmic stars theme, galaxy backdrop",
  },
  {
    id: "bg-bokeh",
    name: "Bokeh Lights",
    description: "Blurred light circles",
    promptFragment: "bokeh background, blurred light circles, dreamy lights backdrop",
  },
];

// ==========================================
// 9. VISUAL EFFECTS (~30 presets)
// ==========================================
export const visualEffectsTemplates: BannerTemplate[] = [
  // Shadows
  {
    id: "effect-drop-shadow",
    name: "Drop Shadow",
    description: "Classic shadow below elements",
    promptFragment: "drop shadow effect, classic shadow beneath elements, lifted appearance",
  },
  {
    id: "effect-long-shadow",
    name: "Long Shadow",
    description: "Extended flat shadow",
    promptFragment: "long shadow effect, extended flat shadow, material design shadow",
  },
  {
    id: "effect-soft-shadow",
    name: "Soft Shadow",
    description: "Diffused gentle shadow",
    promptFragment: "soft shadow effect, diffused gentle shadow, subtle depth",
  },
  {
    id: "effect-hard-shadow",
    name: "Hard Shadow",
    description: "Sharp defined shadow",
    promptFragment: "hard shadow effect, sharp defined shadow, high contrast depth",
  },
  {
    id: "effect-inner-shadow",
    name: "Inner Shadow",
    description: "Shadow inside elements",
    promptFragment: "inner shadow effect, inset shadow, pressed appearance",
  },
  {
    id: "effect-glow-shadow",
    name: "Glow Shadow",
    description: "Colored glowing shadow",
    promptFragment: "glow shadow effect, colored luminous shadow, neon glow",
  },
  // Gradients
  {
    id: "effect-gradient-overlay",
    name: "Gradient Overlay",
    description: "Color gradient over image",
    promptFragment: "gradient overlay effect, color transition over content, tinted layer",
  },
  {
    id: "effect-duotone-filter",
    name: "Duotone Filter",
    description: "Two-color filter effect",
    promptFragment: "duotone filter effect, two-color map, filtered imagery",
  },
  // Textures
  {
    id: "effect-paper-texture",
    name: "Paper Texture",
    description: "Subtle paper grain overlay",
    promptFragment: "paper texture effect, subtle grain overlay, tactile appearance",
  },
  {
    id: "effect-grain",
    name: "Film Grain",
    description: "Photographic grain effect",
    promptFragment: "film grain effect, photographic noise, vintage texture",
  },
  {
    id: "effect-noise",
    name: "Digital Noise",
    description: "Subtle noise texture",
    promptFragment: "noise texture effect, digital grain, subtle static",
  },
  {
    id: "effect-fabric",
    name: "Fabric Texture",
    description: "Cloth-like texture",
    promptFragment: "fabric texture effect, cloth-like appearance, woven overlay",
  },
  {
    id: "effect-metal",
    name: "Metallic",
    description: "Shiny metal finish",
    promptFragment: "metallic effect, shiny metal finish, reflective surface",
  },
  {
    id: "effect-wood",
    name: "Wood Texture",
    description: "Natural wood grain",
    promptFragment: "wood texture effect, natural grain pattern, organic surface",
  },
  // Overlays
  {
    id: "effect-color-overlay",
    name: "Color Overlay",
    description: "Solid color tint",
    promptFragment: "color overlay effect, solid tint layer, colored filter",
  },
  {
    id: "effect-pattern-overlay",
    name: "Pattern Overlay",
    description: "Repeating pattern layer",
    promptFragment: "pattern overlay effect, repeating texture, layered design",
  },
  {
    id: "effect-light-leak",
    name: "Light Leak",
    description: "Vintage light leak effect",
    promptFragment: "light leak effect, vintage film burn, warm light spill",
  },
  {
    id: "effect-bokeh-overlay",
    name: "Bokeh Overlay",
    description: "Blurred light circles",
    promptFragment: "bokeh overlay effect, blurred light circles, dreamy spots",
  },
  {
    id: "effect-vignette",
    name: "Vignette",
    description: "Dark edge effect",
    promptFragment: "vignette effect, darkened edges, focus center",
  },
  // 3D Effects
  {
    id: "effect-3d-text",
    name: "3D Text",
    description: "Three-dimensional text",
    promptFragment: "3D text effect, three-dimensional letters, extruded typography",
  },
  {
    id: "effect-isometric",
    name: "Isometric",
    description: "Isometric 3D style",
    promptFragment: "isometric effect, 2.5D perspective, angled 3D view",
  },
  {
    id: "effect-floating",
    name: "Floating Elements",
    description: "Levitating objects",
    promptFragment: "floating elements effect, levitating objects, suspended design",
  },
  {
    id: "effect-depth-layers",
    name: "Depth Layers",
    description: "Multiple depth planes",
    promptFragment: "depth layers effect, multiple planes, parallax depth",
  },
  // Motion Feel
  {
    id: "effect-dynamic-lines",
    name: "Dynamic Lines",
    description: "Speed line effects",
    promptFragment: "dynamic lines effect, speed streaks, motion lines",
  },
  {
    id: "effect-speed-blur",
    name: "Speed Blur",
    description: "Motion blur effect",
    promptFragment: "speed blur effect, motion blur, fast movement feel",
  },
  {
    id: "effect-particles",
    name: "Particle Effects",
    description: "Floating particles",
    promptFragment: "particle effects, floating dots, scattered elements",
  },
  {
    id: "effect-wave",
    name: "Wave Effects",
    description: "Flowing wave motion",
    promptFragment: "wave effects, flowing curves, undulating motion",
  },
  // Special
  {
    id: "effect-glitch",
    name: "Glitch Effect",
    description: "Digital glitch aesthetic",
    promptFragment: "glitch effect, digital corruption, RGB split distortion",
  },
  {
    id: "effect-neon-glow",
    name: "Neon Glow",
    description: "Bright neon luminosity",
    promptFragment: "neon glow effect, bright luminous glow, fluorescent light",
  },
  {
    id: "effect-holographic",
    name: "Holographic",
    description: "Iridescent rainbow effect",
    promptFragment: "holographic effect, iridescent rainbow, color-shifting surface",
  },
];

// ==========================================
// 10. ICON / GRAPHIC ELEMENTS (~20 presets)
// ==========================================
export const iconGraphicsTemplates: BannerTemplate[] = [
  // Style
  {
    id: "icon-outlined",
    name: "Outlined Icons",
    description: "Line-based icons",
    promptFragment: "outlined icons, line-based graphics, stroke icon style",
  },
  {
    id: "icon-filled",
    name: "Filled Icons",
    description: "Solid filled icons",
    promptFragment: "filled icons, solid graphics, complete icon style",
  },
  {
    id: "icon-3d",
    name: "3D Icons",
    description: "Three-dimensional icons",
    promptFragment: "3D icons, dimensional graphics, depth icon style",
  },
  {
    id: "icon-hand-drawn",
    name: "Hand-Drawn Icons",
    description: "Sketch-style icons",
    promptFragment: "hand-drawn icons, sketch graphics, organic icon style",
  },
  {
    id: "icon-gradient",
    name: "Gradient Icons",
    description: "Icons with color gradients",
    promptFragment: "gradient icons, colorful graphics, transitioning icon style",
  },
  {
    id: "icon-duotone",
    name: "Duotone Icons",
    description: "Two-tone icons",
    promptFragment: "duotone icons, two-tone graphics, layered icon style",
  },
  // Elements
  {
    id: "element-badges",
    name: "Badges",
    description: "Recognition badges",
    promptFragment: "badge elements, recognition graphics, achievement markers",
  },
  {
    id: "element-ribbons",
    name: "Ribbons",
    description: "Decorative ribbons",
    promptFragment: "ribbon elements, decorative banners, flowing tags",
  },
  {
    id: "element-stickers",
    name: "Stickers",
    description: "Fun sticker elements",
    promptFragment: "sticker elements, fun graphics, playful labels",
  },
  {
    id: "element-stamps",
    name: "Stamps",
    description: "Stamp-like marks",
    promptFragment: "stamp elements, seal graphics, authentic markers",
  },
  {
    id: "element-seals",
    name: "Quality Seals",
    description: "Trust and quality seals",
    promptFragment: "seal elements, quality markers, certification graphics",
  },
  {
    id: "element-stars",
    name: "Stars",
    description: "Star elements",
    promptFragment: "star elements, rating graphics, sparkling accents",
  },
  {
    id: "element-arrows",
    name: "Arrows",
    description: "Directional arrows",
    promptFragment: "arrow elements, directional graphics, pointing indicators",
  },
  // Decorative
  {
    id: "decor-confetti",
    name: "Confetti",
    description: "Celebration confetti",
    promptFragment: "confetti elements, celebration particles, festive scatter",
  },
  {
    id: "decor-sparkles",
    name: "Sparkles",
    description: "Shining sparkle effects",
    promptFragment: "sparkle elements, shining points, glitter accents",
  },
  {
    id: "decor-light-rays",
    name: "Light Rays",
    description: "Radiating light beams",
    promptFragment: "light ray elements, radiating beams, sunburst accents",
  },
  {
    id: "decor-geometric",
    name: "Geometric Shapes",
    description: "Decorative shapes",
    promptFragment: "geometric shape elements, decorative forms, abstract accents",
  },
  {
    id: "decor-borders",
    name: "Decorative Borders",
    description: "Frame borders",
    promptFragment: "decorative border elements, frame edges, ornamental boundaries",
  },
  {
    id: "decor-dividers",
    name: "Section Dividers",
    description: "Decorative dividers",
    promptFragment: "divider elements, section separators, ornamental lines",
  },
  {
    id: "decor-corner",
    name: "Corner Accents",
    description: "Corner decorations",
    promptFragment: "corner accent elements, frame corners, decorative edges",
  },
];

// ==========================================
// 11. PROMOTIONAL ELEMENTS (~15 presets)
// ==========================================
export const promotionalTemplates: BannerTemplate[] = [
  // Discounts
  {
    id: "promo-percent-off",
    name: "Percentage Off Badge",
    description: "Discount percentage display",
    promptFragment: "percentage off badge, discount display, savings indicator",
  },
  {
    id: "promo-price-slash",
    name: "Price Slash",
    description: "Crossed-out original price",
    promptFragment: "price slash element, crossed-out price, before-after pricing",
  },
  {
    id: "promo-compare-prices",
    name: "Compare Prices",
    description: "Price comparison display",
    promptFragment: "price comparison element, value display, savings highlight",
  },
  {
    id: "promo-bundle-savings",
    name: "Bundle Savings",
    description: "Package deal indicator",
    promptFragment: "bundle savings element, package deal display, combo value",
  },
  {
    id: "promo-flash-tag",
    name: "Flash Sale Tag",
    description: "Limited time indicator",
    promptFragment: "flash sale tag, urgent deal indicator, limited time marker",
  },
  // Trust
  {
    id: "trust-money-back",
    name: "Money Back Guarantee",
    description: "Satisfaction guarantee badge",
    promptFragment: "money back guarantee badge, satisfaction seal, trust indicator",
  },
  {
    id: "trust-free-shipping",
    name: "Free Shipping Badge",
    description: "Free shipping indicator",
    promptFragment: "free shipping badge, delivery benefit, shipping offer",
  },
  {
    id: "trust-star-rating",
    name: "Star Rating",
    description: "Customer review stars",
    promptFragment: "star rating element, customer review display, quality indicator",
  },
  {
    id: "trust-testimonial",
    name: "Testimonial Quote",
    description: "Customer quote display",
    promptFragment: "testimonial quote element, customer review, social proof",
  },
  {
    id: "trust-secure",
    name: "Secure Badge",
    description: "Security trust indicator",
    promptFragment: "secure badge element, safety indicator, protection seal",
  },
  // Urgency
  {
    id: "urgency-countdown",
    name: "Countdown Timer Style",
    description: "Time-limited offer display",
    promptFragment: "countdown timer element, time limit display, urgency indicator",
  },
  {
    id: "urgency-limited-stock",
    name: "Limited Stock",
    description: "Low inventory warning",
    promptFragment: "limited stock element, low inventory display, scarcity indicator",
  },
  {
    id: "urgency-only-left",
    name: "Only X Left",
    description: "Remaining quantity display",
    promptFragment: "only left element, remaining quantity, scarcity counter",
  },
  {
    id: "urgency-today-only",
    name: "Today Only",
    description: "One-day offer tag",
    promptFragment: "today only element, single day offer, daily deal indicator",
  },
  {
    id: "urgency-ends-soon",
    name: "Ends Soon",
    description: "Expiring offer indicator",
    promptFragment: "ends soon element, expiring offer, deadline indicator",
  },
];

// ==========================================
// SECTION D: LAYOUT & TYPOGRAPHY
// ==========================================

// ==========================================
// 12. LAYOUT STYLE (~25 presets)
// ==========================================
export const layoutStyleTemplates: BannerTemplate[] = [
  // Centered
  {
    id: "layout-center-aligned",
    name: "Center Aligned",
    description: "All elements centered",
    promptFragment: "center aligned layout, centered composition, balanced middle placement",
  },
  {
    id: "layout-stacked-center",
    name: "Stacked Center",
    description: "Vertical stack centered",
    promptFragment: "stacked center layout, vertical centered composition, top-to-bottom alignment",
  },
  {
    id: "layout-hero-center",
    name: "Hero Center",
    description: "Hero image with center text",
    promptFragment: "hero center layout, large centered composition, prominent middle placement",
  },
  // Left/Right
  {
    id: "layout-left-aligned",
    name: "Left Aligned",
    description: "Content aligned left",
    promptFragment: "left aligned layout, content on left, starting edge composition",
  },
  {
    id: "layout-right-aligned",
    name: "Right Aligned",
    description: "Content aligned right",
    promptFragment: "right aligned layout, content on right, ending edge composition",
  },
  {
    id: "layout-split-50-50",
    name: "50/50 Split",
    description: "Equal two-column split",
    promptFragment: "50/50 split layout, equal columns, balanced division",
  },
  {
    id: "layout-split-60-40",
    name: "60/40 Split",
    description: "Unequal two-column split",
    promptFragment: "60/40 split layout, unequal columns, weighted division",
  },
  {
    id: "layout-split-70-30",
    name: "70/30 Split",
    description: "Dominant content split",
    promptFragment: "70/30 split layout, dominant column, sidebar division",
  },
  // Grid
  {
    id: "layout-2-column",
    name: "2-Column Grid",
    description: "Two column layout",
    promptFragment: "2-column grid layout, dual column composition, two-part division",
  },
  {
    id: "layout-3-column",
    name: "3-Column Grid",
    description: "Three column layout",
    promptFragment: "3-column grid layout, triple column composition, three-part division",
  },
  {
    id: "layout-masonry",
    name: "Masonry Grid",
    description: "Pinterest-style staggered",
    promptFragment: "masonry grid layout, staggered composition, varied height blocks",
  },
  {
    id: "layout-modular",
    name: "Modular Grid",
    description: "Flexible module grid",
    promptFragment: "modular grid layout, block-based composition, flexible modules",
  },
  // Asymmetric
  {
    id: "layout-diagonal-split",
    name: "Diagonal Split",
    description: "Angled division",
    promptFragment: "diagonal split layout, angled composition, dynamic division",
  },
  {
    id: "layout-angular",
    name: "Angular Layout",
    description: "Sharp angles and cuts",
    promptFragment: "angular layout, sharp angled composition, geometric division",
  },
  {
    id: "layout-organic-flow",
    name: "Organic Flow",
    description: "Natural flowing layout",
    promptFragment: "organic flow layout, natural composition, flowing division",
  },
  {
    id: "layout-broken-grid",
    name: "Broken Grid",
    description: "Overlapping elements",
    promptFragment: "broken grid layout, overlapping composition, unconventional placement",
  },
  // Minimal
  {
    id: "layout-text-only",
    name: "Text Only",
    description: "Typography focused",
    promptFragment: "text only layout, typography-focused composition, word-centric design",
  },
  {
    id: "layout-icon-text",
    name: "Icon + Text",
    description: "Simple icon with text",
    promptFragment: "icon and text layout, simple graphic composition, minimal pairing",
  },
  {
    id: "layout-single-focus",
    name: "Single Element Focus",
    description: "One main focal point",
    promptFragment: "single focus layout, one focal point composition, minimalist centered",
  },
  // Complex
  {
    id: "layout-multi-section",
    name: "Multi-Section",
    description: "Multiple distinct areas",
    promptFragment: "multi-section layout, distinct areas composition, segmented design",
  },
  {
    id: "layout-layered",
    name: "Layered",
    description: "Stacked layers of content",
    promptFragment: "layered layout, stacked composition, depth layers design",
  },
  {
    id: "layout-collage",
    name: "Collage Style",
    description: "Mixed media collage",
    promptFragment: "collage style layout, mixed elements composition, assembled design",
  },
  {
    id: "layout-z-pattern",
    name: "Z-Pattern",
    description: "Z-shaped eye flow",
    promptFragment: "Z-pattern layout, diagonal eye flow composition, natural reading path",
  },
  {
    id: "layout-f-pattern",
    name: "F-Pattern",
    description: "F-shaped reading pattern",
    promptFragment: "F-pattern layout, scanning flow composition, web reading optimized",
  },
  {
    id: "layout-golden-ratio",
    name: "Golden Ratio",
    description: "Fibonacci-based proportions",
    promptFragment: "golden ratio layout, fibonacci composition, harmonious proportions",
  },
];

// ==========================================
// 13. TEXT PLACEMENT (~15 presets)
// ==========================================
export const textPlacementTemplates: BannerTemplate[] = [
  // Position
  {
    id: "text-top-left",
    name: "Top Left",
    description: "Text in top left corner",
    promptFragment: "top left text placement, upper left position, corner start alignment",
  },
  {
    id: "text-top-center",
    name: "Top Center",
    description: "Text centered at top",
    promptFragment: "top center text placement, upper middle position, top aligned",
  },
  {
    id: "text-top-right",
    name: "Top Right",
    description: "Text in top right corner",
    promptFragment: "top right text placement, upper right position, corner end alignment",
  },
  {
    id: "text-center",
    name: "Center",
    description: "Text perfectly centered",
    promptFragment: "center text placement, middle position, balanced central alignment",
  },
  {
    id: "text-bottom-left",
    name: "Bottom Left",
    description: "Text in bottom left",
    promptFragment: "bottom left text placement, lower left position, footer start alignment",
  },
  {
    id: "text-bottom-center",
    name: "Bottom Center",
    description: "Text centered at bottom",
    promptFragment: "bottom center text placement, lower middle position, footer center alignment",
  },
  {
    id: "text-bottom-right",
    name: "Bottom Right",
    description: "Text in bottom right",
    promptFragment: "bottom right text placement, lower right position, footer end alignment",
  },
  {
    id: "text-overlay-image",
    name: "Overlay on Image",
    description: "Text overlaid on imagery",
    promptFragment: "text overlay placement, layered on image, integrated text design",
  },
  // Alignment
  {
    id: "text-left-aligned",
    name: "Left Aligned Text",
    description: "Text aligned to left",
    promptFragment: "left aligned text, ragged right edge, standard reading alignment",
  },
  {
    id: "text-center-aligned",
    name: "Center Aligned Text",
    description: "Text centered horizontally",
    promptFragment: "center aligned text, balanced edges, symmetrical text alignment",
  },
  {
    id: "text-right-aligned",
    name: "Right Aligned Text",
    description: "Text aligned to right",
    promptFragment: "right aligned text, ragged left edge, end-aligned typography",
  },
  // Special
  {
    id: "text-on-path",
    name: "Text on Path",
    description: "Text following a curved path",
    promptFragment: "text on path placement, curved text, following line typography",
  },
  {
    id: "text-curved",
    name: "Curved Text",
    description: "Arched or curved text",
    promptFragment: "curved text placement, arched typography, bending text design",
  },
  {
    id: "text-diagonal",
    name: "Diagonal Text",
    description: "Angled text placement",
    promptFragment: "diagonal text placement, angled typography, tilted text design",
  },
  {
    id: "text-vertical",
    name: "Vertical Text",
    description: "Text reading vertically",
    promptFragment: "vertical text placement, sideways typography, rotated text design",
  },
];

// ==========================================
// 14. TYPOGRAPHY STYLE (~25 presets)
// ==========================================
export const typographyStyleTemplates: BannerTemplate[] = [
  // Sans-Serif
  {
    id: "typo-modern-sans",
    name: "Modern Sans",
    description: "Clean modern sans-serif",
    promptFragment: "modern sans-serif typography, clean font style, contemporary type",
  },
  {
    id: "typo-geometric-sans",
    name: "Geometric Sans",
    description: "Geometric sans-serif forms",
    promptFragment: "geometric sans-serif typography, shape-based font, mathematical type",
  },
  {
    id: "typo-humanist-sans",
    name: "Humanist Sans",
    description: "Friendly humanist sans",
    promptFragment: "humanist sans-serif typography, friendly font style, approachable type",
  },
  {
    id: "typo-industrial",
    name: "Industrial Sans",
    description: "Bold industrial style",
    promptFragment: "industrial typography, bold mechanical font, heavy-duty type",
  },
  {
    id: "typo-grotesque",
    name: "Grotesque",
    description: "Classic grotesque sans",
    promptFragment: "grotesque typography, classic sans font, neutral type style",
  },
  // Serif
  {
    id: "typo-classic-serif",
    name: "Classic Serif",
    description: "Traditional serif fonts",
    promptFragment: "classic serif typography, traditional font style, timeless type",
  },
  {
    id: "typo-modern-serif",
    name: "Modern Serif",
    description: "Contemporary serif style",
    promptFragment: "modern serif typography, contemporary font style, updated classic type",
  },
  {
    id: "typo-slab-serif",
    name: "Slab Serif",
    description: "Bold slab serif fonts",
    promptFragment: "slab serif typography, bold blocky font, strong type style",
  },
  {
    id: "typo-editorial",
    name: "Editorial",
    description: "Magazine editorial style",
    promptFragment: "editorial typography, magazine font style, publication type",
  },
  {
    id: "typo-didone",
    name: "Didone",
    description: "High contrast serif",
    promptFragment: "didone typography, high contrast font, elegant serif type",
  },
  // Display
  {
    id: "typo-bold-display",
    name: "Bold Display",
    description: "Heavy impactful display",
    promptFragment: "bold display typography, heavy impact font, powerful type",
  },
  {
    id: "typo-condensed",
    name: "Condensed",
    description: "Narrow condensed fonts",
    promptFragment: "condensed typography, narrow font style, compressed type",
  },
  {
    id: "typo-extended",
    name: "Extended",
    description: "Wide extended fonts",
    promptFragment: "extended typography, wide font style, stretched type",
  },
  {
    id: "typo-decorative",
    name: "Decorative",
    description: "Ornate decorative fonts",
    promptFragment: "decorative typography, ornate font style, embellished type",
  },
  {
    id: "typo-outlined",
    name: "Outlined",
    description: "Outline-only text",
    promptFragment: "outlined typography, stroke-only font, hollow type style",
  },
  // Script
  {
    id: "typo-elegant-script",
    name: "Elegant Script",
    description: "Formal script fonts",
    promptFragment: "elegant script typography, formal cursive font, refined handwriting type",
  },
  {
    id: "typo-handwriting",
    name: "Casual Handwriting",
    description: "Informal handwritten style",
    promptFragment: "handwriting typography, casual script font, personal touch type",
  },
  {
    id: "typo-brush-script",
    name: "Brush Script",
    description: "Brush-painted lettering",
    promptFragment: "brush script typography, painted font style, artistic brush type",
  },
  {
    id: "typo-signature",
    name: "Signature Style",
    description: "Signature-like scripts",
    promptFragment: "signature typography, autograph font style, personal mark type",
  },
  // Special
  {
    id: "typo-monospace",
    name: "Monospace",
    description: "Fixed-width fonts",
    promptFragment: "monospace typography, fixed-width font, code-style type",
  },
  {
    id: "typo-stencil",
    name: "Stencil",
    description: "Cut-out stencil style",
    promptFragment: "stencil typography, cut-out font style, military type",
  },
  {
    id: "typo-retro",
    name: "Retro Type",
    description: "Vintage typography",
    promptFragment: "retro typography, vintage font style, nostalgic type",
  },
  {
    id: "typo-futuristic",
    name: "Futuristic Type",
    description: "Sci-fi inspired fonts",
    promptFragment: "futuristic typography, sci-fi font style, advanced type",
  },
  // Combinations
  {
    id: "typo-serif-sans-combo",
    name: "Serif + Sans Combo",
    description: "Mix of serif and sans",
    promptFragment: "serif and sans typography combination, mixed font pairing, contrasting type",
  },
  {
    id: "typo-script-sans-combo",
    name: "Script + Sans Combo",
    description: "Script with sans-serif",
    promptFragment: "script and sans typography combination, elegant casual pairing, mixed type",
  },
];

// ==========================================
// 15. CTA BUTTON STYLE (~20 presets)
// ==========================================
export const ctaButtonStyleTemplates: BannerTemplate[] = [
  // Shape
  {
    id: "cta-rounded",
    name: "Rounded",
    description: "Soft rounded corners",
    promptFragment: "rounded CTA button, soft corner style, friendly button design",
  },
  {
    id: "cta-pill",
    name: "Pill Shape",
    description: "Fully rounded pill button",
    promptFragment: "pill-shaped CTA button, capsule style, fully rounded design",
  },
  {
    id: "cta-square",
    name: "Square",
    description: "Sharp square corners",
    promptFragment: "square CTA button, sharp corner style, angular button design",
  },
  {
    id: "cta-capsule",
    name: "Capsule",
    description: "Elongated rounded button",
    promptFragment: "capsule CTA button, elongated pill style, stretched rounded design",
  },
  {
    id: "cta-custom-shape",
    name: "Custom Shape",
    description: "Unique custom button shape",
    promptFragment: "custom shape CTA button, unique form, distinctive button design",
  },
  // Style
  {
    id: "cta-solid",
    name: "Solid Fill",
    description: "Solid color fill button",
    promptFragment: "solid fill CTA button, complete color style, filled button design",
  },
  {
    id: "cta-outline",
    name: "Outline",
    description: "Border-only button",
    promptFragment: "outline CTA button, border-only style, ghost button design",
  },
  {
    id: "cta-gradient",
    name: "Gradient Fill",
    description: "Gradient color button",
    promptFragment: "gradient CTA button, color transition fill, dynamic button design",
  },
  {
    id: "cta-glass",
    name: "Glass Effect",
    description: "Transparent glass button",
    promptFragment: "glass effect CTA button, transparent style, frosted button design",
  },
  {
    id: "cta-shadow",
    name: "Shadow Style",
    description: "Button with shadow depth",
    promptFragment: "shadow CTA button, elevated style, depth button design",
  },
  {
    id: "cta-3d",
    name: "3D Button",
    description: "Three-dimensional button",
    promptFragment: "3D CTA button, dimensional style, raised button design",
  },
  // Effect
  {
    id: "cta-glow",
    name: "Glow Effect",
    description: "Glowing neon button",
    promptFragment: "glowing CTA button, neon glow effect, luminous button design",
  },
  {
    id: "cta-pulse",
    name: "Pulse Effect",
    description: "Animated pulse indicator",
    promptFragment: "pulsing CTA button, animated attention, breathing button design",
  },
  {
    id: "cta-shine",
    name: "Shine Effect",
    description: "Shiny metallic button",
    promptFragment: "shine effect CTA button, metallic gloss, reflective button design",
  },
  {
    id: "cta-hover-lift",
    name: "Hover Lift",
    description: "Elevated on hover",
    promptFragment: "lift effect CTA button, elevated hover state, rising button design",
  },
  // Size
  {
    id: "cta-small",
    name: "Small Button",
    description: "Compact button size",
    promptFragment: "small CTA button, compact size, minimal button design",
  },
  {
    id: "cta-medium",
    name: "Medium Button",
    description: "Standard button size",
    promptFragment: "medium CTA button, standard size, balanced button design",
  },
  {
    id: "cta-large",
    name: "Large Button",
    description: "Prominent large button",
    promptFragment: "large CTA button, prominent size, impactful button design",
  },
  {
    id: "cta-full-width",
    name: "Full Width",
    description: "Spanning full width",
    promptFragment: "full width CTA button, spanning button, complete width design",
  },
  // Position (contextual)
  {
    id: "cta-floating",
    name: "Floating Button",
    description: "Floating action button",
    promptFragment: "floating CTA button, hovering action, elevated button design",
  },
];

// ==========================================
// QUICK START TEMPLATES
// ==========================================
export const quickStartTemplates: QuickStartTemplate[] = [
  {
    id: "quick-ecommerce-sale",
    name: "E-commerce Sale",
    description: "Perfect for flash sales and discounts",
    config: {
      bannerType: "banner-type-flash-sale",
      designStyle: "design-vibrant",
      colorScheme: "color-bold-red",
      mood: "mood-urgent",
      layoutStyle: "layout-split-60-40",
      typographyStyle: "typo-bold-display",
      ctaButtonStyle: "cta-solid",
      promotionalElements: "promo-percent-off",
    },
  },
  {
    id: "quick-saas-launch",
    name: "SaaS Launch",
    description: "Ideal for product launches and tech startups",
    config: {
      bannerType: "banner-type-product-launch",
      designStyle: "design-clean",
      colorScheme: "color-electric-blue",
      mood: "mood-professional",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-smooth-gradient",
      typographyStyle: "typo-modern-sans",
      ctaButtonStyle: "cta-gradient",
    },
  },
  {
    id: "quick-restaurant-promo",
    name: "Restaurant Promo",
    description: "Great for food service promotions",
    config: {
      bannerType: "banner-type-discount-offer",
      industry: "industry-restaurant",
      designStyle: "design-earthy",
      colorScheme: "color-warm-neutrals",
      mood: "mood-friendly",
      layoutStyle: "layout-left-aligned",
      typographyStyle: "typo-modern-serif",
      ctaButtonStyle: "cta-rounded",
    },
  },
  {
    id: "quick-fashion-brand",
    name: "Fashion Brand",
    description: "Elegant for fashion and lifestyle",
    config: {
      bannerType: "banner-type-new-arrival",
      industry: "industry-fashion",
      designStyle: "design-minimalist",
      colorScheme: "color-black-white",
      mood: "mood-sophisticated",
      layoutStyle: "layout-broken-grid",
      typographyStyle: "typo-condensed",
      ctaButtonStyle: "cta-outline",
    },
  },
  {
    id: "quick-tech-startup",
    name: "Tech Startup",
    description: "Modern for app downloads and tech",
    config: {
      bannerType: "banner-type-app-download",
      industry: "industry-startup",
      designStyle: "design-futuristic",
      colorScheme: "color-royal-purple",
      mood: "mood-exciting",
      layoutStyle: "layout-hero-center",
      backgroundStyle: "bg-mesh-gradient",
      typographyStyle: "typo-geometric-sans",
      ctaButtonStyle: "cta-glow",
    },
  },
  {
    id: "quick-holiday-special",
    name: "Holiday Special",
    description: "Festive for seasonal promotions",
    config: {
      bannerType: "banner-type-holiday-sale",
      seasonal: "holiday-christmas",
      designStyle: "design-vibrant",
      colorScheme: "color-bold-red",
      mood: "mood-joyful",
      layoutStyle: "layout-multi-section",
      iconGraphics: "decor-sparkles",
      typographyStyle: "typo-bold-display",
      ctaButtonStyle: "cta-shine",
    },
  },
];

// ==========================================
// ALL TEMPLATES EXPORT
// ==========================================
export const allBannerTemplates = {
  bannerType: bannerTypeTemplates,
  bannerSize: bannerSizeTemplates,
  industry: industryTemplates,
  designStyle: designStyleTemplates,
  colorScheme: colorSchemeTemplates,
  mood: moodTemplates,
  seasonal: seasonalTemplates,
  backgroundStyle: backgroundStyleTemplates,
  visualEffects: visualEffectsTemplates,
  iconGraphics: iconGraphicsTemplates,
  promotionalElements: promotionalTemplates,
  layoutStyle: layoutStyleTemplates,
  textPlacement: textPlacementTemplates,
  typographyStyle: typographyStyleTemplates,
  ctaButtonStyle: ctaButtonStyleTemplates,
};

export type BannerTemplateCategoryKey = keyof typeof allBannerTemplates;

/**
 * Get banner templates by category
 */
export function getBannerTemplatesByCategory(
  category: BannerTemplateCategoryKey
): BannerTemplate[] | BannerSizeTemplate[] {
  return allBannerTemplates[category];
}

/**
 * Get a banner template by ID from any category
 */
export function getBannerTemplateById(id: string): BannerTemplate | BannerSizeTemplate | undefined {
  for (const templates of Object.values(allBannerTemplates)) {
    const template = templates.find((t) => t.id === id);
    if (template) return template;
  }
  return undefined;
}

/**
 * Get banner size template by ID
 */
export function getBannerSizeById(id: string): BannerSizeTemplate | undefined {
  return bannerSizeTemplates.find((t) => t.id === id);
}

/**
 * Get quick start template by ID
 */
export function getQuickStartTemplateById(id: string): QuickStartTemplate | undefined {
  return quickStartTemplates.find((t) => t.id === id);
}

/**
 * Count total templates
 */
export function getTotalBannerTemplateCount(): number {
  return Object.values(allBannerTemplates).reduce((total, templates) => total + templates.length, 0);
}
