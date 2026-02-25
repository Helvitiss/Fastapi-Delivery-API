import { useQuery } from '@tanstack/react-query'
import { adminGetDishes, adminGetOrders } from '../../api/admin'
import { queryKeys } from '../../api/queryKeys'
import ErrorBoundary from '../../components/ui/ErrorBoundary'

export default function AdminDashboard(){
  const {data:orders=[]}=useQuery({queryKey:queryKeys.admin.orders,queryFn:adminGetOrders})
  const {data:dishes=[]}=useQuery({queryKey:queryKeys.admin.dishes,queryFn:adminGetDishes})
  const revenue=orders.reduce((a,o)=>a+o.total_price,0)
  return <ErrorBoundary><div className='grid md:grid-cols-4 gap-4'>{[['Total Orders',orders.length],['Active Orders',orders.filter(o=>!['completed','cancelled'].includes(o.status)).length],['Total Revenue',`₽${revenue}`],['Total Dishes',dishes.length]].map(([k,v])=><div key={String(k)} className='rounded-2xl bg-white border p-4'><div className='text-sm text-gray-500'>{k}</div><div className='text-2xl font-bold'>{v}</div></div>)}</div></ErrorBoundary>
}
