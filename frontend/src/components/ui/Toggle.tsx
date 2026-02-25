export default function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return <button type='button' onClick={() => onChange(!checked)} className={`w-12 h-7 rounded-full p-1 ${checked ? 'bg-amber-500' : 'bg-gray-300'}`}><div className={`h-5 w-5 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : ''}`} /></button>
}
