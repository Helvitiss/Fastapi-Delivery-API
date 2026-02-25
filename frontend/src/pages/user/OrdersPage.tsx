import ErrorBoundary from '../../components/ui/ErrorBoundary'
import StatusBadge from '../../components/ui/StatusBadge'
import { useOrders } from '../../hooks/useOrders'

export default function OrdersPage() {
  const { data = [] } = useOrders()
  return <ErrorBoundary><div className='grid md:grid-cols-2 xl:grid-cols-3 gap-4'>{data.map((o)=><div key={o.id} className='rounded-2xl bg-white border p-4'><div className='font-semibold'>Order #{o.id}</div><div>₽{o.total_price}</div><StatusBadge status={o.status} /></div>)}</div></ErrorBoundary>
}
