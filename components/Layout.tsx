import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { BookOpen, Home, FileText } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function Layout({ children, title, description }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{title ? `${title} - 我的博客` : '我的博客'}</title>
        <meta name="description" content={description || '个人技术博客'} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">我的博客</span>
            </Link>
            
            <nav className="flex space-x-8">
              <Link 
                href="/" 
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Home className="h-4 w-4" />
                <span>首页</span>
              </Link>
              <Link 
                href="/posts" 
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <FileText className="h-4 w-4" />
                <span>文章</span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 我的博客. 使用 Next.js 和 MDX 构建.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
