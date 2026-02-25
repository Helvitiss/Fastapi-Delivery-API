import { DishRead } from '../../types'
import Button from './Button'

const formatPrice = (price: number) => (price >= 1000 ? `₽${(price / 100).toFixed(2)}` : `₽${price}`)

export default function DishCard({ dish, onAdd, loading }: { dish: DishRead; onAdd: () => void; loading?: boolean }) {
  return <div className='rounded-2xl shadow-sm border border-gray-100 bg-white p-4'>
    <div className='h-28 rounded-xl bg-gradient-to-br from-amber-400 to-amber-500 mb-3 flex items-center justify-center text-white font-bold'>{dish.name[0]}</div>
    <div className='font-semibold'>{dish.name}</div>
    <div className='text-gray-500 text-sm'>{dish.weight ? `${dish.weight} g` : '—'}</div>
    <div className='mt-2 flex items-center justify-between'><span className='font-bold'>{formatPrice(dish.price)}</span><Button loading={loading} onClick={onAdd}>+ Add</Button></div>
  </div>
}
