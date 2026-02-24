import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authApi } from '../../api/client';
import { useAuthStore } from '../../store/authStore';
import { Button, Card, Input, OutlineButton } from '../../components/shared/ui';

const phoneSchema = z.object({
  phone: z
    .string()
    .min(11, 'Введите телефон в формате 79998887766')
    .regex(/^\d+$/, 'Только цифры'),
});

export function LoginPage() {
  const { setToken } = useAuthStore();
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [ttl, setTtl] = useState(0);

  const navigate = useNavigate();
  const location = useLocation() as { state?: { from?: string } };
  const form = useForm<z.infer<typeof phoneSchema>>({ resolver: zodResolver(phoneSchema) });

  useEffect(() => {
    if (ttl <= 0) return;
    const interval = window.setInterval(() => setTtl((value) => value - 1), 1000);
    return () => window.clearInterval(interval);
  }, [ttl]);

  const requestCode = async (phoneValue: string) => {
    const response = await authApi.requestCode(phoneValue);
    setPhone(response.phone_number);
    setTtl(response.expires_in_seconds);
    setStep(2);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F6FA] p-4">
      <Card className="w-full max-w-md space-y-4 p-8">
        <h1 className="text-center text-2xl font-bold">Войти в аккаунт</h1>
        {step === 1 ? (
          <form
            onSubmit={form.handleSubmit(async (values) => {
              try {
                await requestCode(values.phone);
              } catch {
                toast.error('Не удалось отправить код');
              }
            })}
            className="space-y-3"
          >
            <Input placeholder="79998887766" {...form.register('phone')} />
            <Button className="w-full" type="submit">
              Получить код
            </Button>
          </form>
        ) : (
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-500">Код отправлен на {phone}</p>
            <Input
              placeholder="123456"
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
            />
            <div className="text-center text-xs text-gray-500">
              {ttl > 0 ? `Повторная отправка через ${ttl}s` : 'Можно отправить повторно'}
            </div>
            {ttl <= 0 ? (
              <OutlineButton className="w-full" onClick={() => requestCode(phone)}>
                Отправить код снова
              </OutlineButton>
            ) : null}
            <Button
              className="w-full"
              disabled={code.length !== 6}
              onClick={async () => {
                try {
                  const data = await authApi.login(phone, code);
                  setToken(data.access_token);
                  toast.success('Успешный вход');
                  navigate(location.state?.from || '/');
                } catch {
                  toast.error('Неверный код');
                }
              }}
            >
              Войти
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
