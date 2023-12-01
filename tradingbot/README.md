# tradingbot Guide

## 개발 환경

#### 프로그래밍 언어

- python

#### 파이썬 라이브러리

- pandas
- numpy
- yarl
- aiohttp

## Dependency Tree

```
settings.py
    |----binancefutures.py
            |----ordermanager.py
                    |----myStrategy.py
```

## Custom Files

### 필수 요소

ordermanager.py의 가장 하단에 존재하는 run_loop()의 다음 2가지 instance variable에 값을 할당해줘야 합니다.  

- self.api_key  
- self.api_secret

예시 : [ordermanager.py]

```
def run_loop(self):
    self.api_key = "abcdefg1234567"
    self.api_secret = "dbacdef0392856"
```

### 선택적 요소

- settings.py의 TESNET 변수를 True로 변경하면 실제 돈이 아닌 가상의 돈으로 binance의 testnet 서버에서 동작을 확인할 수 있습니다.
- MIN_POSITION 과 MAX_POSITION 값을 변경하여 buy, sell position의 limit를 지정해줄 수 있습니다.

## 프로그램 로직

- Binance 와의 websocket을 열어서 실시간으로 틱 데이터를 수집합니다.
- 틱 데이터 중 market trade와 관련된 정보를 저장합니다.
- timestamp 간격이 10분이 넘어가면 예전 데이터를 삭제하여 10분 간격으로 정보를 유지 합니다.
- 해당 정보를 바탕으로 여러가지 파라미터를 추정하여 최적의 매수/매도 호가를 결정합니다.

## 프로그램 실행

tradingbot의 상위 디렉토리 (ex: ~/visualize-binance/) 에서 다음 명령어를 실행해주세요.

```
python -m tradingbot.myStrategy
```

10분이 지나면 주문이 자동으로 들어가는 것을 확인할 수 있습니다.

### 실행 결과 예시