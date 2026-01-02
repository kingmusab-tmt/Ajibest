# Audit Logging System Documentation

## Overview

The audit logging system tracks all critical security events, user actions, and administrative operations throughout the Ajibest platform. This comprehensive logging helps with:

- Security monitoring and incident response
- Compliance and regulatory requirements
- Debugging and troubleshooting
- User activity tracking
- Unauthorized access detection

## Architecture

### Components

1. **File-Based Logging System** (`logs/audit/`)

   - Logs are written to daily log files (e.g., `audit-2026-01-02.log`)
   - Each log entry is a single JSON line
   - Organized by date for easy archival and management
   - No database overhead - saves database space

2. **Audit Logger Utility** (`utils/auditLogger.ts`)

   - Helper functions for different event types
   - IP address and user agent extraction
   - Centralized logging logic
   - Automatic log directory creation

3. **API Endpoint** (`app/api/admin/audit-logs/route.ts`)
   - Admin-only endpoint for viewing logs
   - Reads and parses log files
   - Filtering, pagination, and search capabilities
   - Bulk delete old log files

## Logged Events

### Authentication Events (Category: AUTH)

- ✅ **LOGIN_SUCCESS** - Successful user login
- ✅ **LOGIN_FAILED** - Failed login attempt
- ✅ **USER_REGISTERED** - New user registration
- ✅ **PASSWORD_RESET_REQUESTED** - Password reset OTP requested
- ✅ **PASSWORD_RESET_COMPLETED** - Password successfully reset

### Admin Actions (Category: ADMIN)

- ✅ **PROPERTY_CREATED** - Admin created new property
- ✅ **PROPERTY_UPDATED** - Admin updated property details
- ✅ **PROPERTY_DELETED** - Admin deleted a property
- ✅ **USER_DELETED** - Admin deleted a user account

### Sensitive Data Access (Category: SECURITY)

- ✅ **ACCESS_USER_DATA** - User data accessed
- ✅ **ACCESS_NEXT_OF_KIN_DATA** - Next of kin information accessed
- ✅ **UNAUTHORIZED_ACCESS_ATTEMPT** - Failed authorization attempt

### Transaction Events (Category: TRANSACTION)

- ✅ **TRANSACTION_STATUS_UPDATED** - Transaction status changed by admin

### Property Events (Category: PROPERTY)

- ✅ **PROPERTY_WITHDRAWAL_REQUESTED** - User requested property withdrawal

## Data Structure

Each audit log entry contains:

```typescript
{
  timestamp: Date,           // When the event occurred
  userId: string,            // ID of user performing action
  userEmail: string,         // Email of user performing action
  userName: string,          // Name of user performing action
  userRole: string,          // Role (User, Admin, etc.)
  action: string,            // Specific action taken
  category: string,          // AUTH, ADMIN, USER, TRANSACTION, PROPERTY, SECURITY
  status: string,            // SUCCESS, FAILURE, WARNING
  ipAddress: string,         // IP address of request
  userAgent: string,         // Browser/client user agent
  targetUserId: string,      // ID of affected user (if applicable)
  targetUserEmail: string,   // Email of affected user
  resourceId: string,        // ID of affected resource
  resourceType: string,      // Type of resource (Property, Transaction, etc.)
  errorMessage: string,      // Error message for failures
  details: object,           // Additional context
  metadata: object           // Extra information
}
```

## API Usage

### Viewing Audit Logs (Admin Only)

**GET** `/api/admin/audit-logs`

Query Parameters:

- `page` - Page number (default: 1)
- `limit` - Results per page (default: 50)
- `category` - Filter by category (AUTH, ADMIN, USER, TRANSACTION, PROPERTY, SECURITY)
- `status` - Filter by status (SUCCESS, FAILURE, WARNING)
- `action` - Filter by specific action
- `userEmail` - Filter by user email (partial match)
- `startDate` - Filter logs from this date
- `endDate` - Filter logs until this date

Example Request:

```bash
GET /api/admin/audit-logs?category=AUTH&status=FAILURE&page=1&limit=20
```

Example Response:

```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "_id": "...",
        "timestamp": "2026-01-02T10:30:00Z",
        "userEmail": "user@example.com",
        "action": "LOGIN_FAILED",
        "category": "AUTH",
        "status": "FAILURE",
        "ipAddress": "192.168.1.1",
        "errorMessage": "Invalid password"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalCount": 100,
      "pageSize": 20,
      "hasNextPage": true,
      "hasPreviousPage": false
    }
  }
}
```

### Deleting Old Logs (Admin Only)

**DELETE** `/api/admin/audit-logs?daysOld=90`

Deletes audit log files older than specified days (default: 90 days)

## File Storage Structure

Logs are stored in the `logs/audit/` directory with the following structure:

```
logs/
  audit/
    audit-2026-01-01.log
    audit-2026-01-02.log
    audit-2026-01-03.log
```

Each log file contains one JSON entry per line:

```json
{"_id":"1735819200000-abc123","timestamp":"2026-01-02T10:30:00.000Z","userEmail":"user@example.com","action":"LOGIN_FAILED","category":"AUTH","status":"FAILURE","ipAddress":"192.168.1.1","errorMessage":"Invalid password"}
{"_id":"1735819260000-def456","timestamp":"2026-01-02T10:31:00.000Z","userEmail":"admin@example.com","action":"PROPERTY_CREATED","category":"ADMIN","status":"SUCCESS"}
```

### Benefits of File-Based Logging

- **Database Space Savings**: No database overhead
- **Easy Archival**: Files can be compressed and archived by date
- **Simple Backup**: Standard file backup processes apply
- **Performance**: No database queries needed for logging
- **Portability**: Logs can be easily transferred or analyzed offline

## Integration Examples

### Manual Logging

```typescript
import { logAudit } from "@/utils/auditLogger";

// Log custom event
await logAudit({
  userId: user.id,
  userEmail: user.email,
  userName: user.name,
  userRole: user.role,
  action: "CUSTOM_ACTION",
  category: "USER",
  status: "SUCCESS",
  ipAddress: getIpAddress(req),
  userAgent: getUserAgent(req),
  details: { customField: "value" },
});
```

### Using Helper Functions

```typescript
import {
  logFailedLogin,
  logSuccessfulLogin,
  logAdminAction,
  logSensitiveDataAccess,
  logTransactionModification,
} from "@/utils/auditLogger";

// Log failed login
await logFailedLogin("user@example.com", "Invalid password", req);

// Log admin action
await logAdminAction(
  adminId,
  adminEmail,
  adminName,
  "PROPERTY_UPDATED",
  "Property",
  propertyId,
  undefined,
  { updatedFields: ["price", "description"] },
  req
);

// Log sensitive data access
await logSensitiveDataAccess(
  userId,
  userEmail,
  "USER_DATA",
  targetUserId,
  targetEmail,
  req
);
```

## Security Considerations

### Data Retention

- Logs contain sensitive information and should be retained according to compliance requirements
- Implement automatic cleanup by deleting old log files
- Default: Keep logs for 90 days (configurable)
- Old log files can be archived to cold storage before deletion

### Access Control

- **Only admins** can view audit logs
- Log files are stored in the `logs/audit/` directory (excluded from git)
- Ensure proper file permissions on the server
- Logs are append-only (cannot be modified)

### Performance

- File-based logging has minimal performance impact
- No database queries required for logging
- Async file writing to avoid blocking main operations
- Failed logging operations don't crash the application

### Privacy

- IP addresses and user agents are stored for security analysis
- Consider data minimization and anonymization for GDPR compliance
- Implement log retention policies
- Log files should be secured with appropriate file permissions

## Monitoring & Alerts

### Recommended Alerts

1. **Multiple Failed Logins**

   - Query: Failed login attempts from same email > 5 in 10 minutes
   - Action: Lock account, notify security team

2. **Unauthorized Access Attempts**

   - Query: UNAUTHORIZED_ACCESS_ATTEMPT events
   - Action: Investigate and potentially block IP

3. **Bulk Admin Actions**

   - Query: Admin deleting > 10 users/properties in short time
   - Action: Verify with admin, possible account compromise

4. **Sensitive Data Access Patterns**
   - Query: User accessing multiple other users' data
   - Action: Investigate for potential data breach

### Query Examples

**Reading log files directly:**

```bash
# View today's logs
cat logs/audit/audit-2026-01-02.log

# Search for failed logins
grep "LOGIN_FAILED" logs/audit/*.log

# Count failed login attempts
grep -c "LOGIN_FAILED" logs/audit/*.log

# Find logs for specific user
grep "user@example.com" logs/audit/*.log

# Parse and format with jq
cat logs/audit/audit-2026-01-02.log | jq '.'
```

**Using Node.js/JavaScript:**

```javascript
import fs from "fs";
import path from "path";

// Read today's logs
const logFile = path.join(
  process.cwd(),
  "logs",
  "audit",
  `audit-${new Date().toISOString().split("T")[0]}.log`
);
const logs = fs
  .readFileSync(logFile, "utf8")
  .split("\n")
  .filter((line) => line)
  .map((line) => JSON.parse(line));

// Filter failed logins
const failedLogins = logs.filter((log) => log.action === "LOGIN_FAILED");

// Group by user
const loginsByUser = logs.reduce((acc, log) => {
  if (!acc[log.userEmail]) acc[log.userEmail] = [];
  acc[log.userEmail].push(log);
  return acc;
}, {});
```

## Best Practices

### Do's ✅

- Log all authentication events (success and failure)
- Log all administrative actions
- Log access to sensitive data (PII, financial info)
- Include contextual information (IP, user agent, affected resources)
- Use appropriate log levels (SUCCESS, FAILURE, WARNING)
- Implement log rotation/cleanup (delete old files)
- Compress and archive old log files
- Set proper file permissions on log directory
- Regularly backup log files
- Monitor disk space usage

### Don'ts ❌

- Don't log passwords or sensitive credentials
- Don't log complete request/response bodies
- Don't let logging failures crash the application
- Don't make logs publicly accessible
- Don't keep logs forever without retention policy
- Don't commit log files to version control (use .gitignore)

## Compliance

This audit logging system helps meet requirements for:

- **GDPR** - Right to access, data breach detection
- **PCI DSS** - Transaction and access logging
- **SOC 2** - Security monitoring and incident response
- **ISO 27001** - Information security management

## Troubleshooting

### Logs Not Appearing

1. Check if `logs/audit/` directory exists and has write permissions
2. Verify file system has sufficient disk space
3. Check console for logging errors (development mode)
4. Ensure log file path is correct

### Performance Issues

1. Implement log file rotation (daily files help)
2. Archive old logs to reduce active file count
3. Compress archived logs
4. Consider using streaming for large log reads

### Storage Concerns

1. Delete old log files regularly (use DELETE endpoint)
2. Archive logs to cold storage (AWS S3, Azure Blob, etc.)
3. Compress log files with gzip
4. Monitor disk space usage
5. Set up automated cleanup scripts

### Permission Issues

```bash
# Ensure proper permissions on logs directory
chmod 755 logs/
chmod 755 logs/audit/
chmod 644 logs/audit/*.log
```

## Maintenance Tasks

### Daily

- Monitor disk space usage
- Check for logging errors

### Weekly

- Review log file sizes
- Verify logging is functioning

### Monthly

- Delete or archive logs older than 90 days
- Analyze log patterns for security issues
- Review and update retention policies

### Backup Strategy

```bash
# Compress and backup old logs
cd logs/audit
tar -czf audit-logs-2026-01.tar.gz audit-2026-01-*.log
mv audit-logs-2026-01.tar.gz /backup/location/

# Or use rsync for remote backup
rsync -avz logs/audit/ remote-server:/backup/audit-logs/
```

## Future Enhancements

- [ ] Real-time log streaming
- [ ] Log export to CSV/JSON via API
- [ ] Integration with external SIEM systems (Splunk, ELK)
- [ ] Advanced anomaly detection with ML
- [ ] Automated alert notifications (email/SMS)
- [ ] Log visualization dashboard with charts
- [ ] Compliance report generation (PDF exports)
- [ ] Automatic log compression after N days
- [ ] Integration with cloud storage for archival
- [ ] Log encryption at rest

## Support

For issues or questions about the audit logging system:

- Review the code in `utils/auditLogger.ts`
- Check the API endpoint at `app/api/admin/audit-logs/route.ts`
- Examine log files in `logs/audit/` directory
- Contact the development team

---

**Last Updated:** January 2, 2026  
**Version:** 2.0.0 (File-Based Logging)
