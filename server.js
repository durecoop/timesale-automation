const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/timesale', require('./routes/timesale'));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

app.listen(PORT, () => {
  console.log(`서버 실행 중: http://localhost:${PORT}`);

  if (process.env.RENDER_EXTERNAL_URL) {
    const url = process.env.RENDER_EXTERNAL_URL + '/api/health';
    setInterval(() => {
      fetch(url).catch(() => {});
    }, 14 * 60 * 1000);
    console.log(`슬립 방지 활성화: ${url} (14분 간격)`);
  }
});
