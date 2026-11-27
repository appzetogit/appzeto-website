export const products = [
  {
    id: 'food', letter: 'F', path: '/appzeto-food', name: 'Appzeto Food', short: 'Food',
    line: 'Run your own multi-restaurant ordering and delivery business.',
    intro: 'One platform for the customer, the kitchen, the rider and you. It comes with complete source code and help after purchase.',
    roles: [
      { who: 'Customer app', does: ['Order from many restaurants in one cart flow', 'Filter by veg, non-veg, cuisine, rating and price', 'Track the order and the rider live on a map', 'Pay online, by wallet or cash on delivery', 'Reorder favourites, apply coupons and rate meals', 'Light and dark mode'] },
      { who: 'Restaurant panel', does: ['Accept or reject orders with a sound alert', 'Manage the menu, add-ons, prices and stock', 'Set opening hours and pause orders when busy', 'Run several branches from one login', 'See payouts, sales and best-selling dishes', 'Join on commission or subscription'] },
      { who: 'Delivery partner app', does: ['Get nearby orders and accept them in one tap', 'Turn-by-turn route to the restaurant and the customer', 'Confirm pickup and drop with an OTP', 'Track daily earnings, tips and cash collected', 'Work within zones you draw'] },
      { who: 'Admin panel', does: ['Control restaurants, riders and customers from one place', 'Draw delivery zones and set fees by distance', 'Set commission per restaurant and run offers', 'Live order board with every status', 'Reports on orders, revenue and payouts', 'Earn from commission and delivery charges'] },
    ],
  },
  {
    id: 'taxi', letter: 'T', path: '/appzeto-taxi', name: 'Appzeto Taxi', short: 'Taxi',
    line: 'Start a ride-hailing service with rider, driver and fleet apps.',
    intro: 'Bikes, autos, sedans and SUVs on one system, with a panel that shows the whole fleet moving.',
    roles: [
      { who: 'Rider app', does: ['Search places with Google Places', 'Pick bike, auto, sedan or SUV with the fare upfront', 'Track the driver and share the trip with family', 'Pay in the app, by wallet or in cash', 'Book now or schedule for later, with an SOS button', 'Rate the driver after every trip'] },
      { who: 'Driver app', does: ['Go online and get ride requests nearby', 'See busy areas on a heatmap', 'Navigate to pickup and drop', 'Track daily earnings and wallet balance', 'Chat or call riders without sharing numbers', 'Upload documents to join'] },
      { who: 'Admin panel', does: ['Follow every vehicle on a live map', 'Set fares by vehicle, zone and demand', 'Approve drivers and check their documents', 'Handle subscriptions or commission per ride', 'Run promo codes and referral offers', 'Read ride and revenue reports'] },
    ],
  },
  {
    id: 'quick', letter: 'Q', path: '/appzeto-quick-commerce', name: 'Appzeto Quick Commerce', short: 'Quick', line: 'Groceries and daily needs, ordered and delivered nearby.',
    intro: 'Shoppers fill a cart, the store packs it and a rider brings it over, with stock and orders in one place.',
    roles: [
      { who: 'Customer app', does: ['Browse categories or search thousands of products', 'Fill a cart and see the delivery time upfront', 'Follow the order from packing to the door', 'Pay online, by wallet or cash on delivery', 'Reorder past baskets in one tap'] },
      { who: 'Store panel', does: ['Get orders with a sound alert and pack them', 'Keep stock, prices and offers up to date', 'Mark items out of stock instantly', 'See sales and top products'] },
      { who: 'Delivery partner app', does: ['Accept deliveries close to the store', 'See the drop on a map with directions', 'Confirm delivery with an OTP', 'Track earnings per day'] },
      { who: 'Admin panel', does: ['Manage stores, categories and delivery areas', 'Set delivery fees and minimum order values', 'See every order live', 'Reports on orders, sales and stock'] },
    ],
  },
  {
    id: 'pharmacy', letter: 'C', path: '/appzeto-pharmacy', name: 'Appzeto Pharmacy', short: 'Pharmacy', line: 'Medicines from nearby chemists, checked against a prescription and delivered.',
    intro: 'Customers upload a prescription, a nearby pharmacy checks it and packs the order, and a rider brings it to the door.',
    roles: [
      { who: 'Customer app', does: ['Upload a prescription photo to order', 'Search medicines and reorder', 'Track the delivery live', 'Get refill reminders', 'Pay online or cash on delivery'] },
      { who: 'Pharmacy panel', does: ['Check prescriptions before accepting', 'Keep stock and expiry dates', 'Pack orders and mark them ready', 'See sales and payouts'] },
      { who: 'Delivery partner app', does: ['Accept deliveries nearby', 'See the drop on a map', 'Confirm delivery with an OTP', 'Track daily earnings'] },
      { who: 'Admin panel', does: ['Approve pharmacies and their licences', 'Set zones and delivery fees', 'See orders and sales', 'Handle refunds and support'] },
    ],
  },
  {
    id: 'service', letter: 'S', path: '/appzeto-service-provider', name: 'Appzeto Services', short: 'Services', line: 'Book an electrician, plumber, cleaner or AC expert at home.',
    intro: 'A home-services platform that connects customers with local professionals.',
    roles: [
      { who: 'Customer app', does: ['Choose a service and see the price upfront', 'Pick a date and time slot', 'Track the expert on the way', 'Pay online or after the job', 'Rate the expert'] },
      { who: 'Expert app', does: ['Accept jobs near you', 'Set working hours and days off', 'Navigate to the customer', 'See earnings and payouts'] },
      { who: 'Admin panel', does: ['Approve professionals and check documents', 'Set services, categories and prices', 'Manage bookings and reschedules', 'Reports on jobs and revenue'] },
    ],
  },
  {
    id: 'hotel', letter: 'H', path: '/appzeto-hotel-booking', name: 'Appzeto Hotels', short: 'Hotels', line: 'Let guests find a room and book it.',
    intro: 'Hotels list their rooms, guests choose dates, and every booking lands in one panel.',
    roles: [
      { who: 'Guest app', does: ['Search by place and date', 'Compare rooms, photos and prices', 'Book and pay online', 'Manage or cancel bookings'] },
      { who: 'Hotel panel', does: ['List rooms with photos and amenities', 'Set prices and available dates', 'Handle bookings and check-ins', 'See earnings'] },
      { who: 'Admin panel', does: ['Approve hotels', 'Set commission per hotel', 'See every booking', 'Run offers and coupons'] },
    ],
  },
  {
    id: 'super', letter: 'A', path: '/appzeto-all-in-one', name: 'Appzeto All-in-One', short: 'All-in-one', line: 'Food, taxi, quick commerce, services and hotels in one app.',
    intro: 'One app and one account for your customers, with every service behind it.',
    roles: [
      { who: 'Customer app', does: ['Use every service in one app', 'Keep one account, one wallet and one address book', 'Track every order and ride in one place'] },
      { who: 'Partner apps', does: ['Join as a restaurant, store, driver, expert or hotel', 'Each partner gets the app for their work'] },
      { who: 'Admin panel', does: ['Choose which services to offer', 'Run them all from one place', 'See revenue across every service'] },
    ],
  },
  {
    id: 'ai', letter: 'X', path: '/ai-custom-projects', name: 'AI Custom Projects', short: 'AI projects', line: 'AI-driven software, built around your own idea.',
    intro: 'When no ready platform fits, we design and build one with AI where it helps.',
    roles: [
      { who: 'Ideas we suit', does: ['Chat assistants', 'Predictions from your data', 'Image understanding', 'Automated workflows'] },
      { who: 'How it runs', does: ['Plan and sketch together', 'Build and test in steps', 'Launch and support'] },
    ],
  },
]
// Not shown: Hospital, Multi Vendor and Cyber Security are not in the current line-up.

export const services = [
  { slug: 'website', name: 'Websites', line: 'Quick, responsive sites people can find.', text: 'We build responsive, fast-loading, search-friendly websites with React, Next.js and Tailwind CSS.', features: ['Custom UI/UX', 'SEO optimisation', 'Responsive design', 'Speed and performance'] },
  { slug: 'mobile-application', name: 'Mobile apps', line: 'One app for Android and iOS.', text: 'We use Flutter and React Native to build apps that feel at home on both Android and iOS.', features: ['iOS and Android', 'Native performance', 'User-centred design', 'App store optimisation'] },
  { slug: 'ai-machine-learning', name: 'AI and machine learning', line: 'Software that reads, predicts and replies.', text: 'Recommendation engines, language processing and computer vision, built into the way you already work.', features: ['Predictive analytics', 'Natural language processing', 'Computer vision', 'Automated workflows'] },
  { slug: 'devops-cloud', name: 'DevOps and cloud', line: 'Releases and servers without the drama.', text: 'Automated pipelines and managed infrastructure on AWS, Azure or GCP.', features: ['CI/CD pipelines', 'Docker and Kubernetes', 'Cloud migration', 'Infrastructure as code'] },
  { slug: 'ui-ux-design', name: 'UI/UX design', line: 'Research first, then screens.', text: 'We research, sketch and test with users before we settle on an interface.', features: ['User research', 'Wireframing', 'Prototyping', 'Visual identity'] },
]
export const moreServices = [
  { slug: 'maintenance', name: 'Maintenance and support', line: 'Updates, monitoring and fixes after launch.', text: 'Software needs regular updates and monitoring. We keep yours secure, current and running well.', features: ['Security updates', 'Performance monitoring', 'Bug fixes'] },
  { slug: 'digital-marketing', name: 'Digital marketing', line: 'Social, paid ads and content.', text: 'We plan and run social media, paid campaigns and content, and show you what each one did.', features: ['Social media marketing', 'PPC campaigns', 'Content strategy', 'Performance tracking'] },
  { slug: 'seo-services', name: 'SEO', line: 'Technical fixes and better pages.', text: 'Technical SEO, keyword research and link building that help the right people find you.', features: ['Technical SEO', 'Keyword research', 'On-page SEO', 'Link building'] },
  { slug: 'logo-design', name: 'Logo design', line: 'A mark people can draw from memory.', text: 'We design a distinctive logo and give you every format you need to use it.', features: ['Unique identity', 'Versatile formats', 'Brand consistency'] },
  { slug: 'graphic-design', name: 'Graphic design', line: 'Social posts, print and illustration.', text: 'Graphics for social media and print that look like they come from the same company.', features: ['Brand assets', 'Creative illustrations', 'Marketing collateral'] },
]
export const allServices = [...services, ...moreServices]

export const steps = [
  ['Idea and plan', 'We talk it through and agree a roadmap.'],
  ['Sketching', 'We draw the structure before any colour.'],
  ['Designing', 'Colour, type and real screens.'],
  ['Coding', 'The screens start to work.'],
  ['Testing', 'We try to break it before anyone else can.'],
  ['Launch', 'It goes live, on the web or in the stores.'],
  ['Support', 'We stay for updates and fixes.'],
]
export const faqs = [
  ['What can you build?', 'Websites and web apps (MERN and Next.js), mobile apps (React Native and Flutter), AI and machine learning features, and food, taxi, quick commerce, home services and hotel platforms, separately or all in one app.'],
  ['How will we stay in touch?', 'Through a shared Slack or Teams channel, a weekly sprint meeting, and a Jira or Trello board. You can reach the project manager and lead developer directly.'],
  ['How does pricing work?', 'Fixed price when the scope is clear, time and material when it will change, or a dedicated team for longer work.'],
]

export const clientProjects = [
  {
    id: 'inplay',
    name: 'In Play',
    tagline: 'Shorts drama & OTT shows',
    category: 'OTT Platform',
    downloads: '1.5 Lakh+',
    downloadsRaw: 150000,
    icon: '/apps/inplay.png',
    url: 'https://play.google.com/store/apps/details?id=com.company.inplay',
    color: '#E50914',
    badge: 'Top OTT',
    intro: 'High-performance video streaming app built for rapid short drama episodes, video buffering, reels-style swipe navigation, and secure subscription monetization.',
    chips: ['1.5 Lakh+ downloads', 'OTT video streaming', 'Subscription engine', 'Android & iOS']
  },
  {
    id: 'abhikaro',
    name: 'Abhi Karo',
    tagline: 'Food + Taxi + Hotel booking',
    category: 'All-in-One Super App',
    downloads: '10k+',
    downloadsRaw: 10000,
    icon: '/apps/abhikaro.png',
    url: 'https://play.google.com/store/apps/details?id=com.abhikaro',
    color: '#FF6B00',
    badge: 'Multi-service',
    intro: 'Khatu Ka Apna App — an all-in-one multi-service ecosystem connecting local residents and pilgrims with restaurant deliveries, cab rides, and hotel bookings in one unified interface.',
    chips: ['10k+ downloads', 'Food + Taxi + Hotel', 'Live GPS tracking', 'Pilgrim city network']
  },
  {
    id: 'tiranga',
    name: 'Tiranga Cab',
    tagline: 'Fast city rides & taxi fleet',
    category: 'Taxi & Ride-Hailing',
    downloads: '10k+',
    downloadsRaw: 10000,
    icon: '/apps/tiranga.png',
    url: 'https://play.google.com/store/apps/details?id=com.tirangacabpartner.appzeto',
    color: '#FF9933',
    badge: 'Ride-Hailing',
    intro: 'Fast on-demand taxi and bike-booking platform equipped with real-time driver partner dispatch, live ETA sharing, route heatmaps, and automatic fare calculation.',
    chips: ['10k+ downloads', 'Driver partner fleet', 'Google Places routing', 'Wallet & cash payments']
  },
  {
    id: 'foodywing',
    name: 'Foodywing',
    tagline: 'Food & quick grocery delivery',
    category: 'Food & Quick Commerce',
    downloads: '10k+',
    downloadsRaw: 10000,
    icon: '/apps/foodywing.png',
    url: 'https://play.google.com/store/apps/details?id=com.quick_commerce.frontend',
    color: '#E23744',
    badge: 'Quick Delivery',
    intro: 'Multi-restaurant ordering and doorstep grocery delivery platform with synchronized customer cart, merchant order management, and zone-based rider dispatch.',
    chips: ['10k+ downloads', 'Multi-restaurant ordering', 'Zone-based dispatch', 'Real-time order tracking']
  },
  {
    id: 'indiankart',
    name: 'Indian Kart',
    tagline: 'Multi-vendor local marketplace',
    category: 'E-commerce Marketplace',
    downloads: '5k+',
    downloadsRaw: 5000,
    icon: '/apps/indiankart.png',
    url: 'https://play.google.com/store/apps/details?id=com.indiankart.user1',
    color: '#008ECC',
    badge: 'Commerce',
    intro: 'Hyperlocal e-commerce marketplace empowering local vendors and shops to sell online with real-time product catalogs, instant cart updates, and fast neighborhood delivery.',
    chips: ['5k+ downloads', 'Multi-vendor store catalog', 'Local merchant panel', 'Digital payments']
  },
  {
    id: 'tuggo',
    name: 'Tuggo',
    tagline: 'On-demand restaurant ordering',
    category: 'Food Delivery',
    downloads: '10k+',
    downloadsRaw: 10000,
    icon: '/apps/tuggo.png',
    url: 'https://play.google.com/store/apps/details?id=com.tuggo.user',
    color: '#28A745',
    badge: 'Food App',
    intro: 'Cloud kitchen and multi-restaurant food delivery system with live order tracking, menu customization, kitchen display panels, and real-time rider routing.',
    chips: ['10k+ downloads', 'Cloud kitchen ordering', 'Live rider map', 'Restaurant dashboard']
  }
]

export const topApps = clientProjects


