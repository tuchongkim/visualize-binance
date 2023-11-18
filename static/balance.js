function updateBalance() {
    // Fetch data from the Flask route
    fetch('/totalBalance')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            // Update the HTML element with the received data
            const formattedBalance = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(parseFloat(data));

            // 실시간 balance 데이터를 html에 적용
            document.getElementById('updatedBalance').innerHTML = formattedBalance;

            // recursive하게 updateBalance function을 호출
            setTimeout(updateBalance, 1000);  // 1초마다 update
        });
}

// Initial call to start the updating process
updateBalance();