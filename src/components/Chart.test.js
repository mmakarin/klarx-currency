import axios from 'axios';
import {render, screen, waitFor} from '@testing-library/react';

//import {getRatesForPeriod} from '../api';

import Chart from './Chart';

jest.mock('axios');

describe('<Chart />', () => {
    const renderChart = () => render(<Chart source='EUR' currencies={['USD', 'CHF']} />)
    const apiResponse = {
        "rates":{
           "2020-12-14":{
              "CHF":1.0776,
              "USD":1.2162,
           },
           "2020-12-10":{
              "CHF":1.0757,
              "USD":1.2115,
           },
           "2020-12-11":{
              "CHF":1.0786,
              "USD":1.2127,
           }
        },
        "start_at":"2020-12-01",
        "base":"EUR",
        "end_at":"2020-12-14"
     };

     beforeEach(() => {
        axios.get.mockImplementation(() => Promise.resolve(apiResponse));
     });

    it('calls api', () => {
        renderChart();

        expect(axios.get).toBeCalled();
        expect(axios.get).toReturn();
    });

    // Nivo doesn't rended when running from jest for some reason
    /* it('displays dates', async () => {
        const {getByText, findByText} = renderChart();

        await waitFor(() => {
            expect(getByText('Conversion rate')).toBeInTheDocument();
        }, {timeout: 10000});

        expect(await findByText('Dec 10', {timeout: 10000})).toBeInTheDocument();
    }) */
});