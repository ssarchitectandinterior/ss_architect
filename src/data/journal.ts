export interface JournalPost {
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  coverImage: string;
  excerpt: string;
  content: {
    intro: string;
    sections: {
      heading?: string;
      paragraphs: string[];
      quote?: string;
      image?: string;
      caption?: string;
    }[];
    conclusion: string;
  };
}

export const journalPosts: JournalPost[] = [
  {
    slug: 'on-the-discipline-of-restraint',
    title: 'On the discipline of restraint',
    category: 'Essay',
    date: 'Jun 2026',
    readTime: '6 min read',
    author: {
      name: 'Aditya & Norah Sen',
      role: 'Principal Architects, SS Architects & Interiors',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80',
    excerpt: 'True luxury in modern architecture lies not in addition, but in the radical subtraction of the unnecessary.',
    content: {
      intro: 'In an era dominated by instant visual gratification and hyper-decorative facades, architecture frequently yields to noise. We are routinely presented with structures that attempt to say everything all at once — combining disparate materials, dramatic cantilevered geometries, and unconsidered technological flourishes. Yet, when we step into spaces that endure across generations, we discover a common silent thread: restraint.',
      sections: [
        {
          heading: 'The Geometry of Silence',
          paragraphs: [
            'Restraint is not minimalism. Minimalism, as it is often popularized today, can be sterile — a clinical suppression of warmth. Restraint, by contrast, is purposeful editing. It is the conscious decision to allow a single wall of exposed lime plaster to absorb the soft morning gradient of light rather than competing with ornamental cladding.',
            'When designing a recent residential sanctuary in Pollachi, our primary challenge was not deciding what to build, but deciding what to leave out. By narrowing our material palette strictly to local terracotta brick, polished granite, and hand-carved teak, each material was granted room to breathe and age gracefully under the tropical monsoon conditions.'
          ],
          quote: 'Architecture is the learned game, correct and magnificent, of forms assembled in the light — provided those forms possess the courage to remain quiet.',
          image: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80',
          caption: 'Inner courtyard shadowplay at the Pollachi Sanctuary.'
        },
        {
          heading: 'Material Honesty and the Passage of Time',
          paragraphs: [
            'When a space is stripped of superficial embellishment, the integrity of craftsmanship is exposed. A joint between timber and stone cannot rely on decorative trims to hide imperfections; it must be executed with millimeter precision.',
            'Moreover, restrained architecture honors time. Synthetic finishes look their best on the day of inauguration and deteriorate every day thereafter. Honest, natural materials — unsealed stone, patinated brass, untreated teak — begin their true journey only after human touch and atmospheric exposure have weathered their surfaces into a rich, irreplaceable patina.'
          ],
          quote: 'A room should feel as though it was not designed in a single moment, but gathered quietly over decades.'
        },
        {
          heading: 'Space as a Canvas for Human Experience',
          paragraphs: [
            'Ultimately, an architectural space does not exist to celebrate the architect; it exists to honor the lives lived within its walls. When we restrain our impulse to over-design, we create void spaces — courtyards that capture rain, corridors that frame shadows, and rooms where silence feels tangible.',
            'By paring back the non-essential, architecture retreats into the background, leaving center stage to the shifting sunlight, the rustle of leaves beyond the threshold, and the quiet ritual of daily living.'
          ]
        }
      ],
      conclusion: 'Restraint is a discipline that requires patience and confidence. It demands that we trust the raw beauty of natural light, the texture of authentic materials, and the power of proportion. In doing so, we create spaces that do not clamor for attention, but instead offer refuge from a noisy world.'
    }
  },
  {
    slug: 'lime-laterite-teak-three-materials-we-return-to',
    title: 'Lime, laterite, teak: three materials we return to',
    category: 'Materials',
    date: 'May 2026',
    readTime: '9 min read',
    author: {
      name: 'SS Architects & Interiors Research Team',
      role: 'Material Culture Division',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    coverImage: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?auto=format&fit=crop&w=2000&q=80',
    excerpt: 'Exploring the thermal, tactile, and ecological qualities of traditional South Asian building materials.',
    content: {
      intro: 'Material choices define the thermal soul of a building. In our practice, we continually return to three elemental substances that have proven their resilience across centuries of Indian climatic conditions.',
      sections: [
        {
          heading: 'Lime Plaster: The Breathing Skin',
          paragraphs: [
            'Unlike modern Portland cement which traps moisture and induces thermal cracking, traditional slaked lime plaster remains micro-porous. It breathes, absorbing ambient humidity during peak heat and releasing it slowly as temperatures drop.',
            'Surfaces rendered in eggshell-smooth Araish or thappi lime possess a luminous depth that synthetic paints can never replicate.'
          ]
        }
      ],
      conclusion: 'Building with vernacular materials is not nostalgia; it is climate rationality.'
    }
  },
  {
    slug: 'designing-for-the-fifth-season-the-monsoon',
    title: 'Designing for the fifth season — the monsoon',
    category: 'Field notes',
    date: 'Apr 2026',
    readTime: '7 min read',
    author: {
      name: 'Aditya Sen',
      role: 'Principal Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    },
    coverImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=2000&q=80',
    excerpt: 'How monsoon rains shape roof profiles, deep eaves, and rain-chain courtyard acoustic design.',
    content: {
      intro: 'The tropical monsoon is not an architectural inconvenience to be sealed out — it is a dramatic seasonal ritual to be celebrated.',
      sections: [
        {
          heading: 'Choreographing Water',
          paragraphs: [
            'Deep verandas, sloping terracotta roofs, and hand-forged copper rain chains transform downpours into acoustic performances.',
            'By guiding rainwater into central courtyard pools, the building actively participates in regional groundwater recharge.'
          ]
        }
      ],
      conclusion: 'Architecture should welcome the weather, not fight it.'
    }
  },
  {
    slug: 'a-conversation-with-our-joinery-workshop',
    title: 'A conversation with our joinery workshop',
    category: 'Interviews',
    date: 'Feb 2026',
    readTime: '11 min read',
    author: {
      name: 'Norah Sen',
      role: 'Design Director',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=2000&q=80',
    excerpt: 'Master woodworkers discuss mortise and tenon joints, grain alignment, and reclaimed teak timber.',
    content: {
      intro: 'Behind every refined architectural detail is the steady hand of a master craftsperson. We sit down with Master Carpenter Ramanathan in our Kochi joinery shop.',
      sections: [
        {
          heading: 'The Language of Wood',
          paragraphs: [
            'Timber is living material even after harvesting. Understanding how it moves with humidity shifts is the difference between a door that sticks and one that glides for fifty years.'
          ]
        }
      ],
      conclusion: 'Craft is patience made visible.'
    }
  },
  {
    slug: 'why-we-still-build-physical-models',
    title: 'Why we still build physical models',
    category: 'Studio',
    date: 'Jan 2026',
    readTime: '5 min read',
    author: {
      name: 'SS Architects & Interiors Team',
      role: 'Design Lab',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80',
    excerpt: 'In a digital 3D rendering world, tactile basswood and brass scale models reveal spatial truth.',
    content: {
      intro: '3D software renders shadows; physical models capture light.',
      sections: [
        {
          heading: 'Tactile Intelligence',
          paragraphs: [
            'Holding a 1:50 scale model under real sunlight unveils shadow angles and spatial volumetric relationships that no computer monitor can replicate.'
          ]
        }
      ],
      conclusion: 'The hand thinks before the computer calculates.'
    }
  },
  {
    slug: 'lighting-a-room-the-way-you-would-light-a-face',
    title: 'Lighting a room the way you would light a face',
    category: 'Lighting',
    date: 'Nov 2025',
    readTime: '8 min read',
    author: {
      name: 'Norah Sen',
      role: 'Principal Partner',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=80',
    excerpt: 'Low-glare indirect illumination, warm kelvin temperatures, and light bouncing off natural wall textures.',
    content: {
      intro: 'Over-illuminated ceiling grids destroy architectural mood. True lighting design is about shadow management.',
      sections: [
        {
          heading: 'The Warmth of Concealed Light',
          paragraphs: [
            'Hiding light sources behind cove ledges and allowing warm 2700K illumination to wash across textured lime plaster creates intimacy and calm.'
          ]
        }
      ],
      conclusion: 'Light is the brush; shadow is the canvas.'
    }
  }
];
