import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '../../api/queryKeys';
import { Spinner } from '../../components/ui/Spinner';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Search, Users, ShieldCheck, User } from 'lucide-react';
import api from '../../api/client';
import { UserRead } from '../../types';

export const AdminUsersPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');

    const { data: users, isLoading } = useQuery({
        queryKey: queryKeys.admin.users,
        queryFn: async (): Promise<UserRead[]> => {
            const response = await api.get<UserRead[]>('/admin/users/');
            return response.data;
        },
    });

    const filteredUsers = users?.filter(user =>
        user.phone_number.includes(searchQuery)
    );

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold mb-2">Пользователи</h1>
                <p className="text-gray-500">Управление зарегистрированными пользователями</p>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Поиск по номеру телефона..."
                    className="input-base pl-12"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="card-base p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">ID</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Телефон</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Роль</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Дата регистрации</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredUsers?.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-gray-400">#{user.id}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                            <User size={18} className="text-gray-400" />
                                        </div>
                                        <span className="font-bold">{user.phone_number}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    {user.role === 'admin' ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
                                            <ShieldCheck size={14} /> Администратор
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                                            <Users size={14} /> Пользователь
                                        </span>
                                    )}
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {user.created_at
                                        ? format(new Date(user.created_at), 'd MMMM yyyy', { locale: ru })
                                        : '—'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
