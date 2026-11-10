const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
const PORT = process.env.PORT || 3000;
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

// База цен на сервере (защита от подмены цен)
const PRODUCTS_DB = {
  1: { name: 'Espresso Craft Cappuccino', price: 28000 },
  2: { name: 'Flat White Specialty', price: 32000 },
  3: { name: 'Karamel Raf Mualliflik', price: 35000 },
  4: { name: 'Muzli Americano', price: 26000 },
  5: { name: 'Bumble Coffee (Apelsin)', price: 34000 },
  6: { name: 'Yapon Matcha Latte', price: 36000 },
  7: { name: 'San Sebastian Tiramisu', price: 32000 },
  8: { name: 'Fransuz Sariyog\'li Kruassan', price: 22000 },
  9: { name: 'Shokoladli Muffins', price: 28000 }
};

app.use(express.json());
app.use(cors());
app.use(express.static('public'));

// Rate limiting (Защита от спама)
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Слишком много запросов. Попробуйте позже.' }
});

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

app.post('/api/order', orderLimiter, async (req, res) => {
  try {
    const { name, phone, fulfillment, address, comment, cart } = req.body;

    if (!name || !phone || !cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ success: false, message: 'Неверные данные заказа.' });
    }

    if (fulfillment === 'delivery' && (!address || address.trim() === '')) {
      return res.status(400).json({ success: false, message: 'Укажите адрес доставки.' });
    }

    let calculatedTotal = 0;
    const orderItemsText = [];

    for (const item of cart) {
      const product = PRODUCTS_DB[item.id];
      if (!product) {
        return res.status(400).json({ success: false, message: `Товар с ID ${item.id} не найден.` });
      }
      const qty = parseInt(item.quantity) || 1;
      const itemSubtotal = product.price * qty;
      calculatedTotal += itemSubtotal;

      orderItemsText.push(`• <b>${escapeHtml(product.name)}</b> × ${qty} (${itemSubtotal.toLocaleString()} UZS)`);
    }

    const orderId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const dateStr = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Tashkent' });

    const telegramMessage = 
`☕ <b>НОВЫЙ ЗАКАЗ — ESPRESSO CRAFT</b>
<b>Order ID:</b> #${orderId}

👤 <b>КЛИЕНТ:</b>
<b>Имя:</b> ${escapeHtml(name)}
<b>Телефон:</b> ${escapeHtml(phone)}

🛒 <b>ЗАКАЗ:</b>
${orderItemsText.join('\n')}

🚚 <b>ДОСТАВКА:</b>
<b>Тип:</b> ${fulfillment === 'delivery' ? '🚗 Доставка' : '🏃 Самовывоз'}
${fulfillment === 'delivery' ? `<b>Адрес:</b> ${escapeHtml(address)}` : ''}

💬 <b>КОММЕНТАРИЙ:</b>
${escapeHtml(comment || '—')}

💰 <b>ИТОГО К ОПЛАТЕ:</b> ${calculatedTotal.toLocaleString()} UZS
⏰ <b>Дата:</b> ${dateStr}`;

    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
      console.warn('⚠️ BOT_TOKEN или ADMIN_CHAT_ID не заполнены в .env');
      return res.json({ 
        success: true, 
        orderId, 
        warning: 'Заказ зарегистрирован, но данные бота не указаны в .env' 
      });
    }

    const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const tgResponse = await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: ADMIN_CHAT_ID,
        text: telegramMessage,
        parse_mode: 'HTML'
      })
    });

    const tgData = await tgResponse.json();

    if (!tgData.ok) {
      console.error('Ошибка Telegram API:', tgData);
      return res.status(500).json({ success: false, message: 'Не удалось отправить сообщение в Telegram.' });
    }

    return res.json({ success: true, orderId });

  } catch (err) {
    console.error('Ошибка сервера:', err);
    return res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера.' });
  }
});

app.listen(PORT, () => {
  console.log(`☕ Сервер Espresso Craft запущен по адресу: http://localhost:${PORT}`);
});