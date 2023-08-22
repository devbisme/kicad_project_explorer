let jsonData = [];
let sortDirection = {};

window.onload = function () {
    // fetch('https://example.com/data.json')
    // fetch('/kicad_repos_small.json')
    fetch('/kicad_repos.json')
        .then(response => response.json())
        .then(data => {
            preprocessData(data);
            jsonData = data;
            sortTableDesc("created"); // Start off with projects sorted by creation date, newest at top.
        });
}

function preprocessData(data) {
    columns = Object.keys(data[0])
    data.forEach((object, idx) => {
        columns.forEach(column => {

            // Change empty data into an empty string.
            if( object[column] === null ){
                object[column] = "";
            }

            switch (column) {

                case 'name':
                    object[column] = `<a href="${object["url"]}" target="_blank">${object[column]}</a>`;
                    break;

                // case 'description':
                //     object[column] = object[column].toLowerCase();
                //     break

                case 'owner':
                    object[column] = object[column].toLowerCase();
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

    // Creat empty table.
    const table = document.getElementById('dataTable');
    table.innerHTML = '';

    // One table column for each field of a row of data.
    let columns = Object.keys(data[0]);

    // Create header for the table.
    let headerRow = document.createElement('tr');
    columns.forEach(column => {

        // Create header for a column of the table.
        let th = document.createElement('th');
        th.classList.add(column);

        // Add a div to hold the text of the column header.
        let div_column = document.createElement('div');
        div_column.innerHTML = column;
        div_column.className = "column";
        th.appendChild(div_column);

        // Add sorting buttons to every column except the project name and description.
        if (!['name', 'description'].includes(column)) {
            let div_updwn = document.createElement('div');
            div_updwn.className = "sort-button";
            div_updwn.innerHTML = '&nbsp;' + (sortDirection[column] === 'asc' ? '&#9660;' : '&#9650;');
            div_updwn.onclick = function () { sortTable(column); }
            th.appendChild(div_updwn);
        }

        headerRow.appendChild(th);
    });

    // Add the header row to the table.
    let thead = document.createElement('thead');
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create rows of data for the table.
    let tbody = document.createElement('tbody');
    let show_table = true;
    let idx = 0;

    // Function to add table rows in sections and allow progress bar to update.
    function dataRows() {
        while (idx < data.length) {

            // Create a row of data.
            let tr = document.createElement('tr');
            tr.className = idx % 2 === 0 ? 'even-row' : 'odd-row';
            object = data[idx++]; // Get data and inc index to next row.
            columns.forEach(column => {
                let td = document.createElement('td');
                td.innerHTML = object[column];
                td.classList.add(column);
                tr.appendChild(td);
            });
            tbody.appendChild(tr);

            if (idx % 1000 === 0) {
                // This set of data rows is done, so process the next set.
                updateProgressBar((100 * idx) / data.length);
                setTimeout(dataRows, 0); // Set up to process next set of data upon return.
                return; // Leave func so progress bar updates.
            }
        }

        if (show_table) {
            // Display an indeterminate progress bar while body is added to table.
            updateProgressBar(false); // indeterminate progress bar.
            show_table = false; // Don't come back here.
            setTimeout(dataRows, 0); // When we exit, set up to come back to the next phase.
            return; // Leave func so progress bar updates.
        }

        // Add the body to the table. This will take a while (multiple seconds)!
        table.appendChild(tbody);
        updateProgressBar(100);
    }
    dataRows();
}

function updateProgressBar(progress) {
    bar = $("#progressbar");
    if (progress < 100) {
        bar.show();
        bar.progressbar("option", "value", progress);
    }
    else {
        bar.hide();
    }
}

$("#progressbar").progressbar({
    value: false
});

function sortTable(column) {
    if (sortDirection[column] === 'asc')
        sortTableAsc(column);
    else
        sortTableDesc(column);
}

function sortTableAsc(column) {
    let sortedData = [...jsonData];
    sortedData.sort((a, b) => (a[column] > b[column]) ? 1 : -1);
    sortDirection[column] = 'desc';
    populateTable(sortedData);
}

function sortTableDesc(column) {
    let sortedData = [...jsonData];
    sortedData.sort((a, b) => (a[column] < b[column]) ? 1 : -1);
    sortDirection[column] = 'asc';
    populateTable(sortedData);
}

function filterTable() {
    let filter = document.getElementById('filterField').value.split(":");
    let filteredData = jsonData.filter(item => item[filter[0]].includes(filter[1]));
    populateTable(filteredData);
}

let filterInput = document.getElementById('filterField');
filterInput.addEventListener("keypress", function(event) {
    if( event.key === "Enter"){
        event.preventDefault();
        document.getElementById("filterButton").click();
    }
});
