export const products = [
  {
    id: 'food', letter: 'F', path: '/appzeto-food', name: 'Appzeto Food', short: 'Food',
    line: 'Run your own multi-restaurant ordering and delivery business.',
    intro: 'One platform for the customer, the kitchen, the rider and you. It comes with complete source code and help after purchase.',
    roles: [
      { who: 'Customers', does: ['Order from many restaurants', 'Filter veg and non-veg', 'Track the order live', 'Light and dark mode'] },
      { who: 'Restaurants', does: ['Accept orders in their own panel', 'Run several branches', 'Join on commission or subscription'] },
      { who: 'Delivery', does: ['Accept deliveries in their own app', 'Work within zones you draw'] },
      { who: 'You', does: ['Admin panel for everything', 'Set zones and commissions', 'Earn from delivery charges'] },
    ],
  },
  {
    id: 'taxi', letter: 'T', path: '/appzeto-taxi', name: 'Appzeto Taxi', short: 'Taxi',
    line: 'Start a ride-hailing service with rider, driver and fleet apps.',
    intro: 'Bikes, autos, sedans and SUVs on one system, with a panel that shows the whole fleet moving.',
    roles: [
      { who: 'Riders', does: ['Search places with Google Places', 'Pick bike, auto, sedan or SUV', 'Track the driver and share the ETA', 'Pay in the app or by wallet'] },
      { who: 'Drivers', does: ['See busy areas on a heatmap', 'Track daily earnings', 'Chat with riders', 'Upload documents to join'] },
      { who: 'You', does: ['Follow every vehicle on a live map', 'Set fares by zone and demand', 'Read ride and revenue reports'] },
    ],
  },
  {
    id: 'quick', letter: 'Q', path: '/appzeto-quick-commerce', name: 'Appzeto Quick Commerce', short: 'Quick', line: 'Groceries and daily needs, ordered and delivered nearby.',
    intro: 'Shoppers fill a cart, the store packs it and a rider brings it over, with stock and orders in one place.',
    roles: [
      { who: 'Shoppers', does: ['Search and fill a cart', 'Follow the order', 'Pay in the app'] },
      { who: 'Stores', does: ['Pick and pack orders', 'Keep stock up to date'] },
      { who: 'Riders', does: ['Accept deliveries', 'See the drop on a map'] },
      { who: 'You', does: ['Manage stores and areas', 'See orders and sales'] },
    ],
  },
  {
    id: 'pharmacy', letter: 'C', path: '/appzeto-pharmacy', name: 'Appzeto Pharmacy', short: 'Pharmacy', line: 'Medicines from nearby chemists, checked against a prescription and delivered.',
    intro: 'Customers upload a prescription, a nearby pharmacy checks it and packs the order, and a rider brings it to the door.',
    roles: [
      { who: 'Customers', does: ['Upload a prescription', 'Search medicines and reorder', 'Track the delivery', 'Get refill reminders'] },
      { who: 'Pharmacies', does: ['Check prescriptions', 'Keep stock and expiry dates', 'Pack orders'] },
      { who: 'Riders', does: ['Accept deliveries', 'See the drop on a map'] },
      { who: 'You', does: ['Approve pharmacies', 'Set zones and fees', 'See orders and sales'] },
    ],
  },
  {
    id: 'service', letter: 'S', path: '/appzeto-service-provider', name: 'Appzeto Services', short: 'Services', line: 'Book an electrician, plumber, cleaner or AC expert at home.',
    intro: 'A home-services platform that connects customers with local professionals.',
    roles: [
      { who: 'Customers', does: ['Choose a service', 'Pick a time', 'Track the visit'] },
      { who: 'Experts', does: ['Accept jobs', 'Set working hours', 'See earnings'] },
      { who: 'You', does: ['Approve professionals', 'Set services and prices', 'Manage bookings'] },
    ],
  },
  {
    id: 'hotel', letter: 'H', path: '/appzeto-hotel-booking', name: 'Appzeto Hotels', short: 'Hotels', line: 'Let guests find a room and book it.',
    intro: 'Hotels list their rooms, guests choose dates, and every booking lands in one panel.',
    roles: [
      { who: 'Guests', does: ['Search by place and date', 'Compare rooms', 'Book and pay'] },
      { who: 'Hotels', does: ['List rooms', 'Set prices and dates', 'Handle bookings'] },
      { who: 'You', does: ['Approve hotels', 'Set commission', 'See every booking'] },
    ],
  },
  {
    id: 'super', letter: 'A', path: '/appzeto-all-in-one', name: 'Appzeto All-in-One', short: 'All-in-one', line: 'Food, taxi, quick commerce, services and hotels in one app.',
    intro: 'One app and one account for your customers, with every service behind it.',
    roles: [
      { who: 'Customers', does: ['Use every service in one app', 'Keep one account'] },
      { who: 'Partners', does: ['Join as a restaurant, store, driver, expert or hotel'] },
      { who: 'You', does: ['Choose which services to offer', 'Run them from one place'] },
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

export const topApps = [
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
    badge: 'Top OTT'
  },
  {
    id: 'abhikaro',
    name: 'Abhi Karo',
    tagline: 'Food + Taxi + Hotel booking',
    category: 'All-in-One App',
    downloads: '10k+',
    downloadsRaw: 10000,
    icon: '/apps/abhikaro.png',
    url: 'https://play.google.com/store/apps/details?id=com.abhikaro',
    color: '#FF6B00',
    badge: 'Multi-service'
  },
  {
    id: 'tiranga',
    name: 'Tiranga Cab',
    tagline: 'Fast city rides & taxi fleet',
    category: 'Taxi Booking',
    downloads: '10k+',
    downloadsRaw: 10000,
    icon: '/apps/tiranga.png',
    url: 'https://play.google.com/store/apps/details?id=com.tirangacabpartner.appzeto',
    color: '#FF9933',
    badge: 'Ride-Hailing'
  },
  {
    id: 'foodywing',
    name: 'Foodywing',
    tagline: 'Food & quick grocery delivery',
    category: 'Food Delivery',
    downloads: '10k+',
    downloadsRaw: 10000,
    icon: '/apps/foodywing.png',
    url: 'https://play.google.com/store/apps/details?id=com.quick_commerce.frontend',
    color: '#E23744',
    badge: 'Quick Delivery'
  },
  {
    id: 'indiankart',
    name: 'Indian Kart',
    tagline: 'Multi-vendor local marketplace',
    category: 'E-commerce',
    downloads: '5k+',
    downloadsRaw: 5000,
    icon: '/apps/indiankart.png',
    url: 'https://play.google.com/store/apps/details?id=com.indiankart.user1',
    color: '#008ECC',
    badge: 'Commerce'
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
    badge: 'Food App'
  }
]

