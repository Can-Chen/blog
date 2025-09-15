import React from 'react'
import Layout from '@/components/Layout'
import PostCard from '@/components/PostCard'
import { getAllPosts } from '@/lib/posts'
import { FileText, Search } from 'lucide-react'

interface PostsPageProps {
  posts: Array<{
    slug: string
    title: string
    date: string
    excerpt?: string
    readTime?: string
  }>
}

export default function PostsPage({ posts }: PostsPageProps) {

  return (
    <Layout 
      title="所有文章" 
      description="浏览所有博客文章"
    >
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="h-6 w-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">所有文章</h1>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无文章，敬请期待...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard
                key={post.slug}
                title={post.title}
                slug={post.slug}
                date={post.date}
                excerpt={post.excerpt}
                readTime={post.readTime}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = getAllPosts()
  
  return {
    props: {
      posts: posts.map(post => ({
        slug: post.slug,
        title: post.title,
        date: post.date,
        excerpt: post.excerpt,
        readTime: post.readTime,
      }))
    },
  }
}
