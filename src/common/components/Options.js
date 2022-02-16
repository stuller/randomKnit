import * as React from 'react'
import PropTypes, { bool } from 'prop-types';
import Header from './Header';
import Checkbox from './Checkbox';
import ColorPicker from './ColorPicker';

export default function Options(props) {
    const {enableTile, setEnableTile, mirrorH, setMirrorH, mirrorV, setMirrorV, mc, setMc, cc, setCc, cc2, setCc2} = props;

    return (
        <div id="options">
            <Header text="Options" component="h2"/>
            <Checkbox label="Tile:" id="enableTile" checked={enableTile} onChange={setEnableTile}/>
            <Checkbox label="Mirror Horizontal:" id="mirrorH" checked={mirrorH} onChange={setMirrorH}/>
            <Checkbox label="Mirror Vertical:" id="mirrorV" checked={mirrorV} onChange={setMirrorV}/>
            <ColorPicker label="Main Color:" id="mc" value={mc} onChange={setMc}/>
            <ColorPicker label="Contrast Color:" id="cc" value={cc} onChange={setCc}/>
            <ColorPicker label="Contrast Color 2:" id="cc2" value={cc2} onChange={setCc2}/>
            
        </div>
    )
}

Options.propTypes = {
    enableTile: bool,
    setEnableTile: PropTypes.func,
    mirrorH: PropTypes.bool,
    setMirrorH: PropTypes.func,
    mirrorV: PropTypes.bool,
    setMirrorV: PropTypes.func,
    mc: PropTypes.string,
    setMc: PropTypes.func,
    cc: PropTypes.string,
    setCc: PropTypes.func,
    cc2: PropTypes.string,
    setCc2: PropTypes.func
};
  