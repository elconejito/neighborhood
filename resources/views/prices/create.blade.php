@extends('layouts.master')

@section('title', 'New | Price')

@section('content')
    <div class="container">

        <h1>Create Price<br /><small>for {{ $location->number }} {{ $location->address }}</small></h1>
        <form action="{{ route('locations.prices.store', $location->id) }}" method="post" name="price-create">
            {{ csrf_field() }}
            <div class="form-group row">
                <label for="type" class="col-sm-2 form-control-label">Type</label>
                <div class="col-sm-10">
                    <select class="form-control" id="type" name="type">
                        <option value="1">Listing</option>
                        <option value="2">Sale</option>
                    </select>
                </div>
            </div>
            <div class="form-group row">
                <label for="price" class="col-sm-2 form-control-label">Price</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="price" name="price" placeholder="Price">
                </div>
            </div>
            <div class="form-group row">
                <label for="price_date" class="col-sm-2 form-control-label">Price Date</label>
                <div class="col-sm-10">
                    <input type="text" class="form-control" id="price_date" name="price_date" value="{{ Carbon\Carbon::now() }}">
                </div>
            </div>
            <div class="form-group row">
                <label for="details" class="col-sm-2 form-control-label">Details</label>
                <div class="col-sm-10">
                    <textarea class="form-control" id="details" name="details" rows="3"></textarea>
                </div>
            </div>

            <div class="form-group row">
                <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-primary">Add New</button>
                </div>
            </div>
        </form>
    </div><!-- /.container -->
@endsection
