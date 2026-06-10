import os
import time
import base64
import io
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image
import numpy as np

# Optional: try to import ultralytics, use a dummy if not available for whatever reason
try:
    from ultralytics import YOLO
    HAS_YOLO = True
except ImportError:
    HAS_YOLO = False

app = FastAPI(title="RoadGuard AI Backend", description="Pothole Detection API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model instance
model = None
MODEL_PATH = os.path.join(os.path.dirname(__file__), "sam_detection.pt")

@app.on_event("startup")
async def load_model():
    global model
    if not HAS_YOLO:
        print("Ultralytics not installed. Running without model.")
        return

    # Check if the custom model exists
    if os.path.exists(MODEL_PATH):
        print(f"Loading custom model from {MODEL_PATH}")
        model = YOLO(MODEL_PATH)
    else:
        print(f"Custom model not found at {MODEL_PATH}. Trying to load fallback yolov8n.pt...")
        try:
            model = YOLO("yolov8n.pt")  # Use nano model as fallback
        except Exception as e:
            print(f"Failed to load fallback model: {e}")

@app.get("/")
def read_root():
    return {"message": "RoadGuard AI API is running"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    start_time = time.time()
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")
    
    try:
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Could not read image: {e}")

    # Dummy response if model failed to load
    if model is None:
        # Simulate processing time
        time.sleep(1.5)
        # Just return the same image encoded in base64 to prevent frontend crashes
        buffered = io.BytesIO()
        image.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        return {
            "annotated_image": f"data:image/jpeg;base64,{img_str}",
            "detections_count": 0,
            "confidence_scores": [],
            "processing_time": round((time.time() - start_time) * 1000, 2), # ms
            "message": "Warning: Model not loaded, returning original image"
        }
        
    try:
        # Run inference
        results = model(image)
        
        # We assume processing a single image
        result = results[0]
        
        detections_count = len(result.boxes)
        confidence_scores = result.boxes.conf.cpu().numpy().tolist()
        
        # Get annotated image array (BGR format from OpenCV)
        annotated_frame = result.plot()
        
        # Convert BGR to RGB for PIL
        annotated_frame_rgb = annotated_frame[..., ::-1]
        annotated_image_pil = Image.fromarray(annotated_frame_rgb)
        
        # Convert to base64
        buffered = io.BytesIO()
        annotated_image_pil.save(buffered, format="JPEG")
        img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
        
        processing_time = round((time.time() - start_time) * 1000, 2)
        
        return {
            "annotated_image": f"data:image/jpeg;base64,{img_str}",
            "detections_count": detections_count,
            "confidence_scores": confidence_scores,
            "processing_time": processing_time
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")

