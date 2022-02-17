import * as React from 'react'
import PropTypes from 'prop-types';

export default function Tooltip(props) {
    const {text} = props;

    return (
        <a className="tooltip" data-tooltip={text}><span>?</span></a>
    );
}

Tooltip.propTypes = {
    text: PropTypes.string
  };
  