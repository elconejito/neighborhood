@extends('layouts.master')

@section('title', 'Locations')

@section('content')
    {!! Breadcrumbs::render('locations') !!}
    <h1>Location
        <a href="{{ route('locations.create') }}" class="btn btn-outline-success float-right">
            <i class="fa fa-plus-circle"></i> Add New Location
        </a>
    </h1>
    <div id="react-locations"></div>
@endsection
