# React CRM Application

## Overview
This is a React-based CRM application built with Vite, TypeScript, and shadcn/ui components. The application includes features for managing donations, finances, statistics, admin functions, news, and reports.

## Project Architecture
- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Context + TanStack Query
- **Analytics**: Custom analytics implementation

## Key Features
- Dashboard with multiple pages (donations, finances, statistics, admin, news, reports)
- Dark mode support with next-themes
- Responsive design
- Analytics tracking
- Form handling with react-hook-form and Zod validation

## Recent Changes
- 2024-09-23: GitHub Import Setup and ESLint Fixes
  - Successfully imported React CRM application from GitHub
  - Installed Node.js 20 runtime and all project dependencies
  - Fixed Vite configuration for Replit (port 5000, host 0.0.0.0, allowedHosts: ['all'])
  - Set up development workflow with hot module reloading
  - Configured deployment settings (autoscale, build: npm run build, run: npm run preview)
  - Fixed tailwind.config.ts ESLint issues (converted require() to ES6 imports)
  - Improved TypeScript type safety by replacing 666+ ESLint errors with proper types
  - Replaced 'any' types with 'unknown' and proper type definitions across the codebase
  - Application running successfully with analytics and full functionality

## Development Setup
- Development server runs on port 5000
- Built with `npm run build`
- Served in production with `npm run preview`

## Technologies Used
- React 18.3.1
- TypeScript 5.5.3
- Vite 5.4.1
- Tailwind CSS 3.4.11
- TanStack Query 5.56.2
- React Router DOM 6.26.2
- Framer Motion 12.6.5
- Lucide React icons
- Date-fns for date handling