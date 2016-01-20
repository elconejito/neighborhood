@extends('layouts.master')

@section('title', 'Location')

@section('content')
    <div class="container">

        <h1>Location</h1>
        <p><a href="{{ route('location.create') }}"><i class="fa fa-plus"></i> Add New</a></p>
        @if ( $location->isEmpty() )
            <p>No Location yet.</p>
        @else

        @endif
    </div><!-- /.container -->
@endsection
