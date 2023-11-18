from flask import Flask, render_template, jsonify
import config
import time
from datetime import datetime
from binance.client import Client

app = Flask(__name__)

client = Client(config.API_KEY, config.API_SECRET, testnet=True)

current_time = time.time()

pnl_and_time = []

@app.route('/')
def index():
    title = 'BinanceView'

    return render_template('index.html', title=title)

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

@app.route('/totalBalance')
def total_balance():
    while True:
        try:
            account_info = client.futures_account()
            time.sleep(0.25)
            total_balance = account_info['totalCrossWalletBalance']
            unrealized_pnl = account_info['totalCrossUnPnl']
            processed_balance = float(total_balance) + float(unrealized_pnl)
            result = "{:.3f}".format(processed_balance)
        except Exception as e:
            print(e.message)
            pass
        return result

@app.route('/pnl')
def pnl():
    while True:
        try:
            account_info = client.futures_account()
            time.sleep(0.25)
            unrealized_profit = float(account_info['totalUnrealizedProfit'])
            initial_margin = float(account_info['totalInitialMargin'])
            roe = unrealized_profit / initial_margin * 100
            result = "{:.3f}".format(roe)
        except Exception as e:
            print(e.message)
            pass
        return result
    

