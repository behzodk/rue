import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CommentSection } from "@/components/CommentSection";
import { ChevronLeft, Eye, ThumbsUp, Calendar, Tag, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock data
const mockVideos = [
  {
    id: "1",
    title: "Master Dynamic Programming: From Zero to Hero Complete Guide",
    description: "In this comprehensive tutorial, we'll cover everything you need to know about Dynamic Programming. From basic concepts like memoization and tabulation to advanced techniques like state compression and digit DP. Perfect for interview preparation and competitive programming.",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "45:30",
    views: 125000,
    likes: 8500,
    dislikes: 120,
    comments: 342,
    publishedAt: "2024-01-15",
    category: "Dynamic Programming",
    difficulty: "medium" as const,
    author: {
      name: "CodeMaster Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      subscribers: 250000,
      verified: true,
    },
  },
  {
    id: "2",
    title: "Graph Algorithms Masterclass: BFS, DFS, Dijkstra & More",
    description: "Deep dive into graph algorithms used in technical interviews. Learn breadth-first search, depth-first search, shortest path algorithms, and topological sorting with real-world examples.",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "1:12:45",
    views: 89000,
    likes: 6200,
    dislikes: 85,
    comments: 256,
    publishedAt: "2024-01-10",
    category: "Graph Theory",
    difficulty: "hard" as const,
    author: {
      name: "AlgoExpert",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      subscribers: 180000,
      verified: true,
    },
  },
  {
    id: "3",
    title: "Two Pointers Technique: Solve Problems 10x Faster",
    description: "Learn the powerful two pointers technique that will help you solve array problems efficiently. We'll cover sliding window, fast-slow pointers, and more patterns.",
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "28:15",
    views: 67000,
    likes: 4800,
    dislikes: 45,
    comments: 189,
    publishedAt: "2024-01-08",
    category: "Arrays",
    difficulty: "easy" as const,
    author: {
      name: "TechWithTim",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
      subscribers: 320000,
      verified: true,
    },
  },
  {
    id: "4",
    title: "Binary Search: The Complete Interview Guide",
    description: "Master binary search and its variations. From basic implementation to advanced applications in rotated arrays, finding boundaries, and optimization problems.",
    thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "35:20",
    views: 95000,
    likes: 7100,
    dislikes: 62,
    comments: 278,
    publishedAt: "2024-01-05",
    category: "Searching",
    difficulty: "medium" as const,
    author: {
      name: "NeetCode",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      subscribers: 500000,
      verified: true,
    },
  },
  {
    id: "5",
    title: "Recursion & Backtracking: Crack Any Interview Problem",
    description: "Understand recursion deeply and learn backtracking patterns. We solve N-Queens, Sudoku, permutations, combinations, and many more classic problems.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "52:40",
    views: 78000,
    likes: 5600,
    dislikes: 73,
    comments: 312,
    publishedAt: "2024-01-02",
    category: "Backtracking",
    difficulty: "hard" as const,
    author: {
      name: "CodeMaster Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      subscribers: 250000,
      verified: true,
    },
  },
  {
    id: "6",
    title: "Hash Tables & Hash Maps: Everything You Need to Know",
    description: "Deep dive into hash table implementation, collision handling, and practical applications. Learn to use hash maps effectively in coding interviews.",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
    videoUrl: "",
    duration: "32:10",
    views: 56000,
    likes: 4200,
    dislikes: 38,
    comments: 156,
    publishedAt: "2023-12-28",
    category: "Data Structures",
    difficulty: "easy" as const,
    author: {
      name: "AlgoExpert",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      subscribers: 180000,
      verified: true,
    },
  },
];

const mockComments = [
  {
    id: "1",
    author: {
      name: "DevEnthusiast",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
      verified: false,
    },
    content: "This is by far the best explanation of Dynamic Programming I've ever seen. The way you break down complex concepts into simple steps is amazing!",
    likes: 245,
    dislikes: 3,
    publishedAt: "2024-01-16",
    replies: [
      {
        id: "1-1",
        author: {
          name: "CodeMaster Pro",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
          verified: true,
        },
        content: "Thank you so much! I'm glad it helped. More advanced content coming soon!",
        likes: 89,
        dislikes: 0,
        publishedAt: "2024-01-16",
      },
    ],
  },
  {
    id: "2",
    author: {
      name: "InterviewPrepper",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      verified: false,
    },
    content: "Finally understood memoization after watching this. Got an offer from Google last week, and DP was a huge part of my interviews. Thanks!",
    likes: 567,
    dislikes: 2,
    publishedAt: "2024-01-15",
  },
  {
    id: "3",
    author: {
      name: "AlgoNinja",
      avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop",
      verified: false,
    },
    content: "Can you make a video specifically on state compression DP? That topic is really challenging for me.",
    likes: 134,
    dislikes: 1,
    publishedAt: "2024-01-14",
  },
];

export default function TutorialDetail() {
  const { id } = useParams();
  const [isFullscreen, setIsFullscreen] = useState(false);

  const video = mockVideos.find((v) => v.id === id) || mockVideos[0];

  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container max-w-5xl py-6 md:py-10">
        {/* Back Button */}
        <Link to="/tutorials">
          <Button variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4 mr-1" />
            All Tutorials
          </Button>
        </Link>

        {/* Video Player */}
        <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-lg">
          <VideoPlayer
            video={video}
            isFullscreen={isFullscreen}
            onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
          />
        </div>

        {/* Video Meta Section */}
        <div className="mt-8 space-y-6">
          {/* Title & Badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide",
                video.difficulty === "easy" && "bg-easy/15 text-easy border border-easy/30",
                video.difficulty === "medium" && "bg-medium/15 text-medium border border-medium/30",
                video.difficulty === "hard" && "bg-hard/15 text-hard border border-hard/30"
              )}>
                {video.difficulty}
              </span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                {video.category}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground leading-tight">
              {video.title}
            </h1>
          </div>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground py-4 border-y border-border">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <span>{formatCount(video.views)} views</span>
            </div>
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-4 w-4" />
              <span>{formatCount(video.likes)} likes</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{video.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(video.publishedAt)}</span>
            </div>
          </div>

          {/* Author Card */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-secondary/80 to-secondary/40 border border-border">
            <img
              src={video.author.avatar}
              alt={video.author.name}
              className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/20"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-foreground truncate">{video.author.name}</span>
                {video.author.verified && (
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <svg className="h-3 w-3 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="h-3.5 w-3.5" />
                {formatCount(video.author.subscribers)} subscribers
              </p>
            </div>
            <Button className="rounded-full px-6">Subscribe</Button>
          </div>

          {/* Description */}
          <div className="p-5 rounded-2xl bg-muted/30 border border-border">
            <h3 className="text-sm font-semibold text-foreground mb-2">About this tutorial</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {video.description}
            </p>
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-10 p-6 rounded-2xl bg-card border border-border">
          <CommentSection comments={mockComments} totalComments={video.comments} />
        </div>
      </main>
    </div>
  );
}