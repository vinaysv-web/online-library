const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');
const Subscription = require('./models/Subscription');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/lumi-library';

// Sample books data
const sampleBooks = [
  {
    title: "The Cosmic Journey",
    author: "Alexandra Stellar",
    description: "Embark on an extraordinary voyage through the cosmos with Dr. Elena Voyager, a brilliant astrophysicist who discovers a hidden gateway to parallel universes.",
    category: "Science Fiction",
    coverImage: "images/related-book1.jpg",
    sampleContent: "Chapter 1: The Discovery\nDr. Elena Voyager adjusted the quantum sensors on her telescope, peering into the cosmic void beyond the Andromeda Galaxy. For three years, she had been scanning this sector of space, searching for anomalies that might indicate the presence of exotic matter.",
    fullContent: "Full book content would go here...",
    rating: 4.5
  },
  {
    title: "Stellar Winds",
    author: "Alexandra Stellar",
    description: "A gripping tale of interstellar exploration and discovery.",
    category: "Science Fiction",
    coverImage: "images/related-book2.jpg",
    sampleContent: "Chapter 1: The Launch\nThe spacecraft hummed with energy as it prepared for its journey to the stars. Captain Johnson checked the instruments one final time before giving the order to proceed.",
    fullContent: "Full book content would go here...",
    rating: 4.2
  },
  {
    title: "Quantum Dreams",
    author: "Marcus Quantum",
    description: "A thrilling adventure through the quantum realm.",
    category: "Sci-Fi Thriller",
    coverImage: "images/related-book3.jpg",
    sampleContent: "Chapter 1: The Experiment\nDr. Sarah Chen stared at the quantum computer screen, watching as reality seemed to bend and twist according to laws not yet fully understood by science.",
    fullContent: "Full book content would go here...",
    rating: 4.0
  },
  {
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    description: "A classic fantasy adventure about Bilbo Baggins and his unexpected journey.",
    category: "Fantasy",
    coverImage: "images/fantasy-book1.jpg",
    sampleContent: "Chapter 1: An Unexpected Party\nIn a hole in the ground there lived a hobbit. Not a nasty, dirty, wet hole, filled with the ends of worms and an oozy smell, nor yet a dry, bare, sandy hole with nothing in it to sit down on or to eat: it was a hobbit-hole, and that means comfort.",
    fullContent: "Full book content would go here...",
    rating: 4.8
  },
  {
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    description: "A landmark volume in science writing by one of the great minds of our time.",
    category: "Science",
    coverImage: "images/science-book1.jpg",
    sampleContent: "Chapter 1: Our Picture of the Universe\nA well-known scientist (some say it was Bertrand Russell) once gave a public lecture on astronomy. He described how the earth orbits around the sun and how the sun, in turn, orbits around the center of a vast collection of stars called our galaxy.",
    fullContent: "Full book content would go here...",
    rating: 4.6
  },
  {
    title: "Steve Jobs",
    author: "Walter Isaacson",
    description: "Based on more than forty interviews with Jobs conducted over two years.",
    category: "Biography",
    coverImage: "images/biographies-book1.jpg",
    sampleContent: "Chapter 1: The Childhood\nWhen he was around five years old, his parents decided to give him a sibling. Paul Jobs was a graduate student in political science at the University of Wisconsin at the time.",
    fullContent: "Full book content would go here...",
    rating: 4.7
  },
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    description: "A romantic novel of manners written by Jane Austen.",
    category: "Romance",
    coverImage: "images/romance-book1.jpg",
    sampleContent: "Chapter 1: It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
    fullContent: "Full book content would go here...",
    rating: 4.5
  },
  {
    title: "The Art Book",
    author: "Phaidon Press",
    description: "A comprehensive guide to Western art from medieval to modern times.",
    category: "Art",
    coverImage: "images/art-book1.jpg",
    sampleContent: "Introduction: Art has always been a reflection of human experience, capturing our emotions, thoughts, and perspectives across centuries of civilization.",
    fullContent: "Full book content would go here...",
    rating: 4.3
  }
];

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Connected to MongoDB');

  // Clear existing data
  await User.deleteMany({});
  await Book.deleteMany({});
  await Subscription.deleteMany({});
  console.log('Cleared existing data');

  // Create sample books
  await Book.insertMany(sampleBooks);
  console.log('Created sample books');

  // Create a sample user
  const hashedPassword = await require('bcryptjs').hash('password123', 10);
  const sampleUser = new User({
    name: 'John Doe',
    email: 'john@example.com',
    password: hashedPassword,
    subscription: 'basic'
  });
  await sampleUser.save();
  console.log('Created sample user');

  console.log('Database seeding completed successfully');
  mongoose.connection.close();
})
.catch(err => {
  console.error('Error seeding database:', err);
  mongoose.connection.close();
});