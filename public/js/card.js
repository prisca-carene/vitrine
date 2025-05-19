/**
 * Functions for rendering website cards
 */

// Create a website card element
const createWebsiteCard = (website) => {
  const card = document.createElement('div');
  // Add nl-type class if Type is 'NL' or has newsletter metrics
  const isNewsletterType = website.Type === 'NL' || 
    (website.NewsletterSubscribers && website.NewsletterOpenRate);
  card.className = `website-card${isNewsletterType ? ' nl-type' : ''}`;
  card.dataset.domain = website['Domain name'];
  
  const ratingInfo = formatStarRating(website.Star);
  const websiteTheme = formatTheme(website.Thématique);
  const price = website.PriceClassicArticle || 'N/A';
  const currentLang = document.documentElement.lang || 'fr';
  
  card.innerHTML = `
    <div class="website-preview">
      <span class="website-theme">${websiteTheme}</span>
      <div class="website-logo">
        <img 
          src="${getDomainFaviconUrl(website['Domain name'])}" 
          alt="${website['Domain name']}"
          onerror="this.src='https://publithings.com/favicon.ico'"
        />
      </div>
      <div class="website-rating">
        ${ratingInfo.text === 'NEW' || ratingInfo.text === 'NOUVEAU'
          ? `<span class="new-badge">${currentLang === 'en' ? 'NEW' : 'NOUVEAU'}</span>`
          : parseInt(ratingInfo.text) >= 4
            ? `<div class="stars">
                ${Array(Math.min(parseInt(ratingInfo.text) || 0, 5)).fill('★').join('')}
                ${Array(5 - Math.min(parseInt(ratingInfo.text) || 0, 5)).fill('☆').join('')}
               </div>`
            : ''
        }
      </div>
    </div>
    <div class="website-info">
      <h3 class="website-name">${website['Domain name']}</h3>
      <p class="website-description">${website['Site title'] || ''}</p>
    </div>
  `;
  
  // Add click event to open modal
  card.addEventListener('click', () => {
    openWebsiteModal(website);
  });
  
  return card;
};

// Create pagination controls
const createPaginationControls = (currentPage, totalPages, onPageChange) => {
  const pagination = document.createElement('div');
  pagination.className = 'pagination';
  
  // Previous button
  const prevButton = document.createElement('button');
  prevButton.className = 'pagination-button';
  prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => onPageChange(currentPage - 1));
  pagination.appendChild(prevButton);
  
  // Page buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement('button');
    pageButton.className = `pagination-button ${i === currentPage ? 'active' : ''}`;
    pageButton.textContent = i;
    pageButton.addEventListener('click', () => onPageChange(i));
    pagination.appendChild(pageButton);
  }
  
  // Next button
  const nextButton = document.createElement('button');
  nextButton.className = 'pagination-button';
  nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => onPageChange(currentPage + 1));
  pagination.appendChild(nextButton);
  
  return pagination;
};

// Render all website cards with pagination
const renderWebsiteCards = (websites) => {
  const container = document.getElementById('websites-container');
  const paginationContainer = document.getElementById('pagination-container');
  if (!container || !paginationContainer) return;
  
  // Clear previous content
  container.innerHTML = '';
  paginationContainer.innerHTML = '';
  
  // Show message if no websites
  if (!websites || websites.length === 0) {
    const currentLang = document.documentElement.lang || 'fr';
    container.innerHTML = `
      <div class="no-results">
        <i class="fas fa-search"></i>
        <p>${currentLang === 'en' ? 'No websites match your search.' : 'Aucun site ne correspond à votre recherche.'}</p>
      </div>
    `;
    return;
  }
  
  // Pagination settings
  const itemsPerPage = 12;
  const totalPages = Math.ceil(websites.length / itemsPerPage);
  let currentPage = 1;
  
  const renderPage = (page) => {
    // Update current page
    currentPage = page;
    
    // Calculate start and end indices
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    // Get current page items
    const currentItems = websites.slice(startIndex, endIndex);
    
    // Clear container
    container.innerHTML = '';
    
    // Create and append each website card with animation delay
    currentItems.forEach((website, index) => {
      const card = createWebsiteCard(website);
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'all 0.3s ease';
      card.style.transitionDelay = `${index * 0.1}s`;
      container.appendChild(card);
      
      // Trigger animation after a small delay
      requestAnimationFrame(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      });
    });
    
    // Add pagination controls to separate container
    const paginationControls = createPaginationControls(currentPage, totalPages, renderPage);
    paginationContainer.innerHTML = '';
    paginationContainer.appendChild(paginationControls);
  };
  
  // Initial render
  renderPage(1);
};