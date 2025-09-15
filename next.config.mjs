import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'
import remarkPrism from 'remark-prism'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm, remarkPrism],
    rehypePlugins: [],
  },
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  basePath: process.env.NODE_ENV === 'production' ? '/blog' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/blog/' : '',
}

export default withMDX(nextConfig)
