<?php

namespace App\Models\Concerns;

use App\Support\Media;

trait HasMediaImages
{
    public function mediaUrl(?string $path): ?string
    {
        return Media::url($path);
    }

    /**
     * @param  array<int, string>|null  $paths
     * @return array<int, string>
     */
    public function mediaUrls(?array $paths): array
    {
        return Media::urls($paths);
    }
}
