# Telegram Shop Bot - Project Memory

## Project Overview
**Name**: Telegram E-Commerce Bot for Myanmar  
**Location**: `~/Projects/telegram-bot/`  
**Status**: ✅ **READY TO DEPLOY** (Waiting for bot token)

## Purpose
Alternative to Facebook Messenger bot - provides e-commerce checkout flow via Telegram without business verification requirements.

## Key Differences from Messenger Bot
- ✅ **No business verification needed** - Works immediately
- ✅ **Free forever** - No monthly fees like ManyChat
- ✅ **Full database access** - Can connect to any database
- ✅ **Faster setup** - No App Review process
- ⚠️ **Smaller user base** in Myanmar compared to Facebook

## Customer Flow

### For New Customers (from website):
1. Customer clicks "Place Order" button on website
2. Redirected to: `https://t.me/BotUsername?start=ORDER_ID`
3. Customer taps "START" in Telegram
4. Bot instantly fetches order and sends:
   - Welcome message
   - Product photos (one by one)
   - Order summary
   - Action buttons (Make Payment / Contact Admin)

### For Existing Customers:
1. Customer sends message: `ORDER_12345`
2. Bot responds same way (no START button needed)

## Technical Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Telegraf (modern Telegram bot framework)
- **Storage**: JSON file (for testing) → Your database (production)
- **Deployment**: Render (free tier)

## Project Structure
```
telegram-bot/
├── src/
│   └── bot.ts              # Main bot logic
├── data/
│   └── orders.json         # Mock orders for testing
├── docs/                   # (will create when needed)
├── package.json
├── tsconfig.json
├── render.yaml             # Render deployment config
├── .env.example            # Environment variables template
└── README.md               # Setup instructions
```

## Features Implemented

### ✅ Core Features
- [x] Handle `/start ORDER_ID` (from website redirect)
- [x] Handle text messages like `ORDER_12345` (existing users)
- [x] Send product photos sequentially
- [x] Display order summary with formatting
- [x] Inline keyboard buttons (Make Payment / Contact Admin)
- [x] Payment method selection (KBZ Pay, AYA Pay, Wave Pay)
- [x] Payment details display
- [x] Admin contact notification
- [x] Help command
- [x] Error handling

### ✅ Technical Features
- [x] JSON storage for testing
- [x] TypeScript with type safety
- [x] Health check endpoint for Render
- [x] Graceful shutdown handling
- [x] Logging for debugging

## Mock Orders (for testing)

| Order ID | Customer | Items | Total |
|----------|----------|-------|-------|
| ORDER_12345 | Aung Kyaw | 2x T-Shirt, 1x Cap | 27,000 MMK |
| ORDER_TEST | Thidar Aye | 1x Traditional Shirt | 16,500 MMK |
| ORDER_99999 | Min Thu | 1x Dress, 1x Handbag | 45,500 MMK |

## Next Steps to Launch

### 1. Create Bot on Telegram
- Message @BotFather
- Send `/newbot`
- Get bot token
- Set bot username (e.g., @usa_collection_bot)

### 2. Configure Environment
```bash
cp .env.example .env
# Add BOT_TOKEN=your_token_here
```

### 3. Test Locally
```bash
npm install
npm run dev
# Test with /start ORDER_12345
```

### 4. Deploy to Render
```bash
git add .
git commit -m "Initial Telegram bot"
git push
# Connect to Render, add BOT_TOKEN env var, deploy
```

### 5. Add to Website (React)
Use the provided `TelegramOrderButton` component in README.md

## Website Integration

### React Component
Location: See README.md → Website Integration section

Usage:
```tsx
<TelegramOrderButton 
  orderId="ORDER_12345" 
  botUsername="usa_collection_bot" 
/>
```

This generates: `https://t.me/usa_collection_bot?start=ORDER_12345`

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BOT_TOKEN` | ✅ Yes | From @BotFather |
| `ADMIN_CHAT_ID` | ❌ No | For admin notifications |
| `PORT` | ❌ No | Render sets this automatically |

## Future Enhancements

- [ ] Connect to real database (MySQL/PostgreSQL)
- [ ] Add order status tracking
- [ ] Payment confirmation flow
- [ ] Multi-language support (Burmese)
- [ ] Admin dashboard
- [ ] Order analytics

## Comparison: Messenger vs Telegram Bots

| Feature | Messenger Bot | Telegram Bot |
|---------|---------------|--------------|
| **Status** | ⏸️ Blocked (needs verification) | ✅ Ready to deploy |
| **Cost** | Free | Free |
| **Setup Time** | 3-5 days (App Review) | 1 hour |
| **Myanmar Users** | 15M+ | 3-5M |
| **Database Access** | Full | Full |
| **Verification** | Business docs required | None |
| **Code Reuse** | - | 80% same logic |

## Important Notes

- Telegram bot is **complementary** to Messenger bot, not replacement
- Can run both simultaneously
- If Facebook approves later, you have both options
- Telegram users tend to be more tech-savvy (good for online shoppers)

## Related Projects

- **Messenger Bot**: `~/Projects/messenger-bot/` (paused, awaiting FB verification)
- **Telegram Bot**: `~/Projects/telegram-bot/` (this project, ready to deploy)

## Contact

Nay's Telegram: @naytoeaungg

---

**Created**: February 17, 2026  
**Status**: Ready for deployment  
**Next Action**: Get bot token from @BotFather and deploy
