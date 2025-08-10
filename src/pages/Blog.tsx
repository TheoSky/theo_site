import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedBlogPosts } from '@/lib/blog-service';
import { BlogPost } from '@/types/blog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ArrowRight, Calendar, Sparkles } from 'lucide-react';
import { AnimatedBackground } from '@/components/tech/animated-background';
import { CyberBadge } from '@/components/ui/cyber-badge';


const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await getPublishedBlogPosts();
      setPosts(fetchedPosts);
      setError(null);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('无法加载博客文章，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <CyberBadge variant="tech" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              博客
            </CyberBadge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">我的博客</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            分享我的想法、经验和技术见解
          </p>
        </div>

        <Separator className="my-8 bg-gradient-to-r from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20" />

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-cyan"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-destructive">{error}</p>
            <Button 
              variant="outline" 
              onClick={() => fetchPosts()} 
              className="mt-4"
            >
              重试
            </Button>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">暂无博客文章</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link to={`/blog/${post.slug}`} key={post.id}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-cyber-cyan/20 hover:border-cyber-cyan/40 overflow-hidden group">
                    {post.coverImage && (
                      <div className="w-full h-48 overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Calendar className="w-4 h-4" />
                        {format(new Date(post.publishDate), 'yyyy年MM月dd日')}
                      </div>
                      <CardTitle className="line-clamp-2 group-hover:text-cyber-cyan transition-colors">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3">
                        {post.summary}
                      </p>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="text-cyber-cyan group-hover:text-cyber-purple transition-colors p-0"
                      >
                        阅读更多 
                        <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Blog;