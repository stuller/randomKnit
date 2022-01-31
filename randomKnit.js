
let titleEl, headerTitleEl, mirrorHEl, mirrorVEl, enableTileEl, mcEl, ccEl, stitchesEl, rowsEl, pageConfig, stitchConfig, rowConfig;

window.addEventListener('load', () => {


    titleEl = document.getElementById('title');
    headerTitleEl = document.getElementById('headerTitle');
    mirrorHEl = document.getElementById('mirrorH');
    mirrorVEl = document.getElementById('mirrorV');
    enableTileEl = document.getElementById('enableTile');
    mcEl = document.getElementById('mc');
    ccEl = document.getElementById('cc');
    stitchesEl = document.getElementById('stitches');
    rowsEl = document.getElementById('rows');
    
    stitchConfig = stitchesEl.value;
    rowConfig = rowsEl.value;

    document.getElementById('create').addEventListener('click', handleCreate);
    document.getElementById('randomize').addEventListener('click', handleCreate);
    document.getElementById('download').addEventListener('click', convertHTMLToPDF)
    titleEl.addEventListener('change', (e) => {
        headerTitleEl.innerText = e.target.value;
    });
    
    mirrorHEl.addEventListener('change', updatePreview);
    mirrorVEl.addEventListener('change', updatePreview);
    enableTileEl.addEventListener('change', updatePreview);
    mcEl.addEventListener('change', updatePreview);
    ccEl.addEventListener('change', updatePreview);
    titleEl.addEventListener('change', updatePreview);

    const searchParams = new URLSearchParams(document.location.search);
    pageConfig = Object.fromEntries(searchParams)
    
    titleEl.value = pageConfig.title ? pageConfig.title : titleEl.value;
    stitchesEl.value = pageConfig.stitches ? pageConfig.stitches : stitchesEl.value;
    rowsEl.value = pageConfig.rows ? pageConfig.rows : rowsEl.value;
    enableTileEl.checked = pageConfig.enableTile ? pageConfig.enableTile === 'true' ? true : false  : enableTileEl.value;
    mirrorHEl.checked = pageConfig.mirrorH ? pageConfig.mirrorH === 'true' ? true : false : mirrorHEl.value;
    mirrorVEl.checked = pageConfig.mirrorV ? pageConfig.mirrorV === 'true' ? true : false : mirrorVEl.value;
    

    ccEl.value = pageConfig.cc ? pageConfig.cc : ccEl.value;
    mcEl.value = pageConfig.mc ? pageConfig.mc : mcEl.value;

    handleCreate(true);
})

const getConfig = () => {
    return {
        rows: rowConfig,
        stitches: stitchConfig,
        tile: document.getElementById('tile'),
        preview: document.getElementById('preview'),
        mirrorH: mirrorHEl.checked,
        mirrorV: mirrorVEl.checked,
        enableTile: enableTileEl.checked,
        mc: mcEl.value,
        cc: ccEl.value,
        title: titleEl.value
    }
}

const updatePreview = () => {
    const {rows, stitches, tile, mirrorH, mirrorV, enableTile, mc, cc} = getConfig();
    preview.innerHTML = '';
    updateTileColors(mc, cc);
    addTilesToPreview(tile, enableTile, mirrorH, mirrorV)
    createChart(tile, enableTile, mirrorH, mirrorV, rows, stitches);
    updateUrl();
}

const handleCreate = (firstLoad=false) => {
    stitchConfig = stitchesEl.value;
    rowConfig = rowsEl.value;
    const {rows, stitches, mirrorH, mirrorV, enableTile, mc, cc} = getConfig();
    document.getElementById('headerTitle').innerText = `${titleEl.value}`
    clearDiv('tile');
    clearDiv('preview');
    validateConfig(rows, stitches, 'configErrors');
    const tile = createTile(rows, stitches, mc, cc, firstLoad);
    addTilesToPreview(tile, enableTile, mirrorH, mirrorV);
    createChart(tile, enableTile, mirrorH, mirrorV, rows, stitches);
}


const createDivAndAppend = (id, className, parentId, color) => {
    const {mc} = getConfig();
    const newDiv = document.createElement('div');
    const parentDiv = document.getElementById(parentId)
    newDiv.setAttribute('id', id);
    newDiv.className = className;
    if(color) {
        newDiv.style.backgroundColor = color;
        newDiv.style.borderColor = color === '#ffffff' ? '#bbb' : '#fff'
        newDiv.className = color === mc ? 'stitch mc' : 'stitch cc'
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

const createTile = (rows, stitches, mc, cc, firstLoad=false) => {
    console.log(firstLoad)
    let bgColor = mc;
    let parsedTileData;
    if(pageConfig.hasOwnProperty('tileData')) {
        parsedTileData = pageConfig.tileData.split('-').reverse().map(row => row.split('').reverse())
    }
    for(let i = rows; i > 0; i--) {
        createDivAndAppend(`row-${i}`, 'row', 'tile');
        for(let j = stitches; j > 0; j--) {
            if(firstLoad === true && parsedTileData) {
                bgColor = +parsedTileData[i-1][j-1]  === 0 ? mc : cc;
            } else {
                bgColor = Math.round(Math.random(2)) ? mc : cc;
            }
            createDivAndAppend(`stitch-${j}`, 'stitch', `row-${i}`, bgColor);
        }
    }
    console.log(getConfig())
    return document.getElementById('tile');
}

const updateTileColors = (mc, cc) => {
    document.querySelectorAll('#tile .stitch').forEach(stitch => {
        stitch.style.backgroundColor = stitch.className.includes('mc') ? mc : cc;
    });
}

const createChart = (tile, enableTile, mirrorH, mirrorV, rows, stitches) => {
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
    const {rows, stitches, mirrorH, mirrorV, enableTile, mc, cc, title} = getConfig();
    const tileData = getCurrentTileData();
    const url =`${window.location.pathname}?title=${encodeURIComponent(title)}&rows=${rows}&stitches=${stitches}&mirrorH=${mirrorH}&mirrorV=${mirrorV}&enableTile=${enableTile}&mc=${encodeURIComponent(mc)}&cc=${encodeURIComponent(cc)}&tileData=${tileData}`;
    window.history.pushState('', title, url);
}

const getCurrentTileData = () => {
    const {tile} = getConfig();
    const tileData = Array.from(tile.querySelectorAll('.row')).map(row => {
        return Array.from(row.querySelectorAll('.stitch')).map(stitch => stitch.className.includes('mc') ? 0 : 1).join('')
    }).join('-')
    return tileData;
}

function convertHTMLToPDF() {
    const { jsPDF } = window.jspdf;

    var doc = new jsPDF('l', 'mm', [1200, 1810]);
    var pdfjs = document.querySelector('#container');

    doc.html(pdfjs, {
        callback: function(doc) {
            doc.save(`${document.getElementById('headerTitle').innerHTML.replaceAll(/\s/gi, '-')}.pdf`);
        },
        x: 10,
        y: 10
    });

}

