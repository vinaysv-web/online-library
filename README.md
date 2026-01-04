# 📚 Lumi Library - Full Stack Online Library System

A comprehensive **full-stack online library management system** built with Node.js, Express, and MongoDB. This application provides a complete solution for managing digital books, user accounts, subscriptions, and admin controls with a modern black and blue interface.

## 🧠 Overview

Lumi Library is a full-stack web application that enables users to browse, read, and manage digital books. The system includes user authentication, subscription management, book search and filtering, and a comprehensive admin dashboard for content management.

## 📁 Project Structure

```
book/
├── client/                    # Frontend files
│   ├── index.html            # Homepage
│   ├── login.html            # User login
│   ├── signup.html           # User signup
│   ├── admin-login.html      # Admin login
│   ├── admin-dashboard.html  # Admin dashboard
│   ├── admin-users.html      # User management
│   ├── admin-books.html      # Book management
│   ├── admin-subscriptions.html # Subscription management
│   ├── admin-reports.html    # Reports and analytics
│   ├── admin-settings.html   # System settings
│   ├── browse.html           # Browse books
│   ├── book-details.html     # Book details
│   ├── my-books.html         # User's personal library
│   ├── subscription.html     # Subscription plans
│   ├── payment.html          # Payment processing
│   ├── contact.html          # Contact page
│   ├── css/                  # Stylesheets
│   ├── js/                   # JavaScript files
│   ├── images/               # Image assets
│   └── pdfs/                 # PDF samples
├── server/                   # Backend files
│   ├── server.js             # Main server file
│   ├── models/               # Database models
│   │   ├── User.js           # User model
│   │   ├── Book.js           # Book model
│   │   └── Subscription.js   # Subscription model
│   ├── seed.js               # Database seed script
│   └── routes/               # API routes (to be added)
├── database/                 # Database schema (to be added)
├── screenshots/              # Project screenshots
├── package.json              # Node.js dependencies
├── package-lock.json         # Dependency lock file
└── README.md                 # Project documentation
```

## ✨ Features

### User Features
* User authentication (signup/login)
* Browse and search books
* View book details and samples
* Add books to wishlist
* Leave reviews and ratings
* Subscription management
* Personal book library
* Payment processing

### Admin Features
* Complete user management
* Book management (add, edit, delete)
* Subscription management
* Reports and analytics
* System configuration
* Role-based access control

### Technical Features
* RESTful API architecture
* JWT-based authentication
* MongoDB database integration
* Responsive web design
* Input validation and sanitization
* Error handling and logging

## 🔧 Tech Stack

### Frontend
* **HTML5** - Semantic markup
* **CSS3** - Responsive styling
* **JavaScript (ES6+)** - Client-side logic
* **Font Awesome** - Icons

### Backend
* **Node.js** - Runtime environment
* **Express.js** - Web framework
* **MongoDB** - NoSQL database
* **Mongoose** - ODM
* **JSON Web Tokens (JWT)** - Authentication
* **Bcrypt** - Password hashing
* **Dotenv** - Environment variables

## 🚀 How to Run

### Prerequisites
* Node.js (v14 or higher)
* MongoDB (local or cloud instance)

### Setup

1. Clone the repository:

```bash
git clone https://github.com/vinaysv-web/lumi-library.git
cd lumi-library
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory with the following content:

```env
MONGODB_URI=mongodb://localhost:27017/lumi-library
JWT_SECRET=your_jwt_secret_key_here
SESSION_SECRET=your_session_secret_here
PORT=3000
```

4. Seed the database with sample data:

```bash
node server/seed.js
```

5. Start the server:

```bash
npm start
```

6. Open your browser and navigate to `http://localhost:3000`

## 🧪 API Endpoints

### Authentication
* `POST /api/auth/register` - Register a new user
* `POST /api/auth/login` - Login user
* `GET /api/auth/profile` - Get user profile

### Books
* `GET /api/books` - Get all books (with optional category and search filters)
* `GET /api/books/:id` - Get book by ID
* `POST /api/books/reviews/:bookId` - Add review to book

### Users
* `POST /api/users/wishlist` - Add book to wishlist
* `GET /api/users/wishlist` - Get user wishlist
* `DELETE /api/users/wishlist/:bookId` - Remove book from wishlist

### Subscriptions
* `POST /api/subscriptions` - Create subscription
* `GET /api/subscriptions` - Get user subscription

### Admin
* `GET /api/admin/users` - Get all users
* `GET /api/admin/books` - Get all books
* `POST /api/admin/books` - Add new book
* `PUT /api/admin/books/:id` - Update book
* `DELETE /api/admin/books/:id` - Delete book
* `GET /api/admin/subscriptions` - Get all subscriptions
* `DELETE /api/admin/subscriptions/:id` - Delete subscription
* `PUT /api/users/:id/role` - Update user role
* `DELETE /api/users/:id` - Delete user

## 📸 Screenshots

![Home Page](screenshots/home.png)
![Login Page](screenshots/login.png)
![Browse Books](screenshots/browse.png)
![Admin Dashboard](screenshots/admin.png)
![Book Details](screenshots/book-details.png)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Vinay SV**

LinkedIn: [https://www.linkedin.com/in/vinay-sv-726736313](https://www.linkedin.com/in/vinay-sv-726736313)

GitHub: [https://github.com/vinaysv-web](https://github.com/vinaysv-web)

## 🐛 Known Issues

* Some UI elements may need refinement for mobile responsiveness
* Payment integration is simulated (not connected to real payment processor)

## 🚀 Future Enhancements

* Advanced search and filtering
* Book reading progress tracking
* Email notifications
* Advanced admin analytics
* Social sharing features
* Advanced user profiles

---

> *Lumi Library - Your digital gateway to knowledge and literature* 📖✨
