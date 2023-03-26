import React from 'react';
import styles from './Loader.module.css';

const Loader = () => {
  return (
    <div className={styles.container}>
        <img className={styles.icon} src="logo.svg.png" alt="" />
    </div>
  )
}

export default Loader