/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { MouseEvent, useEffect, useState } from 'react';
import PrintRoundedIcon from '@mui/icons-material/PrintRounded';
import AccountSummary from '../../components/AccountSummary/AccountSummary';
import TransferFunds from '../../components/TransferFunds/TransferFunds';
import Footer from '../../components/Footer/Footer';
import BlockModal from '../../components/BlockModal/BlockModal';
import styles from './Dashboard.module.css';
import useStore from '../../store/store';
import MenuIcon from '@mui/icons-material/Menu';
import MobileNavBar from '../../components/MobileNavBar/MobileNavBar';
import ReceiptModal from '../../components/ReceiptModal/ReceiptModal';

const Dashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState<boolean>(true);
  const [isReceiptActive, setIsReceiptActive] = useState<boolean>(false);
  // const [isTimed, setIsTimed] = useState<boolean>(false);
  const setLogInStatus = useStore().setLogInStatus;
  const setMainLoadingStatus = useStore().setMainLoadingStatus;
  const setTransferFunds = useStore().setTransferFunds;
  const setMobileNavActive = useStore().setMobileNavActive;
  const makeSignOutRequest = useStore().makeSignOutRequest;

  const blockedStatus = useStore(state => state.blockedStatus);
  const receiptStatus = useStore(state => state.receiptStatus);
  const transferFunds = useStore(state => state.transferFunds);
  const mobileNavActive = useStore(state => state.mobileNavActive);

  const checkBlockedStatus = () => {
    const status = JSON.parse(localStorage.getItem('bs') ?? 'false');
    setIsBlocked(status);
  }

  const onMenuItemClick= (event: MouseEvent<HTMLAnchorElement>) => {
    const target = event.currentTarget.innerHTML;
    setActiveMenuItem(target);

    if(target === 'Transfer&nbsp;Funds') {
      setTransferFunds(true);
      return;
    }
    setTransferFunds(false);
  }

  const onSignOut = () => {
    setLogInStatus(false);
    makeSignOutRequest();
  }

  const initIdleTimer = () => {
    let timer: NodeJS.Timeout;
    window.addEventListener('load', resetTimer, true);

    let events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach((name) => {
      document.addEventListener(name, resetTimer, true);
    });

    function resetTimer() {
      clearTimeout(timer);
      timer = setTimeout(onSignOut, 60000);
    }
  }

  const onMobileNavClickHandler = () => {
    setMobileNavActive(!mobileNavActive);
  }

  useEffect(() => {
    setIsReceiptActive(receiptStatus);
  }, [receiptStatus]);

  useEffect(() => {
    checkBlockedStatus();
  }, [blockedStatus]);

  useEffect(() => {
     initIdleTimer();
    setMainLoadingStatus(true);
    setTimeout(() => {
      setMainLoadingStatus(false);
    }, 1000);

    setActiveMenuItem('My&nbsp;Account');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    activeMenuItem && Array.from(document.getElementsByClassName('menu-item')).forEach(item =>
      item.innerHTML === activeMenuItem 
        ? item.classList.add('Dashboard_activeMenuItem__-y1xI')
        : item.classList.remove('Dashboard_activeMenuItem__-y1xI')
    );
  }, [activeMenuItem]);

  return (
    <div className={styles.container}>
      {
        isBlocked && (
          <BlockModal />
        )
      }
      {
        mobileNavActive && (
          <MobileNavBar />
        )
      }
      {
        isReceiptActive && (
          <ReceiptModal />
        )
      }
      <div className={styles.header}>
        {/* Top Nav */}
        <div className={styles.topNav}>
          <div className={styles.currentTime}>
            <p>Last Update:&nbsp;&nbsp;</p>
            <p>
              {new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'long'}).format(new Date())}
            </p>
          </div>
        </div>
        {/* Logo Bar */}
        <div className={styles.logoBar}>
          <div>
            <img className={styles.logo} src="logo.svg.png" alt="" />
            <p>Online&nbsp;Banking</p>
          </div>
          <div className={styles.topLinks}>
            <a href="#">Privacy</a>
            <a href="#">Security</a>
            <a href="#" onClick={onSignOut}>Sign&nbsp;Off</a>
          </div>
          <div className={styles.mobileMenuBar}>
            <MenuIcon onClick={onMobileNavClickHandler} fontSize='medium'/>
          </div>
        </div>
        {/* Nav Bar */}
        <div className={styles.navBar}>
          <div className={styles.navMenu}>
            <a onClick={onMenuItemClick} className="menu-item" href="#">My&nbsp;Account</a>
            <a onClick={onMenuItemClick} className="menu-item" href="#">Transfer&nbsp;Funds</a>
            <a onClick={onMenuItemClick} className="menu-item" href="#">Pay&nbsp;Bills</a>
            <a onClick={onMenuItemClick} className="menu-item" href="#">Alerts</a>
            <a onClick={onMenuItemClick} className="menu-item" href="#">Customer&nbsp;Service</a>
            <a onClick={onMenuItemClick} className="menu-item" href="#">My&nbsp;Offers</a>
          </div>
          <div className={styles.navPrinter}>
            <PrintRoundedIcon fontSize='small'/>
            <p>Printer&nbsp;Friendly&nbsp;Page</p>
          </div>
        </div>
      </div>
      {/* Inner Content */}
      <div className={styles.innerContent}>
        {
          !transferFunds ? (
            <AccountSummary />
          ) : (
            <TransferFunds />
          )
        }
      </div>
      <Footer />
    </div>
  )
}

export default Dashboard;
