var container = document.getElementById('chart');

// lightweight 차트를 생성 (기본적인 구조 설정)
var chart = LightweightCharts.createChart(container, {
    width: container.offsetWidth,
    height: 500,
    layout: {
        background: {
            type: 'solid',
            color: '#000000',
        },
        textColor: 'rgba(255, 255, 255, 0.9)',
    },
    grid: {
        vertLines: {
            color: 'rgba(197, 203, 206, 0.5)',
        },
        horzLines: {
            color: 'rgba(197, 203, 206, 0.5)',
        },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
    },
    rightPriceScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
    },
    timeScale: {
        borderColor: 'rgba(197, 203, 206, 0.8)',
    },
});

// 비트코인 1분봉 차트 그리기
var candleSeries = chart.addCandlestickSeries({
    upColor: '#00ff00',
    downColor: '#ff0000',
    borderDownColor: '#ff0000',
    borderUpColor: '#00ff00',
    wickDownColor: '#ff0000',
    wickUpColor: '#00ff00',
});

// 창의 크기가 변했을 때 실행할 resize 함수
function updateChartSize() {
    chart.resize(container.offsetWidth, 500);
}

// 과거 데이터를 불러와서 차트에 적용
fetch("http://127.0.0.1:5000/history")
    .then((r) => r.json())
    .then((response) => {
        console.log(response);
        candleSeries.setData(response);
    });

// binance API를 활용하여 real-time 1분봉 데이터 수집
var binanceSocket = new WebSocket("wss://fstream.binance.com/ws/btcusdt@kline_1m");

binanceSocket.onmessage = function (event) {
    var message = JSON.parse(event.data);
    var candlestick = message.k;

    candleSeries.update({
        time: candlestick.t / 1000,
        open: candlestick.o,
        high: candlestick.h,
        low: candlestick.l,
        close: candlestick.c,
    });
};

// 창의 크기에 맞게 차트가 조정되도록 event listener 추가
window.addEventListener('resize', updateChartSize);

