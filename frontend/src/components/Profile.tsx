import React from 'react';
import { 
  MapPinIcon, 
  BuildingOfficeIcon, 
  CalendarIcon, 
  LinkIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { mockUser, mockPRs } from '../data/mockData';
import { format } from 'date-fns';
import { useParams } from "react-router-dom";



export default function Profile() {
  const user = mockUser;
  const topPRs = mockPRs
    .filter(pr => pr.status === 'accepted')
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const {id} = useParams();
  const shareableUrl = `pr-insight.dev/${user.username}`;

  const stats = [
    {
      label: 'Total Contributions',
      value: user.totalPRs,
      icon: DocumentTextIcon,
      color: 'text-blue-600'
    },
    {
      label: 'Accepted PRs',
      value: user.acceptedPRs,
      icon: CheckCircleIcon,
      color: 'text-green-600'
    },
    {
      label: 'Contribution Score',
      value: user.score,
      icon: CheckCircleIcon,
      color: 'text-purple-600'
    },
    {
      label: 'Active Since',
      value: format(new Date(user.joinedDate), 'MMM yyyy'),
      icon: CalendarIcon,
      color: 'text-gray-600'
    }
  ];

  return (
    
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 mb-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{id}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">@{user.username}</p>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                {user.location}
              </div>
              <div className="flex items-center gap-1">
                <BuildingOfficeIcon className="w-4 h-4" />
                {user.company}
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                Joined {format(new Date(user.joinedDate), 'MMMM yyyy')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shareable Link */}
      <div className="bg-blue-50 dark:bg-blue-900 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LinkIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-900 dark:text-blue-300 font-medium">
              Share your profile:
            </span>
            <code className="bg-blue-100 dark:bg-blue-800 px-3 py-1 rounded text-blue-800 dark:text-blue-200 font-mono text-sm">
              {shareableUrl}
            </code>
          </div>
          <button 
            onClick={() => navigator.clipboard.writeText(`https://${shareableUrl}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Copy Link
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
            <div className="flex items-center gap-3">
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contribution Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Contribution Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircleIcon className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.acceptedPRs}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Accepted PRs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <ClockIcon className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.pendingPRs}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Pending PRs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <XCircleIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{user.rejectedPRs}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Rejected PRs</p>
          </div>
        </div>
      </div>

      {/* Highlighted PRs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Top Contributions</h2>
        <div className="space-y-4">
          {topPRs.map((pr, index) => (
            <div key={pr.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs px-2 py-1 rounded">
                      #{index + 1}
                    </span>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{pr.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{pr.repo}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{format(new Date(pr.date), 'MMM dd, yyyy')}</span>
                    <span>•</span>
                    <span>{pr.filesChanged} files</span>
                    <span>•</span>
                    <span className="text-green-600">+{pr.linesAdded}</span>
                    <span className="text-red-600">-{pr.linesRemoved}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">Score: {pr.score}</div>
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${pr.score}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}