# Currency exchange demo for Klarx

`yarn install && yarn start` will get you started

## Issues/TBD/Thoughts
- free `currencylayer` api doesn't support specifying `source` currency. It only allows `USD`. So we can't accurately get `EUR-OTHER` exchange rates without converting to the `USD` first which is error-prone a bad design overall.
I decided to use [exchangeratesapi.io](http://exchangeratesapi.io/) which has this capability as the data source. The `currencylayer` API is implemented thought. I you can give me an access key for the paid account we can give it a try.
- free `currencylayer` api doesn't support getting rates for the date range. I hacked together this feature using multiple calls to `/historical` api.
- Last two weeks is two logical weeks or 14 days?
- Rates are only available for Mon-Fri. For weekends the rate is the same as on friday. `exchangeratesapi.io` doesn't return it at all so there are gaps on the chart. But they can be easily removed if needed. I think it helps to visualise the week and aloows user to find the correct date/rate combination quicker.
- It's unclear how exactly rates should be displayed for the latest/historical section. I think that the main user focus for this screen is in the conversion. So I decided to display rate below each conversion input.
- It's unclear whether we should perform the conversion on the FE or on the BE (so API we are using is actually responsible for correct data no matter what). I decided to perform the conversion on the FE to showcase working with currencies.
- I opted to use the [bigint-money](https://github.com/evert/bigint-money) library for working with money data.
- `material-ui` is used to quickly style the app
- I'll add tests later if I can


## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.