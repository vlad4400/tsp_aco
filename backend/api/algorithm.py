import threading
import time
import random
import logging
import tsplib95

# Ładowanie problemu
problem = tsplib95.load('berlin52.tsp')

# Lista węzłów
nodes = list(problem.get_nodes())

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

channel_layer = get_channel_layer()


# Lista miast
cities = [0, 1, 2, 3]

# Macierz odległości między miastami
distance_matrix = [
    [0, 2, 9, 10],
    [1, 0, 6, 4],
    [15, 7, 0, 8],
    [6, 3, 12, 0]
]

# Inicjalizacja macierzy feromonów
pheromone_matrix = [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1]
]

# Macierz odległości
def calculate_distance_matrix(problem):
    nodes = list(problem.get_nodes())
    distance_matrix = {}
    for i in nodes:
        for j in nodes:
            if i != j:
                distance = problem.get_weight(i, j)
                distance_matrix[(i, j)] = distance
    return distance_matrix

distance_matrix = calculate_distance_matrix(problem)

class AntAlgorithm:
    def __init__(self):
        self._running = False

        # Pobieranie problemu z TSPLIB95
        import tsplib95
        import urllib.request

        # Wybierz zestaw danych: 'berlin52' lub 'att48'
        dataset = 'berlin52'

        if dataset == 'berlin52':
            url = 'http://elib.zib.de/pub/mp-testdata/tsp/tsplib/tsp/berlin52.tsp'
            file_name = 'berlin52.tsp'
        elif dataset == 'att48':
            url = 'http://elib.zib.de/pub/mp-testdata/tsp/tsplib/tsp/att48.tsp'
            file_name = 'att48.tsp'
        else:
            raise ValueError('Nieznany zestaw danych')

        # Pobieranie pliku, jeśli nie istnieje
        import os
        if not os.path.exists(file_name):
            urllib.request.urlretrieve(url, file_name)

        problem = tsplib95.load(file_name)

        # Inicjalizacja grafu
        graph = Graph(problem)

        # Parametry algorytmu
        num_ants = 20
        num_iterations = 1000000  # Duża liczba, aby algorytm mógł działać ciągle
        evaporation_rate = 0.5
        Q = 100

        self.colony = AntColony(graph, num_ants, num_iterations, evaporation_rate, Q)

        self._running = False

    def start(self):
        logging.info("Uruchamianie algorytmu mrówkowego")
        
        self._running = True
        while self._running:
            # Implementacja algorytmu mrówkowego
            # To jest uproszczony przykład
            # Zamiast time.sleep, wstaw logikę algorytmu
            # time.sleep(1)
            ant_colony_optimization()
            # Wysyłaj aktualizacje stanu
            # self.send_update()

    def stop(self):
        self._running = False

    def send_update(self):
        

        
        
        
        logging.info("Podtrzymywanie aktualizacji algorytmu")
        
        async_to_sync(channel_layer.group_send)(
        'notifications',
            {
                'type': 'send_notification',
                'message': 'Aktualny stan algorytmu',
            }
        )
        
        # async_to_sync(channel_layer.group_send)(
        #     'algorithm_updates',
        #     {
        #         'type': 'send_update',
        #         'message': 'Aktualny stan algorytmu',
        #     }
        # )
        
class Graph:
    def __init__(self, problem):
        self.nodes = list(problem.get_nodes())
        self.distances = self.calculate_distance_matrix(problem)
        self.pheromones = {}
        self.initialize_pheromones()
    
    def calculate_distance_matrix(self, problem):
        distance_matrix = {}
        nodes = self.nodes
        for i in nodes:
            for j in nodes:
                if i != j:
                    distance = problem.get_weight(i, j)
                    distance_matrix[(i, j)] = distance
        return distance_matrix
    
    def initialize_pheromones(self):
        initial_pheromone = 1.0
        for edge in self.distances:
            self.pheromones[edge] = initial_pheromone
    
    def get_distance(self, i, j):
        return self.distances.get((i, j), float('inf'))


class Ant:
    def __init__(self, start_city):
        self.current_city = start_city
        self.visited_cities = [start_city]
        self.total_distance = 0

    def select_next_city(self, pheromone_matrix, distance_matrix):
        unvisited_cities = list(set(cities) - set(self.visited_cities))
        if not unvisited_cities:
            return None

        probabilities = []
        alpha = 1  # Waga feromonów
        beta = 5   # Waga heurystyki (odwrotność odległości)

        # Obliczanie prawdopodobieństw przejścia do następnych miast
        for city in unvisited_cities:
            pheromone = pheromone_matrix[self.current_city][city] ** alpha
            heuristic = (1 / distance_matrix[self.current_city][city]) ** beta
            probabilities.append(pheromone * heuristic)

        # Normalizacja prawdopodobieństw
        total = sum(probabilities)
        probabilities = [p / total for p in probabilities]

        # Ruletkowy wybór kolejnego miasta
        r = random.random()
        cumulative = 0.0
        for city, probability in zip(unvisited_cities, probabilities):
            cumulative += probability
            if r <= cumulative:
                return city
        return unvisited_cities[-1]

    def move_to_next_city(self, next_city, distance_matrix):
        self.total_distance += distance_matrix[self.current_city][next_city]
        self.current_city = next_city
        self.visited_cities.append(next_city)

def ant_colony_optimization():
    num_iterations = 10
    num_ants = len(cities)
    evaporation_rate = 0.5
    Q = 100  # Stała wpływająca na ilość pozostawianych feromonów

    best_distance = float('inf')
    best_tour = []

    for iteration in range(num_iterations):
        ants = [Ant(start_city=random.choice(cities)) for _ in range(num_ants)]

        for ant in ants:
            while len(ant.visited_cities) < len(cities):
                next_city = ant.select_next_city(pheromone_matrix, distance_matrix)
                if next_city is not None:
                    ant.move_to_next_city(next_city, distance_matrix)

            # Powrót do miasta początkowego
            start_city = ant.visited_cities[0]
            ant.move_to_next_city(start_city, distance_matrix)

            # Aktualizacja najlepszego rozwiązania
            if ant.total_distance < best_distance:
                best_distance = ant.total_distance
                best_tour = ant.visited_cities.copy()

        # Parowanie feromonów
        for i in range(len(cities)):
            for j in range(len(cities)):
                pheromone_matrix[i][j] *= (1 - evaporation_rate)
                if pheromone_matrix[i][j] < 0.1:
                    pheromone_matrix[i][j] = 0.1  # Zapobieganie zerowym wartościom

        # Aktualizacja feromonów na podstawie ścieżek mrówek
        for ant in ants:
            contribution = Q / ant.total_distance
            for i in range(len(ant.visited_cities) - 1):
                from_city = ant.visited_cities[i]
                to_city = ant.visited_cities[i + 1]
                pheromone_matrix[from_city][to_city] += contribution
                pheromone_matrix[to_city][from_city] += contribution  # Jeśli graf jest nieskierowany

        print(f"Iteracja {iteration + 1}: Najlepsza odległość = {best_distance}, Trasa = {best_tour}")

    print("\nNajlepsze znalezione rozwiązanie:")
    print(f"Odległość: {best_distance}")
    print(f"Trasa: {best_tour}")
    
    async_to_sync(channel_layer.group_send)(
        'notifications',
            {
                'type': 'send_notification',
                'message': f"Najlepsza odległość: {best_distance}, Trasa: {best_tour}",
            }
        )

