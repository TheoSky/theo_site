import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { signIn } from '@/lib/auth-service';
import { useAuth } from '@/contexts/auth-context';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Zap } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: '登录成功',
        description: '欢迎回来！',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: '登录失败',
        description: '邮箱或密码错误，请重试。',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md p-6 border-cyber-cyan/20 shadow-lg bg-card/90 backdrop-blur-sm">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-cyber-cyan to-cyber-purple flex items-center justify-center">
              <Zap className="w-6 h-6 text-background" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">管理员登录</h1>
          <p className="text-muted-foreground mt-2">登录以管理您的博客内容</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-input border-cyber-cyan/20 focus:border-cyber-cyan/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">密码</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-input border-cyber-cyan/20 focus:border-cyber-cyan/50"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-cyber-cyan to-cyber-purple hover:from-cyber-purple hover:to-cyber-cyan text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="animate-spin mr-2">⟳</span> 
                登录中...
              </>
            ) : (
              '登录'
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;