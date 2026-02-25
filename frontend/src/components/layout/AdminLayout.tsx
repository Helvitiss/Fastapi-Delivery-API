import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function AdminLayout() { return <div className='min-h-screen bg-gray-50 p-6 font-[Inter]'><Header /><Outlet /></div> }
