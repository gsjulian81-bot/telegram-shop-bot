import { Telegraf, Context, Markup } from 'telegraf';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';

// ============================================================
// CONFIGURATION
// ============================================================
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID || '1636477527'; // Your admin chat ID

// Store conversation mappings (customer -> admin message ID)
const conversationMap = new Map<string, number>(); // customerChatId -> adminMessageId
const adminMessageMap = new Map<number, string>(); // adminMessageId -> customerChatId

// ============================================================
// TYPES
// ============================================================
interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image: string;
}

interface PaymentMethod {
  name: string;
  details: string;
}

interface Order {
  orderId: string;
  customerName: string;
  items: OrderItem[];
  shippingFee: number;
  deliveryAddress: string;
  total: number;
  currency: string;
  paymentMethods: PaymentMethod[];
}

// ============================================================
// DATABASE (JSON Storage for Testing)
// ============================================================
const DATA_FILE = path.join(__dirname, '..', 'data', 'orders.json');

function loadOrders(): Record<string, Order> {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error loading orders:', error);
    return {};
  }
}

function getOrder(orderId: string): Order | null {
  const orders = loadOrders();
  return orders[orderId] || null;
}

// ============================================================
// BOT INITIALIZATION
// ============================================================
const bot = new Telegraf(BOT_TOKEN);

// ============================================================
// HELPER FUNCTIONS
// ============================================================

// Format order summary
function formatOrderSummary(order: Order): string {
  let summary = `🛒 *Order Summary*\n\n`;
  summary += `📋 Order ID: \`${order.orderId}\`\n`;
  summary += `👤 Customer: ${order.customerName}\n\n`;
  
  order.items.forEach((item, index) => {
    summary += `${index + 1}. ${item.name} x${item.qty} — ${(item.price * item.qty).toLocaleString()} ${order.currency}\n`;
  });
  
  summary += `\n📦 Shipping Fee: ${order.shippingFee.toLocaleString()} ${order.currency}\n`;
  summary += `📍 Delivery Address:\n${order.deliveryAddress}\n`;
  summary += `\n💰 *Total: ${order.total.toLocaleString()} ${order.currency}*`;
  
  return summary;
}

// Delay function for sequential photo sending
function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================
// MAIN ORDER FLOW
// ============================================================

async function handleOrderFlow(ctx: Context, orderId: string) {
  const chatId = ctx.chat?.id;
  if (!chatId) return;

  console.log(`🛒 Processing order: ${orderId} for chat: ${chatId}`);

  // Get order from database
  const order = getOrder(orderId);
  
  if (!order) {
    await ctx.reply(
      '❌ *Order Not Found*\n\n' +
      'Sorry, I could not find your order. Please check your order ID and try again.\n\n' +
      'Example: `ORDER_12345`',
      { parse_mode: 'Markdown' }
    );
    return;
  }

  // Step 1: Send welcome message
  await ctx.reply(
    `👋 Hello ${order.customerName}!\n\n` +
    `I found your order! Let me show you what you ordered...`,
    { parse_mode: 'Markdown' }
  );

  // Step 2: Send item photos one by one
  console.log('📸 Sending item photos...');
  
  for (const item of order.items) {
    try {
      await ctx.replyWithPhoto(item.image, {
        caption: `${item.name}\nQty: ${item.qty} | Price: ${item.price.toLocaleString()} ${order.currency} each`
      });
      await delay(500); // Small delay between photos
    } catch (error) {
      console.error('❌ Error sending photo:', error);
      // Continue even if one photo fails
    }
  }

  // Step 3: Send order summary
  console.log('📝 Sending order summary...');
  await delay(500);
  
  const summary = formatOrderSummary(order);
  
  await ctx.reply(summary, {
    parse_mode: 'Markdown'
  });

  // Step 4: Send action buttons
  console.log('🔘 Sending action buttons...');
  await delay(500);
  
  await ctx.reply(
    'What would you like to do next?',
    Markup.inlineKeyboard([
      [Markup.button.callback('💳 Make Payment', `pay_${order.orderId}`)],
      [Markup.button.callback('👤 Contact Admin', `admin_${order.orderId}`)]
    ])
  );

  console.log(`✅ Order flow completed for: ${orderId}`);
}

// ============================================================
// BOT COMMANDS & HANDLERS
// ============================================================

// Start command - handles /start ORDER_ID (from website redirect)
bot.command('start', async (ctx) => {
  const messageText = ctx.message?.text || '';
  const parts = messageText.split(' ');
  
  console.log('📥 Received /start:', messageText);
  
  if (parts.length > 1) {
    // Has order ID: /start ORDER_12345
    const orderId = parts[1];
    await handleOrderFlow(ctx, orderId);
  } else {
    // No order ID - show welcome message
    await ctx.reply(
      '👋 *Welcome to USA Collection!*\n\n' +
      'I can help you with your orders.\n\n' +
      'To check your order, simply send me your order ID (e.g., `ORDER_12345`) or click the link from our website.',
      { parse_mode: 'Markdown' }
    );
  }
});

// Handle text messages (for existing conversations)
bot.on('text', async (ctx) => {
  const text = ctx.message?.text?.trim() || '';
  
  console.log('💬 Received text:', text);
  
  // Check if message is an order ID (ORDER_XXX or starts with ORDER)
  const orderMatch = text.match(/^(ORDER_)?([A-Z0-9_]+)$/i);
  
  if (orderMatch) {
    // Normalize order ID
    const orderId = text.toUpperCase().startsWith('ORDER_') 
      ? text.toUpperCase() 
      : `ORDER_${text.toUpperCase()}`;
    
    await handleOrderFlow(ctx, orderId);
  } else if (text.toLowerCase() === 'help' || text.toLowerCase() === 'start') {
    await ctx.reply(
      '👋 *Need Help?*\n\n' +
      'Just send me your order ID (like `ORDER_12345`) to check your order status.\n\n' +
      'Or click the order link from our website to view your order details instantly.',
      { parse_mode: 'Markdown' }
    );
  } else {
    // Unknown message
    await ctx.reply(
      "I didn't understand that. 😊\n\n" +
      'Send your order ID (like `ORDER_12345`) to check your order, or send "HELP" for assistance.',
      { parse_mode: 'Markdown' }
    );
  }
});

// Handle "Make Payment" button
bot.action(/pay_(.+)/, async (ctx) => {
  const orderId = ctx.match[1];
  console.log('💳 Payment requested for:', orderId);
  
  const order = getOrder(orderId);
  
  if (!order) {
    await ctx.answerCbQuery('Order not found');
    return;
  }

  // Show payment method options
  const paymentButtons = order.paymentMethods.map(pm => [
    Markup.button.callback(pm.name, `method_${orderId}_${pm.name.replace(/\s+/g, '_')}`)
  ]);

  await ctx.answerCbQuery();
  await ctx.reply(
    '💳 *Select Payment Method*\n\n' +
    `Total to pay: *${order.total.toLocaleString()} ${order.currency}*\n\n` +
    'Choose your preferred payment method below:',
    {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(paymentButtons)
    }
  );
});

// Handle payment method selection
bot.action(/method_(ORDER_[A-Z0-9_]+)_(.+)/, async (ctx) => {
  const orderId = ctx.match[1];
  const methodName = ctx.match[2].replace(/_/g, ' ');
  
  console.log(`💰 Payment method selected: ${methodName} for ${orderId}`);
  
  const order = getOrder(orderId);
  
  if (!order) {
    await ctx.answerCbQuery('Order not found');
    return;
  }

  const paymentMethod = order.paymentMethods.find(pm => pm.name === methodName);
  
  if (!paymentMethod) {
    await ctx.answerCbQuery('Payment method not found');
    return;
  }

  await ctx.answerCbQuery();
  
  await ctx.reply(
    `💳 *${paymentMethod.name} Payment Details*\n\n` +
    `${paymentMethod.details}\n\n` +
    `💰 *Amount to pay: ${order.total.toLocaleString()} ${order.currency}*\n\n` +
    'After payment, please send a screenshot of your payment confirmation here.\n\n' +
    'Thank you! 🙏',
    { parse_mode: 'Markdown' }
  );
});

// Handle "Contact Admin" button
bot.action(/admin_(.+)/, async (ctx) => {
  const orderId = ctx.match[1];
  const user = ctx.from;
  
  console.log('👤 Admin contact requested for order:', orderId);
  
  await ctx.answerCbQuery();
  
  await ctx.reply(
    '👋 *Contacting Admin...*\n\n' +
    'Our admin will be with you shortly!\n\n' +
    'Please feel free to describe your question while you wait. 😊\n\n' +
    `📦 *Reference:* \`${orderId}\``,
    { parse_mode: 'Markdown' }
  );

  // Forward entire conversation to admin
  if (ADMIN_CHAT_ID) {
    try {
      const customerChatId = ctx.chat?.id.toString() || '';
      
      // Forward order details to admin
      const adminMsg = await ctx.telegram.sendMessage(
        ADMIN_CHAT_ID,
        `🚨 *Customer Needs Help*\n\n` +
        `📦 Order: \`${orderId}\`\n` +
        `👤 Customer: ${user?.first_name} ${user?.last_name || ''}\n` +
        `📱 Username: @${user?.username || 'N/A'}\n` +
        `🆔 Chat ID: \`${customerChatId}\`\n\n` +
        `💬 *Reply to this message to respond to the customer*`,
        { parse_mode: 'Markdown' }
      );
      
      // Store mapping for reply routing
      if (adminMsg.message_id) {
        conversationMap.set(customerChatId, adminMsg.message_id);
        adminMessageMap.set(adminMsg.message_id, customerChatId);
        console.log(`🔗 Linked customer ${customerChatId} to admin message ${adminMsg.message_id}`);
      }
      
      // Also forward the order info so admin has context
      const order = getOrder(orderId);
      if (order) {
        await ctx.telegram.sendMessage(
          ADMIN_CHAT_ID,
          `📋 *Order Details for Reference:*\n\n` +
          formatOrderSummary(order),
          { parse_mode: 'Markdown' }
        );
      }
      
    } catch (error) {
      console.error('❌ Failed to notify admin:', error);
    }
  }
});

// Handle admin replies (when admin replies to a forwarded customer message)
bot.on('message', async (ctx) => {
  // Only process messages from admin
  if (ctx.chat?.id.toString() !== ADMIN_CHAT_ID) return;
  
  const message = ctx.message;
  if (!message || !('text' in message)) return; // Only handle text messages from admin
  
  // Check if this is a reply to a customer conversation
  const replyToMessage = message.reply_to_message;
  if (!replyToMessage) return;
  
  const repliedToId = replyToMessage.message_id;
  const customerChatId = adminMessageMap.get(repliedToId);
  
  const adminText = message.text;
  
  if (!customerChatId) {
    // Check if it's a reply to the order details message
    // We need to find the parent message
    for (const [adminMsgId, custId] of adminMessageMap.entries()) {
      if (Math.abs(adminMsgId - repliedToId) <= 2) { // Within 2 messages
        console.log(`📨 Admin replied to related message, routing to customer ${custId}`);
        
        try {
          await ctx.telegram.sendMessage(
            custId,
            `👤 *Admin:*\n${adminText}`,
            { parse_mode: 'Markdown' }
          );
          
          // Confirm to admin
          await ctx.reply('✅ Message sent to customer!');
          console.log(`✅ Admin reply forwarded to customer ${custId}`);
        } catch (error) {
          console.error('❌ Failed to forward admin reply:', error);
          await ctx.reply('❌ Failed to send message to customer');
        }
        return;
      }
    }
    return;
  }
  
  // Forward admin's reply to customer
  try {
    await ctx.telegram.sendMessage(
      customerChatId,
      `👤 *Admin:*\n${adminText}`,
      { parse_mode: 'Markdown' }
    );
    
    // Confirm to admin
    await ctx.reply('✅ Message sent to customer!');
    console.log(`✅ Admin reply forwarded to customer ${customerChatId}`);
  } catch (error) {
    console.error('❌ Failed to forward admin reply:', error);
    await ctx.reply('❌ Failed to send message to customer');
  }
});

// ============================================================
// ERROR HANDLING
// ============================================================

bot.catch((err, ctx) => {
  console.error('❌ Bot error:', err);
  ctx.reply('Sorry, something went wrong. Please try again later. 😔');
});

// ============================================================
// START BOT
// ============================================================

console.log('🚀 Starting Telegram Shop Bot...');

if (BOT_TOKEN === 'YOUR_BOT_TOKEN_HERE') {
  console.error('❌ ERROR: Please set your BOT_TOKEN environment variable!');
  console.log('Get your token from @BotFather on Telegram');
  process.exit(1);
}

bot.launch()
  .then(() => {
    console.log('✅ Bot is running!');
    console.log('');
    console.log('📖 Test with:');
    console.log('  1. /start ORDER_12345');
    console.log('  2. ORDER_12345');
    console.log('  3. ORDER_TEST');
    console.log('');
    console.log('🔗 Or use deep link:');
    console.log(`  https://t.me/${BOT_TOKEN.split(':')[0]}?start=ORDER_12345`);
  })
  .catch((err) => {
    console.error('❌ Failed to start bot:', err);
  });

// Health check server for Render
const PORT = process.env.PORT || 3000;
http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      bot: 'running',
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      message: 'Telegram Shop Bot is running!',
      bot: '@usa_collection_bot',
      timestamp: new Date().toISOString()
    }));
  }
}).listen(PORT, () => {
  console.log(`🌐 Health check server running on port ${PORT}`);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
