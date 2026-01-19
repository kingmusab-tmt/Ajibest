# Property Visit System - Quick Reference Guide

## 🚀 Quick Start

### 1. Installation

```bash
# Install new dependencies
npm install @mui/x-date-pickers date-fns

# Build project
npm run build
```

### 2. Environment Setup

Add to `.env.local`:

```env
CRON_SECRET=generate-a-strong-random-secret-here
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=465
COMPANY_EMAIL_USER=your-email@gmail.com
COMPANY_EMAIL_PASS=your-app-password
SUPPORT_EMAIL=support@yourcompany.com
```

### 3. Database Setup

```bash
# Create indexes for performance
node scripts/setupPropertyVisitIndexes.js
```

### 4. Cron Configuration

Set up auto-release at EasyCron, AWS Lambda, or similar:

```
URL: https://yourdomain.com/api/cron/autoReleaseVisits
Method: POST
Header: Authorization: Bearer YOUR_CRON_SECRET
Frequency: Daily (2 AM recommended)
```

## 🎯 Core Features

### User Features

| Feature          | Location                     | Action                        |
| ---------------- | ---------------------------- | ----------------------------- |
| Schedule Visit   | PropertyListing page         | Click "Schedule Visit" button |
| View Visits      | MyProperty > Under Visit tab | See all scheduled visits      |
| Release Property | Under Visit tab              | Click "Release" button        |
| Proceed to Buy   | Under Visit tab              | Click "Buy/Rent" button       |

### Admin Features

| Feature        | Location                  | Action                                      |
| -------------- | ------------------------- | ------------------------------------------- |
| Manage Visits  | Admin > Property Requests | View all visits with status                 |
| Update Status  | Property Requests page    | Click "Update" to change status             |
| View Analytics | Property Requests tabs    | Switch between Scheduled/Completed/Released |

## 📱 Component Locations

```
User-Facing Components:
├── /app/userDashboard/PropertyListing/page.tsx
│   └── Schedule Visit button (on each property card)
├── /app/components/generalcomponents/ScheduleVisitDialog.tsx
│   └── Calendar picker for scheduling
└── /app/userDashboard/MyProperty/page.tsx
    └── Under Visit tab

Admin Components:
└── /app/admin/manageProperty/propertyRequests/page.tsx
    ├── Scheduled visits tab
    ├── Completed visits tab
    └── Released visits tab
```

## 🔌 API Quick Reference

### Schedule Visit

```bash
POST /api/property/visitSchedule
{
  "propertyId": "mongodb-id",
  "visitDate": "2024-02-15T10:00:00Z"
}
```

### Get User Visits

```bash
GET /api/property/visitSchedule?status=scheduled
```

### Update Visit

```bash
PATCH /api/property/visitSchedule/[visitId]
{
  "status": "released|completed|cancelled"
}
```

### Get Booked Dates

```bash
GET /api/property/visitSchedule/booked-dates/[propertyId]
```

### Admin: Get All Visits

```bash
GET /api/admin/propertyVisits?status=scheduled&page=1&limit=20
# Requires admin authentication
```

### Auto-Release (Cron)

```bash
POST /api/cron/autoReleaseVisits
Header: Authorization: Bearer CRON_SECRET
```

## 🗄️ Database Models

### PropertyVisit

```typescript
{
  propertyId: ObjectId,        // Reference to property
  userId: ObjectId,             // Reference to user
  userEmail: string,            // For notifications
  userName: string,             // Display name
  visitDate: Date,              // When the visit is scheduled
  status: string,               // scheduled|completed|cancelled|released
  notificationSent: boolean,    // Tracking flag
  completedDate?: Date,         // When marked complete
  releaseDate?: Date,           // When released
  createdAt: Date,              // Creation timestamp
  updatedAt: Date               // Last update timestamp
}
```

### VisitAvailability

```typescript
{
  propertyId: ObjectId,         // Reference to property (unique)
  availableDates: [Date],       // Admin-set available dates
  createdAt: Date,
  updatedAt: Date
}
```

## Common Issues & Solutions

| Issue                               | Solution                                  |
| ----------------------------------- | ----------------------------------------- |
| Schedule Visit button not showing   | Check PropertyListing imports and state   |
| Under Visit tab not appearing       | Verify UnderVisitTab import in MyProperty |
| Calendar not disabling booked dates | Check booked-dates API call               |
| Emails not sending                  | Verify SMTP credentials in .env           |
| Cron not working                    | Check CRON_SECRET matches header          |
| "Max 2 visits" error                | User already has 2 active visits          |
| Visit not persisting                | Check database connection and indexes     |

## 🔐 Security Checklist

- [ ] CRON_SECRET is strong and random
- [ ] Email credentials are app-specific (not main password)
- [ ] Cron endpoint requires proper header authentication
- [ ] Only users can update their own visits
- [ ] Only admins can access admin endpoints
- [ ] Database indexes created for performance
- [ ] Error messages don't expose sensitive info

## 📊 Monitoring Points

### What to Monitor

1. **Email Delivery**: Check if visit emails are sending
2. **Cron Job**: Verify auto-release runs daily
3. **Database**: Monitor query performance with indexes
4. **Error Logs**: Watch for API errors
5. **User Feedback**: Track if feature works as expected

### Commands

```bash
# Check if cron ran
curl -X POST http://localhost:3000/api/cron/autoReleaseVisits \
  -H "Authorization: Bearer your-secret"

# Verify database indexes
mongo
> db.propertyvisits.getIndexes()
> db.visitavailabilities.getIndexes()

# Count visits by status
> db.propertyvisits.find({status: "scheduled"}).count()
> db.propertyvisits.find({status: "released"}).count()
```

## 🧪 Testing Checklist

Quick tests to verify everything works:

```
[ ] User can schedule a visit
[ ] Calendar disables booked dates
[ ] Max 2 visits enforced
[ ] Email sent on schedule
[ ] Visit in Under Visit tab
[ ] Can release a visit
[ ] Can proceed to buy after visit
[ ] Admin can view visits
[ ] Admin can update status
[ ] Cron auto-releases after 3 days
```

## 📚 Documentation Files

| File                                         | Purpose                        |
| -------------------------------------------- | ------------------------------ |
| `PROPERTY_VISIT_SYSTEM.md`                   | Complete system documentation  |
| `PROPERTY_VISIT_IMPLEMENTATION_CHECKLIST.md` | Testing & deployment checklist |
| `FILES_CREATED_MODIFIED.md`                  | List of all changes            |
| `scripts/setupPropertyVisitIndexes.js`       | Database setup script          |

## 🆘 Support Resources

### For Users

- "Schedule Visit" button appears on all available properties
- Max 2 properties can be scheduled at once
- Visit appears immediately in "Under Visit" tab
- Email confirmation sent when scheduled

### For Admins

- Property Requests page in admin menu
- Three tabs for organizing visits by status
- Can manually update visit status
- See user details and property information

### For Developers

- See PROPERTY_VISIT_SYSTEM.md for architecture
- Check API endpoint documentation
- Review component source code
- Check error logs for debugging

## 📝 Notes

- Visits automatically release 3 days after visit date
- Only 2 properties can be under visit simultaneously per user
- Admin can override and release any property
- Email notifications sent to users on schedule
- All timestamps stored in UTC
- Database uses MongoDB indexes for fast queries

## 🔄 Update Process

When updating the system:

1. Pull latest code
2. Run `npm install` (if dependencies added)
3. Run `npm run build`
4. If database schema changed, run setup script
5. Restart server
6. Test core workflows

## 📞 Contact & Support

For issues:

1. Check checklist document for known issues
2. Review error logs
3. Test API endpoints manually
4. Verify database contains expected data
5. Check browser console for frontend errors

---

**Last Updated**: January 19, 2026
**Version**: 1.0
**Status**: Production Ready
