/* global $ */
import React from 'react';
import LocationSingleRow from './LocationSingleRow';

class LocationsTable extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: []
        };
    }
    componentDidMount() {
        // After the component was initially rendered, load up the data
        this.getLocations();
    }
    getLocations() {
        let filterData, url;
        
        url = 'api/locations';
        
        // Make the asynchronous ajax call
        $.ajax({
            url,
            data: filterData,
            dataType: 'json',
            success: function(response) {
                console.log(response);
                // on success, set the data
                this.setState({
                    locations: response.data
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(url, status, err.toString());
            }.bind(this)
        });
    }
    render() {
        let locations = this.state.locations;
        let content;
        
        if ( locations.length ) {
            content = locations.map((location, index) => {
                return <LocationSingleRow key={index} location={location} />;
            });
        } else {
            content = <tr><td colSpan="8">There are no locations yet.</td></tr>;
        }
        return (
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Address</th>
                        <th>Type</th>
                        <th>BR</th>
                        <th>BA</th>
                        <th>Latest Price</th>
                        <th>Sale Price</th>
                        <th>Sale Date</th>
                    </tr>
                </thead>
                <tbody>
                    {content}
                </tbody>
            </table>
        );
    }
}
export default LocationsTable;