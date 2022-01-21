let chartCount = 0;

window.addEventListener('load', () => {

    document.getElementById('create').addEventListener('click', handleCreate);
    document.getElementById('download').addEventListener('click', convertHTMLToPDF)
    document.getElementById('title').addEventListener('change', (e) => {
        document.getElementById('headerTitle').innerText = e.target.value;
        chartCount = 0;
    });
    

    document.getElementById('mirrorH').addEventListener('change', updatePreview);
    document.getElementById('mirrorV').addEventListener('change', updatePreview);
    document.getElementById('enableTile').addEventListener('change', updatePreview);
})

const getConfig = () => {
    return {
        rows: +document.getElementById('rows').value,
        stitches: +document.getElementById('stitches').value,
        tile: document.getElementById('tile'),
        preview: document.getElementById('preview'),
        mirrorH: document.getElementById('mirrorH').checked,
        mirrorV: document.getElementById('mirrorV').checked,
        enableTile: document.getElementById('enableTile').checked,
        mc: document.getElementById('mc').value,
        cc: document.getElementById('cc').value
    }
}

const updatePreview = () => {
    const {rows, stitches, tile, mirrorH, mirrorV, enableTile} = getConfig();
    preview.innerHTML = '';
    addTilesToPreview(tile, enableTile, mirrorH, mirrorV)
    createChart(tile, enableTile, mirrorH, mirrorV, rows, stitches)
}

const handleCreate = () => {
    chartCount++;
    const {rows, stitches, mirrorH, mirrorV, enableTile, mc, cc} = getConfig();
    document.getElementById('headerTitle').innerText = `${document.getElementById('title').value}-${chartCount}`
    clearDiv('tile');
    clearDiv('preview');
    validateConfig(rows, stitches, 'configErrors');
    const tile = createTile(rows, stitches, mc, cc);
    addTilesToPreview(tile, enableTile, mirrorH, mirrorV);
    createChart(tile, enableTile, mirrorH, mirrorV, rows, stitches);
}


const createDivAndAppend = (id, className, parentId, mc) => {
    const newDiv = document.createElement('div');
    const parentDiv = document.getElementById(parentId)
    newDiv.setAttribute('id', id);
    newDiv.className = className;
    if(mc) {
        newDiv.style.backgroundColor = mc;
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

const createTile = (rows, stitches, mc, cc) => {
    let bgColor = mc;
    for(let i = rows; i > 0; i--) {
        createDivAndAppend(`row-${i}`, 'row', 'tile');
        for(let j = stitches; j > 0; j--) {
            bgColor = Math.round(Math.random(2)) ? mc : cc;
            createDivAndAppend(`stitch-${j}`, 'stitch', `row-${i}`, bgColor);
        }
    }
    return document.getElementById('tile');
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
    console.log(stitches)
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
