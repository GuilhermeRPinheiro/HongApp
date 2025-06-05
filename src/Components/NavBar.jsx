import Logo from '../assets/Logo.svg'
import { Link } from 'react-router-dom'
import {
  Button,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
} from "flowbite-react"
import { useAuth } from '../Contexts/AuthContext.jsx'

export function MyNavbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth()


  // const linkOculto = "display:hidden"

  return (
    <Navbar fluid rounded  className="!bg-transparent" style={{display:"flex"}}> 
      <NavbarBrand as={Link} href="/">
       <img src={Logo} className='mr-80'/>
      </NavbarBrand>
 
      <div className="flex md:order-2 ">
        {isAuthenticated ? (
          <Dropdown className='!bg-white'
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="User settings"
                img={user?.profilePic || "https://flowbite.com/docs/images/people/profile-picture-5.jpg"}
                rounded
              />
            }
          >
            <DropdownHeader>
              <span className="text-black font-['Sawarabi_Gothic'] block text-sm">{user?.name || 'Usuário'}</span>
              <span className="text-black font-['Sawarabi_Gothic']  block truncate text-sm font-medium">{user?.email}</span>
            </DropdownHeader>
            <DropdownItem className="!text-black drop-fundo font-['Sawarabi_Gothic']"  as={Link} to="/profile">Perfil</DropdownItem>
            {isAdmin() && (
              <>
              <DropdownItem className="!text-black drop-fundo font-['Sawarabi_Gothic']" as ={Link} to ="/admin">Admin Config</DropdownItem>
              <DropdownItem className="!text-black drop-fundo font-['Sawarabi_Gothic']"  as ={Link} to="/relatorios">Relatórios Admin</DropdownItem>
              </>
            )}
             {!isAdmin() && (
              <DropdownItem className="!text-black drop-fundo font-['Sawarabi_Gothic']" as={Link} to="/carrinho">Carrinho</DropdownItem>
            )}
            <DropdownDivider />
            <DropdownItem className="!text-black drop-fundo font-['Sawarabi_Gothic']" onClick={logout}>Sign out</DropdownItem> 
          </Dropdown>
        ) : (
          <Button as={Link} to="/login" className="ml-24 bg-[#D5351D] w-[12.375rem] h-[3.75rem] rounded-4xl font-['Sawarabi_Gothic'] text-2xl focus:ring-0">
            Fazer Login
          </Button>
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <Link
          to="/"
          className="cursor-pointer font-['Sawarabi_Gothic'] text-2xl mr-10 !text-white">
          Home
        </Link>
        
        <Link
          to="/cardapio"
          className="cursor-pointer font-['Sawarabi_Gothic'] text-2xl mr-72 !text-white">
          Cardápio
        </Link>
      </NavbarCollapse>
    </Navbar>
  )
}