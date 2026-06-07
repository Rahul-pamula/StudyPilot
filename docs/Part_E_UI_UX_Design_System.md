# PART E: UI/UX DESIGN SYSTEM

## E.1 Design Tokens

```css
/* tailwind.config.js extended */
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          900: '#1e3a8a',
        },
        accent: {
          green: '#10b981',
          red: '#ef4444',
          yellow: '#f59e0b',
        }
      },
      animation: {
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'confetti': 'confetti 1s ease-out forwards',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      }
    }
  }
};
```

## E.2 Component Library (Custom)

### Focus Score Ring
```tsx
// FocusRing.tsx - Animated circular progress
const FocusRing = ({ score, size = 120 }: { score: number; size?: number }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (score / 100) * circumference;
  
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size/2} cy={size/2} r="45"
          stroke="#2d2d2d" strokeWidth="8" fill="none"
        />
        <circle
          cx={size/2} cy={size/2} r="45"
          stroke="url(#gradient)" strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="none"
        >
          <animate attributeName="stroke-dashoffset" from={circumference} to={offset} dur="1s" />
        </circle>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-xs text-gray-400">Focus Score</span>
      </div>
    </div>
  );
};
```

### Toast Notifications (Beautiful)
```tsx
// Custom toast with slide animation
toast.success({
  title: "🎉 Study session complete!",
  description: "You focused for 2 hours 15 minutes",
  duration: 4000,
  icon: <Rocket className="text-green-500" />
});
```
