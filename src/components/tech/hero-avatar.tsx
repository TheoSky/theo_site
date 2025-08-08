import React from 'react'
import { cn } from '@/lib/utils'

interface HeroAvatarProps {
  src?: string
  alt?: string
  className?: string
}

export const HeroAvatar: React.FC<HeroAvatarProps> = ({ 
  src = "/api/placeholder/200/200", 
  alt = "Profile Avatar", 
  className 
}) => {
  return (
    <div className={cn(
      "relative w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 mx-auto mb-8 group",
      className
    )}>
      {/* Animated gradient border */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink p-1 animate-pulse-glow">
        <div className="w-full h-full rounded-full bg-background overflow-hidden">
          <img 
            src={src}
            alt={alt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </div>
      
      {/* Holographic glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyber-cyan/30 to-cyber-purple/30 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse-glow" />
      
      {/* Floating particles around avatar */}
      <div className="absolute -top-2 -right-2 w-2 h-2 bg-cyber-cyan rounded-full animate-float" />
      <div className="absolute -bottom-2 -left-2 w-1 h-1 bg-cyber-pink rounded-full animate-float" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 -right-4 w-1.5 h-1.5 bg-cyber-purple rounded-full animate-float" style={{ animationDelay: '4s' }} />
    </div>
  )
}