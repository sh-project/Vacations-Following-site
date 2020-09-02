import React from 'react';
import './Filter.css'

function Filter(props) {
    const { sortBy, setSortBy, filter, setFilter } = props

    return (
        <div className="filters-wrapper">
            <div className="filters">
                <div className="checkbox-wrapper">
                    <label htmlFor="checkbox">
                        sort by:
                    </label>
                    <select className="filter-button" value={sortBy} onChange={setSortBy}>
                        <option value="destination">Destination</option>
                        <option value="data">Date</option>
                        <option value="price">Price</option>
                        <option value="userfollow">Following</option>
                        <option value="followers">Followers</option>
                    </select>
                </div>
                <div className="checkbox-wrapper">
                    <div className="checkbox-wrapper">
                        <input id="checkbox" type="checkbox" value={filter} onChange={setFilter} />
                        <label htmlFor="checkbox">
                            following only
                    </label>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Filter;
