import { useMemo, useState } from 'react'
import ErrorBoundary from '../../components/ui/ErrorBoundary'
import Pagination from '../../components/ui/Pagination'
import StatusBadge from '../../components/ui/StatusBadge'
import { useOrders } from '../../hooks/useOrders'

export default function BillsPage() {
  const { data = [] } = useOrders(); const [q, setQ] = useState(''); const [page, setPage] = useState(1)
  const filtered = useMemo(()=>data.filter(o=>String(o.id).includes(q)),[data,q]); const per=10; const pages=Math.max(1,Math.ceil(filtered.length/per))
  return <ErrorBoundary><div className='rounded-2xl bg-white border p-6'><input className='border border-gray-200 rounded-xl px-4 py-3 w-full mb-4' value={q} onChange={(e)=>setQ(e.target.value)} placeholder='Search by order id' /><table className='w-full text-sm'><thead><tr><th>Menu</th><th>Status</th><th>Total</th></tr></thead><tbody>{filtered.slice((page-1)*per,page*per).map(o=><tr key={o.id}><td>Order #{o.id}</td><td><StatusBadge status={o.status}/></td><td>₽{o.total_price}</td></tr>)}</tbody></table><div className='mt-4'><Pagination page={page} pages={pages} onChange={setPage}/></div></div></ErrorBoundary>
}
