import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminService } from '../../api/admin';
import { queryKeys } from '../../api/queryKeys';
import { Spinner } from '../../components/ui/Spinner';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { useForm } from 'react-hook-form';
import { CategoryRead, CategoryCreate } from '../../types';
import { Plus, Pencil, Trash2, ListTree } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryRead | null>(null);
    const queryClient = useQueryClient();
    const { register, handleSubmit, reset } = useForm<CategoryCreate>();

    const { data: categories, isLoading } = useQuery({
        queryKey: queryKeys.admin.categories,
        queryFn: adminService.getCategories,
    });

    const createMutation = useMutation({
        mutationFn: (data: CategoryCreate) => adminService.createCategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories });
            closeModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: (data: CategoryCreate) => {
            if (!editingCategory) return Promise.reject();
            return adminService.updateCategory(editingCategory.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories });
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => adminService.deleteCategory(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: queryKeys.admin.categories });
        },
    });

    const openModal = (category: CategoryRead | null = null) => {
        setEditingCategory(category);
        if (category) {
            reset({ name: category.name, description: category.description });
        } else {
            reset({ name: '', description: '' });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        reset();
    };

    const onSubmit = (data: CategoryCreate) => {
        if (editingCategory) {
            updateMutation.mutate(data);
        } else {
            createMutation.mutate(data);
        }
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
                    <h1 className="text-3xl font-bold mb-2">Категории</h1>
                    <p className="text-gray-500">Управление категориями блюд</p>
                </div>
                <Button onClick={() => openModal()}>
                    <Plus size={20} className="mr-2" /> Добавить категорию
                </Button>
            </div>

            <div className="card-base p-0 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">ID</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Название</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs">Описание</th>
                            <th className="p-4 font-bold text-gray-500 uppercase text-xs text-right">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories?.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4 font-bold text-gray-400">#{cat.id}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <ListTree size={18} />
                                        </div>
                                        <span className="font-bold text-gray-900">{cat.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                                    {cat.description || '—'}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => openModal(cat)}
                                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => window.confirm('Удалить категорию?') && deleteMutation.mutate(cat.id)}
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

            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingCategory ? 'Редактировать категорию' : 'Новая категория'}
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Название *</label>
                        <input {...register('name', { required: true })} className="input-base" placeholder="Пицца, Суши, Напитки..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Описание</label>
                        <textarea {...register('description')} className="input-base h-24 resize-none" placeholder="Краткое описание категории..." />
                    </div>
                    <div className="flex gap-3">
                        <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>Отмена</Button>
                        <Button type="submit" className="flex-1" loading={createMutation.isPending || updateMutation.isPending}>
                            {editingCategory ? 'Сохранить' : 'Создать'}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};
