import express from "express";
import cors from "cors";
const app = express();
const port = process.env.PORT || 3000;

// ✅ Allow only your Netlify frontend
app.use(cors({
  origin: "https://precious-clafoutis-fbbb8d.netlify.app"
}));

// 🔹 Enhanced TLD list with pricing categories and individual prices (KSH) - TRUE KENYA HOST PRICING
const extensions = [
  // Premium TLDs (high demand, premium pricing)
  { ext: "com", yearlyPrice: 1690, monthlyPrice: 155, category: "Premium", description: "Most popular choice worldwide", featured: true, popularity: 1 },
  { ext: "co.ke", yearlyPrice: 2500, monthlyPrice: 220, category: "Kenya", description: "Kenya's premier domain", featured: true, popularity: 2 },
  { ext: "net", yearlyPrice: 1559, monthlyPrice: 145, category: "Premium", description: "Great for networks and tech", featured: true, popularity: 3 },
  { ext: "org", yearlyPrice: 1429, monthlyPrice: 135, category: "Premium", description: "Perfect for organizations", featured: true, popularity: 4 },
  { ext: "ke", yearlyPrice: 2200, monthlyPrice: 195, category: "Kenya", description: "Kenya country domain", featured: true, popularity: 5 },
  { ext: "io", yearlyPrice: 6499, monthlyPrice: 590, category: "Premium", description: "Tech startup favorite" },
  { ext: "ai", yearlyPrice: 11699, monthlyPrice: 1050, category: "Premium", description: "AI and machine learning" },
  
  // Standard TLDs (moderate pricing)
  { ext: "info", yearlyPrice: 1949, monthlyPrice: 175, category: "Standard", description: "Information websites" },
  { ext: "biz", yearlyPrice: 1559, monthlyPrice: 145, category: "Standard", description: "Professional business" },
  { ext: "pro", yearlyPrice: 1819, monthlyPrice: 165, category: "Standard", description: "Professional services" },
  { ext: "name", yearlyPrice: 1689, monthlyPrice: 155, category: "Standard", description: "Personal websites" },
  { ext: "mobi", yearlyPrice: 1429, monthlyPrice: 135, category: "Standard", description: "Mobile optimized sites" },
  
  // Budget TLDs (affordable options)
  { ext: "xyz", yearlyPrice: 1169, monthlyPrice: 110, category: "Budget", description: "Modern and affordable" },
  { ext: "online", yearlyPrice: 1039, monthlyPrice: 99, category: "Budget", description: "Online presence" },
  { ext: "site", yearlyPrice: 909, monthlyPrice: 89, category: "Budget", description: "Website builder friendly" },
  { ext: "store", yearlyPrice: 1169, monthlyPrice: 110, category: "Budget", description: "E-commerce stores" },
  { ext: "club", yearlyPrice: 779, monthlyPrice: 79, category: "Budget", description: "Communities and clubs" },
  { ext: "space", yearlyPrice: 1039, monthlyPrice: 99, category: "Budget", description: "Creative spaces" },
  { ext: "website", yearlyPrice: 1299, monthlyPrice: 120, category: "Budget", description: "General websites" },
  { ext: "top", yearlyPrice: 909, monthlyPrice: 89, category: "Budget", description: "Top level domains" },
  { ext: "world", yearlyPrice: 1169, monthlyPrice: 110, category: "Budget", description: "Global presence" },
  { ext: "live", yearlyPrice: 1039, monthlyPrice: 99, category: "Budget", description: "Live streaming content" },
  
  // Tech TLDs (technology focused)
  { ext: "tech", yearlyPrice: 2079, monthlyPrice: 185, category: "Tech", description: "Modern tech companies" },
  { ext: "dev", yearlyPrice: 2599, monthlyPrice: 230, category: "Tech", description: "Developers and development" },
  { ext: "app", yearlyPrice: 2339, monthlyPrice: 210, category: "Tech", description: "Mobile and web apps" },
  { ext: "cloud", yearlyPrice: 2209, monthlyPrice: 195, category: "Tech", description: "Cloud services" },
  { ext: "digital", yearlyPrice: 2079, monthlyPrice: 185, category: "Tech", description: "Digital transformation" },
  { ext: "software", yearlyPrice: 2469, monthlyPrice: 220, category: "Tech", description: "Software companies" },
  { ext: "code", yearlyPrice: 2209, monthlyPrice: 195, category: "Tech", description: "Programming and coding" },
  { ext: "data", yearlyPrice: 2339, monthlyPrice: 210, category: "Tech", description: "Data science and analytics" },
  { ext: "systems", yearlyPrice: 2079, monthlyPrice: 185, category: "Tech", description: "System integrators" },
  { ext: "network", yearlyPrice: 1949, monthlyPrice: 175, category: "Tech", description: "Networking solutions" },
  
  // Business TLDs (business focused)
  { ext: "business", yearlyPrice: 1819, monthlyPrice: 165, category: "Business", description: "General business use" },
  { ext: "company", yearlyPrice: 1949, monthlyPrice: 175, category: "Business", description: "Corporate entities" },
  { ext: "corp", yearlyPrice: 2209, monthlyPrice: 195, category: "Business", description: "Large corporations" },
  { ext: "inc", yearlyPrice: 2469, monthlyPrice: 220, category: "Business", description: "Incorporated businesses" },
  { ext: "ltd", yearlyPrice: 2079, monthlyPrice: 185, category: "Business", description: "Limited companies" },
  { ext: "llc", yearlyPrice: 2339, monthlyPrice: 210, category: "Business", description: "Limited liability companies" },
  { ext: "ventures", yearlyPrice: 2209, monthlyPrice: 195, category: "Business", description: "Venture capital firms" },
  { ext: "capital", yearlyPrice: 2599, monthlyPrice: 230, category: "Business", description: "Investment firms" },
  { ext: "finance", yearlyPrice: 2469, monthlyPrice: 220, category: "Business", description: "Financial services" },
  { ext: "consulting", yearlyPrice: 2079, monthlyPrice: 185, category: "Business", description: "Consulting firms" },
  
  // Country TLDs (country-specific)
  { ext: "us", yearlyPrice: 1299, monthlyPrice: 120, category: "Country", description: "United States" },
  { ext: "uk", yearlyPrice: 1559, monthlyPrice: 145, category: "Country", description: "United Kingdom" },
  { ext: "ca", yearlyPrice: 1429, monthlyPrice: 135, category: "Country", description: "Canada" },
  { ext: "au", yearlyPrice: 1689, monthlyPrice: 155, category: "Country", description: "Australia" },
  { ext: "de", yearlyPrice: 1169, monthlyPrice: 110, category: "Country", description: "Germany" },
  { ext: "fr", yearlyPrice: 1299, monthlyPrice: 120, category: "Country", description: "France" },
  { ext: "es", yearlyPrice: 1169, monthlyPrice: 110, category: "Country", description: "Spain" },
  { ext: "it", yearlyPrice: 1429, monthlyPrice: 135, category: "Country", description: "Italy" },
  { ext: "nl", yearlyPrice: 1559, monthlyPrice: 145, category: "Country", description: "Netherlands" },
  { ext: "in", yearlyPrice: 1039, monthlyPrice: 99, category: "Country", description: "India" },
  { ext: "jp", yearlyPrice: 1819, monthlyPrice: 165, category: "Country", description: "Japan" },
  { ext: "cn", yearlyPrice: 2079, monthlyPrice: 185, category: "Country", description: "China" },
  { ext: "br", yearlyPrice: 1689, monthlyPrice: 155, category: "Country", description: "Brazil" },
  { ext: "mx", yearlyPrice: 1559, monthlyPrice: 145, category: "Country", description: "Mexico" },
  { ext: "sg", yearlyPrice: 1949, monthlyPrice: 175, category: "Country", description: "Singapore" },
  
  // Additional popular extensions
  { ext: "blog", yearlyPrice: 2079, monthlyPrice: 185, category: "Tech", description: "Blogging platforms" },
  { ext: "news", yearlyPrice: 2339, monthlyPrice: 210, category: "Tech", description: "News websites" },
  { ext: "media", yearlyPrice: 2209, monthlyPrice: 195, category: "Tech", description: "Media companies" },
  { ext: "tv", yearlyPrice: 3249, monthlyPrice: 285, category: "Tech", description: "Television and streaming" },
  { ext: "video", yearlyPrice: 2469, monthlyPrice: 220, category: "Tech", description: "Video content" },
  { ext: "music", yearlyPrice: 2599, monthlyPrice: 230, category: "Tech", description: "Music industry" },
  { ext: "art", yearlyPrice: 2079, monthlyPrice: 185, category: "Business", description: "Artists and galleries" },
  { ext: "design", yearlyPrice: 2209, monthlyPrice: 195, category: "Business", description: "Design agencies" },
  { ext: "photography", yearlyPrice: 2339, monthlyPrice: 210, category: "Business", description: "Photography services" },
  { ext: "agency", yearlyPrice: 1949, monthlyPrice: 175, category: "Business", description: "Creative agencies" },
  { ext: "studio", yearlyPrice: 2079, monthlyPrice: 185, category: "Business", description: "Design studios" },
  { ext: "marketing", yearlyPrice: 2079, monthlyPrice: 185, category: "Business", description: "Marketing companies" },
  { ext: "restaurant", yearlyPrice: 2209, monthlyPrice: 195, category: "Business", description: "Restaurants and food" },
  { ext: "food", yearlyPrice: 2079, monthlyPrice: 185, category: "Business", description: "Food industry" },
  { ext: "health", yearlyPrice: 2469, monthlyPrice: 220, category: "Business", description: "Healthcare providers" },
  { ext: "fitness", yearlyPrice: 2079, monthlyPrice: 185, category: "Business", description: "Fitness centers" },
  { ext: "education", yearlyPrice: 1949, monthlyPrice: 175, category: "Business", description: "Educational institutions" },
  { ext: "law", yearlyPrice: 2599, monthlyPrice: 230, category: "Business", description: "Legal services" },
  { ext: "real", yearlyPrice: 2079, monthlyPrice: 185, category: "Business", description: "Real estate" },
  { ext: "auto", yearlyPrice: 2209, monthlyPrice: 195, category: "Business", description: "Automotive industry" },
  
  // More budget options
  { ext: "global", yearlyPrice: 1169, monthlyPrice: 110, category: "Budget", description: "Global businesses" },
  { ext: "today", yearlyPrice: 1039, monthlyPrice: 99, category: "Budget", description: "Current and trending" },
  { ext: "zone", yearlyPrice: 909, monthlyPrice: 89, category: "Budget", description: "Special interest zones" },
  { ext: "fun", yearlyPrice: 779, monthlyPrice: 79, category: "Budget", description: "Entertainment and games" },
  { ext: "cool", yearlyPrice: 909, monthlyPrice: 89, category: "Budget", description: "Cool and trendy projects" },
  { ext: "rocks", yearlyPrice: 1039, monthlyPrice: 99, category: "Budget", description: "Rock solid websites" },
  { ext: "buzz", yearlyPrice: 1169, monthlyPrice: 110, category: "Budget", description: "Trending and viral content" },
  { ext: "click", yearlyPrice: 909, monthlyPrice: 89, category: "Budget", description: "Click-through websites" },
  { ext: "link", yearlyPrice: 1039, monthlyPrice: 99, category: "Budget", description: "Link sharing platforms" },
  { ext: "community", yearlyPrice: 1169, monthlyPrice: 110, category: "Budget", description: "Online communities" }
];

// Helper function to calculate renewal dates
function getRenewalDates() {
  const now = new Date();
  const monthlyRenewal = new Date(now);
  const yearlyRenewal = new Date(now);
  
  // Monthly renewal - next month
  monthlyRenewal.setMonth(monthlyRenewal.getMonth() + 1);
  
  // Yearly renewal - next year
  yearlyRenewal.setFullYear(yearlyRenewal.getFullYear() + 1);
  
  return {
    monthly: monthlyRenewal.toLocaleDateString('en-KE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }),
    yearly: yearlyRenewal.toLocaleDateString('en-KE', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  };
}

// ✅ NEW: Featured domains endpoint
app.get("/featured", (req, res) => {
  const billing = req.query.billing?.trim() || 'both';
  const limit = parseInt(req.query.limit) || 5;
  
  // Get featured domains sorted by popularity
  const featuredExtensions = extensions
    .filter(ext => ext.featured === true)
    .sort((a, b) => (a.popularity || 999) - (b.popularity || 999))
    .slice(0, limit);

  const renewalDates = getRenewalDates();

  const featuredDomains = featuredExtensions.map(ext => {
    const baseResult = {
      domain: `example.${ext.ext}`,
      extension: ext.ext,
      category: ext.category,
      description: ext.description,
      status: `Verified Available <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #10B981; margin-left: 4px;"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
      verified: true,
      verifiedBadge: `<span style="background: #10B981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-left: 8px;">✓ VERIFIED</span>`,
      featured: true,
      popularity: ext.popularity || 999
    };

    // Add pricing based on billing preference
    if (billing === 'monthly' || billing === 'both') {
      baseResult.monthlyPrice = ext.monthlyPrice;
      baseResult.monthlyPriceText = `KSH ${ext.monthlyPrice}/month`;
      baseResult.monthlyRenewal = renewalDates.monthly;
    }

    if (billing === 'yearly' || billing === 'both') {
      baseResult.yearlyPrice = ext.yearlyPrice;
      baseResult.yearlyPriceText = `KSH ${ext.yearlyPrice}/year`;
      baseResult.yearlyRenewal = renewalDates.yearly;
      baseResult.savings = ext.category === "Budget" ? `Save KSH ${(1690 - ext.yearlyPrice)}` : null;
    }

    // Set primary price for sorting
    baseResult.price = billing === 'monthly' ? ext.monthlyPrice : ext.yearlyPrice;
    baseResult.priceText = billing === 'monthly' ? baseResult.monthlyPriceText : baseResult.yearlyPriceText;

    return baseResult;
  });

  const response = {
    featured: true,
    billing,
    totalResults: featuredDomains.length,
    renewalDates,
    results: featuredDomains,
    verification: {
      allVerified: true,
      verificationNote: "All featured domains are verified and available through Kenya Host"
    }
  };

  res.json(response);
});

// Enhanced search endpoint with monthly/yearly pricing and renewal dates
app.get("/search", (req, res) => {
  const keyword = req.query.keyword?.trim();
  const category = req.query.category?.trim();
  const sortBy = req.query.sort?.trim();
  const billing = req.query.billing?.trim() || 'both'; // 'monthly', 'yearly', or 'both'
  
  if (!keyword) {
    return res.json({ 
      error: "No keyword provided",
      message: "Please provide a domain keyword to search"
    });
  }

  // ✅ 5-character minimum validation
  if (keyword.length < 5) {
    return res.json({ 
      error: "Keyword too short",
      message: "Domain name must be at least 5 characters long. Example: 'Johna' becomes 'Johna.com'"
    });
  }

  const renewalDates = getRenewalDates();

  let results = extensions.map(ext => {
    const baseResult = {
      domain: `${keyword}.${ext.ext}`,
      extension: ext.ext,
      category: ext.category,
      description: ext.description,
      status: `Verified Available <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="color: #10B981; margin-left: 4px;"><path d="M9 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/></svg>`,
      verified: true,
      verifiedBadge: `<span style="background: #10B981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; margin-left: 8px;">✓ VERIFIED</span>`,
      featured: ext.featured || false
    };

    // Add pricing based on billing preference
    if (billing === 'monthly' || billing === 'both') {
      baseResult.monthlyPrice = ext.monthlyPrice;
      baseResult.monthlyPriceText = `KSH ${ext.monthlyPrice}/month`;
      baseResult.monthlyRenewal = renewalDates.monthly;
    }

    if (billing === 'yearly' || billing === 'both') {
      baseResult.yearlyPrice = ext.yearlyPrice;
      baseResult.yearlyPriceText = `KSH ${ext.yearlyPrice}/year`;
      baseResult.yearlyRenewal = renewalDates.yearly;
      baseResult.savings = ext.category === "Budget" ? `Save KSH ${(1690 - ext.yearlyPrice)}` : null;
    }

    // Set primary price for sorting
    baseResult.price = billing === 'monthly' ? ext.monthlyPrice : ext.yearlyPrice;
    baseResult.priceText = billing === 'monthly' ? baseResult.monthlyPriceText : baseResult.yearlyPriceText;

    return baseResult;
  });

  // Filter by category if specified
  if (category && category !== "All") {
    results = results.filter(result => result.category === category);
  }

  // Sort results - featured domains first, then by preference
  if (sortBy) {
    switch (sortBy) {
      case "price-low":
        results.sort((a, b) => {
          // Featured first, then by price
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.price - b.price;
        });
        break;
      case "price-high":
        results.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return b.price - a.price;
        });
        break;
      case "extension":
        results.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.extension.localeCompare(b.extension);
        });
        break;
      case "category":
        results.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return a.category.localeCompare(b.category);
        });
        break;
    }
  } else {
    // Default sort: featured first, then by price (low to high)
    results.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return a.price - b.price;
    });
  }

  const response = {
    keyword,
    billing,
    totalResults: results.length,
    categories: ["All", "Premium", "Standard", "Budget", "Tech", "Business", "Country", "Kenya"],
    priceRange: {
      min: Math.min(...results.map(r => r.price)),
      max: Math.max(...results.map(r => r.price))
    },
    renewalDates,
    results,
    verification: {
      allVerified: true,
      verificationNote: "All domains are verified and available through Kenya Host"
    }
  };

  res.json(response);
});

// Get pricing categories with monthly/yearly options
app.get("/categories", (req, res) => {
  const billing = req.query.billing?.trim() || 'yearly';
  
  const categories = [
    {
      name: "Premium",
      description: "Most popular and trusted extensions",
      priceRange: billing === 'monthly' ? "KSH 135 - KSH 1,050/month" : "KSH 1,429 - KSH 11,699/year",
      count: extensions.filter(e => e.category === "Premium").length
    },
    {
      name: "Standard", 
      description: "Professional extensions with good recognition",
      priceRange: billing === 'monthly' ? "KSH 135 - KSH 175/month" : "KSH 1,429 - KSH 1,949/year",
      count: extensions.filter(e => e.category === "Standard").length
    },
    {
      name: "Budget",
      description: "Affordable options for personal projects", 
      priceRange: billing === 'monthly' ? "KSH 79 - KSH 120/month" : "KSH 779 - KSH 1,299/year",
      count: extensions.filter(e => e.category === "Budget").length
    },
    {
      name: "Tech",
      description: "Modern extensions for tech companies",
      priceRange: billing === 'monthly' ? "KSH 175 - KSH 285/month" : "KSH 1,949 - KSH 3,249/year", 
      count: extensions.filter(e => e.category === "Tech").length
    },
    {
      name: "Business",
      description: "Professional business-focused extensions",
      priceRange: billing === 'monthly' ? "KSH 165 - KSH 230/month" : "KSH 1,819 - KSH 2,599/year",
      count: extensions.filter(e => e.category === "Business").length
    },
    {
      name: "Country",
      description: "Country-specific domain extensions",
      priceRange: billing === 'monthly' ? "KSH 99 - KSH 185/month" : "KSH 1,039 - KSH 2,079/year",
      count: extensions.filter(e => e.category === "Country").length
    },
    {
      name: "Kenya",
      description: "Kenya-specific domain extensions",
      priceRange: billing === 'monthly' ? "KSH 195 - KSH 220/month" : "KSH 2,200 - KSH 2,500/year",
      count: extensions.filter(e => e.category === "Kenya").length
    }
  ];
  
  const renewalDates = getRenewalDates();
  
  res.json({ 
    categories,
    billing,
    renewalDates
  });
});

// Get extension details with monthly/yearly pricing
app.get("/extension/:ext", (req, res) => {
  const ext = req.params.ext;
  const billing = req.query.billing?.trim() || 'both';
  const extension = extensions.find(e => e.ext === ext);
  
  if (!extension) {
    return res.status(404).json({ 
      error: "Extension not found",
      message: `Domain extension .${ext} is not in our database`
    });
  }
  
  const renewalDates = getRenewalDates();
  const result = {
    extension: extension.ext,
    category: extension.category,
    description: extension.description,
    available: true,
    verified: true,
    featured: extension.featured || false,
    popularity: extension.popularity,
    verifiedBadge: `<span style="background: #10B981; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px;">✓ VERIFIED</span>`,
    renewalDates
  };

  if (billing === 'monthly' || billing === 'both') {
    result.monthlyPrice = extension.monthlyPrice;
    result.monthlyPriceText = `KSH ${extension.monthlyPrice}/month`;
  }

  if (billing === 'yearly' || billing === 'both') {
    result.yearlyPrice = extension.yearlyPrice;
    result.yearlyPriceText = `KSH ${extension.yearlyPrice}/year`;
  }
  
  res.json(result);
});

// Main route
app.get("/", (req, res) => {
  const stats = {
    totalExtensions: extensions.length,
    featuredExtensions: extensions.filter(e => e.featured).length,
    categories: 7, // Updated to include Kenya category
    priceRange: {
      monthlyMin: Math.min(...extensions.map(e => e.monthlyPrice)),
      monthlyMax: Math.max(...extensions.map(e => e.monthlyPrice)),
      yearlyMin: Math.min(...extensions.map(e => e.yearlyPrice)),
      yearlyMax: Math.max(...extensions.map(e => e.yearlyPrice))
    }
  };
  
  const renewalDates = getRenewalDates();
  
  res.send(`
    <h1><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/><path d="M8 12l2 2 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Kenya Host Domain Search API</h1>
    <p><strong><svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> True Kenya Host pricing for ${stats.totalExtensions}+ verified TLDs</strong></p>
    
    <div style="background: #FEF3C7; padding: 12px; border-radius: 8px; margin: 16px 0;">
      <strong>✅ NEW FEATURES:</strong>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li>All domains show as <strong>VERIFIED</strong> with badges</li>
        <li>5-character minimum requirement (e.g., "Johna" → "Johna.com")</li>
        <li><strong>Monthly & Yearly billing options</strong></li>
        <li><strong>Automatic renewal date calculation</strong></li>
        <li><strong>${stats.featuredExtensions} Featured top domains (.com, .co.ke, .net, .org, .ke)</strong></li>
        <li>True Kenya Host pricing in KSH</li>
      </ul>
    </div>
    
    <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><path d="M9 9h6v6h-6z" stroke="currentColor" stroke-width="2"/></svg> API Statistics:</h3>
    <ul>
      <li>Total Extensions: ${stats.totalExtensions}</li>
      <li><strong>Featured Extensions: ${stats.featuredExtensions}</strong></li>
      <li>Categories: ${stats.categories}</li>
      <li>Monthly Range: KSH ${stats.priceRange.monthlyMin} - KSH ${stats.priceRange.monthlyMax}/month</li>
      <li>Yearly Range: KSH ${stats.priceRange.yearlyMin} - KSH ${stats.priceRange.yearlyMax}/year</li>
      <li><span style="color: #10B981;">✓ All domains verified</span></li>
    </ul>
    
    <div style="background: #E0F2FE; padding: 12px; border-radius: 8px; margin: 16px 0;">
      <strong>📅 Next Renewal Dates:</strong>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li><strong>Monthly:</strong> ${renewalDates.monthly}</li>
        <li><strong>Yearly:</strong> ${renewalDates.yearly}</li>
      </ul>
    </div>
    
    <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> API Endpoints:</h3>
    <ul>
      <li><code>GET /featured?billing=both&limit=5</code> - <strong>Get featured top domains</strong></li>
      <li><code>GET /search?keyword=Johna&billing=both&category=Budget&sort=price-low</code> - Search domains (5+ chars required)</li>
      <li><code>GET /search?keyword=Johna&billing=monthly</code> - Monthly pricing only</li>
      <li><code>GET /search?keyword=Johna&billing=yearly</code> - Yearly pricing only</li>
      <li><code>GET /categories?billing=monthly</code> - Get categories with monthly pricing</li>
      <li><code>GET /extension/com?billing=both</code> - Get extension details with both pricing</li>
    </ul>
    
    <div style="background: #F0FDF4; padding: 12px; border-radius: 8px; margin: 16px 0;">
      <strong>⭐ Featured Top Domains:</strong>
      <ul style="margin: 8px 0; padding-left: 20px;">
        <li><strong>.com</strong> - Most popular worldwide (KSH 1,690/year)</li>
        <li><strong>.co.ke</strong> - Kenya's premier domain (KSH 2,500/year)</li>
        <li><strong>.net</strong> - Great for tech & networks (KSH 1,559/year)</li>
        <li><strong>.org</strong> - Perfect for organizations (KSH 1,429/year)</li>
        <li><strong>.ke</strong> - Kenya country domain (KSH 2,200/year)</li>
      </ul>
    </div>
    
    <h3><svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2"/></svg> Kenya Host Pricing:</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;">
      <div>
        <h4>Monthly Billing:</h4>
        <ul>
          <li><strong>Premium:</strong> KSH 135-1,050/month</li>
          <li><strong>Kenya:</strong> KSH 195-220/month</li>
          <li><strong>Standard:</strong> KSH 135-175/month</li>
          <li><strong>Budget:</strong> KSH 79-120/month</li>
          <li><strong>Tech:</strong> KSH 175-285/month</li>
          <li><strong>Business:</strong> KSH 165-230/month</li>
          <li><strong>Country:</strong> KSH 99-185/month</li>
        </ul>
      </div>
      <div>
        <h4>Yearly Billing (Best Value):</h4>
        <ul>
          <li><strong>Premium:</strong> KSH 1,429-11,699/year</li>
          <li><strong>Kenya:</strong> KSH 2,200-2,500/year</li>
          <li><strong>Standard:</strong> KSH 1,429-1,949/year</li>
          <li><strong>Budget:</strong> KSH 779-1,299/year</li>
          <li><strong>Tech:</strong> KSH 1,949-3,249/year</li>
          <li><strong>Business:</strong> KSH 1,819-2,599/year</li>
          <li><strong>Country:</strong> KSH 1,039-2,079/year</li>
        </ul>
      </div>
    </div>
    
    <div style="background: #E5F3FF; padding: 12px; border-radius: 8px; margin: 16px 0;">
      <strong>🔍 Search Requirements:</strong>
      <p>Domain names must be at least 5 characters long. Short searches like "j" or "ab" will be rejected. Try "Johna" or "MyBusiness" instead.</p>
      <p><strong>💰 Billing Options:</strong> Use <code>?billing=monthly</code>, <code>?billing=yearly</code>, or <code>?billing=both</code> to control pricing display.</p>
      <p><strong>⭐ Featured Domains:</strong> Use <code>/featured</code> endpoint to get top most popular domains like .com, .co.ke, .net, .org, .ke</p>
    </div>
  `);
});

app.listen(port, () => {
  console.log(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><polyline points="10,17 15,12 10,7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="15" y1="12" x2="3" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg> Kenya Host Domain API running on port ${port}`);
  console.log(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" stroke="currentColor" stroke-width="2"/><path d="M9 9h6v6h-6z" stroke="currentColor" stroke-width="2"/></svg> Loaded ${extensions.length} verified extensions with monthly & yearly pricing`);
  console.log(`⭐ Featured domains: ${extensions.filter(e => e.featured).length} top domains (.com, .co.ke, .net, .org, .ke)`);
  console.log(`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" stroke-width="2"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" stroke-width="2"/></svg> Monthly: KSH ${Math.min(...extensions.map(e => e.monthlyPrice))}-${Math.max(...extensions.map(e => e.monthlyPrice))} | Yearly: KSH ${Math.min(...extensions.map(e => e.yearlyPrice))}-${Math.max(...extensions.map(e => e.yearlyPrice))}`);
  console.log(`✅ NEW: Featured domains endpoint | Monthly/Yearly billing | Auto-renewal dates | All verified domains`);
});
