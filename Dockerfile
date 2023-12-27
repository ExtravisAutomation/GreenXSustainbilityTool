FROM python:3.9.4

WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Expose port 5000
EXPOSE 8000

# Set the entrypoint and command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]