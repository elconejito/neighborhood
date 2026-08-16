<?php

namespace App\Jobs;

use App\Models\Property;
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
    public function handle(): void
    {
        GeocodePropertyJob::dispatch($this->property);
    }
}
