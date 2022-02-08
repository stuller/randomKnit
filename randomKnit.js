
let typeEl, titleEl, headerTitleEl, mirrorHEl, mirrorVEl, enableTileEl, mcEl, ccEl, cc2El, stitchesEl, rowsEl, pageConfig, stitchConfig, rowConfig;

window.onpopstate = function(event) {
    if(event.state.hasOwnProperty('url') && event.state.url !== window.location.href) {
        window.location.href = event.state.url;
    }

};
window.addEventListener('load', () => {

    typeEl = document.getElementById('type');
    titleEl = document.getElementById('title');
    headerTitleEl = document.getElementById('headerTitle');
    mirrorHEl = document.getElementById('mirrorH');
    mirrorVEl = document.getElementById('mirrorV');
    enableTileEl = document.getElementById('enableTile');
    mcEl = document.getElementById('mc');
    ccEl = document.getElementById('cc');
    cc2El = document.getElementById('cc2');
    stitchesEl = document.getElementById('stitches');
    rowsEl = document.getElementById('rows');
    
    stitchConfig = stitchesEl.value;
    rowConfig = rowsEl.value;

    document.getElementById('create').addEventListener('click', handleCreate);
    document.getElementById('randomize').addEventListener('click', handleCreate);
    document.getElementById('download').addEventListener('click', convertHTMLToPDF)
    document.getElementById('rotateTile').addEventListener('click', handleRotate);
    document.getElementById('reset').addEventListener('click', () => {
        window.location.href = window.location.pathname;
    })
    titleEl.addEventListener('change', (e) => {
        document.getElementById('chartLink').innerText = e.target.value;
    });
    
    mirrorHEl.addEventListener('change', updatePreview);
    mirrorVEl.addEventListener('change', updatePreview);
    enableTileEl.addEventListener('change', updatePreview);
    mcEl.addEventListener('change', updatePreview);
    ccEl.addEventListener('change', updatePreview);
    cc2El.addEventListener('change', updatePreview);
    titleEl.addEventListener('change', updatePreview);

    const searchParams = new URLSearchParams(document.location.search);
    pageConfig = Object.fromEntries(searchParams)
    
    typeEl.value = pageConfig.type ? pageConfig.type : typeEl.value;
    titleEl.value = pageConfig.title ? pageConfig.title : titleEl.value;
    stitchesEl.value = pageConfig.stitches ? pageConfig.stitches : stitchesEl.value;
    rowsEl.value = pageConfig.rows ? pageConfig.rows : rowsEl.value;
    enableTileEl.checked = pageConfig.enableTile ? pageConfig.enableTile === 'true' ? true : false  : enableTileEl.value;
    mirrorHEl.checked = pageConfig.mirrorH ? pageConfig.mirrorH === 'true' ? true : false : mirrorHEl.value;
    mirrorVEl.checked = pageConfig.mirrorV ? pageConfig.mirrorV === 'true' ? true : false : mirrorVEl.value;
    

    mcEl.value = pageConfig.mc ? pageConfig.mc : mcEl.value;
    ccEl.value = pageConfig.cc ? pageConfig.cc : ccEl.value;
    cc2El.value = pageConfig.cc2 ? pageConfig.cc2 : cc2El.value;

    handleCreate(true);
})

const getConfig = () => {
    return {
        type: typeEl.value,
        rows: rowConfig,
        stitches: stitchConfig,
        tile: document.getElementById('tile'),
        preview: document.getElementById('preview'),
        mirrorH: mirrorHEl.checked,
        mirrorV: mirrorVEl.checked,
        enableTile: enableTileEl.checked,
        mc: mcEl.value,
        cc: ccEl.value,
        cc2: cc2El.value,
        title: titleEl.value
    }
}

const updatePreview = () => {
    const {type, rows, stitches, tile, mirrorH, mirrorV, enableTile, mc, cc, cc2} = getConfig();
    preview.innerHTML = '';
    updateTileColors(mc, cc, cc2);
    addTilesToPreview(tile, enableTile, mirrorH, mirrorV)
    createChart(type, tile, enableTile, mirrorH, mirrorV, rows, stitches);
    updateUrl();
}

const handleCreate = (firstLoad=false) => {
    stitchConfig = stitchesEl.value;
    rowConfig = rowsEl.value;
    const {rows, stitches, mirrorH, mirrorV, enableTile, mc, cc, cc2, type} = getConfig();
    document.getElementById('chartLink').innerText = `${titleEl.value}`
    clearDiv('tile');
    clearDiv('preview');
    validateConfig(rows, stitches, 'configErrors');
    const tile = createTile(rows, stitches, mc, cc, cc2, type, firstLoad);
    addTilesToPreview(tile, enableTile, mirrorH, mirrorV);
    createChart(type, tile, enableTile, mirrorH, mirrorV, rows, stitches);
}

const handleRotate = () => {
    const {rows, stitches} = getConfig();
    if(pageConfig.hasOwnProperty('tileData')) {
        const parsedTileData = pageConfig.tileData.split('-').map(row => row.split(''));
        const newRows = +stitches;
        const newStitches = +rows;
        const newTile = [];
        for(let row = 0; row < newRows; row++) {
            const newRow = [];
            for(let stitch = newStitches; stitch > 0; stitch--) {
                newRow.push(parsedTileData[stitch - 1][row])
            }
            newTile.push(newRow);
            
        }
        const newTileData = newTile.map(a => a.join('')).join('-');
        stitchesEl.value = newStitches;
        rowsEl.value = newRows;
        pageConfig.tileData = newTileData;
        rowConfig = newRows;
        stitchConfig = newStitches;
        handleCreate(true)
        
    } else {
        return;
    }
}

const createDivAndAppend = (id, className, parentId, color) => {
    const {mc, cc, cc2} = getConfig();
    const newDiv = document.createElement('div');
    const parentDiv = document.getElementById(parentId)
    newDiv.setAttribute('id', id);
    newDiv.className = className;
    if(color) {
        newDiv.style.backgroundColor = color;
        newDiv.className = color === mc ? 'stitch mc' : color === cc ? 'stitch cc' : 'stitch cc2'
    }
    parentDiv.appendChild(newDiv);
    return newDiv;
}

const validateConfig = (rows, stitches, errorDivId) => {
    const errorDiv = document.getElementById(errorDivId);
    let errors = '';
    if(!rows) {
        errors += 'Please enter number of rows<br/>'
    }
    if(!stitches) {
        errors += 'Please enter number of stitches<br/>'
    }
    errorDiv.innerHTML = errors;
}

const createTile = (rows, stitches, mc, cc, cc2, type, firstLoad=false) => {
    let bgColor = mc;
    let parsedTileData;
    if(pageConfig.hasOwnProperty('tileData') && firstLoad === true) {
        parsedTileData = pageConfig.tileData.split('-').reverse().map(row => row.split('').reverse())
    } else {
        parsedTileData = createTileData(rows, stitches, type)
    }
    for(let i = rows; i > 0; i--) {
        createDivAndAppend(`row-${i}`, 'row', 'tile');
        for(let j = stitches; j > 0; j--) {
            bgColor = +parsedTileData[i-1][j-1]  === 0 ? mc : +parsedTileData[i-1][j-1] === 1 ? cc : cc2;
            createDivAndAppend(`stitch-${j}`, 'stitch', `row-${i}`, bgColor);
        }
    }
    return document.getElementById('tile');
}

const createTileData = (rows, stitches, type) => {
    const tileData = [];
    for(let i = rows; i > 0; i--) {
        const row = [];
        if(type === '3-color-fair-isle') {
            const colors = [0,1,2];
            const randomizedColors = colors.sort(() => 0.5 - Math.random());
            fi1 = randomizedColors[0];
            fi2 = randomizedColors[1];
        }
        for(let j = stitches; j > 0; j--) {
            let bgColor;
            if(type === '3-color-stranded') {
                bgColor = Math.floor(Math.random() * 3);
            } else if(type === '2-color') {
                bgColor = Math.floor(Math.random() * 2);
            } else { //fair isle
                const random = Math.floor(Math.random() * 2);
                bgColor =  random === 0 ? fi1 : fi2;
            }
            
            row.push(bgColor);
        }
        tileData.push(row);
    }
    return tileData;
}

const updateTileColors = (mc, cc, cc2) => {
    document.querySelectorAll('#tile .stitch').forEach(stitch => {
        stitch.style.backgroundColor = stitch.className.includes('mc') ? mc : stitch.className.includes('cc2') ? cc2 : cc;
    });
}

const createChart = (type, tile, enableTile, mirrorH, mirrorV, rows, stitches) => {
    const chart = document.getElementById('chart');
    chart.innerHTML = '';
    chart.className = '';
    const tile0 = document.getElementById('tile-0').cloneNode('deep');
    tile0.id = 'chart-tile-0';
    chart.appendChild(tile0);
    const chartStitches = mirrorH && enableTile ? stitches * 2 : stitches;
    const chartRows = mirrorV && enableTile ? rows * 2 : rows;
    const mirrorRow = Math.floor(50/stitches) % 2 ? Math.floor(50/stitches) + 1 : Math.floor(50/stitches);

    if(enableTile) {
        if(mirrorH) {
            chart.className = 'grid-col-2'
            const tile1 = document.getElementById('tile-1').cloneNode('deep');
            tile1.id = 'chart-tile-1';
            chart.appendChild(tile1);
        }
        if(mirrorV) {
            const tile2 = document.getElementById(`tile-${mirrorRow}`).cloneNode('deep');
            tile2.id = 'chart-tile-2';
            chart.appendChild(tile2);
        }
        if(mirrorV && mirrorH) {
            const tile3 = document.getElementById(`tile-${mirrorRow + 1}`).cloneNode('deep');
            tile3.id = 'chart-tile-3';
            chart.appendChild(tile3);
        }
    }
    

    createDivAndAppend('stitchLabels', mirrorH ? 'span-2' : 'span-1', 'chart');
    createStitchLabels(chartStitches);
    createRowLabels(chartRows, mirrorH, enableTile)
    updateUrl();
    
}

const clearDiv = (id) => {
    document.getElementById(id).innerHTML = '';
}



const createRowLabels = (numberOfRows, mirrorH, enableTile) => {
    const chart = document.getElementById('chart');
    const rowLabels = document.createElement('div');
    const rightMostTile = mirrorH && enableTile ? document.getElementById('chart-tile-1') : document.getElementById('chart-tile-0');
    rowLabels.id = 'rowLabels'
    rightMostTile.insertAdjacentElement('afterend',rowLabels)
    for(let j = numberOfRows; j > 0; j--) {
        const rowLabel = createDivAndAppend(`rowNumber-${j}`, 'chartLabel', 'rowLabels');
        rowLabel.innerHTML = j;
        rowLabels.appendChild(rowLabel);
    }
    
}

const createStitchLabels = (numberOfStitches) => {
    for(let j = numberOfStitches; j > 0; j--) {
        const stitchLabel = createDivAndAppend(`stitchNumber-${j}`, 'chartLabel', 'stitchLabels');
        stitchLabel.innerHTML = j;
    }
}

const addTilesToPreview = (tile, enableTile, mirrorH, mirrorV) => {
    const stitches = document.getElementById('stitches').value;
    const stitchRepeats = Math.floor(50/stitches) % 2 ? Math.floor(50/stitches) + 1 : Math.floor(50/stitches);
    const numberOfTiles = enableTile ? stitchRepeats * stitchRepeats : 1;
    const preview = document.getElementById('preview');
    for(let i = 0; i < numberOfTiles; i++) {
        const newTile = tile.cloneNode('deep');
        newTile.id = `tile-${i}`;
        newTile.className = 'tile';
        newTile.setAttribute('data-tileNumber', i);
        const rowNumber = Math.floor(i/stitchRepeats);
        newTile.setAttribute('data-rowNumber', rowNumber);
        if(mirrorH && i % 2) {
            newTile.classList.add('mirrorH')
        }
        
        if(mirrorV && rowNumber % 2) {
            newTile.classList.add('mirrorV')
        }
        newTile.querySelectorAll('div').forEach(div => {
            div.setAttribute('data-id', div.id);
            div.removeAttribute('id')
        })
        preview.appendChild(newTile);
    }
    preview.style.gridTemplateColumns = `repeat(${stitchRepeats}, 1fr)`
}

const updateUrl = () => {
    const {type, rows, stitches, mirrorH, mirrorV, enableTile, mc, cc, cc2, title} = getConfig();
    const tileData = getCurrentTileData();
    const url =`${window.location.pathname}?type=${type}&title=${encodeURIComponent(title)}&rows=${rows}&stitches=${stitches}&mirrorH=${mirrorH}&mirrorV=${mirrorV}&enableTile=${enableTile}&mc=${encodeURIComponent(mc)}&cc=${encodeURIComponent(cc)}&cc2=${encodeURIComponent(cc2)}&tileData=${tileData}`;
    window.history.pushState({url: window.location.href}, title, url);
    const searchParams = new URLSearchParams(document.location.search);
    pageConfig = Object.fromEntries(searchParams)
    document.getElementById('chartLink').setAttribute('href', url);
}

const getCurrentTileData = () => {
    const {tile} = getConfig();
    const tileData = Array.from(tile.querySelectorAll('.row')).map(row => {
        return Array.from(row.querySelectorAll('.stitch')).map(stitch => stitch.className.includes('mc') ? 0 : stitch.className.includes('2') ? 2 : 1).join('')
    }).join('-')
    return tileData;
}

function convertHTMLToPDF() {
    const options = {
        enableLinks:true,
        jsPDF: { orientation: 'p'},
        html2canvas:  { width: 1400},
    }
    var element = document.getElementById('container');
    var worker = html2pdf().set(options).from(element).save(`${document.getElementById('chartLink').innerText.replaceAll(/\s/gi, '-')}.pdf`);

}

