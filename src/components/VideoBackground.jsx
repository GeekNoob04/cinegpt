import React from "react";
import { useSelector } from "react-redux";
import useMovieTrailer from "../hooks/useMovieTrailer";

const VideoBackground = ({ movieId }) => {
  const trailerVideo = useSelector((store) => store.movies?.trailerVideo);
  useMovieTrailer(movieId);

  // If there's no trailer video, return nothing or a placeholder
  if (!trailerVideo?.key)
    return <div className="w-screen h-[50vh] md:h-screen bg-black"></div>;

  // YouTube embed URL with all parameters to hide controls
  const embedUrl = `https://www.youtube.com/embed/${trailerVideo.key}?autoplay=1&mute=1&loop=1&playlist=${trailerVideo.key}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&color=white&playsinline=1&enablejsapi=1`;

  return (
    <div className="w-screen h-[50vh] md:h-screen md:aspect-video overflow-hidden relative bg-black">
      {/* Remove the black overlay for mobile devices */}
      <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/10 via-black/10 to-transparent z-[1]"></div>
      <iframe
        className="w-[400%] h-[400%] md:w-[250%] md:h-[250%] aspect-video absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        src={embedUrl}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        frameBorder="0"
        allowFullScreen={false}
      ></iframe>
    </div>
  );
};

export default VideoBackground;
