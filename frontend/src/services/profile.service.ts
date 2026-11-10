import { apiClient } from '@/lib/api';
import type { UserProfile } from '@/types/user';
import type { ThemeId } from '@/types/theme';

interface UpdateProfileInput {
  displayName?: string;
  avatarUrl?: string | null;
  preferredLanguage?: string;
  preferredRegion?: string;
}

export const profileService = {
  get: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get('/profile');
    return data;
  },

  update: async (input: UpdateProfileInput): Promise<UserProfile> => {
    const { data } = await apiClient.put('/profile', input);
    return data;
  },

  updateTheme: async (theme: ThemeId): Promise<UserProfile> => {
    const { data } = await apiClient.put('/profile/theme', { theme });
    return data;
  },
};
