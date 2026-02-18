# Telegram E-Commerce Bot

**Status**: 🚀 Ready to Build  
**Purpose**: E-commerce checkout bot for Myanmar (alternative to blocked Facebook Messenger bot)  
**Location**: `~/Projects/telegram-bot/`

---

## Why This Exists

The Facebook Messenger bot (`~/Projects/messenger-bot/`) is **ON HOLD** due to Facebook's Business Verification requirement, which requires formal business documents not available to small Myanmar online businesses.

**Telegram Bot = Same functionality, no verification, 100% free**

---

## Planned Features

- [ ] Deep link from website (`t.me/bot?start=ORDER_ID`)
- [ ] Instant order fetch from database
- [ ] Send product photos sequentially
- [ ] Display order summary (items, shipping, total)
- [ ] Interactive payment buttons (KBZ Pay, AYA Pay, Wave Pay)
- [ ] Admin contact button

---

## Customer Flow

```
1. Website: Customer clicks "Place Order"
   ↓
2. Opens Telegram with pre-filled order ID
   ↓
3. Customer taps "START"
   ↓
4. Bot sends welcome + order details
   ↓
5. Customer selects payment method
   ↓
6. Bot sends payment account details
```

---

## Tech Stack (Plposed)

- Node.js 20 + TypeScript
- node-telegram-bot-api or telegraf
- Database: TBD (MySQL, MongoDB, or JSON)
- Deployment: Render (free tier)

---

## Project Structure

```
telegram-bot/
├── src/
│   └── bot.ts           # Main bot logic
├── docs/                # Documentation
├── memory/              # Project memory
└── package.json
```

---

## Status

Waiting for user confirmation to start building.

See `memory/TELEGRAM_BOT_PROJECT.md` for full details.

---

## Related Project

- **Facebook Messenger Bot**: `~/Projects/messenger-bot/` (ON HOLD)
- **Telegram Bot**: `~/Projects/telegram-bot/` (THIS PROJECT - ACTIVE)
