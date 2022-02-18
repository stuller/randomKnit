import * as React from 'react'
import PropTypes from 'prop-types';

export default function NumberInput(props) {
    const {id, label, value, onBlur} = props;
    return (
        <fieldset>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} type="number" onBlur={onBlur} defaultValue={value}/>
        </fieldset>
    );
}

NumberInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.number,
    onBlur: PropTypes.func
};
  