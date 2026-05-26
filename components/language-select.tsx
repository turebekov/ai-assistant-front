import { SUPPORTED_LANGUAGES, toFormLanguageValue } from '@/lib/languages'
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
  const selected = toFormLanguageValue(value)

  return (
    <select
      id={id}
      className={cn('h-10 w-full rounded-md border border-slate-200 px-3', className)}
      value={selected}
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
