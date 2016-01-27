<?php

namespace App\Http\Controllers;

use App\Location;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PriceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return Response
     */
    public function index($location_id)
    {
        if ( $location_id ) {
            $prices = Price::where('location_id', $location_id);
        } else {
            $prices = Price::all();
        }
        
        return view('prices.index', compact('prices'));
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return Response
     */
    public function create($location_id)
    {
        $location = Location::find($location_id);
        
        return view('prices.create', compact('location'));
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
		$price = new Price();
        $price->type = $request->type;
        $price->price = $request->price;
        $price->price_date = $request->price_date;
        $price->location_id = $request->location_id;

        $price->save();

        return Redirect('locations');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return Response
     */
    public function edit($id)
    {
        //
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
        //
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
