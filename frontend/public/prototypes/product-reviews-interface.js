// Fetch product data from backend API (simulated)
async function fetchProducts() {
  try {
    console.log('Fetching products from ./products-with-reviews.json');
    const response = await fetch('./products-with-reviews.json');
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Successfully loaded ${data.products.length} products`);
    return data.products;
  } catch (error) {
    console.error('Error fetching products:', error);
    // Return null on error so callers can distinguish fetch failure vs empty list
    return null;
  }
}

function filterProductsBySource(products, source) {
  if (source === 'all') {
    console.log('Filtering: showing all products');
    return products;
  }
  const filtered = products.filter(p => p.sources.includes(source));
  console.log(`Filtering: found ${filtered.length} products with ${source} reviews`);
  return filtered;
}

function searchProducts(products, query) {
  if (!query || query.trim() === '') {
    console.log('Search: empty query – returning original set');
    return products;
  }
  const q = query.toLowerCase();
  const filtered = products.filter(p => p.name.toLowerCase().includes(q));
  console.log(`Search: found ${filtered.length} products matching "${query}"`);
  return filtered;
}

function applyAllFilters(originalProducts) {
  const sourceFilter = document.getElementById('source-filter');
  const searchInput = document.getElementById('product-search');
  const ratingSelect = document.getElementById('rating-filter');
  const source = sourceFilter ? sourceFilter.value : 'all';
  const query = searchInput ? searchInput.value : '';
  const ratingVal = ratingSelect ? ratingSelect.value : '';
  const grid = document.getElementById('product-grid');

  // Apply source filter first, then search
  const bySource = filterProductsBySource(originalProducts, source);
  const bySearch = searchProducts(bySource, query);
  // Apply rating filter last
  const minRating = ratingVal !== '' ? parseFloat(ratingVal) : NaN;
  const final = filterByRating(bySearch, minRating);

  console.log(`Applying filters -> source: ${source}, query: "${query}", minRating: ${ratingVal} => ${final.length} results`);
  if (final.length === 0) {
    if (grid) {
      grid.innerHTML = '<div class="col-span-full p-8 text-center text-gray-600">No products found with selected criteria.</div>';
    }
    updateResultsCount(0, originalProducts.length);
    return final;
  }

  renderProducts(final);
  updateResultsCount(final.length, originalProducts.length);
  return final;
}

function filterByRating(products, minRating) {
  if (isNaN(minRating)) {
    console.log('Rating filter: no minimum specified — returning input set');
    return products;
  }
  const filtered = products.filter(p => parseFloat(p.avgRating) >= minRating);
  console.log(`Rating filter: ${filtered.length} products with avgRating >= ${minRating}`);
  return filtered;
}

function resetFilters(originalProducts) {
  const sourceFilter = document.getElementById('source-filter');
  const searchInput = document.getElementById('product-search');
  const ratingSelect = document.getElementById('rating-filter');
  const resultsCounter = document.getElementById('results-counter');

  if (sourceFilter) sourceFilter.value = 'all';
  if (searchInput) searchInput.value = '';
  if (ratingSelect) ratingSelect.value = '';

  // Update UI and show all products
  applyAllFilters(originalProducts);

  // Improve UX: focus search input after reset
  if (searchInput) searchInput.focus();
  if (resultsCounter) console.log('Filters reset — showing all products');
}

function updateResultsCount(shown, total) {
  const counter = document.getElementById('results-counter');
  if (!counter) return;
  const sourceText = shown === total ? 'with reviews' : 'with selected reviews';
  counter.textContent = `Showing ${shown} of ${total} products ${sourceText}`;
  console.log(`Results: ${shown}/${total} products displayed`);
}

function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  let stars = '';
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) stars += '★';
    else if (i === fullStars && hasHalf) stars += '★';
    else stars += '☆';
  }
  return stars;
}

function renderProducts(productsArray) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  // Clear existing content
  grid.innerHTML = '';

  // Build product cards
  const cards = productsArray.map(p => {
    const imageUrl = `https://placehold.co/300x200?text=${encodeURIComponent(p.name)}`;
    const sourceCount = p.sources.length;
    const starsDisplay = renderStars(p.avgRating);

    // Build source breakdown table
    const breakdownRows = Object.keys(p.reviewBreakdown).map(src => {
      const b = p.reviewBreakdown[src];
      const srcStars = renderStars(b.avgRating);
      return `
        <tr class="border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
          <td class="py-2 text-sm font-medium text-gray-700">${src}</td>
          <td class="py-2 text-sm text-gray-600">${srcStars} <span class="font-semibold">${b.avgRating.toFixed(1)}</span></td>
          <td class="py-2 text-sm text-gray-600 text-right">${b.count}</td>
        </tr>
      `;
    }).join('');

    return `
      <article class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden flex flex-col h-full">
        <!-- Product Image -->
        <div class="relative bg-gray-100 overflow-hidden h-48">
          <img src="${imageUrl}" alt="${p.name}" class="w-full h-full object-cover">
        </div>

        <!-- Card Content -->
        <div class="p-4 flex flex-col flex-grow">
          <!-- Product Info -->
          <div class="mb-3">
            <h2 class="text-lg font-bold text-gray-900 line-clamp-2">${p.name}</h2>
            <p class="text-xs font-semibold text-indigo-600 uppercase tracking-wide">${p.category}</p>
          </div>

          <!-- Rating Section -->
          <div class="mb-4 pb-3 border-b border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-yellow-500 text-lg">${starsDisplay}</span>
              <span class="text-2xl font-bold text-gray-900">${p.avgRating.toFixed(1)}</span>
            </div>
            <p class="text-xs text-gray-600">${p.totalReviews} reviews from ${sourceCount} sources</p>
          </div>

          <!-- Source Breakdown Table -->
          <div class="mb-4">
            <h3 class="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-2">Platform Breakdown</h3>
            <table class="w-full text-xs">
              <tbody>
                ${breakdownRows}
              </tbody>
            </table>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-2 mt-auto">
            <button class="flex-1 px-3 py-2 bg-indigo-600 text-white text-sm font-semibold rounded hover:bg-indigo-700 transition">
              View All Reviews
            </button>
            <button class="flex-1 px-3 py-2 bg-gray-200 text-gray-900 text-sm font-semibold rounded hover:bg-gray-300 transition">
              Fetch Fresh Reviews
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');

  grid.innerHTML = cards;
}

function init() {
  document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.getElementById('product-grid');
    const counter = document.getElementById('results-counter');

    // Show loading state
    if (grid) {
      grid.innerHTML = '<div class="col-span-full p-8 text-center text-gray-600">Loading product reviews...</div>';
    }
    if (counter) {
      counter.textContent = 'Loading...';
    }

    // Fetch products from API
    const products = await fetchProducts();

    // Handle fetch error (null) vs empty list
    if (products === null) {
      if (grid) {
        grid.innerHTML = '<div class="col-span-full p-8 text-center text-red-600">Failed to load products. Check console for details.</div>';
      }
      if (counter) counter.textContent = 'Failed to load products';
      return;
    }

    if (products.length === 0) {
      if (grid) {
        grid.innerHTML = '<div class="col-span-full p-8 text-center text-gray-600">No products available.</div>';
      }
      if (counter) counter.textContent = 'Showing 0 of 0 products';
      return;
    }

    // Initial render via applying (empty) filters
    applyAllFilters(products);

    // Setup source filter and search input to apply combined filters
    const sourceFilter = document.getElementById('source-filter');
    const searchInput = document.getElementById('product-search');

    if (sourceFilter) {
      sourceFilter.addEventListener('change', (e) => {
        console.log(`Source filter changed to: ${e.target.value}`);
        applyAllFilters(products);
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const q = e.target.value;
        console.log(`Search input: "${q}"`);
        applyAllFilters(products);
      });
    }

    const ratingFilter = document.getElementById('rating-filter');
    if (ratingFilter) {
      ratingFilter.addEventListener('change', (e) => {
        const v = e.target.value;
        console.log(`Rating filter changed to: ${v}`);
        applyAllFilters(products);
      });
    }

    // Reset filters button
    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        console.log('Reset filters clicked');
        resetFilters(products);
      });
    }
  });
}

// Start
init();
