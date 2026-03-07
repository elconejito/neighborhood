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
     */
    public function __construct(public Property $property) {}

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
                'latitude' => $coordinates['lat'],
                'longitude' => $coordinates['lng'],
            ]);

            $this->dispatchAnalysisJobs();
        } else {
            Log::error("Geocoding failed for property {$this->property->id}. Analysis aborted.");
        }
    }

    protected function dispatchAnalysisJobs(): void
    {
        Bus::batch([
            new AnalyzeNeighborDistanceJob($this->property),
            new AnalyzePointsOfInterestJob($this->property),
            new AnalyzeRoadAccessibilityJob($this->property),
        ])->dispatch();
    }
}
