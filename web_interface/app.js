let jsonData = [];
let sortDirection = {};

window.onload = function() {
    // fetch('https://example.com/data.json')
    fetch('/kicad_repos_small.json')
        .then(response => response.json())
        .then(data => {
            jsonData = data;
            populateTable(data);
        });
}

function populateTable(data) {
    const table = document.getElementById('dataTable');
    table.innerHTML = '';
    let thead = document.createElement('thead');
    let tbody = document.createElement('tbody');

    let keys = Object.keys(data[0]);
    let headerRow = document.createElement('tr');
    keys.forEach(key => {
        let th = document.createElement('th');
        th.onclick = function() { sortTable(key); };

        th.className = "resizable";
        
        let div = document.createElement('div');
        div.className = 'cell';
        // div.textContent = key + (sortDirection[key] === 'asc' ? ' ▲' : ' ▼');
        // div.textContent = key + (sortDirection[key] === 'asc' ? ' &#9650;' : ' &#9660;');
        div.innerHTML = key + "<br>" + (sortDirection[key] === 'asc' ? ' &#9650;' : ' &#9660;');
        
        th.appendChild(div);
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    data.forEach((object, index) => {
        let tr = document.createElement('tr');
        tr.className = index % 2 === 0 ? 'even-row' : 'odd-row';
        keys.forEach(key => {
            let td = document.createElement('td');
            
            let div = document.createElement('div');
            div.className = 'cell';
            let div2 = document.createElement('div');
            div2.className = key;
            div2.textContent = object[key];
            
            div.appendChild(div2)
            td.appendChild(div);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });

    table.appendChild(thead);
    table.appendChild(tbody);

    $("th.resizable").resizable({
        handles: "e",
        minWidth: 50,
        alsoResize: "#dataTable",
        resize: function(event, ui) {
            var index = ui.helper.index() + 1;
            $("td:nth-child(" + index + ")").width(ui.size.width);
        }
    });
}

function sortTable(column) {
    let sortedData = [...jsonData];
    sortDirection[column] = sortDirection[column] === 'asc' ? 'desc' : 'asc';
    sortedData.sort((a, b) => (a[column] > b[column]) ? 1 : -1);
    if (sortDirection[column] === 'desc') sortedData.reverse();
    populateTable(sortedData);
}

function filterTable() {
    let filter = document.getElementById('filterField').value.split(":");
    let filteredData = jsonData.filter(item => item[filter[0]].includes(filter[1]));
    populateTable(filteredData);
}
