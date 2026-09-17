# Farm-Bandhu + AGMARKNET Live Price Integration

This package adds a dedicated **Live Mandi Price Command Center** to the AgroBridge/Farm-Bandhu prototype.

## Why there is a Node proxy

The AGMARKNET backend can reject browser-like direct calls and browser CORS can prevent a static HTML file from calling it directly. The included Express server keeps the upstream integration on the server side.

The integration targets the public AGMARKNET 2.0 API surface:
- `GET /v1/daily-price-arrival/filters`
- `GET /v1/location/state`
- `POST /v1/prices-and-arrivals/market-report/daily`

These endpoints correspond to AGMARKNET's market price/arrival reporting architecture.

## Run

1. Install Node.js 18+.
2. Open this folder in a terminal.
3. Run:
   `npm install`
4. Run:
   `npm start`
5. Open:
   `http://localhost:3000/agmarknet.html`

## Important

The dashboard does not hard-code "live" prices. It displays upstream rows when the AGMARKNET service returns them.

The freight number in this prototype is intentionally a UI/demo estimator. For the SIH product, replace `estimateFreight()` with your Farm-Bandhu 3PL/logistics matchmaking service so the final **Net Realization** uses actual transport quotes.

For a production deployment, add:
- server-side caching/rate limiting
- API health monitoring
- proper market/commodity ID mapping
- authentication if the upstream provider requires it
- database storage for historical price series
- Agmarknet/eNAM source timestamp + data freshness indicators
- your LSTM/Prophet forecasting service
