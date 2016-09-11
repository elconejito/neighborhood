@extends('layouts.master')

@section('title', 'Dashboard')

@section('content')
    {!! Breadcrumbs::render('home') !!}
    <h1>Dashboard</h1>
    <div class="row">
        <div class="col-sm-4">
            <h3>Last 10 Sales</h3>
            <ul class="list-unstyled">
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
                <li>0000 Street <span class="tag tag-default pull-right">$350,000</span></li>
            </ul>
        </div>
        <div class="col-sm-4">
            <h3>Sales per Month</h3>
            <div class="chart"></div>
        </div>
        <div class="col-sm-4">
            <h3>Listings per Month</h3>
            <div class="charts">
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
                <div class="bar"></div>
            </div>
        </div>
    </div>
@endsection