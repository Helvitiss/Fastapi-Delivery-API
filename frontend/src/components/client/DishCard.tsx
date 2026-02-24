import { Plus } from 'lucide-react';
import type { DishRead } from '../../types/api';
import { Button, Card } from '../shared/ui';

export function DishCard({ dish, onAdd }: { dish: DishRead; onAdd: (dishId: number) => void }) {
  return (
    <Card className="overflow-hidden transition hover:-translate-y-1">
      <div className="aspect-[4/3] bg-gray-100">
        {dish.image_url ? <img src={dish.image_url} className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-sm text-gray-500">Нет фото</div>}
      </div>
      <div className="space-y-3 p-4">
        <h3 className="truncate font-semibold">{dish.name}</h3>
        <p className="text-sm text-gray-500">{dish.weight ? `· ${dish.weight} г` : '—'}</p>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold text-primary">{dish.price} ₽</p>
          <Button className="h-9 w-9 rounded-full p-0" onClick={() => onAdd(dish.id)} disabled={!dish.is_available}><Plus size={18} /></Button>
        </div>
      </div>
    </Card>
  );
}
