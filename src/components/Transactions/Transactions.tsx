import React, { useEffect } from "react";
import useStore from '../../store/store';
import styles from './Transactions.module.css';
import currencyFormatter from '../../utilities/currencyFormatter';
import idGenerator from "../../utilities/idGenerator";

const Transactions = () => {
    const transactions = useStore(state => state.transactions);

    return (
        <>
            {
                transactions && transactions.map((transaction) => (
                    <div key={idGenerator()} className={styles.txnEntry}>
                        <div className={styles.leftSide}>
                            <p>{ transaction.date }</p>
                            <p>{ transaction.description }</p>
                        </div>
                        <div className={styles.rightSide}>
                        {
                            transaction.type === "deposit" ? (
                                <>
                                    <p>-</p>
                                    <p style={{ color: "rgb(1, 106, 1)" }}>{currencyFormatter(`${transaction.amount}`)}</p>
                                </>
                            ) : (
                                <>
                                    <p style={{ color: "rgb(207, 0, 0)" }}>{currencyFormatter(`${transaction.amount}`)}</p>
                                    <p>-</p>
                                </>
                            )
                        }
                        </div>
                        <div 
                            className={styles.mobileRightSide}
                            style={transaction.type === "deposit" ? { color: "rgb(1, 106, 1)" } : { color: "rgb(207, 0, 0)" }}
                        >
                            <p>{currencyFormatter(`${transaction.amount}`, "mobile")}</p>
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default Transactions;