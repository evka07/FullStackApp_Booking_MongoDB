import { FaCcVisa, FaCcMastercard, FaCcAmex, FaPaypal, FaApplePay, FaGooglePay } from 'react-icons/fa';
import { SiDiscover, SiDinersclub } from 'react-icons/si';
import styles from './PaymentIcons.module.scss';

export default function PaymentIcons() {
    return (
        <ul className={styles.paymentList}>
            <li className={styles.visa}><FaCcVisa size={28} title="Visa" /></li>
            <li className={styles.mastercard}><FaCcMastercard size={28} title="MasterCard" /></li>
            <li className={styles.amex}><FaCcAmex size={28} title="American Express" /></li>
            <li className={styles.paypal}><FaPaypal size={28} title="PayPal" /></li>
            <li className={styles.applepay}><FaApplePay size={28} title="Apple Pay" /></li>
            <li className={styles.googlepay}><FaGooglePay size={28} title="Google Pay" /></li>
            <li className={styles.discover}><SiDiscover size={28} title="Discover" /></li>
            <li className={styles.diners}><SiDinersclub size={28} title="Diners Club" /></li>
        </ul>
    );
}
