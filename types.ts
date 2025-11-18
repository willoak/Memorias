export interface Memory {
  id: string;
  content: string;
  timestamp: number;
  dateFormatted: string;
  dayOfWeek: string;
  time: string;
  location?: {
    lat: number;
    lng: number;
    text: string;
  };
  weather: {
    description: string;
    temp?: string;
    isRaining?: boolean;
  };
  enrichment: {
    mood: string;
    colorHex: string;
    musicVibe: string;
    tags: string[];
    poeticSummary: string;
  };
  generatedImageUrl?: string;
}

export type ViewState = 'LIST' | 'CREATE' | 'VIEW';

export interface GeoPosition {
  lat: number;
  lng: number;
}