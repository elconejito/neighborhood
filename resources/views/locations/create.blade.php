@extends('layouts.master')

@section('title', 'New | Location')

@section('content')
    <h1>Create Location</h1>
    <form action="{{ route('locations.store') }}" method="post" name="location-create">
        {{ csrf_field() }}
        <div class="form-group row">
            <label for="number" class="col-sm-2 form-control-label">Number</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="number" name="number" placeholder="Number">
            </div>
        </div>
        <div class="form-group row">
            <label for="address" class="col-sm-2 form-control-label">Address</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="address" name="address" placeholder="Address">
            </div>
        </div>
        <div class="form-group row">
            <label for="type" class="col-sm-2 form-control-label">Type</label>
            <div class="col-sm-10">
                <select class="form-control" id="type" name="type">
                    <option value="1">Interior Townhouse</option>
                    <option value="2">End Unit Townhouse</option>
                    <option value="3">Single Family</option>
                </select>
            </div>
        </div>
        <div class="form-group row">
            <label for="bedrooms" class="col-sm-2 form-control-label">Bedrooms</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="bedrooms" name="bedrooms" placeholder="Bedrooms">
            </div>
        </div>
        <div class="form-group row">
            <label for="bathrooms" class="col-sm-2 form-control-label">Bathrooms</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="bathrooms" name="bathrooms" placeholder="Bathrooms">
            </div>
        </div>
        <div class="form-group row">
            <label for="sqft" class="col-sm-2 form-control-label">SqFt</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="sqft" name="sqft" placeholder="SqFt">
            </div>
        </div>
        <div class="form-group row">
            <label for="built" class="col-sm-2 form-control-label">Built</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="built" name="built" placeholder="Built">
            </div>
        </div>
        <div class="form-group row">
            <label for="mlsid" class="col-sm-2 form-control-label">MLS ID</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="mlsid" name="mlsid" placeholder="MLS ID">
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
@endsection
