@extends('layouts.master')

@section('title', 'Edit | Location')

@section('content')
    <div class="container">

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
                <label for="details" class="col-sm-2 form-control-label">Details</label>
                <div class="col-sm-10">
                    <textarea class="form-control" id="details" name="details" rows="3">{{ $location->details }}</textarea>
                </div>
            </div>
            
            <div class="form-group row">
                <div class="col-sm-offset-2 col-sm-10">
                    <button type="submit" class="btn btn-primary">Save</button>
                </div>
            </div>
        </form>

    </div><!-- /.container -->
@endsection
