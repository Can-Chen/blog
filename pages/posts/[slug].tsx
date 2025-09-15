import React from 'react'
import { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '@/components/Layout'
import { getPostBySlug, getAllPosts } from '@/lib/posts'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'

interface PostPageProps {
  post: {
    slug: string
    title: string
    date: string
    content: string
    readTime?: string
  }
  mdxSource: any
}

export default function PostPage({ post, mdxSource }: PostPageProps) {
  return (
    <Layout 
      title={post.title} 
      description={`阅读文章：${post.title}`}
    >
      <div className="max-w-4xl mx-auto">
        <Link 
          href="/posts" 
          className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>返回文章列表</span>
        </Link>

        <article className="bg-white rounded-lg shadow-md p-8">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            
            <div className="flex items-center space-x-6 text-gray-600">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>
                  {format(new Date(post.date), 'PPP', { locale: zhCN })}
                </span>
              </div>
              {post.readTime && (
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>{post.readTime}</span>
                </div>
              )}
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <MDXRemote {...mdxSource} components={{
              img: ({ src, alt, ...props }: any) => (
                <img
                  src={src}
                  alt={alt}
                  className="rounded-lg shadow-md my-6 max-w-full"
                  {...props}
                />
              ),
            }} />
          </div>
        </article>
      </div>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = getAllPosts()
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const post = getPostBySlug(slug)

  if (!post) {
    return {
      notFound: true,
    }
  }

  const mdxSource = await serialize(post.content)

  return {
    props: {
      post,
      mdxSource,
    },
  }
}
