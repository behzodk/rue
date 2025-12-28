import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CommentSection } from "@/components/CommentSection";
import { VideoCard } from "@/components/VideoCard";
import { ChevronLeft, Eye, ThumbsUp, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// Mock data - same as Tutorials
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
  const [showSidebar, setShowSidebar] = useState(true);

  const video = mockVideos.find((v) => v.id === id) || mockVideos[0];
  const relatedVideos = mockVideos.filter((v) => v.id !== id).slice(0, 5);

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

      <main className="container py-4 md:py-6">
        {/* Back Button */}
        <Link to="/tutorials">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Tutorials
          </Button>
        </Link>

        {/* Main Content - Theater Mode Layout */}
        <div className={cn("grid gap-6", showSidebar ? "xl:grid-cols-[1fr_380px]" : "")}>
          {/* Video Player Section */}
          <div className="space-y-6">
            <VideoPlayer
              video={video}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            />

            {/* Video Info */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn(
                  "px-2 py-1 rounded-md text-xs font-bold uppercase",
                  video.difficulty === "easy" && "bg-easy/20 text-easy",
                  video.difficulty === "medium" && "bg-medium/20 text-medium",
                  video.difficulty === "hard" && "bg-hard/20 text-hard"
                )}>
                  {video.difficulty}
                </span>
                <span className="px-2 py-1 rounded-md bg-secondary text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Tag className="h-3 w-3" />
                  {video.category}
                </span>
              </div>

              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                {video.title}
              </h1>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{formatCount(video.views)} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{formatCount(video.likes)} likes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(video.publishedAt)}</span>
                </div>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 border border-border">
                <img
                  src={video.author.avatar}
                  alt={video.author.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
                />
                <div className="flex-1">
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
                  <p className="text-sm text-muted-foreground">{formatCount(video.author.subscribers)} subscribers</p>
                </div>
                <Button variant="default">Subscribe</Button>
              </div>

              {/* Description */}
              <div className="p-4 rounded-xl bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {video.description}
                </p>
              </div>
            </div>

            {/* Comments Section */}
            <div className="p-4 md:p-6 rounded-xl bg-card border border-border">
              <CommentSection comments={mockComments} totalComments={video.comments} />
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="hidden xl:block">
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Related Videos</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSidebar(false)}
                >
                  Hide
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4 pr-4">
                  {relatedVideos.map((relatedVideo) => (
                    <Link key={relatedVideo.id} to={`/tutorial/${relatedVideo.id}`}>
                      <VideoCard
                        {...relatedVideo}
                        compact
                      />
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>

        {/* Mobile Related Videos */}
        <div className="xl:hidden mt-8">
          <h2 className="font-semibold text-foreground mb-4">Related Videos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedVideos.slice(0, 4).map((relatedVideo) => (
              <Link key={relatedVideo.id} to={`/tutorial/${relatedVideo.id}`}>
                <VideoCard {...relatedVideo} compact />
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}