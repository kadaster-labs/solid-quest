import { Roboto } from 'next/font/google';
import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

export const roboto = Roboto({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    fallback: ['Helvetica', 'Arial', 'sans-serif'],
});

// Create a theme instance.
const theme = createTheme({
    palette: {
        primary: {
            main: '#00889e',
        },
        secondary: {
            main: '#0f496f',
        },
        error: {
            main: red.A400,
        },
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: {
            fontSize: '3rem',
        }
    },
});

export default theme;