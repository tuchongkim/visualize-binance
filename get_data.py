import config
import csv
from binance.client import Client

client = Client(config.API_KEY, config.API_SECRET)

status = client.get_account_api_trading_status()

print(status)

# csvfile = open('1minute.csv', 'w', newline='')
# candlestick_writer = csv.writer(csvfile, delimiter=',')

# for candlestick in candles:
#     print(candlestick)

#     candlestick_writer.writerow(candlestick)

# print(len(candles))

# klines = client.get_historical_klines("ETHBTC", Client.KLINE_INTERVAL_30MINUTE, "1 Dec, 2017", "1 Jan, 2018")

