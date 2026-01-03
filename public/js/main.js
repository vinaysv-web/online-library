// Lumi Library - Main JavaScript file
const API_BASE_URL = '/api';

// DOM ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initializeApp();
});

function initializeApp() {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize dynamic content
    initializeDynamicContent();
    
    // Initialize authentication state
    initializeAuthState();
    
    // Load books on browse page
    if (window.location.pathname.includes('browse.html')) {
        loadBooks();
    }
    
    // Load book details on book details page
    if (window.location.pathname.includes('book-details.html')) {
        loadBookDetails();
    }
    
    // Initialize subscription plan selection
    if (window.location.pathname.includes('subscription.html')) {
        initializeSubscriptionPlans();
    }
    
    // Initialize payment form
    if (window.location.pathname.includes('payment.html')) {
        initializePaymentForm();
    }
}

function initializeNavigation() {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('show');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('#mainNav a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                mainNav.classList.remove('show');
            });
        });
    }
}

function initializeDynamicContent() {
    // Category selection functionality
    const categoryCards = document.querySelectorAll('.category-card');
    if (categoryCards.length > 0) {
        categoryCards.forEach(card => {
            card.addEventListener('click', function() {
                const category = this.textContent.trim();
                filterBooksByCategory(category);
            });
        });
    }
    
    // Book card click functionality
    const bookCards = document.querySelectorAll('.book-card');
    if (bookCards.length > 0) {
        bookCards.forEach(card => {
            card.addEventListener('click', function() {
                const title = this.querySelector('h3')?.textContent;
                if (title) {
                    // Navigate to book details page
                    window.location.href = `book-details.html?book=${encodeURIComponent(title)}`;
                }
            });
        });
    }
    
    // Sample reader functionality
    const sampleBtns = document.querySelectorAll('#sampleBtn');
    if (sampleBtns.length > 0) {
        sampleBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                window.location.href = 'sample-reader.html';
            });
        });
    }
    
    // Subscription button functionality
    const subscribeBtns = document.querySelectorAll('#subscribeBtn');
    if (subscribeBtns.length > 0) {
        subscribeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                window.location.href = 'subscription.html';
            });
        });
    }
    
    // Wishlist button functionality
    const wishlistBtns = document.querySelectorAll('#wishlistBtn');
    if (wishlistBtns.length > 0) {
        wishlistBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                toggleWishlist(this);
            });
        });
    }
}

function initializeAuthState() {
    // Check if user is logged in and update UI accordingly
    const isLoggedIn = checkAuthStatus();
    
    // Update navigation based on auth status
    updateNavigationForAuth(isLoggedIn);
}

function checkAuthStatus() {
    // Check for authentication token in localStorage
    return localStorage.getItem('authToken') !== null;
}

function updateNavigationForAuth(isLoggedIn) {
    // Update navigation UI based on auth status
    if (isLoggedIn) {
        // Show user-specific links
        // Update header to show user info
    } else {
        // Show login/signup links
    }
}

function filterBooksByCategory(category) {
    // In a real app, this would fetch books from the backend
    console.log(`Filtering books by category: ${category}`);
    
    // For now, just show an alert
    alert(`Showing books in ${category} category`);
}

function toggleWishlist(button) {
    // Toggle wishlist state
    const bookCard = button.closest('.book-card');
    const title = bookCard?.querySelector('h3')?.textContent;
    
    if (title) {
        // In a real app, this would call the backend
        alert(`Book "${title}" added to your wishlist!`);
    }
}

// Form validation functions
function validateLoginForm(form) {
    const email = form.email.value.trim();
    const password = form.password.value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    return true;
}

function validateSignupForm(form) {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const confirmPassword = form.confirmPassword.value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return false;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    // Password strength validation
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return false;
    }
    
    return true;
}

// Event listeners for forms
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateLoginForm(this)) {
                handleLogin(this);
            }
        });
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateSignupForm(this)) {
                handleSignup(this);
            }
        });
    }
    
    // Contact form
    const contactForm = document.getElementById('messageForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateContactForm(this)) {
                handleContactSubmit(this);
            }
        });
    }
    
    // Review form
    const reviewForm = document.getElementById('reviewForm');
    if (reviewForm) {
        reviewForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateReviewForm(this)) {
                handleReviewSubmit(this);
            }
        });
    }
    
    // Payment form
    const paymentForm = document.getElementById('cardPaymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validatePaymentForm(this)) {
                handlePaymentSubmit(this);
            }
        });
    }
});

function handleLogin(form) {
    // Get form values
    const email = form.email.value;
    const password = form.password.value;
    
    // In a real app, this would send a request to the backend
    console.log('Login attempt:', { email, password });
    
    // Simulate login process
    simulateLogin(email, password);
}

function handleSignup(form) {
    // Get form values
    const name = form.name.value;
    const email = form.email.value;
    const password = form.password.value;
    
    // In a real app, this would send a request to the backend
    console.log('Signup attempt:', { name, email, password });
    
    // Simulate signup process
    simulateSignup(name, email, password);
}

function handleContactSubmit(form) {
    // Get form values
    const name = form.name.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;
    
    // In a real app, this would send a request to the backend
    console.log('Contact form submission:', { name, email, subject, message });
    
    // Simulate contact submission
    simulateContactSubmit(name, email, subject, message);
}

function handleReviewSubmit(form) {
    const rating = document.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('reviewText').value;
    
    if (!rating) {
        alert('Please select a rating');
        return;
    }
    
    if (!reviewText.trim()) {
        alert('Please write a review');
        return;
    }
    
    // In a real app, this would send a request to the backend
    console.log('Review submission:', { rating: rating.value, reviewText });
    
    // Simulate review submission
    simulateReviewSubmit(rating.value, reviewText);
}

function handlePaymentSubmit(form) {
    // Get form values
    const plan = form.subscriptionPlan.value;
    const cardName = form.cardName.value;
    const cardNumber = form.cardNumber.value.replace(/\s/g, '');
    const expiryDate = form.expiryDate.value;
    const cvv = form.cvv.value;
    
    // Validate
    if (!plan || !cardName || !cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all card details');
        return;
    }
    
    // In a real app, this would send a request to the backend
    console.log('Payment submission:', { plan, cardName, cardNumber, expiryDate, cvv });
    
    // Simulate payment process
    simulatePayment(plan, cardName, cardNumber, expiryDate, cvv);
}

function validateContactForm(form) {
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();
    
    if (!name || !email || !subject || !message) {
        alert('Please fill in all fields');
        return false;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address');
        return false;
    }
    
    return true;
}

function validateReviewForm(form) {
    const rating = document.querySelector('input[name="rating"]:checked');
    const reviewText = document.getElementById('reviewText').value;
    
    if (!rating) {
        alert('Please select a rating');
        return false;
    }
    
    if (!reviewText.trim()) {
        alert('Please write a review');
        return false;
    }
    
    return true;
}

function validatePaymentForm(form) {
    const plan = form.subscriptionPlan.value;
    const cardName = form.cardName.value;
    const cardNumber = form.cardNumber.value.replace(/\s/g, '');
    const expiryDate = form.expiryDate.value;
    const cvv = form.cvv.value;
    
    if (!plan || !cardName || !cardNumber || !expiryDate || !cvv) {
        alert('Please fill in all card details');
        return false;
    }
    
    // Card number validation
    if (cardNumber.length < 16) {
        alert('Please enter a valid card number');
        return false;
    }
    
    // Expiry date validation
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        alert('Please enter a valid expiry date (MM/YY)');
        return false;
    }
    
    // CVV validation
    if (cvv.length < 3) {
        alert('Please enter a valid CVV');
        return false;
    }
    
    return true;
}

// Simulated backend functions (will be replaced with actual API calls)
async function simulateLogin(email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Welcome back! Login successful');
            
            // Store auth token in localStorage
            localStorage.setItem('authToken', data.token);
            
            // Redirect to dashboard or home page
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed. Please try again.');
    }
}

async function simulateSignup(name, email, password) {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Account created successfully');
            
            // Store auth token in localStorage
            localStorage.setItem('authToken', data.token);
            
            // Redirect to dashboard or home page
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed. Please try again.');
    }
}

async function simulateContactSubmit(name, email, subject, message) {
    try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, subject, message }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(data.message || 'Thank you! Your message has been sent successfully.');
            
            // Reset form
            document.getElementById('messageForm').reset();
        } else {
            alert(data.message || 'Failed to send message. Please try again.');
        }
    } catch (error) {
        console.error('Contact form error:', error);
        alert('Failed to send message. Please try again.');
    }
}

function simulateReviewSubmit(rating, reviewText) {
    // In a real app, this would call the backend API
    // For now, simulate success
    alert('Thank you for your review!');
    
    // Reset form
    document.getElementById('reviewForm').reset();
}

async function simulatePayment(plan, cardName, cardNumber, expiryDate, cvv) {
    try {
        // In a real app, this would call a payment processor API
        // For this simulation, we'll call our backend API
        const token = localStorage.getItem('authToken');
        
        if (!token) {
            alert('Please log in to subscribe');
            window.location.href = 'login.html';
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                plan,
                amount: getPlanAmount(plan)
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Payment successful! Welcome to Lumi Library.');
            window.location.href = 'index.html';
        } else {
            alert(data.message || 'Payment failed');
        }
    } catch (error) {
        console.error('Payment error:', error);
        alert('Payment failed. Please try again.');
    }
}

function getPlanAmount(plan) {
    const plans = {
        'basic': 9.99,
        'premium': 14.99,
        'family': 19.99
    };
    return plans[plan] || 0;
}

// Add card number formatting
document.addEventListener('DOMContentLoaded', function() {
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formattedValue = '';
            
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) {
                    formattedValue += ' ';
                }
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry date input
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            
            e.target.value = value;
        });
    }
});

// Tab functionality for my-books.html
document.addEventListener('DOMContentLoaded', function() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length > 0) {
        tabBtns.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons and sections
                document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(section => section.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show corresponding section
                const tabId = this.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    
    // Remove book functionality
    const removeBtns = document.querySelectorAll('.remove-btn');
    if (removeBtns.length > 0) {
        removeBtns.forEach(button => {
            button.addEventListener('click', function() {
                const bookCard = this.closest('.book-card');
                const bookTitle = bookCard.querySelector('h3').textContent;
                if (confirm(`Are you sure you want to remove "${bookTitle}"?`)) {
                    bookCard.remove();
                    alert(`${bookTitle} removed successfully!`);
                }
            });
        });
    }
    
    // Add to library functionality
    const addToLibraryBtns = document.querySelectorAll('#wishlist .btn:first-child');
    if (addToLibraryBtns.length > 0) {
        addToLibraryBtns.forEach(button => {
            button.addEventListener('click', function() {
                const bookCard = this.closest('.book-card');
                const bookTitle = bookCard.querySelector('h3').textContent;
                alert(`${bookTitle} added to your library!`);
            });
        });
    }
});

// Page navigation for sample reader
document.addEventListener('DOMContentLoaded', function() {
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    
    if (prevPageBtn && nextPageBtn) {
        let currentPage = 1;
        const totalPages = 5;
        
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                document.getElementById(`page${currentPage}`).style.display = 'none';
                currentPage--;
                document.getElementById(`page${currentPage}`).style.display = 'block';
                updatePageIndicator();
            }
        });
        
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                document.getElementById(`page${currentPage}`).style.display = 'none';
                currentPage++;
                document.getElementById(`page${currentPage}`).style.display = 'block';
                updatePageIndicator();
            } else {
                // If on last page, show subscription option
                alert('To continue reading, please subscribe to Lumi Library.');
                window.location.href = 'subscription.html';
            }
        });
        
        function updatePageIndicator() {
            document.getElementById('currentPage').textContent = currentPage;
        }
        
        // Initialize page indicator
        if (document.getElementById('currentPage')) {
            document.getElementById('currentPage').textContent = currentPage;
        }
        if (document.getElementById('totalPages')) {
            document.getElementById('totalPages').textContent = totalPages;
        }
    }
    
    // Subscribe button for sample reader
    const subscribeBtn = document.getElementById('subscribeBtn');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function() {
            window.location.href = 'subscription.html';
        });
    }
});

// API functions
async function loadBooks(category = null, search = null) {
    try {
        let url = `${API_BASE_URL}/books`;
        const params = new URLSearchParams();
        
        if (category && category !== 'All') {
            params.append('category', category);
        }
        
        if (search) {
            params.append('search', search);
        }
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }
        
        const response = await fetch(url);
        const books = await response.json();
        
        if (response.ok) {
            displayBooks(books);
        } else {
            console.error('Failed to load books:', books.message);
            // Fallback: load sample books
            loadSampleBooks();
        }
    } catch (error) {
        console.error('Error loading books:', error);
        // Fallback: load sample books
        loadSampleBooks();
    }
}

function loadSampleBooks() {
    // Sample books to display when API is not available
    const sampleBooks = [
        {
            _id: '1',
            title: 'The Great Gatsby',
            author: 'F. Scott Fitzgerald',
            category: 'Classic Literature',
            coverImage: 'https://via.placeholder.com/200x300/4a90e2/ffffff?text=The+Great+Gatsby',
            description: 'A classic American novel set in the Jazz Age, following the mysterious millionaire Jay Gatsby and his obsession with the beautiful Daisy Buchanan.',
            rating: 4.2,
            reviews: [{ user: { name: 'Sample User' }, rating: 5, comment: 'A timeless classic!', createdAt: new Date() }]
        },
        {
            _id: '2',
            title: 'To Kill a Mockingbird',
            author: 'Harper Lee',
            category: 'Fiction',
            coverImage: 'https://via.placeholder.com/200x300/50c878/ffffff?text=To+Kill+a+Mockingbird',
            description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
            rating: 4.8,
            reviews: [{ user: { name: 'Sample User' }, rating: 5, comment: 'An important book for everyone.', createdAt: new Date() }]
        },
        {
            _id: '3',
            title: '1984',
            author: 'George Orwell',
            category: 'Dystopian Fiction',
            coverImage: 'https://via.placeholder.com/200x300/e74c3c/ffffff?text=1984',
            description: 'A dystopian social science fiction novel about totalitarian control and surveillance.',
            rating: 4.5,
            reviews: [{ user: { name: 'Sample User' }, rating: 5, comment: 'Prophetic and haunting.', createdAt: new Date() }]
        },
        {
            _id: '4',
            title: 'Pride and Prejudice',
            author: 'Jane Austen',
            category: 'Romance',
            coverImage: 'https://via.placeholder.com/200x300/f39c12/ffffff?text=Pride+and+Prejudice',
            description: 'A romantic novel that critiques the British landed gentry at the end of the 18th century.',
            rating: 4.3,
            reviews: [{ user: { name: 'Sample User' }, rating: 4, comment: 'A delightful read.', createdAt: new Date() }]
        },
        {
            _id: '5',
            title: 'The Catcher in the Rye',
            author: 'J.D. Salinger',
            category: 'Coming-of-age',
            coverImage: 'https://via.placeholder.com/200x300/9b59b6/ffffff?text=The+Catcher+in+the+Rye',
            description: 'A controversial novel narrated by teenager Holden Caulfield, dealing with alienation and loss of innocence.',
            rating: 3.8,
            reviews: [{ user: { name: 'Sample User' }, rating: 4, comment: 'Relatable and well-written.', createdAt: new Date() }]
        },
        {
            _id: '6',
            title: 'Moby Dick',
            author: 'Herman Melville',
            category: 'Adventure',
            coverImage: 'https://via.placeholder.com/200x300/34495e/ffffff?text=Moby+Dick',
            description: 'An epic tale of the voyage of the whaling ship Pequod and its captain Ahab.',
            rating: 4.0,
            reviews: [{ user: { name: 'Sample User' }, rating: 4, comment: 'A classic adventure story.', createdAt: new Date() }]
        }
    ];
    
    displayBooks(sampleBooks);
}

function displayBooks(books) {
    const bookGrid = document.querySelector('.book-grid');
    if (!bookGrid) return;
    
    bookGrid.innerHTML = '';
    
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.innerHTML = `
            <img src="${book.coverImage}" alt="${book.title}">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="author">${book.author}</p>
                <p class="category">${book.category}</p>
            </div>
        `;
        
        bookCard.addEventListener('click', () => {
            window.location.href = `book-details.html?id=${book._id}`;
        });
        
        bookGrid.appendChild(bookCard);
    });
}

async function loadBookDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    if (!bookId) {
        console.error('No book ID provided');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
        const book = await response.json();
        
        if (response.ok) {
            displayBookDetails(book);
        } else {
            console.error('Failed to load book details:', book.message);
        }
    } catch (error) {
        console.error('Error loading book details:', error);
    }
}

function displayBookDetails(book) {
    // Update book details in the page
    if (document.querySelector('h1')) {
        document.querySelector('h1').textContent = book.title;
    }
    
    if (document.querySelector('.author')) {
        document.querySelector('.author').textContent = `by ${book.author}`;
    }
    
    if (document.getElementById('bookDescription')) {
        document.getElementById('bookDescription').textContent = book.description;
    }
    
    // Update rating
    const ratingElement = document.querySelector('.rating-value');
    if (ratingElement) {
        ratingElement.textContent = `${book.rating} (${book.reviews.length} reviews)`;
    }
    
    // Update category
    const categoryElement = document.querySelector('p:not(.author):not(#bookDescription)');
    if (categoryElement && !categoryElement.id) {
        categoryElement.textContent = book.category;
    }
    
    // Update related books if needed
    if (book.reviews && Array.isArray(book.reviews)) {
        displayReviews(book.reviews);
    }
}

function displayReviews(reviews) {
    const reviewsContainer = document.querySelector('.reviews-container');
    if (!reviewsContainer || !Array.isArray(reviews)) return;
    
    reviewsContainer.innerHTML = '';
    
    reviews.forEach(review => {
        const reviewElement = document.createElement('div');
        reviewElement.className = 'review';
        reviewElement.innerHTML = `
            <div class="review-header">
                <span class="reviewer">${review.user.name || 'User'}</span>
                <div class="review-rating">
                    ${generateStars(review.rating)}
                </div>
            </div>
            <p class="review-date">${new Date(review.createdAt).toLocaleDateString()}</p>
            <p class="review-text">${review.comment}</p>
        `;
        reviewsContainer.appendChild(reviewElement);
    });
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i === Math.floor(rating) + 1 && rating % 1 !== 0) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Updated category filter function
function filterBooksByCategory(category) {
    loadBooks(category);
}

function initializeSubscriptionPlans() {
    // Plan selection functionality for subscription page
    document.querySelectorAll('.plan-card .btn').forEach(button => {
        button.addEventListener('click', function() {
            const planCard = this.closest('.plan-card');
            const planName = planCard.querySelector('h3').textContent.toLowerCase();
            
            // Redirect to payment page with plan info
            window.location.href = `payment.html?plan=${planName}`;
        });
    });
}

function initializePaymentForm() {
    // Get URL parameters to pre-select plan
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlan = urlParams.get('plan');
    
    if (selectedPlan) {
        const planSelect = document.getElementById('subscriptionPlan');
        if (planSelect) {
            // Set the selected plan in the dropdown
            const planOptions = {
                'basic': 'basic',
                'premium': 'yearly', // Using 'yearly' as the premium option
                'family': 'family'
            };
            
            const planValue = planOptions[selectedPlan] || selectedPlan;
            planSelect.value = planValue;
        }
    }
}