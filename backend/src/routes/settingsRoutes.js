import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SETTINGS_FILE = path.join(__dirname, '../../data/settings.json');

const router = express.Router();

// Ensure data directory exists
const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize settings file if not exists
if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
    footer: {
      phone: '+1 (555) 123-4567',
      email: 'reservations@plhms.luxury',
      address: 'Presidential Avenue, Luxury District',
      facebook: '#',
      instagram: '#',
      twitter: '#',
      linkedin: '#'
    }
  }, null, 2));
}

const readSettings = () => {
  try {
    return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
  } catch (e) {
    return { footer: {} };
  }
};

const writeSettings = (settings) => {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2));
};

// GET footer settings (public)
router.get('/footer', (req, res) => {
  try {
    const settings = readSettings();
    res.json(settings.footer || {});
  } catch (error) {
    res.status(500).json({ error: 'Failed to get footer settings' });
  }
});

export default router;
