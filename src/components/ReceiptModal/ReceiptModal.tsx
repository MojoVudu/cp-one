import React, { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import styles from './ReceiptModal.module.css';
import DoneIcon from '@mui/icons-material/Done';
import currencyFormatter from "../../utilities/currencyFormatter";
import useStore from '../../store/store';
import idGenerator from "../../utilities/idGenerator";

const ReceiptModal = () => {
    const [transactionId, setTransactionId] = useState<String>('');
    const setReceiptStatus = useStore().setReceiptStatus;
    const completedTransaction = useStore(state => state.completedTransaction);
    const transactionStatus = useStore(state => state.transactionStatus);
    const accountBalance = useStore().accountBalance;

    const closeReceipt = () => {
        setReceiptStatus(false);
    }

    useEffect(() => {
        setTransactionId(idGenerator());
    }, []);

    return (
        <>
            {
                (completedTransaction || transactionStatus) && (
                    <div className={styles.container}>
                        <div onClick={closeReceipt} className={styles.closeBtn}>
                            <CloseIcon fontSize="medium" />
                        </div>
                        <div className={styles.receipt}>
                            <div className={styles.logo}>
                                <img src="logo.svg.png" alt="" />
                            </div>
                            <div className={styles.topSection}>
                                {
                                    transactionStatus === "success" && (
                                        <div className={styles.successIcon}>
                                            <DoneIcon fontSize="large" />
                                        </div>
                                    )
                                }
                                {
                                    transactionStatus === "failed" && (
                                        <div className={styles.failureIcon}>
                                            <CloseIcon fontSize="large" />
                                        </div>
                                    )
                                }
                                
                                {
                                    (completedTransaction && transactionStatus === "success") && (
                                        <>
                                            <p className={styles.text}>Transaction processed successfully</p>
                                            <p className={styles.amount}>{currencyFormatter(`${completedTransaction.amount}`)}</p>
                                        </>
                                    )
                                }
                                {
                                    transactionStatus === "failed" && (
                                        <p className={styles.text}>Transaction failed</p>
                                    )
                                }

                                
                            </div>
                            {
                                (completedTransaction && transactionStatus === "success") && (
                                    <>
                                        <div className={styles.details}>
                                            <div className={styles.section}>
                                                <p>Transaction ID</p>
                                                <p>{ transactionId }</p>
                                            </div>
                                            <div className={styles.section}>
                                                <p>Date</p>
                                                <p>{completedTransaction.date}</p>
                                            </div>
                                            <div className={styles.section}>
                                                <p>To</p>
                                                <p>{completedTransaction.beneficiary}</p>
                                            </div>
                                        </div>
                                        <div className={styles.info}>
                                            <p>Current Balance</p>
                                            <p>{currencyFormatter(`${accountBalance}`)}</p>
                                        </div>
                                    </>
                                )
                            }
                            <button onClick={closeReceipt} className={styles.receiptCloseBtn}>Close</button>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default ReceiptModal;