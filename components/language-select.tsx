import { SUPPORTED_LANGUAGES } from '@/lib/languages'
import { cn } from '@/lib/utils'

type LanguageSelectProps = {
  value: string
  onChange: (value: string) => void
  variant: 'session' | 'translate'
  className?: string
  id?: string
}

export function LanguageSelect({
  value,
  onChange,
  variant,
  className,
  id,
}: LanguageSelectProps) {
  return (
    <select
      id={id}
      className={cn('h-10 w-full rounded-md border border-slate-200 px-3', className)}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {SUPPORTED_LANGUAGES.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {variant === 'translate' ? `Translate to ${lang.label}` : lang.label}
        </option>
      ))}
    </select>
  )
}
