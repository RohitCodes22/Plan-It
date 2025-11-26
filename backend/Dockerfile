# Use full Python image for dev tools
FROM python:3.11

WORKDIR /app

# Install system dependencies for mysqlclient
RUN apt-get update && apt-get install -y \
    build-essential \
    default-libmysqlclient-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the port Flask runs on
EXPOSE 80

# Enable Flask auto-reload
ENV FLASK_ENV=development
ENV FLASK_APP=main.py

# Run main.py and consumers.py separately in dev
CMD ["sh", "-c", "python consumers.py & flask run --host=0.0.0.0 --port=80"]
