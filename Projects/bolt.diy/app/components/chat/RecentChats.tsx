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
            <PreviewImage messages={chat.messages} metadata={chat.metadata} />
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

function PreviewImage({
  messages,
  metadata,
}: {
  messages: ChatHistoryItem['messages'];
  metadata?: ChatHistoryItem['metadata'];
}) {
  const url = metadata?.previewUrl || findPreviewImage(messages);

  if (!url) {
    return (
      <div className="mb-3 aspect-video w-full rounded-lg bg-gradient-to-br from-purple-900/20 via-purple-600/10 to-gray-900/20 dark:from-purple-900/40 dark:via-purple-600/20 dark:to-transparent border border-gray-200/60 dark:border-gray-800/60 flex flex-col items-center justify-center p-4 text-center">
        <div className="h-12 w-12 mb-2 text-gray-400 dark:text-gray-600 i-ph:image" />
        <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Hero Preview</div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">No image found</div>
      </div>
    );
  }

  return (
    <div className="mb-3 aspect-video w-full overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800 relative group/preview">
      <img
        src={url}
        alt="Project Preview"
        className="h-full w-full object-cover transition-transform duration-200 group-hover:scale-[1.02]"
        onError={(e) => {
          // Fallback if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';

          const parent = target.parentElement;

          if (parent) {
            parent.innerHTML = `
              <div class="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/20 via-purple-600/10 to-gray-900/20">
                <div class="h-12 w-12 mb-2 text-gray-400 i-ph:image"></div>
                <div class="text-xs text-gray-500">Preview unavailable</div>
              </div>
            `;
          }
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-200" />
    </div>
  );
}

/**
 * Try to pick the most relevant preview image:
 * - Scan messages from end (most recent)
 * - Support markdown, HTML <img> and plain http(s) image links
 * - Extract images from code artifacts (boltAction tags)
 * - Prioritize hero/landing/preview images
 */
function findPreviewImage(messages: ChatHistoryItem['messages']): string | undefined {
  type Candidate = { url: string; score: number };

  const candidates: Candidate[] = [];
  const keywordRe = /(hero|preview|landing|screenshot|ui|design|page|banner|header)/i;

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const content = Array.isArray(message.content)
      ? message.content.map((part: any) => (typeof part === 'string' ? part : part?.text || '')).join('\n')
      : typeof message.content === 'string'
        ? message.content
        : '';

    const pushUrl = (url?: string, extraScore = 0) => {
      if (!url) {
        return;
      }

      let score = extraScore;
      const isHttp = url.startsWith('http');
      const isData = url.startsWith('data:image/');
      const keyword = keywordRe.test(url);
      const isImageExt = /\.(png|jpe?g|webp|gif|svg)$/i.test(url);

      if (isHttp) {
        score += 3;
      }

      if (isImageExt) {
        score += 1;
      }

      if (keyword) {
        score += 3; // Higher priority for hero/landing images
      }

      if (isData) {
        score -= 1; // data-uri as last resort
      }

      candidates.push({ url, score });
    };

    // Extract images from boltAction file content (HTML/JSX code)
    const boltActions = [...content.matchAll(/<boltAction[^>]*type=["']file["'][^>]*>([\s\S]*?)<\/boltAction>/gi)];
    boltActions.forEach((action) => {
      const fileContent = action[1];

      // Find images in HTML/JSX code with higher priority
      const codeImgs = [...fileContent.matchAll(/<img[^>]*src=["'](?<url>[^"']+)["'][^>]*>/gi)];
      codeImgs.forEach((m) => pushUrl(m.groups?.url, 2)); // +2 bonus for images in code

      // Find background images in CSS
      const bgImgs = [...fileContent.matchAll(/background(?:-image)?:\s*url\(["']?(?<url>[^"')]+)["']?\)/gi)];
      bgImgs.forEach((m) => pushUrl(m.groups?.url, 2));

      // Find image imports in JS/JSX
      const imports = [
        ...fileContent.matchAll(/import\s+\w+\s+from\s+["'](?<url>[^"']+\.(png|jpe?g|webp|gif|svg))["']/gi),
      ];
      imports.forEach((m) => pushUrl(m.groups?.url, 1));
    });

    // HTML <img src="..."> in message text
    const htmlImgs = [...content.matchAll(/<img[^>]*src=["'](?<url>[^"']+)["'][^>]*>/gi)];
    htmlImgs.forEach((m) => pushUrl(m.groups?.url));

    // Markdown image ![alt](url)
    const markdownImgs = [...content.matchAll(/!\[[^\]]*\]\((?<url>[^)\s]+)\)/g)];
    markdownImgs.forEach((m) => pushUrl(m.groups?.url));

    // Plain http image link
    const plainImgs = [...content.matchAll(/(https?:\/\/[^\s)]+?\.(png|jpe?g|webp|gif|svg))/gi)];
    plainImgs.forEach((m) => pushUrl(m[1]));

    // Unsplash/placeholder images (common in demos)
    const unsplashImgs = [
      ...content.matchAll(/(https?:\/\/(?:images\.unsplash\.com|via\.placeholder\.com|picsum\.photos)[^\s)"']+)/gi),
    ];
    unsplashImgs.forEach((m) => pushUrl(m[1], 2));

    // Data URI base64 image (lowest priority)
    const dataUris = [...content.matchAll(/(data:image\/[a-zA-Z]+;base64,[A-Za-z0-9+/=]+)/g)];
    dataUris.forEach((m) => pushUrl(m[1]));
  }

  if (!candidates.length) {
    return undefined;
  }

  // Sort by score (highest first), then by order (most recent first)
  candidates.sort((a, b) => b.score - a.score);

  return candidates[0].url;
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
