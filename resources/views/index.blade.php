@extends('layouts.master')

@section('title', 'Dashboard')

@section('content')
    {!! Breadcrumbs::render('home') !!}
    <h1>Dashboard</h1>
    <div class="row">
        <div class="col-sm-4">
            <h3>Last 10 Sales</h3>
            <ul class="list-unstyled data-list" data-method="list-sales">
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
            </ul>
        </div>
        <div class="col-sm-4">
            <h3>Sales per Month</h3>
            <svg id="sales" class="data-chart" data-method="count-sales"></svg>
        </div>
        <div class="col-sm-4">
            <h3>Listings per Month</h3>
            <svg id="listings" class="data-chart" data-method="count-listing"></svg>
        </div>
    </div>
@endsection