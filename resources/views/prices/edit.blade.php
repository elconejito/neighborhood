@extends('layouts.master')

@section('title', 'Edit | Price')

@section('content')
    {!! Breadcrumbs::render('priceEdit', $price) !!}
    <h1>Edit Price<br /><small>{{ $price->location->number }} {{ $price->location->address }}</small></h1>
    <div class="row">
        <div class="col-sm-12">
            <form action="{{ route('locations.prices.update', [$price->location->id, $price->id]) }}" method="post" name="location-edit">
                {{ csrf_field() }}
                <input type="hidden" name="_method" value="put" />
                <div class="form-group row">
                    <label for="type" class="col-sm-2 form-control-label">Type</label>
                    <div class="col-sm-10">
                        <select class="form-control" id="type" name="type">
                            <option value="1" {{ ($price->type == 1 ? 'selected="selected"': '') }}>Listing</option>
                            <option value="2" {{ ($price->type == 2 ? 'selected="selected"': '') }}>Sale</option>
                            <option value="3" {{ ($price->type == 3 ? 'selected="selected"': '') }}>Change</option>
                        </select>
                    </div>
                </div>
                <div class="form-group row">
                    <label for="price" class="col-sm-2 form-control-label">Price</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="price" name="price" placeholder="Price" value="{{ $price->price }}">
                    </div>
                </div>
                <div class="form-group row">
                    <label for="price_date" class="col-sm-2 form-control-label">Price Date</label>
                    <div class="col-sm-10">
                        <input type="text" class="form-control" id="price_date" name="price_date" value="{{ $price->price_date }}">
                    </div>
                </div>

                <div class="form-group row">
                    <div class="col-sm-offset-2 col-sm-10">
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
@endsection
