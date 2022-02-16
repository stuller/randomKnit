import * as React from 'react'
import PropTypes from 'prop-types';
import Stitch from './Stitch';

export default function TileRow(props) {
    const {rowData, className, mc, cc, cc2} = props;
    const colors = [mc, cc, cc2];

    return (
        <div className="row">
            {rowData.map((stitch, index) => {
                return <Stitch key={`stitch-${index}`} style={{backgroundColor: colors[stitch]}} className='stitch'/>
            })}
        </div>
    );
}

TileRow.propTypes = {
    rowData: PropTypes.array,
    className: PropTypes.string,
    mc: PropTypes.string,
    cc: PropTypes.string,
    cc2: PropTypes.string
};
  