import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'

export default function Header() { const { logout } = useAuth(); return <header className='flex justify-between items-center mb-6'><h1 className='text-2xl font-bold text-gray-900'>FoodMeal</h1><Button variant='ghost' onClick={logout}>Logout</Button></header> }
