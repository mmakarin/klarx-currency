import {useState, useEffect} from 'react';
import dayjs from 'dayjs';
import {Typography} from '@material-ui/core';

import {getLatestRates} from '../api';
import {uncappedMap} from '../utils/lodash+';

import CurrencyPairExchanger from './CurrencyPairExchanger';

const styles = {
    title: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        //marginBottom: 24
    },
    lastUpdated: {
        fontSize: 13
    }
};

const LatestRates = ({style, source, currencies}) => {
    const [rates, setRates] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    useEffect(
        () => {
            const apiCall = () => getLatestRates({source, currencies})
                .then(({quotes}) => {
                    setRates(quotes);
                    setLastUpdated(dayjs().valueOf());
                });

            apiCall();
            // Updated every 10 minutes
            const interval = setInterval(apiCall, 10 * 60 * 1000);

            return () => clearInterval(interval);
        },
        [source, currencies]
    );

    return (
        <div style={style}>
            <div style={styles.title}>
                <Typography paragraph variant='h5'>Latest exchange rates</Typography>

                {rates && (
                    <Typography
                        style={styles.lastUpdated}
                        color='textSecondary'
                    >
                        Last update: {lastUpdated && dayjs(lastUpdated).format('HH:mm')}
                    </Typography>
                )}
            </div>

            {/* {uncappedMap((val, currency) => (
                <div key={currency}>
                    {source}-{currency}: {val}
                </div>
            ), rates)} */}

            {uncappedMap((val, currency) => (
                <CurrencyPairExchanger
                    key={currency}
                    baseCurrency={source}
                    targetCurrency={currency}
                    rate={val}
                />
            ), rates)}
        </div>
    )
};

export default LatestRates;