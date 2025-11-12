import React from 'react';
import backgroundVideo from '../public/videos/trailers.mp4';

const VideoBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <video
        src="/videos/trailers.mp4"   // file in /public/videos
        autoPlay
        muted
        loop
        playsInline
        className="h-full w-full object-cover"
      />
      {/* Optional dark overlay so text stays readable */}
      <div className="absolute inset-0 bg-black/50" />
    </div>
  );
};
export default VideoBackground;