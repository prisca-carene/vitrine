/**
 * Functions for handling filtering and sorting
 */

// Initialize theme filters
const initializeThemeFilters = (themes) => {
  const filterContainer = document.getElementById('theme-filters');
  if (!filterContainer) return;
  
  // Clear existing filters
  filterContainer.innerHTML = '';
  
  // Get current language
  const currentLang = document.documentElement.lang || 'fr';
  
  // Add "All" filter option
  const allOption = document.createElement('div');
  allOption.className = 'filter-tag active';
  allOption.dataset.theme = '';
  allOption.textContent = currentLang === 'en' ? 'All our brands' : 'Toutes nos marques';
  filterContainer.appendChild(allOption);
  
  // Add each theme as a filter option
  themes.forEach(theme => {
    const option = document.createElement('div');
    option.className = 'filter-tag';
    option.dataset.theme = theme;
    
    // Get translation key based on theme
    const translationKey = Object.entries(i18next.t('filters.categories', { returnObjects: true }))
      .find(([_, value]) => value === theme)?.[0] || '';
    
    option.textContent = translationKey ? 
      i18next.t(`filters.categories.${translationKey}`) : 
      theme;
    
    filterContainer.appendChild(option);
  });
  
  // Add click event to filter options
  const filterOptions = document.querySelectorAll('.filter-tag');
  filterOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Update active state
      filterOptions.forEach(opt => opt.classList.remove('active'));
      option.classList.add('active');
      
      // Apply filter
      applyFilters();
    });
  });
};

// Initialize keyword filters
const initializeKeywordFilters = (keywords) => {
  const keywordContainer = document.getElementById('keyword-filters');
  if (!keywordContainer) return;
  
  // Clear existing filters
  keywordContainer.innerHTML = '';
  
  // Create keyword filter dropdown
  const keywordSelect = document.createElement('select');
  keywordSelect.id = 'keyword-select';
  keywordSelect.multiple = true;
  keywordSelect.className = 'keyword-select';
  
  // Add placeholder option
  const placeholderOption = document.createElement('option');
  placeholderOption.value = '';
  placeholderOption.disabled = true;
  placeholderOption.textContent = document.documentElement.lang === 'en' ? 'Filter by keywords...' : 'Filtrer par mots-clés...';
  keywordSelect.appendChild(placeholderOption);
  
  // Add keyword options
  keywords.forEach(keyword => {
    const option = document.createElement('option');
    option.value = keyword;
    option.textContent = keyword;
    keywordSelect.appendChild(option);
  });
  
  keywordContainer.appendChild(keywordSelect);
  
  // Initialize select2 for better UX
  $(keywordSelect).select2({
    placeholder: document.documentElement.lang === 'en' ? 'Filter by keywords...' : 'Filtrer par mots-clés...',
    allowClear: true,
    multiple: true,
    width: '100%',
    maximumSelectionLength: 5
  });
  
  // Add change event
  $(keywordSelect).on('change', () => {
    // Reset to "All our brands" when filtering by keywords
    const filterOptions = document.querySelectorAll('.filter-tag');
    filterOptions.forEach(opt => opt.classList.remove('active'));
    const allOption = document.querySelector('.filter-tag[data-theme=""]');
    if (allOption) {
      allOption.classList.add('active');
    }
    applyFilters();
  });
};

// Initialize sort functionality
const initializeSorting = () => {
  const sortSelect = document.getElementById('sort-select');
  if (!sortSelect) return;
  
  sortSelect.addEventListener('change', () => {
    applyFilters();
  });
};

// Initialize search functionality
const initializeSearch = () => {
  const searchInput = document.getElementById('search-input');
  if (!searchInput) return;
  
  // Update placeholder based on language
  searchInput.placeholder = document.documentElement.lang === 'en' ? 'Search for a brand...' : 'Rechercher une marque...';
  
  // Search on input (debounced)
  searchInput.addEventListener('input', debounce(() => {
    // Reset to "All our brands" when searching
    const filterOptions = document.querySelectorAll('.filter-tag');
    filterOptions.forEach(opt => opt.classList.remove('active'));
    const allOption = document.querySelector('.filter-tag[data-theme=""]');
    if (allOption) {
      allOption.classList.add('active');
    }
    
    applyFilters();
  }, 300));
  
  // Search on Enter key
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      // Reset to "All our brands" when searching
      const filterOptions = document.querySelectorAll('.filter-tag');
      filterOptions.forEach(opt => opt.classList.remove('active'));
      const allOption = document.querySelector('.filter-tag[data-theme=""]');
      if (allOption) {
        allOption.classList.add('active');
      }
      
      applyFilters();
    }
  });
};

// Apply all active filters and sorting
const applyFilters = () => {
  // Get filter values
  const activeThemeElement = document.querySelector('.filter-tag.active');
  const activeTheme = activeThemeElement ? activeThemeElement.dataset.theme : '';
  
  const keywordSelect = $('#keyword-select').val();
  const selectedKeywords = Array.isArray(keywordSelect) ? keywordSelect : [];
  
  const sortSelect = document.getElementById('sort-select');
  const sortCriteria = sortSelect ? sortSelect.value : 'star-desc';
  
  const searchInput = document.getElementById('search-input');
  const searchQuery = searchInput ? searchInput.value.trim() : '';
  
  // Show loading state
  const container = document.getElementById('websites-container');
  if (!container) return;
  
  container.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Filtrage des sites...</p>
    </div>
  `;
  
  // Apply filters and sorting
  setTimeout(() => {
    let filteredWebsites = [...cachedWebsites];
    
    // Apply theme filter
    if (activeTheme) {
      filteredWebsites = filterWebsitesByTheme(filteredWebsites, activeTheme);
    }
    
    // Apply keyword filter
    if (selectedKeywords.length > 0) {
      filteredWebsites = filterWebsitesByKeywords(filteredWebsites, selectedKeywords);
    }
    
    // Apply search filter
    if (searchQuery) {
      filteredWebsites = filterWebsitesBySearch(filteredWebsites, searchQuery);
    }
    
    // Apply sorting
    filteredWebsites = sortWebsites(filteredWebsites, sortCriteria);
    
    // Render filtered and sorted websites
    renderWebsiteCards(filteredWebsites);
  }, 200);
};