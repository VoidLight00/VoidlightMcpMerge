import { useEffect } from 'react';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastViewport,
} from '../ui/toast';
import { useMcpStore } from '../../store/mcpStore';

export function ToastNotification() {
  const { toastMessage, setToastMessage } = useMcpStore();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, setToastMessage]);

  return (
    <ToastProvider>
      {toastMessage && (
        <Toast
          open={!!toastMessage}
          onOpenChange={(open) => !open && setToastMessage(null)}
          variant={toastMessage.startsWith('Error') ? 'destructive' : 'default'}
        >
          <ToastDescription>{toastMessage}</ToastDescription>
          <ToastClose />
        </Toast>
      )}
      <ToastViewport />
    </ToastProvider>
  );
}
