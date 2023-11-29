function showTable(tableId) {
    // Hide all tables
    var tables = document.querySelectorAll('div[id$="Table"]');
    for (var i = 0; i < tables.length; i++) {
        tables[i].classList.add('hidden');
    }

    // Show the selected table
    var selectedTable = document.getElementById(tableId);
    selectedTable.classList.remove('hidden');
}