import {useState, useEffect, useCallback} from 'react';
import {TextField, Typography} from '@material-ui/core';

import {getHistoricalRates} from '../api';
import {uncappedMap} from '../utils/lodash+';
import {dayjs, DATE_FORMAT} from '../utils/date';

import CurrencyPairExchanger from '../components/CurrencyPairExchanger';

const MIN_DATE = '2000-01-01';

const styles = {
    datePicker: {
        marginBottom: 8
    }
}

const HistoricalRates = ({style, source, currencies}) => {
    const [rates, setRates] = useState(null);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

    const isValidDate = dayjs(date).isValid()
        && dayjs(date).isSameOrBefore(dayjs(), 'day')
        && dayjs(date).isAfter(dayjs(MIN_DATE), 'day');

    useEffect(
        () => {
            getHistoricalRates({date, source, currencies})
                .then(({quotes}) => setRates(quotes));
        },
        [date, source, currencies]
    );

    const handleDateChange = useCallback(
        e => setDate(date => dayjs(e.target.value).isValid() ? e.target.value : date),
        [setDate]
    );

    return (
        <div style={style}>
            <Typography paragraph variant='h5'>Historical rates</Typography>
            
            <TextField
                style={styles.datePicker}
                label='Date'
                type='date'
                inputProps={{
                    min: MIN_DATE,
                    max: dayjs().format(DATE_FORMAT)
                }}
                value={date}
                onChange={handleDateChange}
                error={!isValidDate}
                helperText={!isValidDate && 'Invalid date'}
            />

            {/* {uncappedMap((val, currency) => (
                <div key={currency}>
                    {source}-{currency}: {val}
                </div>
            ), rates)} */}


            {isValidDate && uncappedMap((val, currency) => (
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

export default HistoricalRates;