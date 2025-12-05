import { create } from "zustand";

export interface Notification {
	id: string;
	variant: "success" | "error";
	message: string;
}

interface NotificationStore {
	notifications: Notification[];

	showNotification: (variant: "success" | "error", message: string) => void;
	hideNotification: (id: string) => void;
	clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
	notifications: [],

	showNotification: (variant, message) => {
		const notification: Notification = {
			id: Date.now().toString(),
			variant,
			message,
		};

		// Add to queue
		set((state) => ({
			notifications: [...state.notifications, notification],
		}));

		// Auto-hide after 5 seconds
		setTimeout(() => {
			get().hideNotification(notification.id);
		}, 5_000);
	},

	hideNotification: (id) => {
		set((state) => ({
			notifications: state.notifications.filter((n) => n.id !== id),
		}));
	},

	clearAll: () => {
		set({ notifications: [] });
	},
}));

// Convenience functions that can be called outside React components
export const showSuccessNotification = (message: string) => {
	useNotificationStore.getState().showNotification("success", message);
};

export const showErrorNotification = (message: string) => {
	useNotificationStore.getState().showNotification("error", message);
};
