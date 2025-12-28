import { useState } from "react";
import { ThumbsUp, ThumbsDown, MessageCircle, ChevronDown, ChevronUp, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface Comment {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified?: boolean;
  };
  content: string;
  likes: number;
  dislikes: number;
  publishedAt: string;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments: Comment[];
  totalComments: number;
}

function CommentItem({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  return (
    <div className={cn("flex gap-3", isReply && "ml-12")}>
      <img
        src={comment.author.avatar}
        alt={comment.author.name}
        className="h-10 w-10 rounded-full object-cover ring-2 ring-border flex-shrink-0"
      />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{comment.author.name}</span>
          {comment.author.verified && (
            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center">
              <svg className="h-2.5 w-2.5 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
              </svg>
            </div>
          )}
          <span className="text-xs text-muted-foreground">{formatDate(comment.publishedAt)}</span>
        </div>

        <p className="text-muted-foreground leading-relaxed">{comment.content}</p>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setIsLiked(!isLiked);
              if (isDisliked) setIsDisliked(false);
            }}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-primary text-primary")} />
            <span className="text-sm">{comment.likes + (isLiked ? 1 : 0)}</span>
          </button>

          <button
            onClick={() => {
              setIsDisliked(!isDisliked);
              if (isLiked) setIsLiked(false);
            }}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <ThumbsDown className={cn("h-4 w-4", isDisliked && "fill-primary text-primary")} />
          </button>

          <button
            onClick={() => setShowReplyInput(!showReplyInput)}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Reply
          </button>
        </div>

        {/* Reply input */}
        {showReplyInput && (
          <div className="flex gap-2 mt-3">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Add a reply..."
              className="min-h-[80px] resize-none"
            />
            <Button size="icon" className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Replies toggle */}
        {comment.replies && comment.replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="flex items-center gap-2 text-primary text-sm font-medium hover:underline mt-2"
          >
            {showReplies ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showReplies ? "Hide" : "View"} {comment.replies.length} replies
          </button>
        )}

        {/* Replies list */}
        {showReplies && comment.replies && (
          <div className="space-y-4 mt-4">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} isReply />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommentSection({ comments, totalComments }: CommentSectionProps) {
  const [newComment, setNewComment] = useState("");
  const [sortBy, setSortBy] = useState<"top" | "newest">("top");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">{totalComments} Comments</h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={sortBy === "top" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("top")}
          >
            Top
          </Button>
          <Button
            variant={sortBy === "newest" ? "default" : "ghost"}
            size="sm"
            onClick={() => setSortBy("newest")}
          >
            Newest
          </Button>
        </div>
      </div>

      {/* Add comment */}
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
          <span className="text-primary font-medium">A</span>
        </div>
        <div className="flex-1 flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px] resize-none"
          />
          <Button size="icon" className="flex-shrink-0 self-end">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
}
