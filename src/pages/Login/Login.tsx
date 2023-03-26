/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useRef, useEffect, useState, ChangeEvent, FormEvent } from 'react';
import styles from './Login.module.css';
import TopBar from '../../components/TopBar/TopBar';
import Footer from '../../components/Footer/Footer';
import useStore from '../../store/store';
import { useSnackbar } from 'notistack';

const Login = () => {
    const userIdRef = useRef<HTMLInputElement>(null);
    const [userId, setUserId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [OTP, setOTP] = useState<string>('');
    const [activeButton, setActiveButton] = useState<boolean>(false);
    const [otpPhase, setOtpPhase] = useState<boolean>(false);
    const [validOTP, setValidOTP] = useState<boolean>(false);
    const setMainLoadingStatus = useStore().setMainLoadingStatus;
    const setLogInStatus = useStore().setLogInStatus;
    const { enqueueSnackbar } = useSnackbar();

    const onUserIdChange = (e: ChangeEvent<HTMLInputElement>) => setUserId(e.target.value);
    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);
    const onOTPChange = (e: ChangeEvent<HTMLInputElement>) => setOTP(e.target.value);

    const validateLoginCred = async(e: FormEvent) => {
        e.preventDefault();
        setMainLoadingStatus(true);

        const rawResponse = await fetch('https://naughty-kit-hare.cyclic.app/auth', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: userId, password})
        });
        
        const res = await rawResponse.json();
        setMainLoadingStatus(false);

        if(res && res.status) {
            const { status } = res;

            switch(status) {
                case "active":
                    setOtpPhase(true);
                    enqueueSnackbar('OTP sent to email address', { variant: 'info' });
                    break;
                case "blocked":
                    enqueueSnackbar('Account temporarily suspended, contact branch', { variant: 'error' });
                    break;
                default:
                    enqueueSnackbar('Incorrect credentials!', { variant: 'error' });
            }
        }
        setUserId('');
        setPassword('');
    }

    const validateOTP = async(e: FormEvent) => {
        e.preventDefault();
        if(!otpPhase) return;
        setMainLoadingStatus(true);

        const rawResponse = await fetch('https://naughty-kit-hare.cyclic.app/otp', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({otp: OTP})
        });
        const res = await rawResponse.json();

        if(res && res.status === "valid") {
            setLogInStatus(true);
            setOTP('');
        } else {
            enqueueSnackbar('Incorrect OTP!', { variant: 'error' });
            setOTP('');
        }
    }

    useEffect(() => {
        setMainLoadingStatus(true);
        setTimeout(() => {
            setMainLoadingStatus(false);
        }, 1000);
        if(userIdRef.current) userIdRef.current.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Login Button
    useEffect(() => {
        if(userId !== '' && password !== '') {
            setActiveButton(true);
            return;
        }
        setActiveButton(false);
    }, [userId, password]);

    // OTP Button
    useEffect(() => {
        if(OTP.length === 6) {
            setValidOTP(true);
        } else {
            setValidOTP(false); 
        }
    }, [OTP]);
    
    return (
        <div className={styles.container}>
            <TopBar />
            <div className={styles.content}>
                {
                    !otpPhase ? (
                        <form>
                            <h3>Sign In to <span>Online Banking</span></h3>
                            <div className={styles.formField}>
                                <label>User ID <span>(required)</span></label>
                                <input 
                                    type="text" 
                                    ref={userIdRef} 
                                    value={userId} 
                                    onChange={onUserIdChange} 
                                    placeholder="Enter User ID"
                                />
                            </div>
                            <div className={styles.formField}>
                                <label>Password <span>(required)</span></label>
                                <input 
                                    type="password" 
                                    value={password} 
                                    onChange={onPasswordChange} 
                                    placeholder="Enter Password"
                                />
                            </div>
                            <div className={styles.bottomLink}>
                                <div>
                                    <input type="checkbox"/>
                                    <p>Remember User ID</p>
                                </div>
                                <a href="#">Forgot ID or Password?</a>
                            </div>
                            <div className={styles.submitSection}>
                                <button 
                                    className={`${activeButton ? styles.activeButton : styles.disabledButton}`} 
                                    disabled={!activeButton} 
                                    onClick={validateLoginCred}
                                >
                                    Sign in
                                </button>
                                <p>or</p>
                                <a href="#">Enroll in Online Banking</a>
                            </div>
                        </form>
                    ) : (
                        <form>
                            <h3>Customer Verification</h3>
                            <div className={styles.formField}>
                                <label>OTP <span>(required)</span></label>
                                <input type="password" value={OTP} onChange={onOTPChange} placeholder="Enter OTP"/>
                                <p className={styles.noticeText} style={{ display: validOTP ? 'none' : 'block' }}>
                                    OTP should be 6 characters long
                                </p>
                            </div>
                            <div className={styles.submitSection}>
                                <button className={`${validOTP ? styles.activeButton : styles.disabledButton}`} disabled={!validOTP} onClick={validateOTP}>Proceed</button>
                            </div>
                        </form>
                    )
                }
            </div>
            <Footer />
        </div>
    )
}

export default Login;