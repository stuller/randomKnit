import * as React from 'react'
import PropTypes from 'prop-types';

export default function Header(props) {
    const Element = props.element || "p";
    const {href, text} = props;

    const innerHTML = href ? <a href={href}>{text}</a> : text;

    return (
        
        <Element>{innerHTML}</Element>
        
    );
}

Header.propTypes = {
    element: PropTypes.elementType,
    text: PropTypes.string,
    href: PropTypes.string
  };
  