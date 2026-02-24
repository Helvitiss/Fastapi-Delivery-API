import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { authApi, adminApi } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { Button, Card, Input } from '../../components/shared/ui';

const phoneSchema = z.object({ phone: z.string().min(11) });

export function LoginPage() {
  const { setToken, setUser } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const form = useForm<z.infer<typeof phoneSchema>>({ resolver: zodResolver(phoneSchema) });

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6FA] p-4">
      <Card className="w-full max-w-md space-y-4 p-8">
        <h1 className="text-center text-2xl font-bold">Войти в аккаунт</h1>
        {step === 1 ? (
          <form onSubmit={form.handleSubmit(async (v) => { setPhone(v.phone); await authApi.requestCode(v.phone); setStep(2); })} className="space-y-3">
            <Input placeholder="79998887766" {...form.register('phone')} />
            <Button className="w-full" type="submit">Получить код</Button>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-500">Код отправлен на {phone}</p>
            <Input placeholder="123456" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} />
            <Button className="w-full" onClick={async () => {
              const data = await authApi.login(phone, code);
              setToken(data.access_token);
              try { const me = await adminApi.users.me(); setUser(me); } catch { setUser(null); }
              navigate(location.state?.from || '/');
            }}>Войти</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
