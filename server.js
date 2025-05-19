const express = require('express');
const path = require('path');
const morgan = require('morgan');
const compression = require('compression');
const fs = require('fs').promises;
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-http-middleware');
const Backend = require('i18next-fs-backend');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(morgan('dev'));
app.use(compression());
app.use(express.json());
app.use(cookieParser());

// Configure i18next
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    backend: {
      loadPath: path.join(__dirname, 'locales/{{lng}}/translation.json'),
    },
    fallbackLng: 'fr',
    preload: ['en', 'fr'],
    load: 'languageOnly',
    detection: {
      order: ['path', 'cookie', 'header'],
      lookupCookie: 'i18next',
      caches: ['cookie'],
      lookupFromPathIndex: 0
    },
    interpolation: {
      escapeValue: false
    }
  });

app.use(i18nextMiddleware.handle(i18next));
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.post('/api/language/:lang', (req, res) => {
  const { lang } = req.params;
  if (['en', 'fr'].includes(lang)) {
    res.cookie('i18next', lang, { maxAge: 365 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, language: lang });
  } else {
    res.status(400).json({ error: 'Invalid language' });
  }
});

app.get('/api/websites', async (req, res) => {
  try {
    const websitesPath = path.join(__dirname, 'data', 'websites.json');
    
    // Check if file exists
    try {
      await fs.access(websitesPath);
    } catch (error) {
      console.error('websites.json file not found:', error);
      return res.status(404).json({ error: 'Website data file not found' });
    }
    
    // Read and parse file
    const data = await fs.readFile(websitesPath, 'utf8');
    let websites;
    try {
      websites = JSON.parse(data);
    } catch (error) {
      console.error('Error parsing websites.json:', error);
      return res.status(500).json({ error: 'Invalid website data format' });
    }
    
    // Validate data structure
    if (!Array.isArray(websites)) {
      console.error('websites.json does not contain an array');
      return res.status(500).json({ error: 'Invalid website data structure' });
    }
    
    res.json(websites);
  } catch (error) {
    console.error('Error fetching website data:', error);
    res.status(500).json({ error: 'Failed to fetch website data' });
  }
});

// Redirect root to French version
app.get('/', (req, res) => {
  res.redirect(301, '/fr');
});

// Handle language-specific routes
app.get('/:lng', async (req, res, next) => {
  const lng = req.params.lng;
  
  // Redirect invalid language codes to French
  if (!['en', 'fr'].includes(lng)) {
    return res.redirect(301, '/fr');
  }

  try {
    let content = await fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8');
    const translations = await i18next.getResourceBundle(lng, 'translation');
    
    // Apply translations recursively
    const applyTranslations = (obj, prefix = '') => {
      if (!obj || typeof obj !== 'object') {
        console.warn(`No translations found for language: ${lng}`);
        return;
      }

      Object.entries(obj).forEach(([key, value]) => {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof value === 'object' && value !== null) {
          applyTranslations(value, fullKey);
        } else {
          // Replace text content
          content = content.replace(
            new RegExp(`data-i18n="${fullKey}"[^>]*>[^<]*<`, 'g'),
            `data-i18n="${fullKey}">${value}<`
          );
          
          // Replace placeholders
          content = content.replace(
            new RegExp(`data-i18n-placeholder="${fullKey}"[^>]*placeholder="[^"]*"`, 'g'),
            `data-i18n-placeholder="${fullKey}" placeholder="${value}"`
          );
          
          // Replace title attributes
          content = content.replace(
            new RegExp(`data-i18n-title="${fullKey}"[^>]*title="[^"]*"`, 'g'),
            `data-i18n-title="${fullKey}" title="${value}"`
          );
        }
      });
    };
    
    // Only apply translations if they exist
    if (translations) {
      applyTranslations(translations);
    } else {
      console.warn(`No translations found for language: ${lng}`);
    }
    
    // Set correct language in HTML tag
    content = content.replace(/<html[^>]*>/, `<html lang="${lng}">`);
    res.send(content);
  } catch (error) {
    next(error);
  }
});

// Catch-all route to redirect to French version
app.get('*', (req, res) => {
  res.redirect(301, '/fr');
});

//formulaire de contact
app.post('/api/contact', async (req, res) => {
  const { name, email, phone, subject, interested_websites, message } = req.body;

  // Validation basique
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Certains champs requis sont manquants.' });
  }

  try {
    // Transporteur SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.ionos.fr',
      port: 465,
      secure: true,
      auth: {
        user: 'contact@publithings.fr',       // <-- remplace ici
        pass: '_s!Fh#3Ko{.Hy@_?45'       // <-- et ici
      },
      logger: true, // logs dans la console
  debug: true   // affiche les échanges avec le serveur SMTP
    });

    // Email HTML formaté
    const htmlContent = `
      <h2>Nouveau contact depuis catalogue Publithings</h2>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Phone :</strong> ${phone || 'Non fourni'}</p>
      <p><strong>Sujet :</strong> ${subject}</p>
      <p><strong>Sites int&eacute;ress&eacute;s :</strong> ${JSON.parse(interested_websites).join(', ')}</p>
      <p><strong>Message :</strong><br>${message}</p>
    `;

    // Configuration du mail
    const mailOptions = {
      from: `"${name}" <contact@publithings.fr>`,  // <- adresse autorisée
      to: 'seo+catalogue@publithings.com',
      replyTo: email,                              // <- redirige la réponse vers l'expéditeur
      subject: `[Catalogue] ${subject} - xSponso xCatalogue`,
      html: htmlContent
    };

    // Envoi
    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Message envoyé avec succès.' });
  } catch (err) {
    console.error('Erreur SMTP :', err);
    res.status(500).json({ error: 'Erreur lors de l’envoi de l’e-mail.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});