import { defaultTheme, mergeTheme } from 'evergreen-ui';

const BACKGROUND = '#FFFFFF';
const PRIMARY = '#394e5c';
const SECONDARY = '#8ebdb5';

const GRAY = '#C5C5C5';
const TINT3 = '#D9E8E7';
const TINT4 = '#8CBAB7';

const ACCENT = '#888888';
const HIGHLIGHT = '#F2F2F2';
const DANGER = '#F67E7D';

const theme = mergeTheme(defaultTheme, {
  fontFamilies: {
    display: 'Manrope, sans-serif',
    ui: 'Manrope, sans-serif',
    mono: 'Manrope, sans-serif'
  },
  components: {
    Button: {
      appearances: {
        primary: {
          backgroundColor: SECONDARY,
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
        },
        secondary: {
          backgroundColor: 'rgba(0, 0, 0, 0)',
          border: `1px solid ${BACKGROUND}`,
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
              boxShadow: `0 0 2px 2px ${SECONDARY}`
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
              boxShadow: `0 0 2px 2px ${SECONDARY}`
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
        color: PRIMARY
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
              boxShadow: `0 0 2px 2px ${SECONDARY}`
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
              color: PRIMARY,
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
    secondary: SECONDARY,
    primary: PRIMARY,
    accent: ACCENT,
    danger: DANGER,
    highlight: HIGHLIGHT
  }
});

export default theme;
