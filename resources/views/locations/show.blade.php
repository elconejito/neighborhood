@extends('layouts.master')

@section('title', 'Show | Location')

@section('content')
    {!! Breadcrumbs::render('location', $location) !!}
    <h1>{{ $location->number }} {{ $location->address }}</h1>
    <div class="btn-group" role="group">
        <a class="btn btn-secondary" href="{{ route('locations.edit', $location->id) }}"><i class="fas fa-edit fa-fw"></i> Edit</a>
        <a class="btn btn-danger" href="#"><i class="fas fa-trash-alt fa-fw"></i> Delete</a>
    </div>
    <div class="row">
        <div class="col-md-3">
            <h3 class="section-heading">Stats</h3>
            <ul class="list-group">
                <li class="list-group-item">
                    <span class="label label-default pull-xs-right">{{ $location->bedrooms }}</span>
                    Bedrooms
                </li>
                <li class="list-group-item">
                    <span class="label label-default pull-xs-right">{{ $location->bathrooms }}</span>
                    Bathrooms
                </li>
                <li class="list-group-item">
                    <span class="label label-default pull-xs-right">{{ $location->sqft }}</span>
                    Sq/Ft
                </li>
                <li class="list-group-item">
                    <span class="label label-default pull-xs-right">{{ $location->built }}</span>
                    Year Built
                </li>
                <li class="list-group-item">
                    <span class="label label-default pull-xs-right">{{ $location->mlsid }}</span>
                    MLS ID
                </li>
            </ul>
        </div>
        <div class="col-md-4">
            <h3 class="section-heading">Price History</h3>
            <table class="table">
                <thead>
                    <tr>
                        <th>&nbsp;</th>
                        <th>Date</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                @foreach ( $location->prices()->get() as $price )
                    <tr class="{{ ( $price->type == 2 ? 'table-success' : '' ) }}">
                        <td class="row-menu">
                            <div class="dropdown">
                                <button class="btn btn-secondary btn-sm" type="button" id="dropdownMenu{{ $price->id }}" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fa fa-bars"></i>
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenu{{ $price->id }}">
                                    <a class="dropdown-item" href="{{ route('locations.prices.edit', [$location->id, $price->id]) }}"><i class="fas fa-edit fa-fw"></i> Edit</a>
                                    <a class="dropdown-item bg-danger" href="#"><i class="fas fa-trash-alt fa-fw"></i> Delete</a>
                                </div>
                            </div>
                        </td>
                        <td>{{ $price->price_date->toFormattedDateString() }}</td>
                        <td>${{ number_format($price->price, 0, '.', ',') }}</td>
                    </tr>
                @endforeach
                </tbody>
            </table>
            <a href="{{ route('locations.prices.create', $location->id) }}" class="btn btn-success btn-sm pull-right"><i class="fa fa-plus-circle fa-fw"></i> Price</a>
        </div>
        <div class="col-md-5">
            <h3 class="section-heading">Price Trend</h3>
        </div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <h3 class="section-heading">Details</h3>
            {!! $location->details !!}
        </div>
    </div>
@endsection
