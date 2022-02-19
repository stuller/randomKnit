import * as React from 'react'
import PropTypes from 'prop-types';
import Tile from './Tile';
import ChartLabels from './ChartLabels';

export default function Chart(props) {
    const {tileData, mirrorH, mirrorV, mc, cc, cc2, displayLabels=false, testId} = props;
    const className = mirrorH && displayLabels ? 'chart grid-col-3' : mirrorH ? 'chart grid-col-2' : 'chart';
    const rows = mirrorV ? tileData.length * 2 : tileData.length;
    const stitches = mirrorH ? tileData[0].length * 2 : tileData[0].length;
    return (
        <div className={className} data-testid={testId}>
            <Tile tileData={tileData} mc={mc} cc={cc} cc2={cc2} className=''/>
            {mirrorH &&
                <Tile tileData={tileData} mc={mc} cc={cc} cc2={cc2} className="mirrorH"/>
            }
            
            {displayLabels &&
                <ChartLabels id="rowLabels" count={rows}/>
            }
            
            {mirrorV &&
                <Tile tileData={tileData} mc={mc} cc={cc} cc2={cc2} className="mirrorV"/>
            }
            {mirrorH && mirrorV &&
                <Tile tileData={tileData} mc={mc} cc={cc} cc2={cc2} className="mirrorH mirrorV"/>
            }

            {displayLabels &&
                <ChartLabels id="stitchLabels" count={stitches} className="span-2"/>
            }
        </div>
    );
}

Chart.propTypes = {
    tileData: PropTypes.array,
    mirrorH: PropTypes.bool,
    mirrorV: PropTypes.bool,
    mc: PropTypes.string,
    cc: PropTypes.string,
    cc2: PropTypes.string,
    displayLabels: PropTypes.bool,
    testid: PropTypes.string
};
  