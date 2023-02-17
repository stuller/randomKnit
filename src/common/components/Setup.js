import * as React from 'react'
import PropTypes from 'prop-types';
import Header from './Header';
import TextInput from './TextInput';
import NumberInput from './NumberInput';
import Select from './Select';

export default function Setup(props) {
    const {title, setTitle, currentType, typeOptions, setType, rows, setRows, stitches, setStitches} = props;
    const typeTooltip = `What's the difference between Three color stranded and Three color fair isle?
    
Three color stranded can have 3 colors in one row, while Three color fair isle will limit the row to 2 colors but will have 3 colors throughout the chart.`

    return (
        <React.Fragment>
            <Header text="Basic setup" element="h2"/>
            <TextInput label="Title:" id="title" value={title} onBlur={setTitle}/>
            <Select label="Type:" id="type" value={currentType} options={typeOptions} onChange={setType} tooltip={typeTooltip}/>
            <NumberInput label="Rows:" id="rows" value={rows} onBlur={setRows}/>
            <NumberInput label="Stitches:" id="stitches" value={stitches} onBlur={setStitches}/>
            
        </React.Fragment>
    )
}

Setup.propTypes = {
    title: PropTypes.string,
    setTitle: PropTypes.func,
    currentType: PropTypes.string,
    setType: PropTypes.func,
    typeOptions: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)) ,
    rows: PropTypes.number,
    setRows: PropTypes.func,
    stitches: PropTypes.number,
    setStitches: PropTypes.func
};
  