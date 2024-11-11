# Używamy oficjalnego obrazu Pythona
FROM python:3.10-slim

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy plik z zależnościami
COPY requirements.txt /app/

# Instalujemy zależności
RUN pip install --no-cache-dir -r requirements.txt

# Kopiujemy pliki danych
COPY api/data/ /app/api/data/

# Kopiujemy pozostałe pliki aplikacji
COPY . /app/

# Otwieramy port dla serwera Django
EXPOSE 8000

# Definiujemy komendę startową z użyciem daphne
CMD ["daphne", "-b", "0.0.0.0", "-p", "8000", "project.asgi:application"]
