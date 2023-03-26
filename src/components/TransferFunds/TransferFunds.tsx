import React, { ChangeEvent, useEffect, useState } from 'react';
import useStore from '../../store/store';
import styles from './TransferFunds.module.css';
import { useSnackbar } from 'notistack';
import currencyFormatter from '../../utilities/currencyFormatter';
import Transaction from '../../models/Transaction';
import dateGenerator from '../../utilities/dateGenerator';

const TransferFunds = () => {

  const [beneficiary, setBeneficiary] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [routingNumber, setRoutingNumber] = useState<string>('');
  const [bankName, setBankName] = useState<string>('');
  const [isReviewed, setIsReviewed] = useState<boolean>(false);

  const setBlockedStatus = useStore().setBlockedStatus;
  const setCompletedTransaction = useStore().setCompletedTransaction;
  const setReceiptStatus = useStore().setReceiptStatus;
  const setMainLoadingStatus = useStore().setMainLoadingStatus;
  const setAccountBalance = useStore().setAccountBalance;
  const setTransactionStatus = useStore().setTransactionStatus;

  const accountBalance = useStore(state => state.accountBalance);

  const { enqueueSnackbar } = useSnackbar();

  const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if(isReviewed) {
      executeTransaction();
      setTimeout(onCancel, 1000);
      return;
    }

    if(
      !beneficiary || 
      !accountNumber || 
      !amount ||
      !routingNumber ||
      !bankName ||
      !description
    ) return;

    if(Number.parseInt(amount) >= accountBalance) {
      enqueueSnackbar('Insufficient Balance!', { 
        variant: 'error',
        autoHideDuration: 3000
      });
      return;
    }

    enqueueSnackbar('Verify transaction details!', { 
      variant: 'info',
      autoHideDuration: 3000
    });
    setIsReviewed(true);
  }

  const executeTransaction = async () => {
    setMainLoadingStatus(true);
    
    const transaction: Transaction = {
      date: dateGenerator(),
      description,
      beneficiary,
      amount: Number.parseInt(amount),
      type: 'withdraw'
    }

    try {
      const rawResponse = await fetch('https://naughty-kit-hare.cyclic.app/execute', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transaction)
      });

      const res = await rawResponse.json();
      console.log("Txn Res: ", res);

      if(res) {
        const { balance, message } = res;

        if(message === "active") {
          setCompletedTransaction(transaction);
          setTransactionStatus("success");

          if(balance) {
            setAccountBalance(balance);
          }
          setReceiptStatus(true);
        } else if(message === "blocked") {
          setBlockedStatus(true);
        } else {
          setTransactionStatus("failed");
        }
      }
    } catch(err) {
      setTransactionStatus("success");
    }
    setTimeout(() => setMainLoadingStatus(false), 1000);
  }

  const onCancel = () => {
    setIsReviewed(false);
    setAccountNumber('');
    setRoutingNumber('');
  }

  useEffect(() => {
    setAccountNumber('');
    setRoutingNumber('');
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.upperSection}>
        <p>Instant&nbsp;Transfer</p>
        <p>Schedule&nbsp;Transfer</p>
      </div>
      <div className={styles.lowerSection}>
        <form className={styles.transferForm}>
          <h2>External&nbsp;Transfer</h2>
          <div className={styles.formField}>
            <label>Select Beneficiary Account<sup>*</sup></label>
            {
              !isReviewed ? (
                <select
                  onChange={(event: ChangeEvent<HTMLSelectElement>) => {
                    if(event?.target.value != null) {
                      const { value } = event?.target;
                      let accNumber = '';
                      let routingNumber = '';
                      let bankName = '';
                      
                      switch(value) {
                        case 'Dinorah Melendez':
                          accNumber = '4389609898';
                          routingNumber = '011103093';
                          bankName = 'TD BANK';
                          break;
                        case 'Sonia Adams':
                          accNumber = '2518645188';
                          routingNumber = '709522889';
                          bankName = 'Wells Fargo';
                          break;
                        case 'Carl Quedenfeld':
                          accNumber = '4830613483';
                          routingNumber = '071025661';
                          bankName = 'BMO';
                          break;
                      }

                      setBeneficiary(value);
                      setAccountNumber(accNumber);
                      setRoutingNumber(routingNumber);
                      setBankName(bankName);
                    }
                  }}
                >
                  <option>---Select Beneficiary----</option>
                  <option value="Dinorah Melendez">Dinorah Melendez</option>
                  <option value="Sonia Adams">Sonia Adams</option>
                  <option value="Carl Quedenfeld">Carl Quedenfeld</option>
                </select>
              ) : (
                <p>{beneficiary}</p>
              )
            }
          </div>
          <div className={styles.formField}>
            <label>Account Number<sup>*</sup></label>
            {
              !isReviewed ? (
                <input 
                  type="text"
                  required
                  disabled
                  value={accountNumber}
                />
              ) : (
                <p>{accountNumber}</p>
              )
            }
          </div>
          <div className={styles.formField}>
            <label>Routing Number<sup>*</sup></label>
            {
              !isReviewed ? (
                <input 
                  type="number"
                  required
                  disabled
                  value={routingNumber}
                />
              ) : (
                <p>{routingNumber}</p>
              )
            }
          </div>
          <div className={styles.formField}>
            <label>Amount<sup>*</sup></label>
            {
              !isReviewed ? (
                <input 
                  type="number"
                  required
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    setAmount(event?.target.value);
                  }}
                />
              ) : (
                <p>{currencyFormatter(`${amount}`)}</p>
              )
            }
          </div>
          {
            isReviewed && bankName && (
              <div className={styles.formField}>
                <label>Bank</label>
                <p>{bankName}</p>
              </div>
            )
          }
          <div className={styles.formField}>
            <label>Description</label>
            {
              !isReviewed ? (
                <textarea onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                  setDescription(event?.target.value);
                }}></textarea>
              ) : (
                <p>{description}</p>
              )
            }
          </div>
          <div className={styles.submitSection}>
            <div className={styles.divider}></div>
            <div className={styles.section}>
              <p><sup>*</sup>Required Field</p>
              <div className={styles.buttonSection}>
                <button 
                  style={!isReviewed ? {cursor: 'not-allowed'} : {}} disabled={!isReviewed} 
                  onClick={onCancel}
                >Cancel</button>
                <button onClick={onSubmit}>{!isReviewed ? "Next": "Proceed"}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransferFunds