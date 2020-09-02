import React from 'react';
import Chart from './Chart/Chart';

function Charts() {
    return (
        <div>
            <div className="vacations-container">
                <div className="vacations-header">
                    <h1 className="vacations-h1 tracking-in-expand">Followers Chart</h1>
                </div>
            </div >
                <div className="vacations">
           <Chart />
        </div>
        </div>
    );
}

export default Charts;