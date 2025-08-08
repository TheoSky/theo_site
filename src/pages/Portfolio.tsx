import React, { useState } from 'react'
import { Zap, Brain, ArrowRight, Copy, Sparkles, Code, Palette, Globe } from 'lucide-react'
import { AnimatedBackground } from '@/components/tech/animated-background'
import { HeroAvatar } from '@/components/tech/hero-avatar'
import { CyberCard } from '@/components/tech/cyber-card'
import { CyberButton } from '@/components/ui/cyber-button'
import { CyberBadge } from '@/components/ui/cyber-badge'
import { useToast } from '@/hooks/use-toast'
import heroAvatar from '@/assets/hero-avatar.jpg'

export const Portfolio: React.FC = () => {
  const { toast } = useToast()
  const [copiedEmail, setCopiedEmail] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('contact@techportfolio.dev')
      setCopiedEmail(true)
      toast({
        title: "Email copied!",
        description: "contact@techportfolio.dev has been copied to clipboard",
      })
      setTimeout(() => setCopiedEmail(false), 2000)
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Could not copy email to clipboard",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          
          {/* Top Badge */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <CyberBadge variant="tech" className="flex items-center gap-1">
              <Zap className="w-3 h-3" />
              AI Engineer
            </CyberBadge>
            <CyberBadge variant="glow" className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              Creative Technologist
            </CyberBadge>
            <CyberBadge variant="neon" className="flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Innovation Expert
            </CyberBadge>
          </div>

          {/* Hero Avatar */}
          <HeroAvatar 
            src={heroAvatar}
            alt="Tech Portfolio Avatar" 
            className="mb-8"
          />

          {/* Main Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight">
            <span className="gradient-text">
              Building Tomorrow's
            </span>
            <br />
            <span className="text-foreground">
              Digital Experiences
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Where <span className="text-cyber-cyan font-semibold">AI Innovation</span> meets{' '}
            <span className="text-cyber-purple font-semibold">Human Creativity</span> to craft{' '}
            <span className="text-cyber-pink font-semibold">Extraordinary Solutions</span>
          </p>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto">
            <CyberCard glowEffect className="text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyber-cyan to-cyber-purple flex items-center justify-center">
                  <Code className="w-4 h-4 text-background" />
                </div>
                <h3 className="font-semibold text-foreground">Full-Stack Developer</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Expertise in React, TypeScript, Node.js, and cutting-edge web technologies
              </p>
            </CyberCard>

            <CyberCard glowEffect className="text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyber-purple to-cyber-pink flex items-center justify-center">
                  <Palette className="w-4 h-4 text-background" />
                </div>
                <h3 className="font-semibold text-foreground">UI/UX Designer</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Creating intuitive interfaces with modern design principles and user-centered approach
              </p>
            </CyberCard>

            <CyberCard glowEffect className="text-left">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyber-pink to-cyber-cyan flex items-center justify-center">
                  <Globe className="w-4 h-4 text-background" />
                </div>
                <h3 className="font-semibold text-foreground">Digital Strategist</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Transforming business ideas into scalable digital solutions and products
              </p>
            </CyberCard>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <CyberButton variant="hero" size="xl" className="group">
              Explore My Work
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </CyberButton>
            
            <CyberButton 
              variant="glitch" 
              size="xl" 
              onClick={handleCopyEmail}
              className="group"
            >
              <Copy className="w-4 h-4" />
              {copiedEmail ? 'Copied!' : 'Get In Touch'}
            </CyberButton>
          </div>

          {/* Social Links */}
          <div className="mt-16 flex justify-center gap-6">
            <CyberBadge variant="gradient" className="cursor-pointer hover:scale-105 transition-transform">
              GitHub
            </CyberBadge>
            <CyberBadge variant="gradient" className="cursor-pointer hover:scale-105 transition-transform">
              LinkedIn
            </CyberBadge>
            <CyberBadge variant="gradient" className="cursor-pointer hover:scale-105 transition-transform">
              Twitter
            </CyberBadge>
            <CyberBadge variant="gradient" className="cursor-pointer hover:scale-105 transition-transform">
              Portfolio
            </CyberBadge>
          </div>
        </div>
      </div>
    </div>
  )
}