# Telegram E-Commerce Bot for Myanmar

Telegram bot for e-commerce checkout with KBZPay, AYA Pay, and Wave Pay integration.

## 🚀 Features

- ✅ Order lookup via Telegram deep links (`https://t.me/YourBot?start=ORDER_ID`)
- ✅ Automatic order display with product photos
- ✅ Order summary with shipping and total
- ✅ Payment method selection (KBZ Pay, AYA Pay, Wave Pay)
- ✅ Admin contact button
- ✅ Works for both new and existing conversations

## 📱 Customer Flow

### For New Customers (from website):
1. Click "Place Order" on website
2. Redirected to Telegram
3. Tap "START"
4. Bot instantly shows order details

### For Existing Customers:
1. Just type order ID: `ORDER_12345`
2. Bot responds with full order details

## 🛠️ Setup Instructions

### Step 1: Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Start conversation and send `/newbot`
3. Follow prompts to create your bot
4. **Copy the bot token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env and add your bot token
BOT_TOKEN=your_actual_bot_token_here
ADMIN_CHAT_ID=your_telegram_chat_id  # Optional
```

### Step 3: Install & Run

```bash
# Install dependencies
npm install

# Run locally
npm run dev

# Or build and run
npm run build
npm start
```

### Step 4: Test

1. Open your bot in Telegram: `https://t.me/YourBotUsername`
2. Send: `/start ORDER_12345`
3. Or send: `ORDER_12345`

## 🔗 Website Integration (React + Vite)

Add this button to your React website:

```tsx
// components/TelegramOrderButton.tsx
import React from 'react';

interface TelegramOrderButtonProps {
  orderId: string;
  botUsername: string; // Your bot username without @
}

export const TelegramOrderButton: React.FC<TelegramOrderButtonProps> = ({ 
  orderId, 
  botUsername 
}) => {
  const telegramLink = `https://t.me/${botUsername}?start=${orderId}`;
  
  const handleClick = () => {
    // You can also track the click here
    console.log('Redirecting to Telegram for order:', orderId);
    window.open(telegramLink, '_blank');
  };

  return (
    <button 
      onClick={handleClick}
      style={{
        backgroundColor: '#0088cc',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.751-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.015 3.333-1.386 4.025-1.627 4.477-1.635.099-.002.321.023.465.141.121.1.155.235.171.33.015.093.034.307.019.473z"/>
      </svg>
      Place Order via Telegram
    </button>
  );
};

// Usage in your component:
// <TelegramOrderButton orderId="ORDER_12345" botUsername="YourShopBot" />
```

## 📊 Sample Orders (for testing)

| Order ID | Customer | Total | Items |
|----------|----------|-------|-------|
| ORDER_12345 | Aung Kyaw | 27,000 MMK | 2x T-Shirt, 1x Cap |
| ORDER_TEST | Thidar Aye | 16,500 MMK | 1x Traditional Shirt |
| ORDER_99999 | Min Thu | 45,500 MMK | 1x Dress, 1x Handbag |

## 🚀 Deployment

### Option 1: Render (Recommended)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect your GitHub repo
4. Add environment variable: `BOT_TOKEN`
5. Deploy!

The bot will run 24/7 on Render's free tier.

### Option 2: Local/Server

```bash
npm install
npm run build
BOT_TOKEN=your_token npm start
```

Use `pm2` or `systemd` to keep it running.

## 📝 Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `BOT_TOKEN` | ✅ Yes | Bot token from @BotFather |
| `ADMIN_CHAT_ID` | ❌ No | Your Telegram chat ID for admin notifications |

## 🔧 Customization

### Adding New Orders

Edit `data/orders.json`:

```json
{
  "ORDER_NEW": {
    "orderId": "ORDER_NEW",
    "customerName": "Customer Name",
    "items": [...],
    "shippingFee": 2000,
    "deliveryAddress": "Address",
    "total": 50000,
    "currency": "MMK",
    "paymentMethods": [...]
  }
}
```

### Connecting to Real Database

Replace the `loadOrders()` and `getOrder()` functions in `src/bot.ts` with your database queries:

```typescript
// Example with MySQL
async function getOrder(orderId: string): Promise<Order | null> {
  const [rows] = await db.execute('SELECT * FROM orders WHERE order_id = ?', [orderId]);
  return rows[0] || null;
}
```

## 🐛 Troubleshooting

### Bot not responding?
- Check if `BOT_TOKEN` is set correctly
- Check console for errors
- Make sure you're sending correct order format (ORDER_XXX)

### Photos not showing?
- Check if image URLs are accessible
- Try using HTTPS URLs
- Check console for photo send errors

### Website redirect not working?
- Make sure bot username is correct (without @)
- Order ID should not contain spaces
- URL format: `https://t.me/USERNAME?start=ORDER_ID`

## 📚 Learn More

- [Telegraf Documentation](https://telegraf.js.org/)
- [Telegram Bot API](https://core.telegram.org/bots/api)

## 🤝 Support

Need help? Check the console logs or contact admin through the bot!

---

**Made for Myanmar E-commerce** 🇲🇲
