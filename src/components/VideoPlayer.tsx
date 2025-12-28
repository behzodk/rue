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
  ThumbsUp,
  ThumbsDown,
  Share2,
  BookmarkPlus,
  Eye,
  MessageCircle,
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
  const [isDisliked, setIsDisliked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div
        className={cn(
          "relative bg-black rounded-xl overflow-hidden group",
          isFullscreen ? "aspect-video" : "aspect-video max-h-[70vh]"
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

        {/* Play button overlay */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <button
              onClick={() => setIsPlaying(true)}
              className="p-6 rounded-full bg-primary/90 hover:bg-primary transition-all hover:scale-110 shadow-2xl"
            >
              <Play className="h-10 w-10 text-primary-foreground fill-current" />
            </button>
          </div>
        )}

        {/* Controls overlay */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 transition-opacity",
            showControls || !isPlaying ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Progress bar */}
          <div className="mb-4">
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
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </Button>

              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                <SkipBack className="h-5 w-5" />
              </Button>

              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                <SkipForward className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-2 ml-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <div className="w-20">
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

              <span className="text-white/80 text-sm ml-4">0:00 / 45:30</span>
            </div>

            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
                <Settings className="h-5 w-5" />
              </Button>

              <Button
                size="icon"
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={onToggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div className="space-y-4">
        {/* Title */}
        <h1 className="text-xl md:text-2xl font-bold text-foreground">{video.title}</h1>

        {/* Stats and Actions Row */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Views and Date */}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Eye className="h-4 w-4" />
            <span>{formatCount(video.views)} views</span>
            <span>•</span>
            <span>{formatDate(video.publishedAt)}</span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant={isLiked ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setIsLiked(!isLiked);
                if (isDisliked) setIsDisliked(false);
              }}
              className="gap-2"
            >
              <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
              {formatCount(video.likes + (isLiked ? 1 : 0))}
            </Button>

            <Button
              variant={isDisliked ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setIsDisliked(!isDisliked);
                if (isLiked) setIsLiked(false);
              }}
            >
              <ThumbsDown className={cn("h-4 w-4", isDisliked && "fill-current")} />
            </Button>

            <Button variant="outline" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              Share
            </Button>

            <Button
              variant={isSaved ? "default" : "outline"}
              size="sm"
              onClick={() => setIsSaved(!isSaved)}
              className="gap-2"
            >
              <BookmarkPlus className={cn("h-4 w-4", isSaved && "fill-current")} />
              Save
            </Button>
          </div>
        </div>

        {/* Author Section */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 border border-border">
          <div className="flex items-center gap-4">
            <img
              src={video.author.avatar}
              alt={video.author.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground">{video.author.name}</span>
                {video.author.verified && (
                  <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                    <svg className="h-2.5 w-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {formatCount(video.author.subscribers)} subscribers
              </p>
            </div>
          </div>

          <Button className="gap-2">
            Subscribe
          </Button>
        </div>

        {/* Description */}
        <div className="p-4 rounded-xl bg-secondary/30 border border-border">
          <p className="text-muted-foreground leading-relaxed">{video.description}</p>
        </div>
      </div>
    </div>
  );
}
