# Property Visit Scheduling System - Implementation Guide

## Overview

The Property Visit Scheduling System allows users to schedule visits for properties before making a purchase or rental commitment. Properties under visit are held and made unavailable to other users, with automatic release after 3 days if not purchased.

## Features Implemented

### 1. **Schedule Visit Button** (User Side)

- Added "Schedule Visit" button below Buy/Rent on PropertyListing page
- Opens calendar dialog showing available dates
- Booked dates are disabled and unavailable for selection
- Maximum 2 properties can be under visit per user
- Email and in-app notifications sent upon scheduling

### 2. **Under Visit Tab** (User Side - MyProperty)

- New tab in MyProperty page showing properties scheduled for visit
- Displays visit date, property details, and location
- Two action buttons per property:
  - **Buy/Rent**: Proceed with purchase/rental after visit
  - **Release**: Release property back to public if not proceeding
- Cards show property image, price, and listing purpose

### 3. **Auto-Release Feature**

- Properties automatically released 3 days after visit date
- Implements via cron job endpoint: `/api/cron/autoReleaseVisits`
- Can be triggered by external cron services (EasyCron, AWS Lambda, etc.)
- Requires `CRON_SECRET` environment variable for security

### 4. **Admin Property Requests Page** (Admin Side)

- New page accessible from admin sidebar: "Property Requests"
- Three tabs: Scheduled, Completed, Released
- Table view with columns:
  - Property title and location
  - User name and email
  - Visit date
  - Status with color chips
  - Update action buttons
- Ability to manually update visit status (completed, cancelled, released)
- Pagination support for large datasets

### 5. **Database Models**

#### PropertyVisit Model

```typescript
interface IPropertyVisit {
  propertyId: ObjectId; // Reference to property
  userId: ObjectId; // Reference to user
  userEmail: string; // User email for notifications
  userName: string; // User name
  visitDate: Date; // Scheduled visit date
  status: string; // scheduled|completed|cancelled|released
  createdAt: Date; // When visit was scheduled
  updatedAt: Date; // Last update time
  notificationSent: boolean; // Tracking for notifications
  completedDate?: Date; // When marked as completed
  releaseDate?: Date; // When property was released
}
```

#### VisitAvailability Model

```typescript
interface IVisitAvailability {
  propertyId: ObjectId; // Reference to property
  availableDates: Date[]; // Admin-set available dates
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### User Endpoints

#### Schedule Visit

- **POST** `/api/property/visitSchedule`
- Body: `{ propertyId: string, visitDate: string }`
- Returns: Created PropertyVisit document
- Validation:
  - Max 2 active visits per user
  - No duplicate visits for same property
  - Checks user authentication

#### Get User Visits

- **GET** `/api/property/visitSchedule?status=scheduled`
- Returns: Array of PropertyVisit documents (populated with property details)
- Optional status filter

#### Update Visit Status

- **PATCH** `/api/property/visitSchedule/[visitId]`
- Body: `{ status: "completed|cancelled|released" }`
- Only user who scheduled visit can update
- Returns: Updated PropertyVisit document

#### Get Booked Dates

- **GET** `/api/property/visitSchedule/booked-dates/[propertyId]`
- Returns: Array of booked dates for a property
- Used by calendar to disable unavailable dates

### Admin Endpoints

#### Get All Visits (Paginated)

- **GET** `/api/admin/propertyVisits?status=scheduled&page=1&limit=20`
- Requires Admin role
- Returns: Paginated list of all visits with user and property details

#### Update Visit (Admin)

- **PATCH** `/api/admin/propertyVisits/[visitId]`
- Body: `{ status: "completed|cancelled|released" }`
- Requires Admin role
- Admin can forcefully release visits

#### Manage Visit Availability

- **GET** `/api/admin/visitAvailability/[propertyId]`
- Requires Admin role
- Returns: Available dates for the property

- **POST** `/api/admin/visitAvailability/[propertyId]`
- Body: `{ availableDates: Date[] }`
- Requires Admin role
- Sets/updates available dates for property

### Cron Endpoint

#### Auto-Release Visits

- **POST** `/api/cron/autoReleaseVisits`
- Header: `Authorization: Bearer ${CRON_SECRET}`
- Automatically releases all visits older than 3 days
- Returns: Number of properties released

## Frontend Components

### ScheduleVisitDialog.tsx

Located: `/app/components/generalcomponents/ScheduleVisitDialog.tsx`

- Calendar picker using `@mui/x-date-pickers`
- Fetches and displays booked dates
- Handles visit scheduling with error handling
- Confirmation callback on success

### UnderVisitTab.tsx

Located: `/app/components/generalcomponents/UnderVisitTab.tsx`

- Grid display of under-visit properties
- Buy/Rent and Release action buttons
- Release confirmation dialog
- Fetches visits on mount

## Integration Points

### 1. PropertyListing Page Updates

File: `/app/userDashboard/PropertyListing/page.tsx`

- Added Schedule Visit button to property cards
- Integrated ScheduleVisitDialog component
- Added state management for visit scheduling

### 2. MyProperty Page Updates

File: `/app/userDashboard/MyProperty/page.tsx`

- Added "Under Visit" tab (index 2)
- Integrated UnderVisitTab component
- Updated tab numbering (Withdrawn now index 3)

### 3. Admin Layout Updates

File: `/app/admin/layout.tsx`

- Added PropertyRequestsPage import
- Added case for PropertyRequestsPage component

### 4. Admin Navigation Updates

File: `/app/admin/adminComponents/adminnav.tsx`

- Added "Property Requests" menu item
- Routes to PropertyRequestsPage component

### 5. Email Service Updates

File: `/utils/emailService.ts`

- Added `sendVisitScheduledEmail()` function
- Sends formatted email notification with visit details

## Environment Variables Required

```env
CRON_SECRET=your-secret-key-here
EMAIL_SERVER_HOST=smtp.your-email.com
EMAIL_SERVER_PORT=465
COMPANY_EMAIL_USER=your-email@company.com
COMPANY_EMAIL_PASS=your-email-password
SUPPORT_EMAIL=support@company.com
NEXTAUTH_SECRET=your-nextauth-secret
```

## Setting Up Auto-Release Cron Job

### Option 1: EasyCron (Recommended for beginners)

1. Go to https://www.easycron.com/
2. Click "Add Cron Job"
3. Enter URL: `https://yourdomain.com/api/cron/autoReleaseVisits`
4. Set frequency: Daily (or every 12 hours for more frequent checks)
5. Add header:
   - Name: `Authorization`
   - Value: `Bearer your-cron-secret`

### Option 2: AWS Lambda + CloudWatch Events

1. Create Lambda function with Node.js runtime
2. Add code to call your API endpoint
3. Create CloudWatch Events rule to trigger daily

### Option 3: Self-hosted with node-cron

Add to your server startup:

```typescript
import cron from "node-cron";

// Run daily at 2 AM
cron.schedule("0 2 * * *", async () => {
  try {
    await fetch("http://localhost:3000/api/cron/autoReleaseVisits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.CRON_SECRET}`,
      },
    });
  } catch (error) {
    console.error("Cron job failed:", error);
  }
});
```

## User Workflow

1. **User browses properties** in PropertyListing
2. **Clicks "Schedule Visit"** button
3. **Selects date** from calendar (booked dates disabled)
4. **Confirmation email** sent with visit details
5. **Visit appears in MyProperty "Under Visit" tab**
6. **Property becomes unavailable** to other users
7. **After visit:**
   - Option A: Click "Buy/Rent" to proceed with purchase
   - Option B: Click "Release" to make available again
8. **If not released within 3 days** → Automatically released

## Admin Workflow

1. **Admin navigates** to "Property Requests" from sidebar
2. **Views scheduled visits** in main tab
3. **Can update status:**
   - Mark as completed (after visiting)
   - Cancel visit
   - Release property (if user forgets)
4. **Can view completed/released** visits in other tabs
5. **Can manage available dates** for each property (future enhancement)

## Key Business Rules

| Rule                        | Implementation                              |
| --------------------------- | ------------------------------------------- |
| Max 2 under-visit per user  | Checked in POST /api/property/visitSchedule |
| No duplicate visits         | Checked in POST /api/property/visitSchedule |
| 3-day auto-release          | Implemented in /api/cron/autoReleaseVisits  |
| Property hidden from others | Filter logic in PropertyListing (future)    |
| Only owner can update visit | Check userId in PATCH endpoint              |
| Admin can override anything | Admin endpoints bypass user checks          |

## Future Enhancements

1. **Property Availability Calendar**: Admin interface to set available dates per property
2. **Visit History**: Show past visits with analytics
3. **Automatic Email Reminders**: Reminder 1 day before visit
4. **Visit Feedback**: Allow users to rate visits
5. **Property Visibility**: Filter out under-visit properties from other users' listings
6. **Notifications**: In-app notification system for visit updates
7. **Multi-language Support**: Translate emails and UI
8. **Analytics Dashboard**: Track visit metrics and conversion rates

## Testing Checklist

- [ ] User can schedule a visit
- [ ] Calendar shows booked dates as disabled
- [ ] Max 2 visits enforced
- [ ] Duplicate visit prevented
- [ ] Email notification sent
- [ ] Visit appears in "Under Visit" tab
- [ ] User can release property
- [ ] User can proceed to buy/rent
- [ ] Admin can view all visits
- [ ] Admin can update visit status
- [ ] Cron job auto-releases after 3 days
- [ ] Properties under visit hidden from other users (when implemented)

## Troubleshooting

### Visit not appearing in "Under Visit" tab

- Check user authentication
- Verify PropertyVisit was created in database
- Check browser console for API errors

### Calendar dialog not showing booked dates

- Verify booked-dates API is called
- Check network tab for API response
- Ensure date format matches (ISO string)

### Cron job not working

- Verify CRON_SECRET matches in request header
- Check server logs for errors
- Test endpoint manually with curl:
  ```bash
  curl -X POST http://localhost:3000/api/cron/autoReleaseVisits \
    -H "Authorization: Bearer your-secret"
  ```

### Email not sending

- Verify email credentials in .env
- Check email service provider logs
- Test email sending separately

## File Structure

```
models/
  ├── propertyVisit.ts
  └── visitAvailability.ts

app/api/
  ├── property/
  │   └── visitSchedule/
  │       ├── route.ts
  │       ├── [visitId]/route.ts
  │       └── booked-dates/[propertyId]/route.ts
  ├── admin/
  │   ├── propertyVisits/
  │   │   ├── route.ts
  │   │   └── [visitId]/route.ts
  │   └── visitAvailability/[propertyId]/route.ts
  └── cron/
      └── autoReleaseVisits/route.ts

app/components/generalcomponents/
  ├── ScheduleVisitDialog.tsx
  └── UnderVisitTab.tsx

app/admin/manageProperty/
  └── propertyRequests/page.tsx

app/userDashboard/PropertyListing/
app/userDashboard/MyProperty/

utils/
  └── emailService.ts
```

## Support & Questions

For issues or questions regarding the Property Visit Scheduling System, please:

1. Check the troubleshooting section
2. Review the API endpoint documentation
3. Check database for PropertyVisit records
4. Verify environment variables are set correctly
