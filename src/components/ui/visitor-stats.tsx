import React, { useState, useEffect } from 'react';
import { Eye, Calendar, Clock, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface VisitorStatsData {
  today: number;
  thisMonth: number;
  total: number;
}

interface VisitorInfo {
  ip?: string;
  country?: string;
  city?: string;
  browser: string;
  os: string;
  device: string;
  timestamp: number;
  userAgent: string;
  language: string;
  timezone: string;
  screenResolution: string;
  referrer?: string;
}

const VisitorStats: React.FC = () => {
  const [stats, setStats] = useState<VisitorStatsData>({
    today: 0,
    thisMonth: 0,
    total: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 初始化访问统计
    initializeStats();
    // 记录当前访问
    recordVisit();
  }, []);

  const initializeStats = () => {
    try {
      const today = new Date().toDateString();
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const monthKey = `${currentYear}-${currentMonth}`;

      // 获取存储的数据
      const todayVisits = parseInt(localStorage.getItem(`visits_${today}`) || '0');
      const monthVisits = parseInt(localStorage.getItem(`visits_month_${monthKey}`) || '0');
      const totalVisits = parseInt(localStorage.getItem('visits_total') || '0');

      setStats({
        today: todayVisits,
        thisMonth: monthVisits,
        total: totalVisits
      });

      setIsLoading(false);
    } catch (error) {
      console.error('Error initializing stats:', error);
      setIsLoading(false);
    }
  };

  const getDeviceInfo = (): { browser: string; os: string; device: string } => {
    const userAgent = navigator.userAgent;
    
    // 检测浏览器
    let browser = 'Unknown';
    if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) browser = 'Chrome';
    else if (userAgent.includes('Firefox')) browser = 'Firefox';
    else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
    else if (userAgent.includes('Edg')) browser = 'Edge';
    else if (userAgent.includes('Opera')) browser = 'Opera';
    
    // 检测操作系统
    let os = 'Unknown';
    if (userAgent.includes('Windows')) os = 'Windows';
    else if (userAgent.includes('Mac')) os = 'macOS';
    else if (userAgent.includes('Linux')) os = 'Linux';
    else if (userAgent.includes('Android')) os = 'Android';
    else if (userAgent.includes('iOS')) os = 'iOS';
    
    // 检测设备类型
    let device = 'Desktop';
    if (/Mobi|Android/i.test(userAgent)) device = 'Mobile';
    else if (/Tablet|iPad/i.test(userAgent)) device = 'Tablet';
    
    return { browser, os, device };
  };

  const getLocationInfo = async (): Promise<{ ip?: string; country?: string; city?: string }> => {
    try {
      // 使用免费的IP地理位置API
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return {
        ip: data.ip,
        country: data.country_name,
        city: data.city
      };
    } catch (error) {
      console.log('无法获取地理位置信息:', error);
      return {};
    }
  };

  const recordVisit = async () => {
    try {
      const today = new Date().toDateString();
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();
      const monthKey = `${currentYear}-${currentMonth}`;

      // 检查是否已经记录过今天的访问（防止重复计数）
      const lastVisitDate = localStorage.getItem('last_visit_date');
      const lastVisitTime = localStorage.getItem('last_visit_time');
      const currentTime = Date.now();
      
      // 如果是同一天且距离上次访问不到30分钟，则不重复计数
      if (lastVisitDate === today && lastVisitTime && 
          (currentTime - parseInt(lastVisitTime)) < 30 * 60 * 1000) {
        return;
      }

      // 收集访问者详细信息
      const deviceInfo = getDeviceInfo();
      const locationInfo = await getLocationInfo();
      
      const visitorInfo: VisitorInfo = {
        ...locationInfo,
        ...deviceInfo,
        timestamp: currentTime,
        userAgent: navigator.userAgent,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        screenResolution: `${screen.width}x${screen.height}`,
        referrer: document.referrer || undefined
      };

      // 存储详细访问信息
      const visitorsLog = JSON.parse(localStorage.getItem('visitors_log') || '[]');
      visitorsLog.push(visitorInfo);
      
      // 只保留最近1000条记录
      if (visitorsLog.length > 1000) {
        visitorsLog.splice(0, visitorsLog.length - 1000);
      }
      
      localStorage.setItem('visitors_log', JSON.stringify(visitorsLog));

      // 更新今日访问量
      const todayVisits = parseInt(localStorage.getItem(`visits_${today}`) || '0') + 1;
      localStorage.setItem(`visits_${today}`, todayVisits.toString());

      // 更新本月访问量
      const monthVisits = parseInt(localStorage.getItem(`visits_month_${monthKey}`) || '0') + 1;
      localStorage.setItem(`visits_month_${monthKey}`, monthVisits.toString());

      // 更新总访问量
      const totalVisits = parseInt(localStorage.getItem('visits_total') || '0') + 1;
      localStorage.setItem('visits_total', totalVisits.toString());

      // 记录访问时间
      localStorage.setItem('last_visit_date', today);
      localStorage.setItem('last_visit_time', currentTime.toString());

      // 更新状态
      setStats({
        today: todayVisits,
        thisMonth: monthVisits,
        total: totalVisits
      });
    } catch (error) {
      console.error('Error recording visit:', error);
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-4 text-muted-foreground">
        <div className="animate-pulse flex items-center gap-2">
          <Eye className="w-4 h-4" />
          <span className="text-sm">加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center text-muted-foreground text-sm"
    >
      {/* 总访问量 */}
      <motion.div 
        className="flex items-center gap-1.5 hover:text-cyber-cyan transition-colors cursor-default"
        whileHover={{ scale: 1.05 }}
        title="总访问量"
      >
        <Eye className="w-4 h-4" />
        <span>总访问量: {formatNumber(stats.total)}</span>
      </motion.div>
    </motion.div>
  );
};

export default VisitorStats;