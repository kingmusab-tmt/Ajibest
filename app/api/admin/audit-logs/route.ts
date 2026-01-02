import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/auth";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

interface AuditLogEntry {
  _id: string;
  timestamp: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
  userRole?: string;
  action: string;
  category: string;
  status: string;
  ipAddress?: string;
  userAgent?: string;
  details?: any;
  targetUserId?: string;
  targetUserEmail?: string;
  resourceId?: string;
  resourceType?: string;
  errorMessage?: string;
  metadata?: any;
}

/**
 * Get the logs directory path
 */
function getLogsDirectory(): string {
  return path.join(process.cwd(), "logs", "audit");
}

/**
 * Read all log files within a date range
 */
function readLogFiles(startDate?: string, endDate?: string): AuditLogEntry[] {
  const logsDir = getLogsDirectory();
  console.log("📂 [AUDIT API] Reading audit logs from:", logsDir);

  if (!fs.existsSync(logsDir)) {
    console.log(
      "⚠️ [AUDIT API] Logs directory does not exist, returning empty array"
    );
    return [];
  }

  const files = fs.readdirSync(logsDir);
  const logFiles = files.filter(
    (f) => f.startsWith("audit-") && f.endsWith(".log")
  );
  console.log("📄 [AUDIT API] Found log files:", logFiles);

  let allLogs: AuditLogEntry[] = [];
  let totalEntries = 0;

  for (const file of logFiles) {
    console.log("📖 [AUDIT API] Processing file:", file);
    const filePath = path.join(logsDir, file);
    const content = fs.readFileSync(filePath, "utf8");
    const lines = content
      .trim()
      .split("\n")
      .filter((line) => line);

    for (const line of lines) {
      try {
        const log = JSON.parse(line);

        // Filter by date range if provided
        if (startDate || endDate) {
          const logDate = new Date(log.timestamp);
          if (startDate && logDate < new Date(startDate)) continue;
          if (endDate && logDate > new Date(endDate)) continue;
        }

        allLogs.push(log);
        totalEntries++;
      } catch (e) {
        // Skip malformed log lines
        console.error("❌ [AUDIT API] Error parsing log line:", e);
      }
    }
  }

  console.log(
    "✅ [AUDIT API] Read completed - Total entries loaded:",
    totalEntries
  );

  return allLogs;
}

/**
 * Filter logs based on criteria
 */
function filterLogs(
  logs: AuditLogEntry[],
  filters: {
    category?: string;
    status?: string;
    action?: string;
    userEmail?: string;
  }
): AuditLogEntry[] {
  let filtered = logs;

  if (filters.category) {
    filtered = filtered.filter((log) => log.category === filters.category);
  }

  if (filters.status) {
    filtered = filtered.filter((log) => log.status === filters.status);
  }

  if (filters.action) {
    filtered = filtered.filter((log) => log.action === filters.action);
  }

  if (filters.userEmail) {
    filtered = filtered.filter((log) =>
      log.userEmail?.toLowerCase().includes(filters.userEmail!.toLowerCase())
    );
  }

  return filtered;
}

/**
 * GET /api/admin/audit-logs
 * Retrieve audit logs with filtering and pagination (Admin only)
 */
export async function GET(req: NextRequest) {
  try {
    console.log("🔍 [AUDIT API GET] Fetching audit logs...");
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "Admin") {
      console.log("❌ [AUDIT API GET] Unauthorized access attempt");
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("✅ [AUDIT API GET] Admin authenticated:", session.user.email);

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const action = searchParams.get("action");
    const userEmail = searchParams.get("userEmail");

    console.log("🔧 [AUDIT API GET] Query parameters:", {
      page,
      limit,
      category,
      status,
      action,
      userEmail,
    });
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    // Read all logs from files
    let allLogs = readLogFiles(startDate || undefined, endDate || undefined);
    console.log(
      "📊 [AUDIT API GET] Total logs loaded from files:",
      allLogs.length
    );

    // Apply filters
    const filteredLogs = filterLogs(allLogs, {
      category: category || undefined,
      status: status || undefined,
      action: action || undefined,
      userEmail: userEmail || undefined,
    });
    console.log(
      "🔽 [AUDIT API GET] Logs after filtering:",
      filteredLogs.length
    );

    // Sort by timestamp (newest first)
    filteredLogs.sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Calculate pagination
    const totalCount = filteredLogs.length;
    const skip = (page - 1) * limit;
    const logs = filteredLogs.slice(skip, skip + limit);
    console.log("📄 [AUDIT API GET] Returning logs for page:", {
      page,
      limit,
      skip,
      returning: logs.length,
    });

    const totalPages = Math.ceil(totalCount / limit);
    console.log("✅ [AUDIT API GET] Response prepared:", {
      totalCount,
      totalPages,
      currentPage: page,
    });

    return NextResponse.json({
      success: true,
      data: {
        logs,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          pageSize: limit,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      },
    });
  } catch (error) {
    console.error("❌ [AUDIT API GET] Error fetching audit logs:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/audit-logs
 * Delete old audit log files (Admin only)
 */
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "Admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const daysOld = parseInt(searchParams.get("daysOld") || "90");

    // Calculate the date threshold
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysOld);

    const logsDir = getLogsDirectory();

    if (!fs.existsSync(logsDir)) {
      return NextResponse.json({
        success: true,
        message: "No log files found",
        deletedCount: 0,
      });
    }

    const files = fs.readdirSync(logsDir);
    const logFiles = files.filter(
      (f) => f.startsWith("audit-") && f.endsWith(".log")
    );

    let deletedCount = 0;

    for (const file of logFiles) {
      // Extract date from filename (audit-YYYY-MM-DD.log)
      const dateMatch = file.match(/audit-(\d{4}-\d{2}-\d{2})\.log/);
      if (dateMatch) {
        const fileDate = new Date(dateMatch[1]);
        if (fileDate < thresholdDate) {
          const filePath = path.join(logsDir, file);
          fs.unlinkSync(filePath);
          deletedCount++;
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Deleted ${deletedCount} audit log files older than ${daysOld} days`,
      deletedCount,
    });
  } catch (error) {
    console.error("Error deleting audit logs:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
