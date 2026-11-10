// Re-exports react-hot-toast with FRAME-styled helpers
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import React from 'react';

export { toast };

export const notify = {
  success: (msg: string) =>
    toast.success(msg, { icon: React.createElement(CheckCircle, { size: 16, color: 'var(--success)' }) }),
  error: (msg: string) =>
    toast.error(msg, { icon: React.createElement(XCircle, { size: 16, color: 'var(--danger)' }) }),
  info: (msg: string) =>
    toast(msg, { icon: React.createElement(Info, { size: 16, color: 'var(--accent)' }) }),
  warn: (msg: string) =>
    toast(msg, { icon: React.createElement(AlertTriangle, { size: 16, color: 'var(--rating-gold)' }) }),
};
