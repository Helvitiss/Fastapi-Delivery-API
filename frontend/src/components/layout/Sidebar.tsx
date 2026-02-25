import { NavLink } from 'react-router-dom'

const links = [
  ['Dashboard', '/dashboard'],
  ['Menu', '/menu'],
  ['Cart', '/cart'],
  ['Orders', '/orders'],
  ['Addresses', '/addresses'],
]

export default function Sidebar() {
  return <aside className='w-64 fixed h-full flex flex-col bg-[#1C1C2E] text-gray-400 p-4 hidden md:flex'>{links.map(([label, to]) => <NavLink key={to} to={to} className={({ isActive }) => `px-4 py-3 rounded-xl ${isActive ? 'bg-amber-500/20 text-white border-l-4 border-amber-500' : ''}`}>{label}</NavLink>)}</aside>
}
