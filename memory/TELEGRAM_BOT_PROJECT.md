# Telegram Bot Project - NEW PROJECT

**Status**: INITIATED - Ready to build
**Created**: February 17, 2026
**Location**: `~/Projects/telegram-bot/`
**Purpose**: E-commerce checkout bot for Myanmar (alternative to Messenger bot)

---

## Why This Project Exists

The Facebook Messenger bot project (`~/Projects/messenger-bot/`) is **ON HOLD** due to Facebook's Business Verification requirement, which is not feasible for a small Myanmar online business without formal business documents.

**Solution**: Build equivalent functionality using Telegram Bot API, which requires NO verification and is 100% free.

---

## Planned Features (Same as Messenger Bot)

1. **Deep Link Integration**: Customer clicks "Place Order" on website → Redirected to Telegram bot with order ID
2. **Instant Order Display**: Bot detects customer arrival, fetches order from database, sends:
   - Welcome message
   - Product photos (one by one)
   - Order summary (items, shipping, total)
   - Delivery address
3. **Payment Options**: Interactive buttons for:
   - KBZ Pay
   - AYA Pay
   - Wave Pay
4. **Admin Handoff**: "Contact Admin" button to speak with human

---

## Technical Stack (Proposed)

- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Framework**: node-telegram-bot-api or telegraf
- **Database**: To be determined (MySQL, MongoDB, or simple JSON)
- **Deployment**: Render (free tier)
- **Integration**: Website button that generates `https://t.me/YourBot?start=ORDER_ID` links

---

## How It Works (Planned Flow)

```
1. Website: Customer clicks "Place Order" button
   ↓
2. Redirect: https://t.me/YourShopBot?start=ORDER_12345
   ↓
3. Telegram opens → Customer taps "START"
   ↓
4. Bot receives: /start ORDER_12345
   ↓
5. Bot fetches order from database
   ↓
6. Bot sends welcome + order details + buttons
   ↓
7. Customer selects payment method
   ↓
8. Bot sends payment account details
```

---

## Key Differences from Messenger Bot

| Aspect | Messenger Bot | Telegram Bot |
|--------|--------------|--------------|
| **Verification** | Required (Business verify + App Review) | NOT required |
| **Cost** | Free | Free |
| **User base (Myanmar)** | 15M+ users | 3-5M users |
| **Link format** | `m.me/page?ref=ORDER_ID` | `t.me/bot?start=ORDER_ID` |
| **API** | Facebook Graph API | Telegram Bot API |
| **Status** | ON HOLD (blocked) | READY TO BUILD |

---

## What I Need From User Before Building

1. **Database**: How will bot fetch order data?
   - Existing database/API?
   - Or create new simple system?

2. **Website Integration**: 
   - What platform is the website on?
   - Can add JavaScript to generate Telegram links?

3. **Bot Creation**:
   - User will create bot via BotFather
   - Or I provide instructions

4. **Images**: Where are product photos stored?

5. **Hosting**: Deploy to Render again?

---

## Relationship to Messenger Bot Project

**Messenger Bot**: 
- Status: ON HOLD (awaiting Business Verification - likely never)
- Location: `~/Projects/messenger-bot/`
- Code: Complete and deployed (but blocked)
- GitHub: https://github.com/gsjulian81-bot/messenger-bot

**Telegram Bot**:
- Status: READY TO BUILD
- Location: `~/Projects/telegram-bot/`
- Code: Not started
- Will reuse logic from Messenger Bot (adapted for Telegram API)

**Both projects should be preserved separately.**

---

## Next Steps

1. ☐ User confirms requirements
2. ☐ Decide on database solution
3. ☐ Create bot via BotFather
4. ☐ Build Telegram bot code
5. ☐ Deploy to Render
6. ☐ Test end-to-end flow
7. ☐ Integrate with website

---

*This project exists because Facebook blocked the original plan. Telegram provides immediate, free alternative.*
