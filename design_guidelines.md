# Option Scalper Calculator – India: Design Guidelines

## Design Approach
**Reference-Based Approach**: Modern trading dashboard aesthetic inspired by premium financial applications (Robinhood, TradingView) with glassmorphic design trends and neon accent treatments.

---

## Core Design Elements

### A. Layout System

**Desktop Layout (Landscape)**
- Two-panel horizontal split layout
- Left panel: Input controls and configuration
- Right panel: Results display and output cards
- Equal-width panels with balanced visual weight
- Container: Large glass card with 20px rounded corners

**Mobile Layout (Vertical Stack)**
- Single column auto-stacking behavior
- Input section appears first
- Results section follows below
- Maintains card styling and spacing

**Spacing System**
- Use consistent spacing units: 8px, 16px, 24px, 32px
- Card padding: 32px on desktop, 24px on mobile
- Input field spacing: 16px vertical gap between fields
- Section spacing: 24px between major groups

---

### B. Visual Treatment

**Glassmorphism Effects**
- Backdrop blur on main container card
- Semi-transparent white overlay (10-15% opacity)
- Deep soft drop shadows for elevation
- Inner glow effects on interactive elements

**Background**
- Premium gradient: `linear-gradient(135deg, #0f2027, #203a43, #2c5364)`
- Full viewport coverage
- Fixed positioning to prevent scroll artifacts

**Card Styling**
- Main container: 20px rounded corners
- Result cards: 14px rounded corners
- Inner shadows for depth
- Subtle border highlights (1px white/10% opacity)

---

### C. Typography

**Hierarchy**
- App title: Large, bold, white with subtle glow
- Section labels: Medium weight, 14px, uppercase tracking
- Input labels: Regular weight, 12px
- Result values: Bold, large (24-32px for P/L display)
- Helper text: Light weight, 11px, reduced opacity

**Font Selection**
- Use modern sans-serif: Inter, SF Pro Display, or system-ui
- Single font family throughout
- Weights: 400 (regular), 500 (medium), 700 (bold)

---

### D. Component Library

**Input Fields**
- Fixed equal widths across all inputs
- 14px rounded corners
- Glassmorphic background with subtle border
- Neon glow on focus (cyan/blue accent color)
- Smooth scale animation on focus (scale: 1.02)
- Padding: 12px horizontal, 10px vertical

**Dropdown Select**
- Matches input field styling
- Custom arrow indicator
- Smooth transition on open
- Same focus glow treatment

**Buttons**

*Primary Action Buttons*
- Gradient background (blue to cyan range)
- 14px rounded corners
- Hover: Neon glow effect (box-shadow)
- Scale animation on hover (scale: 1.05)
- Padding: 12px 24px

*Quick Profit Preview Buttons*
- Four buttons: +1, +2, +5, +10
- Compact size, equal width
- Arranged horizontally
- Glassmorphic background with accent border
- Instant calculation trigger on click

**Result Cards**

*Profit Card (Green)*
- Light green background (#10b98120 or similar)
- Green border accent
- Rounded corners (14px)
- Inner shadow for depth

*Loss Card (Red)*
- Light red background (#ef444420 or similar)
- Red border accent
- Same structural styling as profit card

*Result Display Elements*
- Points Captured: Regular weight
- Profit/Loss: Large, bold, animated counter
- Capital Required: Standard size
- ROI %: Medium emphasis
- Breakeven Price: Standard size
- Stop-loss Risk: **Always bold and red** regardless of card color

---

### E. Animations

**Profit/Loss Counter Animation**
- Animate from 0 to final value using requestAnimationFrame
- Duration: 800-1000ms
- Easing: Ease-out for natural deceleration
- Update display on each frame

**Input Focus Animations**
- Neon glow: 300ms ease-in-out transition
- Scale: 200ms ease-out
- Border color shift: 300ms

**Button Interactions**
- Hover glow: 250ms ease
- Scale on hover: 200ms ease-out
- Active state: Quick scale down (0.95) with 100ms

**Card Entrance**
- Subtle fade-in on calculation completion
- 300ms duration

---

### F. Responsive Breakpoints

**Desktop (≥1024px)**
- Two-panel landscape layout active
- Maximum container width: 1200px
- Centered on viewport

**Tablet (768px - 1023px)**
- Begin transition to vertical stack
- Reduce padding slightly

**Mobile (≤767px)**
- Full vertical stack layout
- Inputs and results in single column
- Full-width cards with horizontal padding: 16px
- Reduce text sizes proportionally
- Quick preview buttons: 2x2 grid or vertical stack

---

### G. Color Palette (Accent Colors Only)

**Interactive Elements**
- Primary glow: Cyan (#00d4ff) with 40% opacity blur
- Secondary glow: Blue (#0099ff) 
- Focus state: Bright cyan with glow

**Status Colors**
- Profit: Green (#10b981) with light backgrounds
- Loss: Red (#ef4444) with light backgrounds
- Neutral: White/light gray for labels

**Stop-loss Risk**
- Always use bold red (#dc2626) regardless of card state

---

## Auto-Fill Logic

**Lot Size Mapping**
- NIFTY → 75 lots
- BANKNIFTY → 35 lots
- FINNIFTY → 65 lots
- MIDCPNIFTY → 140 lots
- NIFTYNEXT50 → 25 lots
- SENSEX → 20 lots

Auto-populate lot size field when instrument is selected.

---

## Images

**No images required** - This is a pure functional calculator tool with glassmorphic UI treatment. All visual interest comes from gradients, glass effects, and neon glows.