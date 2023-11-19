function positionInfo() {
    // Fetch data from the Flask route
    fetch('/position')
        .then(response => response.json())
        .then(data => {
            console.log(data)

            var positionTableBody = document.querySelector('#positionTable tbody');

            // Clear previous positions
            positionTableBody.innerHTML = '';

            // Iterate through the received data and create table rows
            data.forEach(position => {
                var newRow = positionTableBody.insertRow();

                // Insert cells and set their inner HTML with data
                var symbolCell = newRow.insertCell(0);
                symbolCell.textContent = position[0];

                var leverageCell = newRow.insertCell(1);
                leverageCell.textContent = position[1];

                var sizeCell = newRow.insertCell(2);
                var sizeValue = parseFloat(position[2]); // Extract numeric value
                sizeCell.textContent = position[2];
                // Add a CSS class based on the value of size
                sizeCell.classList.add(sizeValue > 0 ? 'positive-size' : 'negative-size');

                var entryPriceCell = newRow.insertCell(3);
                entryPriceCell.textContent = position[3];

                var marginCell = newRow.insertCell(4);
                marginCell.textContent = position[4];

                var pnlCell = newRow.insertCell(5);
                var pnlValue = parseFloat(position[5].split(' ')[0]); // Extract numeric value
                pnlCell.textContent = position[5];
                // Add a CSS class based on the value of pnl
                pnlCell.classList.add(pnlValue > 0 ? 'positive-pnl' : 'negative-pnl');

                var closeCell = newRow.insertCell(6);
                closeCell.textContent = position[6];
            });
            
            // recursive하게 positionInfo function을 호출
            setTimeout(positionInfo, 1000);  // 1초마다 update
        });
}

// Initial call to start the updating process
positionInfo();