export type ThemeId =
  | 'cinema-night'
  | 'noir'
  | 'burgundy-premiere'
  | 'midnight-blue'
  | 'forest-cinema'
  | 'ivory-matinee';

export interface Theme {
  id: ThemeId;
  name: string;
  description: string;
  palette: {
    bgMain: string;
    bgSecondary: string;
    bgCard: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    border: string;
  };
}

export const THEMES: Theme[] = [
  {
    id: 'cinema-night',
    name: 'Cinema Night',
    description: 'Deep charcoal, warm ivory text, muted gold accents.',
    palette: {
      bgMain: '#101114',
      bgSecondary: '#181A1F',
      bgCard: '#20232A',
      textPrimary: '#F1EFE8',
      textSecondary: '#A8A9AE',
      accent: '#C6A66B',
      border: '#30333A',
    },
  },
  {
    id: 'noir',
    name: 'Noir',
    description: 'Near-black backgrounds, silver accents, high-contrast monochrome.',
    palette: {
      bgMain: '#0C0C0D',
      bgSecondary: '#141416',
      bgCard: '#1C1C1F',
      textPrimary: '#E8E8E8',
      textSecondary: '#8A8A8F',
      accent: '#B0B0B8',
      border: '#2A2A2E',
    },
  },
  {
    id: 'burgundy-premiere',
    name: 'Burgundy Premiere',
    description: 'Deep burgundy backgrounds, muted rose and champagne accents.',
    palette: {
      bgMain: '#120B0E',
      bgSecondary: '#1C1015',
      bgCard: '#26161C',
      textPrimary: '#F0E8E8',
      textSecondary: '#B09898',
      accent: '#C4869A',
      border: '#3A2028',
    },
  },
  {
    id: 'midnight-blue',
    name: 'Midnight Blue',
    description: 'Dark navy backgrounds, muted blue accents, cool modern feel.',
    palette: {
      bgMain: '#0A0D14',
      bgSecondary: '#10141E',
      bgCard: '#181D2A',
      textPrimary: '#E8EDF5',
      textSecondary: '#8A96B0',
      accent: '#7B9FD4',
      border: '#22283A',
    },
  },
  {
    id: 'forest-cinema',
    name: 'Forest Cinema',
    description: 'Deep forest-green backgrounds, muted olive and sage accents.',
    palette: {
      bgMain: '#0A0F0C',
      bgSecondary: '#0F1611',
      bgCard: '#161E18',
      textPrimary: '#E8EDE8',
      textSecondary: '#8A9E8A',
      accent: '#7DAE82',
      border: '#1E2E20',
    },
  },
  {
    id: 'ivory-matinee',
    name: 'Ivory Matinee',
    description: 'Warm ivory backgrounds, dark charcoal text, muted bronze accents.',
    palette: {
      bgMain: '#F5F0E8',
      bgSecondary: '#EDE8DF',
      bgCard: '#E6E0D6',
      textPrimary: '#1A1814',
      textSecondary: '#5A5650',
      accent: '#8B6E3C',
      border: '#D0C8BC',
    },
  },
];
