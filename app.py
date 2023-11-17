from flask import Flask, render_template, jsonify
import config
import time
from datetime import datetime
from binance.client import Client

app = Flask(__name__)

client = Client(config.API_KEY, config.API_SECRET)

current_time = time.time()

pnl_and_time = []

@app.route('/')
def index():
    title = 'BinanceView'

    account_info = client.futures_account()

    return render_template('index.html', title=title, account_info=account_info)

@app.route('/history')
def history():
    candlesticks = client.futures_historical_klines("BTCUSDT", Client.KLINE_INTERVAL_1MINUTE, "10 Nov, 2023")

    processed_candlesticks = []

    # { time: '2018-10-19', open: 180.34, high: 180.99, low: 178.57, close: 179.85 }
    for data in candlesticks:
        candlestick = {
            "time": (data[0] / 1000) + (9 * 3600), 
            "open": data[1], 
            "high": data[2], 
            "low": data[3], 
            "close": data[4]
        }

        processed_candlesticks.append(candlestick)

    return jsonify(processed_candlesticks)

# @app.route('/pnl')
# def pnl():
#     accountInfo = client.futures_account()

#     # { time: "2018-03-28", value: 154 },

#     for balance in accountInfo['assets']:
#         if balance['asset'] == 'USDT':
#             pnl = float(balance['crossUnPnl'])
#             data = {
#                 "time" : datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%S.%fZ"),
#                 "value" : pnl
#             }
#             pnl_and_time.append(data)

#     return jsonify(pnl_and_time)


# @app.route()
# def