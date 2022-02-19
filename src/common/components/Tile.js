import * as React from 'react'
import PropTypes from 'prop-types';
import TileRow from './TileRow';

export default function Tile(props) {
    const {tileData, mc, cc, cc2, className = '', testId} = props;
    return (
        <div className={`tile ${className}`}>
            {tileData.map((rowData, index) => {
                return <TileRow key={`row-${index}`} rowData={rowData} mc={mc} cc={cc} cc2={cc2} data-testid={testId}/>
            })}
        </div>
    );
}

Tile.propTypes = {
    tileData: PropTypes.array,
    mc: PropTypes.string,
    cc: PropTypes.string,
    cc2: PropTypes.string,
    className: PropTypes.string,
    testId: PropTypes.string
};
  