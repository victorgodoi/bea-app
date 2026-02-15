import { Notification, NotificationType } from '@/src/components/notification';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface NotificationOptions {
  title: string;
  message?: string;
  buttonText?: string;
  onButtonPress?: () => void;
}

interface NotificationContextData {
  showNotification: (type: NotificationType, options: NotificationOptions) => void;
  success: (title: string, message?: string, onClose?: () => void) => void;
  error: (title: string, message?: string) => void;
  warn: (title: string, message?: string) => void;
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<NotificationType>('success');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState<string | undefined>();
  const [buttonText, setButtonText] = useState('OK');
  const [onButtonPress, setOnButtonPress] = useState<(() => void) | undefined>();

  const showNotification = (
    notificationType: NotificationType,
    options: NotificationOptions
  ) => {
    setType(notificationType);
    setTitle(options.title);
    setMessage(options.message);
    setButtonText(options.buttonText || 'OK');
    setOnButtonPress(() => options.onButtonPress);
    setVisible(true);
  };

  const success = (title: string, message?: string, onClose?: () => void) => {
    showNotification('success', {
      title,
      message,
      buttonText: 'OK',
      onButtonPress: onClose,
    });
  };

  const error = (title: string, message?: string) => {
    showNotification('error', {
      title,
      message,
      buttonText: 'OK',
    });
  };

  const warn = (title: string, message?: string) => {
    showNotification('warn', {
      title,
      message,
      buttonText: 'OK',
    });
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      setOnButtonPress(undefined);
    }, 300);
  };

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
    handleClose();
  };

  return (
    <NotificationContext.Provider value={{ showNotification, success, error, warn }}>
      {children}
      <Notification
        visible={visible}
        type={type}
        title={title}
        message={message}
        buttonText={buttonText}
        onClose={handleClose}
        onButtonPress={handleButtonPress}
      />
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  
  return context;
}
