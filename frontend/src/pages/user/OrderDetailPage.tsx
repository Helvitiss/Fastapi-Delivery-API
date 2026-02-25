import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { getOrder } from '../../api/orders'
import { queryKeys } from '../../api/queryKeys'
import ErrorBoundary from '../../components/ui/ErrorBoundary'

export default function OrderDetailPage() {
  const { id } = useParams()
  const { data } = useQuery({ queryKey: queryKeys.orders.detail(Number(id)), queryFn: () => getOrder(Number(id)), enabled: !!id })
  return <ErrorBoundary><div className='rounded-2xl bg-white border p-6'><h2 className='font-bold text-xl mb-4'>Order #{data?.id}</h2>{data?.items.map((i)=><div key={i.id} className='flex justify-between'><span>{i.dish_name}</span><span>{i.quantity}</span></div>)}</div></ErrorBoundary>
}
