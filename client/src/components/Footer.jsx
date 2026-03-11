import React from 'react';
import { Link } from 'react-router-dom';


const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="fit-footer">
            <span className="fit-footer-brand">⚡ FitTracker</span>
            <span>Track. Train. Transform.</span>
            <span>© {year} FitTracker. All rights reserved.</span>
        </footer>
    );
};

export default Footer;
