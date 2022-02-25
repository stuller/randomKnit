// Tile utils
export const createTileData = (rows, stitches, type) => {
    const tileData = [];
    for(let i = rows; i > 0; i--) {
        const row = [];
        let fi1, fi2;
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

export const rotateTileData = (tileData) => {
    const rows = tileData.length;
    const stitches = tileData[0].length;
    const newTile = [];
    for(let row = 0; row < stitches; row++) {
        const newRow = [];
        for(let stitch = rows; stitch > 0; stitch--) {
            newRow.push(tileData[stitch - 1][row])
        }
        newTile.push(newRow);
    }
    return newTile;
}

export const flipTileDataH = (tileData) => {
    const flippedTileData = decodeTileData(tileData).map(row => row.reverse());
    return (encodeTileData(flippedTileData));
}

export const flipTileDataV = (tileData) => {
    const flippedTileData = decodeTileData(tileData).reverse();
    return (encodeTileData(flippedTileData));
}

export const decodeTileData = (tileData) => {
    return tileData.split('-').map(row => row.split(''));
};

export const encodeTileData = (tileData) => {
    return tileData.map(row => row.join('')).join('-')
}




// pdf utils
export const handleDownloadChart = () => {
    const options = {
        enableLinks:true,
        jsPDF: { orientation: 'p'},
        html2canvas:  { width: 1400},
    }
    var element = document.getElementById('container');
    var worker = html2pdf().set(options).from(element).save(`${document.querySelector('#chartInfo h2').innerText.replaceAll(/\s/gi, '-')}.pdf`);

}