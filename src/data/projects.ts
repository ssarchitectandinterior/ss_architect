export type Project = {
  slug: string;
  title: string;
  category: 'Residential' | 'Villa' | 'Apartment' | 'Commercial' | 'Landscape' | 'Interiors' | string;
  location: string;
  area: string;
  year: number;
  cover: string;
  gallery: string[];
  video?: string;
  client: string;
  services: string[];
  duration: string;
  materials: string[];
  description: string;
  challenges: string;
  solution: string;
};

const img = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const projects: Project[] = [
  {
    slug: 'senthilnathan-villa',
    title: 'Senthilnathan Residence',
    category: 'Villa',
    location: 'Pollachi, Tamil Nadu',
    area: '8,800 sq.ft',
    year: 2026,
    cover: '/projects/senthilnathan/cover.jpg',
    gallery: [
      '/projects/senthilnathan/cover.jpg',
      '/projects/senthilnathan/living-courtyard.jpg',
      '/projects/senthilnathan/meditation-lounge.jpg',
      '/projects/senthilnathan/pooja-sanctuary.jpg',
      '/projects/senthilnathan/upper-lounge.jpg',
    ],
    video: 'https://res.cloudinary.com/o0oxpmjh/video/upload/v1785409313/Rrr_Construction_Elevation_al3jkb.mp4',
    client: 'Mr. Senthilnathan',
    services: ['Architecture', 'Interior Design', 'Landscape Architecture', 'Sacred Sanctuary Design'],
    duration: '18 months',
    materials: ['Terracotta Brick', 'Kota Stone', 'Teak Wood', 'Polished Granite', 'Brass Accents'],
    description: 'A serene tropical luxury residence in Pollachi designed for Mr. Senthilnathan. The home seamlessly merges traditional South Indian spiritual sanctums with modern double-height living spaces, framed by lush courtyard gardens.',
    challenges: 'Harmonizing traditional South Indian sacred geometry and indoor courtyard living with modern double-height glazing and climate-responsive cooling for Pollachi\'s tropical environment.',
    solution: 'A shifted-spine layout wrapped around an inner courtyard garden, featuring deep overhangs, custom arched granite-and-teak shrine walls, and seamless indoor-outdoor transitions.',
  },
  {
    slug: 'monolith-house',
    title: 'Monolith House',
    category: 'Residential',
    location: 'Alibag, Maharashtra',
    area: '9,200 sq.ft',
    year: 2024,
    cover: img('photo-1600607687939-ce8a6c25118c'),
    gallery: [
      img('photo-1600607687939-ce8a6c25118c'),
      img('photo-1600585154340-be6161a56a0c'),
      img('photo-1616486338812-3dadae4b4ace'),
      img('photo-1600566753190-17f0baa2a6c3'),
    ],
    client: 'Private Residence',
    services: ['Architecture', 'Interior Design', 'Landscape'],
    duration: '22 months',
    materials: ['Kota stone', 'Fair-faced concrete', 'Teak', 'Bronze'],
    description: 'A private weekend home carved from a single volume, negotiating between the coastal wind and the horizon line.',
    challenges: 'Balancing an open plan with monsoon-heavy climate, and preserving three century-old trees on site.',
    solution: 'A shifted-cross plan wraps around the trees, with deep verandahs and a monolithic concrete shell that ages with the sea air.',
  },
  {
    slug: 'quiet-atelier',
    title: 'Quiet Atelier',
    category: 'Apartment',
    location: 'Bandra, Mumbai',
    area: '3,400 sq.ft',
    year: 2024,
    cover: img('photo-1615874959474-d609969a20ed'),
    gallery: [img('photo-1615874959474-d609969a20ed'), img('photo-1618221195710-dd6b41faaea6'), img('photo-1560448204-e02f11c3d0e2')],
    client: 'Art Collector',
    services: ['Interior Design', 'Furniture Design'],
    duration: '11 months',
    materials: ['Lime plaster', 'Oak', 'Travertine', 'Linen'],
    description: 'A pared-back apartment for a collector — every wall a gallery, every corner a resting eye.',
    challenges: 'Housing a rotating art collection without a museum-like coldness.',
    solution: 'Warm lime-plaster walls, tactile linens, and hidden lighting tracks let the art rotate freely.',
  },
  {
    slug: 'terra-hospitality',
    title: 'Terra Boutique Hotel',
    category: 'Commercial',
    location: 'Udaipur, Rajasthan',
    area: '46,000 sq.ft',
    year: 2023,
    cover: img('photo-1566073771259-6a8506099945'),
    gallery: [img('photo-1566073771259-6a8506099945'), img('photo-1590490360182-c33d57733427'), img('photo-1578683010236-d716f9a3f461')],
    client: 'Terra Hospitality',
    services: ['Architecture', 'Interior Design', 'Landscape', 'Turnkey'],
    duration: '30 months',
    materials: ['Local sandstone', 'Reclaimed teak', 'Handmade tile', 'Brass'],
    description: 'A 34-key boutique retreat carved into the ridgeline overlooking the lake.',
    challenges: 'Building on a protected ridge with strict height covenants.',
    solution: 'The volume steps down the slope in three terraces, each courtyard a private room to the sky.',
  },
  {
    slug: 'north-office',
    title: 'North Studios HQ',
    category: 'Commercial',
    location: 'Bengaluru',
    area: '18,500 sq.ft',
    year: 2024,
    cover: img('photo-1497366216548-37526070297c'),
    gallery: [img('photo-1497366216548-37526070297c'), img('photo-1524758631624-e2822e304c36'), img('photo-1497366811353-6870744d04b2')],
    client: 'North Studios',
    services: ['Architecture', 'Interior Design'],
    duration: '9 months',
    materials: ['Micro-cement', 'Steel', 'Cork', 'Walnut'],
    description: 'A studio headquarters for a design consultancy — quiet, monastic, deeply focused.',
    challenges: 'Delivering acoustically calm open work in a low, deep floor plate.',
    solution: 'A parallel ribbon of felted rooms flanks a central library street of daylight.',
  },
  {
    slug: 'sable-restaurant',
    title: 'Sable',
    category: 'Interiors',
    location: 'Colaba, Mumbai',
    area: '4,100 sq.ft',
    year: 2023,
    cover: img('photo-1517248135467-4c7edcad34c4'),
    gallery: [img('photo-1517248135467-4c7edcad34c4'), img('photo-1544148103-0773bf10d330'), img('photo-1552566626-52f8b828add9')],
    client: 'Sable Hospitality',
    services: ['Interior Design', 'Lighting Design'],
    duration: '7 months',
    materials: ['Burnt oak', 'Aged brass', 'Waxed plaster', 'Silk'],
    description: 'A late-night dining room built around a single, low ring of candlelight.',
    challenges: 'A narrow heritage shell with a single service axis.',
    solution: 'Booths line the long walls; a central bar becomes both kitchen theatre and lantern.',
  },
  {
    slug: 'linear-villa',
    title: 'Linear Villa',
    category: 'Villa',
    location: 'Goa',
    area: '7,800 sq.ft',
    year: 2022,
    cover: img('photo-1613490493576-7fde63acd811'),
    gallery: [img('photo-1613490493576-7fde63acd811'), img('photo-1600585154526-990dced4db0d'), img('photo-1600210492486-724fe5c67fb0')],
    client: 'Private Residence',
    services: ['Architecture', 'Interior Design', 'Landscape'],
    duration: '19 months',
    materials: ['Lime wash', 'Basalt', 'Cane', 'Teak'],
    description: 'A single-storey villa stretched along a laterite ridge, framing the coconut grove beyond.',
    challenges: 'Cross-ventilation across a 60m-long plan without corridors.',
    solution: 'A shifted-spine plan with garden pockets between every room.',
  },
];

export const categories = ['All', 'Residential', 'Villa', 'Apartment', 'Commercial', 'Landscape', 'Interiors'] as const;
export const categoryOptions = ['Residential', 'Villa', 'Apartment', 'Commercial', 'Landscape', 'Interiors'] as const;

