import { Plus, X } from '@phosphor-icons/react';
import { useEffect, useMemo, useRef } from 'react';
import type { DragEvent } from 'react';

import { cn } from '@/lib/utils';

export interface ExistingImage {
    path: string;
    url: string | null;
}

interface ImageUploadProps {
    id: string;
    files: File[];
    onFilesChange: (files: File[]) => void;
    existing?: ExistingImage[];
    onRemoveExisting?: (path: string) => void;
    multiple?: boolean;
    maxFiles?: number;
    error?: string;
    hint?: string;
}

function FilePreview({ file, onRemove }: { file: File; onRemove: () => void }) {
    const url = useMemo(() => URL.createObjectURL(file), [file]);

    useEffect(() => () => URL.revokeObjectURL(url), [url]);

    return (
        <div className="group relative aspect-square overflow-hidden rounded-sm border border-line bg-raised">
            <img
                src={url}
                alt={file.name}
                className="h-full w-full object-cover"
            />
            <button
                type="button"
                onClick={onRemove}
                aria-label={`Remove ${file.name}`}
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-canvas transition-colors hover:bg-danger"
            >
                <X size={12} aria-hidden="true" />
            </button>
        </div>
    );
}

export default function ImageUpload({
    id,
    files,
    onFilesChange,
    existing = [],
    onRemoveExisting,
    multiple = true,
    maxFiles,
    error,
    hint,
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const limit = multiple ? (maxFiles ?? 5) : 1;
    const total = existing.length + files.length;

    const addFiles = (incoming: FileList | null) => {
        if (!incoming) {
            return;
        }

        const next = Array.from(incoming).filter((file) =>
            file.type.startsWith('image/'),
        );

        if (next.length === 0) {
            return;
        }

        const merged = multiple
            ? [...files, ...next].slice(0, limit)
            : [next[0]];

        onFilesChange(merged);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const onDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        addFiles(event.dataTransfer.files);
    };

    return (
        <div>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
                {existing.map((image) => (
                    <div
                        key={image.path}
                        className="group relative aspect-square overflow-hidden rounded-sm border border-line bg-raised"
                    >
                        <img
                            src={image.url ?? '/images/product-placeholder.svg'}
                            alt=""
                            className="h-full w-full object-cover"
                        />
                        {onRemoveExisting && (
                            <button
                                type="button"
                                onClick={() => onRemoveExisting(image.path)}
                                aria-label="Remove image"
                                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-ink/80 text-canvas transition-colors hover:bg-danger"
                            >
                                <X size={12} aria-hidden="true" />
                            </button>
                        )}
                    </div>
                ))}

                {files.map((file, index) => (
                    <FilePreview
                        key={`${file.name}-${file.lastModified}-${index}`}
                        file={file}
                        onRemove={() =>
                            onFilesChange(files.filter((_, i) => i !== index))
                        }
                    />
                ))}

                {total < limit && (
                    <label
                        htmlFor={id}
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={onDrop}
                        className={cn(
                            'flex aspect-square cursor-pointer flex-col items-center justify-center gap-1.5 rounded-sm border border-dashed bg-surface text-muted transition-colors hover:border-ink hover:text-ink',
                            error ? 'border-danger' : 'border-line',
                        )}
                    >
                        <Plus size={18} aria-hidden="true" />
                        <span className="text-[10px] font-medium">
                            Add image
                        </span>
                        <input
                            ref={inputRef}
                            id={id}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            multiple={multiple}
                            onChange={(event) => addFiles(event.target.files)}
                            className="sr-only"
                        />
                    </label>
                )}
            </div>

            {hint && !error && (
                <p className="mt-2 text-[11px] text-muted">{hint}</p>
            )}
            {error && <p className="mt-2 text-[11px] text-danger">{error}</p>}
        </div>
    );
}
