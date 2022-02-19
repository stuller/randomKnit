import * as React from 'react'
import PropTypes from 'prop-types';

export default function Tooltip(props) {
    const {text, symbol = '?', testId} = props;

    return (
        <a data-testid={testId} className="tooltip" data-tooltip={text}><span>{symbol}</span></a>
    );
}

Tooltip.propTypes = {
    text: PropTypes.string,
    symbol: PropTypes.string,
    testId: PropTypes.string
  };
  