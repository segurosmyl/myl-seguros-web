/* ============================================================
   sheets-client.js — Google Sheets CSV Client con caché
   Consultores M&L Seguros
   ============================================================ */

const SHEET_ID = '1t6ixz8gSDM2Yg14NggwuNru7Mid2npAR9AaxOvkccgc';

class SheetsClient {
  constructor() {
    this.cache = {};
    this.cacheTime = 5 * 60 * 1000; // 5 minutos
  }

  async fetchSheet(sheetName) {
    const now = Date.now();
    const cached = this.cache[sheetName];
    if (cached && (now - cached.time) < this.cacheTime) {
      return cached.data;
    }
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const csv = await response.text();
      const data = this.parseCSV(csv);
      this.cache[sheetName] = { data, time: now };
      return data;
    } catch (err) {
      console.warn(`[SheetsClient] Error fetching ${sheetName}:`, err);
      return cached ? cached.data : [];
    }
  }

  parseCSV(csv) {
    const lines = csv.split('\n').filter(l => l.trim());
    if (!lines.length) return [];
    const headers = this.parseCSVLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, ''));
    return lines.slice(1).map(line => {
      const values = this.parseCSVLine(line);
      const obj = {};
      headers.forEach((h, i) => {
        obj[h] = (values[i] || '').trim().replace(/^"|"$/g, '');
      });
      return obj;
    }).filter(row => Object.values(row).some(v => v));
  }

  parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        result.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    result.push(current);
    return result;
  }

  async getProducts(filters = {}) {
    const all = await this.fetchSheet('Products');
    return all.filter(p => {
      const active = p.is_active === 'TRUE' || p.is_active === '1' || p.is_active === 'true';
      if (!active) return false;
      if (filters.menu_subcategory && p.menu_subcategory !== filters.menu_subcategory) return false;
      if (filters.menu_category && p.menu_category !== filters.menu_category) return false;
      return true;
    });
  }

  async getCarriers() {
    return await this.fetchSheet('Carriers');
  }

  async getSubcategories() {
    return await this.fetchSheet('Subcategories');
  }

  parseBenefits(str) {
    if (!str) return [];
    str = str.trim();
    // Intenta parsear como JSON
    try {
      const cleaned = str.replace(/^'|'$/g, '').replace(/'/g, '"');
      const parsed = JSON.parse(cleaned);
      if (Array.isArray(parsed)) return parsed.filter(Boolean);
    } catch {}
    // Fallback: separado por comas o punto y coma
    return str
      .split(/[,;]/)
      .map(b => b.trim().replace(/^["'\[]+|["'\]]+$/g, '').trim())
      .filter(Boolean);
  }
}

window.sheetsClient = new SheetsClient();
