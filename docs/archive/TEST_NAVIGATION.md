# Navigation Test Instructions

## Current Dev Server: http://localhost:3001

## Test Flow:

1. Navigate to: http://localhost:3001/login
   - Should show 4 role cards: First-Time Guest, Returning Guest, Staff, Admin

2. Click "First-Time Guest"
   - Should navigate to: http://localhost:3001/auth/guest/new
   - Should show registration form with: Name, Email, Password, Phone, Preferences

3. Click "Returning Guest"
   - Should navigate to: http://localhost:3001/auth/guest/returning
   - Should show login form with: Email, Password, Loyalty ID

4. Click "Staff"
   - Should navigate to: http://localhost:3001/auth/staff/login
   - Should show staff login with: Staff ID, PIN

5. Click "Admin"
   - Should navigate to: http://localhost:3001/auth/admin/login
   - Should show admin login with: Username, Password

## Direct URL Tests:

Test these URLs directly in browser:
- http://localhost:3001/login
- http://localhost:3001/auth/guest/new
- http://localhost:3001/auth/guest/returning
- http://localhost:3001/auth/staff/login
- http://localhost:3001/auth/admin/login

## If Navigation Not Working:

1. Hard refresh: Ctrl + Shift + R
2. Clear browser cache
3. Check console for errors (F12)
4. Restart dev server: npm run dev

## After Login Test:

Fill in any form and submit:
- Guest → redirects to /dashboard
- Staff → redirects to /dashboard
- Admin → redirects to /dashboard/admin
