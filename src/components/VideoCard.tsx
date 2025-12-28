import { Play, Eye, ThumbsUp, MessageCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  difficulty?: "easy" | "medium" | "hard";
  category: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function VideoCard({
  title,
  thumbnail,
  duration,
  views,
  likes,
  comments,
  author,
  difficulty,
  category,
  isSelected,
  onClick,
}: VideoCardProps) {
  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "group cursor-pointer rounded-xl overflow-hidden border transition-all duration-300",
        isSelected
          ? "border-primary bg-primary/5 ring-2 ring-primary/20"
          : "border-border bg-card hover:border-primary/50 hover:bg-accent/50"
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        {/* Play overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="p-4 rounded-full bg-primary/90 backdrop-blur-sm">
            <Play className="h-6 w-6 text-primary-foreground fill-current" />
          </div>
        </div>

        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/80 backdrop-blur-sm text-xs font-medium text-white flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {duration}
        </div>

        {/* Difficulty badge */}
        {difficulty && (
          <div
            className={cn(
              "absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-bold uppercase backdrop-blur-sm",
              difficulty === "easy" && "bg-easy/20 text-easy border border-easy/30",
              difficulty === "medium" && "bg-medium/20 text-medium border border-medium/30",
              difficulty === "hard" && "bg-hard/20 text-hard border border-hard/30"
            )}
          >
            {difficulty}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category */}
        <span className="text-xs font-medium text-primary/80 uppercase tracking-wider">
          {category}
        </span>

        {/* Title */}
        <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2">
          <img
            src={author.avatar}
            alt={author.name}
            className="h-7 w-7 rounded-full object-cover ring-2 ring-border"
          />
          <span className="text-sm text-muted-foreground">{author.name}</span>
          {author.verified && (
            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
              <svg className="h-2.5 w-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            <span>{formatCount(views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{formatCount(likes)}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-3.5 w-3.5" />
            <span>{formatCount(comments)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
