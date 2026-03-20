const express = require('express');
const router = express.Router();
const db = require('../database');

// 로그인
router.post('/login', (req, res) => {
  const { userId } = req.body;
  const user = db.getById('users', userId);
  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
  res.cookie('userId', userId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
  res.json(user);
});

// 로그아웃
router.post('/logout', (req, res) => {
  res.clearCookie('userId');
  res.json({ success: true });
});

// 현재 사용자
router.get('/me', (req, res) => {
  const userId = req.cookies.userId;
  if (!userId) return res.status(401).json({ error: '로그인 필요' });
  const user = db.getById('users', userId);
  if (!user) return res.status(404).json({ error: '사용자를 찾을 수 없습니다' });
  res.json(user);
});

// 전체 사용자 목록
router.get('/users', (req, res) => {
  res.json(db.getAll('users'));
});

module.exports = router;
