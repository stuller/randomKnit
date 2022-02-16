import * as React from 'react'
import PropTypes from 'prop-types';

export default function NumberInput(props) {
    const {id, label, value, onChange} = props;
    return (
        <fieldset>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} type="number" onChange={onChange} value={value}/>
        </fieldset>
    );
}

NumberInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.number,
    onChange: PropTypes.func
};
  