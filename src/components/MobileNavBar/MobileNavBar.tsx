import React, { MouseEvent, useState, useEffect } from 'react';
import useStore from '../../store/store';

import styles from'./MobileNavBar.module.css';

const MobileNavBar = () => {
    const setTransferFunds = useStore().setTransferFunds;
    const [activeMenuItem, setActiveMenuItem] = useState<string>('');

    const setMobileNavActive = useStore().setMobileNavActive;
    const setMobileNavActiveItem = useStore().setMobileNavActiveItem;
    const setLogInStatus = useStore().setLogInStatus;
    const makeSignOutRequest = useStore().makeSignOutRequest;

    const mobileNavActive = useStore(state => state.mobileNavActive);
    const mobileNavActiveItem = useStore(state => state.mobileNavActiveItem);

    const onMenuItemClick= (event: MouseEvent<HTMLAnchorElement>) => {
        const target = event.currentTarget.innerHTML;
        setActiveMenuItem(target);
        setMobileNavActiveItem(target);
    
        if(target === 'Transfer&nbsp;Funds') {
          setTransferFunds(true);
          setMobileNavActive(false);
          return;
        }
        setTransferFunds(false);
        setMobileNavActive(false);
    }

    const onSignOut = (e: MouseEvent<HTMLButtonElement>) => {
        setLogInStatus(false);
        makeSignOutRequest();
    }

    useEffect(() => {}, [mobileNavActive]);

    useEffect(() => {
        if(mobileNavActiveItem != '') {
            setActiveMenuItem(mobileNavActiveItem);
        } else {
            setActiveMenuItem('My&nbsp;Account'); 
        }
     // eslint-disable-next-line react-hooks/exhaustive-deps
     }, []);

    useEffect(() => {
        activeMenuItem && Array.from(document.getElementsByClassName('menu-item')).forEach(item =>
            item.innerHTML === activeMenuItem
                ? item.classList.add('MobileNavBar_activeItem__EyxbQ')
                : item.classList.remove('MobileNavBar_activeItem__EyxbQ')
        );
    }, [activeMenuItem]);

    return (
        <>
            {
                mobileNavActive && (
                    <div className={styles.mobileNavcontainer}>
                        <div className={styles.mobileNavMenu}>
                            <a onClick={onMenuItemClick} className="menu-item" href="#">My&nbsp;Account</a>
                            <a onClick={onMenuItemClick} className="menu-item" href="#">Transfer&nbsp;Funds</a>
                            <a onClick={onMenuItemClick} className="menu-item" href="#">Pay&nbsp;Bills</a>
                            <a onClick={onMenuItemClick} className="menu-item" href="#">Alerts</a>
                            <a onClick={onMenuItemClick} className="menu-item" href="#">Customer&nbsp;Service</a>
                            <a onClick={onMenuItemClick} className="menu-item" href="#">My&nbsp;Offers</a>
                        </div>
                        <div className={styles.btnContainer}>
                            <button onClick={onSignOut}>Sign Out</button>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default MobileNavBar;