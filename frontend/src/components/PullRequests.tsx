import React, { useEffect, useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  ChevronDownIcon, 
  ChevronUpIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
// import { mockPRs } from '../data/mockData';
import { format } from 'date-fns';
import clsx from 'clsx';
import { Line } from 'recharts';
import axios from 'axios';
import { TailSpin } from 'react-loader-spinner';

export default function PullRequests() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'week' | 'month' | 'quarter'>('all');
  const [expandedPR, setExpandedPR] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [mockPRs, setMockPRs] = useState([]);
  const getPR = async () => {
  setLoading(true); // start loading
  try {
    const token = localStorage.getItem('token');
    const userString = localStorage.getItem('user');
    const username = userString ? JSON.parse(userString).username : null;

    const res = await axios.post(import.meta.env.VITE_BACKEND_ROUTE + '/api/auth/get-prs', {
      accessToken: token,
      username
    });

    setMockPRs(res.data.pullRequests); // you should use setState
  } catch (err) {
    console.error("Failed to fetch PRs", err);
  } finally {
    setLoading(false); // end loading
  }
};

  const filteredPRs = mockPRs.filter(pr => {
    const matchesSearch = pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pr.repo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || pr.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const prDate = new Date(pr.date);
      const now = new Date();
      const daysAgo = (now.getTime() - prDate.getTime()) / (1000 * 60 * 60 * 24);
      
      switch (dateFilter) {
        case 'week':
          matchesDate = daysAgo <= 7;
          break;
        case 'month':
          matchesDate = daysAgo <= 30;
          break;
        case 'quarter':
          matchesDate = daysAgo <= 90;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });


  
  const getStatusBadge = (status: string) => {
    const styles = {
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return CheckCircleIcon;
      case 'rejected': return XCircleIcon;
      case 'pending': return ClockIcon;
      default: return ClockIcon;
    }
  };

  const getSentimentBadge = (sentiment: string) => {
    const styles = {
      positive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      negative: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
    };
    return styles[sentiment as keyof typeof styles] || styles.neutral;
  };


  

  const generateMockDiff = (pr: any) => {
  if (!pr.files || pr.files.length === 0) return [];

  return pr.files.map((file: any) => {
    return {
      file: file.file,
      changes: file.changes,
      additions: file.additions,
      deletions: file.deletions,
    };
  });
};


useEffect(() => {
     getPR();
},[]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Pull Requests</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track and analyze your GitHub pull request activity
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search PRs by title or repository..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center gap-2">
              <FunnelIcon className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Time</option>
                <option value="week">Last Week</option>
                <option value="month">Last Month</option>
                <option value="quarter">Last Quarter</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredPRs.length} of {mockPRs.length} pull requests
        </p>
      </div>

      {/* PR List */}
      {loading ? (
  <div className="flex justify-center items-center h-60">
    <TailSpin height="48" width="48" color="#3b82f6" />
  </div>
) : 
      <div className="space-y-4">
        {filteredPRs.map((pr) => {
          const StatusIcon = getStatusIcon(pr.status);
          const isExpanded = expandedPR === pr.id;

          
          const mockDiff = generateMockDiff(pr);

          console.log(mockDiff);
          
          return (
            <div key={pr.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              <div 
                className="p-6 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                onClick={() => setExpandedPR(isExpanded ? null : pr.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <StatusIcon className={clsx(
                        "w-5 h-5",
                        pr.status === 'accepted' && "text-green-500",
                        pr.status === 'rejected' && "text-red-500",
                        pr.status === 'pending' && "text-yellow-500"
                      )} />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{pr.title}</h3>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(pr.status)}`}>
                        {pr.status.charAt(0).toUpperCase() + pr.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="font-medium">{pr.repo}</span>
                      <span>•</span>
                      <span>{format(new Date(pr.date), 'MMM dd, yyyy')}</span>
                      <span>•</span>
                      <span>{pr.filesChanged} files changed</span>
                      <span>•</span>
                      <span className="text-green-600">+{pr.linesAdded}</span>
                      <span className="text-red-600">-{pr.linesRemoved}</span>
                      <span>•</span>
                      <span>{pr.comments.length} comments</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">Score: {pr.score}</div>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${pr.score}%` }}
                        />
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUpIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t border-gray-200 dark:border-gray-700">
                  <div className="p-6 space-y-6">
                    {/* Files Changed */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <DocumentTextIcon className="w-5 h-5" />
                        Files Changed ({pr.filesChanged})
                      </h4>
                      <div className="space-y-4">
                       {mockDiff.map((file, index) => {
                        // console.log(file);
                        
                        return (
                          <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <span className="font-mono text-sm text-gray-900 dark:text-white">{file.file}</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{file.changes}</span>
                            </div>
                            <div className="space-y-2">
                              {file.additions?.map((line, lineIndex) => (
                                <div
                                  key={lineIndex}
                                  className="font-mono text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900 p-2 rounded"
                                >
                                  {line}
                                </div>
                              ))}
                              {file.deletions?.map((line, lineIndex) => (
                                <div
                                  key={lineIndex}
                                  className="font-mono text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900 p-2 rounded"
                                >
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}

                      </div>
                    </div>


                    {/* Comments */}
                    <div>
                      <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <ChatBubbleLeftIcon className="w-5 h-5" />
                        Review Comments ({pr.comments.length})
                      </h4>
                      <div className="space-y-4">
                        {pr.comments.map((comment) => (
                          <div key={comment.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900 dark:text-white">{comment.author}</span>
                                {comment.isReviewer && (
                                  <span className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded">
                                    Reviewer
                                  </span>
                                )}
                                <span className={`text-xs px-2 py-1 rounded ${getSentimentBadge(comment.sentiment)}`}>
                                  {comment.sentiment.charAt(0).toUpperCase() + comment.sentiment.slice(1)}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {format(new Date(comment.date), 'MMM dd, yyyy')}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Analysis (for rejected PRs) */}
                    {pr.status === 'rejected' && (
                      <div className="bg-red-50 dark:bg-red-900 rounded-lg p-4">
                        <h4 className="text-md font-semibold text-red-800 dark:text-red-300 mb-2">AI Rejection Analysis</h4>
                        <p className="text-red-700 dark:text-red-300 text-sm">
                          The PR was rejected due to potential concurrency issues in the data processing logic. 
                          The reviewer suggested using a different architectural pattern to handle concurrent operations safely.
                          Consider implementing proper locking mechanisms or using immutable data structures.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

         {filteredPRs.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No pull requests found matching your criteria.</p>
        </div>
      )}
      </div>

      }

     
    </div>
  );
}
