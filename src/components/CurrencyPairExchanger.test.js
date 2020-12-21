import {fireEvent, render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CurrencyPairExchanger from './CurrencyPairExchanger';

describe('<CurrencyPairExchanger />', () => {
    it('displays rate', () => {
        const rate = '1.0776';
        render(<CurrencyPairExchanger baseCurrency='EUR' targetCurrency='CHF' rate={1.0776} />);

        expect(screen.getByText(`Conversion rate 1 EUR = ${rate} CHF`)).toBeInTheDocument();
    });

    it('performs initial conversion', () => {
        const rate = '1.0776';
        render(<CurrencyPairExchanger baseCurrency='EUR' targetCurrency='CHF' rate={1.0776} />);

        const targetInput = screen.getByLabelText('CHF');
        expect(targetInput).toHaveDisplayValue(rate);
    });

    it('converts EUR to CHF', () => {
        const rate = 1.0845;
        render(<CurrencyPairExchanger baseCurrency='EUR' targetCurrency='CHF' rate={rate} />);

        const baseInput = screen.getByLabelText('EUR');
        fireEvent.change(baseInput, {
            target: {
                value: '25'
            }
        });

        const targetInput = screen.getByLabelText('CHF');
        expect(targetInput).toHaveDisplayValue('27.1125');
    });
    it('converts CHF to EUR initially', () => {
        const rate = 1.0845;
        render(<CurrencyPairExchanger baseCurrency='EUR' targetCurrency='CHF' rate={rate} />);

        const targetInput = screen.getByLabelText('CHF');
        userEvent.clear(targetInput);
        userEvent.type(targetInput, '35');

        const baseInput = screen.getByLabelText('EUR');
        expect(baseInput).toHaveDisplayValue('32.2729');
    });

    it('values don\'t change when clicking other input', () => {
        const rate = 1.0845;
        render(<CurrencyPairExchanger baseCurrency='EUR' targetCurrency='CHF' rate={rate} />);

        const baseInput = screen.getByLabelText('EUR');
        const targetInput = screen.getByLabelText('CHF');

        userEvent.clear(baseInput);
        userEvent.type(baseInput, '11');

        expect(baseInput).toHaveDisplayValue('11');
        expect(targetInput).toHaveDisplayValue('11.9295');

        userEvent.click(targetInput);

        expect(baseInput).toHaveDisplayValue('11.0000');
        expect(targetInput).toHaveDisplayValue('11.9295');

        userEvent.click(baseInput);

        expect(baseInput).toHaveDisplayValue('11.0000');
        expect(targetInput).toHaveDisplayValue('11.9295');
    });
});