import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import PageHeader from '@/components/admin/PageHeader';
import PageMeta from '@/components/common/PageMeta';
import Checkbox from '@/components/form/Checkbox';
import ImageUpload from '@/components/form/ImageUpload';
import type { ExistingImage } from '@/components/form/ImageUpload';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import Textarea from '@/components/form/Textarea';
import { Button } from '@/components/ui/button/Button';
import { formatDate } from '@/lib/utils';
import {
    index as adminProductsIndex,
    store as adminProductStore,
    update as adminProductUpdate,
} from '@/routes/admin/products';
import type { AdminProduct, Brand, Category } from '@/types';

interface ProductFormProps {
    product: AdminProduct | null;
    categories: Array<Pick<Category, 'id' | 'name' | 'slug'>>;
    brands: Array<Pick<Brand, 'id' | 'name' | 'slug'>>;
}

export default function ProductForm({
    product,
    categories,
    brands,
}: ProductFormProps) {
    const { data, setData, post, processing, errors } = useForm({
        name: product?.name ?? '',
        slug: product?.slug ?? '',
        category_id: product?.category_id ?? categories[0]?.id ?? 0,
        brand_id: product?.brand_id ?? brands[0]?.id ?? 0,
        description: product?.description ?? '',
        price: product?.price ?? '',
        compare_at_price: product?.compare_at_price ?? '',
        stock_quantity: product?.stock_quantity ?? 0,
        low_stock_threshold: product?.low_stock_threshold ?? 5,
        is_active: product?.is_active ?? true,
        is_featured: product?.is_featured ?? false,
        on_sale: product?.on_sale ?? false,
        images: [] as File[],
        remove_images: [] as string[],
        _method: product ? 'put' : '',
    });

    const typedErrors = errors as Record<string, string | undefined>;
    const imageError = typedErrors.images ?? typedErrors['images.0'];

    const existingImages: ExistingImage[] = (product?.images ?? [])
        .map((path, index) => ({
            path,
            url: product?.images_url[index] ?? null,
        }))
        .filter((image) => !data.remove_images.includes(image.path));

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(
            product
                ? adminProductUpdate.url(product.slug)
                : adminProductStore.url(),
            { forceFormData: true },
        );
    };

    const selectClass =
        'h-11 w-full rounded-sm border border-line bg-surface px-3 text-[14px] text-ink focus:border-ink focus:outline-none';

    return (
        <>
            <PageMeta
                title={product ? 'Edit product' : 'New product'}
                description="Manage a catalog product."
                noIndex
            />

            <PageHeader
                title={product ? 'Edit product' : 'New product'}
                description={
                    product
                        ? 'Update the product, pricing and stock.'
                        : 'Add a piece to the catalog.'
                }
                action={
                    <Link
                        href={adminProductsIndex.url()}
                        className="inline-flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink"
                    >
                        <ArrowLeft size={13} aria-hidden="true" />
                        All products
                    </Link>
                }
            />

            <form onSubmit={submit} className="mt-6">
                <div className="grid gap-4 lg:grid-cols-[1fr_320px] lg:items-start">
                    <div className="space-y-4">
                        <section className="rounded-sm border border-line bg-surface p-5">
                            <h2 className="font-display text-[24px] leading-none font-medium">
                                Basics
                            </h2>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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

                                <div className="space-y-2">
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

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="category_id">
                                            Category
                                        </Label>
                                        <select
                                            id="category_id"
                                            required
                                            value={String(data.category_id)}
                                            onChange={(event) =>
                                                setData(
                                                    'category_id',
                                                    Number(event.target.value),
                                                )
                                            }
                                            className={selectClass}
                                        >
                                            {categories.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="brand_id">Brand</Label>
                                        <select
                                            id="brand_id"
                                            required
                                            value={String(data.brand_id)}
                                            onChange={(event) =>
                                                setData(
                                                    'brand_id',
                                                    Number(event.target.value),
                                                )
                                            }
                                            className={selectClass}
                                        >
                                            {brands.map((brand) => (
                                                <option
                                                    key={brand.id}
                                                    value={brand.id}
                                                >
                                                    {brand.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2 sm:col-span-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        rows={5}
                                        value={data.description}
                                        onChange={(event) =>
                                            setData(
                                                'description',
                                                event.target.value,
                                            )
                                        }
                                        error={errors.description}
                                        hint="Plain text. Line breaks are preserved."
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="rounded-sm border border-line bg-surface p-5">
                            <h2 className="font-display text-[24px] leading-none font-medium">
                                Pricing and stock
                            </h2>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="price">Price (XAF)</Label>
                                    <Input
                                        id="price"
                                        type="number"
                                        min="0"
                                        step="1"
                                        required
                                        value={data.price}
                                        onChange={(event) =>
                                            setData('price', event.target.value)
                                        }
                                        error={errors.price}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="compare_at_price">
                                        Compare-at price (XAF)
                                    </Label>
                                    <Input
                                        id="compare_at_price"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={data.compare_at_price}
                                        onChange={(event) =>
                                            setData(
                                                'compare_at_price',
                                                event.target.value,
                                            )
                                        }
                                        error={errors.compare_at_price}
                                        hint="Optional. Must be above the price."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stock_quantity">
                                        Stock quantity
                                    </Label>
                                    <Input
                                        id="stock_quantity"
                                        type="number"
                                        min="0"
                                        step="1"
                                        required
                                        value={data.stock_quantity}
                                        onChange={(event) =>
                                            setData(
                                                'stock_quantity',
                                                Number(event.target.value),
                                            )
                                        }
                                        error={errors.stock_quantity}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="low_stock_threshold">
                                        Low stock threshold
                                    </Label>
                                    <Input
                                        id="low_stock_threshold"
                                        type="number"
                                        min="0"
                                        step="1"
                                        required
                                        value={data.low_stock_threshold}
                                        onChange={(event) =>
                                            setData(
                                                'low_stock_threshold',
                                                Number(event.target.value),
                                            )
                                        }
                                        error={errors.low_stock_threshold}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className="rounded-sm border border-line bg-surface p-5">
                            <h2 className="font-display text-[24px] leading-none font-medium">
                                Images
                            </h2>
                            <p className="mt-2 text-[12px] text-muted">
                                Up to five images. The first image is the cover.
                            </p>

                            <div className="mt-4">
                                <ImageUpload
                                    id="images"
                                    files={data.images}
                                    onFilesChange={(files) =>
                                        setData('images', files)
                                    }
                                    existing={existingImages}
                                    onRemoveExisting={(path) =>
                                        setData('remove_images', [
                                            ...data.remove_images,
                                            path,
                                        ])
                                    }
                                    multiple
                                    maxFiles={5}
                                    error={imageError}
                                    hint="JPG, PNG or WebP. 4 MB each."
                                />
                            </div>
                        </section>
                    </div>

                    <aside className="space-y-4 lg:sticky lg:top-24">
                        <section className="rounded-sm border border-line bg-surface p-5">
                            <h2 className="font-display text-[24px] leading-none font-medium">
                                Visibility
                            </h2>

                            <div className="mt-4 space-y-3">
                                <Checkbox
                                    id="is_active"
                                    label="Visible in the store"
                                    checked={data.is_active}
                                    onChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                                <Checkbox
                                    id="is_featured"
                                    label="Featured in the catalog"
                                    checked={data.is_featured}
                                    onChange={(checked) =>
                                        setData('is_featured', checked)
                                    }
                                />
                                <Checkbox
                                    id="on_sale"
                                    label="Show a sale badge"
                                    checked={data.on_sale}
                                    onChange={(checked) =>
                                        setData('on_sale', checked)
                                    }
                                />
                            </div>
                        </section>

                        <section className="rounded-sm border border-line bg-surface p-5">
                            <Button
                                type="submit"
                                size="lg"
                                fullWidth
                                loading={processing}
                                startIcon={
                                    <Check size={15} aria-hidden="true" />
                                }
                            >
                                {product ? 'Save product' : 'Create product'}
                            </Button>
                            <Link
                                href={adminProductsIndex.url()}
                                className="mt-3 block text-center text-[11px] font-medium text-soft hover:text-ink"
                            >
                                Cancel
                            </Link>

                            {product && (
                                <p className="mt-4 border-t border-line pt-3 text-[10px] leading-relaxed text-muted">
                                    Updated {formatDate(product.updated_at)}
                                </p>
                            )}
                        </section>
                    </aside>
                </div>
            </form>
        </>
    );
}
