<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Http\UploadedFile;

trait HandlesUploads
{
    /**
     * @param  array<int, UploadedFile>|UploadedFile|null  $files
     * @return array<int, string>
     */
    protected function storeImages(array|UploadedFile|null $files, string $directory): array
    {
        return collect((array) $files)
            ->filter(fn ($file): bool => $file instanceof UploadedFile)
            ->map(fn (UploadedFile $file): string => $file->store($directory, 'public'))
            ->values()
            ->all();
    }

    protected function storeImage(?UploadedFile $file, string $directory): ?string
    {
        return $file?->store($directory, 'public');
    }
}
