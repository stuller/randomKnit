import * as React from 'react'
import PropTypes from 'prop-types';
import Header from './Header';
import TextInput from './TextInput';
import NumberInput from './NumberInput';
import Select from './Select';

export default function Setup(props) {
    const {title, setTitle, currentType, typeOptions, setType, rows, setRows, stitches, setStitches} = props;

    return (
        <React.Fragment>
            <Header text="Basic setup" component="h2"/>

            <TextInput label="Title:" id="title" value={title} onChange={setTitle}/>
            <Select label="Type:" id="type" value={currentType} options={typeOptions} onChange={setType}/>
            <NumberInput label="Rows:" id="rows" value={rows} onChange={setRows}/>
            <NumberInput label="Stitches:" id="stitches" value={stitches} onChange={setStitches}/>
            
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
  