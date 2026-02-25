import { useSearchParams } from 'react-router-dom'
import { useCategories } from '../../hooks/useCategories'
import { useDishes } from '../../hooks/useDishes'
import ErrorBoundary from '../../components/ui/ErrorBoundary'
import DishCard from '../../components/ui/DishCard'
import { useCart } from '../../hooks/useCart'

export default function MenuPage() {
  const [params, setParams] = useSearchParams()
  const q = (params.get('search') || '').toLowerCase()
  const { data: categories = [] } = useCategories()
  const { data: dishes = [] } = useDishes()
  const cart = useCart()
  const filtered = dishes.filter((d) => d.name.toLowerCase().includes(q))
  return <ErrorBoundary><div className='grid lg:grid-cols-4 gap-6'><aside className='rounded-2xl bg-white p-4 border'><div>All</div>{categories.map((c)=><div key={c.id}>{c.name}</div>)}</aside><main className='lg:col-span-3'><input className='border border-gray-200 rounded-xl px-4 py-3 w-full mb-4' value={q} onChange={(e) => setParams({ search: e.target.value })} placeholder='Search dishes' /><div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{filtered.map((d)=><DishCard key={d.id} dish={d} onAdd={()=>cart.addItem.mutate({dish_id:d.id,quantity:1})} />)}</div></main></div></ErrorBoundary>
}
