import { useState } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Settings,
  SkipBack,
  SkipForward,
  Heart,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  video: {
    id: string;
    title: string;
    description: string;
    videoUrl: string;
    thumbnail: string;
    views: number;
    likes: number;
    dislikes: number;
    comments: number;
    publishedAt: string;
    author: {
      name: string;
      avatar: string;
      subscribers: number;
      verified?: boolean;
    };
  };
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}

export function VideoPlayer({ video, isFullscreen, onToggleFullscreen }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(false);

  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className="space-y-0">
      {/* Video Container - Cinematic Style */}
      <div
        className={cn(
          "relative bg-gradient-to-b from-black to-zinc-900 overflow-hidden group",
          isFullscreen ? "aspect-video" : "aspect-video"
        )}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        {/* Video Thumbnail/Placeholder */}
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />

        {/* Cinematic vignette effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

        {/* Play button overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <button
              onClick={() => setIsPlaying(true)}
              className="relative p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all hover:scale-110 group/play"
            >
              <div className="absolute inset-0 rounded-full bg-primary/30 blur-xl opacity-0 group-hover/play:opacity-100 transition-opacity" />
              <Play className="h-8 w-8 text-white fill-current relative z-10" />
            </button>
          </div>
        )}

        {/* Controls overlay */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-5 transition-all duration-300",
            showControls || !isPlaying ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          )}
        >
          {/* Progress bar */}
          <div className="mb-4 group/progress">
            <Slider
              value={[progress]}
              max={100}
              step={0.1}
              onValueChange={(val) => setProgress(val[0])}
              className="cursor-pointer"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Button
                size="icon"
                variant="ghost"
                className="text-white/90 hover:text-white hover:bg-white/10 h-9 w-9"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </Button>

              <Button size="icon" variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 h-9 w-9">
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button size="icon" variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 h-9 w-9">
                <SkipForward className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2 ml-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white/90 hover:text-white hover:bg-white/10 h-9 w-9"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <div className="w-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Slider
                    value={[isMuted ? 0 : volume]}
                    max={100}
                    step={1}
                    onValueChange={(val) => {
                      setVolume(val[0]);
                      if (val[0] > 0) setIsMuted(false);
                    }}
                  />
                </div>
              </div>

              <span className="text-white/70 text-sm font-mono ml-4">0:00 / 45:30</span>
            </div>

            <div className="flex items-center gap-1">
              <Button size="icon" variant="ghost" className="text-white/90 hover:text-white hover:bg-white/10 h-9 w-9">
                <Settings className="h-4 w-4" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-white/90 hover:text-white hover:bg-white/10 h-9 w-9"
                onClick={onToggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar - Clean style with heart and share */}
      <div className="flex items-center justify-end gap-3 p-4 bg-gradient-to-r from-card to-secondary/30 border-t border-border">
        <Button
          variant={isLiked ? "default" : "ghost"}
          size="sm"
          onClick={() => setIsLiked(!isLiked)}
          className={cn(
            "gap-2 rounded-full transition-all duration-300",
            isLiked && "animate-heartbeat bg-rose-500 hover:bg-rose-600",
            !isLiked && "text-muted-foreground hover:text-foreground"
          )}
        >
          <Heart className={cn("h-4 w-4 transition-transform", isLiked && "fill-current scale-110")} />
          <span className="font-medium">{formatCount(video.likes + (isLiked ? 1 : 0))}</span>
        </Button>

        <Button variant="ghost" size="sm" className="gap-2 rounded-full text-muted-foreground hover:text-foreground">
          <Share2 className="h-4 w-4" />
          <span>Share</span>
        </Button>
      </div>
    </div>
  );
}
