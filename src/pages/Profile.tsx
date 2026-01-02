import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/Header";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";
import { StatsCard } from "@/components/StatsCard";
import { DifficultyBadge } from "@/components/DifficultyBadge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import {
  User,
  MapPin,
  Mail,
  Edit3,
  Save,
  X,
  Trophy,
  Target,
  Flame,
  Calendar,
  Code2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
  Star,
} from "lucide-react";

// Generate sample activity data
const generateActivityData = () => {
  const data: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const count = Math.random() > 0.4 ? Math.floor(Math.random() * 8) : 0;
    data.push({ date: dateStr, count });
  }
  return data;
};

const activityData = generateActivityData();

const statsData = {
  rank: 12458,
  totalSolved: 247,
  easySolved: 120,
  mediumSolved: 98,
  hardSolved: 29,
  easyTotal: 650,
  mediumTotal: 1420,
  hardTotal: 580,
  streak: 23,
  maxStreak: 45,
  contestRating: 1847,
  contestsAttended: 15,
  contributions: 42,
  reputation: 1250,
};

const recentBadges = [
  { name: "100 Days", icon: Flame, color: "text-orange-500" },
  { name: "Array Master", icon: Code2, color: "text-primary" },
  { name: "First Contest", icon: Trophy, color: "text-yellow-500" },
  { name: "Problem Setter", icon: Star, color: "text-purple-500" },
];

const languageStats = [
  { language: "JavaScript", count: 124, percentage: 50 },
  { language: "Python", count: 78, percentage: 32 },
  { language: "TypeScript", count: 32, percentage: 13 },
  { language: "Java", count: 13, percentage: 5 },
];

const skillTags = [
  { name: "Arrays", solved: 85, total: 120 },
  { name: "Hash Table", solved: 62, total: 95 },
  { name: "String", solved: 48, total: 80 },
  { name: "Dynamic Programming", solved: 35, total: 120 },
  { name: "Tree", solved: 42, total: 85 },
  { name: "Graph", solved: 28, total: 75 },
  { name: "Binary Search", solved: 38, total: 55 },
  { name: "Sorting", solved: 32, total: 45 },
];

export default function Profile() {
  const { user, profile, isProfileLoading, refreshProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    bio: "",
    location: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setEditData({
      firstName: profile.first_name,
      lastName: profile.last_name,
      username: profile.username,
      bio: profile.bio ?? "",
      location: profile.location ?? "",
    });
  }, [profile]);

  const displayName = useMemo(() => {
    if (!profile) return "Profile";
    return `${profile.first_name} ${profile.last_name}`.trim();
  }, [profile]);

  const joinedDate = useMemo(() => {
    if (!user?.created_at) return null;
    return new Date(user.created_at).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, [user?.created_at]);

  const validateUsername = (value: string) => {
    if (value.length < 4) {
      return "Username must be at least 4 characters.";
    }
    if (!/^[a-z]/.test(value)) {
      return "Username must start with a letter.";
    }
    if (!/^[a-z0-9_-]+$/.test(value)) {
      return "Only letters, numbers, underscore, and hyphen are allowed.";
    }
    if (value.length > 24) {
      return "Username must be 24 characters or fewer.";
    }
    return null;
  };

  const handleSave = async () => {
    setError(null);
    if (!user || !profile) {
      setError("Profile is unavailable. Please refresh and try again.");
      return;
    }

    const trimmedFirstName = editData.firstName.trim();
    const trimmedLastName = editData.lastName.trim();
    const normalizedUsername = editData.username.trim().toLowerCase();

    if (!trimmedFirstName || !trimmedLastName || !normalizedUsername) {
      setError("First name, last name, and username are required.");
      return;
    }

    const validationError = validateUsername(normalizedUsername);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name: trimmedFirstName,
        last_name: trimmedLastName,
        username: normalizedUsername,
        bio: editData.bio.trim() || null,
        location: editData.location.trim() || null,
      })
      .eq("user_id", user.id);
    if (updateError) {
      setIsSaving(false);
      setError(updateError.message);
      return;
    }

    await refreshProfile();
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        firstName: profile.first_name,
        lastName: profile.last_name,
        username: profile.username,
        bio: profile.bio ?? "",
        location: profile.location ?? "",
      });
    }
    setError(null);
    setIsEditing(false);
  };

  if (isProfileLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-muted-foreground">Loading profile...</main>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-12 text-muted-foreground">
          Profile not found. Please refresh or create one.
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex items-start justify-between mb-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-foreground" />
                </div>
                <button
                  onClick={() => isEditing ? handleCancel() : setIsEditing(true)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    isEditing ? "bg-destructive/10 text-destructive hover:bg-destructive/20" : "hover:bg-accent"
                  )}
                >
                  {isEditing ? <X className="h-5 w-5" /> : <Edit3 className="h-5 w-5" />}
                </button>
              </div>

              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">First name</label>
                    <input
                      type="text"
                      value={editData.firstName}
                      onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Last name</label>
                    <input
                      type="text"
                      value={editData.lastName}
                      onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Username</label>
                    <input
                      type="text"
                      value={editData.username}
                      onChange={(e) => setEditData({ ...editData, username: e.target.value.toLowerCase() })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Bio</label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                      rows={3}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Location</label>
                    <input
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({ ...editData, location: e.target.value })}
                      className="w-full mt-1 px-3 py-2 rounded-lg bg-muted border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className={cn(
                      "w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg",
                      "bg-primary text-primary-foreground hover:bg-primary/90 transition-colors",
                      isSaving && "cursor-not-allowed opacity-70 hover:bg-primary",
                    )}
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{displayName}</h1>
                  <p className="text-muted-foreground">@{profile.username}</p>
                  <p className="mt-4 text-sm leading-relaxed">
                    {profile.bio || "No bio yet. Add one to tell the community about your focus."}
                  </p>

                  <div className="mt-6 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{profile.location || "Location not set"}</span>
                    </div>
                    {user?.email && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>{user.email}</span>
                      </div>
                    )}
                    {joinedDate && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Joined {joinedDate}</span>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Badges */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Badges
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {recentBadges.map((badge, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-lg bg-muted/50 border border-border flex items-center gap-3 hover:bg-accent transition-colors"
                  >
                    <badge.icon className={cn("h-6 w-6", badge.color)} />
                    <span className="text-sm font-medium">{badge.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Languages */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Code2 className="h-5 w-5 text-primary" />
                Languages
              </h3>
              <div className="space-y-4">
                {languageStats.map((lang, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{lang.language}</span>
                      <span className="text-muted-foreground">{lang.count} problems</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{ width: `${lang.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Stats & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                title="Global Rank"
                value={`#${statsData.rank.toLocaleString()}`}
                icon={Trophy}
                trend={{ value: 12, isPositive: true }}
              />
              <StatsCard
                title="Contest Rating"
                value={statsData.contestRating.toString()}
                icon={TrendingUp}
                trend={{ value: 25, isPositive: true }}
              />
              <StatsCard
                title="Current Streak"
                value={`${statsData.streak} days`}
                icon={Flame}
              />
              <StatsCard
                title="Reputation"
                value={statsData.reputation.toString()}
                icon={Star}
                trend={{ value: 8, isPositive: true }}
              />
            </div>

            {/* Problem Solving Stats */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-6 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Problem Solving Progress
              </h3>
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Circular Progress */}
                <div className="flex items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="96"
                        cy="96"
                        r="85"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        className="text-muted/30"
                      />
                      <circle
                        cx="96"
                        cy="96"
                        r="85"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="none"
                        strokeDasharray={534}
                        strokeDashoffset={534 - (534 * statsData.totalSolved) / (statsData.easyTotal + statsData.mediumTotal + statsData.hardTotal)}
                        className="text-primary"
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold">{statsData.totalSolved}</span>
                      <span className="text-sm text-muted-foreground">Solved</span>
                    </div>
                  </div>
                </div>

                {/* Difficulty Breakdown */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DifficultyBadge difficulty="Easy" />
                        <span className="text-sm text-muted-foreground">
                          {statsData.easySolved}/{statsData.easyTotal}
                        </span>
                      </div>
                      <span className="font-semibold text-easy">{statsData.easySolved}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-easy"
                        style={{ width: `${(statsData.easySolved / statsData.easyTotal) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DifficultyBadge difficulty="Medium" />
                        <span className="text-sm text-muted-foreground">
                          {statsData.mediumSolved}/{statsData.mediumTotal}
                        </span>
                      </div>
                      <span className="font-semibold text-medium">{statsData.mediumSolved}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-medium"
                        style={{ width: `${(statsData.mediumSolved / statsData.mediumTotal) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DifficultyBadge difficulty="Hard" />
                        <span className="text-sm text-muted-foreground">
                          {statsData.hardSolved}/{statsData.hardTotal}
                        </span>
                      </div>
                      <span className="font-semibold text-hard">{statsData.hardSolved}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-hard"
                        style={{ width: `${(statsData.hardSolved / statsData.hardTotal) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Heatmap */}
            <ActivityHeatmap data={activityData} />

            {/* Skills */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Skills
              </h3>
              <div className="flex flex-wrap gap-3">
                {skillTags.map((skill, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 rounded-lg bg-muted/50 border border-border hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{skill.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {skill.solved}/{skill.total}
                      </span>
                    </div>
                    <div className="h-1 rounded-full bg-muted mt-2 w-24">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(skill.solved / skill.total) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Stats */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                  <Clock className="h-5 w-5" />
                  <span>Max Streak</span>
                </div>
                <div className="text-3xl font-bold">{statsData.maxStreak} days</div>
              </div>
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                  <Trophy className="h-5 w-5" />
                  <span>Contests</span>
                </div>
                <div className="text-3xl font-bold">{statsData.contestsAttended}</div>
              </div>
              <div className="p-5 rounded-xl bg-card border border-border">
                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                  <Star className="h-5 w-5" />
                  <span>Contributions</span>
                </div>
                <div className="text-3xl font-bold">{statsData.contributions}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
