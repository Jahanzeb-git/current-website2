import React, { useState, useEffect, useMemo } from 'react';
import { Star, GitFork, BookOpen, ExternalLink, Github, GitBranch, Eye, MessageSquare, History, ChevronRight, AlertCircle, Trophy, GitCommit, Users, Calendar, TrendingUp } from 'lucide-react';

interface GitHubPortfolioProps {
  username?: string;
  className?: string;
}

interface Repository {
  id: number;
  name: string;
  description: string;
  html_url: string;
  language: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  default_branch: string;
  open_issues_count: number;
  updated_at: string;
  created_at: string;
  size: number;
}

interface UserStats {
  totalStars: number;
  totalForks: number;
  totalCommits: number;
  followers: number;
  following: number;
  publicRepos: number;
}

interface Trophy {
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const GitHubPortfolio: React.FC<GitHubPortfolioProps> = ({ 
  username = "Jahanzeb-git",
  className = ""
}) => {
  const [repos, setRepos] = useState<Repository[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRepo, setSelectedRepo] = useState<number | null>(null);
  const [stats, setStats] = useState<UserStats>({
    totalStars: 0,
    totalForks: 0,
    totalCommits: 0,
    followers: 0,
    following: 0,
    publicRepos: 0
  });

  // Fetch GitHub data with better commit estimation
  useEffect(() => {
    let isMounted = true;
    
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const headers: HeadersInit = {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'GitHub-Portfolio-Component'
        };

        const [userResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { headers }),
          fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, { headers })
        ]);

        if (!isMounted) return;

        if (userResponse.status === 403 || reposResponse.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        
        if (!userResponse.ok) {
          throw new Error(`User not found: ${username}`);
        }
        
        if (!reposResponse.ok) {
          throw new Error('Failed to fetch repositories.');
        }
        
        const userData = await userResponse.json();
        const allReposData: Repository[] = await reposResponse.json();

        if (!isMounted) return;

        // Get top 6 repositories by stars
        const topRepos = allReposData
          .sort((a, b) => b.stargazers_count - a.stargazers_count)
          .slice(0, 6);

        const totalStars = allReposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const totalForks = allReposData.reduce((acc, repo) => acc + repo.forks_count, 0);

        // Better commit estimation based on repo activity
        const estimatedCommits = allReposData.reduce((acc, repo) => {
          const daysSinceCreation = Math.floor((Date.now() - new Date(repo.created_at).getTime()) / (1000 * 60 * 60 * 24));
          const daysSinceUpdate = Math.floor((Date.now() - new Date(repo.updated_at).getTime()) / (1000 * 60 * 60 * 24));
          
          // More active repos get higher estimates
          let repoCommits = 0;
          if (daysSinceUpdate < 30) repoCommits = Math.max(10, repo.size / 50);
          else if (daysSinceUpdate < 90) repoCommits = Math.max(5, repo.size / 100);
          else repoCommits = Math.max(1, repo.size / 200);
          
          return acc + Math.floor(repoCommits);
        }, 0);

        setRepos(topRepos);
        setStats({
          totalStars,
          totalForks,
          totalCommits: Math.max(estimatedCommits, userData.public_repos * 3),
          followers: userData.followers,
          following: userData.following,
          publicRepos: userData.public_repos
        });
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load GitHub data');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchGitHubData();
    
    return () => {
      isMounted = false;
    };
  }, [username]);

  // Enhanced trophy calculation
  const trophies = useMemo((): Trophy[] => {
    const trophyList: Trophy[] = [];
    
    if (stats.totalStars >= 50) {
      trophyList.push({
        name: 'Star Collector',
        description: `${stats.totalStars}+ Total Stars`,
        icon: <Star className="w-5 h-5" />,
        color: 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
      });
    }
    
    if (stats.followers >= 25) {
      trophyList.push({
        name: 'Community Builder',
        description: `${stats.followers}+ Followers`,
        icon: <Users className="w-5 h-5" />,
        color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20'
      });
    }
    
    if (stats.publicRepos >= 15) {
      trophyList.push({
        name: 'Project Creator',  
        description: `${stats.publicRepos}+ Repositories`,
        icon: <BookOpen className="w-5 h-5" />,
        color: 'text-green-500 bg-green-50 dark:bg-green-900/20'
      });
    }

    if (stats.totalCommits >= 100) {
      trophyList.push({
        name: 'Active Developer',
        description: `${stats.totalCommits}+ Contributions`,
        icon: <GitCommit className="w-5 h-5" />,
        color: 'text-purple-500 bg-purple-50 dark:bg-purple-900/20'
      });
    }

    return trophyList;
  }, [stats]);

  // Enhanced language colors
  const getLanguageColor = (language: string): string => {
    const colors: Record<string, string> = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C++": "bg-purple-500",
      "C#": "bg-indigo-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-600",
      HTML: "bg-orange-500",
      CSS: "bg-pink-500",
      React: "bg-blue-400",
      Vue: "bg-green-400",
      PHP: "bg-purple-600",
      Ruby: "bg-red-600",
      Swift: "bg-orange-400",
      Kotlin: "bg-purple-400"
    };
    return colors[language] || "bg-gray-400";
  };

  // Enhanced date formatting
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  // Loading state
  if (loading) {
    return (
      <div className={`w-full py-12 ${className}`}>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-12 w-12 border-3 border-blue-500 border-t-transparent"></div>
              <Github className="w-6 h-6 text-blue-500 absolute top-3 left-3" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Loading GitHub portfolio...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`w-full py-12 ${className}`}>
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center space-y-4 text-center max-w-sm">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-full">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <p className="text-red-600 dark:text-red-400 font-semibold text-lg">Unable to load GitHub data</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gray-900 dark:bg-gray-100 rounded-lg">
              <Github className="w-6 h-6 text-white dark:text-gray-900" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">GitHub Portfolio</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Showcasing my open-source contributions and development activity
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <GitCommit className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCommits.toLocaleString()}</div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Contributions</p>
          </div>
          
          <div className="group bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400 group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.followers.toLocaleString()}</div>
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Followers</p>
          </div>
          
          <div className="group bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.publicRepos}</div>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Public Repositories</p>
          </div>
          
          <div className="group bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-500 rounded-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-yellow-400 group-hover:scale-110 transition-transform duration-200" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStars}</div>
            <p className="text-sm text-yellow-600 dark:text-yellow-400 font-medium">Total Stars</p>
          </div>
        </div>

        {/* Achievements Section */}
        {trophies.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Achievements</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trophies.map((trophy, index) => (
                <div 
                  key={index}
                  className={`flex items-center space-x-3 p-4 rounded-lg border transition-all duration-200 hover:scale-105 ${trophy.color} border-current/20`}
                >
                  <div className="flex-shrink-0">
                    {trophy.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-current text-sm">{trophy.name}</h4>
                    <p className="text-xs text-current/80 truncate">{trophy.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Repositories - 2x3 Grid */}
        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <BookOpen className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Featured Repositories</h3>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {repos.map((repo) => (
              <div
                key={repo.id}
                className="group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-xl hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer overflow-hidden"
                onClick={() => setSelectedRepo(selectedRepo === repo.id ? null : repo.id)}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <BookOpen className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <a
                          href={repo.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-lg font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate group-hover:text-blue-600 dark:group-hover:text-blue-400"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {repo.name}
                        </a>
                        <ExternalLink className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                        {repo.description || "No description available"}
                      </p>
                    </div>
                    <ChevronRight
                      className={`w-5 h-5 text-gray-400 ml-3 flex-shrink-0 transition-all duration-200 ${
                        selectedRepo === repo.id ? 'rotate-90 text-blue-500' : 'group-hover:text-blue-500'
                      }`}
                    />
                  </div>

                  <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    {repo.language && (
                      <div className="flex items-center space-x-1.5">
                        <span className={`w-3 h-3 rounded-full ${getLanguageColor(repo.language)}`}></span>
                        <span className="font-medium">{repo.language}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="font-medium">{repo.stargazers_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <GitFork className="w-3.5 h-3.5 text-blue-500" />
                      <span className="font-medium">{repo.forks_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5 text-gray-500" />
                      <span className="font-medium">{repo.watchers_count}</span>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {selectedRepo === repo.id && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top duration-200">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <GitBranch className="w-4 h-4 text-green-500" />
                          <span><strong>Default branch:</strong> {repo.default_branch}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <MessageSquare className="w-4 h-4 text-red-500" />
                          <span><strong>Open issues:</strong> {repo.open_issues_count}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <History className="w-4 h-4 text-blue-500" />
                          <span><strong>Updated:</strong> {formatDate(repo.updated_at)}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-purple-500" />
                          <span><strong>Created:</strong> {formatDate(repo.created_at)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-6">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>View full GitHub profile</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default GitHubPortfolio;