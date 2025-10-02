import * as React from 'react';

// CSS for spinner (tailwind or plain CSS)
const spinnerStyle = {
  borderTop: '4px solid #3b82f6',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

// Inject keyframes for spin animation globally (if no tailwind)
const styleSheet = document.styleSheets[0];
if (styleSheet) {
  const keyframes = `@keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }`;
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
}

export const Spinner = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => {
  return <div ref={ref} style={spinnerStyle} {...props} role="status" aria-label="Loading" />;
});

Spinner.displayName = 'Spinner';
