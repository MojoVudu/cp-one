import create from 'zustand';
import Transaction from '../models/Transaction';
import User from '../models/User';

interface IStore {
    accountBalance: number
    currentUser: User | null
    completedTransaction: Transaction | null
    transactions: Transaction[] | null
    blockedStatus: boolean
    mainLoadingStatus: boolean
    logInStatus: boolean
    receiptStatus: boolean
    transferFunds: boolean
    mobileNavActive: boolean
    mobileNavActiveItem: string
    transactionStatus: string | null
    setMainLoadingStatus: (status: boolean) => void
    setLogInStatus: (status: boolean) => void
    setBlockedStatus: (status: boolean) => void
    setAccountBalance: (value: number) => void
    setTransactions: (value: Transaction[]) => void
    setReceiptStatus: (value: boolean) => void
    setCompletedTransaction: (transaction: Transaction) => void
    setCurrentUser: (user: User) => void
    setTransferFunds: (status: boolean) => void
    setMobileNavActive: (status: boolean) => void
    setMobileNavActiveItem: (item: string) => void
    setTransactionStatus: (value: string) => void
    makeSignOutRequest: () => void
}

const useStore = create<IStore>((set) => ({
    accountBalance: 0,
    currentUser: null,
    completedTransaction: null,
    transactions: null,
    blockedStatus: false,
    mainLoadingStatus: false,
    logInStatus: false,
    receiptStatus: false,
    transferFunds: false,
    mobileNavActive: false,
    mobileNavActiveItem: '',
    transactionStatus: 'success',
    setMainLoadingStatus: status => set(({ mainLoadingStatus: status })),
    setLogInStatus: status => {
        set(({ logInStatus: status }));
        localStorage.setItem('ls', JSON.stringify(status));
        window.location.reload();
    },
    setBlockedStatus: status => {
        set({ blockedStatus: status });
        localStorage.setItem('bs', JSON.stringify(status));
    },
    setAccountBalance: value => set({ accountBalance: value }),
    setTransactions: value => set({ transactions: value }),
    setReceiptStatus: status => set({ receiptStatus: status }),
    setCompletedTransaction: transaction => set({ completedTransaction: transaction }),
    setCurrentUser: user => set({ currentUser: user }),
    setTransferFunds: status => set({ transferFunds: status }),
    setMobileNavActive: status => set({ mobileNavActive: status }),
    setMobileNavActiveItem: item => set({ mobileNavActiveItem: item }),
    setTransactionStatus: value => set({ transactionStatus: value }),
    makeSignOutRequest: async () => {
        await fetch('https://naughty-kit-hare.cyclic.app/signout');
    }
}));

export default useStore;