import {useEffect, useState, useCallback} from 'react';
import {TextField} from '@material-ui/core';
import {Money} from 'bigint-money';

const PRECISION = 4;

const throws = fn => {
    try {
        fn();
    } catch {
        return true;
    }

    return false;
}

const styles = {
    root: {
        marginTop: 8,
        display: 'flex',
        alignItems: 'baseline'
    }
};

const CurrencyPairExchanger = ({style, baseCurrency, targetCurrency, rate}) => {
    const [activeInput, setActiveInput] = useState('base');
    const [baseAmount, setBaseAmount] = useState(() => new Money(1, baseCurrency));
    const [targetAmount, setTargetAmount] = useState(() => baseAmount.multiply(rate.toString()));
    const [inputValue, setInputValue] = useState(() => baseAmount.toFixed(PRECISION))

    // Perform conversion
    useEffect(
        () => {
            if (!inputValue || !activeInput || throws(() => new Money(inputValue))) {
                //setter(null);
                setBaseAmount(null);
                setTargetAmount(null);
                return;
            }

            const setter = activeInput === 'base' ? setTargetAmount : setBaseAmount;
            if (activeInput === 'base') {
                setter(new Money(inputValue).multiply(rate.toString()));
            } else if (activeInput === 'target') {
                setter(new Money(inputValue).divide(rate.toString()))
            }
        },
        [inputValue, activeInput, rate]
    );

    // Update input value on active input change
    /* useEffect(
        () => setInputValue(inputValue => {
            return inputValue
            ? ((activeInput === 'base' && baseAmount.toFixed(PRECISION)) ||
                (activeInput === 'target' && targetAmount.toFixed(PRECISION)))
            : '';
        }),
        [activeInput, baseAmount, targetAmount]
    ); */

    const handleInput = useCallback(
        e => {
            const val = e.target.value;

            // Filter out e and -
            if (!val || (val && !val.includes('-') && !val.includes('e'))) {
                setInputValue(val);
            }
        },
        []
    );

    const handleBaseFocus = () => {
        setActiveInput('base');
        setInputValue(baseAmount ? baseAmount.toFixed(PRECISION) : '')
    }
    const handleTargetFocus = () => {
        setActiveInput('target');
        setInputValue(targetAmount ? targetAmount.toFixed(PRECISION) : '')
    }

    return (
        <div
            style={{
                ...styles.root,
                ...style
            }}
            //onBlur={() => setActiveInput(null)}
        >
            <TextField
                step={1}
                type='number'
                inputProps={{min: 0}}
                label={baseCurrency}
                value={activeInput === 'base'
                    ? inputValue
                    : (baseAmount ? baseAmount.toFixed(PRECISION) : '')}
                variant='outlined'
                helperText={`Conversion rate 1 ${baseCurrency} = ${rate} ${targetCurrency}`}
                onChange={handleInput}
                //onFocus={() => setActiveInput('base')}
                onFocus={handleBaseFocus}
            />

            <span style={{margin: '0 4px'}}>=</span>

            <TextField
                type='number'
                inputProps={{min: 0}}
                label={targetCurrency}
                variant='outlined'
                value={activeInput === 'target'
                    ? inputValue
                    : (targetAmount ? targetAmount.toFixed(PRECISION) : '')}
                onChange={handleInput}
                //onFocus={() => setActiveInput('target')}
                onFocus={handleTargetFocus}
            />
        </div>
    );
};

export default CurrencyPairExchanger;