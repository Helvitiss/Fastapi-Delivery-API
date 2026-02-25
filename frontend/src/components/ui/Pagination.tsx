export default function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  return <div className='flex gap-2'>{Array.from({ length: pages }, (_, i) => i + 1).map((p) => <button key={p} onClick={() => onChange(p)} className={`px-3 py-1 rounded ${p === page ? 'bg-amber-500 text-white' : 'bg-white border'}`}>{p}</button>)}</div>
}
