import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getBlogPostById, 
  createBlogPost, 
  updateBlogPost, 
  isSlugUnique 
} from '@/lib/blog-service';
import { BlogPost, BlogPostFormData, BlogStatus } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Image as ImageIcon, Loader2 } from 'lucide-react';

const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<BlogPostFormData>({
    title: '',
    content: '',
    summary: '',
    slug: '',
    status: 'draft',
    tags: []
    // Note: coverImage field omitted - Storage functionality disabled
  });
  const [slugError, setSlugError] = useState<string | null>(null);
  const [tagsInput, setTagsInput] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (isEditing) {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    if (!id) return;

    try {
      const post = await getBlogPostById(id);
      if (post) {
        setFormData({
          title: post.title,
          content: post.content,
          summary: post.summary,
          slug: post.slug,
          status: post.status,
          tags: post.tags || []
          // Note: coverImage field omitted - Storage functionality disabled
        });
        setTagsInput(post.tags?.join(', ') || '');
      } else {
        toast({
          title: '错误',
          description: '找不到该博客文章',
          variant: 'destructive',
        });
        navigate('/admin');
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      toast({
        title: '错误',
        description: '加载博客文章时出错',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear slug error when slug is changed
    if (name === 'slug') {
      setSlugError(null);
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, status: value as BlogStatus }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagsInput(e.target.value);
    const tagsArray = e.target.value
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    setFormData(prev => ({ ...prev, tags: tagsArray }));
  };

  // Image upload functionality disabled

  const generateSlugFromTitle = () => {
    if (!formData.title) return;
    
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with a single one
    
    setFormData(prev => ({ ...prev, slug }));
  };

  const validateForm = async () => {
    if (!formData.title) {
      toast({
        title: '验证失败',
        description: '请输入文章标题',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.content) {
      toast({
        title: '验证失败',
        description: '请输入文章内容',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.summary) {
      toast({
        title: '验证失败',
        description: '请输入文章摘要',
        variant: 'destructive',
      });
      return false;
    }

    if (!formData.slug) {
      toast({
        title: '验证失败',
        description: '请输入文章路径',
        variant: 'destructive',
      });
      return false;
    }

    // Check if slug is unique
    const isUnique = await isSlugUnique(formData.slug, isEditing ? id : undefined);
    if (!isUnique) {
      setSlugError('该路径已被使用，请使用其他路径');
      toast({
        title: '验证失败',
        description: '该路径已被使用，请使用其他路径',
        variant: 'destructive',
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const isValid = await validateForm();
      if (!isValid) {
        setSaving(false);
        return;
      }

      if (isEditing && id) {
        await updateBlogPost(id, formData);
        toast({
          title: '保存成功',
          description: '博客文章已更新',
        });
      } else {
        await createBlogPost(formData);
        toast({
          title: '创建成功',
          description: '新博客文章已创建',
        });
      }

      navigate('/admin');
    } catch (error) {
      console.error('Error saving post:', error);
      toast({
        title: '保存失败',
        description: '无法保存博客文章，请稍后再试',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyber-cyan"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              {isEditing ? '编辑文章' : '创建新文章'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isEditing ? '更新您的博客文章' : '创建一篇新的博客文章'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin')} 
            className="text-cyber-cyan hover:text-cyber-purple transition-colors"
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            返回管理页面
          </Button>
        </div>

        <Separator className="my-6 bg-gradient-to-r from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20" />

        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">文章标题</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="输入文章标题"
                  className="bg-input border-cyber-cyan/20 focus:border-cyber-cyan/50"
                />
              </div>

              <div>
                <Label htmlFor="slug">文章路径</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    placeholder="my-blog-post"
                    className={`bg-input border-cyber-cyan/20 focus:border-cyber-cyan/50 ${slugError ? 'border-destructive' : ''}`}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={generateSlugFromTitle}
                    className="whitespace-nowrap"
                  >
                    从标题生成
                  </Button>
                </div>
                {slugError && <p className="text-destructive text-sm mt-1">{slugError}</p>}
              </div>

              <div>
                <Label htmlFor="status">文章状态</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger className="bg-input border-cyber-cyan/20 focus:border-cyber-cyan/50">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">草稿</SelectItem>
                    <SelectItem value="published">已发布</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tags">标签（用逗号分隔）</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={tagsInput}
                  onChange={handleTagsChange}
                  placeholder="技术, 编程, React"
                  className="bg-input border-cyber-cyan/20 focus:border-cyber-cyan/50"
                />
              </div>

              <div>
                <Label htmlFor="coverImage">封面图片</Label>
                <div className="mt-2">
                  <div className="w-full h-48 border-dashed flex flex-col items-center justify-center gap-2 bg-muted border-muted-foreground/20 rounded-md">
                    <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    <span className="text-muted-foreground text-sm">图片上传功能暂时禁用</span>
                    <span className="text-muted-foreground text-xs">需要配置 Firebase Storage</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="summary">文章摘要</Label>
                <Textarea
                  id="summary"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInputChange}
                  placeholder="输入文章摘要（将显示在博客列表中）"
                  className="bg-input border-cyber-cyan/20 focus:border-cyber-cyan/50 h-24"
                />
              </div>

              <div>
                <Label htmlFor="content">文章内容</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="输入文章内容..."
                  className="bg-input border-cyber-cyan/20 focus:border-cyber-cyan/50 min-h-[300px]"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/admin')} 
              className="mr-4"
              disabled={saving}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyber-purple hover:to-cyber-cyan text-white"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  保存中...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  保存文章
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogEditor;