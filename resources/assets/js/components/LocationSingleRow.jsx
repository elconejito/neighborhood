import React from 'react';

class LocationSingleRow extends React.Component {
    render() {
        let loc = this.props.location;
        let urlRoot = 'locations/';
        let latest_price = '-';
        let sale_date = '-';
        
        if ( null !== loc.latest_price ) {
            latest_price = '$'+loc.latest_price.price;
            if ( 2 === loc.latest_price.type ) {
                let date = new Date(loc.latest_price.price_date);
                let options = { year: 'numeric', month: 'short', day: 'numeric' };
                sale_date = date.toLocaleDateString('en-US', options);
            }
        }
        
        return (
            <tr>
                <td className="row-menu">
                    <div className="dropdown">
                        <button className="btn btn-secondary btn-sm" type="button" id={ 'dropdownMenu' + loc.id } data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <i className="fa fa-bars"></i>
                        </button>
                        <div className="dropdown-menu" aria-labelledby={ 'dropdownMenu' + loc.id }>
                            <a className="dropdown-item" href={ urlRoot + loc.id + '/prices/create'}><i className="fa fa-plus fa-fw"></i> Price</a>
                            <a className="dropdown-item" href={ urlRoot + loc.id + '/edit'}><i className="fa fa-pencil fa-fw"></i> Edit</a>
                            <a className="dropdown-item bg-danger" href="#"><i className="fa fa-trash fa-fw"></i> Delete</a>
                        </div>
                    </div>
                </td>
                <td><a href={ urlRoot + loc.id }>{ loc.number } { loc.address }</a></td>
                <td>{ ( loc.type === 1 ? 'Interior' : 'End Unit' ) }</td>
                <td>{ loc.bedrooms }</td>
                <td>{ loc.bathrooms }</td>
                <td>{ latest_price }</td>
                <td>{ sale_date }</td>
            </tr>
        );
    }
}
export default LocationSingleRow;