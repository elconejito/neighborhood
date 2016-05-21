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
// Home > Locations > Location
Breadcrumbs::register('location', function($breadcrumbs, $location)
{
	$breadcrumbs->parent('locations');
	$breadcrumbs->push($location->number . ' ' . $location->address, route('locations.show', $location->id));
});
// Home > Locations > Location > Edit
Breadcrumbs::register('locationEdit', function($breadcrumbs, $location)
{
	$breadcrumbs->parent('location', $location);
	$breadcrumbs->push('Edit', route('locations.show', $location->id));
});

/**
 * Price Breadcrumbs
 */
// Home > Locations > Location > Price
Breadcrumbs::register('price', function($breadcrumbs, $price)
{
	$breadcrumbs->parent('location', $price->location);
	$breadcrumbs->push('Price', route('locations.prices.show', [$price->location->id, $price->id]));
});
// Home > Locations > Location > Price > [Create]
Breadcrumbs::register('priceCreate', function($breadcrumbs, $location)
{
	$breadcrumbs->parent('location', $location);
	$breadcrumbs->push('Add Price', route('locations.prices.create', $location->id));
});
// Home > Locations > Location > Price > [Edit]
Breadcrumbs::register('priceEdit', function($breadcrumbs, $price)
{
	$breadcrumbs->parent('location', $price->location);
	$breadcrumbs->push('Edit Price', route('locations.prices.edit', [$price->location->id, $price->id]));
});
