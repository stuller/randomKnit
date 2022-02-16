import * as React from 'react'
import PropTypes from 'prop-types';
import Chart from './Chart';

export default function Preview(props) {
    const {tileData, mirrorH, mirrorV, mc, cc, cc2} = props;
    const rows = mirrorV ? tileData.length * 2 : tileData.length;
    const stitches = mirrorH ? tileData[0].length * 2 : tileData[0].length;
    const stitchRepeats = Math.floor(50/stitches) % 2 ? Math.floor(50/stitches) + 1 : Math.floor(50/stitches);
    const numberOfTiles = Math.pow(stitchRepeats,2);
    const style = {gridTemplateColumns: `repeat(${stitchRepeats}, 1fr)`};
    const tiles = [];

    for(let i = 0; i < numberOfTiles; i++) {
        const rowNumber = Math.floor(i/stitchRepeats);
        const className = mirrorH && i % 2 ? 'mirrorH' : mirrorV && rowNumber % 2 ? 'mirrorV' : '';
        tiles.push(<Chart 
            key={i}
            tileData = {tileData}
            mc={mc} cc={cc} cc2={cc2}
            mirrorH = {mirrorH} 
            mirrorV = {mirrorV}
        />)
    }
    return (
        <div id="preview" style={style}>
            {tiles}
        </div>
    );
}

Preview.propTypes = {
    tileData: PropTypes.array,
    mirrorH: PropTypes.bool,
    mirrorV: PropTypes.bool,
    mc: PropTypes.string,
    cc: PropTypes.string,
    cc2: PropTypes.string
};
  