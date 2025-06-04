import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

// Importações das Páginas
import HomePage from './Pages/Home'
import LoginPage from './Pages/Login'
import RegisterPage from './Pages/Register'
import MenuPage from './Pages/Menu'
import ChartPage from './Pages/Carrinho'
import { MyNavbar } from './Components/Navbar'


function App() {
  return (
 
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

  );
}

export default App;