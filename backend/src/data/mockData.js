// In-memory data store for Session 4
// In Session 5, we'll replace this with MySQL database

let products = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    description: 'Premium noise-canceling headphones with 30-hour battery life',
    price: 199.99,
    image_url: '/images/headphones.jpg',
    created_at: new Date('2024-09-01')
  },
  {
    id: 2,
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit mechanical keyboard with blue switches',
    price: 149.99,
    image_url: '/images/keyboard.jpg',
    created_at: new Date('2024-09-02')
  },
  {
    id: 3,
    name: '4K Webcam',
    description: 'Ultra HD webcam with auto-focus and noise reduction',
    price: 89.99,
    image_url: '/images/webcam.jpg',
    created_at: new Date('2024-09-03')
  }
];

let reviews = [
  {
    id: 1,
    product_id: 1,
    source: 'amazon',
    external_id: 'AMZ-12345',
    reviewer_name: 'TechReviewer01',
    rating: 5.0,
    title: 'Excellent sound quality!',
    content: 'These headphones exceeded my expectations. The noise cancellation is fantastic and battery life is as advertised.',
    review_date: '2024-10-01',
    verified_purchase: true,
    helpful_votes: 15,
    fetched_at: new Date('2024-10-02')
  },
  {
    id: 2,
    product_id: 1,
    source: 'amazon',
    external_id: 'AMZ-12346',
    reviewer_name: 'BudgetBuyer',
    rating: 3.5,
    title: 'Good but pricey',
    content: 'Sound quality is great but I think they are overpriced for what you get.',
    review_date: '2024-10-02',
    verified_purchase: true,
    helpful_votes: 8,
    fetched_at: new Date('2024-10-03')
  }
];

// Auto-increment IDs
let nextProductId = 4;
let nextReviewId = 3;

module.exports = {
  products,
  reviews,
  getNextProductId: () => nextProductId++,
  getNextReviewId: () => nextReviewId++
};