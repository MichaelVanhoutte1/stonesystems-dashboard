# Project Folder Structure

This document outlines the proper folder structure for the dashboard application.

## Global Components (Used across multiple routes)

Located in `/components/` - These components are used globally throughout the application.

```
components/
├── AuthForm.tsx          # Login/signup form (used on home page)
├── Navbar.tsx            # Main navigation bar (used on all protected pages)
└── Tooltip.tsx           # Reusable tooltip component (used in navbar)
```

## Route-Specific Components

For components that are only used within specific routes, create a `components/` folder within the route directory.

### Example Structure:

```
app/
├── dashboard/
│   ├── components/       # Components specific to dashboard
│   │   ├── DashboardStats.tsx
│   │   └── RecentActivity.tsx
│   └── page.tsx
├── clients/
│   ├── components/       # Components specific to clients
│   │   ├── ClientList.tsx
│   │   ├── ClientCard.tsx
│   │   └── ClientFilters.tsx
│   └── page.tsx
└── csm-stats/
    ├── components/       # Components specific to CSM stats
    │   ├── StatsChart.tsx
    │   ├── MetricsCard.tsx
    │   └── DataTable.tsx
    └── page.tsx
```

## Other Important Directories

```
app/
├── dashboard/            # Main dashboard page
├── clients/              # Clients management page
├── csm-stats/            # CSM statistics page
├── layout.tsx            # Root layout with AuthProvider
└── page.tsx              # Login/signup page

contexts/
└── AuthContext.tsx       # Authentication context provider

lib/
├── supabase.ts           # Supabase client configuration
└── supabase-utils.ts     # Authentication utility functions
```

## Guidelines

1. **Global Components**: Place in `/components/` if used in multiple routes
2. **Route-Specific Components**: Place in `/app/[route]/components/` if only used in that route
3. **Shared Utilities**: Place in `/lib/` for reusable functions and configurations
4. **Context Providers**: Place in `/contexts/` for React context providers
5. **API Routes**: Place in `/app/api/` for server-side API endpoints

## Navigation Structure

The navbar includes the following navigation items:

- **Sales Stats** - Disabled (Coming Soon)
- **CSM Stats** - Active (placeholder page created)
- **VA Stats** - Disabled (Coming Soon)
- **Clients** - Active (placeholder page created)
- **Appointments** - Disabled (Coming Soon)
- **Opportunities** - Disabled (Coming Soon)
- **Website Revisions Log** - Disabled (Coming Soon)
- **CSAT Log** - Disabled (Coming Soon)

All disabled items show a "Coming Soon" tooltip on hover.
