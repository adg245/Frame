import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '@/services/profile.service';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from '@/components/ui/Toast';
import type { ThemeId } from '@/types/theme';

const PROFILE_KEY = ['profile'] as const;

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: PROFILE_KEY,
    queryFn: profileService.get,
    enabled: !!user,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.update,
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEY, data);
      notify.success('Profile updated');
    },
    onError: () => notify.error('Could not update profile'),
  });
}

export function useUpdateProfileTheme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (theme: ThemeId) => profileService.updateTheme(theme),
    onSuccess: (data) => {
      queryClient.setQueryData(PROFILE_KEY, data);
    },
    onError: () => notify.error('Could not sync theme to your account'),
  });
}
