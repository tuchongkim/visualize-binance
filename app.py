from flask import Flask, render_template, jsonify
import config
import time
from binance.client import Client

app = Flask(__name__)

client = Client(config.API_KEY, config.API_SECRET)

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
    try:
        account_info = client.futures_account()
        time.sleep(0.5)
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
    try:
        account_info = client.futures_account()
        time.sleep(0.5)
        total_balance = account_info['totalCrossWalletBalance']
        unrealized_pnl = account_info['totalCrossUnPnl']
        initial_margin = float(180)
        processed_balance = float(total_balance) + float(unrealized_pnl)
        roe = (processed_balance - initial_margin) / initial_margin * 100
        result = "{:.3f}".format(roe)
    except Exception as e:
        print(e.message)
        pass
    return result
    
@app.route('/position')
def position():
    try:
        account_info = client.futures_account()
        time.sleep(0.5)

        results = []
        for position_info in account_info["positions"]:
            if float(position_info["positionAmt"]) != 0:
                symbol = position_info["symbol"]
                leverage = position_info["leverage"] + 'x'
                size = position_info["positionAmt"] + " " + symbol[:3]
                entry_price = float(position_info["entryPrice"])
                processed_entry_price = "{:.2f}".format(entry_price)

                margin = float(position_info["initialMargin"])
                processed_margin = "{:.2f} USDT".format(margin)

                pnl_single = float(position_info["unrealizedProfit"])
                roe = pnl_single / margin * 100
                processed_pnl = "{:.2f} USDT ({:.2f}%)".format(pnl_single, roe)

                close_positions = "market"

                results.append([symbol, leverage, size, processed_entry_price, processed_margin, processed_pnl, close_positions])
        return jsonify(results)
    except Exception as e:
        print(e.message)
        pass

@app.route('/openOrder')
def openOrder():
    try:
        open_orders = client.futures_get_open_orders()
        time.sleep(0.5)

        results = []
        for open_order in open_orders:
            if float(open_order["origQty"]) != 0:
                order_time = open_order["time"]
                symbol = open_order["symbol"]
                order_type = open_order["type"]
                order_side = open_order["side"]
                order_price = open_order["price"]
                order_amount = open_order["origQty"] + " " + symbol[:3]
                results.append([order_time, symbol, order_type, order_side, order_price, order_amount])
        return jsonify(results)
    except Exception as e:
        print(e.message)
        pass

