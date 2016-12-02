/**
 * React Stuff
 */
/* global $ */

import React from 'react';
import ReactDOM from 'react-dom';
import LocationsTable from './components/LocationsTable';

$( document ).ready(function() {
    if ( $("#react-locations").length ) {
       ReactDOM.render(
           <LocationsTable />,
           document.getElementById('react-locations')
       ); 
    }

    console.log( "reacted!" );
});
