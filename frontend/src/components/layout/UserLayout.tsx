import { Outlet, NavLink } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'

const tabs = [
  ['Dashboard', '/dashboard'],
  ['Menu', '/menu'],
  ['Cart', '/cart'],
  ['Orders', '/orders'],
  ['Profile', '/addresses'],
]

export default function UserLayout() {
  return <div className='min-h-screen bg-gray-50 font-[Inter] pb-20 md:pb-0'>
    <Sidebar />
    <main className='md:ml-64 p-6'><Header /><Outlet /></main>
    <nav className='md:hidden fixed bottom-0 left-0 right-0 bg-white border-t grid grid-cols-5'>
      {tabs.map(([label, to]) => <NavLink key={to} to={to} className='text-xs p-3 text-center'>{label}</NavLink>)}
    </nav>
  </div>
}
