@extends('layouts.master')

@section('title', 'Edit | Location')

@section('content')
    <h1>Edit Location</h1>
    <form action="{{ route('locations.update', $location->id) }}" method="post" name="location-edit">
        {{ csrf_field() }}
        <input type="hidden" name="_method" value="put" />
        <div class="form-group row">
            <label for="number" class="col-sm-2 form-control-label">Number</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="number" name="number" value="{{ $location->number }}">
            </div>
        </div>
        <div class="form-group row">
            <label for="address" class="col-sm-2 form-control-label">Address</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="address" name="address" value="{{ $location->address }}">
            </div>
        </div>
        <div class="form-group row">
            <label for="type" class="col-sm-2 form-control-label">Type</label>
            <div class="col-sm-10">
                <select class="form-control" id="type" name="type">
                    <option value="1" {{ ($location->type == 1 ? 'selected="selected"': '') }}>Interior Townhouse</option>
                    <option value="2" {{ ($location->type == 2 ? 'selected="selected"': '') }}>End Unit Townhouse</option>
                    <option value="3" {{ ($location->type == 3 ? 'selected="selected"': '') }}>Single Family</option>
                </select>
            </div>
        </div>
        <div class="form-group row">
            <label for="bedrooms" class="col-sm-2 form-control-label">Bedrooms</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="bedrooms" name="bedrooms" value="{{ $location->bedrooms }}">
            </div>
        </div>
        <div class="form-group row">
            <label for="bathrooms" class="col-sm-2 form-control-label">Bathrooms</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="bathrooms" name="bathrooms" value="{{ $location->bathrooms }}">
            </div>
        </div>
        <div class="form-group row">
            <label for="sqft" class="col-sm-2 form-control-label">SqFt</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="sqft" name="sqft" value="{{ $location->sqft }}">
            </div>
        </div>
        <div class="form-group row">
            <label for="built" class="col-sm-2 form-control-label">Built</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="built" name="built" value="{{ $location->built }}">
            </div>
        </div>
        <div class="form-group row">
            <label for="mlsid" class="col-sm-2 form-control-label">MLS ID</label>
            <div class="col-sm-10">
                <input type="text" class="form-control" id="mlsid" name="mlsid" value="{{ $location->mlsid }}">
            </div>
        </div>
        <div class="form-group row">
            <label for="details" class="col-sm-2 form-control-label">Details</label>
            <div class="col-sm-10">
                <input type="hidden" id="details" name="details" value="{{ $location->details }}">
                <trix-editor input="details"></trix-editor>
            </div>
        </div>

        <div class="form-group row">
            <div class="col-sm-offset-2 col-sm-10">
                <button type="submit" class="btn btn-primary">Save</button>
            </div>
        </div>
    </form>
@endsection
