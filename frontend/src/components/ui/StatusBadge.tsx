import { OrderStatus } from '../../types'

const cls: Record<OrderStatus, string> = {
  new: 'bg-indigo-100 text-indigo-700', confirmed: 'bg-blue-100 text-blue-700', cooking: 'bg-amber-100 text-amber-700', delivering: 'bg-purple-100 text-purple-700', completed: 'bg-green-100 text-green-700', cancelled: 'bg-red-100 text-red-700',
}

export default function StatusBadge({ status }: { status: OrderStatus }) { return <span className={`px-2 py-1 rounded-full text-xs font-medium ${cls[status]}`}>{status}</span> }
