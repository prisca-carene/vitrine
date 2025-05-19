/**
 * Utility functions for the website catalog
 */

// Format star rating
const formatStarRating = (rating) => {
  if (rating === 'NEW') {
    return { text: 'NOUVEAU', className: 'new-site' };
  }
  
  const numRating = parseInt(rating, 10);
  return { value: numRating, text: numRating };
};

// Format price (removes space, € symbol and converts to number)
const formatPrice = (priceString) => {
  if (!priceString) return 0;
  return parseInt(priceString.replace(/[^\d]/g, ''), 10);
};

// Format number with spaces for thousands
const formatNumberWithSpaces = (number) => {
  if (number === null || number === undefined || isNaN(number)) {
    return 'N/A';
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

// Format theme name
const formatTheme = (theme) => {
  if (!theme) return '';
  return theme.trim();
};

// Create domain favicon URL
const getDomainFaviconUrl = (domain) => {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
};

// Create domain screenshot URL (using Urlbox)
const getDomainScreenshotUrl = (domain) => {
  // Using a free screenshot service
  return `https://api.urlbox.io/v1/FLMBH5MKiO8e1m0U/png?url=${domain}&width=800&height=600`;
};

// Get social media icon classes
const getSocialIconClass = (platform) => {
  const iconMap = {
    facebook: 'fab fa-facebook',
    linkedin: 'fab fa-linkedin',
    youtube: 'fab fa-youtube',
    x: 'fab fa-twitter',  // X (formerly Twitter)
  };
  
  return iconMap[platform.toLowerCase()] || 'fas fa-link';
};

// Truncate text to a certain length
const truncateText = (text, maxLength = 150) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Create a random color for charts
const getRandomColor = () => {
  const colors = [
    '#3182ce', '#805AD5', '#D53F8C', '#DD6B20', '#38A169', 
    '#4299E1', '#9F7AEA', '#ED64A6', '#ED8936', '#48BB78'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Debounce function for search input
const debounce = (func, delay) => {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), delay);
  };
};