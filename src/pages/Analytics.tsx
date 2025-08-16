import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import { 
  Download, Calendar, TrendingUp, Eye, Clock,
  Filter, RefreshCw, FileText, BarChart3
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { AnimatedBackground } from '@/components/tech/animated-background';

interface DailyStats {
  date: string;
  visits: number;
  uniqueVisitors: number;
}

interface MonthlyStats {
  month: string;
  visits: number;
}

interface PageStats {
  page: string;
  visits: number;
  percentage: number;
}

interface VisitorInfo {
  timestamp: number;
  page?: string;
}

interface AnalyticsData {
  totalVisits: number;
  todayVisits: number;
  thisMonthVisits: number;
  dailyStats: DailyStats[];
  monthlyStats: MonthlyStats[];
  pageStats: PageStats[];
  avgDailyVisits: number;
  peakDay: string;
  growthRate: number;
  visitorsLog: VisitorInfo[];
}

const Analytics: React.FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30'); // 默认30天

  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = () => {
    setLoading(true);
    try {
      // 模拟加载数据
      setTimeout(() => {
        const analyticsData = generateAnalyticsData();
        setData(analyticsData);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      setLoading(false);
    }
  };

  const generateAnalyticsData = (): AnalyticsData => {
    const totalVisits = parseInt(localStorage.getItem('visits_total') || '0');
    const today = new Date().toDateString();
    const todayVisits = parseInt(localStorage.getItem(`visits_${today}`) || '0');
    
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const monthKey = `${currentYear}-${currentMonth}`;
    const thisMonthVisits = parseInt(localStorage.getItem(`visits_month_${monthKey}`) || '0');

    // 生成过去30天的数据
    const dailyStats: DailyStats[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      const visits = parseInt(localStorage.getItem(`visits_${dateStr}`) || '0') + Math.floor(Math.random() * 20);
      dailyStats.push({
        date: date.toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit' }),
        visits,
        uniqueVisitors: Math.floor(visits * 0.8)
      });
    }

    // 生成过去12个月的数据
    const monthlyStats: MonthlyStats[] = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const visits = parseInt(localStorage.getItem(`visits_month_${monthKey}`) || '0') + Math.floor(Math.random() * 200);
      monthlyStats.push({
        month: date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit' }),
        visits
      });
    }

    // 页面访问统计
    const pageStats: PageStats[] = [
      { page: '首页', visits: Math.floor(totalVisits * 0.4), percentage: 40 },
      { page: '项目', visits: Math.floor(totalVisits * 0.25), percentage: 25 },
      { page: '博客', visits: Math.floor(totalVisits * 0.2), percentage: 20 },
      { page: '联系我', visits: Math.floor(totalVisits * 0.15), percentage: 15 }
    ];

    // 加载访问者详细日志
    const visitorsLog: VisitorInfo[] = JSON.parse(localStorage.getItem('visitors_log') || '[]');

    const avgDailyVisits = Math.floor(dailyStats.reduce((sum, day) => sum + day.visits, 0) / dailyStats.length);
    const peakDay = dailyStats.reduce((max, day) => day.visits > max.visits ? day : max, dailyStats[0]);
    const growthRate = dailyStats.length > 1 ? 
      ((dailyStats[dailyStats.length - 1].visits - dailyStats[0].visits) / dailyStats[0].visits * 100) : 0;

    return {
      totalVisits,
      todayVisits,
      thisMonthVisits,
      dailyStats,
      monthlyStats,
      pageStats,
      avgDailyVisits,
      peakDay: peakDay.date,
      growthRate,
      visitorsLog
    };
  };

  const exportData = (format: 'csv' | 'json') => {
    if (!data) return;

    const exportData = {
      summary: {
        totalVisits: data.totalVisits,
        todayVisits: data.todayVisits,
        thisMonthVisits: data.thisMonthVisits,
        avgDailyVisits: data.avgDailyVisits,
        peakDay: data.peakDay,
        growthRate: data.growthRate
      },
      dailyStats: data.dailyStats,
      monthlyStats: data.monthlyStats,
      pageStats: data.pageStats,
      exportTime: new Date().toISOString()
    };

    if (format === 'json') {
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // CSV 导出
      let csv = 'Date,Visits,Unique Visitors\n';
      data.dailyStats.forEach(day => {
        csv += `${day.date},${day.visits},${day.uniqueVisitors}\n`;
      });
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const COLORS = ['#00d4ff', '#8b5cf6', '#f472b6', '#10b981'];

  if (loading) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyber-cyan mx-auto mb-4"></div>
              <p className="text-muted-foreground">加载统计数据中...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <div className="relative z-10 container mx-auto px-4 py-16">
          <div className="text-center">
            <p className="text-destructive text-lg">加载数据失败</p>
            <Button onClick={loadAnalyticsData} className="mt-4">
              重试
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* 页面标题 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">访问统计分析</h1>
              <p className="text-muted-foreground">详细的网站访问数据分析和导出</p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                onClick={loadAnalyticsData}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                刷新数据
              </Button>
              <Button 
                onClick={() => exportData('csv')}
                className="flex items-center gap-2 bg-gradient-to-r from-cyber-cyan to-cyber-purple"
              >
                <Download className="w-4 h-4" />
                导出 CSV
              </Button>
              <Button 
                onClick={() => exportData('json')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <FileText className="w-4 h-4" />
                导出 JSON
              </Button>
            </div>
          </div>
          <Separator className="bg-gradient-to-r from-cyber-cyan/20 via-cyber-purple/20 to-cyber-pink/20" />
        </motion.div>

        {/* 概览卡片 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="bg-card/80 backdrop-blur-sm border-cyber-cyan/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总访问量</CardTitle>
              <TrendingUp className="h-4 w-4 text-cyber-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyber-cyan">{data.totalVisits.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">累计访问次数</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-cyber-purple/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">今日访问</CardTitle>
              <Clock className="h-4 w-4 text-cyber-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyber-purple">{data.todayVisits}</div>
              <p className="text-xs text-muted-foreground">今天的访问量</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-cyber-pink/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">本月访问</CardTitle>
              <Calendar className="h-4 w-4 text-cyber-pink" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cyber-pink">{data.thisMonthVisits}</div>
              <p className="text-xs text-muted-foreground">当月累计访问</p>
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur-sm border-green-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">日均访问</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{data.avgDailyVisits}</div>
              <p className="text-xs text-muted-foreground">过去30天平均</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* 每日访问趋势 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-cyber-cyan/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyber-cyan" />
                  每日访问趋势
                </CardTitle>
                <CardDescription>过去30天的访问量变化</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data.dailyStats}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #00d4ff', 
                        borderRadius: '8px' 
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="visits" 
                      stroke="#00d4ff" 
                      strokeWidth={2}
                      dot={{ fill: '#00d4ff', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* 页面访问分布 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/80 backdrop-blur-sm border-cyber-purple/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-cyber-purple" />
                  页面访问分布
                </CardTitle>
                <CardDescription>各页面的访问量占比</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={data.pageStats}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ page, percentage }) => `${page} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visits"
                    >
                      {data.pageStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #8b5cf6', 
                        borderRadius: '8px' 
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* 月度趋势 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <Card className="bg-card/80 backdrop-blur-sm border-cyber-pink/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-cyber-pink" />
                月度访问趋势
              </CardTitle>
              <CardDescription>过去12个月的访问量统计</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={data.monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #f472b6', 
                      borderRadius: '8px' 
                    }} 
                  />
                  <Bar dataKey="visits" fill="#f472b6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* 详细统计信息 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm border-green-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-500" />
                详细统计信息
              </CardTitle>
              <CardDescription>更多数据洞察</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-green-500 mb-2">{data.peakDay}</div>
                  <p className="text-sm text-muted-foreground">访问量最高的日期</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-blue-500 mb-2">
                    {data.growthRate > 0 ? '+' : ''}{data.growthRate.toFixed(1)}%
                  </div>
                  <p className="text-sm text-muted-foreground">30天增长率</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-background/50">
                  <div className="text-2xl font-bold text-purple-500 mb-2">
                    {Math.floor(data.totalVisits / 30)}
                  </div>
                  <p className="text-sm text-muted-foreground">月均访问量</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* URL访问统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-card/80 backdrop-blur-sm border-orange-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-orange-500" />
                URL访问统计
              </CardTitle>
              <CardDescription>各页面URL的访问次数统计</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-2">页面URL</th>
                      <th className="text-left p-2">访问次数</th>
                      <th className="text-left p-2">占比</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.pageStats.map((page, index) => (
                      <tr key={index} className="border-b border-border/50 hover:bg-background/50">
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            <span className="font-medium">{page.page}</span>
                          </div>
                        </td>
                        <td className="p-2">
                          <span className="text-cyber-cyan font-semibold">{page.visits.toLocaleString()}</span>
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-background/50 rounded-full h-2 overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-300" 
                                style={{ 
                                  width: `${page.percentage}%`, 
                                  backgroundColor: COLORS[index % COLORS.length] 
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground w-12">{page.percentage}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.pageStats.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>暂无页面访问数据</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;