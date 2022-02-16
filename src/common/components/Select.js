import * as React from 'react'
import PropTypes from 'prop-types';

export default function Select(props) {
    const {id, label, value, options, onChange} = props;
    
    return (
        <fieldset>
            <label htmlFor={id}>{label}</label>
            <select id={id} name={id} value={value} onChange={onChange}>
                {options.map((option) => {
                    return <option value={option.value} key={option.value}>{option.text}</option>
                })}
            </select>
        </fieldset>
    );
}

Select.propTypes = {
    id: PropTypes.string,
    label: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.array,
    onChange: PropTypes.func
};
  