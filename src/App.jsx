import { Routes, Route } from 'react-router-dom';

import HomePage from './Pages/Home';
import LoginPage from './Pages/Login';
import RegisterPage from './Pages/Register';
import MenuPage from './Pages/Menu';
import CarrinhoPage from './Pages/Carrinho';
import { MyNavbar } from './Components/Navbar';
import ProfilePage from './Pages/Perfil';
import AdminPage from './Pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import RelatorioPage from './Pages/Relatórios'
import { AuthProvider } from './Contexts/AuthContext'; 
import { CartProvider } from './contexts/CartContext'; 
import CriarPrato from './Pages/CriarPrato';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <MyNavbar/>
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/cardapio" element={<MenuPage />} /> 
            <Route path="/login" element={<LoginPage />} />
          <Route path="/criarprato" element={<CriarPrato />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage/></PrivateRoute>}/>
            <Route path="/carrinho" element={<PrivateRoute><CarrinhoPage/></PrivateRoute>}/> 
            <Route path="/admin" element={<AdminRoute><AdminPage/></AdminRoute>}/> 
            <Route path="/relatorios" element={<AdminRoute><RelatorioPage/></AdminRoute>}/> 
          </Routes>
        </main>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;