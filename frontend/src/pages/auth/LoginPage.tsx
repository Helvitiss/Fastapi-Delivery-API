import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../components/ui/Button';
import { authService } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import { UtensilsCrossed, Phone, KeyRound, ArrowRight } from 'lucide-react';

const phoneSchema = z.object({
    phone_number: z.string().min(10, 'Минимум 10 цифр'),
});

const codeSchema = z.object({
    code: z.string().length(6, 'Код должен быть 6-значным'),
});

export const LoginPage: React.FC = () => {
    const [step, setStep] = useState(1);
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const setToken = useAuthStore(state => state.setToken);

    const phoneForm = useForm<z.infer<typeof phoneSchema>>({
        resolver: zodResolver(phoneSchema),
    });

    const codeForm = useForm<z.infer<typeof codeSchema>>({
        resolver: zodResolver(codeSchema),
    });

    useEffect(() => {
        let timer: number;
        if (countdown > 0) {
            timer = window.setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const onPhoneSubmit = async (data: z.infer<typeof phoneSchema>) => {
        setError('');
        setIsLoading(true);
        try {
            const response = await authService.requestCode(data);
            setPhone(data.phone_number);
            setStep(2);
            setCountdown(response.expires_in_seconds);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка при отправке кода');
        } finally {
            setIsLoading(false);
        }
    };

    const onCodeSubmit = async (data: z.infer<typeof codeSchema>) => {
        setError('');
        setIsLoading(true);
        try {
            const response = await authService.login({
                phone_number: phone,
                code: data.code
            });
            setToken(response.access_token);

            // Decode JWT happens inside setToken
            const user = useAuthStore.getState().user;
            if (user?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Неверный код доступа');
        } finally {
            setIsLoading(false);
        }
    };

    // Auto-submit when 6 digits are entered
    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value.length === 6) {
            codeForm.handleSubmit(onCodeSubmit)();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-dark via-primary to-primary-light flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-md p-8 sm:p-12 overflow-hidden relative">
                {/* Ornament */}
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary-dark/10 rounded-full blur-3xl" />

                <div className="relative">
                    <div className="flex justify-center mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg transform -rotate-6">
                            <UtensilsCrossed size={32} className="text-white" />
                        </div>
                    </div>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">FoodMeal</h1>
                        <p className="text-gray-500">
                            {step === 1 ? 'Введите номер телефона для входа' : 'Введите код из SMS'}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 flex items-center gap-2">
                            <span className="w-1 h-1 bg-red-600 rounded-full" />
                            {error}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={phoneForm.handleSubmit(onPhoneSubmit)} className="space-y-6">
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    placeholder="79998887766"
                                    className="input-base pl-12"
                                    {...phoneForm.register('phone_number')}
                                />
                                {phoneForm.formState.errors.phone_number && (
                                    <p className="text-xs text-red-500 mt-1 ml-4">{phoneForm.formState.errors.phone_number.message}</p>
                                )}
                            </div>
                            <Button type="submit" className="w-full h-14" loading={isLoading}>
                                Получить код
                                <ArrowRight size={20} className="ml-2" />
                            </Button>
                        </form>
                    ) : (
                        <form onSubmit={codeForm.handleSubmit(onCodeSubmit)} className="space-y-6">
                            <div className="relative">
                                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    placeholder="000000"
                                    maxLength={6}
                                    autoFocus
                                    className="input-base pl-12 text-center text-2xl tracking-[0.5em] font-mono"
                                    {...codeForm.register('code', { onChange: handleCodeChange })}
                                />
                                {codeForm.formState.errors.code && (
                                    <p className="text-xs text-red-500 mt-1 ml-4">{codeForm.formState.errors.code.message}</p>
                                )}
                            </div>

                            <div className="text-center">
                                {countdown > 0 ? (
                                    <p className="text-sm text-gray-500">
                                        Код истекает через <span className="font-bold text-primary">{countdown}с</span>
                                    </p>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => onPhoneSubmit({ phone_number: phone })}
                                        className="text-sm font-bold text-primary hover:underline"
                                    >
                                        Отправить код повторно
                                    </button>
                                )}
                            </div>

                            <Button type="submit" className="w-full h-14" loading={isLoading}>
                                Войти в аккаунт
                            </Button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-center text-sm text-gray-400 hover:text-gray-600"
                            >
                                Изменить номер телефона
                            </button>
                        </form>
                    )}

                    <p className="mt-10 text-center text-xs text-gray-400">
                        Нажимая кнопку «Войти», вы соглашаетесь с условиями обслуживания и политикой конфиденциальности.
                    </p>
                </div>
            </div>
        </div>
    );
};
