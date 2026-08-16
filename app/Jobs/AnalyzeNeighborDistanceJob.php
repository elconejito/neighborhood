<?php

namespace App\Jobs;

use App\Models\Property;
use App\Services\PropertyAnalysisService;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class AnalyzeNeighborDistanceJob implements ShouldQueue
{
    use Batchable, Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Property $property) {}

    /**
     * Execute the job.
     */
    public function handle(PropertyAnalysisService $analysisService): void
    {
        if (! $this->property->latitude || ! $this->property->longitude) {
            Log::warning("Cannot analyze neighbor distance for property {$this->property->id}: missing coordinates.");

            return;
        }

        $result = $analysisService->analyzeNeighborDistance(
            $this->property->latitude,
            $this->property->longitude,
            $this->property->address,
        );

        $analysis = $this->property->analysis ?? [];
        $analysis['neighbor_distance'] = $result;

        $this->property->update([
            'analysis' => $analysis,
            'analyzed_at' => now(),
        ]);
    }
}
