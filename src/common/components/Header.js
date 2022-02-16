import * as React from 'react'
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default function Header(props) {
    const Component = props.component || "p";

    return <Component>{props.text}</Component>;
}

Header.propTypes = {
    component: PropTypes.elementType,
    text: PropTypes.string,
  };
  