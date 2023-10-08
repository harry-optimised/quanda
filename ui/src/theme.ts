import { defaultTheme, mergeTheme } from 'evergreen-ui';

const theme = mergeTheme(defaultTheme, {
  components: {
    Button: {
      appearances: {
        primary: {
          color: 'black',
          paddingX: 12,
          paddingY: 8,
          borderRadius: 5,
          backgroundColor: '#FFD447',
          transition:
            'background-color 0.1s ease-out, box-shadow 0.2s ease-out',
          selectors: {
            _hover: {
              backgroundColor: '#BFC4C2'
            },
            _focus: {
              boxShadow: 'transparent'
            }
          }
        },
        secondary: {
          color: 'black',
          paddingX: 12,
          paddingY: 8,
          borderRadius: 5,
          backgroundColor: '#EEEEEE',
          transition:
            'background-color 0.1s ease-out, box-shadow 0.2s ease-out',
          selectors: {
            _hover: {
              backgroundColor: '#BFC4C2'
            },
            _focus: {
              boxShadow: 'transparent'
            }
          }
        }
      }
    }
  }
});

export default theme;
