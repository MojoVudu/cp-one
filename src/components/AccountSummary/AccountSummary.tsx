import React, { useEffect, useState } from 'react';
import FileUploadRoundedIcon from '@mui/icons-material/FileUploadRounded';
import currencyFormatter from '../../utilities/currencyFormatter';
import useStore from '../../store/store';
import styles from './AccountSummary.module.css';
import Transactions from '../Transactions/Transactions';
import Transaction from '../../models/Transaction';


const AccountSummary = () => {
  const setTransactions = useStore().setTransactions;
  const setAccountBalance = useStore().setAccountBalance;
  const accountBalance = useStore(state => state.accountBalance);
  const transactions = useStore(state => state.transactions);

  useEffect(() => {
    const retrieveBalance = async() => {
      const rawResponse = await fetch('https://naughty-kit-hare.cyclic.app/balance');
      const res = await rawResponse.json();

      if(res && res.balance) {
        setAccountBalance(res.balance);
      }
    }

    retrieveBalance();
  }, []);

  useEffect(() => {
    const retrieveTransactions = async() => {
      const rawResponse = await fetch('https://naughty-kit-hare.cyclic.app/transactions');
      const res = await rawResponse.json();

      if(res && res.transactions) {
        const transactions: Transaction[] = res.transactions;
        const userTransactions: Transaction[] = [];
        transactions.reverse();

        for(let i = 0; i < 10; i += 1) {
          userTransactions.push(transactions[i]);
        }
        
        setTransactions(userTransactions);
      }
    }

    retrieveTransactions();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <h2>Account&nbsp;Activity</h2>
        <div className={styles.row}>
          <select>
            <option value="000321489566">Checking 000321489566</option>
          </select>
          <p>Available Balance:&nbsp;&nbsp;&nbsp;<span>{ currencyFormatter(`${accountBalance}`) }</span></p>
        </div>
        <p className={styles.link}>Show Account & Routing Number</p>
      </div>
      <div className={styles.lowerContentSection}>
        <div className={styles.accountSummary}>
          <div className={styles.upperSection}>
            <p>Account&nbsp;Summary</p>
            <p>Maintenance</p>
          </div>
          <div className={styles.lowerSection}>
            {/* <div className={styles.entry}>
              <p>Account Number:</p>
              <p>XXXXXXXXXX1234</p>
            </div> */}
            <div className={styles.entry}>
              <p>Available Balance:</p>
              <p>{ currencyFormatter(`${accountBalance}`) }</p>
            </div>
            <div className={styles.entry}>
              <p>Available Credit:</p>
              <p>$931.76</p>
            </div>
            <div className={styles.entry}>
              <p>Credit Limit:</p>
              <p>$45,000.00</p>
            </div>
            <div className={styles.entry}>
              <p>Interest Paid Year to Date:</p>
              <p>$692.20</p>
            </div>
            <div className={styles.entry}>
              <p>Interest Paid Last Year:</p>
              <p>$2,095.95</p>
            </div>
            {/* <div className={styles.entry}>
              <p>Original Note Date:</p>
              <p>04/02/2020</p>
            </div>
            <div className={styles.entry}>
              <p>Draw Expiration/Repayment Date:</p>
              <p>04/01/2030</p>
            </div> */}
            <div className={styles.payInfo}>
              <h3>Payment Information</h3>
              <div className={styles.entry}>
                <p>Last Payment:</p>
                <div>
                  <p>$235.58</p>
                  <p>04/05/2022</p>
                </div>
              </div>
              <div className={styles.entry}>
                <p>Next Payment Due:</p>
                <div>
                  <p>$0.00</p>
                  <p>04/15/2022</p>
                </div>
              </div>
            </div>
            <div className={styles.accountService}>
              <h3>Account Services</h3>
              <p>Dispute Transaction</p>
              <p>Report Lost or Stolen Card</p>
              <p>Request Convenience Checks</p>
              <p>Request Automated Payment</p>
              <p>Fixed Rate Balance Manangement</p>
            </div>
          </div>
        </div>
        <div className={styles.txnHistory}>
          <h3>Last 10 Posted Transactions <span>Export&nbsp;&nbsp;<FileUploadRoundedIcon fontSize='small' /></span></h3>
          <div className={styles.txnContent}>
            <div className={styles.txnEntry}>
              <div className={styles.leftSide}>
                <p>Date</p>
                <p>Description</p>
              </div>
              <div className={styles.rightSide}>
                <p>Withdrawals</p>
                <p>Deposits</p>
              </div>
              <div className={styles.mobileRightSide}>
                  <p>Amount</p>
              </div>
            </div>
            {
              transactions && (
                <Transactions />
              )
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSummary;