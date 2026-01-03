// Lumi Library API Server
// Handles all API requests for the Lumi Library application

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'lumi-library-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(path.join(__dirname, '../public/css')));
app.use('/js', express.static(path.join(__dirname, '../public/js')));
app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/pdfs', express.static(path.join(__dirname, '../public/pdfs')));

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumi-library';

// Connect to MongoDB with error handling
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  console.log('Server will continue running without database connectivity');
});

// Gracefully handle database connection errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle Mongoose connection events
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected from database');
});



const User = require('./models/User');
const Book = require('./models/Book');
const Subscription = require('./models/Subscription');

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'lumi-library-jwt-secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Lumi Library API is running' });
});

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const user = new User({
      name,
      email,
      password: hashedPassword
    });
    
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'lumi-library-jwt-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'lumi-library-jwt-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        subscription: user.subscription
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all books
app.get('/api/books', async (req, res) => {
  try {
    const { category, search } = req.query;
    let filter = {};
    
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    
    const books = await Book.find(filter);
    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get book by ID
app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('reviews.user', 'name');
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Add book to wishlist
app.post('/api/users/wishlist', authenticateToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.wishlist.includes(bookId)) {
      user.wishlist.push(bookId);
      await user.save();
    }
    
    res.json({ message: 'Book added to wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Wishlist error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user wishlist
app.get('/api/users/wishlist', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('wishlist');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user.wishlist);
  } catch (error) {
    console.error('Get wishlist error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Remove book from wishlist
app.delete('/api/users/wishlist/:bookId', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.wishlist = user.wishlist.filter(bookId => bookId.toString() !== req.params.bookId);
    await user.save();
    
    res.json({ message: 'Book removed from wishlist', wishlist: user.wishlist });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Add review to book
app.post('/api/books/:bookId/reviews', authenticateToken, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const bookId = req.params.bookId;
    
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user already reviewed this book
    const existingReview = book.reviews.find(review => 
      review.user.toString() === req.user.userId.toString()
    );
    
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    
    // Add review
    book.reviews.push({
      user: req.user.userId,
      rating,
      comment
    });
    
    // Update average rating
    const totalRating = book.reviews.reduce((sum, review) => sum + review.rating, 0);
    book.rating = totalRating / book.reviews.length;
    
    await book.save();
    
    res.json({ message: 'Review added successfully', book });
  } catch (error) {
    console.error('Add review error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Create subscription
app.post('/api/subscriptions', authenticateToken, async (req, res) => {
  try {
    const { plan, amount } = req.body;
    
    const plans = {
      basic: { days: 30, price: 9.99 },
      premium: { days: 30, price: 14.99 },
      family: { days: 30, price: 19.99 }
    };
    
    if (!plans[plan]) {
      return res.status(400).json({ message: 'Invalid subscription plan' });
    }
    
    if (amount !== plans[plan].price) {
      return res.status(400).json({ message: 'Invalid amount for selected plan' });
    }
    
    // Create subscription
    const subscription = new Subscription({
      userId: req.user.userId,
      plan,
      expiryDate: new Date(Date.now() + plans[plan].days * 24 * 60 * 60 * 1000),
      amount,
      paymentId: `payment_${Date.now()}` // In real app, this would come from payment processor
    });
    
    await subscription.save();
    
    // Update user's subscription
    await User.findByIdAndUpdate(req.user.userId, {
      subscription: plan,
      subscriptionExpiry: subscription.expiryDate
    });
    
    res.json({ 
      message: 'Subscription created successfully', 
      subscription 
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user subscription
app.get('/api/subscriptions', authenticateToken, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ 
      userId: req.user.userId
    }).sort({ createdAt: -1 });
    
    if (!subscription) {
      return res.json({ subscription: null });
    }
    
    // Check if subscription is still valid (not expired)
    const isExpired = subscription.expiryDate && new Date() > new Date(subscription.expiryDate);
    
    res.json({ 
      subscription: {
        ...subscription.toObject(),
        isActive: !isExpired
      }
    });
  } catch (error) {
    console.error('Get subscription error:', error);
    // Check if it's a database connection error
    if (error.name === 'MongoError' || error.name === 'MongooseServerSelectionError' || error.message.includes('ECONNREFUSED')) {
      return res.status(500).json({ message: 'Database connection error. Please try again later.' });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // In a real app, this would save to a database or send an email
    console.log('Contact form submission:', { name, email, subject, message });
    
    // For now, just return success
    res.json({ message: 'Thank you for your message! We will get back to you soon.' });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Serve frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve other HTML pages
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/signup.html'));
});

app.get('/browse', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/browse.html'));
});

app.get('/book-details', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/book-details.html'));
});

app.get('/my-books', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/my-books.html'));
});

app.get('/subscription', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/subscription.html'));
});

app.get('/payment', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/payment.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/contact.html'));
});

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin-login.html'));
});

app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin-dashboard.html'));
});

app.get('/sample-reader', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/sample-reader.html'));
});

// Catch-all route for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});