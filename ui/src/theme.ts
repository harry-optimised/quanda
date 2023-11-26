import { defaultTheme, mergeTheme } from 'evergreen-ui';
import { Background } from 'reactflow';
import PrimaryField from './components/PrimaryField';

const BACKGROUND = '#FFFFFF';
const TINT3 = '#F2F5F8';
const TINT4 = '#D7E1EA';
const TINT5 = '#AABBC9';
const TINT6 = '#38546B';
const ACCENT = '#FFBF47';
const DANGER = '#F67E7D';

const theme = mergeTheme(defaultTheme, {
  components: {
    Button: {
      appearances: {
        primary: {
          backgroundColor: TINT6,
          color: BACKGROUND,
          fontWeight: '600'
        }
      }
    },
    Input: {
      appearances: {
        default: {
          backgroundColor: BACKGROUND,
          borderRadius: 4,
          borderWidth: 0,
          boxShadow: `0 0 1px 1px ${TINT5}`,
          selectors: {
            _focus: {
              boxShadow: `0 0 2px 2px ${TINT6}`
            }
          }
        }
      }
    },
    Card: {
      baseStyle: {
        borderRadius: 4
      }
    },
    Heading: {
      baseStyle: {
        color: TINT6
      }
    },
    TagInput: {
      baseStyle: {
        backgroundColor: BACKGROUND,
        borderRadius: 4,
        borderWidth: 0,
        width: '100%',
        selectors: {}
      }
    },
    Tab: {
      appearances: {
        secondary: {
          selectors: {
            _current: {
              color: BACKGROUND,
              backgroundColor: TINT6,
              userSelect: 'none'
            },
            _focus: {
              boxShadow: `none`
            },
            _before: {
              color: BACKGROUND,
              backgroundColor: TINT6,
              userSelect: 'none'
            }
          }
        }
      }
    }
  },
  colors: {
    background: BACKGROUND,
    tint3: TINT3,
    tint4: TINT4,
    tint5: TINT5,
    tint6: TINT6,
    accent: ACCENT,
    danger: DANGER
  }
});

export default theme;
