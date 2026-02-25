import { useCart } from '../../hooks/useCart'
import { useCategories } from '../../hooks/useCategories'
import { useDishes } from '../../hooks/useDishes'
import DishCard from '../../components/ui/DishCard'
import ErrorBoundary from '../../components/ui/ErrorBoundary'

export default function DashboardPage() {
  const { data: dishes = [] } = useDishes()
  const { data: categories = [] } = useCategories()
  const cart = useCart()
  return <ErrorBoundary><div className='grid lg:grid-cols-3 gap-6'>
    <section className='lg:col-span-2 space-y-6'>
      <div className='rounded-2xl p-6 text-white bg-gradient-to-r from-amber-400 to-amber-500 font-bold text-xl'>Get Discount Voucher Up To 20%</div>
      <div className='flex gap-2 flex-wrap'><span className='px-3 py-1 rounded-full bg-amber-500 text-white'>All</span>{categories.map((c) => <span key={c.id} className='px-3 py-1 rounded-full border'>{c.name}</span>)}</div>
      <div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{dishes.slice(0, 6).map((d) => <DishCard key={d.id} dish={d} onAdd={() => cart.addItem.mutate({ dish_id: d.id, quantity: 1 })} />)}</div>
    </section>
    <aside className='rounded-2xl shadow-sm border border-gray-100 bg-white p-6 sticky top-6 h-fit'><h3 className='font-semibold mb-3'>Order Menu</h3><p className='text-sm text-gray-500'>Items: {cart.data?.items.length ?? 0}</p><p className='font-bold mt-2'>Total: ₽{cart.data?.total_price ?? 0}</p></aside>
  </div></ErrorBoundary>
}
