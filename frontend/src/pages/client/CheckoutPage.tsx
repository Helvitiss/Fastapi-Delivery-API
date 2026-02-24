import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addressApi, cartApi, ordersApi } from '../../api/client';
import { Button, Card, Input, OutlineButton } from '../../components/shared/ui';
import type { AddressResponse, CartWithItemsResponse, OrderRead } from '../../types/api';

export function CheckoutPage() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState('');

  const { data: cart } = useQuery<CartWithItemsResponse>({ queryKey: ['cart'], queryFn: cartApi.getCart });
  const { data: addresses = [] } = useQuery<AddressResponse[]>({ queryKey: ['addresses'], queryFn: addressApi.list });

  const addAddressMutation = useMutation({
    mutationFn: addressApi.create,
    onSuccess: () => {
      setNewAddress('');
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Адрес добавлен');
    },
    onError: () => toast.error('Не удалось добавить адрес'),
  });

  const createOrderMutation = useMutation<OrderRead, Error, number>({
    mutationFn: ordersApi.create,
    onSuccess: (order) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      navigate(`/orders/${order.id}`);
    },
    onError: () => toast.error('Не удалось оформить заказ'),
  });

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-6 py-8 lg:grid-cols-3">
      <Card className="space-y-3 p-4 lg:col-span-2">
        <h2 className="text-lg font-semibold">Адрес доставки</h2>
        {addresses.map((address) => (
          <label
            key={address.id}
            className={`block rounded-xl border p-3 ${selectedAddressId === address.id ? 'border-primary bg-accent' : ''}`}
          >
            <input
              type="radio"
              className="mr-2"
              checked={selectedAddressId === address.id}
              onChange={() => setSelectedAddressId(address.id)}
            />
            {address.address}
          </label>
        ))}

        <div className="flex gap-2">
          <Input value={newAddress} onChange={(event) => setNewAddress(event.target.value)} placeholder="Новый адрес" />
          <OutlineButton onClick={() => newAddress.trim() && addAddressMutation.mutate(newAddress.trim())}>
            Добавить
          </OutlineButton>
        </div>
      </Card>

      <Card className="space-y-3 p-4">
        <h2 className="text-lg font-semibold">Итог</h2>
        <p>Позиции: {cart?.items.length ?? 0}</p>
        <p className="text-xl font-bold text-primary">{cart?.total_price ?? 0} ₽</p>
        <Button
          className="w-full"
          disabled={!selectedAddressId || createOrderMutation.isPending}
          onClick={() => selectedAddressId && createOrderMutation.mutate(selectedAddressId)}
        >
          Подтвердить заказ
        </Button>
      </Card>
    </div>
  );
}
