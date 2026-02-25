import { ReactNode } from 'react'

export default function Drawer({ open, children }: { open: boolean; children: ReactNode }) {
  return <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl transition-transform z-40 ${open ? 'translate-x-0' : 'translate-x-full'}`}>{children}</div>
}
