import React from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Calendar, Clock } from 'lucide-react'

interface PostCardProps {
  title: string
  slug: string
  date: string
  excerpt?: string
  readTime?: string
}

export default function PostCard({ title, slug, date, excerpt, readTime }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <Link href={`/posts/${slug}`}>
        <h2 className="text-xl font-semibold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
          {title}
        </h2>
      </Link>
      
      {excerpt && (
        <p className="text-gray-600 mb-4 line-clamp-3">
          {excerpt}
        </p>
      )}
      
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>
              {format(new Date(date), 'PPP', { locale: zhCN })}
            </span>
          </div>
          {readTime && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{readTime}</span>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}
