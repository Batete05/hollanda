import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";
import { SanityBlock, urlFor } from "@/sanity/client";
import { PortableText } from "@portabletext/react";

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
        title: string;
        description?: SanityBlock[]; // Changed to rich text array
        body?: SanityBlock[];
        date: string;
        image: string;
    } | null;
}

const BlogModal = ({ isOpen, onClose, post }: BlogModalProps) => {
    if (!post) return null;

    // Portable Text components for rendering rich text
    const portableTextComponents = {
        types: {
            image: ({ value }: any) => {
                if (!value?.asset) return null;
                return (
                    <div className="my-6">
                        <img
                            src={urlFor(value).width(800).url()}
                            alt={value.alt || 'Image'}
                            className="w-full h-auto rounded-lg shadow-md"
                        />
                        {value.caption && (
                            <p className="text-sm text-gray-500 mt-2 text-center italic">
                                {value.caption}
                            </p>
                        )}
                    </div>
                );
            },
        },
        block: {
            h1: ({ children }: any) => (
                <h1 className="text-3xl font-bold mb-4 mt-6">{children}</h1>
            ),
            h2: ({ children }: any) => (
                <h2 className="text-2xl font-bold mb-3 mt-5">{children}</h2>
            ),
            h3: ({ children }: any) => (
                <h3 className="text-xl font-bold mb-2 mt-4">{children}</h3>
            ),
            h4: ({ children }: any) => (
                <h4 className="text-lg font-bold mb-2 mt-3">{children}</h4>
            ),
            blockquote: ({ children }: any) => (
                <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-gray-600">
                    {children}
                </blockquote>
            ),
            normal: ({ children }: any) => (
                <p className="mb-4 leading-relaxed text-gray-700 font-barlow">{children}</p>
            ),
        },
        marks: {
            strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
            em: ({ children }: any) => <em className="italic">{children}</em>,
            code: ({ children }: any) => (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                    {children}
                </code>
            ),
            link: ({ value, children }: any) => {
                const target = value?.blank ? '_blank' : undefined;
                const rel = value?.blank ? 'noopener noreferrer' : undefined;
                return (
                    <a
                        href={value?.href}
                        target={target}
                        rel={rel}
                        className="text-primary hover:underline"
                    >
                        {children}
                    </a>
                );
            },
        },
        list: {
            bullet: ({ children }: any) => (
                <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
            ),
            number: ({ children }: any) => (
                <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
            ),
        },
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white">
                <DialogHeader className="flex-shrink-0 border-b pb-4">
                    <DialogTitle className="text-2xl font-bold pr-8 font-barlow text-gray-900">
                        {post.title}
                    </DialogTitle>
                    <div className="flex items-center gap-2 text-gray-500 mt-2">
                        <CalendarDays className="h-4 w-4" />
                        <span className="font-barlow text-sm">{post.date}</span>
                    </div>
                </DialogHeader>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto py-6">
                    {/* Featured Image */}
                    <div className="mb-8">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-64 object-cover  shadow-sm"
                        />
                    </div>

                    {/* Article Content */}
                    <div className="space-y-6">
                        {/* Introduction/Description - Rich Text */}
                        {post.description && post.description.length > 0 && (
                            <div className="mb-8 prose prose-lg max-w-none">
                                <PortableText
                                    value={post.description}
                                    components={portableTextComponents}
                                />
                            </div>
                        )}

                        {/* Main Content - Rich Text */}
                        <div className="space-y-6">
                            {post.body && post.body.length > 0 ? (
                                <div className="prose prose-lg max-w-none">
                                    <PortableText
                                        value={post.body}
                                        components={portableTextComponents}
                                    />
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="leading-relaxed text-gray-700 font-barlow">
                                        We're excited to share insights about our journey in creating premium snacks that not only taste great but also support local communities and farmers.
                                    </p>
                                    <p className="leading-relaxed text-gray-700 font-barlow">
                                        Our commitment to quality starts from the farm and extends all the way to your table. Every product we create is a testament to the hard work and dedication of our team and partners.
                                    </p>
                                    <p className="leading-relaxed text-gray-700 font-barlow">
                                        Stay tuned for more updates about our products, community initiatives, and the stories behind the people who make it all possible.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default BlogModal;