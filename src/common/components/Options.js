import * as React from 'react'
import PropTypes, { bool } from 'prop-types';
import Header from './Header';
import Checkbox from './Checkbox';
import ColorPicker from './ColorPicker';

export default function Options(props) {
    const {mirrorH, setMirrorH, mirrorV, setMirrorV, mc, setMc, cc, setCc, cc2, setCc2, type} = props;

    return (
        <>
            <Header text="Options" element="h2"/>
            <Checkbox label="Mirror H:" id="mirrorH" checked={mirrorH} onChange={setMirrorH}/>
            <Checkbox label="Mirror V:" id="mirrorV" checked={mirrorV} onChange={setMirrorV}/>
            <ColorPicker label="MC:" id="mc" value={mc} onBlur={setMc}/>
            <ColorPicker label="CC:" id="cc" value={cc} onBlur={setCc}/>
            { type !== '2-color' &&
                <ColorPicker label="CC 2:" id="cc2" value={cc2} onBlur={setCc2}/>
            }
        </>
    )
}

Options.propTypes = {
    mirrorH: PropTypes.bool,
    setMirrorH: PropTypes.func,
    mirrorV: PropTypes.bool,
    setMirrorV: PropTypes.func,
    mc: PropTypes.string,
    setMc: PropTypes.func,
    cc: PropTypes.string,
    setCc: PropTypes.func,
    cc2: PropTypes.string,
    setCc2: PropTypes.func,
    type: PropTypes.string
};
  