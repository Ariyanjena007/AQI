from fastapi import APIRouter
from typing import List
from app.schemas.schemas import ReportOut
from datetime import datetime, timezone

router = APIRouter(prefix="/api/reports", tags=["Reports"])

REPORTS_DB = [
    {
        "id": "REP-2026-W39",
        "title": "Weekly Environmental Compliance Summary — Week 39",
        "period": "Sep 21, 2026 - Sep 28, 2026",
        "format": "PDF",
        "size": "1.8 MB",
        "created_at": datetime.now(timezone.utc),
        "status": "Ready",
    },
    {
        "id": "REP-2026-AUG",
        "title": "Monthly Tropospheric Quality & Sensor Health Audit",
        "period": "Aug 01, 2026 - Aug 31, 2026",
        "format": "PDF",
        "size": "4.2 MB",
        "created_at": datetime.now(timezone.utc),
        "status": "Ready",
    },
    {
        "id": "REP-CSV-30D",
        "title": "Raw Multi-Sensor Telemetry Export (30 Days)",
        "period": "Aug 28, 2026 - Sep 28, 2026",
        "format": "CSV",
        "size": "18.4 MB",
        "created_at": datetime.now(timezone.utc),
        "status": "Ready",
    }
]

@router.get("", response_model=List[ReportOut])
def get_reports():
    return REPORTS_DB

@router.post("/generate", response_model=ReportOut)
def generate_report(req: dict):
    title = req.get("title", "Ad-hoc Environmental Audit")
    period = req.get("period", "Last 7 Days")
    new_rep = {
        "id": f"REP-2026-{int(datetime.now().timestamp()) % 10000}",
        "title": title,
        "period": period,
        "format": "PDF",
        "size": "2.1 MB",
        "created_at": datetime.now(timezone.utc),
        "status": "Ready"
    }
    REPORTS_DB.insert(0, new_rep)
    return new_rep
