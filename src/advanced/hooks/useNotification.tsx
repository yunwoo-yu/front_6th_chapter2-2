import {
  useState,
  useCallback,
  createContext,
  PropsWithChildren,
  useMemo,
  useContext,
  memo,
} from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
}

export interface NotificationContextActionsTypes {
  addNotification: (message: string, type: NotificationType) => void;
  removeNotification: (id: string) => void;
}

const NotificationContext = createContext<Notification[]>([]);
const NotificationContextActions =
  createContext<NotificationContextActionsTypes>({
    addNotification: () => {},
    removeNotification: () => {},
  });

export const NotificationProvider = memo(({ children }: PropsWithChildren) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback(
    (message: string, type: NotificationType = "success") => {
      const id = Date.now().toString();
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 3000);
    },
    []
  );

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const actions = useMemo(
    () => ({
      addNotification,
      removeNotification,
    }),
    [addNotification, removeNotification]
  );

  return (
    <NotificationContext.Provider value={notifications}>
      <NotificationContextActions.Provider value={actions}>
        {children}
      </NotificationContextActions.Provider>
    </NotificationContext.Provider>
  );
});

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("NotificationContext is not found");
  }

  return context;
};

export const useNotificationActions = () => {
  const context = useContext(NotificationContextActions);

  if (!context) {
    throw new Error("NotificationContextActions is not found");
  }

  return context;
};
