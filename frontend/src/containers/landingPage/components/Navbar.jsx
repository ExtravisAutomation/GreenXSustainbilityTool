import React from 'react';
import { Layout, Menu } from 'antd';
import './Navbar.css'; // Assuming you have a CSS file for additional styling
import logo from '../assets/logo.svg';
import { Link } from 'react-router-dom';

const { Header } = Layout;

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-left">
        <nav>
          <ul className="navbar-menu">
            <li className="navbar-menu-item">
              <Link to="aboutus">About Us</Link>
            </li>
            <li className="navbar-menu-item">
              <Link to="#platform">Platform</Link>
            </li>
            <li className="navbar-menu-item">
              <Link to="solution">Solution</Link>
            </li>
            {/* <li className="navbar-menu-item">
              <Link to="#customer">Customer</Link>
            </li> */}
          </ul>
        </nav>
      </div>
      <div className="navbar-center">
        <img src={logo} alt="Logo" className="navbar-logo" />
      </div>
      <div className="navbar-right">
        <nav>
          <ul className="navbar-menu">
            <li className="navbar-menu-item">
              <Link to="#signup">Price</Link>
            </li>
            <li className="navbar-menu-item">
              <Link to="#contact">Contact</Link>
            </li>
            <li className="navbar-menu-item">
              <Link to="#login">Login</Link>
            </li>
            {/* <li className="navbar-menu-item">
              <Link to="#login">Sign up</Link>
            </li> */}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
