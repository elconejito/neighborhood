<?php

// Home
Breadcrumbs::register('home', function($breadcrumbs)
{
	$breadcrumbs->push('Home', route('home'));
});

// Home > Locations
Breadcrumbs::register('locations', function($breadcrumbs)
{
	$breadcrumbs->parent('home');
	$breadcrumbs->push('Locations', route('locations.index'));
});

// Home > Locations > [Location]
Breadcrumbs::register('location', function($breadcrumbs, $location)
{
	$breadcrumbs->parent('locations');
	$breadcrumbs->push($location->number . ' ' . $location->address, route('locations.show', $location->id));
});
