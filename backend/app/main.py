import asyncio
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.api import auth, devices, measurements, ai, alerts, analytics, reports
from app.websocket_manager import ws_manager
from app.hardware.simulator import uno_q_simulator

from app.database import engine, Base
import app.models.entities  # Ensure models are registered

# Background task to emit live hardware packets periodically to connected WebSockets
async def hardware_telemetry_loop():
    while True:
        await asyncio.sleep(2.0)
        packet = uno_q_simulator.generate_packet()
        await ws_manager.broadcast(packet)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create SQLite database tables if not exist
    Base.metadata.create_all(bind=engine)
    # Startup: spawn background hardware telemetry loop
    telemetry_task = asyncio.create_task(hardware_telemetry_loop())
    yield
    # Shutdown: cancel task
    telemetry_task.cancel()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="AQ Intelligence - Environmental telemetry & Edge AI analysis for Arduino UNO Q",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(devices.router)
app.include_router(measurements.router)
app.include_router(ai.router)
app.include_router(alerts.router)
app.include_router(analytics.router)
app.include_router(reports.router)

# WebSocket Endpoint
@app.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        while True:
            # Keep-alive receive
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception:
        ws_manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "product": "AQ Intelligence",
        "tagline": "Understand Your Air. Predict Your Environment.",
        "version": settings.VERSION,
        "hardware_target": "Arduino UNO Q",
        "edge_ai": "IsolationForest & Ridge Regressor Ensemble",
        "status": "OPERATIONAL"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
