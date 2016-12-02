@extends('layouts.master')

@section('title', 'Locations')

@section('content')
    {!! Breadcrumbs::render('locations') !!}
    <a href="{{ route('locations.create') }}" class="btn btn-success-outline pull-right" ><i class="fa fa-plus"></i> Add New Location</a>
    <h1>Location</h1>
    <div id="react-locations"></div>
@endsection
