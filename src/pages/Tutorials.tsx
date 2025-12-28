import { useState } from "react";
import { Header } from "@/components/Header";
import { VideoCard } from "@/components/VideoCard";
import { VideoPlayer } from "@/components/VideoPlayer";
import { CommentSection } from "@/components/CommentSection";
import { Search, Filter, Grid, List, TrendingUp, Clock, Star, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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

const categories = ["All", "Dynamic Programming", "Graph Theory", "Arrays", "Searching", "Backtracking", "Data Structures"];

export default function Tutorials() {
  const [selectedVideo, setSelectedVideo] = useState(mockVideos[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVideoList, setShowVideoList] = useState(true);

  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-6">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tutorial Videos</h1>
            <p className="text-muted-foreground mt-1">Learn algorithms and data structures from expert instructors</p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Trending</p>
              <p className="font-semibold text-foreground">24 Videos</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="p-2 rounded-lg bg-medium/10">
              <Clock className="h-5 w-5 text-medium" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Watch Time</p>
              <p className="font-semibold text-foreground">12.5 hrs</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary/50 border border-border">
            <div className="p-2 rounded-lg bg-easy/10">
              <Star className="h-5 w-5 text-easy" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completed</p>
              <p className="font-semibold text-foreground">8 Videos</p>
            </div>
          </div>
        </div>

        {/* Main Content - Theater Mode Layout */}
        <div className={cn("grid gap-6", showVideoList ? "lg:grid-cols-[1fr_380px]" : "")}>
          {/* Video Player Section */}
          <div className="space-y-6">
            {/* Back button on mobile when video is selected */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden mb-4"
              onClick={() => setShowVideoList(true)}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to videos
            </Button>

            <VideoPlayer
              video={selectedVideo}
              isFullscreen={isFullscreen}
              onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
            />

            {/* Comments Section */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <CommentSection comments={mockComments} totalComments={selectedVideo.comments} />
            </div>
          </div>

          {/* Video List Sidebar */}
          <div className={cn("lg:block", showVideoList ? "block" : "hidden")}>
            <div className="sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Up Next</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVideoList(false)}
                  className="hidden lg:flex"
                >
                  Hide
                </Button>
              </div>

              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="space-y-4 pr-4">
                  {filteredVideos.map((video) => (
                    <VideoCard
                      key={video.id}
                      {...video}
                      isSelected={selectedVideo.id === video.id}
                      onClick={() => {
                        setSelectedVideo(video);
                        setShowVideoList(false);
                      }}
                    />
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
