@extends('layouts.master')

@section('title', 'Show | Location')

@section('content')
    <div class="container">

        <h1>{{ $location->number }}<br /><small>{{ $location->address }}</small></h1>
        <div class="row">
            <div class="col-md-3">
                <h3>Stats</h3>
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
                <h3>Price History</h3>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                    @foreach ( $location->prices()->get() as $price )
                        <tr class="{{ ( $price->type == 1 ? 'table-info' : '' ) }}">
                            <td>{{ $price->price_date }}</td>
                            <td>{{ $price->price }}</td>
                            <td><a href="{{ route('locations.prices.edit', [$location->id, $price->id]) }}" class="btn btn-secondary btn-sm"><i class="fa fa-pencil"></i></a> <a href="#" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></a></td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
            <div class="col-md-5">
                <h3>Price Trend</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <h3>Details</h3>
                <p>{{ $location->details }}</p>
            </div>
        </div>

    </div><!-- /.container -->
@endsection
