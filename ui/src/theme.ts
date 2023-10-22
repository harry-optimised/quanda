import { defaultTheme, mergeTheme } from 'evergreen-ui';

const theme = mergeTheme(defaultTheme, {
  components: {
    Button: {
      appearances: {
        text: {
          marginX: 0,
          paddingX: 0,
          paddingY: 8,
          borderRadius: 5,
          backgroundColor: 'white',
          selectors: {
            _hover: {
              backgroundColor: 'white',
              opacity: 0.8
            },
            _active: {
              backgroundColor: 'white'
            },
            _focus: {
              boxShadow: '0 0 0 2px white'
            }
          }
        }
      }
    }
  }
});

export default theme;
