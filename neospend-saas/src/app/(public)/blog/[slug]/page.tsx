import { motion } from 'framer-motion'
import { notFound } from 'next/navigation'
import { posts } from '../posts'
import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

// 🧩 Next 15 erwartet hier ein Promise für params
interface BlogPostPageProps {
    params: Promise<{ slug: string }>
}

// ⚙️ generateStaticParams
export function generateStaticParams() {
    return posts.map((post) => ({ slug: post.slug }))
}

// ⚙️ generateMetadata
export async function generateMetadata({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = posts.find((p) => p.slug === slug)
    if (!post) return { title: 'Post not found' }
    return {
        title: `${post.title} | NeoSpend Blog`,
        description: post.desc,
    }
}

// ⚡ Page Component (Server Component – kein "use client")
export default async function BlogPostPage({ params }: BlogPostPageProps) {
    const { slug } = await params
    const post = posts.find((p) => p.slug === slug)

    if (!post) return notFound()

    return (
        <section className="container mx-auto px-4 py-16 max-w-3xl">
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Link
                    href="/blog"
                    className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to blog
                </Link>

                <SectionHeading className="mb-2 text-left">{post.title}</SectionHeading>
                <p className="text-sm text-muted-foreground mb-6">{post.date}</p>

                <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                            {tag}
                        </Badge>
                    ))}
                </div>

                <article className="prose dark:prose-invert max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </article>
            </motion.div>
        </section>
    )
}