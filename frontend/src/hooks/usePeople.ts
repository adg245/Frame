import { useQuery } from '@tanstack/react-query';
import { peopleService } from '@/services/people.service';
import { peopleKeys } from './useMovies';

export function usePersonDetails(id: number | string | undefined) {
  return useQuery({
    queryKey: peopleKeys.detail(id ?? ''),
    queryFn: () => peopleService.getDetails(id!),
    enabled: !!id,
  });
}

export function usePersonMovieCredits(id: number | string | undefined) {
  return useQuery({
    queryKey: peopleKeys.credits(id ?? ''),
    queryFn: () => peopleService.getMovieCredits(id!),
    enabled: !!id,
  });
}
