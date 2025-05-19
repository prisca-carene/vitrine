/**
 * Language switching functionality
 */

// Initialize i18next
window.i18next = {
  t: function(key, options = {}) {
    try {
      const translations = this.getTranslations();
      const keys = key.split('.');
      let value = translations;
      
      for (const k of keys) {
        if (value && typeof value === 'object') {
          value = value[k];
        } else {
          return key;
        }
      }
      
      if (typeof value === 'string') {
        return value;
      }
      
      if (options.returnObjects && typeof value === 'object') {
        return value;
      }
      
      return key;
    } catch (error) {
      console.error('Translation error:', error);
      return key;
    }
  },
  
  getTranslations: function() {
    const lang = document.documentElement.lang || 'fr';
    return lang === 'fr' ? this.frTranslations : this.enTranslations;
  },
  
  // French translations
  frTranslations: {
    filters: {
      categories: {
        wellbeing: 'Bien être',
        cbd: 'CBD',
        construction: 'Construction',
        content: 'Contenu',
        event: 'Événement',
        fantasy: 'Fantasy',
        food: 'Gastronomie et boissons',
        gift: 'Cadeaux',
        health: 'Santé',
        learning: 'Apprentissage',
        home: 'Maison',
        wellness: 'Santé / Bien être',
        sport: 'Sport',
        tech: 'Tech'
      }
    }
  },
  
  // English translations
  enTranslations: {
    filters: {
      categories: {
        wellbeing: 'Well-being',
        cbd: 'CBD',
        construction: 'Construction',
        content: 'Content',
        event: 'Event',
        fantasy: 'Fantasy',
        food: 'Food & Beverages',
        gift: 'Gift',
        health: 'Health',
        learning: 'Learning',
        home: 'Home',
        wellness: 'Wellness',
        sport: 'Sport',
        tech: 'Tech'
      }
    }
  }
};

// Initialize language switcher
const initializeLanguageSwitcher = () => {
  const switchLanguage = async (lang) => {
    try {
      const response = await fetch(`/api/language/${lang}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        // Update active state before reload
        document.querySelectorAll('.language-btn').forEach(btn => {
          btn.classList.toggle('active', btn.dataset.lang === lang);
        });
        
        // Redirect to the appropriate language path
        window.location.href = `/${lang}`;
      } else {
        console.error('Failed to switch language');
      }
    } catch (error) {
      console.error('Error switching language:', error);
    }
  };

  // Add click handlers to language buttons
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const lang = btn.dataset.lang;
      
      // Only switch if not already active
      if (!btn.classList.contains('active')) {
        switchLanguage(lang);
      }
    });
  });

  // Set initial active state based on current language
  const currentLang = document.documentElement.lang || 'fr';
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeLanguageSwitcher);
} else {
  initializeLanguageSwitcher();
}