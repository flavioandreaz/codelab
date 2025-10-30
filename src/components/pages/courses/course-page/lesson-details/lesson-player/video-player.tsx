import "@vidstack/react/player/styles/base.css";
import "@vidstack/react/player/styles/plyr/theme.css";

import { MediaPlayer } from "@vidstack/react";

type VideoPlayerProps = {
  videoId: string;
  autoplay: boolean;
  onEnd?: () => void;
};

const VideoPlayer = ({ videoId, autoplay, onEnd }: VideoPlayerProps) => {
  const userAlreadyInteracted = navigator.userActivation.hasBeenActive;

  return (
    <MediaPlayer
      title="Vídeo da Aula"
      src={`youtube/${videoId}`}
      onEnd={onEnd}
      autoPlay={autoplay && userAlreadyInteracted}
      controls
    />
  );
};

export default VideoPlayer;