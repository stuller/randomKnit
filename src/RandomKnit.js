import * as React from 'react'
import {
    useQueryParams,
    StringParam,
    BooleanParam,
    NumberParam,
    withDefault
  } from 'use-query-params';
import { useLocation } from 'react-router-dom';
import {CONFIG} from './common/CONFIG';
import Header from './common/components/Header';
import Setup from './common/components/Setup';
import Options from './common/components/Options';
import Tile from './common/components/Tile';
import Chart from './common/components/Chart';
import Preview from './common/components/Preview';
import Tooltip from './common/components/Tooltip';
import {createTileData,  decodeTileData, encodeTileData, flipTileDataH, flipTileDataV, handleDownloadChart, rotateTileData} from './common/utils';


export default function RandomKnit() {
    const location = useLocation();
    const [url, setUrl] = React.useState('/')

    const [search, setSearch] = useQueryParams({
        type: withDefault(StringParam, CONFIG.type),
        title: withDefault(StringParam, CONFIG.title),
        rows: withDefault(NumberParam, CONFIG.rows),
        stitches: withDefault(NumberParam, CONFIG.stitches),
        mirrorH: withDefault(BooleanParam, CONFIG.mirrorH),
        mirrorV: withDefault(BooleanParam, CONFIG.mirrorV),
        mc: withDefault(StringParam, CONFIG.mc),
        cc: withDefault(StringParam, CONFIG.cc), 
        cc2: withDefault(StringParam, CONFIG.cc2),
        tileData: withDefault(StringParam, CONFIG.tileData)
      });

    const typeOptions = CONFIG.typeOptions;
    const {type, title, rows, stitches, mirrorH, mirrorV, mc, cc, cc2, tileData} = search;

    const handleCreateTile = () => {
        setSearch({tileData: encodeTileData(createTileData(rows, stitches, type))})
    }

    const handleRotate = () => {
        const newTileData = rotateTileData(decodeTileData(tileData));
        const has3ColorRows = newTileData.some(row => {
            const rowSet = new Set(row);
            return rowSet.size === 3;
        })
        const newType = has3ColorRows && type === '3-color-fair-isle' ? '3-color-stranded' : type
        setSearch({
            stitches: newTileData[0].length,
            rows: newTileData.length,
            tileData: encodeTileData(newTileData),
            type: newType
        });
    } 

    const handleFlipTileH = () => {
        setSearch({tileData: flipTileDataH(tileData)});
    }

    const handleFlipTileV = () => {
        setSearch({tileData: flipTileDataV(tileData)});
    }
    
    
    
    React.useEffect(() => {
        document.title = `JSKnit Chart: ${title}`;
        setUrl(`${location.pathname}${location.search}`)
    }, [type, title, rows, stitches, mirrorH, mirrorV, mc, cc, cc2, tileData]);

    return (
        <React.Fragment>
            <Header text="Random Knit" element="h1"/>
            <Setup
                title = {title} setTitle = {(e) => setSearch({title: e.target.value})}
                currentType = {type} typeOptions = {typeOptions} setType = {(e) => setSearch({type: e.target.value})}
                rows = {+rows} setRows = {(e) => setSearch({rows: +e.target.value})}
                stitches = {+stitches} setStitches = {(e) => setSearch({stitches: +e.target.value})}
            />

            <button onClick={handleCreateTile}>Create Chart</button>
            <button onClick={handleDownloadChart}>Download Chart</button>

            <hr/>
            <div className="col-2">
                <Options
                    mirrorH = {mirrorH} setMirrorH = {(e) => setSearch({mirrorH: e.target.checked})}
                    mirrorV = {mirrorV} setMirrorV = {(e) => setSearch({mirrorV: e.target.checked})}
                    mc = {mc} setMc = {(e) => setSearch({mc: e.target.value})}
                    cc = {cc} setCc = {(e) => setSearch({cc: e.target.value})}
                    cc2 = {cc2} setCc2 = {(e) => setSearch({cc2: e.target.value})}
                    type = {type}
                />
                
                <div data-testid="tile">
                    <Tile 
                        mc = {mc} 
                        cc = {cc}
                        cc2 = {cc2} 
                        tileData = {decodeTileData(tileData)} 
                        testId = 'tile'
                    />
                    <button onClick={handleRotate}>Rotate Tile</button>
                    {type === '3-color-fair-isle' && 
                        <Tooltip text="Rotating a fair isle tile may result in more than 2 colors per row." symbol="!" testId="rotateWarning"/>
                    }
                    <button onClick={handleFlipTileH}>Flip Tile Horizontally</button>
                    <button onClick={handleFlipTileV}>Flip Tile Vertically</button>
                </div>
                
            </div>
            

            <hr/>

            <Header text="Chart" element="h1"/>
            <div id="container">
                <div id="chartInfo">
                    <Header text={title} element="h2" href={url}/>
                </div>
                <Chart 
                    tileData = {decodeTileData(tileData)} 
                    mc={mc} cc={cc} cc2={cc2}
                    mirrorH = {mirrorH} 
                    mirrorV = {mirrorV}
                    displayLabels = {true}
                    testId = 'chart'
                />
                <Preview 
                    tileData = {decodeTileData(tileData)} 
                    mc={mc} cc={cc} cc2={cc2}
                    mirrorH = {mirrorH} 
                    mirrorV = {mirrorV}
                    testId = 'preview'
                />
            </div>
            
        </React.Fragment>
    )
}