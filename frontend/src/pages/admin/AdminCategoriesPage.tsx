import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { adminCreateCategory, adminDeleteCategory, adminGetCategories } from '../../api/admin'
import { queryKeys } from '../../api/queryKeys'
import Button from '../../components/ui/Button'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ErrorBoundary from '../../components/ui/ErrorBoundary'

export default function AdminCategoriesPage(){
  const {data=[]}=useQuery({queryKey:queryKeys.admin.categories,queryFn:adminGetCategories}); const [name,setName]=useState(''); const [del,setDel]=useState<number|null>(null)
  const qc=useQueryClient(); const create=useMutation({mutationFn:()=>adminCreateCategory({name,description:''}),onSuccess:()=>{setName('');qc.invalidateQueries({queryKey:queryKeys.admin.categories})}})
  const remove=useMutation({mutationFn:adminDeleteCategory,onSuccess:()=>qc.invalidateQueries({queryKey:queryKeys.admin.categories})})
  return <ErrorBoundary><div className='rounded-2xl bg-white border p-6'><div className='flex gap-2 mb-4'><input className='border border-gray-200 rounded-xl px-4 py-3 w-full' value={name} onChange={(e)=>setName(e.target.value)} /><Button onClick={()=>create.mutate()}>Add</Button></div>{data.map((c)=><div key={c.id} className='flex justify-between py-2 border-b'><span>{c.name}</span><Button size='sm' variant='danger' onClick={()=>setDel(c.id)}>Delete</Button></div>)}<ConfirmDialog open={del!==null} onClose={()=>setDel(null)} title='Delete category?' onConfirm={()=>{if(del)remove.mutate(del);setDel(null)}}/></div></ErrorBoundary>
}
