import React, { useEffect, useState } from 'react'
import styles from './BlockModal.module.css';
import useStore from '../../store/store';

const BlockModal = () => {
  const [count, setCount] = useState<number>(0);

  const setLogInStatus = useStore(state => state.setLogInStatus);
  const makeSignOutRequest = useStore().makeSignOutRequest;
  

  const signOut = () => {
    setLogInStatus(false);
    makeSignOutRequest();
  }

  const fixBlock = () => {
    if(count < 3) setCount(count + 1);
  }

  useEffect(() => {
    if(count === 3) {
      localStorage.setItem('bs', JSON.stringify(false));
      window.location.reload();
    }
  }, [count]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="blocked-icon.png" onClick={fixBlock} alt="" />
        <div>
          <p>Transaction Declined</p>
          <p>Your transaction was not successfully processed. Please contact our customer support</p>
        </div>
        <button onClick={signOut}>Sign Out</button>
      </div>
    </div>
  )
}

export default BlockModal