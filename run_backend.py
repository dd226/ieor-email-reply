#!/usr/bin/env python3
"""
Backend startup script that ensures the environment is properly configured.
"""
import sys
import os

# Add Backend directory to Python path
backend_dir = os.path.join(os.path.dirname(__file__), 'Backend')
sys.path.insert(0, backend_dir)
sys.path.insert(0, os.path.dirname(__file__))

# Now import and run the app
import uvicorn
from Backend.api import app

if __name__ == '__main__':
    uvicorn.run(app, host="0.0.0.0", port=8001)
