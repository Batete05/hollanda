import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";
import { SanityBlock } from "@/sanity/client";

interface BlogModalProps {
    isOpen: boolean;
    onClose: () => void;
    post: {
        title: string;
        description?: string;
        body?: SanityBlock[];
        date: string;
        image: string;
    } | null;
}

const BlogModal = ({ isOpen, onClose, post }: BlogModalProps) => {
    if (!post) return null;

    // Clean function to render body content
    const renderBodyContent = (body: SanityBlock[]) => {
        if (!body || body.length === 0) return null;

        return body.map((block, index) => {
            if (block._type === 'block' && block.children) {
                return (
                    <p key={index} className="mb-6 leading-relaxed text-gray-700 font-barlow">
                        {block.children?.map((child, childIndex: number) => (
                            <span key={childIndex}>{child?.text}</span>
                        ))}
                    </p>
                );
            }
            return null;
        });
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
                        {/* Introduction/Description */}
                        {post.description && (
                            <div className="mb-8">
                                <p className="text-lg leading-relaxed text-gray-700 font-barlow">
                                    {post.description}
                                </p>
                            </div>
                        )}

                        {/* Main Content */}
                        <div className="space-y-6">
                            {post.body && post.body.length > 0 ? (
                                renderBodyContent(post.body)
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