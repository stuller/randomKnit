import * as React from 'react'
import PropTypes from 'prop-types';
import stitchLogo from '../images/stitchBg.png';

export default function Stitch(props) {
    const {style, className} = props;
    return (
        <div style={style} className={className}>
            <img src={stitchLogo}/>
        </div>
        
    );
}

Stitch.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string
};
  