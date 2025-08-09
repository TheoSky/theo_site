import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBlogPostBySlug } from '@/lib/blog-service';
import { BlogPost as BlogPostType } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ArrowLeft, Calendar } from 'lucide-react';
import { AnimatedBackground } from '@/components/tech/animated-background';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPostType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) return;

      try {
        const fetchedPost = await getBlogPostBySlug(slug);
        if (fetchedPost) {
          setPost(fetchedPost);
        } else {
          setError('找不到该博客文章');
        }
      } catch (err) {
        console.error('Error fetching blog post:', err);
        setError('加载博客文章时出错');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  // Function to render content with basic formatting
  const renderContent = (content: string) => {
    // This is a simple implementation. For a more robust solution, consider using a markdown parser
    return {
      __html: content
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-cyber-cyan hover:underline">$1</a>')
    };
  };

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/blog')} 
          className="mb-8 text-cyber-cyan hover:text-cyber-purple transition-colors"
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          返回博客列表
        </Button>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-cyan"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive text-lg">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/blog')} 
              className="mt-4"
            >
              返回博客列表
            </Button>
          </div>
        ) : post ? (
          <article className="max-w-3xl mx-auto bg-card/80 backdrop-blur-sm rounded-lg p-6 md:p-8 border border-cyber-cyan/20">
            {post.coverImage && (
              <div className="w-full h-64 md:h-80 mb-6 overflow-hidden rounded-lg">
                <img 
                  src={post.coverImage} 
                  alt={post.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.publishDate), 'yyyy年MM月dd日')}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-6 gradient-text">
              {post.title}
            </h1>

            <Separator className="my-6 bg-gradient-to-r from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20" />

            <div 
              className="prose prose-invert max-w-none prose-headings:text-foreground prose-a:text-cyber-cyan hover:prose-a:text-cyber-purple prose-a:transition-colors"
              dangerouslySetInnerHTML={renderContent(post.content)}
            />

            {post.tags && post.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-cyber-cyan/20">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-xs rounded-full bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        ) : null}
      </div>
    </div>
  );
};

export default BlogPost;