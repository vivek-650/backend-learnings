'use client';

import Image from 'next/image';
import Link from 'next/link';
import { formatViews, formatTimeAgo, formatDuration, getInitials, getAvatarColor } from '@/lib/utils';

export default function VideoCard({ video }) {
  if (!video) return null;

  const {
    _id,
    title,
    thumbnail,
    duration,
    views,
    createdAt,
    uploadedBy,
  } = video;

  return (
    <div className="group cursor-pointer">
      <Link href={`/watch/${_id}`}>
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200 rounded-xl overflow-hidden mb-3">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}
          
          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs font-semibold px-1.5 py-0.5 rounded">
              {formatDuration(duration)}
            </div>
          )}
        </div>
      </Link>

      {/* Video info */}
      <div className="flex gap-3">
        {/* Channel avatar */}
        <Link href={`/channel/${uploadedBy?.username}`} className="flex-shrink-0">
          {uploadedBy?.avatar ? (
            <Image
              src={uploadedBy.avatar}
              alt={uploadedBy.fullname}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: getAvatarColor(uploadedBy?.username) }}
            >
              {getInitials(uploadedBy?.fullname)}
            </div>
          )}
        </Link>

        {/* Title and channel info */}
        <div className="flex-1 min-w-0">
          <Link href={`/watch/${_id}`}>
            <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-1 group-hover:text-gray-700">
              {title}
            </h3>
          </Link>
          
          <Link href={`/channel/${uploadedBy?.username}`}>
            <p className="text-sm text-gray-600 hover:text-gray-900">
              {uploadedBy?.fullname}
            </p>
          </Link>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <span>{formatViews(views)}</span>
            <span>•</span>
            <span>{formatTimeAgo(createdAt)}</span>
          </div>
        </div>

        {/* Three dots menu */}
        <button
          className="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="More options"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
