FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
# Note: When building, ensure requirements.txt is copied from parent directory
# Or update fly.toml build context to parent directory
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Start server (migrations are handled inside the app on startup)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

