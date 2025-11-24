/**
 * Mock Review Data
 * Simulates reviews from multiple e-commerce platforms
 */

const generateReviewId = (source, num) => `${source.toUpperCase()}_${String(num).padStart(4, '0')}`;

const mockReviews = {
  // Product 1: USB-C Fast Charger 30W
  '1': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 1),
        source: 'Amazon',
        author: 'John Smith',
        rating: 5,
        title: 'Excellent fast charger!',
        body: 'This charger is amazing. Charges my phone super fast and the build quality is solid. Highly recommend!',
        created_at: '2025-09-15T10:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 2),
        source: 'Amazon',
        author: 'Emily Johnson',
        rating: 4,
        title: 'Good but runs warm',
        body: 'Works well and charges quickly, but it does get noticeably warm during use. Not a dealbreaker though.',
        created_at: '2025-09-18T14:20:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 3),
        source: 'Amazon',
        author: 'Michael Brown',
        rating: 5,
        title: 'Perfect for travel',
        body: 'Compact design, powerful charging. Perfect for my travel bag. Worth every penny.',
        created_at: '2025-09-22T08:45:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 4),
        source: 'Amazon',
        author: 'Sarah Davis',
        rating: 3,
        title: 'Decent charger',
        body: 'It works fine, nothing special. Expected more for the price.',
        created_at: '2025-09-25T16:10:00Z',
        verified_purchase: false
      },
      {
        review_id: generateReviewId('AMZ', 5),
        source: 'Amazon',
        author: 'David Wilson',
        rating: 5,
        title: 'Best charger I\'ve owned',
        body: 'Super fast charging, reliable, and the cable is high quality. This is my third purchase!',
        created_at: '2025-09-28T11:30:00Z',
        verified_purchase: true
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 1),
        source: 'BestBuy',
        author: 'Jessica Martinez',
        rating: 4,
        title: 'Solid performer',
        body: 'Good charging speed and build quality. Only downside is the price point.',
        created_at: '2025-09-16T13:00:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('BB', 2),
        source: 'BestBuy',
        author: 'Robert Taylor',
        rating: 5,
        title: 'Charges my laptop too!',
        body: 'Not only charges my phone quickly, but also works great with my USB-C laptop. Very versatile.',
        created_at: '2025-09-20T09:15:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('BB', 3),
        source: 'BestBuy',
        author: 'Linda Anderson',
        rating: 4,
        title: 'Reliable and compact',
        body: 'Does what it promises. Compact size is great for daily carry.',
        created_at: '2025-09-27T15:45:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 1),
        source: 'Walmart',
        author: 'Thomas Moore',
        rating: 3,
        title: 'Works but overpriced',
        body: 'It charges fine, but I think you can find cheaper alternatives with similar performance.',
        created_at: '2025-09-17T10:20:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('WM', 2),
        source: 'Walmart',
        author: 'Karen White',
        rating: 5,
        title: 'Great value',
        body: 'Fast charging, durable cable, and the price was better than other retailers. Very happy!',
        created_at: '2025-09-24T12:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('WM', 3),
        source: 'Walmart',
        author: 'James Harris',
        rating: 4,
        title: 'Good purchase',
        body: 'Charges my devices quickly. No complaints so far.',
        created_at: '2025-09-29T17:00:00Z',
        verified_purchase: false
      }
    ]
  },

  // Product 2: Wireless Bluetooth Headphones
  '2': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 101),
        source: 'Amazon',
        author: 'Alex Thompson',
        rating: 4,
        title: 'Great sound quality',
        body: 'Sound quality is impressive for the price. Battery life could be better though.',
        created_at: '2025-09-10T09:00:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 102),
        source: 'Amazon',
        author: 'Maria Garcia',
        rating: 5,
        title: 'Love these headphones!',
        body: 'Comfortable, great sound, easy to pair. Best headphones I\'ve tried in this price range.',
        created_at: '2025-09-14T14:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 103),
        source: 'Amazon',
        author: 'Chris Lee',
        rating: 2,
        title: 'Disappointed',
        body: 'Connection keeps dropping. Sound is okay but not worth the hassle.',
        created_at: '2025-09-19T11:45:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 104),
        source: 'Amazon',
        author: 'Patricia King',
        rating: 5,
        title: 'Perfect for workouts',
        body: 'Stay in place during exercise, sweat resistant, and great audio quality. Highly recommend!',
        created_at: '2025-09-26T16:20:00Z',
        verified_purchase: true
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 101),
        source: 'BestBuy',
        author: 'Daniel Scott',
        rating: 4,
        title: 'Good but not great',
        body: 'Sound quality is good, but the fit could be better. Still a decent purchase.',
        created_at: '2025-09-12T10:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('BB', 102),
        source: 'BestBuy',
        author: 'Jennifer Adams',
        rating: 5,
        title: 'Amazing value!',
        body: 'Can\'t believe the quality for this price. Bass is punchy, highs are clear. Very impressed.',
        created_at: '2025-09-21T13:15:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 101),
        source: 'Walmart',
        author: 'William Turner',
        rating: 3,
        title: 'Average headphones',
        body: 'They work fine for casual listening. Nothing special.',
        created_at: '2025-09-13T15:00:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('WM', 102),
        source: 'Walmart',
        author: 'Nancy Phillips',
        rating: 4,
        title: 'Comfortable and clear',
        body: 'Very comfortable for long listening sessions. Sound is clear and balanced.',
        created_at: '2025-09-23T09:45:00Z',
        verified_purchase: true
      }
    ]
  },

  // Product 3: Smart LED Light Bulb
  '3': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 201),
        source: 'Amazon',
        author: 'Steven Clark',
        rating: 5,
        title: 'Easy setup, works perfectly',
        body: 'Setup was a breeze. App is intuitive. Love being able to control lights from my phone!',
        created_at: '2025-09-08T12:00:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 202),
        source: 'Amazon',
        author: 'Barbara Rodriguez',
        rating: 4,
        title: 'Good smart bulb',
        body: 'Works well with Alexa. Brightness levels are good. Only issue is occasional WiFi disconnection.',
        created_at: '2025-09-15T10:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 203),
        source: 'Amazon',
        author: 'Kevin Lewis',
        rating: 3,
        title: 'App needs improvement',
        body: 'Bulb itself is fine, but the app is clunky and slow to respond.',
        created_at: '2025-09-22T14:15:00Z',
        verified_purchase: false
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 201),
        source: 'BestBuy',
        author: 'Michelle Walker',
        rating: 5,
        title: 'Love the color options!',
        body: 'So many color options! Great for setting the mood. Quality is excellent.',
        created_at: '2025-09-11T11:20:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('BB', 202),
        source: 'BestBuy',
        author: 'Brian Hall',
        rating: 4,
        title: 'Works as advertised',
        body: 'Good brightness, easy to install, integrates well with smart home setup.',
        created_at: '2025-09-25T16:45:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 201),
        source: 'Walmart',
        author: 'Sandra Allen',
        rating: 5,
        title: 'Best smart bulb for the price',
        body: 'Tried several brands, this one is the best value. Reliable and feature-rich.',
        created_at: '2025-09-18T13:30:00Z',
        verified_purchase: true
      }
    ]
  },
  '4': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 301),
      source: 'Amazon',
      author: 'Daniel Morris',
      rating: 5,
      title: 'Amazing sound quality for the price',
      body: 'Was not expecting much but the sound quality blew me away. Bass is deep and clear.',
      created_at: '2025-09-05T09:20:00Z',
      verified_purchase: true
    },
    {
      review_id: generateReviewId('AMZ', 302),
      source: 'Amazon',
      author: 'Sophia Mitchell',
      rating: 4,
      title: 'Good but battery life could be better',
      body: 'Comfortable and lightweight. Battery lasts around 5 hours, wish it were longer.',
      created_at: '2025-09-12T14:50:00Z',
      verified_purchase: true
    },
    {
      review_id: generateReviewId('AMZ', 303),
      source: 'Amazon',
      author: 'Andrew Carter',
      rating: 3,
      title: 'Average performance',
      body: 'Works fine for casual listening but microphone quality isn’t great for calls.',
      created_at: '2025-09-20T18:10:00Z',
      verified_purchase: false
    }
  ],

  bestbuy: [
    {
      review_id: generateReviewId('BB', 301),
      source: 'BestBuy',
      author: 'Rebecca Hughes',
      rating: 5,
      title: 'Exceeded expectations',
      body: 'High-quality materials, excellent audio separation, totally worth the price.',
      created_at: '2025-09-08T15:45:00Z',
      verified_purchase: true
    },
    {
      review_id: generateReviewId('BB', 302),
      source: 'BestBuy',
      author: 'Jonathan Evans',
      rating: 4,
      title: 'Solid pair of headphones',
      body: 'Comfortable fit and strong sound. Noise isolation is decent but not perfect.',
      created_at: '2025-09-23T11:40:00Z',
      verified_purchase: true
    }
  ],

  walmart: [
    {
      review_id: generateReviewId('WM', 301),
      source: 'Walmart',
      author: 'Patricia Brooks',
      rating: 5,
      title: 'Best headphones under $50',
      body: 'Surprisingly premium feel. Sound rivals more expensive brands.',
      created_at: '2025-09-17T10:05:00Z',
      verified_purchase: true
    }
  ]
  },
  '5': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 401),
        source: 'Amazon',
        author: 'Laura King',
        rating: 5,
        title: 'Cleans extremely well',
        body: 'Picks up dust I didn’t even know was there. Auto schedule works perfectly.',
        created_at: '2025-09-05T08:40:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 402),
        source: 'Amazon',
        author: 'George Baker',
        rating: 4,
        title: 'Good overall',
        body: 'Great suction but can get stuck under low furniture.',
        created_at: '2025-09-14T12:30:00Z',
        verified_purchase: true
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 401),
        source: 'BestBuy',
        author: 'Emma Rivera',
        rating: 5,
        title: 'Game changer',
        body: 'My house has never been cleaner. Battery life is amazing.',
        created_at: '2025-09-11T10:05:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 401),
        source: 'Walmart',
        author: 'Patrick Cooper',
        rating: 4,
        title: 'Does the job well',
        body: 'Cleans well but sometimes misses corners.',
        created_at: '2025-09-18T09:30:00Z',
        verified_purchase: true
      }
    ]
  },
  '6': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 501),
        source: 'Amazon',
        author: 'Olivia Cox',
        rating: 5,
        title: 'Fantastic sound',
        body: 'Bass is deep and crisp. Perfect for parties.',
        created_at: '2025-09-06T15:00:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 502),
        source: 'Amazon',
        author: 'Matthew Ward',
        rating: 4,
        title: 'Very good speaker',
        body: 'Battery lasts around 12 hours. Build quality feels premium.',
        created_at: '2025-09-15T13:20:00Z',
        verified_purchase: false
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 501),
        source: 'BestBuy',
        author: 'Amber Morgan',
        rating: 5,
        title: 'Amazing value',
        body: 'Better than some speakers twice the price.',
        created_at: '2025-09-09T09:10:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 501),
        source: 'Walmart',
        author: 'Jesse Adams',
        rating: 4,
        title: 'Good sound',
        body: 'Loud enough for outdoor use. Charges quickly.',
        created_at: '2025-09-20T17:00:00Z',
        verified_purchase: true
      }
    ]
  },
  '7': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 601),
        source: 'Amazon',
        author: 'Hannah Foster',
        rating: 5,
        title: 'Excellent typing experience',
        body: 'Keys feel smooth and quiet. Perfect for office work.',
        created_at: '2025-09-05T08:10:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 602),
        source: 'Amazon',
        author: 'Peter Simmons',
        rating: 3,
        title: 'Decent but lags sometimes',
        body: 'Occasional Bluetooth lag when using with PC.',
        created_at: '2025-09-17T11:45:00Z',
        verified_purchase: false
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 601),
        source: 'BestBuy',
        author: 'Zoe Fisher',
        rating: 4,
        title: 'Good keyboard',
        body: 'Good design, battery lasts long, but keys are slightly soft.',
        created_at: '2025-09-22T14:30:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 601),
        source: 'Walmart',
        author: 'Richard Perry',
        rating: 5,
        title: 'Perfect for everyday use',
        body: 'No issues and works perfectly with my tablet.',
        created_at: '2025-09-29T10:40:00Z',
        verified_purchase: true
      }
    ]
  },
  '8': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 701),
        source: 'Amazon',
        author: 'Victoria Bell',
        rating: 5,
        title: 'Cooks everything perfectly',
        body: 'Crispy fries, juicy chicken. Very easy to use.',
        created_at: '2025-09-08T10:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 702),
        source: 'Amazon',
        author: 'Carl Peterson',
        rating: 4,
        title: 'Good but a bit noisy',
        body: 'Cooks well but fan noise is louder than expected.',
        created_at: '2025-09-16T13:15:00Z',
        verified_purchase: false
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 701),
        source: 'BestBuy',
        author: 'Angela Bryant',
        rating: 5,
        title: 'Amazing kitchen appliance',
        body: 'Healthy and convenient. Use it daily!',
        created_at: '2025-09-12T11:05:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 701),
        source: 'Walmart',
        author: 'Jerry Howard',
        rating: 4,
        title: 'Works as expected',
        body: 'Good size and temperature control.',
        created_at: '2025-09-25T15:20:00Z',
        verified_purchase: true
      }
    ]
  },
  '9': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 801),
        source: 'Amazon',
        author: 'Noah Martinez',
        rating: 5,
        title: 'Super responsive!',
        body: 'Zero lag and great RGB lighting.',
        created_at: '2025-09-07T09:00:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 802),
        source: 'Amazon',
        author: 'Ella Lee',
        rating: 3,
        title: 'Good but too light',
        body: 'For FPS games it’s great but I prefer a heavier mouse.',
        created_at: '2025-09-19T16:20:00Z',
        verified_purchase: false
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 801),
        source: 'BestBuy',
        author: 'Samuel Cook',
        rating: 4,
        title: 'Solid for the price',
        body: 'Clicks feel premium, sensor is accurate.',
        created_at: '2025-09-23T13:50:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 801),
        source: 'Walmart',
        author: 'Maria Ramirez',
        rating: 5,
        title: 'Great gaming mouse',
        body: 'Works perfectly with my gaming laptop.',
        created_at: '2025-09-28T11:45:00Z',
        verified_purchase: true
      }
    ]
  },
  '10': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 901),
      source: 'Amazon',
      author: 'Henry Edwards',
      rating: 5,
      title: 'Excellent smartwatch',
      body: 'Tracks health accurately, battery lasts 4 days.',
      created_at: '2025-09-06T08:40:00Z',
      verified_purchase: true
    },
    {
      review_id: generateReviewId('AMZ', 902),
      source: 'Amazon',
      author: 'Chloe Rivera',
      rating: 4,
      title: 'Good but screen could be brighter',
      body: 'Smooth UI and comfortable strap.',
      created_at: '2025-09-15T14:05:00Z',
      verified_purchase: false
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 901),
      source: 'BestBuy',
      author: 'Jason Bell',
      rating: 5,
      title: 'Amazing features',
      body: 'GPS is very accurate, notifications sync instantly.',
      created_at: '2025-09-10T11:15:00Z',
      verified_purchase: true
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 901),
      source: 'Walmart',
      author: 'Tiffany Morris',
      rating: 4,
      title: 'Very nice watch',
      body: 'All functions work well but charging cable feels fragile.',
      created_at: '2025-09-26T17:10:00Z',
      verified_purchase: true
    }
  ]
  },
  '11': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 1101),
      source: 'Amazon',
      author: 'Natalie Brooks',
      rating: 5,
      title: 'Charges super fast!',
      body: 'This power bank charges my phone from 0 to 80% in 30 minutes.',
      created_at: '2025-09-06T09:30:00Z',
      verified_purchase: true
    },
    {
      review_id: generateReviewId('AMZ', 1102),
      source: 'Amazon',
      author: 'Dylan Myers',
      rating: 4,
      title: 'Good capacity',
      body: 'Can charge my phone 3 times. Slightly heavier than expected.',
      created_at: '2025-09-14T14:20:00Z',
      verified_purchase: false
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 1101),
      source: 'BestBuy',
      author: 'Sophia Rogers',
      rating: 5,
      title: 'Must-have for travel',
      body: 'Compact, solid build, and reliable.',
      created_at: '2025-09-11T08:55:00Z',
      verified_purchase: true
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 1101),
      source: 'Walmart',
      author: 'Aaron Bailey',
      rating: 4,
      title: 'Great power bank',
      body: 'Charges well but takes long to recharge itself.',
      created_at: '2025-09-20T16:40:00Z',
      verified_purchase: true
    }
  ]
  },
  '12': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 1201),
        source: 'Amazon',
        author: 'Grace Howard',
        rating: 5,
        title: 'Amazing sound quality!',
        body: 'Bass is rich, vocals are clear, and noise cancellation is excellent.',
        created_at: '2025-09-07T12:10:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 1202),
        source: 'Amazon',
        author: 'Logan Reed',
        rating: 3,
        title: 'Decent but connectivity issues',
        body: 'Sometimes disconnects when walking outside.',
        created_at: '2025-09-17T15:35:00Z',
        verified_purchase: false
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 1201),
        source: 'BestBuy',
        author: 'Kayla Morris',
        rating: 4,
        title: 'Comfortable',
        body: 'Great fit, lightweight, works well for gym sessions.',
        created_at: '2025-09-23T10:10:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 1201),
        source: 'Walmart',
        author: 'Jacob Phillips',
        rating: 5,
        title: 'Perfect earbuds',
        body: 'Exceeded my expectations. Battery life is awesome.',
        created_at: '2025-09-29T14:05:00Z',
        verified_purchase: true
      }
    ]
  },
  '13': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 1301),
        source: 'Amazon',
        author: 'Megan Stewart',
        rating: 5,
        title: 'Huge energy savings',
        body: 'My electricity bill dropped significantly after installing this.',
        created_at: '2025-09-08T10:50:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 1302),
        source: 'Amazon',
        author: 'Ethan Rogers',
        rating: 4,
        title: 'Good smart home device',
        body: 'Works well with Alexa. App could be more intuitive.',
        created_at: '2025-09-18T09:20:00Z',
        verified_purchase: true
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 1301),
        source: 'BestBuy',
        author: 'Isabella Turner',
        rating: 5,
        title: 'Very convenient',
        body: 'Automatically adjusts temperature perfectly.',
        created_at: '2025-09-25T11:35:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 1301),
        source: 'Walmart',
        author: 'Jason Scott',
        rating: 4,
        title: 'Works well',
        body: 'Good thermostat but installation took some time.',
        created_at: '2025-09-22T13:15:00Z',
        verified_purchase: false
      }
    ]
  },
  '14': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 1401),
        source: 'Amazon',
        author: 'Tara Mitchell',
        rating: 5,
        title: 'Clear video and easy setup',
        body: 'Video quality is excellent even at night.',
        created_at: '2025-09-05T08:25:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 1402),
        source: 'Amazon',
        author: 'Ryan Bennett',
        rating: 4,
        title: 'Good smart doorbell',
        body: 'App notifications sometimes delayed.',
        created_at: '2025-09-16T14:00:00Z',
        verified_purchase: true
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 1401),
        source: 'BestBuy',
        author: 'Lucy Mitchell',
        rating: 5,
        title: 'Love the motion detection',
        body: 'Captures everything with no blind spots.',
        created_at: '2025-09-21T12:45:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 1401),
        source: 'Walmart',
        author: 'Nathan James',
        rating: 4,
        title: 'Works well overall',
        body: 'Good product but WiFi setup was tricky.',
        created_at: '2025-09-28T14:20:00Z',
        verified_purchase: true
      }
    ]
  },
  '15': {
    amazon: [
      {
        review_id: generateReviewId('AMZ', 1501),
        source: 'Amazon',
        author: 'Chloe King',
        rating: 5,
        title: 'Accurate health tracking',
        body: 'Sleep tracking is surprisingly accurate. Step count matches my phone.',
        created_at: '2025-09-07T09:30:00Z',
        verified_purchase: true
      },
      {
        review_id: generateReviewId('AMZ', 1502),
        source: 'Amazon',
        author: 'Brandon Cox',
        rating: 3,
        title: 'Okay but battery drains fast',
        body: 'Needs charging every 2 days.',
        created_at: '2025-09-17T18:10:00Z',
        verified_purchase: false
      }
    ],
    bestbuy: [
      {
        review_id: generateReviewId('BB', 1501),
        source: 'BestBuy',
        author: 'Mia Rogers',
        rating: 4,
        title: 'Good fitness tracker',
        body: 'Tracks heart rate well, comfortable to wear.',
        created_at: '2025-09-24T11:55:00Z',
        verified_purchase: true
      }
    ],
    walmart: [
      {
        review_id: generateReviewId('WM', 1501),
        source: 'Walmart',
        author: 'Evan Gonzalez',
        rating: 5,
        title: 'Great value',
        body: 'Affordable and feature-rich. Syncs smoothly with app.',
        created_at: '2025-09-27T13:40:00Z',
        verified_purchase: true
      }
    ]
  },
  '16': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 1601),
      source: 'Amazon',
      author: 'Hannah Foster',
      rating: 4,
      title: 'Solid performance',
      body: 'Fast and smooth performance for daily tasks.',
      created_at: '2025-09-06T10:20:00Z',
      verified_purchase: true
    },
    {
      review_id: generateReviewId('AMZ', 1602),
      source: 'Amazon',
      author: 'Liam Mitchell',
      rating: 3,
      title: 'Average battery',
      body: 'Battery life is okay but could be better.',
      created_at: '2025-09-12T14:50:00Z',
      verified_purchase: false
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 1601),
      source: 'BestBuy',
      author: 'Zoe Clarke',
      rating: 5,
      title: 'Highly recommended',
      body: 'Runs quietly and handles multitasking well.',
      created_at: '2025-09-21T08:40:00Z',
      verified_purchase: true
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 1601),
      source: 'Walmart',
      author: 'Noah Bennett',
      rating: 4,
      title: 'Good purchase',
      body: 'Decent value for the price.',
      created_at: '2025-09-29T16:35:00Z',
      verified_purchase: true
    }
  ]
},

'17': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 1701),
      source: 'Amazon',
      author: 'Ella Morgan',
      rating: 5,
      title: 'Outstanding camera quality',
      body: 'Photos are sharp and vibrant even at night.',
      created_at: '2025-08-30T11:10:00Z',
      verified_purchase: true
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 1701),
      source: 'BestBuy',
      author: 'Lucas Hayes',
      rating: 4,
      title: 'Very smooth performance',
      body: 'No lag even when switching heavy apps.',
      created_at: '2025-09-03T15:15:00Z',
      verified_purchase: true
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 1701),
      source: 'Walmart',
      author: 'Aria Brooks',
      rating: 4,
      title: 'Good but pricey',
      body: 'Features are great but cost is high.',
      created_at: '2025-09-11T09:45:00Z',
      verified_purchase: false
    }
  ]
},

'18': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 1801),
      source: 'Amazon',
      author: 'Isaac Reed',
      rating: 3,
      title: 'Decent but speakers are weak',
      body: 'Sound quality could be louder.',
      created_at: '2025-09-14T13:20:00Z',
      verified_purchase: false
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 1801),
      source: 'BestBuy',
      author: 'Sophia Turner',
      rating: 5,
      title: 'Fantastic display',
      body: 'Colors are accurate and brightness is excellent.',
      created_at: '2025-09-18T10:05:00Z',
      verified_purchase: true
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 1801),
      source: 'Walmart',
      author: 'Ethan Russell',
      rating: 4,
      title: 'Good for work',
      body: 'Handles productivity tasks smoothly.',
      created_at: '2025-09-25T17:25:00Z',
      verified_purchase: true
    }
  ]
},

'19': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 1901),
      source: 'Amazon',
      author: 'Leah Collins',
      rating: 5,
      title: 'Perfect for gaming',
      body: 'High refresh rate makes a huge difference.',
      created_at: '2025-08-22T12:30:00Z',
      verified_purchase: true
    },
    {
      review_id: generateReviewId('AMZ', 1902),
      source: 'Amazon',
      author: 'Grant Foster',
      rating: 4,
      title: 'Sharp image quality',
      body: 'Very clear picture, colors look great.',
      created_at: '2025-08-29T18:00:00Z',
      verified_purchase: false
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 1901),
      source: 'BestBuy',
      author: 'Caroline Adams',
      rating: 4,
      title: 'Good for the price',
      body: 'Solid performance overall.',
      created_at: '2025-09-01T09:15:00Z',
      verified_purchase: true
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 1901),
      source: 'Walmart',
      author: 'Oliver Simmons',
      rating: 5,
      title: 'Amazing monitor',
      body: 'Crisp visuals and smooth gameplay.',
      created_at: '2025-09-07T14:10:00Z',
      verified_purchase: true
    }
  ]
},

'20': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 2001),
      source: 'Amazon',
      author: 'Nina Walker',
      rating: 4,
      title: 'Good sound quality',
      body: 'Bass is deep and clear.',
      created_at: '2025-09-10T12:20:00Z',
      verified_purchase: true
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 2001),
      source: 'BestBuy',
      author: 'Henry Lawson',
      rating: 3,
      title: 'Comfort is average',
      body: 'Gets uncomfortable after long use.',
      created_at: '2025-09-15T16:50:00Z',
      verified_purchase: false
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 2001),
      source: 'Walmart',
      author: 'Jack Barrett',
      rating: 4,
      title: 'Solid option',
      body: 'Good for daily listening.',
      created_at: '2025-09-22T10:45:00Z',
      verified_purchase: true
    }
  ]
},

'21': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 2101),
      source: 'Amazon',
      author: 'Amelia Grant',
      rating: 5,
      title: 'Very portable',
      body: 'Lightweight and easy to carry.',
      created_at: '2025-09-08T09:15:00Z',
      verified_purchase: true
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 2101),
      source: 'BestBuy',
      author: 'Wyatt Ross',
      rating: 4,
      title: 'Fast enough',
      body: 'Performance is good for the price.',
      created_at: '2025-09-12T12:05:00Z',
      verified_purchase: true
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 2101),
      source: 'Walmart',
      author: 'Luna Parker',
      rating: 3,
      title: 'Battery drains fast',
      body: 'Needs charging more often than expected.',
      created_at: '2025-09-21T14:20:00Z',
      verified_purchase: false
    }
  ]
},

'22': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 2201),
      source: 'Amazon',
      author: 'Harper Lewis',
      rating: 5,
      title: 'Amazing productivity tool',
      body: 'Helps with daily office tasks seamlessly.',
      created_at: '2025-09-05T11:45:00Z',
      verified_purchase: true
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 2201),
      source: 'BestBuy',
      author: 'Jason Morales',
      rating: 4,
      title: 'Good keyboard',
      body: 'Keys feel solid and responsive.',
      created_at: '2025-09-13T10:10:00Z',
      verified_purchase: true
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 2201),
      source: 'Walmart',
      author: 'Scarlett Hayes',
      rating: 5,
      title: 'Great purchase',
      body: 'Affordable and reliable.',
      created_at: '2025-09-26T09:35:00Z',
      verified_purchase: true
    }
  ]
},

'23': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 2301),
      source: 'Amazon',
      author: 'Owen Price',
      rating: 4,
      title: 'Nice build quality',
      body: 'Feels durable and well-made.',
      created_at: '2025-09-16T11:20:00Z',
      verified_purchase: true
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 2301),
      source: 'BestBuy',
      author: 'Bella Martinez',
      rating: 3,
      title: 'Not very loud',
      body: 'Volume is lower than expected.',
      created_at: '2025-09-19T13:55:00Z',
      verified_purchase: false
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 2301),
      source: 'Walmart',
      author: 'Caleb Stewart',
      rating: 4,
      title: 'Good for basic use',
      body: 'Works fine for everyday tasks.',
      created_at: '2025-09-28T10:55:00Z',
      verified_purchase: true
    }
  ]
},

'24': {
  amazon: [
    {
      review_id: generateReviewId('AMZ', 2401),
      source: 'Amazon',
      author: 'Maya Hughes',
      rating: 5,
      title: 'Exceeded expectations',
      body: 'Performs even better than advertised.',
      created_at: '2025-09-09T14:10:00Z',
      verified_purchase: true
    }
  ],
  bestbuy: [
    {
      review_id: generateReviewId('BB', 2401),
      source: 'BestBuy',
      author: 'Jonathan West',
      rating: 4,
      title: 'Good but gets warm',
      body: 'Heats up slightly under heavy load.',
      created_at: '2025-09-14T17:25:00Z',
      verified_purchase: true
    }
  ],
  walmart: [
    {
      review_id: generateReviewId('WM', 2401),
      source: 'Walmart',
      author: 'Paisley Torres',
      rating: 4,
      title: 'Solid and reliable',
      body: 'Worth the money and works well.',
      created_at: '2025-09-23T12:30:00Z',
      verified_purchase: true
    }
  ]
}

};

module.exports = mockReviews;
