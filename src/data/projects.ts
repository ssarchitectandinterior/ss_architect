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

export const projects: Project[] = [];

export const categories = ['All', 'Residential', 'Villa', 'Apartment', 'Commercial', 'Landscape', 'Interiors'] as const;
export const categoryOptions = ['Residential', 'Villa', 'Apartment', 'Commercial', 'Landscape', 'Interiors'] as const;
