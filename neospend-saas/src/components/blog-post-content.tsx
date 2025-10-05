'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { SectionHeading } from '@/components/section-heading'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface BlogPostContentProps {
    title: string
    date: string
    tags: string[]
    content: string
}

export function BlogPostContent({ title, date, tags, content }: BlogPostContentProps) {
    return (
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

            <SectionHeading className="mb-2 text-left">{title}</SectionHeading>
            <p className="text-sm text-muted-foreground mb-6">{date}</p>

            <div className="flex flex-wrap gap-2 mb-8">
                {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                        {tag}
                    </Badge>
                ))}
            </div>

            <article className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
            </article>
        </motion.div>
    )
}