<?php

namespace App\Jobs;

use App\Models\Property;
use App\Services\PropertyAnalysisService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class AnalyzePropertyJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Property $property)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(PropertyAnalysisService $analysisService): void
    {
        if (! $this->property->latitude || ! $this->property->longitude) {
            // Try to geocode the address
            $coordinates = $analysisService->geocodeAddress([
                'street' => $this->property->address,
                'city' => $this->property->city,
                'state' => $this->property->state,
                'postalcode' => $this->property->zip_code,
            ]);

            if ($coordinates) {
                $this->property->update([
                    'latitude' => $coordinates['lat'],
                    'longitude' => $coordinates['lng'],
                ]);
            } else {
                // If geocoding fails, we can't proceed with analysis
                // We could log this or handle it as needed
                return;
            }
        }

        $analysis = $analysisService->analyzeProperty($this->property);

        $this->property->update([
            'analysis' => $analysis,
            'analyzed_at' => now(),
        ]);
    }
}
