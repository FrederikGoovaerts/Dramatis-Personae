import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import { SimplePaletteColorOptions } from '@material-ui/core/styles/createPalette';
import {
    primaryColor,
    primaryDarkColor,
    primaryLightColor,
    secondaryColor,
    secondaryDarkColor,
    secondaryLightColor
} from '../assets/Colors';

const primary: SimplePaletteColorOptions = {
    light: primaryLightColor,
    main: primaryColor,
    dark: primaryDarkColor,
    contrastText: '#ffffff'
};

const secondary: SimplePaletteColorOptions = {
    light: secondaryLightColor,
    main: secondaryColor,
    dark: secondaryDarkColor,
    contrastText: '#ffffff'
};

export const theme = createMuiTheme({
    palette: {
        primary,
        secondary
    }
});
