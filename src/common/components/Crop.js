import * as React from 'react'
import PropTypes from 'prop-types';

export default function Crop(props) {
    const {id, tileData} = props;
    const stitchHeight = 20;
    const stitchWidth = 25;
    const initialCropHeight = tileData.length * stitchHeight + tileData.length;
    const initialCropWidth = tileData[0].length * stitchWidth + tileData[0].length + 2;

    const [height, setHeight] = React.useState(initialCropHeight);
    const [width, setWidth] = React.useState(initialCropWidth);
    const [position, setPosition] = React.useState({x: 0, y: 0})

    // Handle the mousedown event
    // that's triggered when user drags the resizer
    const mouseDownHandler = function (e) {
        const el = document.getElementById(id)
        // Get the current mouse position
        setPosition({x: e.clientX, y: e.clientY});
        setHeight(el.clientHeight);
        setWidth(el.clientWidth);
        // Attach the listeners to `document`
        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function (e) {
        const el = document.getElementById(id);
        
        // How far the mouse has been moved
        const dx = e.clientX - position.x > 0 ? 0 : e.clientX - position.x;
        const dy = e.clientY - position.y > 0 ? 0 : e.clientY - position.y;

        const adjustedWidthDiff = dx - (dx % stitchWidth);
        const adjustedXBorderDiff = adjustedWidthDiff / stitchWidth * 2 - 2;

        const adjustedHeightDiff = dy - (dy % stitchHeight);
        const adjustedYBorderDiff = adjustedHeightDiff / stitchHeight * 2 - 2;

        // Adjust the dimension of element
        setHeight(height + adjustedHeightDiff + adjustedXBorderDiff);
        setWidth(width + adjustedWidthDiff + adjustedYBorderDiff);
        console.log('i set height!')
    };

    const mouseUpHandler = function () {
        // Remove the handlers of `mousemove` and `mouseup`
        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    return ( 
        <div id={`container-${id}`}>
            <div id={`top-${id}`} className="cropHandle top" onMouseDown={mouseDownHandler}></div>
            <div id={id} style={{width: width + 'px', height: height + 'px'}}></div>
            <div id={`bottom-${id}`} className="cropHandle bottom" onMouseDown={mouseDownHandler}></div>
        </div>
    );
}

Crop.propTypes = {
    tileData: PropTypes.array,
    id: PropTypes.string
};
  




