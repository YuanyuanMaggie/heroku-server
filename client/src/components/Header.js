import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => (
    <nav>
        <div className="nav-wrapper">
          <Link to='/' className="left brand-logo">
            Emaily
          </Link>
          <ul className="right">
            Header
          </ul>
        </div>
    </nav>
);

export default Header;

