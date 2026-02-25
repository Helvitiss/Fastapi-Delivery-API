import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin';
import { queryKeys } from '../../api/queryKeys';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Drawer } from '../../components/ui/Drawer';
import { Toggle } from '../../components/ui/Toggle';
import { useForm } from 'react-hook-form';
import { DishCreate, DishRead } from '../../types';
import { Plus, Pencil, Trash2, Camera, Package } from 'lucide-react';

export const AdminDishesPage: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [editingDish, setEditingDish] = useState<DishRead | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const queryClient = useQueryClient();
    const { register, handleSubmit, reset, setValue, watch } = useForm<DishCreate>();

    const { data: dishes, isLoading } = useQuery({
        queryKey: queryKeys.admin.dishes,
        queryFn: adminService.getDishes,
    });

    const { data: categories } = useQuery({
        queryKey: queryKeys.admin.categories,
        queryFn: adminService.getCategories,
    });

    const createMutation = useMutation({
        mutationFn: async (data: DishCreate) => {
            const dish = await adminService.createDish(data);
            if (selectedFile) {
                await adminService.uploadPhoto(dish.id, selectedFile);
            }
            return dish;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.dishes });
            closeDrawer();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: Partial<DishCreate>) => {
            if (!editingDish) return;
            const dish = await adminService.updateDish(editingDish.id, data);
            if (selectedFile) {
                await adminService.uploadPhoto(dish.id, selectedFile);
            }
            return dish;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.dishes });
            closeDrawer();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => adminService.deleteDish(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.dishes });
        },
    });

    const openDrawer = (dish: DishRead | null = null) => {
        setEditingDish(dish);
        if (dish) {
            reset({
                name: dish.name,
                price: dish.price,
                category_id: dish.category_id,
                weight: dish.weight,
                description: dish.description,
                is_available: dish.is_available,
            });
        } else {
            reset({ is_available: true });
        }
        setSelectedFile(null);
        setIsDrawerOpen(true);
    };

    const closeDrawer = () => {
        setIsDrawerOpen(false);
        setEditingDish(null);
        setSelectedFile(null);
        reset();
    };

    const onSubmit = (data: DishCreate) => {
        if (editingDish) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
    };

    const formatPrice = (price: number) => {
        return price >= 1000 ? `₽${(price / 100).toFixed(2)}` : `₽${price}`;
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Управление меню</h1>
                    <p className="text-gray-500">Создание и редактирование блюд вашего ресторана</p>
                </div>
                <Button onClick={() => openDrawer()}>
                    <Plus size={20} className="mr-2" /> Добавить блюдо
                </Button>
            </div>

            <div className="card-base p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Фото</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Название</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Категория</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Цена</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Доступно</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {dishes?.map((dish) => (
                            <tr key={dish.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                                        {dish.image_url ? (
                                            <img src={dish.image_url} alt={dish.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Package size={20} className="text-gray-300" />
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <p className="font-bold text-gray-900">{dish.name}</p>
                                    <p className="text-xs text-gray-400">{dish.weight} г</p>
                                </td>
                                <td className="p-4 text-sm">
                                    {categories?.find(c => c.id === dish.category_id)?.name || 'Неизвестно'}
                                </td>
                                <td className="p-4 font-bold text-primary">
                                    {formatPrice(dish.price)}
                                </td>
                                <td className="p-4">
                                    <Toggle
                                        enabled={dish.is_available}
                                        onChange={(val) => updateMutation.mutate({ is_available: val })}
                                    />
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openDrawer(dish)}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => window.confirm('Удалить блюдо?') && deleteMutation.mutate(dish.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Drawer
                isOpen={isDrawerOpen}
                onClose={closeDrawer}
                title={editingDish ? 'Редактировать блюдо' : 'Добавить блюдо'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Название блюда *</label>
                            <input {...register('name', { required: true })} className="input-base" placeholder="Напр: Пицца Маргарита" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Цена (₽) *</label>
                                <input type="number" {...register('price', { required: true, valueAsNumber: true })} className="input-base" placeholder="500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Вес (г)</label>
                                <input type="number" {...register('weight', { valueAsNumber: true })} className="input-base" placeholder="350" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Категория *</label>
                            <select {...register('category_id', { required: true, valueAsNumber: true })} className="input-base appearance-none">
                                <option value="">Выберите категорию</option>
                                {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Описание</label>
                            <textarea {...register('description')} className="input-base h-24 resize-none" placeholder="Краткое описание блюда..." />
                        </div>

                        <div className="flex items-center justify-between py-2">
                            <span className="font-bold text-gray-700">Доступно для заказа</span>
                            <Toggle enabled={watch('is_available') || false} onChange={(val) => setValue('is_available', val)} />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Фото блюда</label>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary-light transition-all cursor-pointer">
                                <input
                                    type="file"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                />
                                {selectedFile ? (
                                    <p className="text-primary font-bold">{selectedFile.name}</p>
                                ) : (
                                    <>
                                        <Camera size={32} className="text-gray-300" />
                                        <p className="text-xs text-gray-400 text-center">Нажмите или перетащите файл для загрузки</p>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-14" loading={createMutation.isPending || updateMutation.isPending}>
                        {editingDish ? 'Сохранить изменения' : 'Создать блюдо'}
                    </Button>
                </form>
            </Drawer>
        </div>
    );
};
