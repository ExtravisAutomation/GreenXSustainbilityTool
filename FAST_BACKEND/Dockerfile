# Lighter, newer Python with security fixes
FROM python:3.11-slim

# Prevent .pyc, ensure unbuffered logs
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DEFAULT_TIMEOUT=100 \
    TZ=Asia/Karachi

# System deps for common Python wheels (mysqlclient, Pillow, lxml, etc.)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc pkg-config \
    default-libmysqlclient-dev \
    libjpeg-dev zlib1g-dev \
    libxml2-dev libxslt1-dev \
    ca-certificates curl \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Layer caching: install deps first
COPY requirements.txt ./

# Upgrade build tools then install Python deps
RUN  pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app
COPY . .

EXPOSE 8000

# For dev hot-reload, add --reload (optional)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
