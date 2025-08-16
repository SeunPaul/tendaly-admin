# Routing System Documentation

## Overview

The application uses React Router v6 with a protected route system and authentication context.

## Route Structure

### Public Routes

- `/` - Redirects to `/login`
- `/login` - Login page (redirects to dashboard if already authenticated)

### Protected Routes

- `/dashboard` - Dashboard page (requires authentication)

## Authentication Flow

1. **Initial Access**: User visits any route → redirected to `/login`
2. **Login**: User submits credentials → authenticated via AuthContext → redirected to `/dashboard`
3. **Dashboard Access**: Protected route checks authentication → allows/denies access
4. **Logout**: User clicks logout → clears authentication → redirected to `/login`

## Components

### AuthContext

- Manages user authentication state
- Provides `login()`, `logout()`, and `isAuthenticated` methods
- Stores user data in component state

### ProtectedRoute

- Guards routes that require authentication
- Redirects unauthenticated users to login page
- Wraps protected components

### LoginPage

- Handles user authentication
- Redirects authenticated users to dashboard
- Uses React Hook Form with Yup validation

### Dashboard

- Main authenticated area
- Includes logout functionality
- Navigation sidebar with menu items

## Adding New Routes

To add new protected routes:

1. Create the component in `src/components/`
2. Add the route to `App.tsx`:

```tsx
<Route
  path="/new-route"
  element={
    <ProtectedRoute>
      <NewComponent />
    </ProtectedRoute>
  }
/>
```

3. Add navigation items to the sidebar in `Dashboard.tsx`

## Future Enhancements

- Persistent authentication (localStorage/sessionStorage)
- Role-based access control
- Route-level permissions
- Breadcrumb navigation
- Deep linking support
