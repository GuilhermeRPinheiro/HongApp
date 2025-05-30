import { Routes, Route } from 'react-router-dom';

import HomePage from './Pages/Home' 
import LoginPage from './Pages/Login' 
import RegisterPage from './Pages/Register' 
import MenuPage from './Pages/Menu' 
import CarrinhoPage from './Pages/Carrinho' 
import { MyNavbar } from './Components/Navbar' 
import ProfilePage from './Pages/Perfil' 
import AdminPage from './Pages/Admin'
import Footer from './Components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminRoute from './components/AdminRoute'


function App() {
  return (
    <> 
      <MyNavbar/>
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/cardapio" element={<MenuPage />} /> 
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/profile" element={<PrivateRoute><ProfilePage/></PrivateRoute>}/>
          <Route path="/carrinho" element={<PrivateRoute><CarrinhoPage/></PrivateRoute>}/> 
          <Route path="/admin" element={<AdminRoute><AdminPage/></AdminRoute>}/> 
          </Routes>
      </main>
    </>
  );
}

export default App;