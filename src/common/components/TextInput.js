import * as React from 'react'
import PropTypes from 'prop-types';

export default function TextInput(props) {
    const {id, label, value, onChange} = props;
    return (
        <fieldset>
            <label htmlFor={id}>{label}</label>
            <input id={id} name={id} type="text" onChange={onChange} value={value}/>
        </fieldset>
    );
}

TextInput.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};
  