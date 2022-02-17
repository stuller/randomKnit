import * as React from 'react'
import PropTypes from 'prop-types';
import Stitch from './Stitch';
import { filter } from 'lodash';

export default function TileRow(props) {
    const {rowData, mc, cc, cc2} = props;
    const colors = [mc, cc, cc2];
    function isLight(color) {
        const hex = color.replace('#', '');
        const c_r = parseInt(hex.substr(0, 2), 16);
        const c_g = parseInt(hex.substr(2, 2), 16);
        const c_b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
        return brightness > 100;
    }



    return (
        <div className="row">
            {rowData.map((stitch, index) => {
                const filter = isLight(colors[stitch]) ? '' : 'darkFilter'
                return <Stitch key={`stitch-${index}`} style={{backgroundColor: colors[stitch], filter: filter}} className={`stitch ${filter}`}/>
            })}
        </div>
    );
}

TileRow.propTypes = {
    rowData: PropTypes.array,
    mc: PropTypes.string,
    cc: PropTypes.string,
    cc2: PropTypes.string
};
  