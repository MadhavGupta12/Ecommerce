export const demoCategories = [
  { _id: 'cat-furniture', name: 'Furniture', description: 'Sofas, chairs, tables, and storage pieces' },
  { _id: 'cat-lighting', name: 'Lighting', description: 'Warm lamps and sculptural fixtures' },
  { _id: 'cat-decor', name: 'Decor', description: 'Textiles, trays, mirrors, and accents' },
  { _id: 'cat-bedroom', name: 'Bedroom', description: 'Soft bedroom essentials and nightstands' }
];

export const demoProducts = [
  {
    _id: 'demo-aurora-chair',
    name: 'Aurora Lounge Chair',
    brand: 'LuxeHaven Studio',
    category: demoCategories[0],
    description: 'A sculptural lounge chair with a curved hardwood frame, deep seat, and soft boucle upholstery made for reading corners.',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
    price: 429,
    countInStock: 12,
    rating: 4.7,
    numReviews: 18,
    featured: true
  },
  {
    _id: 'demo-velvet-sofa',
    name: 'Marlow Velvet Sofa',
    brand: 'Casa Vale',
    category: demoCategories[0],
    description: 'A low-profile three-seat sofa with performance velvet, generous cushions, and brass-finished tapered legs.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=80',
    price: 1199,
    countInStock: 6,
    rating: 4.8,
    numReviews: 27,
    featured: true
  },
  {
    _id: 'demo-oak-table',
    name: 'Haven Oak Coffee Table',
    brand: 'Northline',
    category: demoCategories[0],
    description: 'A solid oak coffee table with softened edges, a lower display shelf, and a natural matte finish.',
    image: 'https://images.unsplash.com/photo-1532372320978-9d44f8ebfca7?auto=format&fit=crop&w=1200&q=80',
    price: 349,
    countInStock: 10,
    rating: 4.6,
    numReviews: 16
  },
  {
    _id: 'demo-solstice-lamp',
    name: 'Solstice Floor Lamp',
    brand: 'Northline',
    category: demoCategories[1],
    description: 'A brass floor lamp with a diffused glass globe and dimmable ambient light for evening rooms.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
    price: 189,
    countInStock: 24,
    rating: 4.5,
    numReviews: 11
  },
  {
    _id: 'demo-ceramic-lamp',
    name: 'Aster Ceramic Table Lamp',
    brand: 'LuxeHaven Studio',
    category: demoCategories[1],
    description: 'A hand-glazed ceramic lamp with a linen drum shade and warm bedside glow.',
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
    price: 144,
    countInStock: 18,
    rating: 4.4,
    numReviews: 14
  },
  {
    _id: 'demo-marble-trays',
    name: 'Marble Nesting Trays',
    brand: 'Casa Vale',
    category: demoCategories[2],
    description: 'A set of two honed marble trays for consoles, coffee tables, perfume bottles, and dresser styling.',
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80',
    price: 74,
    countInStock: 32,
    rating: 4.3,
    numReviews: 9
  },
  {
    _id: 'demo-wool-throw',
    name: 'Alpine Wool Throw',
    brand: 'Hearth & Loom',
    category: demoCategories[2],
    description: 'A brushed wool-blend throw with quiet texture, finished fringe, and year-round comfort.',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=1200&q=80',
    price: 96,
    countInStock: 21,
    rating: 4.6,
    numReviews: 22
  },
  {
    _id: 'demo-round-mirror',
    name: 'Orsay Round Mirror',
    brand: 'Maison Row',
    category: demoCategories[2],
    description: 'A slim metal-framed round mirror that brightens entryways, vanities, and compact living spaces.',
    image: 'https://images.unsplash.com/photo-1616486701797-0f33f61038ec?auto=format&fit=crop&w=1200&q=80',
    price: 212,
    countInStock: 13,
    rating: 4.7,
    numReviews: 19
  },
  {
    _id: 'demo-linen-duvet',
    name: 'Washed Linen Duvet Set',
    brand: 'Hearth & Loom',
    category: demoCategories[3],
    description: 'A breathable linen duvet and pillowcase set with a relaxed, softly rumpled finish.',
    image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80',
    price: 238,
    countInStock: 15,
    rating: 4.8,
    numReviews: 31,
    featured: true
  },
  {
    _id: 'demo-walnut-nightstand',
    name: 'Walnut Cove Nightstand',
    brand: 'Northline',
    category: demoCategories[3],
    description: 'A compact walnut nightstand with a soft-close drawer and open shelf for everyday bedside storage.',
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    price: 279,
    countInStock: 9,
    rating: 4.5,
    numReviews: 12
  },
  {
    _id: 'demo-dining-chair',
    name: 'Fable Dining Chair',
    brand: 'Casa Vale',
    category: demoCategories[0],
    description: 'A curved-back dining chair with woven seat detailing and an easy silhouette for long dinners.',
    image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=1200&q=80',
    price: 168,
    countInStock: 30,
    rating: 4.2,
    numReviews: 8
  },
  {
    _id: 'demo-wall-sconce',
    name: 'Halo Wall Sconce',
    brand: 'Maison Row',
    category: demoCategories[1],
    description: 'A compact wall sconce with a milk-glass shade and warm brass armature for hallways and bedsides.',
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    price: 126,
    countInStock: 20,
    rating: 4.4,
    numReviews: 10
  }
];

const galleryImages = [
  'https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210491369-e753d80a41f3?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600607688066-890987f18a86?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80'
];

const productVideos = [
  'https://videos.pexels.com/video-files/7534244/7534244-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/7578552/7578552-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/5998165/5998165-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/7586177/7586177-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/7033773/7033773-hd_1920_1080_25fps.mp4',
  'https://videos.pexels.com/video-files/7578543/7578543-hd_1920_1080_25fps.mp4'
];

demoProducts.forEach((product, index) => {
  product.gallery = [
    product.image,
    galleryImages[index % galleryImages.length],
    galleryImages[(index + 2) % galleryImages.length],
    galleryImages[(index + 5) % galleryImages.length],
    galleryImages[(index + 8) % galleryImages.length]
  ];
  product.videoUrl = productVideos[index % productVideos.length];
});
