import { useMutation, useQueryClient } from '@tanstack/react-query'
import ErrorBoundary from '../../components/ui/ErrorBoundary'
import Button from '../../components/ui/Button'
import { clearCart } from '../../api/cart'
import { useCart } from '../../hooks/useCart'
import { queryKeys } from '../../api/queryKeys'

export default function CartPage() {
  const cart = useCart(); const qc = useQueryClient()
  const clear = useMutation({ mutationFn: clearCart, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.cart }) })
  return <ErrorBoundary><div className='grid lg:grid-cols-3 gap-6'><div className='lg:col-span-2 rounded-2xl bg-white border p-6 space-y-3'>{cart.data?.items.map((i)=><div key={i.dish.id} className='flex justify-between'><span>{i.dish.name}</span><span>x{i.quantity}</span></div>)}<Button variant='ghost' onClick={()=>clear.mutate()}>Clear cart</Button></div><aside className='rounded-2xl bg-white border p-6'>Total ₽{cart.data?.total_price ?? 0}</aside></div></ErrorBoundary>
}
