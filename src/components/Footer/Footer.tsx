import React from 'react'
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <div className={styles.footer}>
      <p>©2023 Capital One.</p>
      <div className={styles.footerLink}>
        <p>Privacy</p>
        <p>Security</p>
        <p>AdChoices</p>
        <p>Terms&nbsp;&&nbsp;Conditions</p>
      </div>
      <div className={styles.footerImage}>
        <img src="house.jpg" alt="" />
      </div>
    </div>
  )
}

export default Footer;
