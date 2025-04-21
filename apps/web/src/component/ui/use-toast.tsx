import { useState } from 'react';

interface Toast {
  title: string;
  description: string;
  variant?: string;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Toast) => {
    setToasts((prevToasts) => [...prevToasts, toast]);
  };

  return {
    toast: addToast,
    toasts,
  };
}
