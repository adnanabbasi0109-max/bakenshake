const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const env = require('./config/env');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const deliveryRoutes = require('./routes/delivery.routes');
const customCakeRoutes = require('./routes/custom-cake.routes');
const paymentRoutes = require('./routes/payment.routes');
const subscriptionPlanRoutes = require('./routes/subscription-plan.routes');
const subscriptionRoutes = require('./routes/subscription.routes');
const subscriptionDeliveryRoutes = require('./routes/subscription-delivery.routes');
const webhookRoutes = require('./routes/webhook.routes');

const app = express();

// Connect to MongoDB
connectDB();

// Webhook routes (needs raw body for signature verification — must be before express.json)
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRoutes);

// Middleware
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/delivery', deliveryRoutes);
app.use('/api/custom-cakes', customCakeRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/subscription-plans', subscriptionPlanRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/subscription-deliveries', subscriptionDeliveryRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Bake N\' Shake API is running', timestamp: new Date().toISOString() });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

module.exports = app;
