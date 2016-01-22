@extends('layouts.master')

@section('title', 'Locations')

@section('content')
    <div class="container">

        <h1>Location</h1>
        <p><a href="{{ route('locations.create') }}"><i class="fa fa-plus"></i> Add New</a></p>
        @if ( $locations->isEmpty() )
            <p>No Locations yet.</p>
        @else
            @foreach ( $locations as $location )
                {{ $location->number }} {{ $location->address }}
            @endforeach
        @endif
    </div><!-- /.container -->
@endsection
