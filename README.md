# CardCalc

[![License: CC BY-NC-SA 4.0](https://licensebuttons.net/l/by-nc-sa/4.0/80x15.png)](https://creativecommons.org/licenses/by-nc-sa/4.0/)

A mobile-friendly percentage calculator for card show vendors. Quickly calculate discounted prices based on percentage multiples.

## Features

- **Quick Calculations**: Input a base price and see all percentage discounts in multiples
- **Configurable Steps**: Choose percentage increments from 1% to 10% (default: 5%)
- **Save Calculations**: Save your calculations with custom names for quick access
- **Saved Calculations Menu**: Access all your saved calculations from the hamburger menu
- **Dark/Light Mode**: Toggle between themes with the button at the bottom right
- **Mobile-Friendly**: Responsive design optimized for mobile devices

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
npm start
```

## Usage

1. Enter a base price in the input field
2. Select your desired percentage step (1-10%)
3. View all calculated prices from 100% down to 0%
4. Click "Save Calculation" to save with an optional name
5. Access saved calculations from the hamburger menu (top left)
6. Toggle dark/light mode with the button at the bottom right

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- shadcn/ui components
- LocalStorage for data persistence
