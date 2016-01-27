@extends('layouts.master')

@section('title', 'Show | Location')

@section('content')
    <div class="container">

        <h1><small>Location</small><br />{{ $location->label }}</h1>
        <div class="row">
            <p></p>
        </div>

    </div><!-- /.container -->
@endsection
