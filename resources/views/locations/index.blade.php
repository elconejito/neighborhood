@extends('layouts.master')

@section('title', 'Locations')

@section('content')
    <div class="container">

        <h1>Location</h1>
        <p><a href="{{ route('locations.create') }}"><i class="fa fa-plus"></i> Add New</a></p>
        @if ( $locations->isEmpty() )
            <p>No Locations yet.</p>
        @else
        <table class="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Address</th>
                    <th>Latest Price</th>
                    <th>Sale Price</th>
                    <th>Sale Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            @foreach ( $locations as $location )
                <tr>
                    <td><a href="{{ route('locations.show', $location->id) }}">{{ $location->number }}</a></td>
                    <td>{{ $location->address }} <a href="{{ route('locations.prices.create', $location->id) }}" class="btn btn-success btn-sm pull-right"><i class="fa fa-plus fa-fw"></i> Price</a></td>
                    <td>@if ( $location->latestPrice() ) ${{ number_format($location->latestPrice()->price, 0, '.', ',') }} @else - @endif</td>
                    <td>@if ( $location->latestSalePrice() ) ${{ number_format($location->latestSalePrice()->price, 0, '.', ',') }} @else - @endif</td>
                    <td>@if ( $location->latestSalePrice() ) {{ $location->latestSalePrice()->price_date->toFormattedDateString() }} @else - @endif</td>
                    <td><a href="{{ route('locations.edit', $location->id) }}" class="btn btn-secondary btn-sm"><i class="fa fa-pencil"></i></a> <a href="#" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></a></td>
                </tr>
            @endforeach
            </tbody>
        </table>
        @endif
    </div><!-- /.container -->
@endsection
