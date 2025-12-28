import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bell, 
  BellOff, 
  Play, 
  Clock, 
  Eye, 
  Users,
  CheckCircle2,
  Grid3X3,
  List,
  Search,
  SlidersHorizontal
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

// Mock subscribed channels
const subscribedChannels = [
  {
    id: "1",
    name: "CodeMaster Pro",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    subscribers: 245000,
    videos: 342,
    verified: true,
    notificationsEnabled: true,
    latestVideo: {
      id: "v1",
      title: "Advanced Dynamic Programming Techniques",
      thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400",
      duration: "45:30",
      views: 12500,
      publishedAt: "2 hours ago"
    }
  },
  {
    id: "2",
    name: "Algorithm Academy",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    subscribers: 189000,
    videos: 256,
    verified: true,
    notificationsEnabled: false,
    latestVideo: {
      id: "v2",
      title: "Graph Theory Masterclass - Part 5",
      thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400",
      duration: "38:15",
      views: 8900,
      publishedAt: "5 hours ago"
    }
  },
  {
    id: "3",
    name: "System Design Hub",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcabd36?w=100",
    subscribers: 520000,
    videos: 189,
    verified: true,
    notificationsEnabled: true,
    latestVideo: {
      id: "v3",
      title: "Design Netflix: Complete System Design",
      thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
      duration: "1:12:45",
      views: 45600,
      publishedAt: "1 day ago"
    }
  },
  {
    id: "4",
    name: "Frontend Focus",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100",
    subscribers: 156000,
    videos: 423,
    verified: false,
    notificationsEnabled: false,
    latestVideo: {
      id: "v4",
      title: "React 19 New Features Deep Dive",
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400",
      duration: "28:00",
      views: 23400,
      publishedAt: "3 days ago"
    }
  },
  {
    id: "5",
    name: "Data Structures Daily",
    avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100",
    subscribers: 98000,
    videos: 567,
    verified: true,
    notificationsEnabled: true,
    latestVideo: {
      id: "v5",
      title: "Segment Trees Explained Simply",
      thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400",
      duration: "22:30",
      views: 5600,
      publishedAt: "4 days ago"
    }
  },
  {
    id: "6",
    name: "Interview Prep Pro",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    subscribers: 312000,
    videos: 234,
    verified: true,
    notificationsEnabled: false,
    latestVideo: {
      id: "v6",
      title: "FAANG Interview: What They Don't Tell You",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400",
      duration: "52:10",
      views: 89000,
      publishedAt: "1 week ago"
    }
  }
];

const formatCount = (num: number) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

export default function Subscriptions() {
  const navigate = useNavigate();
  const [channels, setChannels] = useState(subscribedChannels);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleNotifications = (channelId: string) => {
    setChannels(prev => 
      prev.map(channel => 
        channel.id === channelId 
          ? { ...channel, notificationsEnabled: !channel.notificationsEnabled }
          : channel
      )
    );
  };

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">Subscriptions</h1>
              <p className="text-muted-foreground">
                {channels.length} channels • Stay updated with your favorite creators
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search subscriptions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="bg-secondary/50 p-1">
            <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              All
            </TabsTrigger>
            <TabsTrigger value="recent" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Recent Activity
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Notifications On
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
                  >
                    {/* Latest Video Preview */}
                    <div 
                      className="relative aspect-video cursor-pointer"
                      onClick={() => navigate(`/tutorial/${channel.latestVideo.id}`)}
                    >
                      <img
                        src={channel.latestVideo.thumbnail}
                        alt={channel.latestVideo.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      
                      {/* Duration badge */}
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 rounded text-xs font-mono text-white">
                        {channel.latestVideo.duration}
                      </div>

                      {/* Play overlay */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                          <Play className="h-6 w-6 text-white fill-current" />
                        </div>
                      </div>

                      {/* Video info overlay */}
                      <div className="absolute bottom-3 left-3 right-16">
                        <p className="text-white text-sm font-medium line-clamp-2">
                          {channel.latestVideo.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1 text-white/70 text-xs">
                          <Eye className="h-3 w-3" />
                          <span>{formatCount(channel.latestVideo.views)} views</span>
                          <span>•</span>
                          <span>{channel.latestVideo.publishedAt}</span>
                        </div>
                      </div>
                    </div>

                    {/* Channel Info */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12 ring-2 ring-border">
                          <AvatarImage src={channel.avatar} />
                          <AvatarFallback>{channel.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold truncate">{channel.name}</h3>
                            {channel.verified && (
                              <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {formatCount(channel.subscribers)}
                            </span>
                            <span>{channel.videos} videos</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => toggleNotifications(channel.id)}
                        >
                          {channel.notificationsEnabled ? (
                            <>
                              <Bell className="h-4 w-4 mr-2 text-primary" />
                              Notifications On
                            </>
                          ) : (
                            <>
                              <BellOff className="h-4 w-4 mr-2" />
                              Notifications Off
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition-all"
                  >
                    <Avatar className="h-16 w-16 ring-2 ring-border">
                      <AvatarImage src={channel.avatar} />
                      <AvatarFallback>{channel.name[0]}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{channel.name}</h3>
                        {channel.verified && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {formatCount(channel.subscribers)} subscribers
                        </span>
                        <span>{channel.videos} videos</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                        <Clock className="h-3 w-3" />
                        Latest: {channel.latestVideo.title}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleNotifications(channel.id)}
                        className={channel.notificationsEnabled ? "text-primary" : "text-muted-foreground"}
                      >
                        {channel.notificationsEnabled ? (
                          <Bell className="h-5 w-5" />
                        ) : (
                          <BellOff className="h-5 w-5" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/tutorial/${channel.latestVideo.id}`)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Watch Latest
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            <div className="text-center py-12 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Channels with recent activity will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChannels
                .filter(c => c.notificationsEnabled)
                .map((channel) => (
                  <div
                    key={channel.id}
                    className="flex items-center gap-4 p-4 bg-card border border-primary/30 rounded-xl"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={channel.avatar} />
                      <AvatarFallback>{channel.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{channel.name}</h3>
                        {channel.verified && (
                          <CheckCircle2 className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatCount(channel.subscribers)} subscribers
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      <Bell className="h-3 w-3 mr-1" />
                      On
                    </Badge>
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}