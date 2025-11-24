const MIN_DELAY_MS = 500;
const MAX_DELAY_MS = 2000;
const ERROR_RATE = 0.1; // 10% simulated network/error rate

/** Helper: sleep for given ms */
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

/** Helper: pick a random integer between min and max inclusive */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/** Helper: random delay between MIN and MAX */
const randomDelay = () => randInt(MIN_DELAY_MS, MAX_DELAY_MS);

/**
 * Simulate a network call with delay and a small chance of error.
 * @throws {Error} when simulated error occurs
 */
async function simulateNetwork() {
	await delay(randomDelay());
	if (Math.random() < ERROR_RATE) {
		throw new Error('Simulated network error');
	}
}

// Realistic mock reviews for wireless headphones (multiple products included)
const REVIEWS = [
	{
		id: 'r-001',
		productId: 'headphones-001',
		source: 'Amazon',
		author: 'Lara M.',
		rating: 5,
		title: 'Fantastic sound and battery life',
		content:
			'Great clarity and deep bass for the price. Battery easily lasts through two long flights. Comfortable ear pads too.',
		date: '2025-09-12T10:32:00.000Z',
	},
	{
		id: 'r-002',
		productId: 'headphones-001',
		source: 'BestBuy',
		author: 'Aaron P.',
		rating: 4,
		title: 'Solid ANC but a bit tight',
		content:
			'Noise cancellation works well for airplanes, but the clamping force makes them slightly uncomfortable after 2 hours.',
		date: '2025-08-20T14:05:00.000Z',
	},
	{
		id: 'r-003',
		productId: 'headphones-001',
		source: 'Walmart',
		author: 'S. Gomez',
		rating: 3,
		title: 'Good sound; app needs work',
		content:
			'Sound profile is great out of the box but the companion app is glitchy on Android.',
		date: '2025-07-01T08:20:00.000Z',
	},
	{
		id: 'r-004',
		productId: 'headphones-001',
		source: 'Amazon',
		author: 'Priya K.',
		rating: 5,
		title: 'Comfortable all-day headphones',
		content:
			'Very light and breathable. I can wear them all day while working from home without soreness.',
		date: '2025-06-18T09:15:00.000Z',
	},
	{
		id: 'r-005',
		productId: 'headphones-001',
		source: 'BestBuy',
		author: 'Tom H.',
		rating: 2,
		title: 'Connectivity issues with some phones',
		content:
			'Paired fine with my laptop but it frequently drops on my old phone. Support suggested a firmware update.',
		date: '2025-05-02T18:40:00.000Z',
	},
	{
		id: 'r-006',
		productId: 'headphones-001',
		source: 'Walmart',
		author: 'Maya R.',
		rating: 4,
		title: 'Great mic for calls',
		content:
			'I use these for calls all day — callers say the voice is clear. Background noise handling is decent.',
		date: '2025-04-10T11:00:00.000Z',
	},
	{
		id: 'r-007',
		productId: 'headphones-001',
		source: 'Amazon',
		author: 'Kenji',
		rating: 5,
		title: 'Perfect for workouts',
		content:
			'Secure fit and sweat-resistant. They stay in place and sound great during runs.',
		date: '2025-03-21T07:30:00.000Z',
	},
	{
		id: 'r-008',
		productId: 'headphones-001',
		source: 'BestBuy',
		author: 'Olivia S',
		rating: 4,
		title: 'Balanced profile — not too bassy',
		content:
			'I prefer neutral sound and these deliver. Bass is present but not overbearing.',
		date: '2025-02-11T13:12:00.000Z',
	},
	{
		id: 'r-009',
		productId: 'headphones-001',
		source: 'Walmart',
		author: 'Derek L',
		rating: 1,
		title: 'Stopped working after a month',
		content:
			'Unit failed — no power. Customer service was slow to respond which was disappointing.',
		date: '2024-12-30T21:45:00.000Z',
	},
	{
		id: 'r-010',
		productId: 'headphones-001',
		source: 'Amazon',
		author: 'Hannah',
		rating: 5,
		title: 'Excellent value',
		content:
			'Soundstage is impressive for the price. Great purchase for music lovers on a budget.',
		date: '2024-11-14T16:00:00.000Z',
	},
	{
		id: 'r-011',
		productId: 'headphones-001',
		source: 'BestBuy',
		author: 'Marco',
		rating: 3,
		title: 'Plastic-feeling build',
		content:
			'They sound great but the build feels cheap compared to pricier models.',
		date: '2024-09-08T12:22:00.000Z',
	},
	{
		id: 'r-012',
		productId: 'headphones-001',
		source: 'Amazon',
		author: 'Nina',
		rating: 4,
		title: 'Great battery but bulky case',
		content:
			'Battery life is superb. The charging case is a bit large to carry in a small bag.',
		date: '2024-08-19T09:50:00.000Z',
	},
	{
		id: 'r-013',
		productId: 'headphones-002',
		source: 'Amazon',
		author: 'Phil',
		rating: 5,
		title: 'Perfect noise cancelling for office',
		content:
			'My team meetings are so much better — blocks out HVAC noise nicely.',
		date: '2025-01-05T10:10:00.000Z',
	},
	{
		id: 'r-014',
		productId: 'headphones-002',
		source: 'Walmart',
		author: 'Keisha',
		rating: 4,
		title: 'Comfortable, good mids',
		content:
			'Vocals and mids are where these shine. Not the punchiest bass, but very pleasant.',
		date: '2024-10-02T15:00:00.000Z',
	},
	{
		id: 'r-015',
		productId: 'headphones-001',
		source: 'Amazon',
		author: 'Ravi',
		rating: 5,
		title: 'A major upgrade from my old pair',
		content:
			'Clear highs and natural mids — would recommend to anyone upgrading from budget cans.',
		date: '2025-10-02T19:00:00.000Z',
	},
	{
		id: 'r-016',
		productId: 'headphones-001',
		source: 'Walmart',
		author: 'Carmen',
		rating: 4,
		title: 'Fast pairing, reliable',
		content:
			'Pairs quickly with multiple devices and remembers them. Good for switching between phone and laptop.',
		date: '2025-09-01T08:00:00.000Z',
	},
	{
		id: 'r-017',
		productId: 'headphones-001',
		source: 'BestBuy',
		author: 'Igor',
		rating: 2,
		title: 'Sound not as advertised',
		content:
			'Expected richer sound. After EQ tweaks it improved but out of box it felt thin.',
		date: '2024-07-11T20:20:00.000Z',
	},
	{
		id: 'r-018',
		productId: 'headphones-001',
		source: 'Amazon',
		author: 'Mei',
		rating: 5,
		title: 'Love the transparency mode',
		content:
			'Transparency mode sounds natural and lets me hear announcements without removing the headphones.',
		date: '2025-06-01T09:45:00.000Z',
	},
];

/**
 * Fetch existing reviews for a product.
 * Simulates network latency and a small error chance.
 * @param {string} productId
 * @returns {Promise<Array<Object>>} Resolves to array of reviews (most recent first)
 */
export async function fetchProductReviews(productId) {
	await simulateNetwork();
	const list = REVIEWS.filter((r) => r.productId === productId).slice();
	// sort by date descending
	list.sort((a, b) => new Date(b.date) - new Date(a.date));
	return list;
}

/**
 * Simulate fetching new reviews from external sources and append them to the mock store.
 * Returns the newly added reviews.
 * @param {string} productId
 * @returns {Promise<Array<Object>>}
 */
export async function triggerReviewFetch(productId) {
	await simulateNetwork();

	const newCount = randInt(1, 3);
	const sources = ['Amazon', 'BestBuy', 'Walmart'];
	const authors = ['Sam', 'Ellie', 'Jon', 'Pri', 'Yusuf', 'Zara', 'Bea'];
	const titles = [
		'Great purchase',
		'Not what I expected',
		'Excellent value',
		'Decent for the price',
		'Very comfortable',
		'Battery could be better',
	];
	const contentSnippets = [
		'Impressed by the clarity and build quality.',
		'Had some trouble with Bluetooth but fixed after reset.',
		'Perfect for travel and long listening sessions.',
		'Mic quality is top-notch for conference calls.',
		'A bit bulky in the case but otherwise great.',
		'Love the customizable EQ in the app.',
	];

	const added = [];
	for (let i = 0; i < newCount; i++) {
		const rating = randInt(1, 5);
		const source = sources[randInt(0, sources.length - 1)];
		const author = authors[randInt(0, authors.length - 1)];
		const title = titles[randInt(0, titles.length - 1)];
		const content = contentSnippets[randInt(0, contentSnippets.length - 1)];
		const id = `r-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
		const review = {
			id,
			productId,
			source,
			author,
			rating,
			title,
			content,
			date: new Date().toISOString(),
		};
		REVIEWS.push(review);
		added.push(review);
		// tiny gap so ids differ if generated quickly
		await delay(20);
	}

	// Return newest first
	added.sort((a, b) => new Date(b.date) - new Date(a.date));
	return added;
}

/**
 * Compute review statistics for a product.
 * @param {string} productId
 * @returns {Promise<Object>} {count, averageRating, ratingsCount, sourceBreakdown}
 */
export async function getReviewStats(productId) {
	await simulateNetwork();
	const items = REVIEWS.filter((r) => r.productId === productId);
	const count = items.length;
	const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
	const sourceBreakdown = {}; // { source: { count, averageRating } }

	let sum = 0;
	for (const r of items) {
		ratingsCount[r.rating] = (ratingsCount[r.rating] || 0) + 1;
		sum += r.rating;
		if (!sourceBreakdown[r.source]) sourceBreakdown[r.source] = { count: 0, sum: 0 };
		sourceBreakdown[r.source].count += 1;
		sourceBreakdown[r.source].sum += r.rating;
	}

	const averageRating = count ? Math.round((sum / count) * 100) / 100 : 0;

	// compute averages for sources
	for (const src of Object.keys(sourceBreakdown)) {
		const s = sourceBreakdown[src];
		s.averageRating = Math.round((s.sum / s.count) * 100) / 100;
		delete s.sum;
	}

	return { count, averageRating, ratingsCount, sourceBreakdown };
}

export default {
	fetchProductReviews,
	triggerReviewFetch,
	getReviewStats,
};

