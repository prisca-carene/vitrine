/**
 * Main application initialization
 */

// Store fetched websites for filtering
let cachedWebsites = [];

// Initialize the application
const initApp = async () => {
  try {
    // Fetch website data
    const websites = await fetchWebsites();
    // Ensure Description is always a string
    cachedWebsites = websites.map(website => ({
      ...website,
      Description: typeof website.Description === 'string' ? website.Description : String(website.Description || '')
    }));
    
    if (cachedWebsites.length === 0) {
      console.error('No website data available');
      document.getElementById('websites-container').innerHTML = `
        <div class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          <p>${document.documentElement.lang === 'en' ? 'Unable to load website data.' : 'Impossible de charger les données des sites.'}</p>
        </div>
      `;
      return;
    }
    
    // Extract and initialize theme filters
    const themes = extractThemes(cachedWebsites);
    initializeThemeFilters(themes);
    
    // Extract and initialize keyword filters
    const keywords = extractKeywords(cachedWebsites);
    initializeKeywordFilters(keywords);
    
    // Initialize sorting and search
    initializeSorting();
    initializeSearch();
    
    // Sort websites by stars (descending) by default
    const sortedWebsites = sortWebsites(cachedWebsites, 'star-desc');
    
    // Render sorted websites
    renderWebsiteCards(sortedWebsites);
    
    // Add animation classes once everything is loaded
    document.body.classList.add('loaded');
    
  } catch (error) {
    console.error('Error initializing application:', error);
    document.getElementById('websites-container').innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-circle"></i>
        <p>${document.documentElement.lang === 'en' ? 'An error occurred while loading the application.' : 'Une erreur s\'est produite lors du chargement de l\'application.'}</p>
      </div>
    `;
  }
};

// Initialize app and scroll effects when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // Initialize the app
    initApp();
    
    // Add subtle scroll animations
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const hero = document.querySelector('.hero');
      
      // Only apply parallax effect if hero element exists
      if (hero) {
        hero.style.backgroundPosition = `center ${scrollY * 0.4}px`;
      }
    });
  });
} else {
  initApp();
}