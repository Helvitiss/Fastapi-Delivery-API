import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { adminGetOrders, adminUpdateOrderStatus } from '../../api/admin'
import { queryKeys } from '../../api/queryKeys'
import { OrderStatus } from '../../types'
import ErrorBoundary from '../../components/ui/ErrorBoundary'

export default function AdminOrdersPage(){
  const {data=[]}=useQuery({queryKey:queryKeys.admin.orders,queryFn:adminGetOrders}); const [q,setQ]=useState('')
  const qc=useQueryClient(); const upd=useMutation({mutationFn:({id,status}:{id:number;status:OrderStatus})=>adminUpdateOrderStatus(id,status),onSuccess:()=>qc.invalidateQueries({queryKey:queryKeys.admin.orders})})
  return <ErrorBoundary><div className='rounded-2xl bg-white border p-6'><input className='border border-gray-200 rounded-xl px-4 py-3 w-full mb-4' placeholder='Search id' value={q} onChange={(e)=>setQ(e.target.value)}/><table className='w-full'><tbody>{data.filter(o=>String(o.id).includes(q)).map((o)=><tr key={o.id}><td>#{o.id}</td><td>₽{o.total_price}</td><td><select value={o.status} onChange={(e)=>upd.mutate({id:o.id,status:e.target.value as OrderStatus})}>{['new','confirmed','cooking','delivering','completed','cancelled'].map(s=><option key={s}>{s}</option>)}</select></td></tr>)}</tbody></table></div></ErrorBoundary>
}
