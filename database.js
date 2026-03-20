const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const DB_PATH = path.join(dataDir, 'db.json');

// ═══════════════════════════════════════
//  기본 데이터 (시드)
// ═══════════════════════════════════════
const DEFAULT_DATA = {
  users: [
    { id: 'soyoung', name: '임소영', dept: '쇼핑몰운영파트', color: '#ff8f00', initial: '소' },
    { id: 'seulgi', name: '박슬기', dept: '쇼핑몰운영파트', color: '#795548', initial: '슬' },
    { id: 'jiwon', name: '이지원', dept: '쇼핑몰운영파트', color: '#155940', initial: '지' },
  ],
  timesales: [],
  templates: [],
  _counters: { timesales: 0, templates: 0 }
};

// ═══════════════════════════════════════
//  JSON DB 클래스
// ═══════════════════════════════════════
class JsonDB {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = this._load();
  }

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, 'utf-8');
        const data = JSON.parse(raw);
        // 새 필드 병합
        for (const key of Object.keys(DEFAULT_DATA)) {
          if (!(key in data)) data[key] = DEFAULT_DATA[key];
        }
        return data;
      }
    } catch (e) {
      console.error('DB 로드 실패:', e.message);
    }
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }

  _save() {
    fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
  }

  getAll(collection) {
    return this.data[collection] || [];
  }

  getById(collection, id) {
    return this.getAll(collection).find(item => item.id === id);
  }

  create(collection, item) {
    if (!this.data._counters[collection]) this.data._counters[collection] = 0;
    this.data._counters[collection]++;
    item.id = this.data._counters[collection];
    item.createdAt = new Date().toISOString();
    item.updatedAt = new Date().toISOString();
    this.data[collection].push(item);
    this._save();
    return item;
  }

  update(collection, id, updates) {
    const items = this.getAll(collection);
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) return null;
    items[idx] = { ...items[idx], ...updates, updatedAt: new Date().toISOString() };
    this._save();
    return items[idx];
  }

  delete(collection, id) {
    const items = this.getAll(collection);
    const idx = items.findIndex(item => item.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    this._save();
    return true;
  }
}

module.exports = new JsonDB(DB_PATH);
