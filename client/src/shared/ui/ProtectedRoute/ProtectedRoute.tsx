import { Navigate } from "react-router-dom";
import { useUserStore } from "@/entities/User";
import type { UserRole } from "@/entities/User";

interface ProtectedRouteProps {
	children: React.ReactNode;
	requireRole?: UserRole;
	redirectTo?: string;
}

export const ProtectedRoute = ({
	children,
	requireRole,
	redirectTo = "/login",
}: ProtectedRouteProps) => {
	const { isAuthenticated, user, isLoading } = useUserStore();

	// Show loading state while checking authentication
	if (isLoading) {
		return (
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					minHeight: "50vh",
					fontSize: "var(--text-lg)",
					color: "var(--color-text-light)",
				}}
			>
				Loading...
			</div>
		);
	}

	// Redirect to login if not authenticated
	if (!isAuthenticated || !user) {
		return <Navigate to={redirectTo} replace />;
	}

	// Check role if specified
	if (requireRole && user.role !== requireRole) {
		return <Navigate to="/" replace />;
	}

	return <>{children}</>;
};
