import logging
import sys
import time

import pandas as pd
import numpy as np
from numpy import floor, ceil

from tradingbot.ordermanager import OrderManager


class CustomOrderManager(OrderManager):
    """A sample order manager for implementing your own custom strategy"""

    async def place_orders(self):
        # implement your custom strategy here
        # order_qty_dollar = 100
        tick_size = 0.1
        tick_ub = 100000

        # A = 3.8325354556799747
        # k = 0.018222652183273957
        # volatility = 26.261791655773298
        A = self.binance_futures.A
        k = self.binance_futures.k
        volatility = self.binance_futures.volatility
        gamma = 0.05
        delta = 0.003
        adj1 = 2
        adj2 = 0.05
        order_qty = 0.003
        max_position = 0.12
        grid_num = 4

        def compute_coeff(xi, gamma, delta, A, k):
            inv_k = np.divide(1, k)
            c1 = 1 / (xi * delta) * np.log(1 + xi * delta * inv_k)
            c2 = np.sqrt(np.divide(gamma, 2 * A * delta * k) * ((1 + xi * delta * inv_k) ** (k / (xi * delta) + 1)))
            return c1, c2

        market_depth = self.binance_futures.depth
        bid = map(lambda x: (float(x[0]), x[1]), sorted(filter(lambda x: x[1] > 0, market_depth.items()), key=lambda x: -float(x[0])))
        ask = map(lambda x: (float(x[0]), x[1]), sorted(filter(lambda x: x[1] < 0, market_depth.items()), key=lambda x: float(x[0])))
        bid = pd.DataFrame(bid, columns=['price', 'size'])
        ask = pd.DataFrame(ask, columns=['price', 'size'])
        if len(bid) == 0 or len(ask) == 0:
            return
        mid = (bid['price'][0] + ask['price'][0]) / 2.0

        #--------------------------------------------------------
        # Computes bid price and ask price.
        if A == 0 or k == 0:
            A = 3.8325354556799747
            k = 0.018222652183273957
            c1, c2 = compute_coeff(gamma, gamma, delta, A, k)
        else:
            c1, c2 = compute_coeff(gamma, gamma, delta, A, k)
        
        half_spread = (c1 + delta / 2 * c2 * volatility) * adj1
        skew = c2 * volatility * adj2
        
        bid_depth = half_spread + skew * float(self.binance_futures.running_qty)
        ask_depth = half_spread - skew * float(self.binance_futures.running_qty)
    
        bid_price = min(mid - bid_depth, bid['price'][0]) # tick_size 곱하는 거 삭제
        ask_price = max(mid + ask_depth, ask['price'][0]) # tick_size 곱하는 거 삭제
        
        grid_interval = max(np.round(half_spread) * tick_size, tick_size)
        bid_price = np.floor(bid_price / grid_interval) * grid_interval
        ask_price = np.ceil(ask_price / grid_interval) * grid_interval

        # my modification
        price_range = 80 # eg. 200
        order_interval = price_range / grid_num  # eg. 20 (if grid_num = 10)
        interval_tick = int(round(order_interval / tick_size)) # eg. 200
        ##############################################################################

        bid_order_begin = min(mid - bid_depth, bid['price'][0]) # 37403.445
        ask_order_begin = max(mid + ask_depth, ask['price'][0]) # 37622.054
        lb_price = bid_order_begin - price_range
        ub_price = ask_order_begin + price_range

        x = float(self.binance_futures.running_qty) / max_position # 수정 (mid 삭제)

        if x <= 1:
            max_bid_order_tick = int(round(bid_order_begin / tick_size))
            max_bid_order_tick = int(floor(max_bid_order_tick / interval_tick))
            min_bid_order_tick = int(floor(lb_price / tick_size / interval_tick))
        else:
            # Cancel all bid orders if the position exceeds the maximum position.
            min_bid_order_tick = max_bid_order_tick = 0
        if x >= -1:
            min_ask_order_tick = int(round(ask_order_begin / tick_size))
            min_ask_order_tick = int(ceil(min_ask_order_tick / interval_tick))
            max_ask_order_tick = int(ceil(ub_price / tick_size / interval_tick))
        else:
            # Cancel all ask orders if the position exceeds the maximum position.
            min_ask_order_tick = max_ask_order_tick = tick_ub - 1

        buy_orders = []
        sell_orders = []
        for tick in range(max_bid_order_tick, min_bid_order_tick, -1):
            bid_price_tick = tick * interval_tick
            bid_price = bid_price_tick * tick_size
            # round(order_qty_dollar / bid_price, 3) -> minimum qty (0.003)
            buy_orders.append({'price': '%1.f' % bid_price, 'quantity': order_qty, 'side': "Buy"})
        for tick in range(min_ask_order_tick, max_ask_order_tick, 1):
            ask_price_tick = tick * interval_tick
            ask_price = ask_price_tick * tick_size
            # round(order_qty_dollar / bid_price, 3) -> minimum qty (0.003)
            sell_orders.append({'price': '%1.f' % ask_price, 'quantity': order_qty, 'side': "Sell"})

        try:
            #logging.info('mid=%.1f, running_qty%%=%f, buy_orders=%s, sell_orders=%s', mid, x, buy_orders, sell_orders)
            await self.converge_orders(buy_orders, sell_orders)
        except:
            logging.warning('Order error.', exc_info=True)


def run():
    order_manager = CustomOrderManager()

    # Try/except just keeps ctrl-c from printing an ugly stacktrace
    try:
        order_manager.run_loop()
    except (KeyboardInterrupt, SystemExit):
        sys.exit()

run()