import { useQuery } from '@tanstack/react-query'
import { client, blogPostsQuery, BlogPost, urlFor } from '@/sanity/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, User } from 'lucide-react'
import { format } from 'date-fns'
import { Link } from 'react-router-dom'

const Blog = () => {
    const { data: posts, isLoading, error } = useQuery({
        queryKey: ['blog-posts'],
        queryFn: () => client.fetch<BlogPost[]>(blogPostsQuery),
    })

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Loading blog posts...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="container mx-auto px-4 py-16">
                    <div className="text-center">
                        <p className="text-red-500">Error loading blog posts. Please try again later.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-16">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
                        Blog
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Insights, tutorials, and thoughts on development, design, and technology
                    </p>
                </div>

                {/* Blog Posts Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts?.map((post) => (
                        <Link key={post._id} to={`/blog/${post.slug.current}`}>
                            <Card className="h-full hover:shadow-lg transition-shadow duration-300 group">
                                {post.image && (
                                    <div className="aspect-video overflow-hidden rounded-t-lg">
                                        <img
                                            src={urlFor(post.image).width(400).height(225).url()}
                                            alt={post.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        {post.categories?.map((category) => (
                                            <Badge key={category.slug.current} variant="secondary">
                                                {category.title}
                                            </Badge>
                                        ))}
                                    </div>
                                    <CardTitle className="group-hover:text-primary transition-colors">
                                        {post.title}
                                    </CardTitle>
                                    {post.excerpt && (
                                        <CardDescription className="line-clamp-3">
                                            {post.excerpt}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <CalendarDays className="h-4 w-4" />
                                            {format(new Date(post.publishedAt), 'MMM dd, yyyy')}
                                        </div>
                                        {post.author && (
                                            <div className="flex items-center gap-1">
                                                <User className="h-4 w-4" />
                                                {post.author.name}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {posts && posts.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground text-lg">No blog posts found.</p>
                        <p className="text-muted-foreground">Check back later for new content!</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Blog