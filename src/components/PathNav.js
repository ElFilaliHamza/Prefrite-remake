import React from 'react';
import { Link } from 'react-router-dom';

const PathNav = ({ navItems }) => {
    return (
        <div className={`path-nav`}>
            {navItems.map((item, index) => (
                <Link key={index} className={`${item.isHome ? 'path-btn' : 'path-nav-item'} ${item.isCurr && item.isHome ? 'path-btn-current' : ''}`} to={item.path}>
                    {item.isHome ? <i className="fas fa-home"></i> : item.label}
                </Link>
            ))}
        </div>
    );
};

export default PathNav;