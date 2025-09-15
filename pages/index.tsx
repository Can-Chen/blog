import React from 'react'
import Layout from '@/components/Layout'
import PostCard from '@/components/PostCard'
import { getAllPosts } from '@/lib/posts'
import { BookOpen, FileText, Calendar } from 'lucide-react'

interface HomeProps {
  posts: Array<{
    slug: string
    title: string
    date: string
    excerpt?: string
    readTime?: string
  }>
}

export default function Home({ posts }: HomeProps) {
  return (
    <Layout 
      title="首页" 
      description="个人技术博客，分享编程经验和学习心得"
    >
      <div className="text-center mb-12">
        <BookOpen className="h-16 w-16 text-blue-600 mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          欢迎来到我的博客
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          这里记录着我的编程学习历程、技术分享和项目经验。
          希望这些内容能对你有所帮助！
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-6">
          <FileText className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-semibold text-gray-900">最新文章</h2>
        </div>
        
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
