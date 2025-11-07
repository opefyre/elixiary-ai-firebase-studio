import type {Config} from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        body: ['var(--font-inter)', 'Inter', 'sans-serif'],
        headline: ['var(--font-plus-jakarta)', '"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 6px)',
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.03)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.05)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.1)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'subtle-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        'dice-roll': {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '25%': { transform: 'rotate(5deg) scale(1.05)' },
          '50%': { transform: 'rotate(-3deg) scale(0.98)' },
          '75%': { transform: 'rotate(3deg) scale(1.02)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        'subtle-pulse': 'subtle-pulse 3s ease-in-out infinite',
        dice: 'dice-roll 4s ease-in-out infinite',
      },
      typography: ({theme}) => ({
        DEFAULT: {
          css: {
            color: theme('colors.muted.foreground'),
            strong: {
              color: theme('colors.foreground'),
              fontWeight: theme('fontWeight.semibold'),
            },
            p: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
            },
            ul: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
            },
            ol: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
            },
            li: {
              marginTop: theme('spacing.1'),
              marginBottom: theme('spacing.1'),
            },
            h1: {
              color: theme('colors.blue.400'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.4'),
              fontSize: theme('fontSize.3xl')[0],
              lineHeight: theme('fontSize.3xl')[1].lineHeight,
            },
            h2: {
              color: theme('colors.blue.400'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.3'),
              fontSize: theme('fontSize.2xl')[0],
              lineHeight: theme('fontSize.2xl')[1].lineHeight,
            },
            h3: {
              color: theme('colors.blue.400'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.2'),
              fontSize: theme('fontSize.xl')[0],
              lineHeight: theme('fontSize.xl')[1].lineHeight,
            },
            h4: {
              color: theme('colors.blue.400'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.3'),
              marginBottom: theme('spacing.2'),
              fontSize: theme('fontSize.lg')[0],
              lineHeight: theme('fontSize.lg')[1].lineHeight,
            },
            h5: {
              color: theme('colors.blue.400'),
              fontWeight: theme('fontWeight.bold'),
            },
            h6: {
              color: theme('colors.blue.400'),
              fontWeight: theme('fontWeight.bold'),
            },
          },
        },
        invert: {
          css: {
            color: theme('colors.muted.foreground'),
            strong: {
              color: theme('colors.foreground'),
              fontWeight: theme('fontWeight.semibold'),
            },
            p: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
            },
            ul: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
            },
            ol: {
              marginTop: theme('spacing.2'),
              marginBottom: theme('spacing.2'),
            },
            li: {
              marginTop: theme('spacing.1'),
              marginBottom: theme('spacing.1'),
            },
            h1: {
              color: theme('colors.blue.300'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.6'),
              marginBottom: theme('spacing.4'),
              fontSize: theme('fontSize.3xl')[0],
              lineHeight: theme('fontSize.3xl')[1].lineHeight,
            },
            h2: {
              color: theme('colors.blue.300'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.5'),
              marginBottom: theme('spacing.3'),
              fontSize: theme('fontSize.2xl')[0],
              lineHeight: theme('fontSize.2xl')[1].lineHeight,
            },
            h3: {
              color: theme('colors.blue.300'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.4'),
              marginBottom: theme('spacing.2'),
              fontSize: theme('fontSize.xl')[0],
              lineHeight: theme('fontSize.xl')[1].lineHeight,
            },
            h4: {
              color: theme('colors.blue.300'),
              fontWeight: theme('fontWeight.bold'),
              marginTop: theme('spacing.3'),
              marginBottom: theme('spacing.2'),
              fontSize: theme('fontSize.lg')[0],
              lineHeight: theme('fontSize.lg')[1].lineHeight,
            },
            h5: {
              color: theme('colors.blue.300'),
              fontWeight: theme('fontWeight.bold'),
            },
            h6: {
              color: theme('colors.blue.300'),
              fontWeight: theme('fontWeight.bold'),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
