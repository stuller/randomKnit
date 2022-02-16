import * as React from 'react'
import PropTypes from 'prop-types';

export default function Stitch(props) {
    const {style, className} = props;
    return (
        <div style={style} className={className}></div>
    );
}

Stitch.propTypes = {
    style: PropTypes.object,
    className: PropTypes.string
};
  