import React, { useState, useEffect } from 'react';
import { hasFirebaseConfig, db } from '@/lib/firebase';
import { getPublishedBlogPosts } from '@/lib/blog-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

export const FirebaseDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runDebug = async () => {
    setLoading(true);
    try {
      const info = {
        hasFirebaseConfig,
        dbConnected: !!db,
        envVars: {
          apiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
          projectId: !!import.meta.env.VITE_FIREBASE_PROJECT_ID,
          authDomain: !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
          actualProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        },
        posts: [],
        error: null,
        permissionError: null
      };

      try {
        console.log('开始获取博客文章...');
        info.posts = await getPublishedBlogPosts();
        console.log('获取到的文章:', info.posts);
      } catch (error: any) {
        console.error('获取文章时出错:', error);
        info.error = error.message;
        
        // 检查是否是权限错误
        if (error.code === 'permission-denied' || error.message.includes('permission')) {
          info.permissionError = '权限被拒绝：Firestore安全规则不允许读取数据';
        } else if (error.code === 'unavailable') {
          info.permissionError = 'Firebase服务不可用，请检查网络连接';
        } else if (error.code === 'unauthenticated') {
          info.permissionError = '未认证：需要登录才能访问数据';
        }
      }

      setDebugInfo(info);
    } catch (error: any) {
      console.error('调试过程出错:', error);
      setDebugInfo({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDebug();
  }, []);

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-500" />
    ) : (
      <XCircle className="w-4 h-4 text-red-500" />
    );
  };

  return (
    <Card className="m-4 border-yellow-500">
      <CardHeader>
        <CardTitle className="text-yellow-500 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Firebase 连接诊断
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={runDebug} disabled={loading} className="mb-4">
          {loading ? '检测中...' : '重新检测'}
        </Button>
        
        {debugInfo && (
          <div className="space-y-4">
            {/* 配置状态 */}
            <div className="space-y-2">
              <h3 className="font-semibold">配置状态</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.hasFirebaseConfig)}
                <span>Firebase 配置: {debugInfo.hasFirebaseConfig ? '已配置' : '未配置'}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.dbConnected)}
                <span>数据库连接: {debugInfo.dbConnected ? '已连接' : '未连接'}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.envVars.projectId)}
                <span>项目ID: {debugInfo.envVars.actualProjectId || '未设置'}</span>
              </div>
            </div>

            {/* 权限错误 */}
            {debugInfo.permissionError && (
              <Alert className="border-red-500">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  <strong>权限问题：</strong>{debugInfo.permissionError}
                </AlertDescription>
              </Alert>
            )}

            {/* 数据状态 */}
            <div className="space-y-2">
              <h3 className="font-semibold">数据状态</h3>
              <div className="flex items-center gap-2">
                {getStatusIcon(!debugInfo.error)}
                <span>数据获取: {debugInfo.error ? '失败' : '成功'}</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(debugInfo.posts.length > 0)}
                <span>文章数量: {debugInfo.posts.length} 篇</span>
              </div>
            </div>

            {/* 错误信息 */}
            {debugInfo.error && (
              <Alert className="border-red-500">
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700">
                  <strong>错误：</strong>{debugInfo.error}
                </AlertDescription>
              </Alert>
            )}

            {/* 解决方案 */}
            {debugInfo.permissionError && (
              <Alert className="border-blue-500">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-blue-700">
                  <strong>解决方案：</strong>
                  <br />1. 检查 Firestore 安全规则是否允许读取
                  <br />2. 确保数据库规则设置为测试模式或配置了正确的权限
                  <br />3. 在 Firebase 控制台中检查 Firestore 规则
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};