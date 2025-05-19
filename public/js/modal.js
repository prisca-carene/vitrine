/**
 * Functions for handling the website details modal
 */

// Create newsletter metrics card
const createNewsletterMetricCard = (value, label, icon) => {
  if (!value || value === "null") return '';
  
  return `
    <div class="newsletter-metric-card">
      <div class="newsletter-metric-icon">
        <i class="${icon}"></i>
      </div>
      <div class="newsletter-metric-content">
        <div class="newsletter-metric-value">${value}</div>
        <div class="newsletter-metric-label">${label}</div>
      </div>
    </div>
  `;
};

// Format Majestic value for display
const formatMajesticValue = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// Create circular progress bar HTML
const createCircularProgress = (value, label, color) => {
  const percentage = (value / 100) * 100;
  return `
    <div class="circular-progress" style="text-align: center;">
      <div style="position: relative; width: 120px; height: 120px; margin: 0 auto;">
        <svg viewBox="0 0 36 36" style="transform: rotate(-90deg);">
          <path d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#eee"
            stroke-width="2"
            stroke-dasharray="100, 100"
          />
          <path d="M18 2.0845
            a 15.9155 15.9155 0 0 1 0 31.831
            a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="${color}"
            stroke-width="2"
            stroke-dasharray="${percentage}, 100"
          />
        </svg>
        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); text-align: center;">
          <div style="font-size: 24px; font-weight: bold;">${value}</div>
          <div style="font-size: 14px; color: #666;">${label}</div>
        </div>
      </div>
    </div>`;
};

// Format keywords for display with accordion
const formatKeywords = (keywords) => {
  if (!Array.isArray(keywords) || keywords.length === 0) return '';
  
  const currentLang = document.documentElement.lang || 'fr';
  const visibleKeywords = keywords.slice(0, 5);
  const hiddenKeywords = keywords.slice(5);
  
  const visibleKeywordsHtml = visibleKeywords.map(keyword => `
    <span style="
      display: inline-block;
      background: white;
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      font-size: 12px;
      color: #64748b;
      border: 1px solid #e2e8f0;
      margin: 0.25rem;
    ">${keyword}</span>
  `).join('');

  const showMoreText = currentLang === 'en' ? 
    `Show ${hiddenKeywords.length} more keywords` : 
    `Voir ${hiddenKeywords.length} mots clés supplémentaires`;
  
  const hideText = currentLang === 'en' ? 
    'Hide additional keywords' : 
    'Masquer les mots clés supplémentaires';

  const keywordsTitle = currentLang === 'en' ? 'Keywords' : 'Mots clés';

  const hiddenKeywordsHtml = hiddenKeywords.length > 0 ? `
    <div class="keywords-accordion" style="width: 100%;">
      <button onclick="toggleKeywords(this)" style="
        background: none;
        border: none;
        color: #64748b;
        font-size: 0.875rem;
        cursor: pointer;
        padding: 0.5rem 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        width: 100%;
      ">
        <i class="fas fa-chevron-down"></i>
        ${showMoreText}
      </button>
      <div class="hidden-keywords" style="
        display: none;
        margin-top: 0.5rem;
        width: 100%;
        position: absolute;
        background: #fafafa;
        padding: 1rem;
        border-radius: 4px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 10;
        left: 0;
      ">
        ${hiddenKeywords.map(keyword => `
          <span style="
            display: inline-block;
            background: white;
            padding: 0.375rem 0.75rem;
            border-radius: 9999px;
            font-size: 10px;
            color: #64748b;
            border: 1px solid #e2e8f0;
            margin: 0.25rem;
          ">${keyword}</span>
        `).join('')}
      </div>
    </div>
  ` : '';

  return `
  <div style="border-top: solid 1px var(--border-color); margin: var(--spacing-4) 0px"></div>
    <div style="
      padding: 1.5rem;
      background: #fafafa;
      border-radius: 4px;
      position: relative;
    ">
      <h3 style="margin-bottom: 1rem; font-size: 20px; color: #64748b;">${keywordsTitle}</h3>
      <div style="display: flex; flex-wrap: wrap; margin: -0.25rem;">
        ${visibleKeywordsHtml}
      </div>
      ${hiddenKeywordsHtml}
    </div>
  `;
};

// Toggle keywords visibility
window.toggleKeywords = (button) => {
  const hiddenKeywords = button.nextElementSibling;
  const icon = button.querySelector('i');
  const currentLang = document.documentElement.lang || 'fr';
  
  if (hiddenKeywords.style.display === 'none') {
    hiddenKeywords.style.display = 'flex';
    hiddenKeywords.style.flexWrap = 'wrap';
    icon.classList.replace('fa-chevron-down', 'fa-chevron-up');
    button.innerHTML = button.innerHTML.replace(
      currentLang === 'en' ? 'Show' : 'Voir',
      currentLang === 'en' ? 'Hide' : 'Masquer'
    );
  } else {
    hiddenKeywords.style.display = 'none';
    icon.classList.replace('fa-chevron-up', 'fa-chevron-down');
    button.innerHTML = button.innerHTML.replace(
      currentLang === 'en' ? 'Hide' : 'Masquer',
      currentLang === 'en' ? 'Show' : 'Voir'
    );
  }
};

// Get website type badge
// const getWebsiteTypeBadge = (website) => {
//   if (!website.Type) return '';
  
//   return `
//     <span class="website-detail-type" style="
//       display: inline-block;
//       background: var(--primary-color);
//       color: white;
//       padding: 0.25rem 0.75rem;
//       border-radius: 4px;
//       font-size: 0.875rem;
//       margin-left: 0.5rem;
//     ">${website.Type}</span>
//   `;
// };

// Open the website details modal
const openWebsiteModal = (website) => {
  const modal = document.getElementById('website-modal');
  const modalBody = document.getElementById('modal-body');
  const currentLang = document.documentElement.lang || 'fr';
  
  // Translate modal texts
  const modalTexts = {
    characteristics: currentLang === 'en' ? 'Characteristics' : 'Caractéristiques',
    language: currentLang === 'en' ? 'Language' : 'Langue',
    pricing: currentLang === 'en' ? 'Pricing' : 'Tarifs',
    classicArticle: currentLang === 'en' ? 'Classic article' : 'Article classique',
    sensitiveArticleNonOpt: currentLang === 'en' ? 'Sensitive article (non-optimized anchor)' : 'Article sensible (ancre non-optimisée)',
    sensitiveArticleOpt: currentLang === 'en' ? 'Sensitive article (optimized anchor)' : 'Article sensible (ancre optimisée)',
    linkInsertion: currentLang === 'en' ? 'Insert link on existing post' : 'Insertion de lien sur article existant',
    majesticMetrics: currentLang === 'en' ? 'Majestic Metrics' : 'Métriques Majestic',
    links: currentLang === 'en' ? 'Links' : 'Liens',
    refDomains: currentLang === 'en' ? 'Referring Domains' : 'Domaines Référents',
    ratio: currentLang === 'en' ? 'Ratio' : 'Ratio',
    contactUs: currentLang === 'en' ? 'Contact us' : 'Nous contacter',
    stars: currentLang === 'en' ? 'stars' : 'étoiles',
    new: currentLang === 'en' ? 'NEW' : 'NOUVEAU',
    newsletterMetrics: currentLang === 'en' ? 'Newsletter Metrics' : 'Métriques Newsletter',
    subscribers: currentLang === 'en' ? 'Newsletter Subscribers' : 'Abonnés newsletter',
    openRate: currentLang === 'en' ? 'Open Rate' : 'Taux d\'ouverture',
    audience: currentLang === 'en' ? 'Audience' : 'Audience',
    emailDedieNL: currentLang === 'en' ? 'Dedicated Email' : 'Email Dédié',
    sponsoringNL: currentLang === 'en' ? '4 Weeks Sponsoring' : 'Sponsoring 4 semaines',
    frequenceNL: currentLang === 'en' ? 'Weekly Frequency' : 'Fréquence par semaine'
  };

  // Create CF/TF metrics display
  const cfTfMetrics = website.MajesticTF || website.MajesticCF ? `
    <div style="display: flex; justify-content: center; gap: 2rem; margin: 2rem 0;">
      ${website.MajesticTF ? createCircularProgress(website.MajesticTF, 'TF', '#10B981') : ''}
      ${website.MajesticCF ? createCircularProgress(website.MajesticCF, 'CF', '#8B5CF6') : ''}
    </div>
  ` : '';

  // Only show rating if it's NEW or >= 4 stars
  const ratingHtml = website.Star === 'NEW' || website.Star === 'NOUVEAU'
    ? `<span class="new-badge">${modalTexts.new}</span>`
    : parseInt(website.Star) >= 4
      ? `<div class="website-detail-rating">
          <i class="fas fa-star"></i>
          <span>${website.Star} ${modalTexts.stars}</span>
        </div>`
      : '';



  // Créer une fonction pour générer les cartes de métriques
  const createNewsletterMetricCard = (value, label, icon) => {
    if (!value || value === "null" || value === "undefined" || value === '') {
      return '';  // Ne retourne rien si la valeur est invalide
    }

    return `
      <div class="metric-card">
        <div class="metric-card-header">
          <p class="metric-value">${label}</p>
        </div>
        <h4>${value}</h4>
      </div>
    `;
  };

  // Mettre les métriques dans le modal
  let newsletterMetricsHtml = '';
  
  // Vérification des valeurs et affichage conditionnel
  if (website.NewsletterSubscribers) {
    newsletterMetricsHtml += `
      <h3 class="newsletter-title">${modalTexts.newsletterMetrics}</h3>
      <div class="metric-card highlighted-card">
        <h4>Abonnés Newsletter</h4>
        <p class="metric-value">${website.NewsletterSubscribers}</p>
      </div>
    `;
  }
  
  // Ajouter l'audience si elle existe
  if (website['Audience NL']) {
    newsletterMetricsHtml += `
      <div class="metric-card-audience">
        <h4>Audience</h4>
        <p class="metric-value">${website['Audience NL']}</p>
      </div>
    `;
  }

  // Ajouter les 4 autres métriques (2 par ligne)
  newsletterMetricsHtml += `
    <div class="metric-cards-row">
      ${createNewsletterMetricCard(website.NewsletterOpenRate, modalTexts.openRate, 'fas fa-envelope-open')}
      ${createNewsletterMetricCard(website['Fréquence par semaine NL'], modalTexts.frequenceNL, 'fas fa-calendar-week')}
    </div>

    <div class="metric-cards-row">
      ${createNewsletterMetricCard(website['Email Dédié NL'], modalTexts.emailDedieNL, 'fas fa-paper-plane')}
      ${createNewsletterMetricCard(website['Sponsoring 4 semaines NL'], modalTexts.sponsoringNL, 'fas fa-ad')}
    </div>
  `;

  // Injecter le contenu dans le modal
  modalBody.innerHTML = newsletterMetricsHtml;












  // Characteristics section - only show if there are characteristics
  const hasCharacteristics = website.Language || 
                           website.GoogleNews || 
                           website.GoogleIndex || 
                           website.InboundInternalLinks;

  const characteristicsHtml = hasCharacteristics ? `
    <div class="stats-section">
      <h3>${modalTexts.characteristics}</h3>
      <div class="stats-grid">
        ${website.Language ? `
          <div class="stat-item">
            <div class="stat-label">${modalTexts.language}</div>
            <div class="stat-value">${website.Language}</div>
          </div>
        ` : ''}
        ${website.GoogleNews ? `
          <div class="stat-item">
            <div class="stat-label">Google News</div>
            <div class="stat-value">${website.GoogleNews}</div>
          </div>
        ` : ''}
        ${website.GoogleIndex ? `
          <div class="stat-item">
            <div class="stat-label">${currentLang === 'en' ? 'Google Index' : 'Indexé Google'}</div>
            <div class="stat-value">${website.GoogleIndex}</div>
          </div>
        ` : ''}
        ${website.InboundInternalLinks ? `
          <div class="stat-item">
            <div class="stat-label">${currentLang === 'en' ? 'Internal links' : 'Liens internes'}</div>
            <div class="stat-value">${website.InboundInternalLinks}</div>
          </div>
        ` : ''}
      </div>
    </div>` : '';

  // Pricing section - only show if there are prices
  const hasPricing = website.PriceClassicArticle || 
                    website.PriceSensitiveArticleNonOptimized || 
                    website.PriceSensitiveArticleOptimized || 
                    website.LinkInsertionPrice;

  const pricingHtml = hasPricing ? `
    <div class="stats-section">
      <h3>${modalTexts.pricing}</h3>
      ${website.PriceClassicArticle ? `
        <div class="price-option">
          <div class="price-label">${modalTexts.classicArticle}</div>
          <div class="price-value">${website.PriceClassicArticle}</div>
        </div>
      ` : ''}
      ${website.PriceSensitiveArticleNonOptimized ? `
        <div class="price-option">
          <div class="price-label">${modalTexts.sensitiveArticleNonOpt}</div>
          <div class="price-value">${website.PriceSensitiveArticleNonOptimized}</div>
        </div>
      ` : ''}
      ${website.PriceSensitiveArticleOptimized ? `
        <div class="price-option">
          <div class="price-label">${modalTexts.sensitiveArticleOpt}</div>
          <div class="price-value">${website.PriceSensitiveArticleOptimized}</div>
        </div>
      ` : ''}
      ${website.LinkInsertionPrice ? `
        <div class="price-option">
          <div class="price-label">${modalTexts.linkInsertion}</div>
          <div class="price-value">${website.LinkInsertionPrice}</div>
        </div>
      ` : ''}
    </div>` : '';

  // Majestic metrics section - only show if there are metrics
  const hasMajesticMetrics = website.MajesticLinks || 
                            website.MajesticRefDomains || 
                            website.MajesticIPs || 
                            website.MajesticSubnets || 
                            website.MajesticCFTFRatio ||
                            website.MajesticTF ||
                            website.MajesticCF;

  const majesticMetricsHtml = hasMajesticMetrics ? `
    <div class="stats-section">
      <h3>${modalTexts.majesticMetrics}</h3>
      ${cfTfMetrics}
      
      <table class="majestic-table">
        <tr>
          <th>Metric</th>
          <th>${currentLang === 'en' ? 'Value' : 'Valeur'}</th>
        </tr>
        ${website.MajesticLinks ? `
          <tr>
            <td>${modalTexts.links}</td>
            <td>${formatMajesticValue(website.MajesticLinks)}</td>
          </tr>
        ` : ''}
        ${website.MajesticRefDomains ? `
          <tr>
            <td>${modalTexts.refDomains}</td>
            <td>${formatMajesticValue(website.MajesticRefDomains)}</td>
          </tr>
        ` : ''}
        ${website.MajesticIPs ? `
          <tr>
            <td>IPs</td>
            <td>${formatMajesticValue(website.MajesticIPs)}</td>
          </tr>
        ` : ''}
        ${website.MajesticSubnets ? `
          <tr>
            <td>Subnets</td>
            <td>${formatMajesticValue(website.MajesticSubnets)}</td>
          </tr>
        ` : ''}
        ${website.MajesticCFTFRatio ? `
          <tr>
            <td>${modalTexts.ratio}</td>
            <td>${formatMajesticValue(website.MajesticCFTFRatio)}</td>
          </tr>
        ` : ''}
      </table>
      
      <div class="chart-container">
        <canvas id="majesticChart"></canvas>
      </div>
    </div>` : '';

  // External links section - only show if there are external links
  const hasExternalLinks = website.Majestic || website.Semrush || website.Ahrefs;

  const externalLinksHtml = hasExternalLinks ? `
    <div class="external-links">
      ${website.Majestic ? `
        <a href="${website.Majestic}" target="_blank" class="external-link">
          <i class="fas fa-chart-bar"></i> Majestic
        </a>
      ` : ''}
      ${website.Semrush ? `
        <a href="${website.Semrush}" target="_blank" class="external-link">
          <i class="fas fa-search"></i> SEMrush
        </a>
      ` : ''}
      ${website.Ahrefs ? `
        <a href="${website.Ahrefs}" target="_blank" class="external-link">
          <i class="fas fa-link"></i> Ahrefs
        </a>
      ` : ''}
    </div>` : '';
  
  // Populate modal with website details
  modalBody.innerHTML = `
    <div class="website-detail">
      <div class="website-detail-header">
        <div class="website-detail-title">
          <div class="website-detail-badges">
            <span class="website-detail-theme">${website.Thématique}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <h2><a href="https://${website['Domain name']}" target="_blank" rel="noopener noreferrer">${website['Domain name']}</a></h2>
            <img 
              src="${getDomainFaviconUrl(website['Domain name'])}" 
              alt="Favicon"
              style="width: 32px; height: 32px; border-radius: 4px;"
              onerror="this.src='https://publithings.com/favicon.ico'"
            />
          </div>
          ${ratingHtml}
        </div>
      </div>
      
      <div class="website-detail-main">
        <div class="website-detail-image">
          <img src="/images/${website.FeaturedImage}" 
               alt="${website['Domain name']}" 
               style="width: 100%; height: 100%; object-fit: cover;"
               onerror="this.onerror=null; this.src='${getDomainScreenshotUrl(website['Domain name'])}'">
        </div>
        
        <div class="website-detail-description">
          ${website.Description}
        </div>
        
        <div class="website-detail-social">
          ${website.Facebook ? `<a href="${website.Facebook}" target="_blank" class="social-link" title="Facebook"><i class="fab fa-facebook"></i></a>` : ''}
          ${website.LinkedIn ? `<a href="${website.LinkedIn}" target="_blank" class="social-link" title="LinkedIn"><i class="fab fa-linkedin"></i></a>` : ''}
          ${website.Youtube ? `<a href="${website.Youtube}" target="_blank" class="social-link" title="Youtube"><i class="fab fa-youtube"></i></a>` : ''}
          ${website.X ? `<a href="${website.X}" target="_blank" class="social-link" title="X"><i class="fab fa-twitter"></i></a>` : ''}
        </div>
        
        ${newsletterMetricsHtml}
        
        ${formatKeywords(website.Keywords)}
      </div>
      
      <div class="website-detail-stats">
        ${pricingHtml}
        ${characteristicsHtml}
        ${majesticMetricsHtml}
        ${externalLinksHtml}

        <div class="website-cta">
          <button class="cta-button" onclick="handleContactClick('${website['Domain name']}')">
            ${modalTexts.contactUs}
          </button>
        </div>
      </div>
    </div>
  `;
  
  // Show the modal with animation
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
  
  // Initialize charts after modal is visible
  setTimeout(() => {
    if (hasMajesticMetrics) {
      initializeMajesticChart(website);
    }
  }, 300);
  
  // Add event listener to close button
  const closeButton = document.querySelector('.close-modal');
  closeButton.addEventListener('click', closeWebsiteModal);
  
  // Close modal when clicking outside content
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeWebsiteModal();
    }
  });
  
  // Close modal with escape key
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeWebsiteModal();
    }
  });
};

// Close the website details modal
const closeWebsiteModal = () => {
  const modal = document.getElementById('website-modal');
  modal.classList.remove('active');
  document.body.style.overflow = ''; // Enable scrolling again
};

// Initialize Majestic metrics chart
const initializeMajesticChart = (website) => {
  const ctx = document.getElementById('majesticChart');
  if (!ctx) return;
  
  const currentLang = document.documentElement.lang || 'fr';
  
  // Fonction utilitaire pour convertir en nombre en toute sécurité
  const safeParseInt = (value) => {
    // Vérifie si la valeur est une chaîne de caractères
    if (typeof value === 'string') {
      return parseInt(value.replace(/\s/g, '')) || 0;
    }
    // Si c'est déjà un nombre, retourne-le directement
    else if (typeof value === 'number') {
      return value;
    }
    // Sinon retourne 0
    return 0;
  };
  
  // Destroy existing chart if it exists
  const existingChart = Chart.getChart(ctx);
  if (existingChart) {
    existingChart.destroy();
  }
  
  new Chart(ctx, {
    type: 'radar',
    data: {
      labels: [
        'CF',
        'TF',
        currentLang === 'en' ? 'Referring Domains' : 'Domaines Référents',
        'IPs',
        'Subnets'
      ],
      datasets: [{
        label: currentLang === 'en' ? 'Majestic Metrics' : 'Métriques Majestic',
        data: [
          website.MajesticCF || 0,
          website.MajesticTF || 0,
          Math.min(safeParseInt(website.MajesticRefDomains) / 100, 50),
          Math.min(safeParseInt(website.MajesticIPs) / 50, 50),
          Math.min(safeParseInt(website.MajesticSubnets) / 50, 50)
        ],
        backgroundColor: 'rgba(255, 87, 34, 0.2)',
        borderColor: 'rgba(255, 87, 34, 1)',
        pointBackgroundColor: 'rgba(255, 87, 34, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 87, 34, 1)'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: {
            display: true
          },
          suggestedMin: 0,
          suggestedMax: 50
        }
      }
    }
  });
};


// Handle contact button click
window.handleContactClick = (domainName) => {
  // Close the modal
  closeWebsiteModal();
  
  // Scroll to contact form
  document.querySelector('.cta-section').scrollIntoView({ behavior: 'smooth' });
  
  // Wait for scroll to complete and Select2 to be ready
  setTimeout(() => {
    // Select the website in the dropdown
    const select = $('#interested-websites');
    if (select.length) {
      // Clear previous selection
      select.val(null).trigger('change');
      
      // Find or create the option
      let option = select.find(`option[value="${domainName}"]`);
      if (!option.length) {
        option = new Option(domainName, domainName, true, true);
        select.append(option);
      }
      
      // Select the option
      select.val(domainName).trigger('change');
      
      // Focus the name input
      document.getElementById('name').focus();
      
      // Set subject
      const subject = document.getElementById('subject');
      if (subject) {
        subject.value = `Intérêt pour ${domainName}`;
      }
    }
  }, 500);
};