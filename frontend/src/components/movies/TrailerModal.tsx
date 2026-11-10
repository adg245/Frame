import React from 'react';
import { Modal } from '@/components/ui/Modal';
import type { Video } from '@/types/movie';

interface TrailerModalProps {
  video: Video | null;
  open: boolean;
  onClose: () => void;
}

export function TrailerModal({ video, open, onClose }: TrailerModalProps) {
  if (!video) return null;

  return (
    <Modal open={open} onClose={onClose} title={video.name} size="xl" hideClose={false}>
      <div className="relative w-full rounded-xl overflow-hidden bg-black" style={{ aspectRatio: '16/9' }}>
        {open && (
          <iframe
            src={`https://www.youtube.com/embed/${video.key}?autoplay=1&rel=0`}
            title={video.name}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>
    </Modal>
  );
}
