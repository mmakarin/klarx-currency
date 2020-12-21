import {useEffect, useState, useMemo, useCallback} from 'react';
import {ResponsiveLine} from '@nivo/line'
import {sortBy, flow} from 'lodash/fp';
import {Select, MenuItem, CircularProgress, FormControl, InputLabel, TextField, Typography} from '@material-ui/core';

import {uncappedMap} from '../utils/lodash+';
import {getRatesForPeriod} from '../api';

const CHART_OFFSET = 60;

const styles = {
    chartContainer: {
        height: 400
    },
    chartContainerLoading: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    title: {
        marginLeft: CHART_OFFSET
    },
    filters: {
        display: 'flex',
        alignItems: 'baseline'
    },
    dateRange: {
        minWidth: 180,
        marginLeft: CHART_OFFSET,
        marginRight: 8
    },
    currencySelect: {
        minWidth: 120
    }
};

const LineChart = ({data}) => {
    if (!data) {
        return (
            <div
                style={{
                    ...styles.chartContainer,
                    ...styles.chartContainerLoading
                }}
            >
                <CircularProgress />
            </div>
        );
    }

    return (
        <div style={styles.chartContainer}>
            <ResponsiveLine
                data={data}
                margin={{top: 20, right: 20, bottom: 20, left: CHART_OFFSET}}
                //xScale={{ type: 'point' }}
                xScale={{
                    type: 'time',
                    format: '%Y-%m-%d',
                    useUTC: false,
                    precision: 'day',
                }}
                xFormat="time:%Y-%m-%d"
                yScale={{ type: 'linear', min: 1, max: 1.25, stacked: false, reverse: false }}
                yFormat=" >-.4f"
                curve="cardinal"
                enableSlices='x'
                axisBottom={{
                    format: '%b %d',
                    tickValues: 'every 1 days',
                    legend: 'Date',
                    legendOffset: -12,
                }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Conversion rate',
                    legendOffset: -40,
                    legendPosition: 'middle'
                }}
                pointSize={10}
                pointColor={{ theme: 'background' }}
                pointBorderWidth={2}
                pointBorderColor={{ from: 'serieColor' }}
                pointLabelYOffset={-12}
                useMesh={true}
            />
        </div>
    );
};

/**
 * reshapes data to match nivo api
 * 
 * Array<{
        id:   string | number
        data: Array<{
            x: number | string | Date
            y: number | string | Date
        }>
  }>
 */
const transformDataForChart = ({quotes}, selectedCurrencies) => selectedCurrencies.map(currency => ({
    id: currency,
    data: flow(
        uncappedMap((rates, date) => ({
            x: date,
            y: rates[currency]
        })),
        // Nivo is sensitive to the order of points
        sortBy('x')
    )(quotes)
}));

const Chart = ({source, currencies}) => {
    // TBD: Last 2 weeks is 14 days or logical 2 weeks?
    const [dateRange] = useState(['2020-12-01', '2020-12-14']);
    const [selectedCurrencies, setSelectedCurrencies] = useState(currencies)
    const [data, setData] = useState(null);

    useEffect(
        () => getRatesForPeriod({
            start_date: dateRange[0],
            end_date: dateRange[1],
            source,
            currencies: selectedCurrencies
        // No reason to store rawData
        }).then(rawData =>
            setData(transformDataForChart(rawData, selectedCurrencies))
        ),
        [dateRange, source, selectedCurrencies]
    );

    const currencyOptions = useMemo(
        () => currencies.map(currency => (
            <MenuItem key={currency} value={currency}>
                {currency}
            </MenuItem>
        )),
        [currencies]
    );
    const handleCurrenciesChange = useCallback(
        e => setSelectedCurrencies(e.target.value),
        [setSelectedCurrencies]
    );

    return (
        <div>
            <Typography
                style={styles.title}
                paragraph
                variant='h5'
            >
                Chart
            </Typography>

            <div style={styles.filters}>
                {/* TODO: Replace with a datepicker */}
                <TextField
                    style={styles.dateRange}
                    disabled
                    label='Date range'
                    value={`${dateRange[0]} - ${dateRange[1]}`}
                />
                {/* <span style={styles.dateRange}>{dateRange[0]} - {dateRange[1]}</span> */}
                
                <FormControl>
                    <InputLabel id='chartSelectLabel'>Currencies</InputLabel>
                    <Select
                        style={styles.currencySelect}
                        labelId='chartSelectLabel'
                        multiple
                        placeholder='Select currencies'
                        value={selectedCurrencies}
                        onChange={handleCurrenciesChange}
                    >
                        {currencyOptions}
                    </Select>
                </FormControl>
            </div>


            <LineChart data={data} />
        </div>
    )
};

export default Chart;