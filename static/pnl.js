function updatePnl() {
    // Fetch data from the Flask route
    fetch('/pnl')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // Update the HTML element with the received data
            document.getElementById('updatedPnl').innerHTML = data;

            // recursive하게 updateBalance function을 호출
            setTimeout(updatePnl, 1000);  // 1초마다 update
        });
}

// Initial call to start the updating process
updatePnl();