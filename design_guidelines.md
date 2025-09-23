# Design Guidelines for Jurify - Legal Management Platform

## Design Approach
**Selected Approach**: Design System (Utility-Focused)
**Justification**: Legal management platform prioritizing efficiency, data clarity, and professional credibility
**Reference System**: Material Design with professional legal industry adaptations
**Key Principles**: Clean hierarchy, trustworthy aesthetics, data-first design, Brazilian legal industry standards

## Core Design Elements

### A. Color Palette
**Primary Colors:**
- Brand Blue: 210 100% 45% (professional legal blue)
- Dark Blue: 210 85% 25% (navigation, headers)
- Light Blue: 210 40% 95% (backgrounds, subtle highlights)

**Supporting Colors:**
- Success Green: 120 60% 40% (completed cases, positive metrics)
- Warning Orange: 35 80% 55% (pending items, alerts)
- Neutral Gray: 220 10% 60% (text, borders)
- Background: 220 15% 98% (main background)

**Dark Mode:**
- Primary: 210 50% 65%
- Background: 220 25% 8%
- Surface: 220 20% 12%

### B. Typography
**Fonts**: Inter (via Google Fonts CDN)
- Headers: Inter 600-700 (24px-32px)
- Body: Inter 400-500 (14px-16px)
- Data/Numbers: Inter 500 (prominent metrics display)
- Portuguese language optimization with proper line-height (1.5-1.6)

### C. Layout System
**Spacing Units**: Tailwind 2, 4, 6, 8 units
- Tight spacing (p-2, m-2) for dense data tables
- Standard spacing (p-4, gap-4) for cards and sections  
- Generous spacing (p-6, p-8) for main content areas
- Consistent 4-unit grid system throughout

### D. Component Library

**Navigation:**
- Fixed sidebar with collapsible sections
- Breadcrumb navigation for deep pages
- Tab-based secondary navigation within modules

**Data Display:**
- Clean tables with alternating row colors
- Metric cards with large numbers and trend indicators
- Status badges with color-coded case types
- Progress bars for AI usage tracking

**Forms:**
- Grouped form sections with clear labels
- Required field indicators
- Validation states with Brazilian legal field requirements
- Multi-step forms for complex legal processes

**Charts:**
- Donut charts for statistics breakdown
- Simple bar charts for time-based data
- Minimal, data-focused styling

### E. Professional Legal Industry Adaptations

**Visual Hierarchy:**
- Critical legal data prominently displayed
- Color-coded status systems (Finalizado=green, Executivo=blue, Recursos=orange)
- Clear distinction between client data and case information

**Brazilian Localization:**
- Portuguese language throughout
- Brazilian legal terminology and case types
- Proper formatting for Brazilian legal document standards
- Currency formatting (R$) and date formats (DD/MM/YYYY)

**Data-Dense Interface:**
- Compact but readable tables for case management
- Sidebar navigation optimized for legal workflow
- Dashboard cards showing key performance indicators
- Quick actions accessible without deep navigation

## Key Features Design Focus
- **Dashboard**: Metric-heavy with clear visual hierarchy
- **Case Management**: Table-based with filtering and status tracking  
- **Client Portal**: Contact-focused with case history
- **AI Integration**: Usage tracking with clear monthly limits
- **Templates**: Organized library with preview capabilities

This design system prioritizes professional credibility, efficient data management, and seamless workflow for legal professionals while maintaining modern web application standards.
