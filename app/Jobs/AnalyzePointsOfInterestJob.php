<?php

namespace App\Jobs;

use App\Models\Property;
use App\Services\PropertyAnalysisService;
use Illuminate\Bus\Batchable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class AnalyzePointsOfInterestJob implements ShouldQueue
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
            Log::warning("Cannot analyze points of interest for property {$this->property->id}: missing coordinates.");

            return;
        }

        $result = $analysisService->analyzePointsOfInterest($this->property->latitude, $this->property->longitude);

        $analysis = $this->property->analysis ?? [];
        $analysis['points_of_interest'] = $result;

        $this->property->update([
            'analysis' => $analysis,
            'analyzed_at' => now(),
        ]);
    }
}
