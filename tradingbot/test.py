import logging
import sys

import pandas as pd
import numpy as np
from numpy import floor, ceil
from tradingbot.ordermanager import OrderManager

class CustomOrderManager(OrderManager):
    """A sample order manager for implementing your own custom strategy"""



def run(OrderManager):
    order_manager = CustomOrderManager()

    # Try/except just keeps ctrl-c from printing an ugly stacktrace
    try:
        order_manager.run_loop()
    except (KeyboardInterrupt, SystemExit):
        sys.exit()

run()