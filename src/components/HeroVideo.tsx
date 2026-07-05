import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type Hls from 'hls.js';

const STREAM_URL =
  'https://stream.mux.com/01yW6GoUz01OTXk5w1Rt1MHkJWlCGIwj46SUONJZ4DJUE.m3u8';

/**
 * Hero background video: HLS stream in constant motion (autoplay, muted,
 * looped). Safari plays HLS natively; other browsers lazy-load hls.js.
 * Autoplay is skipped under prefers-reduced-motion.
 */
export default function HeroVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    let cancelled = false;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = STREAM_URL;
    } else {
      import('hls.js').then(({ default: HlsLib }) => {
        if (cancelled || !HlsLib.isSupported()) return;
        hls = new HlsLib();
        hls.loadSource(STREAM_URL);
        hls.attachMedia(video);
      });
    }

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay={!reduceMotion}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
      aria-hidden
      className={className}
    />
  );
}
