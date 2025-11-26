# backend/Dockerfile
FROM python:3.11-slim

# # Set work directory
# WORKDIR .

# Copy requirements first to leverage caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Expose the port Flask runs on
EXPOSE 80

# Start both main.py and consumers.py using a process manager
# You can use 'honcho', 'supervisord', or just a simple bash command
RUN pip install gunicorn

# We'll run Flask with gunicorn and start consumers.py in the background
CMD ["sh", "-c", "python consumers.py & python main.py"]
