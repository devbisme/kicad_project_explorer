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
    columns = Object.keys(data[0])
    data.forEach((object, idx) => {
        columns.forEach(column => {
            switch (column) {

                case 'name':
                    object[column] = `<a href="${object["url"]}" target="_blank">${object[column]}</a>`;
                    break;

                case 'created':
                    // Split off the time; only keep the Y/M/D.
                    date = object[column];
                    object[column] = date.split("T")[0];
                    break;
            
                case 'updated':
                    // Split off the time; only keep the Y/M/D.
                    date = object[column];
                    object[column] = date.split("T")[0];
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
    
    let columns = Object.keys(data[0]);
    
    let headerRow = document.createElement('tr');
    columns.forEach(column => {
        let th = document.createElement('th');
        th.classList.add(column);
        
        let div_column = document.createElement('div');
        div_column.innerHTML = column;
        div_column.className = "column";
        th.appendChild(div_column);
        
        // Add sorting buttons to every column except the project name and description.
        if (! ['name', 'description'].includes(column)) {
            let div_updwn = document.createElement('div');
            div_updwn.className = "sort-button";
            div_updwn.innerHTML = '&nbsp;' + (sortDirection[column] === 'asc' ? ' &#9650;' : ' &#9660;');
            div_updwn.onclick = function() { sortTable(column); }
            th.appendChild(div_updwn);
        }
        
        headerRow.appendChild(th);
    });
    let thead = document.createElement('thead');
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    let tbody = document.createElement('tbody');
    let data_len = data.length;
    let idx = 0;
    function dataRows(){
        while(idx < data_len){
            let tr = document.createElement('tr');
            tr.className = idx % 2 === 0 ? 'even-row' : 'odd-row';
            object = data[idx];
            columns.forEach(column => {
                let td = document.createElement('td');
                td.innerHTML = object[column];
                td.classList.add(column);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);
            idx++;
            if (idx % 1000 === 0){
                // This set of data rows is done, so process the next set.
                updateProgressBar((100 * idx) / data_len);
                // Use setTimeout to allow the progress bar to update.
                setTimeout(dataRows, 0);
                return;
            }
        }

        // Add the body to the table. This will take a while (multiple seconds)!
        table.appendChild(tbody);
        updateProgressBar(100);
    }
    dataRows();
}

function updateProgressBar(progress) {
    bar = $("#progressbar");
    pct = $("#progressPct");
    if (progress<100) {
        bar.show();
        pct.innerHTML = "prog";
        bar.progressbar( "option", "value", progress );
    }
    else {
        bar.hide();
    }
}

function startProgress(){
    updateProgressBar(0);
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

$( "#progressbar" ).progressbar({
    value: false
});
