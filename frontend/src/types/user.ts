import type { ThemeId } from './theme';

export interface UserProfile {
  id: string;
  authUserId: string;
  displayName: string;
  avatarUrl: string | null;
  preferredTheme: ThemeId;
  preferredLanguage: string;
  preferredRegion: string;
  createdAt: string;
  updatedAt: string;
}

export type WatchlistStatus =
  | 'planning'
  | 'watching'
  | 'watched'
  | 'on_hold'
  | 'dropped';

export interface WatchlistEntry {
  id: string;
  userId: string;
  tmdbMovieId: number;
  status: WatchlistStatus;
  addedAt: string;
  updatedAt: string;
}

export interface WatchHistoryEntry {
  id: string;
  userId: string;
  tmdbMovieId: number;
  currentPosition: number;
  duration: number | null;
  completed: boolean;
  lastWatchedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CollectionMovie {
  id: string;
  collectionId?: string;
  tmdbMovieId: number;
  position: number;
  addedAt: string;
}

export interface MovieCollection {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  movieCount?: number;
  movies?: CollectionMovie[];
}
