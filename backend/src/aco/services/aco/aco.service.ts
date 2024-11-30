import { Injectable } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { City } from 'src/aco/repositories/tsplib95/tsplib95.service';

export type SseEvent = {
    path: number[];
    distance: number;
    iterationCount: number;
    finish?: boolean;
};

@Injectable()
export class AcoService {
    private alpha = 1.2; // Importance of pheromone
    private beta = 3.0; // Importance of distance
    private evaporationRate = 0.3; // Pheromone evaporation rate
    private antCount = 50; // Number of ants
    private iterations = 1500; // Number of iterations
    private pheromoneMatrix: number[][] = [];
    private shortestPathSubject = new Subject<SseEvent>();
    private stopFlag = false; // Stop flag to interrupt the algorithm

    getShortestPathUpdates(): Observable<SseEvent> {
        return this.shortestPathSubject.asObservable();
    }

    async startAlgorithm(cities: City[]): Promise<void> {
        this.stopFlag = false; // Reset the stop flag
        const cityCount = cities.length;

        // Initialize pheromone matrix
        this.initializePheromoneMatrix(cityCount);

        let bestPath: number[] = [];
        let bestDistance = Infinity;

        for (let iter = 0; iter < this.iterations; iter++) {
            if (this.stopFlag) {
                console.log('Algorithm stopped');
                break;
            }

            const allPaths: { path: number[]; distance: number }[] = [];

            for (let ant = 0; ant < this.antCount; ant++) {
                const path = this.generateAntPath(cityCount, cities);
                const distance = this.calculatePathDistance(path, cities);

                allPaths.push({ path, distance });

                // If a shorter path is found, emit it via Subject
                if (distance < bestDistance) {
                    bestDistance = distance;
                    bestPath = path;

                    // Emit the current best path, distance, and iteration count
                    this.shortestPathSubject.next({
                        path: bestPath,
                        distance: bestDistance,
                        iterationCount: iter, // Include iteration count here
                    });
                }
            }

            // Update pheromones
            this.updatePheromones(allPaths);

            // Allow asynchronous updates for real-time updates
            await new Promise((resolve) => setTimeout(resolve, 0));
        }

        // Emit final event to indicate completion
        this.shortestPathSubject.next({
            path: bestPath,
            distance: bestDistance,
            iterationCount: this.iterations, // Final iteration count
            finish: true, // Indicate algorithm completion
        });

        console.log('Algorithm completed');
    }

    stopAlgorithm(): void {
        if (!this.stopFlag) {
            this.stopFlag = true;
            this.shortestPathSubject.next({
                path: [],
                distance: 0,
                iterationCount: 0,
                finish: true,
            }); // Notify stop
        }
    }

    private initializePheromoneMatrix(cityCount: number): void {
        this.pheromoneMatrix = Array.from({ length: cityCount }, () =>
            Array(cityCount).fill(1)
        );
    }

    private generateAntPath(cityCount: number, cities: City[]): number[] {
        const path: number[] = [];
        const visited = new Set<number>();
        let currentCity = Math.floor(Math.random() * cityCount);

        path.push(currentCity);
        visited.add(currentCity);

        while (path.length < cityCount) {
            const nextCity = this.selectNextCity(currentCity, visited, cities);
            path.push(nextCity);
            visited.add(nextCity);
            currentCity = nextCity;
        }

        return path;
    }

    private selectNextCity(
        currentCity: number,
        visited: Set<number>,
        cities: City[]
    ): number {
        const probabilities: number[] = [];
        let sum = 0;

        for (let city = 0; city < cities.length; city++) {
            if (!visited.has(city)) {
                const pheromone = this.pheromoneMatrix[currentCity][city];
                const distance = this.euclideanDistance(cities[currentCity], cities[city]);
                const value = Math.pow(pheromone, this.alpha) * Math.pow(1 / distance, this.beta);
                probabilities.push(value);
                sum += value;
            } else {
                probabilities.push(0);
            }
        }

        if (sum === 0) {
            console.warn(`Probabilities are zero, selecting a random unvisited city.`);
            const unvisited = Array.from({ length: cities.length }, (_, i) => i).filter(city => !visited.has(city));
            return unvisited[Math.floor(Math.random() * unvisited.length)];
        }

        // Normalize probabilities
        const normalized = probabilities.map((p) => p / sum);
        const cumulative = normalized.reduce(
            (acc, prob, i) => [...acc, (acc[i - 1] || 0) + prob],
            [] as number[]
        );

        const rand = Math.random();
        for (let i = 0; i < cumulative.length; i++) {
            if (rand <= cumulative[i]) {
                return i;
            }
        }

        console.error('Failed to select next city, falling back to random choice.');
        const unvisited = Array.from({ length: cities.length }, (_, i) => i).filter(city => !visited.has(city));
        return unvisited[Math.floor(Math.random() * unvisited.length)];
    }

    private calculatePathDistance(path: number[], cities: City[]): number {
        let totalDistance = 0;

        for (let i = 0; i < path.length - 1; i++) {
            const cityA = cities[path[i]];
            const cityB = cities[path[i + 1]];
            totalDistance += this.euclideanDistance(cityA, cityB);
        }

        totalDistance += this.euclideanDistance(
            cities[path[path.length - 1]],
            cities[path[0]]
        );

        return totalDistance;
    }

    private euclideanDistance(cityA: City, cityB: City): number {
        return Math.sqrt(
            Math.pow(cityA.x - cityB.x, 2) + Math.pow(cityA.y - cityB.y, 2)
        );
    }

    private updatePheromones(allPaths: { path: number[]; distance: number }[]): void {
        // Evaporate pheromones
        for (let i = 0; i < this.pheromoneMatrix.length; i++) {
            for (let j = 0; j < this.pheromoneMatrix[i].length; j++) {
                this.pheromoneMatrix[i][j] *= 1 - this.evaporationRate;
            }
        }

        // Add pheromone contributions
        for (const { path, distance } of allPaths) {
            const pheromoneContribution = 1 / distance;

            for (let i = 0; i < path.length - 1; i++) {
                const cityA = path[i];
                const cityB = path[i + 1];
                this.pheromoneMatrix[cityA][cityB] += pheromoneContribution;
                this.pheromoneMatrix[cityB][cityA] += pheromoneContribution;
            }

            const lastCity = path[path.length - 1];
            const firstCity = path[0];
            this.pheromoneMatrix[lastCity][firstCity] += pheromoneContribution;
            this.pheromoneMatrix[firstCity][lastCity] += pheromoneContribution;
        }
    }
}
