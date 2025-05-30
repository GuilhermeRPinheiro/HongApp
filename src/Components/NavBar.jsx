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


  const linkOculto = "display:hidden"

  return (
    <Navbar fluid rounded>
      <NavbarBrand as={Link} href="/">
        <img src="/favicon.svg" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Flowbite React</span>
      </NavbarBrand>

      <div className="flex md:order-2">
        {isAuthenticated ? (
          <Dropdown
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
              <span className="block text-sm">{user?.name || 'Usuário'}</span>
              <span className="block truncate text-sm font-medium">{user?.email}</span>
            </DropdownHeader>
            <DropdownItem as={Link} to="/profile">Perfil</DropdownItem>
            {isAdmin() && (
              <>
              <DropdownItem as ={Link} to ="/admin">Admin Config</DropdownItem>
              <DropdownItem as ={Link} to="/relatorios">Relatórios Admin</DropdownItem>
              </>
            )}
             {!isAdmin() && (
              <DropdownItem as={Link} to="/carrinho">Carrinho</DropdownItem>
            )}
            <DropdownDivider />
            <DropdownItem onClick={logout}>Sign out</DropdownItem> 
          </Dropdown>
        ) : (
          <Button as={Link} to="/login">
            Entrar
          </Button>
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <NavbarLink>Home</NavbarLink>
        <NavbarLink>About</NavbarLink>
        <NavbarLink>Services</NavbarLink>
        <NavbarLink>Pricing</NavbarLink>
        <NavbarLink className={linkOculto}>Contact</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  )
}