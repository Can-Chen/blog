import type { MDXComponents } from 'mdx/types'
import Image from 'next/image'

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: ({ src, alt, ...props }: any) => (
      <Image
        src={src || ''}
        alt={alt || ''}
        width={800}
        height={400}
        className="rounded-lg shadow-md my-6"
        {...props}
      />
    ),
    ...components,
  }
}

export const components: MDXComponents = {
  img: ({ src, alt, ...props }: any) => (
    <Image
      src={src || ''}
      alt={alt || ''}
      width={800}
      height={400}
      className="rounded-lg shadow-md my-6"
      {...props}
    />
  ),
}
