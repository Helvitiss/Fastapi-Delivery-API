import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { createAddress, deleteAddress } from '../../api/addresses'
import { queryKeys } from '../../api/queryKeys'
import ConfirmDialog from '../../components/ui/ConfirmDialog'
import ErrorBoundary from '../../components/ui/ErrorBoundary'
import Button from '../../components/ui/Button'
import { useAddresses } from '../../hooks/useAddresses'

export default function AddressesPage() {
  const { data = [] } = useAddresses(); const [address, setAddress] = useState(''); const [del, setDel] = useState<number | null>(null)
  const qc = useQueryClient()
  const create = useMutation({ mutationFn: createAddress, onSuccess: () => { setAddress(''); qc.invalidateQueries({ queryKey: queryKeys.addresses }) } })
  const remove = useMutation({ mutationFn: deleteAddress, onSuccess: () => qc.invalidateQueries({ queryKey: queryKeys.addresses }) })
  return <ErrorBoundary><div className='space-y-4'><div className='flex gap-2'><input className='border border-gray-200 rounded-xl px-4 py-3 w-full' value={address} onChange={(e)=>setAddress(e.target.value)} /><Button onClick={()=>create.mutate(address)}>Save</Button></div>{data.map((a)=><div key={a.id} className='rounded-2xl bg-white border p-4 flex justify-between'><span>{a.address}</span><Button variant='danger' size='sm' onClick={()=>setDel(a.id)}>Delete</Button></div>)}<ConfirmDialog open={del!==null} onClose={()=>setDel(null)} title='Delete address?' onConfirm={()=>{if(del)remove.mutate(del);setDel(null)}}/></div></ErrorBoundary>
}
