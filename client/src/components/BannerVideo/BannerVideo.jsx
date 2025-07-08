import styles from "./BannerVideo.module.scss";

const BannerVideo = () => {
    return (
        <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            style={{ width: '100%', height: 'auto' }}
        >
            <source src="/videoBanner.mp4" type="video/mp4" />
            Your browser does not support the video tag.
        </video>

    )
}

export default BannerVideo;