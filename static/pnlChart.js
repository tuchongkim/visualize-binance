document.body.style.position = 'relative';

var container = document.getElementById('pnlChart');
document.body.appendChild(container);

var width = 600;
var height = 300;

var chart = LightweightCharts.createChart(container, {
  rightPriceScale: {
    scaleMargins: {
      top: 0.2,
      bottom: 0.2,
    },
    borderVisible: false,
  },
  timeScale: {
    borderVisible: false,
  },
  layout: {
    backgroundColor: '#ffffff',
    textColor: '#333',
  },
  grid: {
    horzLines: {
      color: '#eee',
    },
    vertLines: {
      color: '#ffffff',
    },
  },
  crosshair: {
    vertLine: {
      labelVisible: false,
    },
  },
});

chart.resize(width, height);

var pnlSeries = chart.addAreaSeries({
  topColor: 'rgba(0, 150, 136, 0.56)',
  bottomColor: 'rgba(0, 150, 136, 0.04)',
  lineColor: 'rgba(0, 150, 136, 1)',
  lineWidth: 2,
});

// { time: "2018-03-28", value: 154 },

fetch("http://127.0.0.1:5000/pnl")
	.then((r) => r.json())
	.then((response) => {
		console.log(response)

		pnlSeries.setData(response);
	})

// var client = Client(config.API_KEY, config.API_SECRET)
// // Assuming you have a function to get the account information asynchronously
// async function fetchAccountInfo() {
//     try {
//       const accountInfo = await client.futures_account();
      
//       // Assuming you have a function to get the current timestamp
//       const currentTime = Math.floor(Date.now() / 1000);
  
//       // Assuming the series.update function works similarly in your JavaScript code
//       accountInfo.assets.forEach((balance) => {
//         if (balance.asset === 'BTC') {
//           const pnl = parseFloat(balance.crossUnPnl);
//           const data = {
//             time: currentTime,
//             value: pnl,
//           };
//           series.update(data);
//         }
//       });
//     } catch (error) {
//       console.error('Error fetching account information:', error);
//     }
//   }
  
//   // Call the function to fetch and update account information
//   fetchAccountInfo();
  
// function fetchAndUpdatePNL() {
//     fetch("/pnl")
//         .then(response => response.json())
//         .then(data => {
//             pnlSeries.update(data);
//         })
//         .catch(error => {
//             console.error('Error fetching PNL data:', error);
//         });
// }

// // Fetch and update PNL initially
// fetchAndUpdatePNL();

// // Fetch and update PNL every 60 seconds (adjust as needed)
// setInterval(fetchAndUpdatePNL, 1000);



const toolTipWidth = 80;
const toolTipHeight = 80;
const toolTipMargin = 15;

// Create and style the tooltip html element
const toolTip = document.createElement('div');
toolTip.style = `width: 96px; height: 80px; position: absolute; display: none; padding: 8px; box-sizing: border-box; font-size: 12px; text-align: left; z-index: 1000; top: 12px; left: 12px; pointer-events: none; border: 1px solid; border-radius: 2px;font-family: -apple-system, BlinkMacSystemFont, 'Trebuchet MS', Roboto, Ubuntu, sans-serif; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;`;
toolTip.style.background = 'white';
toolTip.style.color = 'black';
toolTip.style.borderColor = 'rgba(0, 150, 136, 1)';
container.appendChild(toolTip);

// update tooltip
chart.subscribeCrosshairMove(param => {
	if (
		param.point === undefined ||
		!param.time ||
		param.point.x < 0 ||
		param.point.x > container.clientWidth ||
		param.point.y < 0 ||
		param.point.y > container.clientHeight
	) {
		toolTip.style.display = 'none';
	} else {
		// time will be in the same format that we supplied to setData.
		// thus it will be YYYY-MM-DD
		const dateStr = param.time;
		toolTip.style.display = 'block';
		const data = param.seriesData.get(pnlSeries);
		const price = data.value !== undefined ? data.value : data.close;
		toolTip.innerHTML = `<div style="color: ${'rgba(0, 150, 136, 1)'}">Apple Inc.</div><div style="font-size: 24px; margin: 4px 0px; color: ${'black'}">
			${Math.round(100 * price) / 100}
			</div><div style="color: ${'black'}">
			${dateStr}
			</div>`;

		const coordinate = pnlSeries.priceToCoordinate(price);
		let shiftedCoordinate = param.point.x - 50;
		if (coordinate === null) {
			return;
		}
		shiftedCoordinate = Math.max(
			0,
			Math.min(container.clientWidth - toolTipWidth, shiftedCoordinate)
		);
		const coordinateY =
			coordinate - toolTipHeight - toolTipMargin > 0
				? coordinate - toolTipHeight - toolTipMargin
				: Math.max(
					0,
					Math.min(
						container.clientHeight - toolTipHeight - toolTipMargin,
						coordinate + toolTipMargin
					)
				);
		toolTip.style.left = shiftedCoordinate + 'px';
		toolTip.style.top = coordinateY + 'px';
	}
});