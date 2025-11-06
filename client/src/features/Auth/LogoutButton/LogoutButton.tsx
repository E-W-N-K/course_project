import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "@/entities/User";
import { useCartStore } from "@/entities/Cart";
import { UIButton, type UIButtonProps } from "@/shared/ui/UIButton/UIButton";

interface LogoutButtonProps {
	variant?: UIButtonProps["variant"];
	colorType?: UIButtonProps["colorType"];
	children?: React.ReactNode;
}

export const LogoutButton = ({
	variant = "outline",
	colorType = "secondary",
	children = "Logout",
}: LogoutButtonProps) => {
	const navigate = useNavigate();
	const logout = useUserStore((state) => state.logout);
	const [isLoading, setIsLoading] = useState(false);

	const handleLogout = async () => {
		setIsLoading(true);
		try {
			await logout();
			// Clear cart state on logout
			useCartStore.setState({ cart: null, isLoading: false });
			navigate("/login");
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<UIButton
			onClick={handleLogout}
			variant={variant}
			colorType={colorType}
			disabled={isLoading}
		>
			{isLoading ? "Logging out..." : children}
		</UIButton>
	);
};
