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
        background: {
            default: '#06588e',
        }
    },
    typography: {
        fontFamily: roboto.style.fontFamily,
        h1: {
            fontSize: '3rem',
        }
    },
    components: {
        MuiCssBaseline: {
          styleOverrides: `
            body {
                color: white;
                background: linear-gradient(180deg, #64d4ef, #06588e);
            }
            @media (prefers-color-scheme: dark) {
                body {
                  background: linear-gradient(180deg, #06588e, black);
                }
              }
          `,
        },
      },
});

export default theme;