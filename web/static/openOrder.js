function formatTimestamp(timestamp) {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleString(); // Adjust the format as needed
}

function openOrderInfo() {
    // Fetch data from the Flask route
    fetch('/openOrder')
        .then(response => response.json())
        .then(data => {
            console.log(data)

            var openOrderTableBody = document.querySelector('#openOrderTable tbody');

            // Clear previous positions
            openOrderTableBody.innerHTML = '';

            // Iterate through the received data and create table rows
            data.forEach(position => {
                var newRow = openOrderTableBody.insertRow();

                // Insert cells and set their inner HTML with data
                var timeCell = newRow.insertCell(0);
                timeCell.textContent = formatTimestamp(position[0]);

                var symbolCell = newRow.insertCell(1);
                symbolCell.textContent = position[1];

                var typeCell = newRow.insertCell(2);
                typeCell.textContent = position[2];

                var sideCell = newRow.insertCell(3);
                sideCell.textContent = position[3];
                sideCell.classList.add(position[3].toLowerCase() === 'buy' ? 'buy-order' : 'sell-order');

                var priceCell = newRow.insertCell(4);
                priceCell.textContent = position[4];

                var amountCell = newRow.insertCell(5);
                amountCell.textContent = position[5];
            });
            
            // recursive하게 positionInfo function을 호출
            setTimeout(openOrderInfo, 2000);  // 2초마다 update
        });
}

// Initial call to start the updating process
openOrderInfo();