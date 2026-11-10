import { getPrisma } from '../config/prisma';
import type { ThemeId } from '../validators/profile.validator';

interface UpdateProfileInput {
  displayName?: string;
  avatarUrl?: string | null;
  preferredLanguage?: string;
  preferredRegion?: string;
}

/**
 * Derives a sensible default display name from the Supabase auth email
 * the first time a profile is created (e.g. "jane.doe@x.com" -> "jane.doe").
 */
function defaultDisplayName(email?: string): string {
  if (!email) return 'FRAME User';
  return email.split('@')[0];
}

export const profileService = {
  /**
   * Fetches the profile for an authenticated user, creating one with
   * sensible defaults on first access ("get or create" — a Supabase user
   * exists before any FRAME-specific profile row does).
   */
  async getOrCreate(authUserId: string, email?: string) {
    const prisma = getPrisma();

    let profile = await prisma.profile.findUnique({ where: { authUserId } });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          authUserId,
          displayName: defaultDisplayName(email),
        },
      });
    }

    return profile;
  },

  async update(authUserId: string, input: UpdateProfileInput) {
    const prisma = getPrisma();

    // Ensure the profile exists before updating (handles edge case where
    // update is called before any GET has run get-or-create).
    await profileService.getOrCreate(authUserId);

    return prisma.profile.update({
      where: { authUserId },
      data: input,
    });
  },

  async updateTheme(authUserId: string, theme: ThemeId) {
    const prisma = getPrisma();

    await profileService.getOrCreate(authUserId);

    return prisma.profile.update({
      where: { authUserId },
      data: { preferredTheme: theme },
    });
  },
};
