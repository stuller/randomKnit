

window.addEventListener('load', () => {

    document.getElementById('create').addEventListener('click', handleCreate);
    document.getElementById('download').addEventListener('click', convertHTMLToPDF)
    document.getElementById('title').addEventListener('change', (e) => {
        document.getElementById('headerTitle').innerText = e.target.value;
    });
})



const handleCreate = () => {
    const rows = +document.getElementById('rows').value;
    const stitches = +document.getElementById('stitches').value;
    const enableTile = document.getElementById('enableTile').checked;
    const mc = document.getElementById('mc').value;
    const cc = document.getElementById('cc').value;
    
    clearDiv('tile');
    clearDiv('chart');
    validateConfig(rows, stitches, 'configErrors');
    const tile = createTile(rows, stitches, mc, cc, 'random');
    addTilesToChart(tile, enableTile);
    randomizeChart(rows, stitches, tile, mc, cc)
}


const createDivAndAppend = (id, className, parentId, mc) => {
    const newDiv = document.createElement('div');
    const parentDiv = document.getElementById(parentId)
    newDiv.id = id;
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

const createTile = (rows, stitches, mc, cc, type) => {
    let bgColor = mc;
    for(let i = rows; i > 0; i--) {
        createDivAndAppend(`row-${i}`, 'row', 'tile');
        for(let j = stitches; j > 0; j--) {
            if(type === 'random') {
                bgColor = Math.round(Math.random(2)) ? mc : cc;
            }
            createDivAndAppend(`stitch-${j}`, 'stitch', `row-${i}`, bgColor);
        }
        createRowLabel(i);
    }
    createDivAndAppend('stitchLabels', '', 'tile');
    createStitchLabels(stitches);
    return document.getElementById('tile');
}

const clearDiv = (id) => {
    document.getElementById(id).innerHTML = '';
}

const randomizeChart = (rows, stitches, baseRepeat, mc, cc) => {
    let firstRowStitches = document.querySelectorAll('#row-0 .stitch');

    firstRowStitches.forEach((stitch, index) => {
        if(!index % baseRepeat) {
            stitch.style.backgroundColor = cc;
        }
    })

}


const createRowLabel = (rowNumber) => {
    const rowLabel = createDivAndAppend(`rowNumber-${rowNumber}`, 'chartLabel', `row-${rowNumber}`);
    rowLabel.innerHTML = rowNumber;
}

const createStitchLabels = (numberOfStitches) => {
    for(let j = numberOfStitches; j > 0; j--) {
        const stitchLabel = createDivAndAppend(`rowNumber-${j}`, 'chartLabel', 'stitchLabels');
        stitchLabel.innerHTML = j;
    }
}

const addTilesToChart = (tile, enableTile) => {
    console.log(enableTile)
    const numberOfTiles = enableTile ? 16 : 1;
    const chart = document.getElementById('chart');
    for(let i = 0; i < numberOfTiles; i++) {
        const newTile = tile.cloneNode('deep');
        newTile.id = `tile-${i}`;
        chart.appendChild(newTile);
    }
}

const saveAsPDF = () => {
    const { jsPDF } = window.jspdf;
    var doc = new jsPDF();
    console.log(doc)
    doc.html(`<html><${document.body}></html>`);
    doc.save('div.pdf');
}

function Convert_HTML_To_PDF() {
    var elementHTML = document.getElementById('tile');
  
    html2canvas(elementHTML, {
      useCORS: true,
      onrendered: function(canvas) {
        var pdf = new jsPDF('p', 'pt', 'letter');
  
        var pageHeight = 980;
        var pageWidth = 900;
        for (var i = 0; i <= elementHTML.clientHeight / pageHeight; i++) {
          var srcImg = canvas;
          var sX = 0;
          var sY = pageHeight * i; // start 1 pageHeight down for every new page
          var sWidth = pageWidth;
          var sHeight = pageHeight;
          var dX = 0;
          var dY = 0;
          var dWidth = pageWidth;
          var dHeight = pageHeight;
  
          window.onePageCanvas = document.createElement("canvas");
          onePageCanvas.setAttribute('width', pageWidth);
          onePageCanvas.setAttribute('height', pageHeight);
          var ctx = onePageCanvas.getContext('2d');
          ctx.drawImage(srcImg, sX, sY, sWidth, sHeight, dX, dY, dWidth, dHeight);
  
          var canvasDataURL = onePageCanvas.toDataURL("image/png", 1.0);
          var width = onePageCanvas.width;
          var height = onePageCanvas.clientHeight;
  
          if (i > 0) // if we're on anything other than the first page, add another page
            pdf.addPage(612, 864); // 8.5" x 12" in pts (inches*72)
  
          pdf.setPage(i + 1); // now we declare that we're working on that page
          pdf.addImage(canvasDataURL, 'PNG', 20, 40, (width * .62), (height * .62)); // add content to the page
        }
              
        // Save the PDF
        pdf.save('document.pdf');
      }
    });
  }

  function convertHTMLToPDF() {
    const { jsPDF } = window.jspdf;

    var doc = new jsPDF('l', 'mm', [1200, 1810]);
    var pdfjs = document.querySelector('#container');

    doc.html(pdfjs, {
        callback: function(doc) {
            doc.save(`${document.getElementById('headerTitle').innerHTML.replaceAll(/\s/gi, '-').replace('🖉', '')}.pdf`);
        },
        x: 10,
        y: 10
    });

}