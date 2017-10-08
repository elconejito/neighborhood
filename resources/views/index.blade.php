@extends('layouts.master')

@section('title', 'Dashboard')

@section('content')
    {!! Breadcrumbs::render('home') !!}
    <h1>Dashboard</h1>
    <div class="row">
        <div class="col-sm-6">
            <h3>Listings per Month</h3>
            <svg id="listings" class="data-chart" data-method="count-listing"></svg>
            <h3>Sales per Month</h3>
            <svg id="sales" class="data-chart" data-method="count-sales"></svg>
            <h3>Average Sale Price per Month</h3>
            <svg id="avg-sales" class="data-chart-amount" data-method="average-sales"></svg>
        </div>
        <div class="col-sm-6">
            <h3>Last 10 Sales</h3>
            <div class="data-list" data-method="list-sales">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Address</th>
                            <th class="text-right">Sale Price</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </div>
    </div>
@endsection