# Jurify - Legal Management Platform

## Overview

Jurify is a comprehensive legal management platform designed specifically for Brazilian legal professionals. The application focuses on streamlining legal document creation, client management, and case tracking through an intelligent template-based system with AI assistance. Built with a modern full-stack architecture, it emphasizes professional design, data clarity, and efficiency to help legal practitioners save valuable time while maintaining high standards of legal documentation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development practices
- **Routing**: Wouter for lightweight client-side routing
- **UI Framework**: Radix UI components with shadcn/ui design system following "New York" style
- **Styling**: Tailwind CSS with custom CSS variables for comprehensive theming support (light/dark modes)
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for robust form management

### Backend Architecture
- **Runtime**: Node.js with Express.js framework using ES modules
- **Language**: TypeScript for full-stack type safety
- **API Design**: RESTful API structure with JSON responses
- **Error Handling**: Centralized error handling middleware with structured error responses
- **Request Logging**: Custom middleware for API request tracking and performance monitoring

### Data Architecture
- **ORM**: Drizzle ORM for type-safe database operations and migrations
- **Database**: PostgreSQL (configured for production) with Neon Database serverless support
- **Schema Design**: Comprehensive relational schema covering:
  - Users (legal professionals with role-based access)
  - Clientes (client management with contact information)
  - PecasJuridicas (legal documents with status tracking and template association)
  - Templates (reusable document templates with categorization)
  - Historico (service history and audit trails)
- **Data Validation**: Shared Zod schemas between frontend and backend for consistent validation

### Development Architecture
- **Build System**: Vite for fast development and optimized production builds
- **Code Organization**: Monorepo structure with shared schema definitions
- **Path Resolution**: Configured aliases for clean imports (@/, @shared/, @assets/)
- **Development Tools**: Runtime error overlay and hot module replacement for enhanced DX

### Design System
- **Approach**: Utility-focused design system optimized for legal industry needs
- **Color Palette**: Professional legal blue primary colors with supporting semantic colors
- **Typography**: Inter font family optimized for Portuguese language and legal document readability
- **Component Library**: Comprehensive set of reusable components with consistent spacing and interaction patterns
- **Responsive Design**: Mobile-first approach with collapsible sidebar navigation

### Authentication & Security
- **Session Management**: Express sessions with PostgreSQL session store
- **User System**: Role-based user management (Advogado, Assistente, etc.)
- **Data Protection**: Prepared for client data privacy and security requirements

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connectivity
- **drizzle-orm** & **drizzle-kit**: Type-safe ORM and migration toolkit
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight React routing solution

### UI & Design Dependencies
- **@radix-ui/***: Comprehensive accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework with custom configuration
- **class-variance-authority**: Type-safe component variants
- **lucide-react**: Consistent icon system

### Development Dependencies
- **vite**: Fast build tool and development server
- **typescript**: Language support and type checking
- **@replit/vite-plugin-***: Replit-specific development enhancements
- **recharts**: Data visualization library for charts and analytics

### Form & Validation Dependencies
- **react-hook-form**: Performant form library
- **@hookform/resolvers**: Form validation resolvers
- **zod**: Schema validation library

### Utility Dependencies
- **date-fns**: Date manipulation with Portuguese locale support
- **clsx** & **tailwind-merge**: Conditional CSS class management
- **nanoid**: Unique ID generation
