import threading
import random
import logging
import tsplib95
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import urllib.request
import urllib.error
import os

class AntAlgorithm:
    def __init__(self):
        self._running = False
        

        # Wybierz zestaw danych: 'berlin52' lub 'att48'
        # dataset = 'berlin52'

        # if dataset == 'berlin52':
        #     file_name = 'api/data/berlin52.tsp'
        # elif dataset == 'att48':
        #     file_name = 'api/data/att48.tsp'
        # else:
        #     raise ValueError('Nieznany zestaw danych')

        # # Sprawdź, czy plik istnieje
        # if not os.path.exists(file_name):
        #     logging.error(f"Plik {file_name} nie istnieje.")
        #     raise FileNotFoundError(f"Plik {file_name} nie został znaleziony.")

        # problem = tsplib95.load(file_name)
        
        problem = tsplib95.load('berlin52.tsp')
        
        logging.info(f"problem: {problem}")
        

        # Inicjalizacja grafu
        self.graph = Graph(problem)

        # Parametry algorytmu
        num_ants = 20
        num_iterations = 1000000  # Duża liczba, aby algorytm mógł działać ciągle
        evaporation_rate = 0.5
        Q = 100

        self.colony = AntColony(self.graph, num_ants, num_iterations, evaporation_rate, Q)

    def start(self):
        logging.info("Uruchamianie algorytmu mrówkowego")
        self._running = True

        # Uruchomienie algorytmu w osobnym wątku
        threading.Thread(target=self.run_algorithm).start()

    def run_algorithm(self):
        self.colony.run(send_update_callback=self.send_update_if_running)

    def stop(self):
        self._running = False
        self.colony.stop()

    def send_update_if_running(self, data):
        if self._running:
            self.send_update(data)
        else:
            return

    def send_update(self, data):
        logging.info("Wysyłanie aktualizacji stanu algorytmu")
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            'notifications',
            {
                'type': 'send_notification',
                'message': data,
            }
        )

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
    def __init__(self, graph):
        self.graph = graph
        self.tour = []
        self.total_distance = 0.0

    def find_tour(self):
        unvisited = set(self.graph.nodes)
        current_node = random.choice(self.graph.nodes)
        self.tour.append(current_node)
        unvisited.remove(current_node)

        while unvisited:
            next_node = self.select_next_node(current_node, unvisited)
            self.total_distance += self.graph.get_distance(current_node, next_node)
            current_node = next_node
            self.tour.append(current_node)
            unvisited.remove(current_node)

        # Powrót do miasta początkowego
        start_node = self.tour[0]
        self.total_distance += self.graph.get_distance(current_node, start_node)
        self.tour.append(start_node)

    def select_next_node(self, current_node, unvisited):
        alpha = 1  # Waga feromonów
        beta = 5   # Waga heurystyki (odwrotność odległości)

        pheromone = self.graph.pheromones
        distances = self.graph.distances

        total = 0.0
        probabilities = []
        for node in unvisited:
            pheromone_value = pheromone[(current_node, node)] ** alpha
            heuristic = (1.0 / distances[(current_node, node)]) ** beta
            prob = pheromone_value * heuristic
            probabilities.append((node, prob))
            total += prob

        probabilities = [(node, prob / total) for node, prob in probabilities]

        # Ruletkowy wybór kolejnego miasta
        r = random.random()
        cumulative = 0.0
        for node, prob in probabilities:
            cumulative += prob
            if r <= cumulative:
                return node
        return probabilities[-1][0]  # W razie problemów zwracamy ostatni węzeł

class AntColony:
    def __init__(self, graph, num_ants, num_iterations, evaporation_rate, Q):
        self.graph = graph
        self.num_ants = num_ants
        self.num_iterations = num_iterations
        self.evaporation_rate = evaporation_rate
        self.Q = Q
        self.best_tour = None
        self.best_distance = float('inf')
        self._running = True

    def run(self, send_update_callback=None):
        iteration = 0
        while self._running and iteration < self.num_iterations:
            iteration += 1
            ants = [Ant(self.graph) for _ in range(self.num_ants)]
            for ant in ants:
                ant.find_tour()
                if ant.total_distance < self.best_distance:
                    self.best_distance = ant.total_distance
                    self.best_tour = ant.tour.copy()

            self.update_pheromones(ants)

            # Wysyłanie aktualizacji
            if send_update_callback:
                data = {
                    'iteration': iteration,
                    'best_distance': self.best_distance,
                    'best_tour': self.best_tour,
                }
                send_update_callback(data)

    def stop(self):
        self._running = False

    def update_pheromones(self, ants):
        # Parowanie feromonów
        for edge in self.graph.pheromones:
            self.graph.pheromones[edge] *= (1 - self.evaporation_rate)
            if self.graph.pheromones[edge] < 0.1:
                self.graph.pheromones[edge] = 0.1  # Zapobieganie zerowym wartościom

        # Dodawanie nowych feromonów
        for ant in ants:
            contribution = self.Q / ant.total_distance
            for i in range(len(ant.tour) - 1):
                from_node = ant.tour[i]
                to_node = ant.tour[i + 1]
                self.graph.pheromones[(from_node, to_node)] += contribution
                self.graph.pheromones[(to_node, from_node)] += contribution  # Jeśli graf jest nieskierowany
