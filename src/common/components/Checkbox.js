import * as React from 'react'
import PropTypes from 'prop-types';

export default function Checkbox(props) {
    const {id, label, checked, onChange} = props;
    return (
        <fieldset>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} type="checkbox" onChange={onChange} checked={checked}/>
        </fieldset>
    );
}

Checkbox.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    checked: PropTypes.bool,
    onChange: PropTypes.func
};
  