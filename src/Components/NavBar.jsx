import { Link } from 'react-router-dom';
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
} from "flowbite-react";
import { useAuth } from '../Contexts/AuthContext'; // Ajuste este caminho

export function MyNavbar() {
  const { isAuthenticated, user, logout, isAdmin } = useAuth();

  // Função simples para estilizar links desativados
  const disabledLinkClass = "cursor-not-allowed text-gray-400 dark:text-gray-600";

  return (
    <Navbar fluid rounded>
      <NavbarBrand as={Link} href="/">
        <img src="honglong_logo.svg" className="mr-3 h-6 sm:h-9" alt="" />
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
            {/* Links do Dropdown desativados */}
            <DropdownItem className={disabledLinkClass}>Dashboard</DropdownItem>
            {isAdmin() && (
              <DropdownItem className={disabledLinkClass}>Admin Settings</DropdownItem>
            )}
            <DropdownItem className={disabledLinkClass}>Settings</DropdownItem>
            <DropdownDivider />
            <DropdownItem onClick={logout}>Sign out</DropdownItem> {/* Este ainda funciona para sair */}
          </Dropdown>
        ) : (
          <Button as={Link} to="/login">
            Entrar
          </Button>
        )}
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        {/* Links da Navbar desativados */}
        <NavbarLink className={disabledLinkClass}>Home</NavbarLink>
        <NavbarLink className={disabledLinkClass}>About</NavbarLink>
        <NavbarLink className={disabledLinkClass}>Services</NavbarLink>
        <NavbarLink className={disabledLinkClass}>Pricing</NavbarLink>
        <NavbarLink className={disabledLinkClass}>Contact</NavbarLink>
      </NavbarCollapse>
    </Navbar>
  );
}