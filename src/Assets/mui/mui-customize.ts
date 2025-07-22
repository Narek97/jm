import { createTheme } from '@mui/material';

export const theme = createTheme({
  typography: {
    fontFamily: `Fira Sans, sans-serif`,
    fontWeightLight: 400,
    fontWeightRegular: 400,
    fontWeightMedium: 400,
  },
  palette: {},
  components: {
    MuiSwitch: {
      styleOverrides: {
        colorPrimary: {
          '&.Mui-checked': {
            color: '#2693e6',
          },
        },
        track: {
          '.Mui-checked.Mui-checked + &': {
            opacity: 1,
            backgroundColor: '#86d3ff',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
        startIcon: {
          marginLeft: 0,
          marginRight: 0,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: '0.1875rem', // 3px
          '&:hover': {
            backgroundColor: '#8E9092',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          height: '1rem', // 16px
          padding: '0.5rem', // 8px
          lineHeight: '1rem', // 16px
          fontSize: '0.75rem', // 12px
          color: '#545e6b',
        },
      },
    },
    MuiInput: {
      styleOverrides: {
        root: {
          '&:before': {
            borderBottom: '1px solid transparent', // Transparent before focus
          },
          '&:hover:not(.Mui-disabled):before': {
            borderBottom: '1px solid transparent', // Transparent on hover
          },
          '&:after': {
            borderBottom: '1px solid transparent', // Transparent on focus
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '&:hover': {},
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          padding: 0,
          margin: 0,
        },
        paper: {
          boxShadow: '0px 0.5rem 0.75rem -0.25rem rgba(0, 0, 0, 0.2) !important', // 8px 12px -4px
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: 0,
          display: 'block',
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: '0.0625rem', // 1px
          backgroundColor: '#1B87E6',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: '1.25rem', // 20px
          padding: '0.5rem 1.125rem 0.5rem 0.5rem', // 8px 18px 8px 8px
          textTransform: 'capitalize',
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          color: '#545E6B',
          '& .MuiSvgIcon-root': {
            fontSize: '1.25rem', // 20px
          },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          padding: '0.75rem 1.5rem', // 12px 24px
          '>tr>th': {
            fontFamily: `"FiraSans-Bold", serif`,
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: 0,
          color: '#545E6B',
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: '0.25rem', // 4px
        },
      },
    },
  },
});
