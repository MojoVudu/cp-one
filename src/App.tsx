import React, { useState, useEffect } from 'react';
import styles from './App.module.css';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Loader from './components/Loader/Loader';
import useStore from './store/store';
import { SnackbarProvider } from 'notistack';

function App() {
  const [ isLoggedIn, setIsLoggedIn ] = useState<boolean>(() => false);
  const logInStatus = useStore(state => state.logInStatus);
  const mainLoadingStatus = useStore().mainLoadingStatus;

  const getLogInStatus = (): boolean => JSON.parse(localStorage.getItem('ls') ?? 'false');

  useEffect(() => {
    setIsLoggedIn(getLogInStatus());
  }, [logInStatus]);

  return (
    <SnackbarProvider maxSnack={3}>
      <div className={styles.mainContainer}>
        {
          mainLoadingStatus && (
            <Loader />
          )
        }
        {
          !isLoggedIn ? (
            <Login />
          ) : (
            <Dashboard />
          )
        }
      </div>
    </SnackbarProvider>
  );
}

export default App;
