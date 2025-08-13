FROM python:3.9

WORKDIR /app/agent

COPY requirements*.txt .

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv ${VIRTUAL_ENV}
ENV PATH="${VIRTUAL_ENV}/bin:$PATH"

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["fastapi", "dev", "main.py"]

