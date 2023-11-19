function updateBalance() {
    // Fetch data from the Flask route
    fetch('/totalBalance')
        .then(response => response.json())
        .then(data => {
            console.log(data)

            // 실시간 balance 데이터를 html에 적용
            const formattedBalance = '$' + parseFloat(data).toFixed(2);
            document.getElementById('updatedBalance').innerHTML = formattedBalance;

            // recursive하게 updateBalance function을 호출
            setTimeout(updateBalance, 1000);  // 1초마다 update
        });
}

// Initial call to start the updating process
updateBalance();