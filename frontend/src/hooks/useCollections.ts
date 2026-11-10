import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { collectionsService } from '@/services/collections.service';
import { useAuth } from '@/contexts/AuthContext';
import { notify } from '@/components/ui/Toast';

export const collectionKeys = {
  all:    ['collections'] as const,
  list:   () => [...collectionKeys.all, 'list'] as const,
  detail: (id: string) => [...collectionKeys.all, 'detail', id] as const,
};

export function useCollections() {
  const { user } = useAuth();
  return useQuery({
    queryKey: collectionKeys.list(),
    queryFn: collectionsService.list,
    enabled: !!user,
  });
}

export function useCollection(id: string | undefined) {
  const { user } = useAuth();
  return useQuery({
    queryKey: collectionKeys.detail(id ?? ''),
    queryFn: () => collectionsService.get(id!),
    enabled: !!user && !!id,
  });
}

export function useCreateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, description }: { name: string; description?: string }) =>
      collectionsService.create(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      notify.success('Collection created');
    },
    onError: () => notify.error('Could not create collection'),
  });
}

export function useUpdateCollection(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { name?: string; description?: string | null }) => collectionsService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(id) });
      notify.success('Collection updated');
    },
    onError: () => notify.error('Could not update collection'),
  });
}

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => collectionsService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      notify.success('Collection deleted');
    },
    onError: () => notify.error('Could not delete collection'),
  });
}

export function useAddMovieToCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, tmdbMovieId }: { collectionId: string; tmdbMovieId: number }) =>
      collectionsService.addMovie(collectionId, tmdbMovieId),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(vars.collectionId) });
      notify.success('Added to collection');
    },
    onError: () => notify.error('Could not add movie to collection'),
  });
}

export function useRemoveMovieFromCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, tmdbMovieId }: { collectionId: string; tmdbMovieId: number }) =>
      collectionsService.removeMovie(collectionId, tmdbMovieId),
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.list() });
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(vars.collectionId) });
      notify.success('Removed from collection');
    },
    onError: () => notify.error('Could not remove movie'),
  });
}

export function useReorderCollectionMovies(collectionId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (movieIds: string[]) => collectionsService.reorder(collectionId, movieIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: collectionKeys.detail(collectionId) });
    },
    onError: () => notify.error('Could not reorder movies'),
  });
}
