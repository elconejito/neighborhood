@extends('layouts.master')

@section('title', 'Show | Location')

@section('content')
    <div class="container">

        <h1>{{ $location->number }}<br /><small>{{ $location->address }}</small></h1>
        <div class="row">
            <div class="col-md-6">
                <h3>Prices</h3>
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
                        <tr>
                            <td>{{ $price->price_date }}</td>
                            <td>{{ $price->type }}</td>
                            <td>{{ $price->price }}</td>
                            <td><a href="{{ route('locations.prices.edit', [$location->id, $price->id]) }}" class="btn btn-secondary btn-sm"><i class="fa fa-pencil"></i></a> <a href="#" class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></a></td>
                        </tr>
                    @endforeach
                    </tbody>
                </table>
            </div>
            <div class="col-md-6">
                <h3>Details</h3>
                <p>{{ $location->details }}</p>
            </div>
        </div>

    </div><!-- /.container -->
@endsection
