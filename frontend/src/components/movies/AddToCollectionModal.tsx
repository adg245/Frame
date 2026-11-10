import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Film, Check, Lock } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/contexts/AuthContext';
import { useCollections, useCreateCollection, useAddMovieToCollection } from '@/hooks/useCollections';
import { ROUTES } from '@/lib/routes';
import type { Movie } from '@/types/movie';

interface AddToCollectionModalProps {
  open: boolean;
  onClose: () => void;
  movie: Movie;
}

export function AddToCollectionModal({ open, onClose, movie }: AddToCollectionModalProps) {
  const { user } = useAuth();
  const { data: collections, isLoading } = useCollections();
  const addMovie = useAddMovieToCollection();
  const createCollection = useCreateCollection();

  const [creatingNew, setCreatingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [addedTo, setAddedTo] = useState<Set<string>>(new Set());

  const handleAdd = (collectionId: string) => {
    addMovie.mutate(
      { collectionId, tmdbMovieId: movie.id },
      { onSuccess: () => setAddedTo((prev) => new Set(prev).add(collectionId)) }
    );
  };

  const handleCreateAndAdd = async () => {
    if (!newName.trim()) return;
    createCollection.mutate(
      { name: newName.trim() },
      {
        onSuccess: (collection) => {
          handleAdd(collection.id);
          setNewName('');
          setCreatingNew(false);
        },
      }
    );
  };

  if (!user) {
    return (
      <Modal open={open} onClose={onClose} title="Sign in required" size="sm">
        <div className="text-center py-4">
          <Lock size={28} className="text-[var(--text-muted)] mx-auto mb-4" />
          <p className="text-sm text-[var(--text-secondary)] mb-5">
            Sign in to add movies to your personal collections.
          </p>
          <Link to={ROUTES.LOGIN}><Button size="sm">Sign In</Button></Link>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={`Add "${movie.title}" to…`} size="sm">
      <div className="flex flex-col gap-2 max-h-80 overflow-y-auto -mx-1 px-1">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-11 skeleton rounded-lg" />)
        ) : collections && collections.length > 0 ? (
          collections.map((c) => {
            const isAdded = addedTo.has(c.id);
            return (
              <button
                key={c.id}
                onClick={() => !isAdded && handleAdd(c.id)}
                disabled={isAdded || addMovie.isPending}
                className={[
                  'flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg border text-left transition-colors',
                  isAdded
                    ? 'border-[var(--success)]/40 bg-[var(--success)]/10 cursor-default'
                    : 'border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--accent)]',
                ].join(' ')}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Film size={14} className="text-[var(--text-muted)] shrink-0" />
                  <span className="text-sm text-[var(--text-primary)] truncate">{c.name}</span>
                </div>
                {isAdded
                  ? <Check size={15} className="text-[var(--success)] shrink-0" />
                  : <span className="text-xs text-[var(--text-muted)] shrink-0">{c.movieCount ?? 0}</span>}
              </button>
            );
          })
        ) : (
          <p className="text-sm text-[var(--text-muted)] text-center py-4">No collections yet.</p>
        )}
      </div>

      <div className="border-t border-[var(--border)] mt-4 pt-4">
        {creatingNew ? (
          <div className="flex flex-col gap-2">
            <Input
              placeholder="Collection name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={() => setCreatingNew(false)}>Cancel</Button>
              <Button
                size="sm"
                disabled={!newName.trim()}
                loading={createCollection.isPending}
                onClick={handleCreateAndAdd}
              >
                Create &amp; Add
              </Button>
            </div>
          </div>
        ) : (
          <Button size="sm" variant="secondary" icon={<Plus size={13} />} onClick={() => setCreatingNew(true)} fullWidth>
            New Collection
          </Button>
        )}
      </div>
    </Modal>
  );
}
