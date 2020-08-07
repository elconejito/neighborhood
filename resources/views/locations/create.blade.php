@extends('layouts.master')

@section('title', 'New | Location')

@section('content')
    <h1>Create Location</h1>
    <form action="{{ route('locations.store') }}" method="post" name="location-create">
        {{ csrf_field() }}
        <div class="form-group row">
            <div class="col-sm-3">
                <label for="number" class="form-control-label">Number</label>
                <input type="text" class="form-control @error('number') is-invalid @enderror" id="number" name="number" placeholder="Number" value="{{ old('number') }}">
            </div>

            <div class="col-sm-9">
                <label for="address" class="form-control-label">Address</label>
                <input type="text" class="form-control @error('address') is-invalid @enderror" id="address" name="address" placeholder="Address" value="{{ old('address') }}">
            </div>
        </div>

        <div class="form-group row">
            <div class="col-sm-4">
                <label for="type" class="form-control-label">Type</label>
                <select class="form-control @error('type') is-invalid @enderror" id="type" name="type">
                    <option value="">- Select One - </option>
                    <option value="1" {{ old('type') == 1 ? "selected" : ""}}>Interior Townhouse</option>
                    <option value="2" {{ old('type') == 2 ? "selected" : ""}}>End Unit Townhouse</option>
                    <option value="3" {{ old('type') == 3 ? "selected" : ""}}>Single Family</option>
                </select>
            </div>
        </div>

        <div class="form-group row">
            <div class="col-sm-3">
                <label for="bedrooms" class="form-control-label">Bedrooms</label>
                <input type="text" class="form-control @error('bedrooms') is-invalid @enderror" id="bedrooms" name="bedrooms" placeholder="Bedrooms" value="{{ old('bedrooms') }}">
            </div>

            <div class="col-sm-3">
                <label for="bathrooms" class="form-control-label">Bathrooms</label>
                <input type="text" class="form-control @error('bathrooms') is-invalid @enderror" id="bathrooms" name="bathrooms" placeholder="Bathrooms" value="{{ old('bathrooms') }}">
            </div>

            <div class="col-sm-3">
                <label for="sqft" class="form-control-label">SqFt</label>
                <input type="text" class="form-control @error('sqft') is-invalid @enderror" id="sqft" name="sqft" placeholder="SqFt" value="{{ old("sqft") }}">
            </div>
        </div>

        <div class="form-group row">
            <div class="col-sm-3">
                <label for="built" class="form-control-label">Built</label>
                <input type="text" class="form-control @error('built') is-invalid @enderror" id="built" name="built" placeholder="Built" value="{{ old("built") }}">
            </div>

            <div class="col-sm-3">
                <label for="mlsid" class="form-control-label">MLS ID</label>
                <input type="text" class="form-control @error('mlsid') is-invalid @enderror" id="mlsid" name="mlsid" placeholder="MLS ID" value="{{ old("mlsid") }}">
            </div>
        </div>

        <div class="form-group">
            <label for="details" class="form-control-label">Details</label>
            <textarea class="form-control @error('details') is-invalid @enderror" id="details" name="details">
                {{ old("details") }}
            </textarea>
        </div>

        <div class="form-group">
            <button type="submit" class="btn btn-primary">Add New</button>
        </div>
    </form>
@endsection
