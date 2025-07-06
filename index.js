// Constants
let menuState = ""

let columns = 5;
let rows = 3;
let bingoCells = 8;
let words = [
    "Encryption",
    "Authentication",
    "Vulnerability",
    "Antivirus",
    "Breach",
    "Zero-day",
    "Botnet",
    "Spyware",
    "VPN",
    "Two-factor authentication",
    "Social engineering",
    "Penetration testing",
    "Endpoint security",
    "Trojan horse",
    "Keylogger",
    "Sandboxing",
    "Honeypot",
    "Incident response",
    "Risk assessment",
    "Web Development",
];
generateEditingMenu()


// FUNCTIONS
function generate_table(){
    document.querySelector(".download").style.display = "flex";
    // INITIALIZING
    if (menuState === "edit"){
        columns = Number(document.querySelector('.column-input').value);
        rows = Number(document.querySelector('.row-input').value);
        bingoCells = Number(document.querySelector('.words-input').value);
        words = document.querySelector('.list-input').value.split(',').map(word => {
            word = word.trim();
            return word.length > 25 ? word.slice(0, 25) + "..." : word;
        });

        downloadTable();
    }
    menuState = "generate";

    // RANDOMIZING WORDS
    const randWords = new Set();
    while (randWords.size < bingoCells) {
        let rand = Math.floor(Math.random() * words.length);
        randWords.add(words[rand]);
    }
    const pickedWords = Array.from(randWords);


    // RANDOMIZING CELLS
    const totalCells = rows * columns;
    const randCells = {};

    while (Object.keys(randCells).length < bingoCells) {
        const rand = Math.floor(Math.random() * totalCells);
        const randCellRow = Math.floor(rand / columns)
        const randCellCol = rand % columns;
        const randCell = `${randCellRow}×${randCellCol}`;
        randCells[randCell] = true;
    }
    console.log(randCells);


    // DISPLAYING
    let table = '<div class="table-container"> <table class="table">'
    let index = 0

    for (let r = 0; r < rows; r++) {
        table += `<tr>`;
        for (let c = 0; c < columns; c++) {
            const cellKey = `${r}×${c}`;
            let cellText = "";

            if (randCells[cellKey]) {
                cellText = pickedWords[index];
                index++;
            }

            table += `<td class="cell-text">${cellText}</td>`;
        }
        table += `</tr>`;
    }
    table += '</table> </div';

    document.querySelector('.menu').innerHTML = table;

    // STYING TWEAKS
    let tableElement = document.querySelector('.table');
    let fontSize = Math.max(10, 30 - (rows + columns));
    tableElement.style.fontSize = fontSize + "px";

    let cells = document.querySelectorAll('.table td');
    let dynamicPadding = Math.max(2, 20 - (rows + columns));
    cells.forEach(cell => {
        cell.style.padding = dynamicPadding + "px"
    });
}

function generateEditingMenu(){
    if (menuState === "edit") return;
    menuState = "edit";
    document.querySelector(".download").style.display = "none";

    document.querySelector('.menu').innerHTML = `
        <div class="editing-menu">
            <div class="editing-divs">
                <p class="editing-title">Rows</p>
                <input type="text" class="editing-value row-input input" value="${rows}" data-title="row">
            </div>
            <div class="editing-divs">
                <p class="editing-title">Columns</p>
                <input type="text" class="editing-value column-input input" value="${columns}" data-title="column">
            </div>
            <div class="editing-divs">
                <p class="editing-title">Words</p>
                <input type="text" class="editing-value words-input input" value="${bingoCells}" data-title="words">
            </div>
            
            <textarea rows="2" placeholder="Enter words sparated by commas" class="list-input input" 
                data-title="list">${words.join(', ')}</textarea>
        </div>`;
    validateInput();
}

// VALIDATION
function validateInput() {
    document.querySelectorAll('.input').forEach(element => {
        const title = element.dataset.title;

        element.addEventListener('change', () => {
            let value = element.value;

            if (title === 'list') {
                if (value === "") value = "Word1";
            }
            else {
                value = Number(value);
                if (Number.isInteger(value)) {
                    if (title === 'row' || title === 'column') {
                        if (value > 5) value = 5;
                        if (value < 1) value = 1;
                    }
                } else { value = 1; }}

            element.value = value;
            const rowVal = Number(document.querySelector('.row-input').value);
            const colVal = Number(document.querySelector('.column-input').value);
            const listLen = document.querySelector('.list-input').value
                .split(',').filter(w => w.trim() !== "").length;
            const totalVal = rowVal * colVal;

            let words = document.querySelector('.words-input');
            let wordsValue = Number(words.value);
            const max = Math.min(listLen, totalVal);

            if (wordsValue > max) words.value = max;
            if (wordsValue < 1) words.value = 1;
        });
    });
}

// DOWNLOADING
function downloadTable() {
    document.querySelector('.download').addEventListener('click', () => {
        const table = document.querySelector('.menu');

        html2canvas(table).then(canvas => {
            const image = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = image;
            link.download = 'Bingo Card.png';
            link.click();
        });
    })
}

// GENERATING
document.querySelector(".reset").addEventListener('click', generate_table)
document.querySelector(".edit").addEventListener('click', generateEditingMenu)
