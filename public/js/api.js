/**
 * API functions for fetching data
 */

// Get all websites
const fetchWebsites = async () => {
  try {
    const response = await fetch('/api/websites');
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch website data: ${response.status} - ${errorText}`);
    }
    const websites = await response.json();
    
    // If no websites data, throw error
    if (!websites || !Array.isArray(websites) || websites.length === 0) {
      throw new Error('No website data available in response');
    }
    
    // Get current language from HTML tag
    const currentLang = document.documentElement.lang || 'fr';
    
    // Translate website data based on language
    return websites.map(website => ({
      ...website,
      'Site title': website['Site title'][currentLang] || website['Site title'].fr,
      'Description': website.Description[currentLang] || website.Description.fr,
      'Thématique': translateTheme(website.Thématique, currentLang)
    }));
  } catch (error) {
    console.error('Error fetching websites:', error);
    throw error; // Re-throw to allow handling by the calling code
  }
};

// Translate theme
const translateTheme = (theme, lang) => {
  // Keep French if language is French
  if (lang === 'fr') return theme;
  
  const themeTranslations = {
    'Bien être': 'Well-being',
    'CBD': 'CBD',
    'Construction': 'Construction',
    'Content': 'Content',
    'Event': 'Event',
    'Fantasy': 'Fantasy',
    'Gastronomie et des boissons': 'Food & Beverages',
    'Gift': 'Gift',
    'Health': 'Health',
    'Learning': 'Learning',
    'Maison': 'Home',
    'Santé / Bien être': 'Wellness',
    'Sport': 'Sport',
    'Tech': 'Tech'
  };
  return themeTranslations[theme] || theme;
};

// Extract unique themes from websites data
const extractThemes = (websites) => {
  const themesSet = new Set();
  
  websites.forEach(website => {
    if (website.Thématique) {
      themesSet.add(formatTheme(website.Thématique));
    }
  });
  
  return Array.from(themesSet).sort();
};

// Extract unique keywords from websites data
const extractKeywords = (websites) => {
  const keywordsSet = new Set();
  
  websites.forEach(website => {
    if (Array.isArray(website.Keywords)) {
      website.Keywords.forEach(keyword => {
        keywordsSet.add(keyword.trim());
      });
    }
  });
  
  return Array.from(keywordsSet).sort();
};

// Filter websites by theme
const filterWebsitesByTheme = (websites, theme) => {
  if (!theme) return websites;
  return websites.filter(website => formatTheme(website.Thématique) === theme);
};

// Filter websites by keywords
const filterWebsitesByKeywords = (websites, selectedKeywords) => {
  if (!selectedKeywords || selectedKeywords.length === 0) return websites;
  
  return websites.filter(website => {
    if (!Array.isArray(website.Keywords)) return false;
    
    // Convert all keywords to lowercase for case-insensitive comparison
    const websiteKeywords = website.Keywords.map(k => k.toLowerCase().trim());
    const searchKeywords = selectedKeywords.map(k => k.toLowerCase().trim());
    
    // Check if any of the selected keywords match
    return searchKeywords.some(keyword => websiteKeywords.includes(keyword));
  });
};

// Filter websites by search query
const filterWebsitesBySearch = (websites, query) => {
  if (!query) return websites;
  
  const lowerQuery = query.toLowerCase();
  return websites.filter(website => {
    const domainMatch = website['Domain name']?.toLowerCase().includes(lowerQuery);
    const titleMatch = website['Site title']?.toLowerCase().includes(lowerQuery);
    const themeMatch = website.Thématique?.toLowerCase().includes(lowerQuery);
    const keywordsMatch = Array.isArray(website.Keywords) && 
      website.Keywords.some(keyword => keyword.toLowerCase().includes(lowerQuery));
    
    return domainMatch || titleMatch || themeMatch || keywordsMatch;
  });
};

// Sort websites by different criteria
const sortWebsites = (websites, sortCriteria) => {
  const websitesCopy = [...websites];
  
  switch (sortCriteria) {
    case 'star-desc':
      return websitesCopy.sort((a, b) => {
        // Convert star ratings to numbers for comparison
        const starA = a.Star === 'NEW' || a.Star === 'NOUVEAU' ? -1 : parseFloat(a.Star) || 0;
        const starB = b.Star === 'NEW' || b.Star === 'NOUVEAU' ? -1 : parseFloat(b.Star) || 0;
        return starB - starA;
      });
      
    case 'star-asc':
      return websitesCopy.sort((a, b) => {
        // Convert star ratings to numbers for comparison
        const starA = a.Star === 'NEW' || a.Star === 'NOUVEAU' ? -1 : parseFloat(a.Star) || 0;
        const starB = b.Star === 'NEW' || b.Star === 'NOUVEAU' ? -1 : parseFloat(b.Star) || 0;
        return starA - starB;
      });
      
    case 'price-desc':
      return websitesCopy.sort((a, b) => {
        const priceA = formatPrice(a.PriceClassicArticle);
        const priceB = formatPrice(b.PriceClassicArticle);
        return priceB - priceA;
      });
      
    case 'price-asc':
      return websitesCopy.sort((a, b) => {
        const priceA = formatPrice(a.PriceClassicArticle);
        const priceB = formatPrice(b.PriceClassicArticle);
        return priceA - priceB;
      });
      
    case 'subscribers-desc':
      return websitesCopy.sort((a, b) => {
        const subscribersA = parseInt(a.NewsletterSubscribers?.replace(/\s/g, '') || '0', 10);
        const subscribersB = parseInt(b.NewsletterSubscribers?.replace(/\s/g, '') || '0', 10);
        return subscribersB - subscribersA;
      });

    case 'subscribers-asc':
      return websitesCopy.sort((a, b) => {
        const subscribersA = parseInt(a.NewsletterSubscribers?.replace(/\s/g, '') || '0', 10);
        const subscribersB = parseInt(b.NewsletterSubscribers?.replace(/\s/g, '') || '0', 10);
        return subscribersA - subscribersB;
      });

    case 'openrate-desc':
      return websitesCopy.sort((a, b) => {
        const rateA = parseFloat(a.NewsletterOpenRate) || 0;
        const rateB = parseFloat(b.NewsletterOpenRate) || 0;
        return rateB - rateA;
      });

    case 'openrate-asc':
      return websitesCopy.sort((a, b) => {
        const rateA = parseFloat(a.NewsletterOpenRate) || 0;
        const rateB = parseFloat(b.NewsletterOpenRate) || 0;
        return rateA - rateB;
      });

    case 'frequency-desc':
      return websitesCopy.sort((a, b) => {
        const freqA = parseFloat(a.FrequenceNL) || 0;
        const freqB = parseFloat(b.FrequenceNL) || 0;
        return freqB - freqA;
      });

    case 'frequency-asc':
      return websitesCopy.sort((a, b) => {
        const freqA = parseFloat(a.FrequenceNL) || 0;
        const freqB = parseFloat(b.FrequenceNL) || 0;
        return freqA - freqB;
      });
      
    default:
      return websitesCopy;
  }
};