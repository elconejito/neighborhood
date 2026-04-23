<?php

namespace App\Jobs;

use App\Models\Property;
use App\Services\PropertyAnalysisService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Log;

class GeocodePropertyJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     *
     * @param  array<class-string>|null  $analysisJobClasses  Limit which analysis jobs run. Null runs all.
     */
    public function __construct(
        public Property $property,
        public ?array $analysisJobClasses = null,
    ) {}

    /**
     * Execute the job.
     */
    public function handle(PropertyAnalysisService $analysisService): void
    {
        if ($this->property->latitude && $this->property->longitude) {
            $this->dispatchAnalysisJobs();

            return;
        }

        $coordinates = $analysisService->geocodeAddress([
            'street' => $this->property->address,
            'city' => $this->property->city,
            'state' => $this->property->state,
            'postalcode' => $this->property->zip_code,
        ]);

        if ($coordinates) {
            $this->property->update([
                'geocoding_source' => $coordinates['source'],
                'geocoding_accuracy' => $coordinates['accuracy'],
            ]);

            if (in_array($coordinates['accuracy'], ['rooftop', 'point'])) {
                $this->property->update([
                    'latitude' => $coordinates['lat'],
                    'longitude' => $coordinates['lng'],
                ]);

                $this->dispatchAnalysisJobs();
            } else {
                Log::warning("Property {$this->property->id} could only be geocoded with low accuracy '{$coordinates['accuracy']}' via {$coordinates['source']}. Coordinates not stored; manual entry required.", [
                    'property_id' => $this->property->id,
                    'address' => $this->property->address,
                    'source' => $coordinates['source'],
                    'accuracy' => $coordinates['accuracy'],
                ]);
            }
        } else {
            Log::error("Geocoding failed for property {$this->property->id}. Analysis aborted.");
        }
    }

    protected function dispatchAnalysisJobs(): void
    {
        $classes = $this->analysisJobClasses ?? [
            AnalyzeNeighborDistanceJob::class,
            AnalyzePointsOfInterestJob::class,
            AnalyzeRoadAccessibilityJob::class,
        ];

        Bus::batch(
            array_map(fn ($class) => new $class($this->property), $classes)
        )->dispatch();
    }
}
