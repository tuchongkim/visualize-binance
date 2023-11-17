const TickMarkType = window.LightweightCharts.TickMarkType;
const locale = navigator.language;

var container = document.getElementById('chart');

// lightweight 차트를 생성 (기본적인 구조 설정)
var chart = LightweightCharts.createChart(container, {
    width: container.offsetWidth,
    height: 500,
	layout: {
		background: { color: '#222' },
		textColor: '#DDD',
	},
	grid: {
		vertLines: { color: '#444' },
		horzLines: { color: '#444' },
    },
    crosshair: {
        mode: LightweightCharts.CrosshairMode.Normal,
        vertLine: {
            color: '#9B7DFF',
            labelBackgroundColor: '#9B7DFF',
        },
        horzLine: {
            color: '#9B7DFF',
            labelBackgroundColor: '#9B7DFF',
        },
    },
    rightPriceScale: {
		borderColor: '#71649C',
    },
    timeScale: {
		borderColor: '#71649C',
		timeVisible: true,
        rightOffset: 10,
    },
    localization: { // crosshair에서 예쁘게 나타내기
        timeFormatter: (time) => {
            const date = new Date((time - (9 * 3600)) * 1000);

            const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
                hour: "numeric",
                minute: "numeric",
                month: "short",
                hour12: false,
                day: "numeric",
                year: "2-digit",
            });
            
            return dateFormatter.format(date);
        },
    },
});

// 비트코인 1분봉 차트 그리기 (default colors)
var candleSeries = chart.addCandlestickSeries();

// 창의 크기가 변했을 때 실행할 resize 함수
function updateChartSize() {
    chart.resize(container.offsetWidth, 500);
};

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
        time: (candlestick.t / 1000) + (9 * 3600),
        open: candlestick.o,
        high: candlestick.h,
        low: candlestick.l,
        close: candlestick.c,
    });
};

// 창의 크기에 맞게 차트가 조정되도록 event listener 추가
window.addEventListener('resize', updateChartSize);

