import { apiClient } from '@/lib/api';
import type { Person, Movie } from '@/types/movie';

interface PersonMovieCredits {
  cast: (Movie & { character?: string })[];
  crew: (Movie & { job?: string })[];
}

export const peopleService = {
  getDetails: async (id: number | string): Promise<Person> => {
    const { data } = await apiClient.get(`/people/${id}`);
    return data;
  },

  getMovieCredits: async (id: number | string): Promise<PersonMovieCredits> => {
    const { data } = await apiClient.get(`/people/${id}/movies`);
    return data;
  },
};
