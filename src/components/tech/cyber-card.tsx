import React from 'react'
import { cn } from '@/lib/utils'

interface CyberCardProps {
  children: React.ReactNode
  className?: string
  glowEffect?: boolean
}

export const CyberCard: React.FC<CyberCardProps> = ({ 
  children, 
  className, 
  glowEffect = false 
}) => {
  return (
    <div className={cn(
      "relative bg-card/50 backdrop-blur-md border border-border/50 rounded-lg p-6 transition-all duration-500 hover:border-cyber-cyan/50 hover:shadow-neon group",
      glowEffect && "hover:bg-card/70",
      className
    )}>
      {/* Holographic corner accents */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyber-pink opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyber-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {children}
      
      {/* Subtle glow overlay */}
      {glowEffect && (
        <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/5 via-cyber-purple/5 to-cyber-pink/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
    </div>
  )
}