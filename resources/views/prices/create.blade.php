@extends('layouts.master')

@section('title', 'New | Price')

@section('content')
    {!! Breadcrumbs::render('priceCreate', $location) !!}
    <h1>Create Price<br /><small>{{ $location->number }} {{ $location->address }}</small></h1>
    <div class="row">
        <div class="col-sm-12">
            <form action="{{ route('locations.prices.store', $location->id) }}" method="post" name="price-create">
                {{ csrf_field() }}
                <div class="form-group row">
                    <label for="type" class="col-sm-2 form-control-label">Type</label>
                    <div class="col-sm-10">
                        <select class="form-control" id="type" name="type">
                            <option value="1">Listing</option>
                            <option value="2">Sale</option>
                            <option value="3">Change</option>
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
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-primary">Add New</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection
