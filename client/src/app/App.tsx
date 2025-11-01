import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import { HomePage } from "../pages/HomePage";
import { UIPage } from "../pages/UIPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { Header } from "../widgets/Header";
import { ProtectedRoute } from "../shared/ui/ProtectedRoute";
import { useUserStore } from "../entities/User";
import { UIContainer } from "../shared/ui";
import "./App.css";
import styles from "./App.module.css";

// Placeholder component for restaurant menu page
const RestaurantMenuPage = () => {
	const { id } = useParams();
	return (
		<UIContainer>
			<h1>Restaurant Menu</h1>
			<p>Menu page for restaurant #{id} - Coming soon!</p>
		</UIContainer>
	);
};

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
								<RestaurantMenuPage />
							</ProtectedRoute>
						}
					/>

					<Route
						path="/ui"
						element={
							<ProtectedRoute>
								<UIPage />
							</ProtectedRoute>
						}
					/>

					{/* Future admin routes can use: */}
					{/* <Route path="/admin" element={<ProtectedRoute requireRole="admin"><AdminPage /></ProtectedRoute>} /> */}
				</Routes>
			</main>
		</BrowserRouter>
	);
}

export default App;
