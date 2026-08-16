<?php

namespace App\Serializers;

use League\Fractal\Resource\ResourceInterface;
use League\Fractal\Serializer\DataArraySerializer;

class IncludeUnwrappedDataArraySerializer extends DataArraySerializer
{
    public function mergeIncludes(array $transformedData, array $includedData): array
    {
        $unwrappedIncludes = [];

        foreach ($includedData as $key => $value) {
            if (is_array($value) && array_key_exists('data', $value)) {
                $unwrappedIncludes[$key] = $value['data'];

                continue;
            }

            $unwrappedIncludes[$key] = $value;
        }

        return array_merge($transformedData, $unwrappedIncludes);
    }

    public function includedData(ResourceInterface $resource, array $data): array
    {
        return $data['data'] ?? $data;
    }
}
