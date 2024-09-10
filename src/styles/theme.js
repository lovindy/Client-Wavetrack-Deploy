import { createTheme } from '@mui/material/styles';
import { responsiveFontSizes } from '@mui/material/styles';

// Define the theme
let theme = createTheme({
    palette: {
        primary: {
            main: '#2196F3',
        },
        background: {
            default: '#F9FAFB', // Light gray background color
        },
        secondary: {
            main: '#797979',
        },
        text: {
            disabled: '#EEF7FE',
            secondary: '#797979',
        },
    },
    typography: {
        // Define default font family
        fontFamily: 'Roboto, sans-serif',
        // Define other typography settings as needed
        h4: {
            fontSize: '32px',
        },
        // Define for Form title
        formTitle: {
            fontSize: '18px',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 500,
        },
    },
});

// Apply responsive font sizes
theme = responsiveFontSizes(theme);

export default theme;
