import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { addressApi, ordersApi } from '../../api/client';
import { Button, Card, Input, OutlineButton } from '../../components/shared/ui';
import type { AddressResponse, OrderRead } from '../../types/api';

export function CheckoutPage() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<number | null>(null);
  const [newAddress, setNewAddress] = useState('');

  const { data: addresses = [] } = useQuery<AddressResponse[]>({
    queryKey: ['addresses'],
    queryFn: addressApi.list,
  });

  const addAddress = useMutation({
    mutationFn: addressApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['addresses'] });
      setNewAddress('');
    },
  });

  const makeOrder = useMutation<OrderRead, Error, number>({
    mutationFn: ordersApi.create,
    onSuccess: (order) => navigate(`/orders/${order.id}`),
  });

  return (
    <div className="mx-auto grid max-w-5xl gap-6 px-6 py-8 lg:grid-cols-3">
      <Card className="space-y-3 p-4 lg:col-span-2">
        {addresses.map((address) => (
          <label
            key={address.id}
            className={`block rounded-xl border p-3 ${selected === address.id ? 'border-primary bg-accent' : ''}`}
          >
            <input
              type="radio"
              className="mr-2"
              checked={selected === address.id}
              onChange={() => setSelected(address.id)}
            />
            {address.address}
          </label>
        ))}

        <div className="flex gap-2">
          <Input
            value={newAddress}
            onChange={(event) => setNewAddress(event.target.value)}
            placeholder="Новый адрес"
          />
          <OutlineButton
            onClick={() => {
              if (newAddress.trim()) {
                addAddress.mutate(newAddress.trim());
              }
            }}
          >
            Добавить
          </OutlineButton>
        </div>
      </Card>

      <Card className="p-4">
        <Button
          className="w-full"
          disabled={!selected || makeOrder.isPending}
          onClick={() => selected && makeOrder.mutate(selected)}
        >
          Подтвердить заказ
        </Button>
      </Card>
    </div>
  );
}
