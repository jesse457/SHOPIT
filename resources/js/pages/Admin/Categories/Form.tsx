import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import PageHeader from '@/components/admin/PageHeader';
import PageMeta from '@/components/common/PageMeta';
import Checkbox from '@/components/form/Checkbox';
import ImageUpload from '@/components/form/ImageUpload';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import { Button } from '@/components/ui/button/Button';
import {
    index as adminCategoriesIndex,
    store as adminCategoryStore,
    update as adminCategoryUpdate,
} from '@/routes/admin/categories';
import type { Category } from '@/types';

interface CategoryFormProps {
    category: Category | null;
}

export default function CategoryForm({ category }: CategoryFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: category?.name ?? '',
        slug: category?.slug ?? '',
        is_active: category?.is_active ?? true,
        image: null as File | null,
        remove_image: false,
        _method: category ? 'put' : '',
    });

    const existing = category?.image
        ? [
              {
                  path: category.image,
                  url: category.image_url,
              },
          ]
        : [];

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(
            category
                ? adminCategoryUpdate.url(category.slug)
                : adminCategoryStore.url(),
            { forceFormData: true },
        );
    };

    return (
        <>
            <PageMeta
                title={category ? 'Edit category' : 'New category'}
                description="Manage a store department."
                noIndex
            />

            <PageHeader
                title={category ? 'Edit category' : 'New category'}
                description={
                    category
                        ? 'Update the department name, image or visibility.'
                        : 'Add a department to the storefront.'
                }
                action={
                    <Link
                        href={adminCategoriesIndex.url()}
                        className="inline-flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink"
                    >
                        <ArrowLeft size={13} aria-hidden="true" />
                        All categories
                    </Link>
                }
            />

            <form onSubmit={submit} className="mt-6 max-w-2xl">
                <div className="space-y-4">
                    <section className="rounded-sm border border-line bg-surface p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    required
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    error={errors.name}
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="slug">Slug</Label>
                                <Input
                                    id="slug"
                                    value={data.slug}
                                    onChange={(event) =>
                                        setData('slug', event.target.value)
                                    }
                                    error={errors.slug}
                                    hint="Leave blank to generate from the name."
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label>Image</Label>
                                <ImageUpload
                                    id="image"
                                    multiple={false}
                                    files={data.image ? [data.image] : []}
                                    onFilesChange={(files) => {
                                        setData('image', files[0] ?? null);
                                        setData('remove_image', false);
                                    }}
                                    existing={data.remove_image ? [] : existing}
                                    onRemoveExisting={() =>
                                        setData('remove_image', true)
                                    }
                                    error={errors.image}
                                    hint="JPG, PNG or WebP. 4 MB."
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Checkbox
                                    id="is_active"
                                    label="Visible in the storefront"
                                    checked={data.is_active}
                                    onChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                                {errors.is_active && (
                                    <p className="mt-1.5 text-[11px] text-danger">
                                        {errors.is_active}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="submit"
                            loading={processing}
                            startIcon={<Check size={15} aria-hidden="true" />}
                        >
                            {category ? 'Save category' : 'Create category'}
                        </Button>
                        <Link
                            href={adminCategoriesIndex.url()}
                            className="text-[12px] font-medium text-soft hover:text-ink"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </>
    );
}
