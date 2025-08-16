import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllBlogPosts, deleteBlogPost, updateBlogStatus } from '@/lib/blog-service';
import { BlogPost, BlogStatus } from '@/types/blog';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { 
  Calendar, 
  Edit, 
  Eye, 
  LogOut, 
  MoreVertical, 
  Plus, 
  Trash, 
  FileEdit,
  CheckCircle,
  Clock,
  Home,
  BarChart3
} from 'lucide-react';

const Admin: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletePostId, setDeletePostId] = useState<string | null>(null);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const fetchedPosts = await getAllBlogPosts();
      setPosts(fetchedPosts);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('无法加载博客文章，请稍后再试。');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        title: '退出登录失败',
        description: '请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async () => {
    if (!deletePostId) return;

    try {
      await deleteBlogPost(deletePostId);
      setPosts(posts.filter(post => post.id !== deletePostId));
      toast({
        title: '删除成功',
        description: '博客文章已成功删除。',
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast({
        title: '删除失败',
        description: '无法删除博客文章，请稍后再试。',
        variant: 'destructive',
      });
    } finally {
      setDeletePostId(null);
    }
  };

  const handleUpdateStatus = async (id: string, status: BlogStatus) => {
    try {
      await updateBlogStatus(id, status);
      setPosts(posts.map(post => 
        post.id === id ? { ...post, status } : post
      ));
      toast({
        title: '状态更新成功',
        description: `文章已${status === 'published' ? '发布' : '设为草稿'}。`,
      });
    } catch (error) {
      console.error('Error updating post status:', error);
      toast({
        title: '状态更新失败',
        description: '无法更新文章状态，请稍后再试。',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">博客管理</h1>
            <p className="text-muted-foreground mt-1">管理您的博客文章</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:bg-cyber-cyan/10 hover:border-cyber-cyan/50"
            >
              <Home className="w-4 h-4" />
              回到首页
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2 hover:bg-cyber-purple/10 hover:border-cyber-purple/50"
            >
              <BarChart3 className="w-4 h-4" />
              访问统计
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              退出登录
            </Button>
            <Button 
              onClick={() => navigate('/admin/new')} 
              className="bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyber-purple hover:to-cyber-cyan text-white flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              新建文章
            </Button>
          </div>
        </div>

        <Separator className="my-6 bg-gradient-to-r from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20" />

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
          <div className="text-center py-12 bg-card/50 rounded-lg border border-cyber-cyan/20 p-8">
            <FileEdit className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">暂无博客文章</p>
            <Button 
              onClick={() => navigate('/admin/new')} 
              className="bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyber-purple hover:to-cyber-cyan text-white"
            >
              创建第一篇文章
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Card key={post.id} className="border-cyber-cyan/20 overflow-hidden">
                {post.coverImage && (
                  <div className="w-full h-48 overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader className="relative">
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/edit/${post.id}`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          编辑
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/blog/${post.slug}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          查看
                        </DropdownMenuItem>
                        {post.status === 'draft' ? (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(post.id, 'published')}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            发布
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => handleUpdateStatus(post.id, 'draft')}>
                            <Clock className="mr-2 h-4 w-4" />
                            设为草稿
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive" 
                          onClick={() => setDeletePostId(post.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          删除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(post.publishDate), 'yyyy年MM月dd日')}
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${post.status === 'published' ? 'bg-green-500/20 text-green-500' : 'bg-amber-500/20 text-amber-500'}`}>
                      {post.status === 'published' ? '已发布' : '草稿'}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">
                    {post.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-3">
                    {post.summary}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate(`/admin/edit/${post.id}`)}
                    className="text-cyber-cyan hover:text-cyber-purple transition-colors"
                  >
                    编辑
                    <Edit className="ml-2 w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => navigate(`/blog/${post.slug}`)}
                    className="text-cyber-cyan hover:text-cyber-purple transition-colors"
                  >
                    查看
                    <Eye className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletePostId} onOpenChange={(open) => !open && setDeletePostId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这篇博客文章吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeletePost}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin;