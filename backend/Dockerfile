# Używamy oficjalnego obrazu Pythona
FROM python:3.10-slim

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy plik z zależnościami
COPY requirements.txt /app/

# Instalujemy zależności
RUN pip install --no-cache-dir -r requirements.txt

# Kopiujemy pozostałe pliki aplikacji
COPY . /app/

# Otwieramy port dla serwera Django
EXPOSE 8000

# Definiujemy komendę startową
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
