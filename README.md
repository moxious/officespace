# Office Space Meeting Cost Calculator

*Vibecoded with Cursor*

A real-time meeting cost calculator inspired by Office Space. Track the cost of your meetings as they happen, because time is money! Features Peter Gibbons' watchful gaze to ensure you're not wasting company resources.

## Features

- Real-time cost calculation
- UTC timezone support for global teams
- Per second, minute, and hour cost breakdown
- Clean, modern UI with Tailwind CSS
- Fully responsive design

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/officespace.git
cd officespace
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter the number of people in the meeting
2. Enter the cost per person per hour
3. Click "Start Meeting" to begin tracking costs
4. Watch the money tick away in real-time
5. Click "End Meeting" when you're done

## Development

The application is built with:
- Next.js 14
- React
- TypeScript
- Tailwind CSS

All timestamps are handled in UTC to ensure consistent calculations across different timezones.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
