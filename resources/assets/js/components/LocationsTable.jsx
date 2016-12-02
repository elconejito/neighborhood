/* global $ */
import React from 'react';
import LocationSingleRow from './LocationSingleRow';

class LocationsTable extends React.Component {
    constructor() {
        super();
        this.state = {
            locations: []
        };
        this.search = this.search.bind(this);
    }
    componentDidMount() {
        // After the component was initially rendered, load up the data
        this.getLocations();
    }
    search() {
        let term = $("#address-filter").val();
        this.getLocations(term);
    }
    getLocations(term) {
        let filterData, url;
        
        url = 'api/locations';
        
        if ( undefined !== term ) {
            filterData = { term };
        }
        
        // Make the asynchronous ajax call
        $.ajax({
            url,
            data: filterData,
            dataType: 'json',
            success: function(response) {
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
            <div>
                <div className="form-group row">
                    <label htmlFor="address-filter" className="col-form-label sr-only">Address Filter</label>
                    <div className="col-xs-12">
                        <input type="text" id="address-filter" className="form-control" placeholder="Filter by Street Name" onChange={this.search} />
                    </div>
                </div>
                <table className="table">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Address</th>
                            <th>Type</th>
                            <th>BR</th>
                            <th>BA</th>
                            <th>Latest Price</th>
                            <th>Sale Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {content}
                    </tbody>
                </table>
            </div>
        );
    }
}
export default LocationsTable;