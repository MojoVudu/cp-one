/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import styles from './TopBar.module.css';
import MenuIcon from '@mui/icons-material/Menu';
import { Language } from '@mui/icons-material';

const TopBar = () => {
  return (
    <div className={styles.navigation}>
      <img className={styles.logo} src="logo.svg.png" alt="" />
      <div className={styles.menu}>
        <div className={styles.language}>
          <p>
            <Language fontSize="small"/>
          </p>
          <a href="#">English</a>
        </div>
        <a href="#">Customer Service</a>
        <a href="#">Locations</a>
        <a href="#">Security</a>
      </div>
      <div className={styles.mobileMenuBar}>
        <MenuIcon fontSize='medium'/>
      </div>
    </div>
  )
}

export default TopBar;
