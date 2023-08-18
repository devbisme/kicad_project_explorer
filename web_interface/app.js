let jsonData = [];
let sortDirection = {};

window.onload = function() {
    // fetch('https://example.com/data.json')
    // fetch('/kicad_repos_small.json')
    fetch('/kicad_repos.json')
        .then(response => response.json())
        .then(data => {
            preprocessData(data);
            jsonData = data;
            populateTable(data);
        });
}

function preprocessData(data) {
    keys = Object.keys(data[0])
    data.forEach((object, index) => {
        keys.forEach(key => {
            switch (key) {

                case 'name':
                    object[key] = `<a href="${object["url"]}" target="_blank">${object[key]}</a>`;
                    console.log(object[key]);
                    break;

                case 'created':
                    date = object[key];
                    object[key] = date.split("T")[0];
                    break;
            
                case 'updated':
                    date = object[key];
                    object[key] = date.split("T")[0];
                    break;
            
                default:
                    break;
            }
        })

        // Remove this data so it isn't displayed.
        delete object.url;
        delete object.id;
        delete object.updated;
    })
}

function populateTable(data) {
    const table = document.getElementById('dataTable');
    table.innerHTML = '';

    let keys = Object.keys(data[0]);
    
    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    keys.forEach(key => {
        let th = document.createElement('th');
        th.classList.add(key);
        
        let div_key = document.createElement('div');
        div_key.innerHTML = key + '&nbsp;';
        div_key.className = "column-key";
        th.appendChild(div_key);
        
        if (! ['name', 'description'].includes(key)) {
            let div_updwn = document.createElement('div');
            div_updwn.className = "sort-button";
            div_updwn.innerHTML = (sortDirection[key] === 'asc' ? ' &#9650;' : ' &#9660;');
            div_updwn.onclick = function() { sortTable(key); }
            th.appendChild(div_updwn);
        }
        
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    let tbody = document.createElement('tbody');
    data.forEach((object, index) => {
        let tr = document.createElement('tr');
        tr.className = index % 2 === 0 ? 'even-row' : 'odd-row';
        keys.forEach(key => {
            let td = document.createElement('td');
            td.innerHTML = object[key];
            td.classList.add(key);
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
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
