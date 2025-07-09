import styles from './BannerVideo.module.scss';

const BannerVideo = () => {
    return (
        <div className={styles.bannerWrapper}>
            <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                className={styles.video}
            >
                <source src="/videoBanner.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className={styles.overlayText}>
                <h1>Discover Krakow Events</h1>
                <p>Book concerts, theatre, and more</p>
            </div>
        </div>
    );
};

export default BannerVideo;
