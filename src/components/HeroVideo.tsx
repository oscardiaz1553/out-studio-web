import { useReducedMotion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import type Hls from 'hls.js';

const STREAM_URL =
  'https://stream.mux.com/r6pXRAJb3005XEEbl1hYU1x01RFJDSn7KQApwNGgAHHbU.m3u8';

export default function HeroVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;
    let cancelled = false;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Safari / iOS play HLS natively
      video.src = STREAM_URL;
    } else {
      // Chrome / Firefox need hls.js — loaded lazily to keep the main bundle lean
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
