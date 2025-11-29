import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { RestaurantPage } from "../pages/RestaurantPage";
import { ProfilePage } from "../pages/ProfilePage";
import { CartPage } from "../pages/CartPage";
import { UIPage } from "../pages/UIPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { AdminOrdersPage } from "../pages/AdminOrdersPage";
import { AdminUsersPage } from "../pages/AdminUsersPage";
import { Header } from "../widgets/Header";
import { BottomNav } from "../widgets/BottomNav";
import { ProtectedRoute } from "../shared/ui/ProtectedRoute";
import { useUserStore } from "../entities/User";
import "./App.css";
import styles from "./App.module.css";

function App() {
	const checkAuth = useUserStore((state) => state.checkAuth);

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

	return (
		<BrowserRouter>
			<Header />

			<main className={styles.main}>
				<Routes>
					<Route path="/login" element={<LoginPage />} />
					<Route path="/register" element={<RegisterPage />} />

					<Route
						path="/"
						element={
							<ProtectedRoute>
								<HomePage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/restaurants/:id"
						element={
							<ProtectedRoute>
								<RestaurantPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/profile"
						element={
							<ProtectedRoute requireRole="USER">
								<ProfilePage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/cart"
						element={
							<ProtectedRoute requireRole="USER">
								<CartPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/ui"
						element={
							<ProtectedRoute requireRole="ADMIN">
								<UIPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/admin/orders"
						element={
							<ProtectedRoute requireRole="ADMIN">
								<AdminOrdersPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/admin/users"
						element={
							<ProtectedRoute requireRole="ADMIN">
								<AdminUsersPage />
							</ProtectedRoute>
						}
					/>
				</Routes>
			</main>

			<BottomNav />
		</BrowserRouter>
	);
}

export default App;
