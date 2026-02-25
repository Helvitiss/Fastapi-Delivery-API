import { ChangeEvent } from 'react'

export default function ImageUpload({ file, onChange }: { file: File | null; onChange: (f: File | null) => void }) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.files?.[0] ?? null)
  return <label className='block border-2 border-dashed rounded-xl p-4 text-center cursor-pointer'>{file ? file.name : 'Upload image'}<input type='file' accept='image/*' className='hidden' onChange={handle} /></label>
}
