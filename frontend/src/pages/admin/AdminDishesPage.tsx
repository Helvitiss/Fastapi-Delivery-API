import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { adminDeleteDish, adminGetDishes, adminUpdateDish } from '../../api/admin'
import { queryKeys } from '../../api/queryKeys'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ErrorBoundary from '../../components/ui/ErrorBoundary'
import Toggle from '../../components/ui/Toggle'
import Button from '../../components/ui/Button'

export default function AdminDishesPage() {
  const { data = [] } = useQuery({ queryKey: queryKeys.admin.dishes, queryFn: adminGetDishes })
  const qc = useQueryClient(); const [del, setDel] = useState<number | null>(null)
  const update = useMutation({ mutationFn: ({id,is_available}:{id:number;is_available:boolean})=>adminUpdateDish(id,{is_available}), onSuccess:()=>qc.invalidateQueries({queryKey:queryKeys.admin.dishes}) })
  const remove = useMutation({ mutationFn: adminDeleteDish, onSuccess:()=>qc.invalidateQueries({queryKey:queryKeys.admin.dishes}) })
  return <ErrorBoundary><div className='rounded-2xl bg-white border p-6'><div className='flex justify-between mb-4'><h2 className='text-xl font-bold'>Dishes</h2><Button>+ Add Dish</Button></div><table className='w-full text-sm'><thead><tr><th>Name</th><th>Price</th><th>Available</th><th>Actions</th></tr></thead><tbody>{data.map((d)=><tr key={d.id}><td>{d.name}</td><td>₽{d.price}</td><td><Toggle checked={d.is_available} onChange={(v)=>update.mutate({id:d.id,is_available:v})}/></td><td><Button variant='danger' size='sm' onClick={()=>setDel(d.id)}>Delete</Button></td></tr>)}</tbody></table><ConfirmDialog open={del!==null} onClose={()=>setDel(null)} title='Delete dish?' onConfirm={()=>{if(del)remove.mutate(del);setDel(null)}}/></div></ErrorBoundary>
}
