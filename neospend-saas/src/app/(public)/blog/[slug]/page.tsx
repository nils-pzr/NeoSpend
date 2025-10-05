import { notFound } from 'next/navigation'
import { posts } from '../posts'
import { BlogPostContent } from '@/components/blog-post-content'

interface BlogPostPageProps {
    params: Promise<{ slug: string }>
}

export function generateStaticParams() {
    return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = posts.find((p) => p.slug === slug)
    if (!post) return { title: 'Post not found' }
    return {
        title: `${post.title} | NeoSpend Blog`,
        description: post.desc,
    }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = posts.find((p) => p.slug === slug)
    if (!post) return notFound()

    return (
        <section className="container mx-auto px-4 py-16 max-w-3xl">
            <BlogPostContent
                title={post.title}
                date={post.date}
                tags={post.tags}
                content={post.content}
            />
        </section>
    )
}