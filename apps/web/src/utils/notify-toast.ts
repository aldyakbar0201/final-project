import { toast, ToastOptions } from 'react-toastify';

export function notify(message: string, options?: ToastOptions) {
  return toast(message, options);
}
