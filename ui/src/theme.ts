import { defaultTheme, mergeTheme } from 'evergreen-ui';
import { Background } from 'reactflow';
import PrimaryField from './components/PrimaryField';

const BACKGROUND = '#FFFFFF';
const GRAY = '#C5C5C5';
const TINT3 = '#D9E8E7';
const TINT4 = '#8CBAB7';
const TINT5 = '#4D807D';
const TINT6 = '#26403E';
const ACCENT = '#888888';
const HIGHLIGHT = '#F2F2F2';
const DANGER = '#F67E7D';

const theme = mergeTheme(defaultTheme, {
  components: {
    Button: {
      appearances: {
        primary: {
          backgroundColor: TINT5,
          color: BACKGROUND,
          fontWeight: '600',
          selectors: {
            _disabled: {
              backgroundColor: GRAY
            },
            _hover: {
              opacity: 0.9,
              transition: 'opacity 0.1s ease-in-out'
            },
            _active: {
              boxShadow: `none`
            }
          }
        }
      }
    },
    Input: {
      baseStyle: {
        backgroundColor: BACKGROUND,
        borderRadius: 4,
        borderWidth: 0,
        border: `none`
      },
      appearances: {
        default: {
          backgroundColor: BACKGROUND,
          borderRadius: 4,
          borderWidth: 0,
          border: `1px solid ${GRAY}`,
          boxShadow: 'none',
          selectors: {
            _focus: {
              border: `1px solid ${GRAY}`,
              boxShadow: `0 0 2px 2px ${TINT5}`
            }
          }
        }
      }
    },
    Select: {
      appearances: {
        default: {
          backgroundColor: BACKGROUND,
          borderRadius: 4,
          borderWidth: 0,
          border: `1px solid ${GRAY}`,
          boxShadow: 'none',
          selectors: {
            _focus: {
              border: `1px solid ${GRAY}`,
              boxShadow: `0 0 2px 2px ${TINT5}`
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
        border: 'none'
      },
      appearances: {
        default: {
          backgroundColor: BACKGROUND,
          borderRadius: 4,
          borderWidth: 0,
          border: `1px solid ${GRAY}`,
          boxShadow: 'none',
          selectors: {
            _focused: {
              border: `1px solid ${GRAY}`,
              boxShadow: `0 0 2px 2px ${TINT5}`
            }
          }
        }
      }
    },
    Tab: {
      baseStyle: {
        color: BACKGROUND,
        fontWeight: '600',
        padding: 8,
        borderRadius: 4,
        marginRight: 8,
        userSelect: 'none'
      },
      appearances: {
        custom: {
          selectors: {
            _current: {
              color: TINT6,
              backgroundColor: BACKGROUND,
              userSelect: 'none'
            },
            _focus: {
              boxShadow: `none`
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
