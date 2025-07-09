import QRCode from 'react-qr-code';
import styles from './QRCodeComponent.module.scss';

const QRCodeComponent = () => {
    return (
        <div className={styles.wrapperQRCode}>
            <div className={styles.qrBox}>
                <QRCode value="https://www.tickets-krakow.com/" size={130} />
                <p className={styles.nameQR}>Download the app</p>
            </div>

        </div>
    );
};

export default QRCodeComponent;
