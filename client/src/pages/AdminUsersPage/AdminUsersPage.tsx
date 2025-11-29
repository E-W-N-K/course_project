import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi } from "@/entities/Admin";
import { useUserStore } from "@/entities/User";
import type { User } from "@/entities/User";
import { UIContainer } from "@/shared/ui/UIContainer";
import { UITable } from "@/shared/ui/UITable";
import type { UITableColumn } from "@/shared/ui/UITable";
import { UIButton } from "@/shared/ui/UIButton/UIButton";
import { UIBadge } from "@/shared/ui/UIBadge";
import { UIDialog, UIFlex, UISection } from "@/shared/ui";
import type { UIDialogRef } from "@/shared/ui/UIDialog";
import styles from "./AdminUsersPage.module.css";

export const AdminUsersPage = () => {
	const currentUser = useUserStore((state) => state.user);
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [userToDelete, setUserToDelete] = useState<User | null>(null);
	const [message, setMessage] = useState<{
		type: "success" | "error";
		text: string;
	} | null>(null);
	const deleteDialogRef = useRef<UIDialogRef>(null);

	const fetchUsers = useCallback(async () => {
		setIsLoading(true);
		try {
			const data = await adminApi.getAllUsers();
			setUsers(data);
		} catch (error) {
			console.error("Failed to fetch users:", error);
			showMessage("error", "Failed to load users");
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const handleDeleteClick = (user: User) => {
		setUserToDelete(user);
		deleteDialogRef.current?.open();
	};

	const handleCancelDelete = () => {
		deleteDialogRef.current?.close();
		setUserToDelete(null);
	};

	const handleConfirmDelete = async () => {
		if (!userToDelete) return;

		try {
			await adminApi.deleteUser(userToDelete.id);
			showMessage(
				"success",
				`User "${userToDelete.name}" deleted successfully`,
			);
			deleteDialogRef.current?.close();
			setUserToDelete(null);
			await fetchUsers();
		} catch (error) {
			console.error("Failed to delete user:", error);
			showMessage("error", "Failed to delete user");
			deleteDialogRef.current?.close();
			setUserToDelete(null);
		}
	};

	const showMessage = (type: "success" | "error", text: string) => {
		setMessage({ type, text });
		setTimeout(() => setMessage(null), 3000);
	};

	const columns: UITableColumn<User>[] = [
		{
			key: "id",
			header: "User ID",
			render: (user) => `#${user.id}`,
		},
		{
			key: "name",
			header: "Name",
		},
		{
			key: "email",
			header: "Email",
		},
		{
			key: "role",
			header: "Role",
			render: (user) => (
				<UIBadge variant={user.role === "ADMIN" ? "primary" : "secondary"}>
					{user.role}
				</UIBadge>
			),
		},
		{
			key: "actions",
			header: "Actions",
			render: (user) => {
				const isCurrentUser = Boolean(
					currentUser && user.name === currentUser.name,
				);

				return (
					<UIButton
						variant="outline"
						colorType="danger"
						onClick={() => handleDeleteClick(user)}
						disabled={isCurrentUser}
						title={isCurrentUser ? "Cannot delete current user" : undefined}
					>
						Delete
					</UIButton>
				);
			},
		},
	];

	return (
		<UISection>
			<UIContainer className={styles["admin-users-page"]}>
				<div className={styles["admin-users-page__header"]}>
					<h1 className={styles["admin-users-page__title"]}>Manage Users</h1>
					<p className={styles["admin-users-page__subtitle"]}>
						View and delete user accounts
					</p>
				</div>

				{message && (
					<div
						className={`${styles["admin-users-page__message"]} ${styles[`admin-users-page__message--${message.type}`]}`}
					>
						{message.text}
					</div>
				)}

				{isLoading ? (
					<p className={styles["admin-users-page__loading"]}>
						Loading users...
					</p>
				) : (
					<UITable columns={columns} data={users} />
				)}

				<UIDialog
					ref={deleteDialogRef}
					title="Delete User"
					size="md"
					onClose={handleCancelDelete}
					footer={
						<UIFlex>
							<UIButton
								variant="outline"
								colorType="secondary"
								onClick={handleCancelDelete}
							>
								Cancel
							</UIButton>
							<UIButton
								variant="solid"
								colorType="danger"
								onClick={handleConfirmDelete}
							>
								Delete User
							</UIButton>
						</UIFlex>
					}
				>
					{userToDelete && (
						<p className={"text"}>
							Are you sure you want to delete this user? <br />
							<strong>Name:</strong> {userToDelete.name} <br />
							<strong>Email:</strong> {userToDelete.email}
						</p>
					)}
				</UIDialog>
			</UIContainer>
		</UISection>
	);
};
