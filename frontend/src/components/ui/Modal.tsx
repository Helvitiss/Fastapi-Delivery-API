import { ReactNode, useEffect } from 'react'
import { createPortal } from 'react-dom'

export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => { const h=(e:KeyboardEvent)=>e.key==='Escape'&&onClose(); window.addEventListener('keydown',h); return ()=>window.removeEventListener('keydown',h)}, [onClose])
  if (!open) return null
  return createPortal(<div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50' onClick={onClose}><div className='bg-white rounded-2xl p-6 min-w-[320px]' onClick={(e)=>e.stopPropagation()}>{children}</div></div>, document.body)
}
