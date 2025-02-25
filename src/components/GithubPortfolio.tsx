import React, { useState, useEffect } from 'react';
import { Star, GitFork, BookOpen, ExternalLink, Github, GitBranch, Eye, MessageSquare, History, ChevronRight, AlertCircle, Trophy, GitCommit } from 'lucide-react';
import GitHubCalendar from 'react-github-calendar';

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

  // Fetch GitHub data
  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        
        // Basic headers for public API access
        const headers: HeadersInit = {
          'Accept': 'application/vnd.github.v3+json'
        };

        // Fetch user data and repos in parallel
        const [userResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`, { headers }),
          fetch(`https://api.github.com/users/${username}/repos?sort=stars&per_page=5`, { headers })
        ]);

        // Check for rate limiting or other errors
        if (userResponse.status === 403 || reposResponse.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        }
        
        if (!userResponse.ok || !reposResponse.ok) {
          throw new Error('Failed to fetch GitHub data. Please check the username and try again.');
        }
        
        const userData = await userResponse.json();
        const reposData: Repository[] = await reposResponse.json();

        // Calculate stats from available data
        const totalStars = reposData.reduce((acc, repo) => acc + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((acc, repo) => acc + repo.forks_count, 0);

        setRepos(reposData);
        setStats({
          totalStars,
          totalForks,
          totalCommits: userData.public_gists + userData.public_repos * 10, // Approximate
          followers: userData.followers,
          following: userData.following,
          publicRepos: userData.public_repos
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username]);

  // Trophy system
  const getTrophies = (): Trophy[] => {
    const trophies: Trophy[] = [];
    
    if (stats.totalStars >= 100) {
      trophies.push({
        name: 'Star Collector',
        description: '100+ Total Stars',
        icon: <Star className="w-6 h-6 text-yellow-500" />
      });
    }
    
    if (stats.followers >= 50) {
      trophies.push({
        name: 'Community Leader',
        description: '50+ Followers',
        icon: <Trophy className="w-6 h-6 text-purple-500" />
      });
    }
    
    if (stats.publicRepos >= 20) {
      trophies.push({
        name: 'Project Master',
        description: '20+ Public Repositories',
        icon: <BookOpen className="w-6 h-6 text-blue-500" />
      });
    }

    return trophies;
  };

  // Language color mapping
  const languageColors: Record<string, { light: string; dark: string }> = {
    JavaScript: { light: "bg-yellow-300", dark: "bg-yellow-500" },
    TypeScript: { light: "bg-blue-500", dark: "bg-blue-400" },
    Python: { light: "bg-green-500", dark: "bg-green-400" },
    Java: { light: "bg-red-500", dark: "bg-red-400" },
    "C++": { light: "bg-purple-500", dark: "bg-purple-400" },
    Go: { light: "bg-cyan-500", dark: "bg-cyan-400" },
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-6 h-6 mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className={`w-full max-w-4xl mx-auto p-6 space-y-8 transition-colors duration-300 dark:bg-gray-900 dark:text-white ${className}`}>
      {/* Header with GitHub Stats */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Github className="w-8 h-8 animate-pulse" />
          <h2 className="text-2xl font-bold">GitHub Activity</h2>
        </div>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-semibold">{stats.totalStars}</span>
          </div>
          <div className="flex items-center gap-2">
            <GitFork className="w-5 h-5 text-blue-500" />
            <span className="font-semibold">{stats.totalForks}</span>
          </div>
        </div>
      </div>

      {/* GitHub Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Contributions</h3>
            <GitCommit className="w-6 h-6 text-green-500" />
          </div>
          <div className="text-3xl font-bold text-green-500">{stats.totalCommits}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Total Commits</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Community</h3>
            <Trophy className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-500">{stats.followers}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Followers</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Projects</h3>
            <BookOpen className="w-6 h-6 text-blue-500" />
          </div>
          <div className="text-3xl font-bold text-blue-500">{stats.publicRepos}</div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Public Repositories</p>
        </div>
      </div>

      {/* Contribution Graph */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Contribution Activity</h3>
        <div className="overflow-x-auto">
          <GitHubCalendar 
            username={username}
            colorScheme="light"
            fontSize={12}
            blockSize={12}
            blockMargin={4}
          />
        </div>
      </div>

      {/* Trophies Section */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-lg font-semibold mb-4">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getTrophies().map((trophy, index) => (
            <div 
              key={index}
              className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg transform hover:scale-105 transition-transform duration-200"
            >
              {trophy.icon}
              <div>
                <h4 className="font-semibold">{trophy.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{trophy.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Repository List */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold mb-4">Top Repositories</h3>
        {repos.map((repo, index) => (
          <div
            key={repo.id}
            className={`transform transition-all duration-300 bg-white dark:bg-gray-800 cursor-pointer rounded-lg border shadow-sm dark:border-gray-700
              ${selectedRepo === repo.id ? 'scale-[1.02] shadow-xl' : 'hover:scale-[1.01] hover:shadow-lg'}`}
            onClick={() => setSelectedRepo(selectedRepo === repo.id ? null : repo.id)}
            style={{ animationDelay: `${index * 100}ms`, animation: 'fadeSlideIn 0.5s ease-out forwards' }}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 group">
                    <BookOpen className="w-5 h-5 transition-transform group-hover:rotate-12" />
                    <a
                      href={repo.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xl font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {repo.name}
                    </a>
                    <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">{repo.description}</p>
                </div>
                <ChevronRight
                  className={`w-6 h-6 transition-transform duration-300 ${selectedRepo === repo.id ? 'rotate-90' : ''}`}
                />
              </div>

              <div className="flex items-center gap-4 mt-4">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <span
                      className={`w-3 h-3 rounded-full ${languageColors[repo.language]?.light || 'bg-gray-400'} dark:${languageColors[repo.language]?.dark || 'bg-gray-500'}`}
                    ></span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">{repo.language}</span>
                  </span>
                )}
                <span className="flex items-center gap-1 group">
                  <Star className="w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform group-hover:scale-125" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{repo.stargazers_count}</span>
                </span>
                <span className="flex items-center gap-1 group">
                  <GitFork className="w-4 h-4 text-gray-600 dark:text-gray-300 transition-transform group-hover:scale-125" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{repo.forks_count}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{repo.watchers_count}</span>
                </span>
              </div>

              {/* Expanded View */}
              {selectedRepo === repo.id && (
                <div className="mt-4 pt-4 border-t dark:border-gray-700 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm">{repo.default_branch} branch</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm">{repo.open_issues_count} issues</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      <span className="text-sm">Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default GitHubPortfolio;
