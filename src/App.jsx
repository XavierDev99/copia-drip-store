import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Layout from './pages/Layout';
import { CartPage, CheckoutPage, SuccessPage, OrdersPage, ProfilePage, PaymentPage } from './pages/ShopPages';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductViewPage from './pages/ProductViewPage';
import { CategoriesPage, AccountPage, MessagePage } from './pages/ExtraPages';

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListingPage />} />
        <Route path="/produtos" element={<ProductListingPage />} />
        <Route path="/product/:id" element={<ProductViewPage />} />
        <Route path="/categorias" element={<CategoriesPage />} />
        <Route path="/entrar" element={<AccountPage key="login" />} />
        <Route path="/cadastro" element={<AccountPage key="signup" signup />} />
        <Route path="/pedidos" element={<OrdersPage />} />
        <Route path="/carrinho" element={<CartPage />} />
        <Route path="/finalizar-compra" element={<CheckoutPage />} />
        <Route path="/compra-realizada/:id" element={<SuccessPage />} />
        <Route path="/conta" element={<ProfilePage />} />
        <Route path="/conta/informacoes" element={<ProfilePage information />} />
        <Route path="/conta/informacoes/editar" element={<ProfilePage information edit />} />
        <Route path="/conta/pagamento" element={<PaymentPage />} />
        <Route path="/informacoes/:topic" element={<MessagePage title="Informações da loja">Vitrine acadêmica da Digital Store. Entre em contato pelo rodapé.</MessagePage>} />
        <Route path="*" element={<MessagePage title="Página não encontrada" />} />
      </Routes>
    </Layout>
  );
}




