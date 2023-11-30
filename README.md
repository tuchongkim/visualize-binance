# SolTrade : 마켓 메이킹 모델을 이용한 거래 자동화 시스템

![Static Badge](https://img.shields.io/badge/project-KHU-<color>)
![Static Badge](https://img.shields.io/badge/version-1.0.0-informational)
![Static Badge](https://img.shields.io/badge/python-3.9|3.10-lightblue)

> 2023학년도 2학기 경희대학교 데이터분석캡스톤디자인 프로젝트 입니다.

## 🚀 프로젝트 소개

트레이딩을 하는 사람이라면 누구나 한 번쯤 이런 고민을 한 적이 있을 겁니다.

`"언제 사서 언제 팔아야 하는가?"`  
`"조금씩이라도 안정적으로 수익을 낼 수 있는 방법은 없을까?"`

이런 고민을 해결해드리기 위해 저희는 최적의 매수/매도 호가를 산출하여 자동으로 거래를 해주는 시스템을 개발했습니다.

<img src="./web/static/images/readme-image.png" width="800" height="450">

## 📌 프로젝트 구성

### 🪙 거래 플랫폼 및 종목

해외 코인 거래소 Binance를 이용해서 BTCUSDT 선물 거래를 진행했습니다.

### 📈 최적 매수/매도 호가 산출 알고리즘

Binance에서 제공하는 API를 활용하여 실시간 틱데이터를 받아옵니다.
이 데이터를 마켓 메이킹 모델에 적용해 최적의 매수/매도 호가를 산출하고 해당 가격을 기반으로 주문을 넣는 구조입니다.

자세한 내용은 아래 README를 참고해주시기 바랍니다.

### 🖥️ 실시간 주문 내역 및 포지션 확인

flask, html, css, javascript를 기반으로 실시간 주문 내역을 확인할 수 있는 웹페이지를 만들었습니다.

자세한 내용은 아래 README를 참고해주시기 바랍니다.

## References

- [sample-trading-bot](https://github.com/nkaz001/sample-trading-bot) by [nkaz001]
- [hftbacktest](https://github.com/nkaz001/hftbacktest) by [nkaz001]
- 「Dealing with the Inventory Risk. A solution to the market making problem」 Olivier Guéant, Charles-Albert Lehalle, Joaquin Fernandez Tapia (2012)

## 팀 소개

#### 경희대학교 소프트웨어융합학과 19학번 김두종

#### 경희대학교 소프트웨어융합학과 19학번 허준수
