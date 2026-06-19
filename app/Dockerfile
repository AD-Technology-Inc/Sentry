FROM python:3.12-slim

WORKDIR /app

RUN pip install --no-cache-dir uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Sync dependencies
RUN uv sync --no-dev --frozen

# Copy source code
COPY app ./app/

# Expose port
EXPOSE 8000

# Ensure Python can see app/src
ENV PYTHONPATH=/app/app/src

# Run the application
CMD ["uv", "run", "uvicorn", "app.src.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
