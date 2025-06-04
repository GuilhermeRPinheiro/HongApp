<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Importações das Páginas
import HomePage from './Pages/Home'
import LoginPage from './Pages/Login'
import RegisterPage from './Pages/Register'
import MenuPage from './Pages/Menu'
import ChartPage from './Pages/Carrinho'
import { MyNavbar } from './Components/Navbar'
=======
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
>>>>>>> 02754e380422a6ba3e030bb40cb7bf75249522f6


function App() {
  return (
<<<<<<< HEAD
 
      <Router>
        <MyNavbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/carrinho" element={<ChartPage />} />
          </Routes>
        </main>
      </Router>

=======
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
>>>>>>> 02754e380422a6ba3e030bb40cb7bf75249522f6
  );
}

export default App;