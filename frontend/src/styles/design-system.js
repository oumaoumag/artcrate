/**
 * Design System - Centralized styling constants and utilities
 * Following atomic design principles and modern CSS-in-JS patterns
 */

// Base card styling using Tailwind classes with custom gradient classes
export const CARD_CLASSES = {
  base: "card-gradient backdrop-blur-lg border border-yellow-400/30 rounded-2xl shadow-2xl",
  compact: "card-gradient-compact backdrop-blur-lg border border-yellow-400/30 rounded-xl shadow-xl",
  padding: {
    default: "p-6",
    compact: "p-4",
    large: "p-8"
  },
  spacing: {
    default: "mb-6",
    compact: "mb-4",
    none: ""
  }
};

// Typography system
export const TYPOGRAPHY = {
  heading: {
    primary: "text-xl font-bold text-yellow-300",
    secondary: "text-lg font-semibold text-orange-300",
    compact: "text-base font-bold text-yellow-300"
  },
  body: {
    primary: "text-white",
    secondary: "text-orange-300",
    muted: "text-orange-300/70",
    small: "text-sm text-orange-300"
  },
  display: {
    large: "text-3xl font-bold text-white",
    medium: "text-2xl font-bold text-white",
    small: "text-xl font-bold text-white"
  }
};

// Interactive elements
export const INTERACTIVE = {
  button: {
    primary: "btn-gradient-primary text-purple-900 font-bold px-6 py-3 rounded-xl border-none cursor-pointer transition-all duration-300 flex items-center justify-center gap-2 hover:shadow-lg hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100",
    secondary: "bg-yellow-400/20 border border-yellow-400/50 text-yellow-300 px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 hover:bg-yellow-400/30",
    ghost: "text-orange-300 hover:text-yellow-300 transition-colors duration-200"
  },
  input: {
    base: "w-full bg-black/30 border border-yellow-400/30 rounded-xl px-4 py-3 text-white placeholder-orange-300/50 focus:border-yellow-400 focus:outline-none transition-colors duration-200",
    textarea: "w-full bg-black/30 border border-yellow-400/30 rounded-xl px-4 py-3 text-white placeholder-orange-300/50 focus:border-yellow-400 focus:outline-none transition-colors duration-200 resize-vertical min-h-[100px]"
  }
};

// Layout utilities
export const LAYOUT = {
  container: "max-w-6xl mx-auto px-4",
  grid: {
    responsive: "grid grid-cols-1 lg:grid-cols-2 gap-8",
    gallery: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6",
    compact: "flex flex-col gap-4"
  },
  flex: {
    between: "flex items-center justify-between",
    center: "flex items-center justify-center",
    start: "flex items-center gap-3"
  }
};

// Icon styling
export const ICONS = {
  sizes: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32,
    hero: 64
  },
  colors: {
    primary: "#facc15",
    secondary: "#fdba74",
    accent: "#f97316",
    muted: "#fdba74"
  }
};

// Animation classes
export const ANIMATIONS = {
  spin: "animate-spin",
  pulse: "animate-pulse",
  bounce: "animate-bounce",
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up"
};

// Responsive breakpoints (for programmatic use)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Status colors
export const STATUS = {
  success: "text-green-400",
  error: "text-red-400",
  warning: "text-yellow-400",
  info: "text-blue-400"
};

// Utility function to combine classes
export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

// Responsive utility for conditional rendering
export const useResponsive = () => {
  // This would typically use a hook, but for now we'll use CSS classes
  return {
    isMobile: window.innerWidth < BREAKPOINTS.md,
    isTablet: window.innerWidth >= BREAKPOINTS.md && window.innerWidth < BREAKPOINTS.lg,
    isDesktop: window.innerWidth >= BREAKPOINTS.lg
  };
};