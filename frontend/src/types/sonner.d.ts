declare module 'sonner' {
  // Minimal shim for sonner used in this project
  export type ToastOptions = Record<string, unknown>;
  export const toast: {
    (message: string, opts?: ToastOptions): void;
    success(message: string, opts?: ToastOptions): void;
    error(message: string, opts?: ToastOptions): void;
  };
  import * as React from 'react';
  export const Toaster: React.ComponentType<Record<string, unknown>>;
  export default toast;
}
