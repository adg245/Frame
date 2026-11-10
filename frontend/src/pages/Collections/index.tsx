import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Library, Plus, Film, Edit3, Trash2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { Input, Textarea } from '@/components/ui/Input';
import { EmptyState } from '@/components/ui/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import {
  useCollections, useCreateCollection, useUpdateCollection, useDeleteCollection,
} from '@/hooks/useCollections';
import { buildRoute, ROUTES } from '@/lib/routes';
import type { MovieCollection } from '@/types/user';

const PALETTE = [
  'linear-gradient(135deg, #1a1a2e, #16213e)',
  'linear-gradient(135deg, #1e0a0a, #3d1515)',
  'linear-gradient(135deg, #0a1a0e, #1a3d20)',
  'linear-gradient(135deg, #1a0e2e, #2d1b5e)',
  'linear-gradient(135deg, #1a150a, #3d2e14)',
  'linear-gradient(135deg, #0a1a1a, #143d3d)',
];

function CollectionCard({ collection, index, onEdit, onDelete }: {
  collection: MovieCollection; index: number; onEdit: () => void; onDelete: () => void;
}) {
  const color = PALETTE[index % PALETTE.length];
  return (
    <motion.div whileHover={{ y: -2 }} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] overflow-hidden group">
      <Link to={buildRoute.collection(collection.id)} className="block">
        <div className="h-20 relative" style={{ background: color }}>
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/20" />
        </div>
      </Link>
      <div className="relative -mt-20 h-20 flex justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex gap-1">
          <button onClick={(e) => { e.preventDefault(); onEdit(); }} className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
            <Edit3 size={12} />
          </button>
          <button onClick={(e) => { e.preventDefault(); onDelete(); }} className="w-7 h-7 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-red-500/60 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
      <Link to={buildRoute.collection(collection.id)} className="block p-4 -mt-4">
        <h3 className="font-semibold text-sm text-[var(--text-primary)] mb-1 line-clamp-1">{collection.name}</h3>
        {collection.description && <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3">{collection.description}</p>}
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
          <Film size={11} />
          {collection.movieCount ?? collection.movies?.length ?? 0} {(collection.movieCount ?? 0) === 1 ? 'film' : 'films'}
        </div>
      </Link>
    </motion.div>
  );
}

export default function CollectionsPage() {
  const { user } = useAuth();
  const { data: collections, isLoading } = useCollections();
  const createCollection = useCreateCollection();
  const deleteCollection = useDeleteCollection();

  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<MovieCollection | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MovieCollection | null>(null);
  const [name, setName] = useState('');
  const [description, setDesc] = useState('');

  const updateCollection = useUpdateCollection(editTarget?.id ?? '');

  const openCreate = () => { setName(''); setDesc(''); setCreateOpen(true); };
  const openEdit = (c: MovieCollection) => { setName(c.name); setDesc(c.description ?? ''); setEditTarget(c); };

  const handleCreate = () => {
    if (!name.trim()) return;
    createCollection.mutate({ name: name.trim(), description: description.trim() || undefined }, {
      onSuccess: () => setCreateOpen(false),
    });
  };

  const handleUpdate = () => {
    if (!name.trim() || !editTarget) return;
    updateCollection.mutate({ name: name.trim(), description: description.trim() || null }, {
      onSuccess: () => setEditTarget(null),
    });
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteCollection.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
  };

  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] mb-1">Collections</h1>
          <p className="text-[var(--text-secondary)] text-sm">Curate films into personal collections.</p>
        </div>
        <div className="p-6 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] flex items-start gap-3">
          <Lock size={16} className="text-[var(--accent)] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-[var(--text-primary)]">Sign in to create collections</p>
            <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
              Build curated lists like "Favourite Movies" or "Christopher Nolan Collection" — saved to your account and available on every device.
            </p>
            <Link to={ROUTES.LOGIN} className="inline-block mt-3"><Button size="sm" variant="accent-outline">Sign In</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-10">
      <div className="flex items-start justify-between mb-8 gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold text-[var(--text-primary)] mb-1">Collections</h1>
          <p className="text-[var(--text-secondary)] text-sm">Curate films into personal collections.</p>
        </div>
        <Button size="sm" icon={<Plus size={14} />} onClick={openCreate}>New Collection</Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-44 skeleton rounded-2xl" />)}
        </div>
      ) : !collections || collections.length === 0 ? (
        <EmptyState
          icon={<Library size={24} />}
          title="No collections yet"
          description="Create your first collection to start curating your favourite films."
          action={<Button size="sm" variant="accent-outline" icon={<Plus size={14} />} onClick={openCreate}>New Collection</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {collections.map((c, i) => (
            <CollectionCard key={c.id} collection={c} index={i} onEdit={() => openEdit(c)} onDelete={() => setDeleteTarget(c)} />
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="New Collection" size="sm">
        <div className="flex flex-col gap-4">
          <Input label="Collection name" placeholder="e.g. My Favourite Noirs" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea label="Description (optional)" placeholder="What's this collection about?" value={description} onChange={(e) => setDesc(e.target.value)} rows={3} />
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="ghost" size="sm" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button size="sm" disabled={!name.trim()} loading={createCollection.isPending} onClick={handleCreate}>Create</Button>
          </div>
        </div>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editTarget} onClose={() => setEditTarget(null)} title="Edit Collection" size="sm">
        <div className="flex flex-col gap-4">
          <Input label="Collection name" value={name} onChange={(e) => setName(e.target.value)} />
          <Textarea label="Description (optional)" value={description} onChange={(e) => setDesc(e.target.value)} rows={3} />
          <div className="flex gap-2 justify-end pt-1">
            <Button variant="ghost" size="sm" onClick={() => setEditTarget(null)}>Cancel</Button>
            <Button size="sm" disabled={!name.trim()} loading={updateCollection.isPending} onClick={handleUpdate}>Save</Button>
          </div>
        </div>
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete collection?"
        description={`"${deleteTarget?.name}" and all its movies will be permanently removed. This can't be undone.`}
        confirmLabel="Delete"
        loading={deleteCollection.isPending}
      />
    </div>
  );
}
