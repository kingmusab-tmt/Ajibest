# Property Visit Scheduling System - Implementation Checklist

## Database Setup

- [ ] Create `PropertyVisit` collection in MongoDB
- [ ] Create `VisitAvailability` collection in MongoDB
- [ ] Verify indexes are created:
  - PropertyVisit: userId+status, propertyId+status
  - VisitAvailability: propertyId (unique)

## Environment Variables

- [ ] Add `CRON_SECRET` to .env.local
- [ ] Verify `NEXTAUTH_SECRET` is set
- [ ] Verify email configuration in .env:
  - `EMAIL_SERVER_HOST`
  - `EMAIL_SERVER_PORT`
  - `COMPANY_EMAIL_USER`
  - `COMPANY_EMAIL_PASS`
  - `SUPPORT_EMAIL`

## Model Files Created

- [x] `/models/propertyVisit.ts` - PropertyVisit schema
- [x] `/models/visitAvailability.ts` - VisitAvailability schema

## API Endpoints Created

- [x] POST `/api/property/visitSchedule` - Schedule visit
- [x] GET `/api/property/visitSchedule?status=*` - Get user visits
- [x] PATCH `/api/property/visitSchedule/[visitId]` - Update visit
- [x] GET `/api/property/visitSchedule/booked-dates/[propertyId]` - Get booked dates
- [x] GET `/api/admin/propertyVisits` - Get all visits (admin)
- [x] PATCH `/api/admin/propertyVisits/[visitId]` - Update visit (admin)
- [x] GET `/api/admin/visitAvailability/[propertyId]` - Get availability
- [x] POST `/api/admin/visitAvailability/[propertyId]` - Set availability
- [x] POST `/api/cron/autoReleaseVisits` - Auto-release cron job

## Frontend Components Created

- [x] `/app/components/generalcomponents/ScheduleVisitDialog.tsx`
  - [ ] Test calendar date picker
  - [ ] Test disabled dates
  - [ ] Test form submission
- [x] `/app/components/generalcomponents/UnderVisitTab.tsx`
  - [ ] Test property card display
  - [ ] Test Buy/Rent button
  - [ ] Test Release button
  - [ ] Test release confirmation dialog

## Page Updates

### PropertyListing Page

- [x] Added imports for Schedule Visit
- [x] Added state management for schedule dialog
- [x] Added Schedule Visit button to property cards
- [ ] Test Schedule Visit button
- [ ] Test dialog opens/closes properly
- [ ] Verify button appears on all property cards

### MyProperty Page

- [x] Added UnderVisitTab import
- [x] Added "Under Visit" tab to tabs list
- [x] Added TabPanel for Under Visit (index 2)
- [x] Updated Withdrawn tab index to 3
- [ ] Test tab navigation
- [ ] Test Under Visit tab displays correctly
- [ ] Test tab switching doesn't break other tabs

### Admin Layout

- [x] Imported PropertyRequestsPage
- [x] Added case in renderComponent switch
- [ ] Test PropertyRequestsPage loads
- [ ] Test proper role check

### Admin Navigation

- [x] Added "Property Requests" menu item
- [ ] Test menu item appears for admin
- [ ] Test clicking opens PropertyRequests page
- [ ] Test menu closes on mobile after click

## Admin Pages Created

- [x] `/app/admin/manageProperty/propertyRequests/page.tsx`
  - [ ] Test all three tabs load
  - [ ] Test table displays visits
  - [ ] Test update status dialog
  - [ ] Test status change reflection
  - [ ] Test pagination (if many records)

## Email Service

- [x] Added `sendVisitScheduledEmail()` function
- [ ] Test email sending on visit schedule
- [ ] Verify email content displays correctly
- [ ] Check email formatting in different clients

## Documentation

- [x] Created comprehensive implementation guide
- [x] Created API documentation
- [x] Created workflow diagrams
- [x] Created troubleshooting guide

## Testing Tasks

### Manual Testing

#### User Flow

1. [ ] Login as regular user
2. [ ] Navigate to PropertyListing
3. [ ] Click "Schedule Visit" on a property
4. [ ] Try to select a date from calendar
5. [ ] Submit form and verify visit created
6. [ ] Check email for notification
7. [ ] Go to MyProperty > Under Visit tab
8. [ ] Verify property appears in the tab
9. [ ] Test clicking "Release" button
10. [ ] Confirm property is released
11. [ ] Test scheduling another visit
12. [ ] Test scheduling 3rd visit (should fail - max 2)

#### Admin Flow

1. [ ] Login as admin
2. [ ] Navigate to admin dashboard
3. [ ] Click on "Property Requests" in sidebar
4. [ ] Verify Scheduled tab shows visits
5. [ ] Click Update button on a visit
6. [ ] Change status to "Completed"
7. [ ] Verify status change in table
8. [ ] Switch to Completed tab
9. [ ] Verify completed visit appears there
10. [ ] Test pagination if available

#### Cron Job Testing

1. [ ] Run cron endpoint manually with curl:
   ```bash
   curl -X POST http://localhost:3000/api/cron/autoReleaseVisits \
     -H "Authorization: Bearer your-cron-secret"
   ```
2. [ ] Check database for updated visit statuses
3. [ ] Verify logs show "Auto-released X properties"
4. [ ] Test with visit date > 3 days old
5. [ ] Verify it's changed to "released"

### Automated Testing (if applicable)

- [ ] Unit tests for PropertyVisit model
- [ ] Unit tests for API endpoints
- [ ] Integration tests for user workflow
- [ ] E2E tests for full visit scheduling

## Configuration Tasks

### Cron Job Setup

Choose one method:

#### Option 1: EasyCron

- [ ] Create account at easycron.com
- [ ] Create new cron job
- [ ] Set URL: https://yourdomain.com/api/cron/autoReleaseVisits
- [ ] Set Authorization header: Bearer {CRON_SECRET}
- [ ] Set frequency: Daily at 2 AM
- [ ] Test cron job runs

#### Option 2: AWS Lambda

- [ ] Create Lambda function
- [ ] Set trigger: CloudWatch Events (daily)
- [ ] Deploy and test

#### Option 3: node-cron

- [ ] Add cron job to server startup
- [ ] Test job runs on schedule
- [ ] Verify logs

### Email Configuration

- [ ] Verify SMTP credentials work
- [ ] Test sending test email
- [ ] Check email arrives in inbox
- [ ] Verify formatting looks good

## Browser/Device Testing

- [ ] Desktop Chrome
- [ ] Desktop Firefox
- [ ] Mobile iPhone
- [ ] Mobile Android
- [ ] Tablet iPad
- [ ] Dark mode toggle (if applicable)

## Performance Considerations

- [ ] Check PropertyListing page load time
- [ ] Monitor calendar dialog performance
- [ ] Test with 100+ properties
- [ ] Test admin page with 1000+ visits
- [ ] Check database query performance

## Security Checks

- [ ] Verify only own visits can be updated
- [ ] Verify admin-only endpoints require role check
- [ ] Verify CRON_SECRET is required for cron endpoint
- [ ] Verify no sensitive data in logs
- [ ] Check for SQL injection vulnerabilities (N/A - MongoDB)
- [ ] Verify rate limiting on endpoints (if implemented)

## Error Handling Verification

- [ ] Test with invalid property ID
- [ ] Test with invalid date
- [ ] Test network error during scheduling
- [ ] Test visiting without auth
- [ ] Test exceeding 2 visits limit
- [ ] Test duplicate visit attempt
- [ ] Verify error messages are user-friendly

## Documentation Tasks

- [ ] Update main README with new feature
- [ ] Create user guide for visit scheduling
- [ ] Create admin guide for managing visits
- [ ] Add screenshots to documentation
- [ ] Document API changes if applicable
- [ ] Create API documentation (Swagger/OpenAPI if used)

## Deployment Checklist

- [ ] Build project: `npm run build`
- [ ] Fix any build errors
- [ ] Test in production mode locally
- [ ] Set all environment variables on server
- [ ] Create database backups
- [ ] Deploy to staging
- [ ] Run full test suite on staging
- [ ] Deploy to production
- [ ] Monitor logs for errors
- [ ] Set up cron job on production
- [ ] Test cron job runs on production

## Post-Deployment Monitoring

- [ ] Monitor error logs
- [ ] Monitor visit creation rate
- [ ] Monitor email delivery
- [ ] Monitor cron job execution
- [ ] Monitor database performance
- [ ] Collect user feedback
- [ ] Track bugs and issues

## Future Features (Not in Current Implementation)

- [ ] Property availability calendar (admin dashboard)
- [ ] Visit reminders (1 day before)
- [ ] Visit feedback/ratings
- [ ] Visit analytics dashboard
- [ ] Automatic property hiding for other users
- [ ] In-app notifications for admins
- [ ] Bulk operations for admin
- [ ] Visit scheduling conflicts resolution
- [ ] Calendar integration (Google Calendar, etc.)
- [ ] Automated follow-up emails

## Completion Status

- **Database Models**: Complete
- **API Endpoints**: Complete
- **Frontend Components**: Complete
- **UI Integration**: Complete
- **Admin Interface**: Complete
- **Email Service**: Complete
- **Auto-Release System**: Complete
- **Documentation**: Complete
- **Testing**: ⏳ In Progress
- **Deployment**: ⏳ Pending

---

**Last Updated**: January 19, 2026
**Implementation Status**: Ready for Testing
**Estimated Testing Time**: 4-6 hours
**Estimated Deployment Time**: 1-2 hours
