import { CommonModule } from "@angular/common";
import { AfterViewInit, Component, HostListener, OnDestroy } from "@angular/core";
import { RouterModule } from "@angular/router";
import * as d3 from "d3";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div id="background-container"></div>
    <div id="content-container">
      <router-outlet />
    </div>
  `,
  styles: [
    `
      #background-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1; /* Place background behind content */
        overflow: hidden;
      }

      #content-container {
        position: relative;
        z-index: 1;
      }

      body, html {
        margin: 0;
        overflow: hidden; /* Prevent scrollbars for fullscreen background */
      }
    `,
  ],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any> | null = null;
  private animationId: number | null = null;

  ngAfterViewInit(): void {
    this.initBackgroundAnimation();
  }

  @HostListener("window:resize", ["$event"])
  onResize(): void {
    this.updateBackgroundSize();
  }

  ngOnDestroy(): void {
    if (this.svg) {
      this.svg.remove();
    }
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private initBackgroundAnimation(): void {
    const container = d3.select("#background-container");
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const shapes = this.generateShapes(width, height, 50);

    const group = this.svg
      .selectAll<SVGGElement, { x: number; y: number; size: number; shape: string; color: string; rotation: number; speed: number }>("g")
      .data(shapes)
      .enter()
      .append("g")
      .attr("transform", (d) => `translate(${d.x}, ${d.y})`);

    group
      .append("path")
      .attr("d", (d) => this.getShapePath(d.shape, d.size))
      .attr("fill", (d) => d.color)
      .attr("opacity", 0.8);

    this.animateShapes(group);
  }

  private generateShapes(width: number, height: number, count: number) {
    const shapes = ["circle", "square", "triangle"];
    return d3.range(count).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 40 + 20,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: `hsl(${Math.random() * 360}, 80%, 70%)`,
      rotation: Math.random() * 360,
      speed: Math.random() * 0.5 + 0.2,
    }));
  }

  private getShapePath(shape: string, size: number): string {
    switch (shape) {
      case "circle":
        return `M ${-size}, 0 a ${size},${size} 0 1,0 ${size * 2},0 a ${size},${size} 0 1,0 -${size * 2},0`;
      case "square":
        return `M ${-size} ${-size} L ${size} ${-size} L ${size} ${size} L ${-size} ${size} Z`;
      case "triangle":
        const height = (size * Math.sqrt(3)) / 2;
        return `M 0 ${-height} L ${-size} ${height} L ${size} ${height} Z`;
      default:
        return "";
    }
  }

  private animateShapes(
    group: d3.Selection<SVGGElement, { x: number; y: number; size: number; shape: string; color: string; rotation: number; speed: number }, SVGSVGElement, unknown>
  ) {
    const updateAnimation = () => {
      group.attr("transform", (d) => {
        d.rotation += d.speed;
        return `translate(${d.x}, ${d.y}) rotate(${d.rotation})`;
      });
      this.animationId = requestAnimationFrame(updateAnimation);
    };
    updateAnimation();
  }

  private updateBackgroundSize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.svg) {
      this.svg.attr("width", width).attr("height", height);
    }
  }
}
