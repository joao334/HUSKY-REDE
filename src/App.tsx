import { Navigate, Route, Routes } from 'react-router-dom';
import { AppProviders } from './contexts/AppProviders';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './layouts/AppLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { LandingPage } from './pages/public/LandingPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';
import { ForgotPasswordPage } from './pages/public/ForgotPasswordPage';
import { FeedPage } from './pages/client/FeedPage';
import { MenuPage } from './pages/client/MenuPage';
import { ProductDetailPage } from './pages/client/ProductDetailPage';
import { CartPage } from './pages/client/CartPage';
import { CheckoutPage } from './pages/client/CheckoutPage';
import { OrderConfirmationPage } from './pages/client/OrderConfirmationPage';
import { OrdersPage } from './pages/client/OrdersPage';
import { ProfilePage } from './pages/client/ProfilePage';
import { LoyaltyPage } from './pages/client/LoyaltyPage';
import { RankingPage } from './pages/client/RankingPage';
import { CouponsPage } from './pages/client/CouponsPage';
import { NotificationsPage } from './pages/client/NotificationsPage';
import { ChatPage } from './pages/client/ChatPage';
import { PollsPage } from './pages/client/PollsPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminPostsPage } from './pages/admin/AdminPostsPage';
import { AdminStoriesPage } from './pages/admin/AdminStoriesPage';
import { AdminCustomersPage } from './pages/admin/AdminCustomersPage';
import { AdminCommentsPage } from './pages/admin/AdminCommentsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminInventoryPage } from './pages/admin/AdminInventoryPage';
import { AdminRecipesPage } from './pages/admin/AdminRecipesPage';
import { AdminExpensesPage } from './pages/admin/AdminExpensesPage';
import { AdminCouponsPage } from './pages/admin/AdminCouponsPage';
import { AdminPollsPage } from './pages/admin/AdminPollsPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminChatPage } from './pages/admin/AdminChatPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  return (
    <AppProviders>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<RegisterPage />} />
        <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Navigate to="/app/feed" replace />} />
            <Route path="feed" element={<FeedPage />} />
            <Route path="cardapio" element={<MenuPage />} />
            <Route path="produtos/:slug" element={<ProductDetailPage />} />
            <Route path="carrinho" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="pedido-confirmado/:orderId" element={<OrderConfirmationPage />} />
            <Route path="pedidos" element={<OrdersPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="matilha" element={<LoyaltyPage />} />
            <Route path="ranking" element={<RankingPage />} />
            <Route path="cupons" element={<CouponsPage />} />
            <Route path="notificacoes" element={<NotificationsPage />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="enquetes" element={<PollsPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute adminOnly />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="pedidos" element={<AdminOrdersPage />} />
            <Route path="produtos" element={<AdminProductsPage />} />
            <Route path="posts" element={<AdminPostsPage />} />
            <Route path="stories" element={<AdminStoriesPage />} />
            <Route path="clientes" element={<AdminCustomersPage />} />
            <Route path="chat" element={<AdminChatPage />} />
            <Route path="comentarios" element={<AdminCommentsPage />} />
            <Route path="avaliacoes" element={<AdminReviewsPage />} />
            <Route path="estoque" element={<AdminInventoryPage />} />
            <Route path="fichas" element={<AdminRecipesPage />} />
            <Route path="despesas" element={<AdminExpensesPage />} />
            <Route path="cupons" element={<AdminCouponsPage />} />
            <Route path="enquetes" element={<AdminPollsPage />} />
            <Route path="relatorios" element={<AdminReportsPage />} />
            <Route path="configuracoes" element={<AdminSettingsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppProviders>
  );
}
