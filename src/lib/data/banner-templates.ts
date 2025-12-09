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
    promptFragment: "sale promotion banner designed to announce discounts and drive shopping action",
  },
  {
    id: "banner-type-discount-offer",
    name: "Discount Offer",
    description: "Special discount promotion banner",
    promptFragment: "discount offer banner highlighting percentage savings and special deals",
  },
  {
    id: "banner-type-limited-time",
    name: "Limited Time Deal",
    description: "Urgent limited-time offer banner",
    promptFragment: "limited time offer banner creating urgency with countdown-style visual elements",
  },
  {
    id: "banner-type-flash-sale",
    name: "Flash Sale",
    description: "Quick flash sale announcement",
    promptFragment: "flash sale banner with dynamic urgency elements suggesting immediate action",
  },
  {
    id: "banner-type-clearance",
    name: "Clearance Sale",
    description: "Clearance and end-of-stock promotion",
    promptFragment: "clearance sale banner emphasizing final opportunities and stock clearance",
  },
  {
    id: "banner-type-bundle",
    name: "Bundle Offer",
    description: "Product bundle promotion",
    promptFragment: "bundle offer banner showcasing package deals and combined value savings",
  },
  // Product
  {
    id: "banner-type-product-launch",
    name: "Product Launch",
    description: "New product announcement banner",
    promptFragment: "product launch banner announcing a new release with excitement and anticipation",
  },
  {
    id: "banner-type-new-arrival",
    name: "New Arrival",
    description: "New arrivals showcase banner",
    promptFragment: "new arrival banner featuring fresh products with contemporary appeal",
  },
  {
    id: "banner-type-best-seller",
    name: "Best Seller",
    description: "Popular products highlight",
    promptFragment: "best seller banner highlighting popular and top-rated products",
  },
  {
    id: "banner-type-featured-product",
    name: "Featured Product",
    description: "Single product spotlight",
    promptFragment: "featured product banner with hero spotlight on a single standout item",
  },
  {
    id: "banner-type-product-showcase",
    name: "Product Showcase",
    description: "Multiple products display",
    promptFragment: "product showcase banner displaying multiple items in a catalog-style layout",
  },
  // Event
  {
    id: "banner-type-event",
    name: "Event Announcement",
    description: "General event promotion",
    promptFragment: "event announcement banner promoting an upcoming occasion or happening",
  },
  {
    id: "banner-type-webinar",
    name: "Webinar",
    description: "Online webinar promotion",
    promptFragment: "webinar banner promoting an online educational or professional event",
  },
  {
    id: "banner-type-conference",
    name: "Conference",
    description: "Conference or summit promotion",
    promptFragment: "conference banner announcing a professional summit or industry gathering",
  },
  {
    id: "banner-type-holiday-sale",
    name: "Holiday Sale",
    description: "Seasonal holiday promotion",
    promptFragment: "holiday sale banner with festive seasonal elements and promotional messaging",
  },
  {
    id: "banner-type-seasonal",
    name: "Seasonal Promotion",
    description: "Season-specific campaign",
    promptFragment: "seasonal promotion banner aligned with current time-of-year themes",
  },
  // Brand
  {
    id: "banner-type-brand-awareness",
    name: "Brand Awareness",
    description: "Brand recognition campaign",
    promptFragment: "brand awareness banner focused on company recognition and identity",
  },
  {
    id: "banner-type-company-intro",
    name: "Company Introduction",
    description: "About us / company intro",
    promptFragment: "company introduction banner presenting the business story and values",
  },
  {
    id: "banner-type-service-highlight",
    name: "Service Highlight",
    description: "Service promotion banner",
    promptFragment: "service highlight banner showcasing professional offerings and capabilities",
  },
  // Action
  {
    id: "banner-type-newsletter",
    name: "Newsletter Signup",
    description: "Email subscription promotion",
    promptFragment: "newsletter signup banner encouraging email subscription with compelling visuals",
  },
  {
    id: "banner-type-app-download",
    name: "App Download",
    description: "Mobile app promotion",
    promptFragment: "app download banner promoting mobile application with download incentive",
  },
  {
    id: "banner-type-free-trial",
    name: "Free Trial",
    description: "Free trial offer promotion",
    promptFragment: "free trial banner offering no-cost trial experience with clear value proposition",
  },
  {
    id: "banner-type-contact",
    name: "Contact Us",
    description: "Contact/inquiry promotion",
    promptFragment: "contact us banner inviting inquiries and customer communication",
  },
  {
    id: "banner-type-lead-gen",
    name: "Lead Generation",
    description: "Lead capture campaign",
    promptFragment: "lead generation banner designed to capture signups and conversions",
  },
  // Social
  {
    id: "banner-type-social-ad",
    name: "Social Media Ad",
    description: "Social platform advertisement",
    promptFragment: "social media ad banner optimized for social platform engagement",
  },
  // Informational / Company
  {
    id: "banner-type-about-us",
    name: "About Us",
    description: "Company story and team showcase",
    promptFragment: "about us banner showcasing company story and team identity",
  },
  {
    id: "banner-type-our-services",
    name: "Our Services",
    description: "Services overview banner",
    promptFragment: "services overview banner presenting what the company offers",
  },
  {
    id: "banner-type-our-team",
    name: "Our Team",
    description: "Team members showcase",
    promptFragment: "team showcase banner introducing staff members and company culture",
  },
  {
    id: "banner-type-company-values",
    name: "Company Values",
    description: "Core values and mission banner",
    promptFragment: "company values banner highlighting mission and core principles",
  },
  {
    id: "banner-type-case-study",
    name: "Case Study",
    description: "Success story or portfolio piece",
    promptFragment: "case study banner presenting success stories and client results",
  },
  {
    id: "banner-type-testimonials",
    name: "Testimonials",
    description: "Customer reviews and testimonials",
    promptFragment: "testimonials banner featuring customer reviews and social proof",
  },
  // Content
  {
    id: "banner-type-blog-post",
    name: "Blog Post Promotion",
    description: "Article or blog feature banner",
    promptFragment: "blog post banner promoting article content with editorial appeal",
  },
  {
    id: "banner-type-portfolio",
    name: "Portfolio Showcase",
    description: "Work samples display banner",
    promptFragment: "portfolio showcase banner displaying work samples and creative projects",
  },
  {
    id: "banner-type-faq-help",
    name: "FAQ / Help",
    description: "Help section or FAQ banner",
    promptFragment: "FAQ and help banner guiding users to support and assistance",
  },
  {
    id: "banner-type-coming-soon",
    name: "Coming Soon",
    description: "Pre-launch teaser banner",
    promptFragment: "coming soon banner building anticipation for an upcoming release",
  },
  // Trust / Social Proof
  {
    id: "banner-type-awards",
    name: "Awards & Recognition",
    description: "Certifications and awards banner",
    promptFragment: "awards banner showcasing certifications and professional recognition",
  },
  {
    id: "banner-type-partnership",
    name: "Partnership",
    description: "Partner or client logos banner",
    promptFragment: "partnership banner displaying trusted client and partner relationships",
  },
  {
    id: "banner-type-press-media",
    name: "Press / Media",
    description: "Media mentions and press banner",
    promptFragment: "press banner highlighting media mentions and news coverage",
  },
  // Social Media / Content
  {
    id: "banner-type-carousel",
    name: "Carousel Ad",
    description: "For social media slideshows/carousels",
    promptFragment: "carousel ad banner designed for swipeable social media content",
  },
  {
    id: "banner-type-email-header",
    name: "Email Header",
    description: "Header for newsletters/email campaigns",
    promptFragment: "email header banner for newsletter and email campaign visuals",
  },
  {
    id: "banner-type-app-screenshot",
    name: "App Store Screenshot",
    description: "Promotional screenshot for app stores",
    promptFragment: "app store screenshot banner showcasing mobile app interface",
  },
  {
    id: "banner-type-podcast-cover",
    name: "Podcast Cover",
    description: "Cover art for podcasts",
    promptFragment: "podcast cover art banner with audio show branding elements",
  },
  {
    id: "banner-type-event-ticket",
    name: "Event Ticket",
    description: "Digital tickets for events",
    promptFragment: "event ticket banner with digital admission pass aesthetic",
  },
  {
    id: "banner-type-menu-board",
    name: "Menu Board",
    description: "Digital signage for restaurants/cafes",
    promptFragment: "menu board banner for restaurant or cafe digital signage display",
  },
  {
    id: "banner-type-job-posting",
    name: "Job Posting",
    description: "Recruitment announcements",
    promptFragment: "job posting banner announcing recruitment and career opportunities",
  },
  {
    id: "banner-type-countdown",
    name: "Countdown Banner",
    description: "With timer for launches",
    promptFragment: "countdown banner with timer elements for time-sensitive launches",
  },
  {
    id: "banner-type-video-thumbnail",
    name: "Video Thumbnail",
    description: "Thumbnail for YouTube/video",
    promptFragment: "video thumbnail banner designed to attract clicks and views",
  },
  {
    id: "banner-type-infographic",
    name: "Infographic",
    description: "Mini promotional infographics",
    promptFragment: "infographic banner presenting data and information visually",
  },
  {
    id: "banner-type-coupon",
    name: "Coupon/Voucher",
    description: "Digital discount coupons",
    promptFragment: "coupon banner featuring discount codes and promotional offers",
  },
  {
    id: "banner-type-giveaway",
    name: "Giveaway",
    description: "Contests and giveaways",
    promptFragment: "giveaway banner announcing contests and prize opportunities",
  },
  // Call to Action
  {
    id: "banner-type-cta",
    name: "Call to Action",
    description: "Action-focused conversion banner",
    promptFragment: "call to action banner with compelling conversion-focused design",
  },
];

// ==========================================
// 2. BANNER SIZE / FORMAT (~25 presets)
// ==========================================
export const bannerSizeTemplates: BannerSizeTemplate[] = [
  // ==========================================
  // PLATFORM BUNDLES - Generate All Sizes for a Platform
  // ==========================================
  {
    id: "platform-google-ads-all",
    name: "Google Ads - All Sizes",
    description: "Generate banners for all 9 Google Ads standard sizes",
    promptFragment: "Google Display Ads format, IAB standard advertising banner",
    width: 0,
    height: 0,
    platform: "google-ads",
    category: "custom",
    isPlatformBundle: true,
    bundleSizeIds: [
      "size-leaderboard-728x90",
      "size-large-leaderboard-970x90",
      "size-medium-rectangle-300x250",
      "size-large-rectangle-336x280",
      "size-half-page-300x600",
      "size-wide-skyscraper-160x600",
      "size-billboard-970x250",
      "size-mobile-banner-320x50",
      "size-mobile-large-320x100",
    ],
  },
  {
    id: "platform-facebook-all",
    name: "Facebook - All Sizes",
    description: "Generate banners for all 4 Facebook standard sizes",
    promptFragment: "Facebook social media format, Meta advertising banner",
    width: 0,
    height: 0,
    platform: "facebook",
    category: "custom",
    isPlatformBundle: true,
    bundleSizeIds: [
      "size-facebook-feed-1200x628",
      "size-facebook-square-1080x1080",
      "size-facebook-cover-820x312",
      "size-instagram-story-1080x1920", // Story is shared with Facebook
    ],
  },
  {
    id: "platform-instagram-all",
    name: "Instagram - All Sizes",
    description: "Generate banners for all 4 Instagram standard sizes",
    promptFragment: "Instagram social media format, visual storytelling banner",
    width: 0,
    height: 0,
    platform: "instagram",
    category: "custom",
    isPlatformBundle: true,
    bundleSizeIds: [
      "size-instagram-square-1080x1080",
      "size-instagram-portrait-1080x1350",
      "size-instagram-story-1080x1920",
      "size-facebook-feed-1200x628", // Landscape shared with Facebook
    ],
  },
  {
    id: "platform-twitter-all",
    name: "Twitter/X - All Sizes",
    description: "Generate banners for all 3 Twitter/X standard sizes",
    promptFragment: "Twitter X social media format, social engagement banner",
    width: 0,
    height: 0,
    platform: "twitter",
    category: "custom",
    isPlatformBundle: true,
    bundleSizeIds: [
      "size-twitter-header-1500x500",
      "size-twitter-post-1200x675",
    ],
  },
  {
    id: "platform-linkedin-all",
    name: "LinkedIn - All Sizes",
    description: "Generate banners for all 3 LinkedIn standard sizes",
    promptFragment: "LinkedIn professional format, business social media banner",
    width: 0,
    height: 0,
    platform: "linkedin",
    category: "custom",
    isPlatformBundle: true,
    bundleSizeIds: [
      "size-linkedin-cover-1584x396",
      "size-linkedin-post-1200x627",
    ],
  },
  {
    id: "platform-youtube-all",
    name: "YouTube - All Sizes",
    description: "Generate banners for YouTube thumbnail and channel banner",
    promptFragment: "YouTube video platform format, video marketing banner",
    width: 0,
    height: 0,
    platform: "youtube",
    category: "custom",
    isPlatformBundle: true,
    bundleSizeIds: [
      "size-youtube-thumbnail-1280x720",
      "size-youtube-banner-2560x1440",
    ],
  },
  {
    id: "platform-website-all",
    name: "Website - All Sizes",
    description: "Generate banners for all 8 website standard sizes",
    promptFragment: "Website banner format, web design promotional banner",
    width: 0,
    height: 0,
    platform: "website",
    category: "custom",
    isPlatformBundle: true,
    bundleSizeIds: [
      "size-hero-1920x600",
      "size-hero-1920x800",
      "size-hero-1440x600",
      "size-sidebar-300x250",
      "size-sidebar-tall-300x600",
      "size-full-width-1920x400",
      "size-cta-800x200",
      "size-cta-1200x300",
    ],
  },
  {
    id: "platform-pinterest-all",
    name: "Pinterest - All Sizes",
    description: "Generate banners for Pinterest standard and long pins",
    promptFragment: "Pinterest visual discovery format, pin-style banner",
    width: 0,
    height: 0,
    platform: "pinterest",
    category: "custom",
    isPlatformBundle: true,
    bundleSizeIds: [
      "size-pinterest-1000x1500",
    ],
  },
  {
    id: "platform-tiktok-all",
    name: "TikTok - All Sizes",
    description: "Generate banners for TikTok/Reels vertical format",
    promptFragment: "TikTok Reels format, short-form video cover banner",
    width: 0,
    height: 0,
    platform: "tiktok",
    category: "custom",
    isPlatformBundle: true,
    bundleSizeIds: [
      "size-tiktok-1080x1920",
    ],
  },

  // ==========================================
  // INDIVIDUAL SIZES
  // ==========================================

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
  // Pinterest
  {
    id: "size-pinterest-1000x1500",
    name: "Pinterest Pin (1000x1500)",
    description: "Pinterest Pin (2:3 aspect ratio)",
    promptFragment: "Pinterest pin format, 2:3 aspect ratio, vertical social pin design",
    width: 1000,
    height: 1500,
    platform: "pinterest",
    category: "feed",
  },
  // TikTok / Reels
  {
    id: "size-tiktok-1080x1920",
    name: "TikTok/Reels (1080x1920)",
    description: "TikTok/Reels vertical format",
    promptFragment: "TikTok Reels format, full-screen vertical 9:16, short video cover design",
    width: 1080,
    height: 1920,
    platform: "tiktok",
    category: "story",
  },
  // Twitter/X
  {
    id: "size-twitter-header-1500x500",
    name: "Twitter/X Header (1500x500)",
    description: "Twitter/X Profile Header",
    promptFragment: "Twitter X header format, profile cover image, social header design",
    width: 1500,
    height: 500,
    platform: "twitter",
    category: "cover",
  },
  {
    id: "size-twitter-post-1200x675",
    name: "Twitter/X Post (1200x675)",
    description: "Twitter/X Post (16:9)",
    promptFragment: "Twitter X post format, 16:9 aspect ratio, social feed design",
    width: 1200,
    height: 675,
    platform: "twitter",
    category: "feed",
  },
  // LinkedIn
  {
    id: "size-linkedin-cover-1584x396",
    name: "LinkedIn Cover (1584x396)",
    description: "LinkedIn Company Page Cover",
    promptFragment: "LinkedIn cover format, company page header, professional social cover design",
    width: 1584,
    height: 396,
    platform: "linkedin",
    category: "cover",
  },
  {
    id: "size-linkedin-post-1200x627",
    name: "LinkedIn Post (1200x627)",
    description: "LinkedIn Feed Post",
    promptFragment: "LinkedIn post format, professional feed image, business social design",
    width: 1200,
    height: 627,
    platform: "linkedin",
    category: "feed",
  },
  // YouTube
  {
    id: "size-youtube-thumbnail-1280x720",
    name: "YouTube Thumbnail (1280x720)",
    description: "YouTube Video Thumbnail",
    promptFragment: "YouTube thumbnail format, video preview image, clickable video cover design",
    width: 1280,
    height: 720,
    platform: "youtube",
    category: "feed",
  },
  {
    id: "size-youtube-banner-2560x1440",
    name: "YouTube Banner (2560x1440)",
    description: "YouTube Channel Banner",
    promptFragment: "YouTube channel banner format, channel art header, video platform cover design",
    width: 2560,
    height: 1440,
    platform: "youtube",
    category: "cover",
  },
  // Email
  {
    id: "size-email-600x200",
    name: "Email Header (600x200)",
    description: "Email Header Standard",
    promptFragment: "email header format, newsletter top image, email marketing banner design",
    width: 600,
    height: 200,
    platform: "email",
    category: "leaderboard",
  },
  // Website - Ultrawide
  {
    id: "size-ultrawide-2560x1080",
    name: "Ultrawide (2560x1080)",
    description: "Ultrawide Display (21:9)",
    promptFragment: "ultrawide display format, 21:9 aspect ratio, cinematic wide banner design",
    width: 2560,
    height: 1080,
    platform: "website",
    category: "hero",
  },
  // Print - A4
  {
    id: "size-a4-portrait-2480x3508",
    name: "A4 Portrait (2480x3508)",
    description: "A4 Print Ready Portrait",
    promptFragment: "A4 portrait format, print-ready vertical, high-resolution print design",
    width: 2480,
    height: 3508,
    platform: "print",
    category: "custom",
  },
  {
    id: "size-a4-landscape-3508x2480",
    name: "A4 Landscape (3508x2480)",
    description: "A4 Print Ready Landscape",
    promptFragment: "A4 landscape format, print-ready horizontal, high-resolution print design",
    width: 3508,
    height: 2480,
    platform: "print",
    category: "custom",
  },
  // Nanosystems Custom Sizes
  {
    id: "size-nano-hero-1440x400",
    name: "Nano Hero Wide (1440x400)",
    description: "Nanosystems wide hero banner for main pages",
    promptFragment: "wide hero banner format, panoramic header design, full-width promotional section",
    width: 1440,
    height: 400,
    platform: "website",
    category: "hero",
  },
  {
    id: "size-nano-sidebar-560x685",
    name: "Nano Sidebar (560x685)",
    description: "Nanosystems sidebar/vertical banner for page sections",
    promptFragment: "vertical sidebar banner format, portrait promotional design, side column layout",
    width: 560,
    height: 685,
    platform: "website",
    category: "sidebar",
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
    promptFragment: "for a fashion and apparel brand with stylish retail aesthetics",
  },
  {
    id: "industry-electronics",
    name: "Electronics & Tech",
    description: "Consumer electronics and gadgets",
    promptFragment: "for an electronics and technology company with modern tech aesthetics",
  },
  {
    id: "industry-beauty",
    name: "Beauty & Cosmetics",
    description: "Skincare, makeup, and beauty products",
    promptFragment: "for a beauty and cosmetics brand with elegant skincare aesthetics",
  },
  {
    id: "industry-home-garden",
    name: "Home & Garden",
    description: "Home decor, furniture, and gardening",
    promptFragment: "for a home and garden company with interior design aesthetics",
  },
  {
    id: "industry-food-beverage",
    name: "Food & Beverage",
    description: "Food products, drinks, and grocery",
    promptFragment: "for a food and beverage brand with appetizing culinary aesthetics",
  },
  {
    id: "industry-jewelry",
    name: "Jewelry & Accessories",
    description: "Fine jewelry and fashion accessories",
    promptFragment: "for a jewelry brand with luxurious and elegant aesthetics",
  },
  {
    id: "industry-sports",
    name: "Sports & Outdoor",
    description: "Athletic gear and outdoor equipment",
    promptFragment: "for a sports and outdoor brand with dynamic athletic aesthetics",
  },
  {
    id: "industry-toys-games",
    name: "Toys & Games",
    description: "Children's toys and gaming products",
    promptFragment: "for a toys and games company with playful and fun aesthetics",
  },
  // Services
  {
    id: "industry-saas",
    name: "SaaS & Software",
    description: "Software as a service and applications",
    promptFragment: "for a SaaS software company with modern digital platform aesthetics",
  },
  {
    id: "industry-consulting",
    name: "Consulting & Advisory",
    description: "Business consulting and advisory services",
    promptFragment: "for a consulting firm with professional business aesthetics",
  },
  {
    id: "industry-healthcare",
    name: "Healthcare & Medical",
    description: "Medical services and healthcare",
    promptFragment: "for a healthcare organization with clean medical aesthetics",
  },
  {
    id: "industry-finance",
    name: "Finance & Banking",
    description: "Financial services and banking",
    promptFragment: "for a financial services company with trustworthy banking aesthetics",
  },
  {
    id: "industry-insurance",
    name: "Insurance",
    description: "Insurance services and products",
    promptFragment: "for an insurance company with protective and reliable aesthetics",
  },
  {
    id: "industry-education",
    name: "Education & E-Learning",
    description: "Educational services and online learning",
    promptFragment: "for an educational institution with inspiring learning aesthetics",
  },
  {
    id: "industry-legal",
    name: "Legal Services",
    description: "Law firms and legal services",
    promptFragment: "for a law firm with professional and authoritative aesthetics",
  },
  // Entertainment
  {
    id: "industry-gaming",
    name: "Gaming & Esports",
    description: "Video games and esports",
    promptFragment: "for a gaming company with dynamic esports and entertainment aesthetics",
  },
  {
    id: "industry-music",
    name: "Music & Audio",
    description: "Music streaming, instruments, and audio",
    promptFragment: "for a music brand with creative audio and entertainment aesthetics",
  },
  {
    id: "industry-movies",
    name: "Movies & Entertainment",
    description: "Film, TV, and streaming content",
    promptFragment: "for an entertainment company with cinematic film aesthetics",
  },
  {
    id: "industry-sports-media",
    name: "Sports Media",
    description: "Sports broadcasting and media",
    promptFragment: "for a sports media company with energetic broadcasting aesthetics",
  },
  {
    id: "industry-travel",
    name: "Travel & Tourism",
    description: "Travel agencies and tourism",
    promptFragment: "for a travel company with inspiring destination aesthetics",
  },
  // B2B
  {
    id: "industry-enterprise",
    name: "Enterprise Solutions",
    description: "Large-scale business solutions",
    promptFragment: "for an enterprise solutions company with professional B2B aesthetics",
  },
  {
    id: "industry-startup",
    name: "Startup & Tech",
    description: "Technology startups and innovation",
    promptFragment: "for a tech startup with innovative and disruptive aesthetics",
  },
  {
    id: "industry-agency",
    name: "Creative Agency",
    description: "Marketing and creative agencies",
    promptFragment: "for a creative agency with artistic marketing aesthetics",
  },
  {
    id: "industry-manufacturing",
    name: "Manufacturing & Industrial",
    description: "Manufacturing and industrial products",
    promptFragment: "for a manufacturing company with industrial B2B aesthetics",
  },
  {
    id: "industry-logistics",
    name: "Logistics & Shipping",
    description: "Shipping and logistics services",
    promptFragment: "for a logistics company with efficient supply chain aesthetics",
  },
  // Local Business
  {
    id: "industry-restaurant",
    name: "Restaurant & Dining",
    description: "Restaurants, cafes, and food service",
    promptFragment: "for a restaurant with inviting dining and culinary aesthetics",
  },
  {
    id: "industry-real-estate",
    name: "Real Estate",
    description: "Property and real estate services",
    promptFragment: "for a real estate company with premium property aesthetics",
  },
  {
    id: "industry-automotive",
    name: "Automotive",
    description: "Cars, dealerships, and auto services",
    promptFragment: "for an automotive company with sleek vehicle aesthetics",
  },
  {
    id: "industry-fitness",
    name: "Fitness & Wellness",
    description: "Gyms, fitness, and wellness centers",
    promptFragment: "for a fitness brand with energetic wellness aesthetics",
  },
  {
    id: "industry-salon-spa",
    name: "Salon & Spa",
    description: "Beauty salons and spa services",
    promptFragment: "for a salon and spa with relaxing beauty service aesthetics",
  },
  {
    id: "industry-hotel",
    name: "Hotel & Hospitality",
    description: "Hotels and hospitality services",
    promptFragment: "for a hotel with luxurious hospitality aesthetics",
  },
  {
    id: "industry-pet",
    name: "Pet Services",
    description: "Pet stores and pet services",
    promptFragment: "for a pet services company with friendly animal care aesthetics",
  },
  // Non-profit
  {
    id: "industry-charity",
    name: "Charity & Non-Profit",
    description: "Charitable organizations",
    promptFragment: "for a charity organization with heartfelt non-profit aesthetics",
  },
  {
    id: "industry-environmental",
    name: "Environmental",
    description: "Environmental and green causes",
    promptFragment: "for an environmental organization with eco-friendly green aesthetics",
  },
  {
    id: "industry-social-cause",
    name: "Social Cause",
    description: "Social activism and awareness",
    promptFragment: "for a social cause with impactful awareness campaign aesthetics",
  },
  {
    id: "industry-community",
    name: "Community Organization",
    description: "Community groups and local organizations",
    promptFragment: "for a community organization with welcoming local aesthetics",
  },
  // Specialized
  {
    id: "industry-crypto",
    name: "Crypto & Blockchain",
    description: "Cryptocurrency and blockchain",
    promptFragment: "for a crypto company with futuristic blockchain aesthetics",
  },
  {
    id: "industry-ai-ml",
    name: "AI & Machine Learning",
    description: "Artificial intelligence services",
    promptFragment: "for an AI company with intelligent technology aesthetics",
  },
  {
    id: "industry-cybersecurity",
    name: "Cybersecurity",
    description: "Security and protection services",
    promptFragment: "for a cybersecurity company with secure digital protection aesthetics",
  },
  {
    id: "industry-pharma",
    name: "Pharmaceutical",
    description: "Pharmaceutical and medical products",
    promptFragment: "for a pharmaceutical company with clinical healthcare aesthetics",
  },
  // Tech Services
  {
    id: "industry-phone-repair",
    name: "Phone Repair",
    description: "Mobile device repair services",
    promptFragment: "for a phone repair service with technical mobile device aesthetics",
  },
  {
    id: "industry-laptop-repair",
    name: "Laptop Repair",
    description: "Computer and laptop repair services",
    promptFragment: "for a laptop repair service with professional computer fix aesthetics",
  },
  {
    id: "industry-it-outsourcing",
    name: "IT Outsourcing",
    description: "IT staffing and outsourcing services",
    promptFragment: "for an IT outsourcing company with professional tech staffing aesthetics",
  },
  {
    id: "industry-nanotechnology",
    name: "Nanotechnology",
    description: "Nanotech research and products",
    promptFragment: "for a nanotechnology company with advanced scientific research aesthetics",
  },
  {
    id: "industry-data-center",
    name: "Data Center",
    description: "Data center and hosting services",
    promptFragment: "for a data center with professional server infrastructure aesthetics",
  },
  {
    id: "industry-cloud-services",
    name: "Cloud Services",
    description: "Cloud computing and SaaS hosting",
    promptFragment: "for a cloud services provider with modern cloud computing aesthetics",
  },
  // Additional Tech
  {
    id: "industry-3d-printing",
    name: "3D Printing",
    description: "Additive manufacturing services",
    promptFragment: "for a 3D printing company with innovative additive manufacturing aesthetics",
  },
  {
    id: "industry-drone-services",
    name: "Drone Services",
    description: "Commercial drone operations",
    promptFragment: "for a drone services company with aerial technology aesthetics",
  },
  {
    id: "industry-ev-electric",
    name: "EV & Electric",
    description: "Electric vehicles and charging",
    promptFragment: "for an electric vehicle company with sustainable transport aesthetics",
  },
  {
    id: "industry-solar-renewable",
    name: "Solar & Renewable",
    description: "Solar panels and green energy",
    promptFragment: "for a solar energy company with renewable green power aesthetics",
  },
  {
    id: "industry-smart-home",
    name: "Smart Home",
    description: "IoT and home automation",
    promptFragment: "for a smart home company with modern IoT automation aesthetics",
  },
  {
    id: "industry-telecom",
    name: "Telecommunications",
    description: "Telecommunications services",
    promptFragment: "for a telecommunications company with connectivity and network aesthetics",
  },
  // Services & Local Business
  {
    id: "industry-coworking",
    name: "Coworking Space",
    description: "Shared offices and coworking spaces",
    promptFragment: "for a coworking space with modern collaborative workspace aesthetics",
  },
  {
    id: "industry-dentistry",
    name: "Dentistry",
    description: "Dental clinics and oral health",
    promptFragment: "for a dental clinic with clean oral health aesthetics",
  },
  {
    id: "industry-veterinary",
    name: "Veterinary",
    description: "Veterinary clinics and animal hospitals",
    promptFragment: "for a veterinary clinic with caring pet healthcare aesthetics",
  },
  {
    id: "industry-photography",
    name: "Photography",
    description: "Professional photography services",
    promptFragment: "for a photography studio with artistic visual portfolio aesthetics",
  },
  {
    id: "industry-wedding",
    name: "Wedding Services",
    description: "Wedding and bridal services",
    promptFragment: "for a wedding services company with elegant bridal aesthetics",
  },
  {
    id: "industry-moving",
    name: "Moving Services",
    description: "Moving and relocation services",
    promptFragment: "for a moving company with reliable relocation service aesthetics",
  },
  {
    id: "industry-cleaning",
    name: "Cleaning Services",
    description: "Professional cleaning services",
    promptFragment: "for a cleaning services company with fresh cleanliness aesthetics",
  },
  {
    id: "industry-daycare",
    name: "Daycare/Childcare",
    description: "Daycare centers and childcare services",
    promptFragment: "for a daycare center with nurturing childcare aesthetics",
  },
  {
    id: "industry-tutoring",
    name: "Tutoring/Education",
    description: "Private tutoring and educational services",
    promptFragment: "for a tutoring service with personalized education aesthetics",
  },
  {
    id: "industry-escape-room",
    name: "Escape Room",
    description: "Escape rooms and immersive entertainment",
    promptFragment: "for an escape room with exciting immersive adventure aesthetics",
  },
  {
    id: "industry-brewery",
    name: "Brewery/Winery",
    description: "Breweries, wineries, and craft beverages",
    promptFragment: "for a brewery or winery with artisan craft beverage aesthetics",
  },
  {
    id: "industry-marketplace",
    name: "Marketplace",
    description: "Multi-vendor marketplace platforms",
    promptFragment: "for a marketplace platform with diverse e-commerce aesthetics",
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
    promptFragment: "using minimalist design with clean layout and generous whitespace",
  },
  {
    id: "design-clean",
    name: "Clean Modern",
    description: "Polished, contemporary clean look",
    promptFragment: "using clean modern design with polished contemporary aesthetics",
  },
  {
    id: "design-flat",
    name: "Flat Design",
    description: "2D design without shadows or depth",
    promptFragment: "using flat design style with crisp 2D elements and no shadows",
  },
  {
    id: "design-material",
    name: "Material Design",
    description: "Google Material Design principles",
    promptFragment: "using material design with subtle shadows and layered surfaces",
  },
  {
    id: "design-neumorphism",
    name: "Neumorphism",
    description: "Soft UI with subtle shadows",
    promptFragment: "using neumorphic design with soft UI and subtle extruded elements",
  },
  {
    id: "design-glassmorphism",
    name: "Glassmorphism",
    description: "Frosted glass effect with transparency",
    promptFragment: "using glassmorphism design with frosted glass effects and blur backdrop",
  },
  // Bold
  {
    id: "design-bold",
    name: "Bold",
    description: "Strong, impactful design with heavy visual elements",
    promptFragment: "using bold design with strong impactful visual elements",
  },
  {
    id: "design-vibrant",
    name: "Vibrant",
    description: "Bold, eye-catching colors",
    promptFragment: "using vibrant design with bold eye-catching colors and dynamic energy",
  },
  {
    id: "design-high-contrast",
    name: "High Contrast",
    description: "Strong contrast between elements",
    promptFragment: "using high contrast design with stark visual separation",
  },
  {
    id: "design-neon",
    name: "Neon Glow",
    description: "Glowing neon aesthetic",
    promptFragment: "using neon glow design with bright luminous glowing elements",
  },
  {
    id: "design-gradient",
    name: "Gradient Rich",
    description: "Smooth color gradients",
    promptFragment: "using gradient-rich design with smooth flowing color transitions",
  },
  {
    id: "design-duotone",
    name: "Duotone",
    description: "Two-color design aesthetic",
    promptFragment: "using duotone design with a limited two-color palette",
  },
  // Professional
  {
    id: "design-corporate",
    name: "Corporate",
    description: "Business-appropriate professional design",
    promptFragment: "using corporate design with professional business aesthetics",
  },
  {
    id: "design-business",
    name: "Business Modern",
    description: "Modern professional business style",
    promptFragment: "using modern business design with contemporary professional look",
  },
  {
    id: "design-executive",
    name: "Executive",
    description: "Premium executive style",
    promptFragment: "using executive design with premium high-end professional aesthetics",
  },
  {
    id: "design-enterprise",
    name: "Enterprise",
    description: "Large-scale enterprise design",
    promptFragment: "using enterprise design with institutional professional look",
  },
  {
    id: "design-formal",
    name: "Formal",
    description: "Traditional formal aesthetic",
    promptFragment: "using formal design with traditional professional layout",
  },
  // Creative
  {
    id: "design-artistic",
    name: "Artistic",
    description: "Creative artistic expression",
    promptFragment: "using artistic design with creative unique visual expression",
  },
  {
    id: "design-abstract",
    name: "Abstract",
    description: "Non-representational abstract forms",
    promptFragment: "using abstract design with non-representational conceptual forms",
  },
  {
    id: "design-geometric",
    name: "Geometric",
    description: "Shapes and geometric patterns",
    promptFragment: "using geometric design with shape-based mathematical patterns",
  },
  {
    id: "design-illustrated",
    name: "Illustrated",
    description: "Hand-drawn illustration style",
    promptFragment: "using illustrated design with custom hand-drawn elements",
  },
  {
    id: "design-hand-drawn",
    name: "Hand-Drawn",
    description: "Sketchy hand-drawn look",
    promptFragment: "using hand-drawn design with sketchy organic line work",
  },
  // Retro
  {
    id: "design-vintage",
    name: "Vintage",
    description: "Classic vintage aesthetic",
    promptFragment: "using vintage design with classic retro nostalgic style",
  },
  {
    id: "design-retro-80s",
    name: "80s Retro",
    description: "1980s nostalgic design",
    promptFragment: "using 80s retro design with synthwave neon aesthetics",
  },
  {
    id: "design-retro-90s",
    name: "90s Style",
    description: "1990s inspired design",
    promptFragment: "using 90s style design with millennium era nostalgia",
  },
  {
    id: "design-art-deco",
    name: "Art Deco",
    description: "1920s Art Deco style",
    promptFragment: "using Art Deco design with 1920s geometric golden age style",
  },
  {
    id: "design-mid-century",
    name: "Mid-Century Modern",
    description: "1950s-60s design aesthetic",
    promptFragment: "using mid-century modern design with atomic age retro futurism",
  },
  // Tech
  {
    id: "design-futuristic",
    name: "Futuristic",
    description: "Forward-looking sci-fi style",
    promptFragment: "using futuristic design with advanced sci-fi technology aesthetics",
  },
  {
    id: "design-cyberpunk",
    name: "Cyberpunk",
    description: "High-tech dystopian style",
    promptFragment: "using cyberpunk design with dystopian neon noir aesthetics",
  },
  {
    id: "design-tech-startup",
    name: "Tech Startup",
    description: "Modern tech startup aesthetic",
    promptFragment: "using tech startup design with modern digital innovation style",
  },
  {
    id: "design-digital",
    name: "Digital",
    description: "Digital-first design approach",
    promptFragment: "using digital design with tech-forward online-first aesthetics",
  },
  {
    id: "design-holographic",
    name: "Holographic",
    description: "Iridescent holographic style",
    promptFragment: "using holographic design with iridescent rainbow shimmer effects",
  },
  // Organic
  {
    id: "design-natural",
    name: "Natural",
    description: "Nature-inspired organic design",
    promptFragment: "using natural design with organic nature-inspired elements",
  },
  {
    id: "design-eco-friendly",
    name: "Eco-Friendly",
    description: "Sustainable green design",
    promptFragment: "using eco-friendly design with sustainable green aesthetics",
  },
  {
    id: "design-botanical",
    name: "Botanical",
    description: "Plant and floral themed",
    promptFragment: "using botanical design with plant-inspired floral elements",
  },
  {
    id: "design-earthy",
    name: "Earthy",
    description: "Earth tones and natural feel",
    promptFragment: "using earthy design with natural earth tones and grounded feel",
  },
  {
    id: "design-sustainable",
    name: "Sustainable",
    description: "Conscious sustainable design",
    promptFragment: "using sustainable design with conscious environmentally aware style",
  },
  // New Design Styles
  {
    id: "design-neobrutalist",
    name: "Neobrutalism",
    description: "Bold colors, hard edges, raw aesthetics",
    promptFragment: "using neobrutalist design with bold raw hard-edged aesthetics",
  },
  {
    id: "design-vaporwave",
    name: "Vaporwave",
    description: "Retro 80s/90s, neon, grids, nostalgic",
    promptFragment: "using vaporwave design with nostalgic 80s 90s neon grid aesthetics",
  },
  {
    id: "design-bauhaus",
    name: "Bauhaus",
    description: "Geometric, primary colors, modernist",
    promptFragment: "using bauhaus design with geometric modernist primary color aesthetics",
  },
  {
    id: "design-memphis",
    name: "Memphis Design",
    description: "Colorful, playful, geometric patterns",
    promptFragment: "using memphis design with colorful playful geometric patterns",
  },
  {
    id: "design-swiss",
    name: "Swiss/International",
    description: "Clean grid, strong typography",
    promptFragment: "using swiss international design with clean grid and strong typography",
  },
  {
    id: "design-japandi",
    name: "Japandi",
    description: "Japanese-Scandinavian minimalism",
    promptFragment: "using japandi design with warm Japanese-Scandinavian minimalism",
  },
  {
    id: "design-retrowave",
    name: "Retrowave/Synthwave",
    description: "80s synth aesthetic",
    promptFragment: "using retrowave synthwave design with 80s neon sunset aesthetics",
  },
  {
    id: "design-y2k",
    name: "Y2K Aesthetic",
    description: "Early 2000s digital style",
    promptFragment: "using Y2K design with early 2000s chrome bubble futuristic style",
  },
  {
    id: "design-brutalist-web",
    name: "Brutalist Web",
    description: "Raw, unpolished, exposed structure",
    promptFragment: "using brutalist web design with raw unpolished exposed structure",
  },
  {
    id: "design-skeuomorphic",
    name: "Skeuomorphic",
    description: "Realistic textures and shadows",
    promptFragment: "using skeuomorphic design with realistic textures and 3D depth",
  },
  {
    id: "design-kawaii",
    name: "Kawaii",
    description: "Cute Japanese-inspired style",
    promptFragment: "using kawaii design with cute Japanese-inspired pastel style",
  },
  {
    id: "design-dark-mode",
    name: "Dark Mode",
    description: "Dark UI optimized design",
    promptFragment: "using dark mode design optimized for low-light viewing",
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
    promptFragment: "featuring a classic black and white monochrome color palette",
  },
  {
    id: "color-grayscale",
    name: "Grayscale",
    description: "Shades of gray",
    promptFragment: "featuring a grayscale color palette with sophisticated gray tones",
  },
  {
    id: "color-single-hue",
    name: "Single Hue",
    description: "Variations of one color",
    promptFragment: "featuring a monochromatic color palette with single hue variations",
  },
  // Primary Colors
  {
    id: "color-bold-red",
    name: "Bold Red",
    description: "Powerful red-based palette",
    promptFragment: "featuring a bold red color palette conveying power and energy",
  },
  {
    id: "color-electric-blue",
    name: "Electric Blue",
    description: "Vibrant blue palette",
    promptFragment: "featuring an electric blue color palette conveying trust and innovation",
  },
  {
    id: "color-sunny-yellow",
    name: "Sunny Yellow",
    description: "Bright yellow palette",
    promptFragment: "featuring a sunny yellow color palette conveying optimism and warmth",
  },
  {
    id: "color-forest-green",
    name: "Forest Green",
    description: "Natural green palette",
    promptFragment: "featuring a forest green color palette conveying nature and growth",
  },
  {
    id: "color-royal-purple",
    name: "Royal Purple",
    description: "Rich purple palette",
    promptFragment: "featuring a royal purple color palette conveying luxury and creativity",
  },
  // Warm Colors
  {
    id: "color-sunset-orange",
    name: "Sunset Orange",
    description: "Warm orange tones",
    promptFragment: "featuring a sunset orange color palette with warm amber tones",
  },
  {
    id: "color-coral-pink",
    name: "Coral Pink",
    description: "Soft coral and pink",
    promptFragment: "featuring a coral pink color palette with soft warm tones",
  },
  {
    id: "color-golden-yellow",
    name: "Golden Yellow",
    description: "Rich golden tones",
    promptFragment: "featuring a golden yellow color palette with rich honey warmth",
  },
  {
    id: "color-terracotta",
    name: "Terracotta",
    description: "Earthy rust tones",
    promptFragment: "featuring a terracotta color palette with earthy rust warmth",
  },
  {
    id: "color-warm-neutrals",
    name: "Warm Neutrals",
    description: "Warm beige and cream",
    promptFragment: "featuring warm neutral colors with beige and cream tones",
  },
  // Cool Colors
  {
    id: "color-ocean-blue",
    name: "Ocean Blue",
    description: "Deep sea blues",
    promptFragment: "featuring an ocean blue color palette with deep aquatic tones",
  },
  {
    id: "color-mint-green",
    name: "Mint Green",
    description: "Fresh mint palette",
    promptFragment: "featuring a mint green color palette with fresh cool tones",
  },
  {
    id: "color-lavender",
    name: "Lavender",
    description: "Soft purple lavender",
    promptFragment: "featuring a lavender color palette with soft gentle violet tones",
  },
  {
    id: "color-ice-blue",
    name: "Ice Blue",
    description: "Cool icy tones",
    promptFragment: "featuring an ice blue color palette with cool frosty tones",
  },
  {
    id: "color-cool-gray",
    name: "Cool Gray",
    description: "Modern cool grays",
    promptFragment: "featuring a cool gray color palette with modern sophisticated tones",
  },
  // Vibrant
  {
    id: "color-neon",
    name: "Neon Colors",
    description: "Bright fluorescent palette",
    promptFragment: "featuring neon colors with bright fluorescent glowing tones",
  },
  {
    id: "color-rainbow",
    name: "Rainbow",
    description: "Full spectrum colors",
    promptFragment: "featuring a rainbow color palette with full spectrum vibrancy",
  },
  {
    id: "color-candy",
    name: "Candy Colors",
    description: "Sweet pastel brights",
    promptFragment: "featuring candy colors with sweet playful pastel tones",
  },
  {
    id: "color-pop-art",
    name: "Pop Art",
    description: "Bold pop art colors",
    promptFragment: "featuring pop art colors with bold high-contrast tones",
  },
  // Elegant
  {
    id: "color-gold-black",
    name: "Gold & Black",
    description: "Luxury gold and black",
    promptFragment: "featuring a luxurious gold and black color palette",
  },
  {
    id: "color-silver-navy",
    name: "Silver & Navy",
    description: "Sophisticated silver navy",
    promptFragment: "featuring a sophisticated silver and navy color palette",
  },
  {
    id: "color-rose-gold",
    name: "Rose Gold",
    description: "Feminine rose gold",
    promptFragment: "featuring an elegant rose gold metallic color palette",
  },
  {
    id: "color-champagne",
    name: "Champagne",
    description: "Soft champagne tones",
    promptFragment: "featuring a soft champagne color palette with luxe neutral tones",
  },
  // Seasonal
  {
    id: "color-spring-pastels",
    name: "Spring Pastels",
    description: "Soft spring colors",
    promptFragment: "featuring spring pastel colors with soft blooming tones",
  },
  {
    id: "color-summer-brights",
    name: "Summer Brights",
    description: "Vibrant summer palette",
    promptFragment: "featuring summer bright colors with vibrant tropical tones",
  },
  {
    id: "color-autumn-warm",
    name: "Autumn Warm",
    description: "Fall harvest colors",
    promptFragment: "featuring autumn warm colors with harvest and fall tones",
  },
  {
    id: "color-winter-cool",
    name: "Winter Cool",
    description: "Cool winter palette",
    promptFragment: "featuring winter cool colors with frosty seasonal tones",
  },
  // Gradients & Mixed
  {
    id: "color-sunset-gradient",
    name: "Sunset Gradient",
    description: "Orange to pink to purple gradient",
    promptFragment: "featuring a sunset gradient from orange through pink to purple",
  },
  {
    id: "color-berry-mix",
    name: "Berry Mix",
    description: "Violet, burgundy and rose tones",
    promptFragment: "featuring a berry mix palette with violet and burgundy tones",
  },
  {
    id: "color-fire-ice",
    name: "Fire & Ice",
    description: "Red to purple to blue contrast",
    promptFragment: "featuring a fire and ice palette with contrasting warm and cool tones",
  },
  {
    id: "color-cotton-candy",
    name: "Cotton Candy",
    description: "Pastel pink and pastel blue",
    promptFragment: "featuring cotton candy colors with soft pastel pink and blue",
  },
  {
    id: "color-tropical",
    name: "Tropical",
    description: "Teal, coral and lime palette",
    promptFragment: "featuring tropical colors with teal, coral and lime vibrancy",
  },
  {
    id: "color-teal-aqua",
    name: "Teal Aqua",
    description: "Fresh teal and aqua blue tones",
    promptFragment: "featuring a teal aqua color palette with fresh ocean-inspired tones",
  },
  {
    id: "color-mocha",
    name: "Mocha Coffee",
    description: "Brown, cream and caramel tones",
    promptFragment: "featuring mocha coffee colors with warm brown and cream tones",
  },
  {
    id: "color-midnight",
    name: "Midnight Blue",
    description: "Deep navy to black gradient",
    promptFragment: "featuring midnight blue colors transitioning to deep navy",
  },
  {
    id: "color-peachy",
    name: "Peachy Keen",
    description: "Peach, coral and cream tones",
    promptFragment: "featuring peachy keen colors with soft coral and cream warmth",
  },
  {
    id: "color-sage-green",
    name: "Sage Green",
    description: "Muted green and off-white",
    promptFragment: "featuring sage green colors with calming natural muted tones",
  },
  {
    id: "color-dusty-rose",
    name: "Dusty Rose",
    description: "Muted pink and mauve tones",
    promptFragment: "featuring dusty rose colors with vintage muted pink tones",
  },
  {
    id: "color-electric-lime",
    name: "Electric Lime",
    description: "Neon green and black contrast",
    promptFragment: "featuring electric lime colors with high-energy neon contrast",
  },
  {
    id: "color-bronze-copper",
    name: "Bronze & Copper",
    description: "Metallic warm tones",
    promptFragment: "featuring bronze and copper colors with warm metallic elegance",
  },
];

// ==========================================
// 6. MOOD / EMOTION (~30 presets)
// ==========================================
export const moodTemplates: BannerTemplate[] = [
  // Positive
  {
    id: "mood-exciting",
    name: "Exciting",
    description: "High energy and thrilling",
    promptFragment: "creating an exciting high-energy atmosphere that captivates and engages",
  },
  {
    id: "mood-joyful",
    name: "Joyful",
    description: "Happy and cheerful",
    promptFragment: "creating a joyful uplifting atmosphere that inspires happiness",
  },
  {
    id: "mood-inspiring",
    name: "Inspiring",
    description: "Motivational and uplifting",
    promptFragment: "creating an inspiring motivational atmosphere that empowers viewers",
  },
  {
    id: "mood-trustworthy",
    name: "Trustworthy",
    description: "Reliable and dependable",
    promptFragment: "creating a trustworthy dependable atmosphere that builds confidence",
  },
  {
    id: "mood-friendly",
    name: "Friendly",
    description: "Warm and approachable",
    promptFragment: "creating a friendly welcoming atmosphere that feels approachable",
  },
  {
    id: "mood-playful",
    name: "Playful",
    description: "Fun and lighthearted",
    promptFragment: "creating a playful lighthearted atmosphere with whimsical charm",
  },
  {
    id: "mood-energetic",
    name: "Energetic",
    description: "Dynamic and active",
    promptFragment: "creating an energetic dynamic atmosphere with vibrant intensity",
  },
  // Serious
  {
    id: "mood-professional",
    name: "Professional",
    description: "Business-like and competent",
    promptFragment: "creating a professional business-oriented atmosphere conveying competence",
  },
  {
    id: "mood-authoritative",
    name: "Authoritative",
    description: "Expert and commanding",
    promptFragment: "creating an authoritative commanding atmosphere that projects expertise",
  },
  {
    id: "mood-luxurious",
    name: "Luxurious",
    description: "Premium and high-end",
    promptFragment: "creating a luxurious opulent atmosphere with premium elegance",
  },
  {
    id: "mood-sophisticated",
    name: "Sophisticated",
    description: "Refined and elegant",
    promptFragment: "creating a sophisticated refined atmosphere with cultured elegance",
  },
  {
    id: "mood-premium",
    name: "Premium",
    description: "High-quality exclusive",
    promptFragment: "creating a premium upscale atmosphere conveying exclusivity",
  },
  // Urgent
  {
    id: "mood-urgent",
    name: "Urgent",
    description: "Time-sensitive and pressing",
    promptFragment: "creating an urgent time-sensitive atmosphere demanding immediate attention",
  },
  {
    id: "mood-fomo",
    name: "FOMO",
    description: "Fear of missing out",
    promptFragment: "creating a FOMO atmosphere emphasizing exclusive limited opportunity",
  },
  {
    id: "mood-limited",
    name: "Limited",
    description: "Scarce and exclusive",
    promptFragment: "creating a limited availability atmosphere highlighting scarcity",
  },
  {
    id: "mood-exclusive",
    name: "Exclusive",
    description: "Special and select",
    promptFragment: "creating an exclusive VIP atmosphere for privileged audiences",
  },
  {
    id: "mood-last-chance",
    name: "Last Chance",
    description: "Final opportunity",
    promptFragment: "creating a last-chance atmosphere with compelling urgency",
  },
  // Calm
  {
    id: "mood-peaceful",
    name: "Peaceful",
    description: "Calm and tranquil",
    promptFragment: "creating a peaceful serene atmosphere with calming tranquility",
  },
  {
    id: "mood-relaxing",
    name: "Relaxing",
    description: "Soothing and restful",
    promptFragment: "creating a relaxing soothing atmosphere that promotes comfort",
  },
  {
    id: "mood-zen",
    name: "Zen",
    description: "Mindful and balanced",
    promptFragment: "creating a zen-like balanced atmosphere with mindful harmony",
  },
  // New Moods
  {
    id: "mood-nostalgic",
    name: "Nostalgic",
    description: "Warm, familiar, throwback",
    promptFragment: "creating a nostalgic sentimental atmosphere evoking warm memories",
  },
  {
    id: "mood-bold",
    name: "Bold & Daring",
    description: "Courageous, attention-grabbing",
    promptFragment: "creating a bold daring atmosphere that demands attention",
  },
  {
    id: "mood-mysterious",
    name: "Mysterious",
    description: "Intriguing, enigmatic",
    promptFragment: "creating a mysterious intriguing atmosphere that sparks curiosity",
  },
  {
    id: "mood-eco-conscious",
    name: "Eco-Conscious",
    description: "Green, sustainable, natural",
    promptFragment: "creating an eco-conscious sustainable atmosphere emphasizing environmental awareness",
  },
  {
    id: "mood-rebellious",
    name: "Rebellious",
    description: "Edgy, unconventional",
    promptFragment: "creating a rebellious edgy atmosphere with unconventional appeal",
  },
  {
    id: "mood-whimsical",
    name: "Whimsical",
    description: "Fantasy, dreamlike",
    promptFragment: "creating a whimsical dreamlike atmosphere with magical fantasy elements",
  },
  {
    id: "mood-empowering",
    name: "Empowering",
    description: "Motivational, strength",
    promptFragment: "creating an empowering confident atmosphere that inspires strength",
  },
  {
    id: "mood-cozy",
    name: "Cozy & Warm",
    description: "Comfortable, homey",
    promptFragment: "creating a cozy inviting atmosphere with comfortable warmth",
  },
  {
    id: "mood-fresh",
    name: "Fresh & Clean",
    description: "New, crisp, modern",
    promptFragment: "creating a fresh modern atmosphere with crisp clean energy",
  },
  {
    id: "mood-adventurous",
    name: "Adventurous",
    description: "Exciting, exploration",
    promptFragment: "creating an adventurous atmosphere inspiring exploration and discovery",
  },
];

// ==========================================
// 7. SEASONAL / HOLIDAY THEMES (~40 presets)
// ==========================================
export const seasonalTemplates: BannerTemplate[] = [
  // Seasons
  {
    id: "seasonal-spring",
    name: "Spring Fresh",
    description: "Fresh spring renewal theme",
    promptFragment: "with a fresh spring renewal theme featuring blooming florals and new growth",
  },
  {
    id: "seasonal-summer",
    name: "Summer Vibes",
    description: "Warm summer energy",
    promptFragment: "with a warm summer theme radiating sunny vacation energy",
  },
  {
    id: "seasonal-autumn",
    name: "Autumn Harvest",
    description: "Fall harvest theme",
    promptFragment: "with an autumn harvest theme featuring fall foliage and warm tones",
  },
  {
    id: "seasonal-winter",
    name: "Winter Wonderland",
    description: "Snowy winter magic",
    promptFragment: "with a winter wonderland theme featuring frosty snowy elements",
  },
  // Major Holidays
  {
    id: "holiday-christmas",
    name: "Christmas",
    description: "Festive Christmas theme",
    promptFragment: "with a festive Christmas theme in traditional red and green holiday colors",
  },
  {
    id: "holiday-new-year",
    name: "New Year",
    description: "New Year celebration",
    promptFragment: "with a New Year celebration theme featuring midnight countdown elements",
  },
  {
    id: "holiday-valentines",
    name: "Valentine's Day",
    description: "Romantic Valentine's theme",
    promptFragment: "with a romantic Valentine's Day theme featuring hearts and love motifs",
  },
  {
    id: "holiday-easter",
    name: "Easter",
    description: "Spring Easter theme",
    promptFragment: "with an Easter spring celebration theme in soft pastel colors",
  },
  {
    id: "holiday-halloween",
    name: "Halloween",
    description: "Spooky Halloween theme",
    promptFragment: "with a spooky Halloween theme in orange and black with eerie elements",
  },
  {
    id: "holiday-thanksgiving",
    name: "Thanksgiving",
    description: "Gratitude Thanksgiving theme",
    promptFragment: "with a Thanksgiving gratitude theme featuring harvest celebration imagery",
  },
  {
    id: "holiday-independence",
    name: "Independence Day",
    description: "Patriotic celebration",
    promptFragment: "with a patriotic Independence Day theme celebrating national pride",
  },
  {
    id: "holiday-st-patrick",
    name: "St. Patrick's Day",
    description: "Irish celebration theme",
    promptFragment: "with a St. Patrick's Day theme featuring Irish green and lucky symbols",
  },
  // Sales Events
  {
    id: "event-black-friday",
    name: "Black Friday",
    description: "Black Friday sales event",
    promptFragment: "with a Black Friday mega sale theme emphasizing massive discounts",
  },
  {
    id: "event-cyber-monday",
    name: "Cyber Monday",
    description: "Cyber Monday deals",
    promptFragment: "with a Cyber Monday digital deals theme for online shopping",
  },
  {
    id: "event-boxing-day",
    name: "Boxing Day",
    description: "Boxing Day sales",
    promptFragment: "with a Boxing Day post-holiday clearance sale theme",
  },
  {
    id: "event-end-season",
    name: "End of Season",
    description: "Seasonal clearance event",
    promptFragment: "with an end-of-season clearance theme for seasonal transitions",
  },
  // Special Days
  {
    id: "special-mothers-day",
    name: "Mother's Day",
    description: "Mother's Day celebration",
    promptFragment: "with a Mother's Day celebration theme honoring maternal love",
  },
  {
    id: "special-fathers-day",
    name: "Father's Day",
    description: "Father's Day celebration",
    promptFragment: "with a Father's Day tribute theme celebrating dad appreciation",
  },
  {
    id: "special-back-school",
    name: "Back to School",
    description: "School season start",
    promptFragment: "with a back-to-school theme marking the academic season start",
  },
  {
    id: "special-summer-sale",
    name: "Summer Sale",
    description: "Summer shopping event",
    promptFragment: "with a summer sale theme featuring hot seasonal deals",
  },
  {
    id: "special-spring-sale",
    name: "Spring Sale",
    description: "Spring shopping event",
    promptFragment: "with a spring sale theme highlighting fresh seasonal renewal",
  },
  {
    id: "special-labor-day",
    name: "Labor Day",
    description: "Labor Day weekend",
    promptFragment: "with a Labor Day weekend theme celebrating workers",
  },
  {
    id: "special-memorial-day",
    name: "Memorial Day",
    description: "Memorial Day remembrance",
    promptFragment: "with a Memorial Day remembrance theme in patriotic tribute style",
  },
  {
    id: "special-earth-day",
    name: "Earth Day",
    description: "Environmental awareness",
    promptFragment: "with an Earth Day environmental awareness theme in green planet style",
  },
  {
    id: "special-singles-day",
    name: "Singles' Day",
    description: "11.11 Shopping festival",
    promptFragment: "with a Singles' Day 11.11 shopping festival celebration theme",
  },
  // International Holidays
  {
    id: "holiday-diwali",
    name: "Diwali",
    description: "Festival of lights",
    promptFragment: "with a Diwali festival of lights theme featuring Indian celebration elements",
  },
  {
    id: "holiday-chinese-new-year",
    name: "Chinese New Year",
    description: "Lunar new year celebration",
    promptFragment: "with a Chinese New Year lunar celebration theme in red and gold",
  },
  {
    id: "holiday-ramadan",
    name: "Ramadan/Eid",
    description: "Islamic holidays",
    promptFragment: "with a Ramadan and Eid celebration theme featuring crescent moon imagery",
  },
  {
    id: "holiday-hanukkah",
    name: "Hanukkah",
    description: "Jewish holiday",
    promptFragment: "with a Hanukkah celebration theme featuring menorah and blue elements",
  },
  // Additional Sales Events
  {
    id: "special-winter-sale",
    name: "Winter Sale",
    description: "Winter season deals",
    promptFragment: "with a winter sale theme featuring cold season deals and snowy elements",
  },
  {
    id: "special-mid-year-sale",
    name: "Mid-Year Sale",
    description: "Half-year deals",
    promptFragment: "with a mid-year sale theme for half-year clearance deals",
  },
  {
    id: "special-anniversary-sale",
    name: "Anniversary Sale",
    description: "Store/brand anniversary",
    promptFragment: "with an anniversary sale theme celebrating brand milestones",
  },
  {
    id: "special-grand-opening",
    name: "Grand Opening",
    description: "New launch celebration",
    promptFragment: "with a grand opening celebration theme for new launches",
  },
  {
    id: "special-pre-order",
    name: "Pre-Order",
    description: "Pre-order promotions",
    promptFragment: "with a pre-order early access theme for reservation promotions",
  },
  {
    id: "special-vip-exclusive",
    name: "VIP Exclusive",
    description: "VIP exclusive offers",
    promptFragment: "with a VIP exclusive members-only theme for premium offers",
  },
  {
    id: "event-prime-day",
    name: "Prime Day Style",
    description: "Major shopping event style",
    promptFragment: "with a mega shopping event theme featuring prime day style deals",
  },
  {
    id: "special-weekend-deal",
    name: "Weekend Deal",
    description: "Weekend specials",
    promptFragment: "with a weekend special deals theme for limited-time offers",
  },
];

// ==========================================
// SECTION C: VISUAL ELEMENTS
// ==========================================

// ==========================================
// 8. BACKGROUND STYLE (~45 presets)
// ==========================================
export const backgroundStyleTemplates: BannerTemplate[] = [
  // Solid
  {
    id: "bg-solid-color",
    name: "Solid Color",
    description: "Single color background",
    promptFragment: "with a solid uniform color background providing clean visual space",
  },
  {
    id: "bg-split-color",
    name: "Split Color",
    description: "Two-color split background",
    promptFragment: "with a split two-tone background dividing the composition",
  },
  {
    id: "bg-color-block",
    name: "Color Block",
    description: "Multiple color blocks",
    promptFragment: "with a color block background featuring geometric color sections",
  },
  // Gradient
  {
    id: "bg-smooth-gradient",
    name: "Smooth Gradient",
    description: "Gentle color transition",
    promptFragment: "with a smooth gradient background transitioning subtly between colors",
  },
  {
    id: "bg-vivid-gradient",
    name: "Vivid Gradient",
    description: "Bold color gradient",
    promptFragment: "with a vivid bold gradient creating dynamic color transitions",
  },
  {
    id: "bg-pastel-gradient",
    name: "Pastel Gradient",
    description: "Soft pastel gradient",
    promptFragment: "with a soft pastel gradient providing gentle color harmony",
  },
  {
    id: "bg-dark-gradient",
    name: "Dark Gradient",
    description: "Deep dark gradient",
    promptFragment: "with a deep dark gradient creating moody atmospheric depth",
  },
  {
    id: "bg-radial-gradient",
    name: "Radial Gradient",
    description: "Circular color gradient",
    promptFragment: "with a radial gradient emanating from a central focal point",
  },
  {
    id: "bg-mesh-gradient",
    name: "Mesh Gradient",
    description: "Complex multi-point gradient",
    promptFragment: "with a complex mesh gradient blending multiple color points organically",
  },
  // Pattern
  {
    id: "bg-geometric-pattern",
    name: "Geometric Pattern",
    description: "Shapes and geometric forms",
    promptFragment: "with a geometric pattern background featuring mathematical shapes",
  },
  {
    id: "bg-organic-pattern",
    name: "Organic Pattern",
    description: "Nature-inspired patterns",
    promptFragment: "with an organic flowing pattern inspired by natural forms",
  },
  {
    id: "bg-abstract-pattern",
    name: "Abstract Pattern",
    description: "Non-representational patterns",
    promptFragment: "with an abstract artistic pattern adding creative visual interest",
  },
  {
    id: "bg-polka-dots",
    name: "Polka Dots",
    description: "Classic dot pattern",
    promptFragment: "with a playful polka dot pattern adding rhythmic visual texture",
  },
  {
    id: "bg-stripes",
    name: "Stripes",
    description: "Linear stripe pattern",
    promptFragment: "with a striped linear pattern creating directional movement",
  },
  {
    id: "bg-chevron",
    name: "Chevron",
    description: "Zigzag chevron pattern",
    promptFragment: "with a dynamic chevron zigzag pattern adding energy",
  },
  {
    id: "bg-grid",
    name: "Grid Pattern",
    description: "Regular grid lines",
    promptFragment: "with a structured grid pattern providing organized visual framework",
  },
  // Photo
  {
    id: "bg-blurred-photo",
    name: "Blurred Photo",
    description: "Soft blurred image background",
    promptFragment: "with a soft blurred photo background creating bokeh depth",
  },
  {
    id: "bg-tinted-photo",
    name: "Tinted Photo",
    description: "Color-tinted photograph",
    promptFragment: "with a color-tinted photo background for unified mood",
  },
  {
    id: "bg-overlay-photo",
    name: "Overlay Photo",
    description: "Photo with color overlay",
    promptFragment: "with a photo background enhanced by a color gradient overlay",
  },
  {
    id: "bg-split-photo",
    name: "Split with Photo",
    description: "Half photo, half solid",
    promptFragment: "with a split composition combining photo and solid color areas",
  },
  // Abstract
  {
    id: "bg-abstract-shapes",
    name: "Abstract Shapes",
    description: "Floating abstract forms",
    promptFragment: "with floating abstract shapes adding artistic visual elements",
  },
  {
    id: "bg-fluid-shapes",
    name: "Fluid Shapes",
    description: "Organic flowing forms",
    promptFragment: "with organic fluid shapes creating flowing movement",
  },
  {
    id: "bg-geometric-shapes",
    name: "Geometric Shapes",
    description: "Angular geometric forms",
    promptFragment: "with angular geometric shapes providing structured visual interest",
  },
  {
    id: "bg-line-art",
    name: "Line Art",
    description: "Artistic line drawings",
    promptFragment: "with artistic line work adding subtle hand-drawn character",
  },
  {
    id: "bg-wave",
    name: "Wave Pattern",
    description: "Flowing wave design",
    promptFragment: "with flowing wave patterns creating undulating movement",
  },
  // Textured
  {
    id: "bg-concrete",
    name: "Concrete Texture",
    description: "Urban concrete surface",
    promptFragment: "with a concrete texture background adding urban industrial character",
  },
  {
    id: "bg-marble",
    name: "Marble Texture",
    description: "Luxurious marble pattern",
    promptFragment: "with a luxurious marble texture conveying premium elegance",
  },
  {
    id: "bg-paper",
    name: "Paper Texture",
    description: "Subtle paper texture",
    promptFragment: "with a subtle paper texture adding organic tactile quality",
  },
  {
    id: "bg-canvas",
    name: "Canvas Texture",
    description: "Artistic canvas feel",
    promptFragment: "with an artistic canvas texture creating painterly depth",
  },
  {
    id: "bg-digital-noise",
    name: "Digital Noise",
    description: "Subtle digital grain",
    promptFragment: "with subtle digital noise adding textured film grain effect",
  },
  // Themed
  {
    id: "bg-nature",
    name: "Nature Scene",
    description: "Natural environment background",
    promptFragment: "with a natural outdoor scene providing environmental context",
  },
  {
    id: "bg-urban",
    name: "Urban Scene",
    description: "City environment background",
    promptFragment: "with an urban cityscape adding metropolitan backdrop context",
  },
  {
    id: "bg-technology",
    name: "Technology",
    description: "Tech-themed background",
    promptFragment: "with a technology-themed background conveying digital innovation",
  },
  {
    id: "bg-space",
    name: "Space",
    description: "Cosmic space background",
    promptFragment: "with a cosmic space background featuring stars and galaxy elements",
  },
  {
    id: "bg-bokeh",
    name: "Bokeh Lights",
    description: "Blurred light circles",
    promptFragment: "with dreamy bokeh light circles creating atmospheric depth",
  },
  // NEW: Additional background styles
  {
    id: "bg-topographic",
    name: "Topographic",
    description: "Map-style contour lines",
    promptFragment: "with topographic contour line patterns adding technical aesthetic",
  },
  {
    id: "bg-isometric-grid",
    name: "Isometric Grid",
    description: "3D isometric grid",
    promptFragment: "with an isometric 3D grid creating dimensional perspective",
  },
  {
    id: "bg-halftone",
    name: "Halftone",
    description: "Comic print dot pattern",
    promptFragment: "with a halftone dot pattern adding retro print character",
  },
  {
    id: "bg-watercolor",
    name: "Watercolor",
    description: "Watercolor texture",
    promptFragment: "with watercolor wash textures creating artistic fluidity",
  },
  {
    id: "bg-terrazzo",
    name: "Terrazzo",
    description: "Modern terrazzo pattern",
    promptFragment: "with a modern terrazzo speckled pattern adding contemporary style",
  },
  {
    id: "bg-brush-strokes",
    name: "Brush Strokes",
    description: "Brush stroke texture",
    promptFragment: "with visible brush stroke textures adding artistic expression",
  },
  {
    id: "bg-pixel-art",
    name: "Pixel Art",
    description: "Retro pixel background",
    promptFragment: "with retro pixel art elements creating nostalgic 8-bit aesthetic",
  },
  {
    id: "bg-circuit-board",
    name: "Circuit Board",
    description: "Electronic circuit pattern",
    promptFragment: "with circuit board patterns conveying technology and connectivity",
  },
  {
    id: "bg-neon-lights",
    name: "Neon City Lights",
    description: "Urban neon lights",
    promptFragment: "with neon city lights creating vibrant urban nightlife atmosphere",
  },
  {
    id: "bg-liquid-metal",
    name: "Liquid Metal",
    description: "Chrome/liquid metal",
    promptFragment: "with liquid metal chrome effects adding futuristic fluidity",
  },
  {
    id: "bg-smoke-fog",
    name: "Smoke/Fog",
    description: "Smoke or fog effect",
    promptFragment: "with ethereal smoke and fog creating mysterious atmosphere",
  },
  {
    id: "bg-aurora",
    name: "Aurora Borealis",
    description: "Aurora style gradient",
    promptFragment: "with aurora borealis northern lights creating cosmic glow effects",
  },
];

// ==========================================
// 9. VISUAL EFFECTS (~45 presets)
// ==========================================
export const visualEffectsTemplates: BannerTemplate[] = [
  // Shadows
  {
    id: "effect-drop-shadow",
    name: "Drop Shadow",
    description: "Classic shadow below elements",
    promptFragment: "enhanced by classic drop shadows adding depth beneath elements",
  },
  {
    id: "effect-long-shadow",
    name: "Long Shadow",
    description: "Extended flat shadow",
    promptFragment: "enhanced by extended long shadows in material design style",
  },
  {
    id: "effect-soft-shadow",
    name: "Soft Shadow",
    description: "Diffused gentle shadow",
    promptFragment: "enhanced by soft diffused shadows creating subtle depth",
  },
  {
    id: "effect-hard-shadow",
    name: "Hard Shadow",
    description: "Sharp defined shadow",
    promptFragment: "enhanced by sharp hard shadows for high contrast depth",
  },
  {
    id: "effect-inner-shadow",
    name: "Inner Shadow",
    description: "Shadow inside elements",
    promptFragment: "enhanced by inner shadows creating pressed inset appearance",
  },
  {
    id: "effect-glow-shadow",
    name: "Glow Shadow",
    description: "Colored glowing shadow",
    promptFragment: "enhanced by glowing colored shadows with neon luminosity",
  },
  // Gradients
  {
    id: "effect-gradient-overlay",
    name: "Gradient Overlay",
    description: "Color gradient over image",
    promptFragment: "enhanced by a gradient overlay adding color transitions",
  },
  {
    id: "effect-duotone-filter",
    name: "Duotone Filter",
    description: "Two-color filter effect",
    promptFragment: "enhanced by a duotone filter mapping imagery to two colors",
  },
  // Textures
  {
    id: "effect-paper-texture",
    name: "Paper Texture",
    description: "Subtle paper grain overlay",
    promptFragment: "enhanced by subtle paper grain texture adding tactile quality",
  },
  {
    id: "effect-grain",
    name: "Film Grain",
    description: "Photographic grain effect",
    promptFragment: "enhanced by film grain adding photographic vintage texture",
  },
  {
    id: "effect-noise",
    name: "Digital Noise",
    description: "Subtle noise texture",
    promptFragment: "enhanced by subtle digital noise adding textured depth",
  },
  {
    id: "effect-fabric",
    name: "Fabric Texture",
    description: "Cloth-like texture",
    promptFragment: "enhanced by fabric texture overlay adding woven character",
  },
  {
    id: "effect-metal",
    name: "Metallic",
    description: "Shiny metal finish",
    promptFragment: "enhanced by metallic finish with shiny reflective surfaces",
  },
  {
    id: "effect-wood",
    name: "Wood Texture",
    description: "Natural wood grain",
    promptFragment: "enhanced by natural wood grain texture adding organic warmth",
  },
  // Overlays
  {
    id: "effect-color-overlay",
    name: "Color Overlay",
    description: "Solid color tint",
    promptFragment: "enhanced by a color overlay tint unifying the composition",
  },
  {
    id: "effect-pattern-overlay",
    name: "Pattern Overlay",
    description: "Repeating pattern layer",
    promptFragment: "enhanced by a subtle pattern overlay adding visual rhythm",
  },
  {
    id: "effect-light-leak",
    name: "Light Leak",
    description: "Vintage light leak effect",
    promptFragment: "enhanced by vintage light leak effects with warm film burns",
  },
  {
    id: "effect-bokeh-overlay",
    name: "Bokeh Overlay",
    description: "Blurred light circles",
    promptFragment: "enhanced by dreamy bokeh light circles adding atmospheric depth",
  },
  {
    id: "effect-vignette",
    name: "Vignette",
    description: "Dark edge effect",
    promptFragment: "enhanced by a vignette darkening edges to focus attention",
  },
  // 3D Effects
  {
    id: "effect-3d-text",
    name: "3D Text",
    description: "Three-dimensional text",
    promptFragment: "enhanced by three-dimensional text with extruded depth",
  },
  {
    id: "effect-isometric",
    name: "Isometric",
    description: "Isometric 3D style",
    promptFragment: "enhanced by isometric 2.5D perspective adding dimension",
  },
  {
    id: "effect-floating",
    name: "Floating Elements",
    description: "Levitating objects",
    promptFragment: "enhanced by floating levitating elements suspended in space",
  },
  {
    id: "effect-depth-layers",
    name: "Depth Layers",
    description: "Multiple depth planes",
    promptFragment: "enhanced by multiple depth layers creating parallax effect",
  },
  // Motion Feel
  {
    id: "effect-dynamic-lines",
    name: "Dynamic Lines",
    description: "Speed line effects",
    promptFragment: "enhanced by dynamic speed lines conveying motion energy",
  },
  {
    id: "effect-speed-blur",
    name: "Speed Blur",
    description: "Motion blur effect",
    promptFragment: "enhanced by speed blur suggesting fast dynamic movement",
  },
  {
    id: "effect-particles",
    name: "Particle Effects",
    description: "Floating particles",
    promptFragment: "enhanced by floating particle effects scattered throughout",
  },
  {
    id: "effect-wave",
    name: "Wave Effects",
    description: "Flowing wave motion",
    promptFragment: "enhanced by flowing wave effects creating undulating movement",
  },
  // Special
  {
    id: "effect-glitch",
    name: "Glitch Effect",
    description: "Digital glitch aesthetic",
    promptFragment: "enhanced by digital glitch effects with RGB split distortion",
  },
  {
    id: "effect-neon-glow",
    name: "Neon Glow",
    description: "Bright neon luminosity",
    promptFragment: "enhanced by bright neon glow effects with fluorescent luminosity",
  },
  {
    id: "effect-holographic",
    name: "Holographic",
    description: "Iridescent rainbow effect",
    promptFragment: "enhanced by holographic iridescent effects with color-shifting surfaces",
  },
  // Advanced Effects (NEW)
  {
    id: "effect-chromatic-aberration",
    name: "Chromatic Aberration",
    description: "RGB split effect",
    promptFragment: "enhanced by chromatic aberration with prismatic RGB splitting",
  },
  {
    id: "effect-double-exposure",
    name: "Double Exposure",
    description: "Overlapping images blend",
    promptFragment: "enhanced by double exposure blending overlapping imagery",
  },
  {
    id: "effect-reflection",
    name: "Mirror Reflection",
    description: "Mirrored surface effect",
    promptFragment: "enhanced by mirror reflection effects on polished surfaces",
  },
  {
    id: "effect-scanlines",
    name: "Scanlines",
    description: "Retro CRT monitor lines",
    promptFragment: "enhanced by retro CRT scanlines adding vintage screen texture",
  },
  {
    id: "effect-halftone-dots",
    name: "Halftone Dots",
    description: "Print screen dot pattern",
    promptFragment: "enhanced by halftone dot patterns in comic print style",
  },
  {
    id: "effect-frosted-glass",
    name: "Frosted Glass",
    description: "Matte blur surface",
    promptFragment: "enhanced by frosted glass blur creating translucent panels",
  },
  {
    id: "effect-smoke",
    name: "Smoke Effect",
    description: "Artistic smoke trails",
    promptFragment: "enhanced by artistic smoke trails adding atmospheric mystique",
  },
  {
    id: "effect-liquid",
    name: "Liquid Effect",
    description: "Fluid morphing shapes",
    promptFragment: "enhanced by liquid fluid effects with morphing flowing forms",
  },
  {
    id: "effect-prism",
    name: "Prism/Rainbow",
    description: "Light spectrum refraction",
    promptFragment: "enhanced by prism rainbow effects refracting light spectrum",
  },
  {
    id: "effect-emboss",
    name: "Embossed",
    description: "Raised relief texture",
    promptFragment: "enhanced by embossed relief texture creating pressed depth",
  },
  {
    id: "effect-pixelate",
    name: "Pixelate",
    description: "Artistic blocky mosaic",
    promptFragment: "enhanced by artistic pixelation creating blocky mosaic effect",
  },
  {
    id: "effect-distortion",
    name: "Distortion",
    description: "Warped visual perspective",
    promptFragment: "enhanced by visual distortion warping perspective creatively",
  },
  // Glow Effects
  {
    id: "effect-glow",
    name: "Glow",
    description: "Bright luminous glow effect",
    promptFragment: "enhanced by bright luminous glow effects with radiant illumination",
  },
  {
    id: "effect-subtle-glow",
    name: "Subtle Glow",
    description: "Soft, delicate glow effect",
    promptFragment: "enhanced by subtle soft glow adding delicate luminous accents",
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
    promptFragment: "incorporating outlined line-based icons with clean stroke style",
  },
  {
    id: "icon-filled",
    name: "Filled Icons",
    description: "Solid filled icons",
    promptFragment: "incorporating solid filled icons with complete graphic shapes",
  },
  {
    id: "icon-3d",
    name: "3D Icons",
    description: "Three-dimensional icons",
    promptFragment: "incorporating three-dimensional icons with depth and perspective",
  },
  {
    id: "icon-hand-drawn",
    name: "Hand-Drawn Icons",
    description: "Sketch-style icons",
    promptFragment: "incorporating hand-drawn sketch-style icons with organic character",
  },
  {
    id: "icon-gradient",
    name: "Gradient Icons",
    description: "Icons with color gradients",
    promptFragment: "incorporating gradient-filled icons with colorful transitions",
  },
  {
    id: "icon-duotone",
    name: "Duotone Icons",
    description: "Two-tone icons",
    promptFragment: "incorporating duotone two-tone icons with layered depth",
  },
  // Elements
  {
    id: "element-badges",
    name: "Badges",
    description: "Recognition badges",
    promptFragment: "incorporating badge elements for recognition and achievement display",
  },
  {
    id: "element-ribbons",
    name: "Ribbons",
    description: "Decorative ribbons",
    promptFragment: "incorporating decorative ribbon elements with flowing banner style",
  },
  {
    id: "element-stickers",
    name: "Stickers",
    description: "Fun sticker elements",
    promptFragment: "incorporating playful sticker elements with fun graphic appeal",
  },
  {
    id: "element-stamps",
    name: "Stamps",
    description: "Stamp-like marks",
    promptFragment: "incorporating authentic stamp elements with seal-like appearance",
  },
  {
    id: "element-seals",
    name: "Quality Seals",
    description: "Trust and quality seals",
    promptFragment: "incorporating quality seal elements conveying trust and certification",
  },
  {
    id: "element-stars",
    name: "Stars",
    description: "Star elements",
    promptFragment: "incorporating star elements for rating and sparkling accents",
  },
  {
    id: "element-arrows",
    name: "Arrows",
    description: "Directional arrows",
    promptFragment: "incorporating directional arrow elements guiding viewer attention",
  },
  // Decorative
  {
    id: "decor-confetti",
    name: "Confetti",
    description: "Celebration confetti",
    promptFragment: "incorporating festive confetti particles for celebration atmosphere",
  },
  {
    id: "decor-sparkles",
    name: "Sparkles",
    description: "Shining sparkle effects",
    promptFragment: "incorporating shining sparkle elements adding glitter accents",
  },
  {
    id: "decor-light-rays",
    name: "Light Rays",
    description: "Radiating light beams",
    promptFragment: "incorporating radiating light rays with sunburst beam effects",
  },
  {
    id: "decor-geometric",
    name: "Geometric Shapes",
    description: "Decorative shapes",
    promptFragment: "incorporating decorative geometric shapes as abstract accents",
  },
  {
    id: "decor-borders",
    name: "Decorative Borders",
    description: "Frame borders",
    promptFragment: "incorporating decorative border elements framing the composition",
  },
  {
    id: "decor-dividers",
    name: "Section Dividers",
    description: "Decorative dividers",
    promptFragment: "incorporating ornamental divider elements separating sections",
  },
  {
    id: "decor-corner",
    name: "Corner Accents",
    description: "Corner decorations",
    promptFragment: "incorporating decorative corner accent elements enhancing the frame",
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
    promptFragment: "highlighting a percentage-off discount badge prominently displayed",
  },
  {
    id: "promo-price-slash",
    name: "Price Slash",
    description: "Crossed-out original price",
    promptFragment: "highlighting price slash with crossed-out original showing savings",
  },
  {
    id: "promo-compare-prices",
    name: "Compare Prices",
    description: "Price comparison display",
    promptFragment: "highlighting price comparison showing before and after value",
  },
  {
    id: "promo-bundle-savings",
    name: "Bundle Savings",
    description: "Package deal indicator",
    promptFragment: "highlighting bundle savings displaying package deal value",
  },
  {
    id: "promo-flash-tag",
    name: "Flash Sale Tag",
    description: "Limited time indicator",
    promptFragment: "highlighting flash sale urgency with limited-time deal tag",
  },
  // Trust
  {
    id: "trust-money-back",
    name: "Money Back Guarantee",
    description: "Satisfaction guarantee badge",
    promptFragment: "highlighting money-back guarantee badge building customer trust",
  },
  {
    id: "trust-free-shipping",
    name: "Free Shipping Badge",
    description: "Free shipping indicator",
    promptFragment: "highlighting free shipping badge emphasizing delivery benefit",
  },
  {
    id: "trust-star-rating",
    name: "Star Rating",
    description: "Customer review stars",
    promptFragment: "highlighting star rating display showing customer satisfaction",
  },
  {
    id: "trust-testimonial",
    name: "Testimonial Quote",
    description: "Customer quote display",
    promptFragment: "highlighting testimonial quote providing social proof",
  },
  {
    id: "trust-secure",
    name: "Secure Badge",
    description: "Security trust indicator",
    promptFragment: "highlighting secure badge conveying safety and protection",
  },
  // Urgency
  {
    id: "urgency-countdown",
    name: "Countdown Timer Style",
    description: "Time-limited offer display",
    promptFragment: "highlighting countdown timer creating time-sensitive urgency",
  },
  {
    id: "urgency-limited-stock",
    name: "Limited Stock",
    description: "Low inventory warning",
    promptFragment: "highlighting limited stock warning creating scarcity urgency",
  },
  {
    id: "urgency-only-left",
    name: "Only X Left",
    description: "Remaining quantity display",
    promptFragment: "highlighting remaining quantity counter emphasizing scarcity",
  },
  {
    id: "urgency-today-only",
    name: "Today Only",
    description: "One-day offer tag",
    promptFragment: "highlighting today-only deal tag creating single-day urgency",
  },
  {
    id: "urgency-ends-soon",
    name: "Ends Soon",
    description: "Expiring offer indicator",
    promptFragment: "highlighting ends-soon indicator showing deadline urgency",
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
    promptFragment: "arranged in a center-aligned layout with balanced symmetrical composition",
  },
  {
    id: "layout-stacked-center",
    name: "Stacked Center",
    description: "Vertical stack centered",
    promptFragment: "arranged in a vertically stacked centered layout from top to bottom",
  },
  {
    id: "layout-hero-center",
    name: "Hero Center",
    description: "Hero image with center text",
    promptFragment: "arranged in a hero-centered layout with prominent middle focal point",
  },
  // Left/Right
  {
    id: "layout-left-aligned",
    name: "Left Aligned",
    description: "Content aligned left",
    promptFragment: "arranged in a left-aligned layout with content starting from the left edge",
  },
  {
    id: "layout-right-aligned",
    name: "Right Aligned",
    description: "Content aligned right",
    promptFragment: "arranged in a right-aligned layout with content anchored to the right edge",
  },
  {
    id: "layout-split-50-50",
    name: "50/50 Split",
    description: "Equal two-column split",
    promptFragment: "arranged in a balanced 50/50 split layout with equal halves",
  },
  {
    id: "layout-split-60-40",
    name: "60/40 Split",
    description: "Unequal two-column split",
    promptFragment: "arranged in a weighted 60/40 split layout with larger left section",
  },
  {
    id: "layout-split-70-30",
    name: "70/30 Split",
    description: "Dominant content split",
    promptFragment: "arranged in a dominant 70/30 split layout with primary content emphasis",
  },
  // Grid
  {
    id: "layout-2-column",
    name: "2-Column Grid",
    description: "Two column layout",
    promptFragment: "arranged in a two-column grid layout with dual content areas",
  },
  {
    id: "layout-3-column",
    name: "3-Column Grid",
    description: "Three column layout",
    promptFragment: "arranged in a three-column grid layout with triple content sections",
  },
  {
    id: "layout-masonry",
    name: "Masonry Grid",
    description: "Pinterest-style staggered",
    promptFragment: "arranged in a masonry grid layout with staggered varied-height blocks",
  },
  {
    id: "layout-modular",
    name: "Modular Grid",
    description: "Flexible module grid",
    promptFragment: "arranged in a modular grid layout with flexible block-based composition",
  },
  // Asymmetric
  {
    id: "layout-diagonal-split",
    name: "Diagonal Split",
    description: "Angled division",
    promptFragment: "arranged in a diagonal split layout with dynamic angled division",
  },
  {
    id: "layout-angular",
    name: "Angular Layout",
    description: "Sharp angles and cuts",
    promptFragment: "arranged in an angular layout with sharp geometric divisions",
  },
  {
    id: "layout-organic-flow",
    name: "Organic Flow",
    description: "Natural flowing layout",
    promptFragment: "arranged in an organic flowing layout with natural curves",
  },
  {
    id: "layout-broken-grid",
    name: "Broken Grid",
    description: "Overlapping elements",
    promptFragment: "arranged in a broken grid layout with overlapping unconventional placement",
  },
  // Minimal
  {
    id: "layout-text-only",
    name: "Text Only",
    description: "Typography focused",
    promptFragment: "arranged in a text-only typography-focused layout design",
  },
  {
    id: "layout-icon-text",
    name: "Icon + Text",
    description: "Simple icon with text",
    promptFragment: "arranged in a minimal icon-and-text layout pairing",
  },
  {
    id: "layout-single-focus",
    name: "Single Element Focus",
    description: "One main focal point",
    promptFragment: "arranged in a single-focus layout with one prominent focal element",
  },
  // Complex
  {
    id: "layout-multi-section",
    name: "Multi-Section",
    description: "Multiple distinct areas",
    promptFragment: "arranged in a multi-section layout with distinct segmented areas",
  },
  {
    id: "layout-layered",
    name: "Layered",
    description: "Stacked layers of content",
    promptFragment: "arranged in a layered layout with stacked depth composition",
  },
  {
    id: "layout-collage",
    name: "Collage Style",
    description: "Mixed media collage",
    promptFragment: "arranged in a collage-style layout with assembled mixed elements",
  },
  {
    id: "layout-z-pattern",
    name: "Z-Pattern",
    description: "Z-shaped eye flow",
    promptFragment: "arranged in a Z-pattern layout guiding diagonal eye flow",
  },
  {
    id: "layout-f-pattern",
    name: "F-Pattern",
    description: "F-shaped reading pattern",
    promptFragment: "arranged in an F-pattern layout optimized for natural reading",
  },
  {
    id: "layout-golden-ratio",
    name: "Golden Ratio",
    description: "Fibonacci-based proportions",
    promptFragment: "arranged in a golden ratio layout with harmonious Fibonacci proportions",
  },
];

// ==========================================
// 12.5. TEXT LANGUAGE (2 presets)
// ==========================================
export const textLanguageTemplates: BannerTemplate[] = [
  {
    id: "lang-english",
    name: "English",
    description: "All auto-generated text in English",
    promptFragment:
      "all text on the banner must be written in English language, use English words and phrases only",
  },
  {
    id: "lang-romanian",
    name: "Romanian",
    description: "All auto-generated text in Romanian",
    promptFragment:
      "all text on the banner must be written in Romanian language (limba română), use Romanian words and phrases only",
  },
];

// ==========================================
// 13. TEXT PLACEMENT (~15 presets)
// ==========================================
export const textPlacementTemplates: BannerTemplate[] = [
  // No Text Option
  {
    id: "text-none",
    name: "No Text",
    description: "Banner without any text elements",
    promptFragment:
      "with no text on the banner, purely visual design without any text elements, text-free banner",
  },
  // Position
  {
    id: "text-top-left",
    name: "Top Left",
    description: "Text in top left corner",
    promptFragment: "with text positioned in the top left corner for easy reading",
  },
  {
    id: "text-top-center",
    name: "Top Center",
    description: "Text centered at top",
    promptFragment: "with text centered at the top of the composition",
  },
  {
    id: "text-top-right",
    name: "Top Right",
    description: "Text in top right corner",
    promptFragment: "with text positioned in the top right corner",
  },
  {
    id: "text-center",
    name: "Center",
    description: "Text perfectly centered",
    promptFragment: "with text perfectly centered in the composition for maximum impact",
  },
  {
    id: "text-bottom-left",
    name: "Bottom Left",
    description: "Text in bottom left",
    promptFragment: "with text positioned in the bottom left area",
  },
  {
    id: "text-bottom-center",
    name: "Bottom Center",
    description: "Text centered at bottom",
    promptFragment: "with text centered at the bottom as a footer element",
  },
  {
    id: "text-bottom-right",
    name: "Bottom Right",
    description: "Text in bottom right",
    promptFragment: "with text positioned in the bottom right corner",
  },
  {
    id: "text-overlay-image",
    name: "Overlay on Image",
    description: "Text overlaid on imagery",
    promptFragment: "with text overlaid directly on the imagery for integrated design",
  },
  // Alignment
  {
    id: "text-left-aligned",
    name: "Left Aligned Text",
    description: "Text aligned to left",
    promptFragment: "with left-aligned text following standard reading patterns",
  },
  {
    id: "text-center-aligned",
    name: "Center Aligned Text",
    description: "Text centered horizontally",
    promptFragment: "with center-aligned text for balanced symmetrical typography",
  },
  {
    id: "text-right-aligned",
    name: "Right Aligned Text",
    description: "Text aligned to right",
    promptFragment: "with right-aligned text anchored to the right edge",
  },
  // Special
  {
    id: "text-on-path",
    name: "Text on Path",
    description: "Text following a curved path",
    promptFragment: "with text following a curved path for dynamic typography",
  },
  {
    id: "text-curved",
    name: "Curved Text",
    description: "Arched or curved text",
    promptFragment: "with curved arched text creating visual interest",
  },
  {
    id: "text-diagonal",
    name: "Diagonal Text",
    description: "Angled text placement",
    promptFragment: "with diagonally angled text adding dynamic movement",
  },
  {
    id: "text-vertical",
    name: "Vertical Text",
    description: "Text reading vertically",
    promptFragment: "with vertical text rotated for sidebar or accent placement",
  },
];

// ==========================================
// 14. TYPOGRAPHY STYLE (~25 presets)
// ==========================================
export const typographyStyleTemplates: BannerTemplate[] = [
  // Popular Fonts
  {
    id: "typo-inter",
    name: "Inter",
    description: "Inter font - modern and readable",
    promptFragment: "styled in Inter font with modern readable geometric sans-serif typography",
  },
  {
    id: "typo-roboto",
    name: "Roboto",
    description: "Roboto font - Google's signature font",
    promptFragment: "styled in Roboto font with friendly mechanical Material Design typography",
  },
  // Sans-Serif
  {
    id: "typo-modern-sans",
    name: "Modern Sans",
    description: "Clean modern sans-serif",
    promptFragment: "styled in clean modern sans-serif typography with contemporary appeal",
  },
  {
    id: "typo-geometric-sans",
    name: "Geometric Sans",
    description: "Geometric sans-serif forms",
    promptFragment: "styled in geometric sans-serif typography with mathematical precision",
  },
  {
    id: "typo-humanist-sans",
    name: "Humanist Sans",
    description: "Friendly humanist sans",
    promptFragment: "styled in humanist sans-serif typography with friendly approachable character",
  },
  {
    id: "typo-industrial",
    name: "Industrial Sans",
    description: "Bold industrial style",
    promptFragment: "styled in bold industrial typography with heavy mechanical impact",
  },
  {
    id: "typo-grotesque",
    name: "Grotesque",
    description: "Classic grotesque sans",
    promptFragment: "styled in classic grotesque sans typography with neutral timeless character",
  },
  // Serif
  {
    id: "typo-classic-serif",
    name: "Classic Serif",
    description: "Traditional serif fonts",
    promptFragment: "styled in classic serif typography with traditional timeless elegance",
  },
  {
    id: "typo-modern-serif",
    name: "Modern Serif",
    description: "Contemporary serif style",
    promptFragment: "styled in modern serif typography with contemporary refined character",
  },
  {
    id: "typo-slab-serif",
    name: "Slab Serif",
    description: "Bold slab serif fonts",
    promptFragment: "styled in bold slab serif typography with strong blocky presence",
  },
  {
    id: "typo-editorial",
    name: "Editorial",
    description: "Magazine editorial style",
    promptFragment: "styled in editorial typography with magazine publication aesthetic",
  },
  {
    id: "typo-didone",
    name: "Didone",
    description: "High contrast serif",
    promptFragment: "styled in high-contrast Didone typography with elegant sophistication",
  },
  // Display
  {
    id: "typo-bold-display",
    name: "Bold Display",
    description: "Heavy impactful display",
    promptFragment: "styled in bold display typography with heavy powerful impact",
  },
  {
    id: "typo-condensed",
    name: "Condensed",
    description: "Narrow condensed fonts",
    promptFragment: "styled in condensed narrow typography with compressed efficiency",
  },
  {
    id: "typo-extended",
    name: "Extended",
    description: "Wide extended fonts",
    promptFragment: "styled in extended wide typography with stretched proportions",
  },
  {
    id: "typo-decorative",
    name: "Decorative",
    description: "Ornate decorative fonts",
    promptFragment: "styled in decorative ornate typography with embellished character",
  },
  {
    id: "typo-outlined",
    name: "Outlined",
    description: "Outline-only text",
    promptFragment: "styled in outlined stroke-only typography with hollow letterforms",
  },
  // Script
  {
    id: "typo-elegant-script",
    name: "Elegant Script",
    description: "Formal script fonts",
    promptFragment: "styled in elegant formal script typography with refined cursive character",
  },
  {
    id: "typo-handwriting",
    name: "Casual Handwriting",
    description: "Informal handwritten style",
    promptFragment: "styled in casual handwriting typography with personal informal touch",
  },
  {
    id: "typo-brush-script",
    name: "Brush Script",
    description: "Brush-painted lettering",
    promptFragment: "styled in artistic brush script typography with painted character",
  },
  {
    id: "typo-signature",
    name: "Signature Style",
    description: "Signature-like scripts",
    promptFragment: "styled in signature-style typography with autograph personal mark",
  },
  // Special
  {
    id: "typo-monospace",
    name: "Monospace",
    description: "Fixed-width fonts",
    promptFragment: "styled in monospace fixed-width typography with technical precision",
  },
  {
    id: "typo-stencil",
    name: "Stencil",
    description: "Cut-out stencil style",
    promptFragment: "styled in stencil cut-out typography with bold military character",
  },
  {
    id: "typo-retro",
    name: "Retro Type",
    description: "Vintage typography",
    promptFragment: "styled in retro vintage typography with nostalgic throwback appeal",
  },
  {
    id: "typo-futuristic",
    name: "Futuristic Type",
    description: "Sci-fi inspired fonts",
    promptFragment: "styled in futuristic sci-fi typography with advanced technological character",
  },
  // Combinations
  {
    id: "typo-serif-sans-combo",
    name: "Serif + Sans Combo",
    description: "Mix of serif and sans",
    promptFragment: "styled in a serif and sans-serif combination with contrasting type pairing",
  },
  {
    id: "typo-script-sans-combo",
    name: "Script + Sans Combo",
    description: "Script with sans-serif",
    promptFragment: "styled in a script and sans-serif combination with elegant casual pairing",
  },
];

// ==========================================
// 15. CTA BUTTON STYLE (~20 presets)
// ==========================================
export const ctaButtonStyleTemplates: BannerTemplate[] = [
  // No CTA Option
  {
    id: "cta-none",
    name: "No CTA Button",
    description: "Banner without a call-to-action button",
    promptFragment:
      "featuring no CTA button on the banner, purely visual design without clickable button elements",
  },
  // Shape
  {
    id: "cta-rounded",
    name: "Rounded",
    description: "Soft rounded corners",
    promptFragment: "featuring a rounded CTA button with soft friendly corners",
  },
  {
    id: "cta-pill",
    name: "Pill Shape",
    description: "Fully rounded pill button",
    promptFragment: "featuring a pill-shaped CTA button with fully rounded capsule form",
  },
  {
    id: "cta-square",
    name: "Square",
    description: "Sharp square corners",
    promptFragment: "featuring a square CTA button with sharp angular corners",
  },
  {
    id: "cta-capsule",
    name: "Capsule",
    description: "Elongated rounded button",
    promptFragment: "featuring a capsule-shaped elongated CTA button",
  },
  {
    id: "cta-custom-shape",
    name: "Custom Shape",
    description: "Unique custom button shape",
    promptFragment: "featuring a uniquely shaped custom CTA button design",
  },
  // Style
  {
    id: "cta-solid",
    name: "Solid Fill",
    description: "Solid color fill button",
    promptFragment: "featuring a solid-fill CTA button with complete color",
  },
  {
    id: "cta-outline",
    name: "Outline",
    description: "Border-only button",
    promptFragment: "featuring an outline ghost CTA button with border-only style",
  },
  {
    id: "cta-gradient",
    name: "Gradient Fill",
    description: "Gradient color button",
    promptFragment: "featuring a gradient-filled CTA button with dynamic color transition",
  },
  {
    id: "cta-glass",
    name: "Glass Effect",
    description: "Transparent glass button",
    promptFragment: "featuring a frosted glass effect CTA button with transparency",
  },
  {
    id: "cta-shadow",
    name: "Shadow Style",
    description: "Button with shadow depth",
    promptFragment: "featuring an elevated CTA button with shadow depth",
  },
  {
    id: "cta-3d",
    name: "3D Button",
    description: "Three-dimensional button",
    promptFragment: "featuring a three-dimensional raised CTA button",
  },
  // Effect
  {
    id: "cta-glow",
    name: "Glow Effect",
    description: "Glowing neon button",
    promptFragment: "featuring a glowing neon CTA button with luminous effect",
  },
  {
    id: "cta-pulse",
    name: "Pulse Effect",
    description: "Animated pulse indicator",
    promptFragment: "featuring a pulsing CTA button suggesting animated attention",
  },
  {
    id: "cta-shine",
    name: "Shine Effect",
    description: "Shiny metallic button",
    promptFragment: "featuring a shiny metallic CTA button with reflective gloss",
  },
  {
    id: "cta-hover-lift",
    name: "Hover Lift",
    description: "Elevated on hover",
    promptFragment: "featuring an elevated CTA button with lift effect",
  },
  // Size
  {
    id: "cta-small",
    name: "Small Button",
    description: "Compact button size",
    promptFragment: "featuring a compact small CTA button",
  },
  {
    id: "cta-medium",
    name: "Medium Button",
    description: "Standard button size",
    promptFragment: "featuring a standard medium-sized CTA button",
  },
  {
    id: "cta-large",
    name: "Large Button",
    description: "Prominent large button",
    promptFragment: "featuring a prominent large CTA button for maximum impact",
  },
  {
    id: "cta-full-width",
    name: "Full Width",
    description: "Spanning full width",
    promptFragment: "featuring a full-width CTA button spanning the container",
  },
  // Position (contextual)
  {
    id: "cta-floating",
    name: "Floating Button",
    description: "Floating action button",
    promptFragment: "featuring a floating elevated CTA button hovering above content",
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
  {
    id: "quick-luxury-brand",
    name: "Luxury Brand",
    description: "Elegant design for premium brands and high-end products",
    config: {
      bannerType: "banner-type-brand-awareness",
      designStyle: "design-art-deco",
      colorScheme: "color-gold-black",
      mood: "mood-sophisticated",
      layoutStyle: "layout-center-aligned",
      typographyStyle: "typo-elegant-script",
      ctaButtonStyle: "cta-outline",
    },
  },
  {
    id: "quick-gaming-promo",
    name: "Gaming Promo",
    description: "High-energy design for gaming and esports",
    config: {
      bannerType: "banner-type-event",
      industry: "industry-gaming",
      designStyle: "design-cyberpunk",
      colorScheme: "color-neon",
      mood: "mood-exciting",
      backgroundStyle: "bg-technology",
      typographyStyle: "typo-futuristic",
      ctaButtonStyle: "cta-glow",
      visualEffects: "effect-glitch",
    },
  },
  {
    id: "quick-wellness-spa",
    name: "Wellness & Spa",
    description: "Calm and peaceful for wellness businesses",
    config: {
      bannerType: "banner-type-service-highlight",
      industry: "industry-salon-spa",
      designStyle: "design-natural",
      colorScheme: "color-mint-green",
      mood: "mood-peaceful",
      backgroundStyle: "bg-organic-pattern",
      typographyStyle: "typo-modern-serif",
      ctaButtonStyle: "cta-rounded",
    },
  },
  {
    id: "quick-black-friday",
    name: "Black Friday",
    description: "High-impact design for Black Friday sales",
    config: {
      bannerType: "banner-type-flash-sale",
      seasonal: "event-black-friday",
      designStyle: "design-high-contrast",
      colorScheme: "color-bold-red",
      mood: "mood-urgent",
      layoutStyle: "layout-diagonal-split",
      promotionalElements: "promo-percent-off",
      typographyStyle: "typo-bold-display",
      ctaButtonStyle: "cta-solid",
      iconGraphics: "decor-sparkles",
    },
  },
  {
    id: "quick-podcast-cover",
    name: "Podcast Launch",
    description: "Modern cover art for podcast episodes",
    config: {
      bannerType: "banner-type-brand-awareness",
      bannerSize: "size-facebook-square-1080x1080",
      designStyle: "design-gradient",
      colorScheme: "color-royal-purple",
      mood: "mood-professional",
      layoutStyle: "layout-stacked-center",
      typographyStyle: "typo-bold-display",
    },
  },
  {
    id: "quick-fitness-challenge",
    name: "Fitness Challenge",
    description: "Energetic design for fitness promotions",
    config: {
      bannerType: "banner-type-event",
      industry: "industry-fitness",
      designStyle: "design-vibrant",
      colorScheme: "color-sunset-orange",
      mood: "mood-energetic",
      layoutStyle: "layout-angular",
      backgroundStyle: "bg-vivid-gradient",
      typographyStyle: "typo-industrial",
      ctaButtonStyle: "cta-solid",
      visualEffects: "effect-dynamic-lines",
    },
  },
  {
    id: "quick-eco-friendly",
    name: "Eco Friendly",
    description: "Sustainable and natural brand messaging",
    config: {
      bannerType: "banner-type-brand-awareness",
      industry: "industry-environmental",
      designStyle: "design-eco-friendly",
      colorScheme: "color-forest-green",
      mood: "mood-trustworthy",
      backgroundStyle: "bg-nature",
      typographyStyle: "typo-humanist-sans",
      ctaButtonStyle: "cta-rounded",
      iconGraphics: "element-badges",
    },
  },
  {
    id: "quick-wedding-elegant",
    name: "Wedding Elegant",
    description: "Romantic design for wedding services",
    config: {
      bannerType: "banner-type-event",
      designStyle: "design-minimalist",
      colorScheme: "color-rose-gold",
      mood: "mood-luxurious",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-smooth-gradient",
      typographyStyle: "typo-elegant-script",
      ctaButtonStyle: "cta-outline",
      iconGraphics: "decor-sparkles",
    },
  },
  {
    id: "quick-crypto-launch",
    name: "Crypto Launch",
    description: "Futuristic design for crypto and blockchain",
    config: {
      bannerType: "banner-type-product-launch",
      industry: "industry-crypto",
      designStyle: "design-holographic",
      colorScheme: "color-electric-blue",
      mood: "mood-exciting",
      backgroundStyle: "bg-mesh-gradient",
      typographyStyle: "typo-futuristic",
      ctaButtonStyle: "cta-gradient",
      visualEffects: "effect-holographic",
    },
  },
  {
    id: "quick-food-delivery",
    name: "Food Delivery",
    description: "Appetizing design for food delivery services",
    config: {
      bannerType: "banner-type-discount-offer",
      industry: "industry-food-beverage",
      designStyle: "design-vibrant",
      colorScheme: "color-sunset-orange",
      mood: "mood-friendly",
      layoutStyle: "layout-split-60-40",
      typographyStyle: "typo-modern-sans",
      ctaButtonStyle: "cta-rounded",
      promotionalElements: "trust-free-shipping",
    },
  },
  // ==========================================
  // INDUSTRY-SPECIFIC TEMPLATES
  // ==========================================
  {
    id: "quick-healthcare-clinic",
    name: "Healthcare Clinic",
    description: "Professional design for medical clinics and healthcare",
    config: {
      bannerType: "banner-type-service-highlight",
      industry: "industry-healthcare",
      designStyle: "design-clean",
      colorScheme: "color-ocean-blue",
      mood: "mood-trustworthy",
      layoutStyle: "layout-split-60-40",
      typographyStyle: "typo-humanist-sans",
      ctaButtonStyle: "cta-rounded",
    },
  },
  {
    id: "quick-real-estate",
    name: "Real Estate Listing",
    description: "Property listings and real estate promotions",
    config: {
      bannerType: "banner-type-featured-product",
      industry: "industry-real-estate",
      designStyle: "design-corporate",
      colorScheme: "color-gold-black",
      mood: "mood-luxurious",
      layoutStyle: "layout-split-50-50",
      backgroundStyle: "bg-blurred-photo",
      typographyStyle: "typo-modern-serif",
      ctaButtonStyle: "cta-solid",
    },
  },
  {
    id: "quick-education-course",
    name: "Education Course",
    description: "Online courses and e-learning platforms",
    config: {
      bannerType: "banner-type-lead-gen",
      industry: "industry-education",
      designStyle: "design-flat",
      colorScheme: "color-royal-purple",
      mood: "mood-inspiring",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-smooth-gradient",
      typographyStyle: "typo-geometric-sans",
      ctaButtonStyle: "cta-gradient",
    },
  },
  {
    id: "quick-finance-banking",
    name: "Finance & Banking",
    description: "Financial services and banking promotions",
    config: {
      bannerType: "banner-type-brand-awareness",
      industry: "industry-finance",
      designStyle: "design-business",
      colorScheme: "color-silver-navy",
      mood: "mood-professional",
      layoutStyle: "layout-left-aligned",
      typographyStyle: "typo-modern-sans",
      ctaButtonStyle: "cta-solid",
      iconGraphics: "element-seals",
    },
  },
  {
    id: "quick-travel-vacation",
    name: "Travel & Vacation",
    description: "Travel packages and vacation promotions",
    config: {
      bannerType: "banner-type-discount-offer",
      industry: "industry-travel",
      designStyle: "design-vibrant",
      colorScheme: "color-tropical",
      mood: "mood-adventurous",
      layoutStyle: "layout-hero-center",
      backgroundStyle: "bg-blurred-photo",
      typographyStyle: "typo-bold-display",
      ctaButtonStyle: "cta-pill",
    },
  },
  {
    id: "quick-automotive-dealer",
    name: "Automotive Dealer",
    description: "Car dealerships and automotive services",
    config: {
      bannerType: "banner-type-new-arrival",
      industry: "industry-automotive",
      designStyle: "design-high-contrast",
      colorScheme: "color-black-white",
      mood: "mood-exciting",
      layoutStyle: "layout-diagonal-split",
      typographyStyle: "typo-industrial",
      ctaButtonStyle: "cta-solid",
    },
  },
  {
    id: "quick-beauty-cosmetics",
    name: "Beauty & Cosmetics",
    description: "Skincare and beauty product promotions",
    config: {
      bannerType: "banner-type-product-showcase",
      industry: "industry-beauty",
      designStyle: "design-minimalist",
      colorScheme: "color-dusty-rose",
      mood: "mood-sophisticated",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-pastel-gradient",
      typographyStyle: "typo-elegant-script",
      ctaButtonStyle: "cta-outline",
    },
  },
  {
    id: "quick-legal-services",
    name: "Legal Services",
    description: "Law firms and legal consultation",
    config: {
      bannerType: "banner-type-company-intro",
      industry: "industry-legal",
      designStyle: "design-formal",
      colorScheme: "color-silver-navy",
      mood: "mood-authoritative",
      layoutStyle: "layout-left-aligned",
      typographyStyle: "typo-classic-serif",
      ctaButtonStyle: "cta-square",
    },
  },
  {
    id: "quick-music-event",
    name: "Music Event",
    description: "Concerts and music festivals",
    config: {
      bannerType: "banner-type-event",
      industry: "industry-music",
      designStyle: "design-neon",
      colorScheme: "color-neon",
      mood: "mood-exciting",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-neon-lights",
      typographyStyle: "typo-bold-display",
      ctaButtonStyle: "cta-glow",
      visualEffects: "effect-particles",
    },
  },
  {
    id: "quick-pet-services",
    name: "Pet Services",
    description: "Pet shops and veterinary services",
    config: {
      bannerType: "banner-type-service-highlight",
      industry: "industry-pet",
      designStyle: "design-flat",
      colorScheme: "color-sunny-yellow",
      mood: "mood-playful",
      layoutStyle: "layout-split-60-40",
      typographyStyle: "typo-humanist-sans",
      ctaButtonStyle: "cta-rounded",
      iconGraphics: "icon-hand-drawn",
    },
  },
  {
    id: "quick-photography-studio",
    name: "Photography Studio",
    description: "Professional photography services",
    config: {
      bannerType: "banner-type-portfolio",
      industry: "industry-photography",
      designStyle: "design-minimalist",
      colorScheme: "color-black-white",
      mood: "mood-sophisticated",
      layoutStyle: "layout-masonry",
      backgroundStyle: "bg-split-photo",
      typographyStyle: "typo-condensed",
      ctaButtonStyle: "cta-outline",
    },
  },
  {
    id: "quick-charity-donation",
    name: "Charity & Donation",
    description: "Non-profit and charitable campaigns",
    config: {
      bannerType: "banner-type-lead-gen",
      industry: "industry-charity",
      designStyle: "design-natural",
      colorScheme: "color-forest-green",
      mood: "mood-empowering",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-nature",
      typographyStyle: "typo-humanist-sans",
      ctaButtonStyle: "cta-solid",
      iconGraphics: "element-badges",
    },
  },
  // ==========================================
  // SEASONAL/HOLIDAY TEMPLATES
  // ==========================================
  {
    id: "quick-valentines-day",
    name: "Valentine's Day",
    description: "Romantic Valentine's Day promotions",
    config: {
      bannerType: "banner-type-holiday-sale",
      seasonal: "holiday-valentines",
      designStyle: "design-gradient",
      colorScheme: "color-coral-pink",
      mood: "mood-playful",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-smooth-gradient",
      typographyStyle: "typo-elegant-script",
      ctaButtonStyle: "cta-rounded",
      iconGraphics: "decor-sparkles",
    },
  },
  {
    id: "quick-halloween",
    name: "Halloween",
    description: "Spooky Halloween campaigns",
    config: {
      bannerType: "banner-type-event",
      seasonal: "holiday-halloween",
      designStyle: "design-high-contrast",
      colorScheme: "color-sunset-orange",
      mood: "mood-mysterious",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-dark-gradient",
      typographyStyle: "typo-decorative",
      ctaButtonStyle: "cta-glow",
      visualEffects: "effect-smoke",
    },
  },
  {
    id: "quick-cyber-monday",
    name: "Cyber Monday",
    description: "Cyber Monday digital deals",
    config: {
      bannerType: "banner-type-flash-sale",
      seasonal: "event-cyber-monday",
      designStyle: "design-digital",
      colorScheme: "color-electric-blue",
      mood: "mood-urgent",
      layoutStyle: "layout-diagonal-split",
      backgroundStyle: "bg-technology",
      typographyStyle: "typo-futuristic",
      ctaButtonStyle: "cta-glow",
      promotionalElements: "promo-percent-off",
      visualEffects: "effect-glitch",
    },
  },
  {
    id: "quick-mothers-day",
    name: "Mother's Day",
    description: "Mother's Day gift promotions",
    config: {
      bannerType: "banner-type-holiday-sale",
      seasonal: "special-mothers-day",
      designStyle: "design-natural",
      colorScheme: "color-lavender",
      mood: "mood-peaceful",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-watercolor",
      typographyStyle: "typo-elegant-script",
      ctaButtonStyle: "cta-rounded",
      iconGraphics: "decor-sparkles",
    },
  },
  {
    id: "quick-new-year",
    name: "New Year Celebration",
    description: "New Year's Eve and celebrations",
    config: {
      bannerType: "banner-type-event",
      seasonal: "holiday-new-year",
      designStyle: "design-vibrant",
      colorScheme: "color-gold-black",
      mood: "mood-joyful",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-bokeh",
      typographyStyle: "typo-bold-display",
      ctaButtonStyle: "cta-shine",
      iconGraphics: "decor-confetti",
      visualEffects: "effect-particles",
    },
  },
  {
    id: "quick-summer-sale",
    name: "Summer Sale",
    description: "Hot summer deals and discounts",
    config: {
      bannerType: "banner-type-seasonal",
      seasonal: "special-summer-sale",
      designStyle: "design-vibrant",
      colorScheme: "color-summer-brights",
      mood: "mood-energetic",
      layoutStyle: "layout-angular",
      backgroundStyle: "bg-vivid-gradient",
      typographyStyle: "typo-bold-display",
      ctaButtonStyle: "cta-solid",
      promotionalElements: "promo-percent-off",
    },
  },
  {
    id: "quick-chinese-new-year",
    name: "Chinese New Year",
    description: "Lunar New Year celebrations",
    config: {
      bannerType: "banner-type-holiday-sale",
      seasonal: "holiday-chinese-new-year",
      designStyle: "design-vibrant",
      colorScheme: "color-bold-red",
      mood: "mood-joyful",
      layoutStyle: "layout-center-aligned",
      typographyStyle: "typo-bold-display",
      ctaButtonStyle: "cta-solid",
      iconGraphics: "decor-sparkles",
    },
  },
  {
    id: "quick-back-to-school",
    name: "Back to School",
    description: "Back to school promotions",
    config: {
      bannerType: "banner-type-seasonal",
      seasonal: "special-back-school",
      industry: "industry-education",
      designStyle: "design-flat",
      colorScheme: "color-sunny-yellow",
      mood: "mood-friendly",
      layoutStyle: "layout-split-60-40",
      typographyStyle: "typo-geometric-sans",
      ctaButtonStyle: "cta-rounded",
      promotionalElements: "promo-percent-off",
    },
  },
  // ==========================================
  // DESIGN STYLE FOCUSED TEMPLATES
  // ==========================================
  {
    id: "quick-retro-80s",
    name: "Retro 80s",
    description: "Nostalgic 80s synthwave aesthetic",
    config: {
      bannerType: "banner-type-event",
      designStyle: "design-retrowave",
      colorScheme: "color-neon",
      mood: "mood-nostalgic",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-neon-lights",
      typographyStyle: "typo-retro",
      ctaButtonStyle: "cta-glow",
      visualEffects: "effect-scanlines",
    },
  },
  {
    id: "quick-glassmorphism",
    name: "Glassmorphism Style",
    description: "Modern frosted glass UI aesthetic",
    config: {
      bannerType: "banner-type-product-launch",
      designStyle: "design-glassmorphism",
      colorScheme: "color-lavender",
      mood: "mood-premium",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-vivid-gradient",
      typographyStyle: "typo-modern-sans",
      ctaButtonStyle: "cta-glass",
      visualEffects: "effect-frosted-glass",
    },
  },
  {
    id: "quick-memphis-playful",
    name: "Memphis Playful",
    description: "Colorful 80s Memphis design",
    config: {
      bannerType: "banner-type-event",
      designStyle: "design-memphis",
      colorScheme: "color-candy",
      mood: "mood-playful",
      layoutStyle: "layout-broken-grid",
      backgroundStyle: "bg-geometric-pattern",
      typographyStyle: "typo-geometric-sans",
      ctaButtonStyle: "cta-pill",
      iconGraphics: "decor-geometric",
    },
  },
  {
    id: "quick-mid-century",
    name: "Mid-Century Modern",
    description: "1950s-60s retro modern style",
    config: {
      bannerType: "banner-type-brand-awareness",
      designStyle: "design-mid-century",
      colorScheme: "color-terracotta",
      mood: "mood-nostalgic",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-geometric-shapes",
      typographyStyle: "typo-retro",
      ctaButtonStyle: "cta-rounded",
    },
  },
  {
    id: "quick-vaporwave-aesthetic",
    name: "Vaporwave Aesthetic",
    description: "Retro nostalgic vaporwave style",
    config: {
      bannerType: "banner-type-social-ad",
      designStyle: "design-vaporwave",
      colorScheme: "color-cotton-candy",
      mood: "mood-nostalgic",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-smooth-gradient",
      typographyStyle: "typo-retro",
      ctaButtonStyle: "cta-outline",
      visualEffects: "effect-scanlines",
    },
  },
  // ==========================================
  // SPECIAL PURPOSE TEMPLATES
  // ==========================================
  {
    id: "quick-webinar-event",
    name: "Webinar Event",
    description: "Online webinar and virtual event promotion",
    config: {
      bannerType: "banner-type-webinar",
      designStyle: "design-clean",
      colorScheme: "color-electric-blue",
      mood: "mood-professional",
      layoutStyle: "layout-split-60-40",
      backgroundStyle: "bg-smooth-gradient",
      typographyStyle: "typo-modern-sans",
      ctaButtonStyle: "cta-solid",
      iconGraphics: "icon-outlined",
    },
  },
  {
    id: "quick-free-trial",
    name: "Free Trial Offer",
    description: "Free trial and demo promotions",
    config: {
      bannerType: "banner-type-free-trial",
      industry: "industry-saas",
      designStyle: "design-flat",
      colorScheme: "color-mint-green",
      mood: "mood-friendly",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-smooth-gradient",
      typographyStyle: "typo-geometric-sans",
      ctaButtonStyle: "cta-gradient",
      promotionalElements: "trust-money-back",
    },
  },
  {
    id: "quick-newsletter-signup",
    name: "Newsletter Signup",
    description: "Email subscription and newsletter promotion",
    config: {
      bannerType: "banner-type-newsletter",
      designStyle: "design-minimalist",
      colorScheme: "color-royal-purple",
      mood: "mood-inspiring",
      layoutStyle: "layout-center-aligned",
      typographyStyle: "typo-modern-sans",
      ctaButtonStyle: "cta-solid",
      iconGraphics: "icon-outlined",
    },
  },
  {
    id: "quick-testimonials",
    name: "Testimonials",
    description: "Customer reviews and social proof",
    config: {
      bannerType: "banner-type-testimonials",
      designStyle: "design-clean",
      colorScheme: "color-warm-neutrals",
      mood: "mood-trustworthy",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-paper",
      typographyStyle: "typo-modern-serif",
      ctaButtonStyle: "cta-outline",
      promotionalElements: "trust-star-rating",
    },
  },
  {
    id: "quick-coming-soon",
    name: "Coming Soon",
    description: "Pre-launch teaser and anticipation builder",
    config: {
      bannerType: "banner-type-coming-soon",
      designStyle: "design-high-contrast",
      colorScheme: "color-midnight",
      mood: "mood-mysterious",
      layoutStyle: "layout-center-aligned",
      backgroundStyle: "bg-dark-gradient",
      typographyStyle: "typo-condensed",
      ctaButtonStyle: "cta-outline",
      visualEffects: "effect-particles",
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
  textLanguage: textLanguageTemplates,
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
 * Check if a banner size is a platform bundle
 */
export function isPlatformBundle(sizeId: string): boolean {
  const template = getBannerSizeById(sizeId);
  return template?.isPlatformBundle === true;
}

/**
 * Get all individual size templates for a platform bundle
 * Returns the actual size templates (not the bundle template)
 */
export function getPlatformBundleSizes(bundleSizeId: string): BannerSizeTemplate[] {
  const bundleTemplate = getBannerSizeById(bundleSizeId);
  if (!bundleTemplate?.isPlatformBundle || !bundleTemplate.bundleSizeIds) {
    return [];
  }

  return bundleTemplate.bundleSizeIds
    .map((sizeId) => getBannerSizeById(sizeId))
    .filter((template): template is BannerSizeTemplate => template !== undefined);
}

/**
 * Get all platform bundle templates
 */
export function getAllPlatformBundles(): BannerSizeTemplate[] {
  return bannerSizeTemplates.filter((t) => t.isPlatformBundle === true);
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
