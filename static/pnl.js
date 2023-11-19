function updatePnl() {
    // Fetch data from the Flask route
    fetch('/pnl')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            
            // Update the HTML element with the received data
            const pnlElement = document.getElementById('updatedPnl');
            const pnlValue = parseFloat(data).toFixed(2);

            pnlElement.classList.remove('positive-pnl', 'negative-pnl');
            pnlElement.classList.add(pnlValue > 0 ? 'positive-pnl' : 'negative-pnl');
            const formattedPnl = pnlValue + '%';

            pnlElement.innerHTML = formattedPnl;

            // recursive하게 updateBalance function을 호출
            setTimeout(updatePnl, 1000);  // 1초마다 update
        });
}

// Initial call to start the updating process
updatePnl();