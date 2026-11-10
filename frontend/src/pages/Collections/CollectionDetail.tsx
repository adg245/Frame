import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Plus, Edit3, Trash2, Film, ChevronUp, ChevronDown, Lock, X,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { AddMovieSearchModal } from '@/components/movies/AddMovieSearchModal';
import { useAuth } from '@/contexts/AuthContext';
import {
  useCollection, useUpdateCollection, useDeleteCollection,
  useAddMovieToCollection, useRemoveMovieFromCollection, useReorderCollectionMovies,
} from '@/hooks/useCollections';
import { useMoviesByIds } from '@/hooks/useMovies';
import { tmdbImage, formatYear } from '@/utils/tmdb';
import { buildRoute, ROUTES } from '@/lib/routes';

export default function CollectionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: collection, isLoading } = useCollection(id);
  const updateCollection = useUpdateCollection(id ?? '');
  const deleteCollection = useDeleteCollection();
  const addMovie = useAddMovieToCollection();
  const removeMovie = useRemoveMovieFromCollection();
  const reorderMovies = useReorderCollectionMovies(id ?? '');

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pendingAddId, setPendingAddId] = useState<number | null>(null);

  const orderedEntries = useMemo(
    () => [...(collection?.movies ?? [])].sort((a, b) => a.position - b.position),
    [collection?.movies]
  );
  const tmdbIds = useMemo(() => orderedEntries.map((m) => m.tmdbMovieId), [orderedEntries]);
  const { movies: hydratedMovies, isLoading: moviesLoading } = useMoviesByIds(tmdbIds);

  const movieById = useMemo(() => {
    const map = new Map<number, (typeof hydratedMovies)[number]>();
    hydratedMovies.forEach((m) => map.set(m.id, m));
    return map;
  }, [hydratedMovies]);

  const existingIds = new Set(tmdbIds);

  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <Link to={ROUTES.COLLECTIONS} className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-8">
          <ArrowLeft size={15} /> Back
        </Link>
        <EmptyState icon={<Lock size={22} />} title="Sign in required" description="Sign in to view and manage your collections."
          action={<Link to={ROUTES.LOGIN}><Button size="sm">Sign In</Button></Link>} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="h-5 w-24 skeleton mb-8" />
        <div className="h-10 w-72 skeleton mb-3" />
        <div className="h-4 w-96 skeleton mb-10" />
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-poster skeleton rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-16">
        <Link to={ROUTES.COLLECTIONS} className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] mb-8">
          <ArrowLeft size={15} /> Back
        </Link>
        <EmptyState icon={<Film size={22} />} title="Collection not found" description="This collection may have been deleted, or you may not have access to it." />
      </div>
    );
  }

  const openEdit = () => { setName(collection.name); setDescription(collection.description ?? ''); setEditOpen(true); };

  const handleUpdate = () => {
    if (!name.trim()) return;
    updateCollection.mutate({ name: name.trim(), description: description.trim() || null }, { onSuccess: () => setEditOpen(false) });
  };

  const handleDelete = () => {
    if (!id) return;
    deleteCollection.mutate(id, { onSuccess: () => navigate(ROUTES.COLLECTIONS) });
  };

  const handleAddMovie = (tmdbMovieId: number) => {
    if (!id) return;
    setPendingAddId(tmdbMovieId);
    addMovie.mutate({ collectionId: id, tmdbMovieId }, { onSettled: () => setPendingAddId(null) });
  };

  const handleRemoveMovie = (tmdbMovieId: number) => {
    if (!id) return;
    removeMovie.mutate({ collectionId: id, tmdbMovieId });
  };

  const moveEntry = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= orderedEntries.length) return;
    const ids = orderedEntries.map((e) => e.id);
    [ids[index], ids[newIndex]] = [ids[newIndex], ids[index]];
    reorderMovies.mutate(ids);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <Link to={ROUTES.COLLECTIONS} className="inline-flex items-center gap-2 text-sm text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors mb-8">
        <ArrowLeft size={15} /> Back to Collections
      </Link>

      <div className="flex items-start justify-between gap-4 mb-10 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] mb-2">{collection.name}</h1>
          {collection.description && <p className="text-sm text-[var(--text-secondary)] max-w-xl">{collection.description}</p>}
          <p className="text-xs text-[var(--text-muted)] mt-2">{orderedEntries.length} {orderedEntries.length === 1 ? 'film' : 'films'}</p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" icon={<Edit3 size={13} />} onClick={openEdit}>Edit</Button>
          <Button size="sm" variant="danger" icon={<Trash2 size={13} />} onClick={() => setDeleteOpen(true)}>Delete</Button>
          <Button size="sm" icon={<Plus size={13} />} onClick={() => setSearchOpen(true)}>Add Movies</Button>
        </div>
      </div>

      {moviesLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-poster skeleton rounded-xl" />)}
        </div>
      ) : orderedEntries.length === 0 ? (
        <EmptyState
          icon={<Film size={24} />}
          title="No movies yet"
          description="Search for movies to add to this collection."
          action={<Button size="sm" variant="accent-outline" icon={<Plus size={14} />} onClick={() => setSearchOpen(true)}>Add Movies</Button>}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
          {orderedEntries.map((entry, index) => {
            const movie = movieById.get(entry.tmdbMovieId);
            if (!movie) return null;
            const posterUrl = tmdbImage.poster(movie.poster_path, 'w342');
            return (
              <motion.div
                key={entry.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative"
              >
                <Link to={buildRoute.movie(movie.id)} className="block">
                  <div className="aspect-poster rounded-xl overflow-hidden bg-[var(--bg-elevated)] border border-[var(--border)] mb-2 relative">
                    {posterUrl ? (
                      <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="font-display text-2xl text-[var(--accent)] opacity-40">{movie.title.charAt(0)}</span>
                      </div>
                    )}
                    {/* Remove button */}
                    <button
                      onClick={(e) => { e.preventDefault(); handleRemoveMovie(movie.id); }}
                      aria-label="Remove from collection"
                      className="absolute top-2 right-2 w-6 h-6 rounded-lg bg-black/70 backdrop-blur-sm flex items-center justify-center text-white opacity-0 group-hover:opacity-100 hover:bg-red-500/80 transition-all"
                    >
                      <X size={12} />
                    </button>
                    {/* Reorder controls */}
                    <div className="absolute bottom-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.preventDefault(); moveEntry(index, -1); }}
                        disabled={index === 0}
                        aria-label="Move earlier"
                        className="w-6 h-6 rounded-md bg-black/70 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/90 transition-colors"
                      >
                        <ChevronUp size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.preventDefault(); moveEntry(index, 1); }}
                        disabled={index === orderedEntries.length - 1}
                        aria-label="Move later"
                        className="w-6 h-6 rounded-md bg-black/70 backdrop-blur-sm flex items-center justify-center text-white disabled:opacity-30 hover:bg-black/90 transition-colors"
                      >
                        <ChevronDown size={12} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">{movie.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">{formatYear(movie.release_date)}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Edit modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Collection" size="sm">
        <div className="flex flex-col gap-4">
          <Input label="Collection name" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea label="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="ghost" size="sm" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button size="sm" disabled={!name.trim()} loading={updateCollection.isPending} onClick={handleUpdate}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete collection?"
        description={`"${collection.name}" and all its movies will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        loading={deleteCollection.isPending}
      />

      {/* Add movie search */}
      <AddMovieSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onAdd={handleAddMovie}
        existingIds={existingIds}
        pendingId={pendingAddId}
      />
    </div>
  );
}
