import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login, requestCode } from '../../api/auth'
import { useAuthStore } from '../../store/authStore'
import Button from '../../components/ui/Button'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState(1)
  const [seconds, setSeconds] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const setToken = useAuthStore((s) => s.setToken)

  useEffect(() => { if (seconds > 0) { const t = setTimeout(() => setSeconds((s) => s - 1), 1000); return () => clearTimeout(t) } }, [seconds])
  useEffect(() => { if (code.length === 6) handleLogin() }, [code])

  const handleRequest = async () => { setLoading(true); setError(''); try { const res = await requestCode(phone); setSeconds(res.expires_in_seconds); setStep(2) } catch { setError('Failed to request code') } finally { setLoading(false) } }
  const handleLogin = async () => { setLoading(true); setError(''); try { const token = await login(phone, code); setToken(token.access_token); const role = useAuthStore.getState().user?.role; navigate(role === 'admin' ? '/admin' : '/dashboard') } catch { setError('Invalid code') } finally { setLoading(false) } }

  return <div className='min-h-screen grid place-items-center bg-gradient-to-br from-amber-400 to-amber-500 p-4'>
    <div className='bg-white rounded-2xl p-8 w-full max-w-md'>
      <h2 className='text-2xl font-bold mb-4'>Login</h2>
      <input className='border border-gray-200 rounded-xl px-4 py-3 w-full mb-3' placeholder='Phone number' value={phone} onChange={(e) => setPhone(e.target.value)} disabled={loading || step===2} />
      {step === 1 ? <Button loading={loading} onClick={handleRequest} className='w-full'>Request code</Button> : <>
        <input className='border border-gray-200 rounded-xl px-4 py-3 w-full mb-3' placeholder='6-digit code' value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} disabled={loading} />
        <p className='text-sm text-gray-500'>Code expires in {seconds}s</p>
      </>}
      {error && <p className='text-red-500 mt-2 text-sm'>{error}</p>}
    </div>
  </div>
}
