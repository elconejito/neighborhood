@extends('layouts.master')

@section('title', 'New | Location')

@section('content')
    <div class="container">

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
