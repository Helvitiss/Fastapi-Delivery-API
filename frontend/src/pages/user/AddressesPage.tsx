import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../../api/addresses';
import { queryKeys } from '../../api/queryKeys';
import { Button } from '../../components/ui/Button';
import { Spinner } from '../../components/ui/Spinner';
import { MapPin, Trash2, MapPinned, Plus } from 'lucide-react';

export const AddressesPage: React.FC = () => {
    const [newAddress, setNewAddress] = useState('');
    const queryClient = useQueryClient();

    const { data: addresses, isLoading } = useQuery({
        queryKey: queryKeys.addresses,
        queryFn: addressService.getAddresses,
    });

    const createMutation = useMutation({
        mutationFn: (address: string) => addressService.createAddress({ address }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
            setNewAddress('');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => addressService.deleteAddress(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.addresses });
        },
    });

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-10">
            <div>
                <h1 className="text-3xl font-bold mb-2">Мои адреса</h1>
                <p className="text-gray-500">Управляйте сохраненными адресами для быстрой доставки</p>
            </div>

            {/* Add Address Form */}
            <div className="card-base">
                <h3 className="text-lg font-bold mb-4">Добавить новый адрес</h3>
                <div className="flex gap-4">
                    <div className="relative flex-1">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="г. Москва, ул. Арбат, д. 1"
                            className="input-base pl-12"
                            value={newAddress}
                            onChange={(e) => setNewAddress(e.target.value)}
                        />
                    </div>
                    <Button
                        onClick={() => createMutation.mutate(newAddress)}
                        disabled={!newAddress.trim()}
                        loading={createMutation.isPending}
                    >
                        <Plus size={20} className="mr-2" /> Сохранить
                    </Button>
                </div>
            </div>

            {/* Addresses List */}
            <div className="space-y-4">
                {addresses?.map((addr) => (
                    <div key={addr.id} className="card-base flex items-center justify-between p-6 hover:border-primary-light transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                <MapPin size={24} />
                            </div>
                            <span className="text-lg font-semibold text-gray-900">{addr.address}</span>
                        </div>
                        <button
                            onClick={() => deleteMutation.mutate(addr.id)}
                            className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}

                {addresses?.length === 0 && (
                    <div className="py-20 text-center space-y-4">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto text-gray-400">
                            <MapPinned size={32} />
                        </div>
                        <p className="text-gray-500 text-lg">У вас пока нет сохраненных адресов</p>
                    </div>
                )}
            </div>
        </div>
    );
};
