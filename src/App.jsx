import Header from './Components/NavBar'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

//Import das Páginas 
import HomePage from './Pages/Home'
import LoginPage from './Pages/Login'
import RegisterPage from './Pages/Register'
import MenuPage from './Pages/Menu'
import ChartPage from './Pages/Carrinho'


function App() {
 

  return (
    <>
    <Router>
       <nav style={{ padding: '10px', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'space-around' }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Home</Link>
        <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>Cardápio</Link>
        <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>
        <Link to="/about" style={{ color: 'white', textDecoration: 'none' }}>Registro</Link>
        <Link to="/contact" style={{ color: 'white', textDecoration: 'none' }}>Carrinho</Link>
      </nav>
      <Routes>  
              <Route path="/" element={<HomePage/>}/>
              <Route path="/" element={<LoginPage/>}/>
              <Route path="/" element={<RegisterPage/>}/>
              <Route path="/" element={<MenuPage/>}/>
              <Route path="/" element={<ChartPage/>}/>
      </Routes>
    </Router>
    </>
  )
}

export default App
