const express = require('express');
const router = express.Router();
const db = require('../database');

// 타임세일 목록 조회
router.get('/', (req, res) => {
  const items = db.getAll('timesales');
  res.json(items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// 타임세일 단건 조회
router.get('/:id', (req, res) => {
  const item = db.getById('timesales', parseInt(req.params.id));
  if (!item) return res.status(404).json({ error: '찾을 수 없습니다' });
  res.json(item);
});

// 타임세일 생성
router.post('/', (req, res) => {
  const { productCode, productName, purchasePrice, sellingPrice, quantity, saleDate, createdBy } = req.body;

  if (!productName || !purchasePrice || !sellingPrice) {
    return res.status(400).json({ error: '상품명, 입고가, 조합원가는 필수입니다' });
  }

  const item = db.create('timesales', {
    productCode: productCode || '',
    productName,
    purchasePrice: Number(purchasePrice),
    sellingPrice: Number(sellingPrice),
    quantity: Number(quantity) || 0,
    saleDate: saleDate || new Date().toISOString().split('T')[0],
    createdBy: createdBy || 'unknown',
    priceSettings: null,
    promoTexts: [],
    status: 'draft'
  });

  res.status(201).json(item);
});

// 가격 세팅 저장
router.put('/:id/price', (req, res) => {
  const { purchasePriceDiscount, cooperativeMargin, priceSettings } = req.body;
  const item = db.update('timesales', parseInt(req.params.id), { priceSettings, purchasePriceDiscount, cooperativeMargin });
  if (!item) return res.status(404).json({ error: '찾을 수 없습니다' });
  res.json(item);
});

// 홍보 문구 저장
router.put('/:id/promo', (req, res) => {
  const { promoTexts } = req.body;
  const item = db.update('timesales', parseInt(req.params.id), { promoTexts });
  if (!item) return res.status(404).json({ error: '찾을 수 없습니다' });
  res.json(item);
});

// 상태 변경
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  const item = db.update('timesales', parseInt(req.params.id), { status });
  if (!item) return res.status(404).json({ error: '찾을 수 없습니다' });
  res.json(item);
});

// 삭제
router.delete('/:id', (req, res) => {
  const success = db.delete('timesales', parseInt(req.params.id));
  if (!success) return res.status(404).json({ error: '찾을 수 없습니다' });
  res.json({ success: true });
});

module.exports = router;
