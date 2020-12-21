import {createMuiTheme} from '@material-ui/core/styles';



const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#1976d2'
        }
    },
    typography: {
        h5: {
            fontWeight: 500
        }
    }
});

export default theme;