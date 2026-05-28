import { cn } from '@/lib/utils'

interface NationFlagProps {
  url?: string | null
  emoji: string
  name: string
  /** Size preset; "sm" for inline lists, "md" for cards, "lg" for headers. */
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const IMG_SIZE = {
  sm: 'h-3.5 w-5',
  md: 'h-4 w-6',
  lg: 'h-6 w-9',
} as const

const EMOJI_SIZE = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-2xl',
} as const

/**
 * Render a nation flag — prefers the proper image (handles Scotland and other
 * subdivision flags that the emoji font can't draw), falls back to emoji.
 */
export function NationFlag({ url, emoji, name, size = 'md', className }: NationFlagProps) {
  if (url) {
    return (
      <img
        src={url}
        alt={`${name} flag`}
        className={cn(IMG_SIZE[size], 'rounded-sm object-cover inline-block', className)}
      />
    )
  }
  return (
    <span className={cn(EMOJI_SIZE[size], 'leading-none', className)} aria-label={`${name} flag`}>
      {emoji}
    </span>
  )
}
