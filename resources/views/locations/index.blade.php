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
                    <th>&nbsp;</th>
                    <th>#</th>
                    <th>Address</th>
                    <th>Latest Price</th>
                    <th>Sale Price</th>
                    <th>Sale Date</th>
                </tr>
            </thead>
            <tbody>
            @foreach ( $locations as $location )
                <tr>
                    <td>
                        <div class="dropdown">
                            <button class="btn btn-secondary btn-sm" type="button" id="dropdownMenu{{ $location->id }}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fa fa-bars"></i>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu{{ $location->id }}">
                                <a class="dropdown-item" href="{{ route('locations.prices.create', $location->id) }}"><i class="fa fa-plus fa-fw"></i> Price</a>
                                <a class="dropdown-item" href="{{ route('locations.edit', $location->id) }}"><i class="fa fa-pencil"></i> edit</a>
                                <a class="dropdown-item" href="#"><i class="fa fa-trash"></i> Delete</a>
                            </div>
                        </div>
                    </td>
                    <td><a href="{{ route('locations.show', $location->id) }}">{{ $location->number }}</a> {{ $location->address }}</td>
                    <td></td>
                    <td>@if ( $location->latestPrice() ) ${{ number_format($location->latestPrice()->price, 0, '.', ',') }} @else - @endif</td>
                    <td>@if ( $location->latestSalePrice() ) ${{ number_format($location->latestSalePrice()->price, 0, '.', ',') }} @else - @endif</td>
                    <td>@if ( $location->latestSalePrice() ) {{ $location->latestSalePrice()->price_date->toFormattedDateString() }} @else - @endif</td>
                </tr>
            @endforeach
            </tbody>
        </table>
        @endif
    </div><!-- /.container -->
@endsection
