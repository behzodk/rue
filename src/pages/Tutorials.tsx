import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Search, Filter, TrendingUp, Clock, Star, Play, Eye, ThumbsUp, Clock as ClockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mock data
const mockVideos = [
  {
    id: "1",
    title: "Master Dynamic Programming: From Zero to Hero Complete Guide",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop",
    duration: "45:30",
    views: 125000,
    likes: 8500,
    publishedAt: "2024-01-15",
    category: "Dynamic Programming",
    difficulty: "medium" as const,
    author: {
      name: "CodeMaster Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      verified: true,
    },
  },
  {
    id: "2",
    title: "Graph Algorithms Masterclass: BFS, DFS, Dijkstra & More",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800&h=450&fit=crop",
    duration: "1:12:45",
    views: 89000,
    likes: 6200,
    publishedAt: "2024-01-10",
    category: "Graph Theory",
    difficulty: "hard" as const,
    author: {
      name: "AlgoExpert",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      verified: true,
    },
  },
  {
    id: "3",
    title: "Two Pointers Technique: Solve Problems 10x Faster",
    thumbnail: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800&h=450&fit=crop",
    duration: "28:15",
    views: 67000,
    likes: 4800,
    publishedAt: "2024-01-08",
    category: "Arrays",
    difficulty: "easy" as const,
    author: {
      name: "TechWithTim",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
      verified: true,
    },
  },
  {
    id: "4",
    title: "Binary Search: The Complete Interview Guide",
    thumbnail: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=450&fit=crop",
    duration: "35:20",
    views: 95000,
    likes: 7100,
    publishedAt: "2024-01-05",
    category: "Searching",
    difficulty: "medium" as const,
    author: {
      name: "NeetCode",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      verified: true,
    },
  },
  {
    id: "5",
    title: "Recursion & Backtracking: Crack Any Interview Problem",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=450&fit=crop",
    duration: "52:40",
    views: 78000,
    likes: 5600,
    publishedAt: "2024-01-02",
    category: "Backtracking",
    difficulty: "hard" as const,
    author: {
      name: "CodeMaster Pro",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
      verified: true,
    },
  },
  {
    id: "6",
    title: "Hash Tables & Hash Maps: Everything You Need to Know",
    thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
    duration: "32:10",
    views: 56000,
    likes: 4200,
    publishedAt: "2023-12-28",
    category: "Data Structures",
    difficulty: "easy" as const,
    author: {
      name: "AlgoExpert",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      verified: true,
    },
  },
  {
    id: "7",
    title: "Linked Lists: Complete Guide for Beginners",
    thumbnail: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=800&h=450&fit=crop",
    duration: "38:45",
    views: 42000,
    likes: 3200,
    publishedAt: "2023-12-25",
    category: "Data Structures",
    difficulty: "easy" as const,
    author: {
      name: "TechWithTim",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop",
      verified: true,
    },
  },
  {
    id: "8",
    title: "Advanced Tree Algorithms: Segment Trees & More",
    thumbnail: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&h=450&fit=crop",
    duration: "1:05:20",
    views: 35000,
    likes: 2800,
    publishedAt: "2023-12-20",
    category: "Trees",
    difficulty: "hard" as const,
    author: {
      name: "NeetCode",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      verified: true,
    },
  },
];

const categories = ["All", "Dynamic Programming", "Graph Theory", "Arrays", "Searching", "Backtracking", "Data Structures", "Trees"];

export default function Tutorials() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredVideos = mockVideos.filter((video) => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-4 md:py-6">
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
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
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


        {/* YouTube-Style Video Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredVideos.map((video) => (
            <Link key={video.id} to={`/tutorial/${video.id}`} className="group">
              <div className="space-y-3">
                {/* Thumbnail */}
                <div className="relative aspect-video rounded-xl overflow-hidden bg-secondary">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  
                  {/* Play overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 rounded-full bg-primary/90 backdrop-blur-sm">
                      <Play className="h-5 w-5 text-primary-foreground fill-current" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded-md bg-black/80 backdrop-blur-sm text-xs font-medium text-white flex items-center gap-1">
                    <ClockIcon className="h-3 w-3" />
                    {video.duration}
                  </div>

                  {/* Difficulty badge */}
                  <div
                    className={cn(
                      "absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-bold uppercase backdrop-blur-sm",
                      video.difficulty === "easy" && "bg-easy/20 text-easy border border-easy/30",
                      video.difficulty === "medium" && "bg-medium/20 text-medium border border-medium/30",
                      video.difficulty === "hard" && "bg-hard/20 text-hard border border-hard/30"
                    )}
                  >
                    {video.difficulty}
                  </div>
                </div>

                {/* Video Info */}
                <div className="flex gap-3">
                  {/* Author Avatar */}
                  <img
                    src={video.author.avatar}
                    alt={video.author.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-border flex-shrink-0"
                  />

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-foreground text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                    
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs text-muted-foreground">{video.author.name}</span>
                      {video.author.verified && (
                        <div className="h-3.5 w-3.5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                          <svg className="h-2 w-2 text-primary-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {formatCount(video.views)} views
                      </span>
                      <span>•</span>
                      <span>{getTimeAgo(video.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <div className="p-4 rounded-full bg-secondary/50 inline-block mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No tutorials found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </main>
    </div>
  );
}