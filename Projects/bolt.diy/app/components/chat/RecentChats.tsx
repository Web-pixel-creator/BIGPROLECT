import { useEffect, useState } from 'react';
import { Link } from '@remix-run/react';
import { db, getAll, type ChatHistoryItem } from '~/lib/persistence';
import { classNames } from '~/utils/classNames';

export function RecentChats() {
  const [recentChats, setRecentChats] = useState<ChatHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecentChats = async () => {
      if (!db) {
        setLoading(false);
        return;
      }

      try {
        const allChats = await getAll(db);
        // Filter chats with description and sort by timestamp
        const validChats = allChats
          .filter((chat) => chat.urlId && chat.description)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
          .slice(0, 6); // Show only 6 most recent chats

        setRecentChats(validChats);
      } catch (error) {
        console.error('Failed to load recent chats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentChats();
  }, []);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-purple-600 border-r-transparent"></div>
        </div>
      </div>
    );
  }

  if (recentChats.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">Recent Chats</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentChats.map((chat) => (
          <Link
            key={chat.id}
            to={`/chat/${chat.urlId}`}
            className={classNames(
              'group relative flex flex-col p-4 rounded-lg border transition-all duration-200',
              'bg-white dark:bg-gray-900',
              'border-gray-200 dark:border-gray-800',
              'hover:border-purple-500 dark:hover:border-purple-500',
              'hover:shadow-lg hover:shadow-purple-500/10',
              'cursor-pointer',
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {chat.description}
                </h3>
              </div>
              <div className="ml-2 flex-shrink-0">
                <div className="h-5 w-5 text-gray-400 dark:text-gray-600 group-hover:text-purple-500 transition-colors i-ph:arrow-right" />
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div className="h-3 w-3 i-ph:clock" />
              <span>{formatTimestamp(chat.timestamp)}</span>
            </div>
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              {chat.messages.length} {chat.messages.length === 1 ? 'message' : 'messages'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInHours < 1) {
    const minutes = Math.floor(diffInMs / (1000 * 60));
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diffInHours < 24) {
    const hours = Math.floor(diffInHours);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diffInDays < 7) {
    const days = Math.floor(diffInDays);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else {
    return date.toLocaleDateString();
  }
}
