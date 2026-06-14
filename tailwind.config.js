module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: 'var(--neo-bg)',
          surface: 'var(--neo-surface)',
          ink: 'var(--neo-ink)',
          border: 'var(--neo-border)',
          yellow: 'var(--neo-yellow)',
          pink: 'var(--neo-pink)',
          cyan: 'var(--neo-cyan)',
          lime: 'var(--neo-lime)',
          purple: 'var(--neo-purple)',
          orange: 'var(--neo-orange)',
          red: 'var(--neo-red)',
          blue: 'var(--neo-blue)'
        }
      },
      borderWidth: {
        neo: 'var(--neo-bw)'
      },
      borderRadius: {
        neo: 'var(--neo-radius)'
      },
      boxShadow: {
        'neo-sm': 'var(--neo-shadow-sm)',
        neo: 'var(--neo-shadow-md)',
        'neo-lg': 'var(--neo-shadow-lg)'
      }
    }
  },
  plugins: [
    function ({ addVariant }) {
      addVariant('light', 'html.light &')
    }
  ]
};
