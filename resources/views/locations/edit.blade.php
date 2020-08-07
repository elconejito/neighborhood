@extends('layouts.master')

@section('title', 'Edit | Location')

@section('content')
    {!! Breadcrumbs::render('locationEdit', $location) !!}
    <h1>Edit Location<br /><small>{{ $location->number }} {{ $location->address }}</small></h1>
    <form action="{{ route('locations.update', $location->id) }}" method="post" name="location-edit">
        {{ csrf_field() }}
        <input type="hidden" name="_method" value="put" />
        <div class="form-group row">
            <div class="col-sm-3">
                <label for="number" class="form-control-label">Number</label>
                <input type="text" class="form-control @error('number') is-invalid @enderror" id="number" name="number" value="{{ $location->number }}">
            </div>

            <div class="col-sm-9">
                <label for="address" class="form-control-label">Address</label>
                <input type="text" class="form-control @error('address') is-invalid @enderror" id="address" name="address" value="{{ $location->address }}">
            </div>
        </div>

        <div class="form-group row">
            <div class="col-sm-4">
                <label for="type" class="form-control-label">Type</label>
                <select class="form-control @error('type') is-invalid @enderror" id="type" name="type">
                    <option value="">- Select One - </option>
                    <option value="1" {{ ($location->type == 1 ? 'selected="selected"': '') }}>Interior Townhouse</option>
                    <option value="2" {{ ($location->type == 2 ? 'selected="selected"': '') }}>End Unit Townhouse</option>
                    <option value="3" {{ ($location->type == 3 ? 'selected="selected"': '') }}>Single Family</option>
                </select>
            </div>
        </div>

        <div class="form-group row">
            <div class="col-sm-3">
                <label for="bedrooms" class="form-control-label">Bedrooms</label>
                <input type="text" class="form-control @error('bedrooms') is-invalid @enderror" id="bedrooms" name="bedrooms" value="{{ $location->bedrooms }}">
            </div>

            <div class="col-sm-3">
                <label for="bathrooms" class="form-control-label">Bathrooms</label>
                <input type="text" class="form-control @error('bathrooms') is-invalid @enderror" id="bathrooms" name="bathrooms" value="{{ $location->bathrooms }}">
            </div>

            <div class="col-sm-3">
                <label for="sqft" class="form-control-label">SqFt</label>
                <input type="text" class="form-control @error('sqft') is-invalid @enderror" id="sqft" name="sqft" value="{{ $location->sqft }}">
            </div>
        </div>

        <div class="form-group row">
            <div class="col-sm-3">
                <label for="built" class="form-control-label">Built</label>
                <input type="text" class="form-control @error('built') is-invalid @enderror" id="built" name="built" value="{{ $location->built }}">
            </div>

            <div class="col-sm-3">
                <label for="mlsid" class="form-control-label">MLS ID</label>
                <input type="text" class="form-control @error('mlsid') is-invalid @enderror" id="mlsid" name="mlsid" value="{{ $location->mlsid }}">
            </div>
        </div>

        <div class="form-group">
            <label for="details" class="form-control-label">Details</label>
            <textarea class="form-control @error('details') is-invalid @enderror" id="details" name="details">
                {{ $location->details }}
            </textarea>
        </div>

        <div class="form-group">
            <button type="submit" class="btn btn-primary">Save</button>
        </div>
    </form>
@endsection
