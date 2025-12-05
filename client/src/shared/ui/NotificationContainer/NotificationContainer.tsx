import { useNotificationStore } from "@/shared/model";
import { UISnackbar } from "../UISnackbar";
import styles from "./NotificationContainer.module.css";

export const NotificationContainer = () => {
	const notifications = useNotificationStore((state) => state.notifications);
	const hideNotification = useNotificationStore(
		(state) => state.hideNotification,
	);

	if (notifications.length === 0) {
		return null;
	}

	return (
		<div className={styles["notification-container"]}>
			{notifications.map((notification) => (
				<UISnackbar
					key={notification.id}
					variant={notification.variant}
					message={notification.message}
					onClose={() => hideNotification(notification.id)}
				/>
			))}
		</div>
	);
};
