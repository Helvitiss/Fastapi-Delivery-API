import { ButtonHTMLAttributes } from 'react'
import Spinner from './Spinner'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

const styles: Record<Variant, string> = {
  primary: 'bg-amber-500 hover:bg-amber-600 text-white',
  secondary: 'bg-white border border-gray-200 text-gray-700',
  ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
}
const sizes: Record<Size, string> = { sm: 'px-3 py-2 text-sm', md: 'px-4 py-2', lg: 'px-6 py-3' }

export default function Button({ variant = 'primary', size = 'md', loading, className = '', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean }) {
  return <button disabled={loading || props.disabled} className={`rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-60 ${styles[variant]} ${sizes[size]} ${className}`} {...props}>{loading ? <Spinner size='sm' /> : children}</button>
}
