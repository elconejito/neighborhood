<?php

namespace App\Http\Controllers;

use App\Location;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;

class LocationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index()
    {
        $locations = Location::orderBy('address')->orderBy('number')->get();
        return view('locations.index', compact('locations'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create()
    {
        return view('locations.create');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  Request  $request
     * @return Response
     */
    public function store(Request $request)
    {
        // create the new Location
		$location = new Location();
        $location->number = $request->number;
        $location->address = $request->address;
        $location->type = $request->type;
        $location->bedrooms = $request->bedrooms;
        $location->bathrooms = $request->bathrooms;
        $location->sqft = $request->sqft;
        $location->built = $request->built;
        $location->mlsid = $request->mlsid;
        $location->details = $request->details;

        $location->save();

        return redirect()->action('LocationController@show', $location->id);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        $location = Location::find($id);

        return view('locations.show', compact('location'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        $location = Location::find($id);

        return view('locations.edit', compact('location'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  Request  $request
     * @param  int  $id
     * @return Response
     */
    public function update(Request $request, $id)
    {
        // create the new Location
        $location = Location::find($id);
        $location->number = $request->number;
        $location->address = $request->address;
        $location->type = $request->type;
        $location->bedrooms = $request->bedrooms;
        $location->bathrooms = $request->bathrooms;
        $location->sqft = $request->sqft;
        $location->built = $request->built;
        $location->mlsid = $request->mlsid;
        $location->details = $request->details;

        $location->save();

        return redirect()->action('LocationController@show', $location->id);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return Response
     */
    public function destroy($id)
    {
        //
    }
}
