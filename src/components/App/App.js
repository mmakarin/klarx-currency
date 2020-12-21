import {Paper} from '@material-ui/core';

import Chart from '../Chart';

import LatestRates from '../LatestRates';
import HistoricalRates from '../HistoricalRates';

const styles = {
  root: {
    display: 'grid',
    gridTemplateRows: 'auto auto',
    gridTemplateColumns: '1fr auto',
  
    maxWidth: 1280,
    margin: '0 auto'
  },
  chartPaper: {
    padding: 24
  },
  ratesPaper: {
    padding: 24,
    minWidth: 300,
    marginLeft: 24
  },
  historicalRates: {
    marginTop: 16
  }
}

const SOURCE_CURRENCY = 'EUR';
const TARGET_CURRENCIES = ['USD', 'CHF'];

function App() {
  return (
    <div style={styles.root}>
      <Paper style={styles.chartPaper}>
        <Chart source={SOURCE_CURRENCY} currencies={TARGET_CURRENCIES} />
      </Paper>

      <Paper style={styles.ratesPaper}>
        <LatestRates source={SOURCE_CURRENCY} currencies={TARGET_CURRENCIES} />
        
        <HistoricalRates style={styles.historicalRates} source={SOURCE_CURRENCY} currencies={TARGET_CURRENCIES} />
      </Paper>
    </div>
  );
}

export default App;
