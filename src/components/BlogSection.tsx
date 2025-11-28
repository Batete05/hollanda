import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { client, blogPostsQuery, BlogPost, urlFor, SanityBlock } from "@/sanity/client";
import { format } from "date-fns";
import { useState } from "react";
import BlogModal from "./BlogModal";
import blogImage from "../assets/Rectangle 4.png";


// Type for the processed blog posts used in the component
interface ProcessedBlogPost {
  date: string;
  title: string;
  image: string;
  description?: string;
  body?: SanityBlock[]; // Added body content for rich text
  slug: string | null;
}

const BlogSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedPost, setSelectedPost] = useState<ProcessedBlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 3;

  const { data: sanityPosts, isLoading } = useQuery({
    queryKey: ['blog-posts-section'],
    queryFn: () => client.fetch<BlogPost[]>(blogPostsQuery), // Get all posts for pagination
  });

  // Debug logging
  console.log('🔍 Sanity Posts:', sanityPosts);
  console.log('📊 Posts Length:', sanityPosts?.length);
  console.log('⏳ Loading:', isLoading);

  // Extended fallback data for pagination demo
  const fallbackPosts: ProcessedBlogPost[] = [
    {
      date: "10th October 2025",
      title: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      image: blogImage,
      description: "This is a sample blog post description. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'This is the full body content of the blog post. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.\n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\nSed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'
            }
          ]
        }
      ],
      slug: null,
    },
    {
      date: "9th October 2025",
      title: "Sed do eiusmod tempor incididunt ut labore et dolore magna.",
      image: blogImage,
      description: "Another sample blog post with detailed content. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Extended content for the second blog post. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.\n\nNeque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.'
            }
          ]
        }
      ],
      slug: null,
    },
    {
      date: "8th October 2025",
      title: "Ut enim ad minim veniam, quis nostrud exercitation ullamco.",
      image: blogImage,
      description: "Third sample blog post description. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum.",
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Comprehensive content for the third post. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident.\n\nSimilique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.'
            }
          ]
        }
      ],
      slug: null,
    },
    {
      date: "7th October 2025",
      title: "Duis aute irure dolor in reprehenderit in voluptate velit esse.",
      image: blogImage,
      description: "Fourth sample blog post for pagination. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.",
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Fourth post detailed content goes here with comprehensive information about the topic.'
            }
          ]
        }
      ],
      slug: null,
    },
    {
      date: "6th October 2025",
      title: "Excepteur sint occaecat cupidatat non proident sunt in culpa.",
      image: blogImage,
      description: "Fifth sample blog post content. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.",
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Fifth post comprehensive content with detailed explanations and insights.'
            }
          ]
        }
      ],
      slug: null,
    },
    {
      date: "5th October 2025",
      title: "Neque porro quisquam est, qui dolorem ipsum quia dolor sit.",
      image: blogImage,
      description: "Sixth sample blog post for demonstration. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.",
      body: [
        {
          _type: 'block',
          children: [
            {
              _type: 'span',
              text: 'Sixth post full content with extensive details and comprehensive coverage of the topic.'
            }
          ]
        }
      ],
      slug: null,
    },
  ];

  // Use Sanity data if available, otherwise use fallback
  const allPosts: ProcessedBlogPost[] = sanityPosts && sanityPosts.length > 0
    ? sanityPosts.map(post => ({
      date: format(new Date(post.publishedAt), "do MMMM yyyy"),
      title: post.title,
      image: post.image ? urlFor(post.image).width(400).height(225).url() : blogImage,
      description: post.description,
      body: post.body || post.content, // Use body field, fallback to content
      slug: post.slug.current,
    }))
    : fallbackPosts;

  // Pagination logic
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = allPosts.slice(startIndex, endIndex);

  const handleReadMore = (post: ProcessedBlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <section id="blogs" className="section-padding bg-muted/30">
      <div className="container-custom">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <p className="text-primary font-semibold mb-2 font-barlow">Our Blog</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-8 font-barlow">Latest News</h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8"
          key={currentPage} // This triggers re-animation on page change
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          {currentPosts.map((post, index) => (
            <motion.article
              key={`${currentPage}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative overflow-hidden mb-4 aspect-video">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <p className="text-sm text-muted-foreground mb-2 font-barlow">{post.date}</p>
              <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors font-barlow">
                {post.title}
              </h3>
              <button
                onClick={() => handleReadMore(post)}
                className="text-primary font-semibold flex items-center group-hover:gap-2 transition-all font-barlow"
              >
                Read More...
                <ArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.article>
          ))}
        </motion.div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-end gap-2">
            {/* Previous Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </Button>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(page)}
                className={currentPage === page ? "bg-primary text-primary-foreground" : ""}
              >
                {page}
              </Button>
            ))}

            {/* Next Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className="disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </Button>
          </div>
        )}
      </div>

      {/* Blog Modal */}
      <BlogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        post={selectedPost}
      />
    </section>
  );
};

export default BlogSection;
