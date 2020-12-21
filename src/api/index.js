import axios from 'axios';
import CurrencyLayerClient from 'currencylayer-client';
import dayjs from 'dayjs';
import {mapValues, mapKeys, pick, flow, range, map} from 'lodash/fp';

import {DATE_FORMAT} from '../utils/date';

const currencylayerApi = new CurrencyLayerClient({apiKey: '2b4acb5317a034357381372dac9051b9'});

axios.interceptors.response.use(response =>
    response?.config?.rawData ? response : response?.data
);

// {EURUSD: 1.19, EURCHF: 1.08} => {USD: 1.19, CHF: 1.08}
const convertCLResponseToShortFormat = ({quotes, ...rest}) => ({
    quotes: mapKeys(currencyPairString => currencyPairString.slice(3), quotes),
    ...rest
});

export function getHistoricalRatesCL(params) {
    return currencylayerApi.historical(params)
        .then(convertCLResponseToShortFormat);
};

// Hacked version of /timeframe endpoint which is not available on a free plan
export function getRatesForPeriodCL({start_date, end_date, ...params}) {
    const differenceInDays = dayjs(end_date).diff(dayjs(start_date), 'day') + 1;

    const dates = flow(
        range(0),
        map(i => dayjs(start_date).add(i, 'day').format(DATE_FORMAT))
    )(differenceInDays);

    return Promise.all(dates.map(date => getHistoricalRates({date, ...params})));
}

export function getLatestRatesCL({source, currencies}) {
    return currencylayerApi.live({source, currencies}).then(convertCLResponseToShortFormat);
}

export function getLatestRates({source, currencies}) {
    return axios.get('https://api.exchangeratesapi.io/latest', {
        params: {
            base: source,
        }
    }).then(({rates, base, ...rest}) => ({
        quotes: currencies ? pick(currencies, rates) : rates,
        source: base,
        ...rest
    }));
}

export function getRatesForPeriod({start_date, end_date, source, currencies}) {
    return axios.get('https://api.exchangeratesapi.io/history', {
        params: {
            base: source,
            start_at: start_date,
            end_at: end_date
        }
    }).then(({rates, base, ...rest}) => ({
        quotes: currencies ? mapValues(pick(currencies), rates) : rates,
        source: base,
        ...rest
    }));
}

export function getHistoricalRates({date, source, currencies}) {
    return axios.get(`https://api.exchangeratesapi.io/${date}`, {
        params: {
            base: source
        }
    }).then(({rates, base, ...rest}) => ({
        quotes: currencies ? pick(currencies, rates) : rates,
        source: base,
        ...rest
    }));
}