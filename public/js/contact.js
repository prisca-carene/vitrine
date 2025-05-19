// Contact form handling
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contact-form');
  
  // Initialize Select2 for websites selection with proper styling
  const initializeWebsitesSelect = () => {
    $('#interested-websites').select2({
      theme: 'default',
      placeholder: document.documentElement.lang === 'en' ? 
        '+ Select websites you are interested in...' : 
        '+ Sélectionnez les sites qui vous intéressent...',
      allowClear: true,
      multiple: true,
      width: '100%',
      dropdownParent: $('.contact-form-container'),
      language: document.documentElement.lang,
      templateResult: formatWebsiteOption,
      templateSelection: formatWebsiteOption
    });
  };

  // Custom formatting for website options
  const formatWebsiteOption = (website) => {
    if (!website.id) return website.text;
    return $(`<span><img src="${getDomainFaviconUrl(website.text)}" 
      style="width: 16px; height: 16px; margin-right: 8px;" 
      onerror="this.style.display='none'"/> ${website.text}</span>`);
  };
  
  // Populate websites select
  const populateWebsitesSelect = async () => {
    try {
      const websites = await fetchWebsites();
      const select = document.getElementById('interested-websites');
      
      if (!select) return;
      
      // Clear existing options
      select.innerHTML = '';
      
      // Add placeholder option
      const placeholder = document.createElement('option');
      placeholder.value = '';
      select.appendChild(placeholder);
      
      // Add website options
      websites.forEach(website => {
        const option = new Option(website['Domain name'], website['Domain name']);
        select.appendChild(option);
      });
      
      // Initialize Select2 after populating options
      initializeWebsitesSelect();
      
    } catch (error) {
      console.error('Error populating websites select:', error);
    }
  };
  
  // Initialize websites select
  populateWebsitesSelect();
  
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton.textContent;
      submitButton.disabled = true;
      submitButton.textContent = document.documentElement.lang === 'en' ? 'Sending...' : 'Envoi...';
      
      try {
        const formData = new FormData(contactForm);
        // Add selected websites to form data
        const selectedWebsites = $('#interested-websites').val();
        formData.append('interested_websites', JSON.stringify(selectedWebsites));
        
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(Object.fromEntries(formData)),
        });
        
        if (response.ok) {
          alert(document.documentElement.lang === 'en' ? 
            'Message sent successfully!' : 
            'Message envoyé avec succès !');
          contactForm.reset();
          $('#interested-websites').val(null).trigger('change');
        } else {
          throw new Error('Failed to send message');
        }
      } catch (error) {
        console.error('Error sending message:', error);
        alert(document.documentElement.lang === 'en' ? 
          'Failed to send message. Please try again.' : 
          'Échec de l\'envoi du message. Veuillez réessayer.');
      } finally {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      }
    });
  }
});