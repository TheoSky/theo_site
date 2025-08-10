import { CyberCard } from "@/components/tech/cyber-card";
import { AnimatedBackground } from "@/components/tech/animated-background";
import wechatQrCode from "@/assets/wechat-qr-code.jpg";

const Contact = () => {
  return (
    <div className="min-h-screen relative">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* Welcome Message */}
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink bg-clip-text text-transparent">
              联系我
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              我是Theo，欢迎交个朋友，分享你我的故事
            </p>
          </div>

          {/* WeChat QR Code Card */}
          <CyberCard glowEffect className="p-8 md:p-12 max-w-md mx-auto">
            <div className="space-y-6">
              {/* QR Code Image */}
              <div className="flex justify-center">
                <div className="w-64 h-96 bg-white rounded-lg shadow-lg overflow-hidden border border-cyber-cyan/20">
                  <img 
                    src={wechatQrCode} 
                    alt="微信二维码" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Note Text */}
              <p className="text-sm text-muted-foreground mt-4">
                加好友烦请注明来意
              </p>
            </div>
          </CyberCard>

          {/* Additional Contact Info */}
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <CyberCard className="p-6 text-left">
              <h3 className="text-lg font-semibold mb-2 text-cyber-cyan">邮箱联系</h3>
              <p className="text-muted-foreground">yangsongxiao92@gmail.com</p>
            </CyberCard>
            
            <CyberCard className="p-6 text-left">
              <h3 className="text-lg font-semibold mb-2 text-cyber-purple">社交媒体</h3>
              <p className="text-muted-foreground">https://x.com/songxiao_y25087</p>
            </CyberCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;