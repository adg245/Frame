import { getPrisma } from '../config/prisma';
import { profileService } from './profile.service';

function serialize(entry: {
  id: string; userId: string; tmdbMovieId: number; currentPosition: number;
  duration: number | null; completed: boolean; lastWatchedAt: Date; createdAt: Date; updatedAt: Date;
}) {
  return {
    id: entry.id,
    userId: entry.userId,
    tmdbMovieId: entry.tmdbMovieId,
    currentPosition: entry.currentPosition,
    duration: entry.duration,
    completed: entry.completed,
    lastWatchedAt: entry.lastWatchedAt.toISOString(),
    createdAt: entry.createdAt.toISOString(),
    updatedAt: entry.updatedAt.toISOString(),
  };
}

export const historyService = {
  /** All watch-history entries for a user, most recently watched first. */
  async list(authUserId: string) {
    const prisma = getPrisma();
    const profile = await profileService.getOrCreate(authUserId);

    const entries = await prisma.watchHistory.findMany({
      where: { userId: profile.id },
      orderBy: { lastWatchedAt: 'desc' },
    });
    return entries.map(serialize);
  },

  /** The watch-history entry for one specific movie, or null if never started. */
  async getForMovie(authUserId: string, tmdbMovieId: number) {
    const prisma = getPrisma();
    const profile = await profileService.getOrCreate(authUserId);

    const entry = await prisma.watchHistory.findUnique({
      where: { userId_tmdbMovieId: { userId: profile.id, tmdbMovieId } },
    });
    return entry ? serialize(entry) : null;
  },

  /**
   * Creates or updates the progress for a movie. Called repeatedly during
   * playback (throttled on the frontend), so this must stay cheap and
   * idempotent — a single upsert keyed on the (userId, tmdbMovieId) unique
   * constraint rather than a read-then-write.
   */
  async upsert(
    authUserId: string,
    input: { tmdbMovieId: number; currentPosition: number; duration?: number; completed?: boolean }
  ) {
    const prisma = getPrisma();
    const profile = await profileService.getOrCreate(authUserId);

    const entry = await prisma.watchHistory.upsert({
      where: { userId_tmdbMovieId: { userId: profile.id, tmdbMovieId: input.tmdbMovieId } },
      create: {
        userId: profile.id,
        tmdbMovieId: input.tmdbMovieId,
        currentPosition: input.currentPosition,
        duration: input.duration,
        completed: input.completed ?? false,
      },
      update: {
        currentPosition: input.currentPosition,
        ...(input.duration !== undefined ? { duration: input.duration } : {}),
        ...(input.completed !== undefined ? { completed: input.completed } : {}),
        lastWatchedAt: new Date(),
      },
    });

    return serialize(entry);
  },
};
