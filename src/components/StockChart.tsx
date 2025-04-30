import React, { useEffect, useRef } from 'react';
import { ChartData } from '../data/mockData';

interface StockChartProps {
  data: ChartData[];
  width?: number;
  height?: number;
  color?: string;
  showGrid?: boolean;
  showTooltip?: boolean;
  showArea?: boolean;
}

const StockChart: React.FC<StockChartProps> = ({
  data,
  width = 600,
  height = 300,
  color = '#387ED1',
  showGrid = true,
  showTooltip = true,
  showArea = true,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data.length || !svgRef.current) return;

    const svg = svgRef.current;
    const tooltipElement = tooltipRef.current;
    
    // Clear previous content
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    // Set dimensions
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Create the chart group
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);

    // Extract values from data
    const xValues = data.map(d => new Date(d.date));
    const yValues = data.map(d => d.value);

    // Calculate domains
    const xMin = Math.min(...xValues.map(d => d.getTime()));
    const xMax = Math.max(...xValues.map(d => d.getTime()));
    const yMin = Math.min(...yValues) * 0.99;
    const yMax = Math.max(...yValues) * 1.01;

    // Create scales
    const xScale = (x: number) => ((x - xMin) / (xMax - xMin)) * chartWidth;
    const yScale = (y: number) => chartHeight - ((y - yMin) / (yMax - yMin)) * chartHeight;

    // Create grid lines if enabled
    if (showGrid) {
      // X grid lines
      const xGridCount = 6;
      for (let i = 0; i <= xGridCount; i++) {
        const xPos = (chartWidth / xGridCount) * i;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', String(xPos));
        line.setAttribute('y1', '0');
        line.setAttribute('x2', String(xPos));
        line.setAttribute('y2', String(chartHeight));
        line.setAttribute('stroke', '#e0e0e0');
        line.setAttribute('stroke-width', '1');
        g.appendChild(line);
      }

      // Y grid lines
      const yGridCount = 5;
      for (let i = 0; i <= yGridCount; i++) {
        const yPos = (chartHeight / yGridCount) * i;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', '0');
        line.setAttribute('y1', String(yPos));
        line.setAttribute('x2', String(chartWidth));
        line.setAttribute('y2', String(yPos));
        line.setAttribute('stroke', '#e0e0e0');
        line.setAttribute('stroke-width', '1');
        g.appendChild(line);
      }
    }

    // Create path for line chart
    let path = 'M';
    const points: [number, number][] = [];

    data.forEach((d, i) => {
      const x = xScale(new Date(d.date).getTime());
      const y = yScale(d.value);
      points.push([x, y]);
      
      if (i === 0) {
        path += `${x},${y}`;
      } else {
        path += ` L${x},${y}`;
      }
    });

    // Draw area if enabled
    if (showArea) {
      const areaPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      let areaPathD = path;
      
      // Complete the area path by extending to the bottom right, then bottom left, then back to start
      areaPathD += ` L${points[points.length - 1][0]},${chartHeight}`;
      areaPathD += ` L${points[0][0]},${chartHeight}`;
      areaPathD += ' Z';
      
      areaPath.setAttribute('d', areaPathD);
      areaPath.setAttribute('fill', color);
      areaPath.setAttribute('fill-opacity', '0.1');
      g.appendChild(areaPath);
    }

    // Draw the line
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathElement.setAttribute('d', path);
    pathElement.setAttribute('fill', 'none');
    pathElement.setAttribute('stroke', color);
    pathElement.setAttribute('stroke-width', '2');
    pathElement.classList.add('chart-animate');
    g.appendChild(pathElement);

    // X-axis
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    xAxis.setAttribute('transform', `translate(0,${chartHeight})`);
    
    // Add x-axis labels
    const dateLabels = 6;
    for (let i = 0; i < data.length; i += Math.floor(data.length / dateLabels)) {
      const d = data[i];
      const x = xScale(new Date(d.date).getTime());
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', String(x));
      text.setAttribute('y', '20');
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', '#666');
      
      const dateFormatted = new Date(d.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      text.textContent = dateFormatted;
      
      xAxis.appendChild(text);
    }
    
    g.appendChild(xAxis);

    // Y-axis
    const yAxisLabels = 5;
    for (let i = 0; i <= yAxisLabels; i++) {
      const value = yMin + ((yMax - yMin) / yAxisLabels) * i;
      const y = yScale(value);
      
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      text.setAttribute('x', '-5');
      text.setAttribute('y', String(y));
      text.setAttribute('text-anchor', 'end');
      text.setAttribute('dominant-baseline', 'middle');
      text.setAttribute('font-size', '10');
      text.setAttribute('fill', '#666');
      text.textContent = value.toFixed(2);
      
      g.appendChild(text);
    }

    // Add interaction layer for tooltips
    if (showTooltip && tooltipElement) {
      const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      overlay.setAttribute('width', String(chartWidth));
      overlay.setAttribute('height', String(chartHeight));
      overlay.setAttribute('fill', 'transparent');
      g.appendChild(overlay);

      // Track dot for hover
      const trackDot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      trackDot.setAttribute('r', '4');
      trackDot.setAttribute('fill', color);
      trackDot.setAttribute('display', 'none');
      g.appendChild(trackDot);

      // Vertical line for tracking
      const trackLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      trackLine.setAttribute('stroke', '#999');
      trackLine.setAttribute('stroke-width', '1');
      trackLine.setAttribute('stroke-dasharray', '3,3');
      trackLine.setAttribute('display', 'none');
      trackLine.setAttribute('y1', '0');
      trackLine.setAttribute('y2', String(chartHeight));
      g.appendChild(trackLine);

      // Mouse events for tooltip
      overlay.addEventListener('mousemove', (event) => {
        const svgRect = svg.getBoundingClientRect();
        const mouseX = event.clientX - svgRect.left - margin.left;
        
        // Find nearest data point
        let closestIdx = 0;
        let closestDist = Infinity;
        
        points.forEach((point, idx) => {
          const dist = Math.abs(point[0] - mouseX);
          if (dist < closestDist) {
            closestDist = dist;
            closestIdx = idx;
          }
        });
        
        const [x, y] = points[closestIdx];
        
        // Position dot and line
        trackDot.setAttribute('cx', String(x));
        trackDot.setAttribute('cy', String(y));
        trackDot.setAttribute('display', 'block');
        
        trackLine.setAttribute('x1', String(x));
        trackLine.setAttribute('x2', String(x));
        trackLine.setAttribute('display', 'block');
        
        // Update tooltip content
        const dataPoint = data[closestIdx];
        const date = new Date(dataPoint.date).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        
        tooltipElement.innerHTML = `
          <div>${date}</div>
          <div><strong>₹${dataPoint.value.toFixed(2)}</strong></div>
        `;
        
        // Position tooltip
        const tooltipWidth = tooltipElement.offsetWidth;
        let tooltipX = event.clientX - svgRect.left - tooltipWidth / 2;
        
        // Prevent tooltip from going outside chart
        if (tooltipX < 0) {
          tooltipX = 0;
        } else if (tooltipX + tooltipWidth > width) {
          tooltipX = width - tooltipWidth;
        }
        
        tooltipElement.style.left = `${tooltipX}px`;
        tooltipElement.style.top = `${event.clientY - svgRect.top - 60}px`;
        tooltipElement.style.display = 'block';
      });
      
      overlay.addEventListener('mouseleave', () => {
        trackDot.setAttribute('display', 'none');
        trackLine.setAttribute('display', 'none');
        tooltipElement.style.display = 'none';
      });
    }

  }, [data, width, height, color, showGrid, showTooltip, showArea]);

  return (
    <div className="relative">
      <svg ref={svgRef} width={width} height={height} />
      {showTooltip && (
        <div
          ref={tooltipRef}
          className="absolute hidden bg-white px-3 py-2 rounded shadow-md text-sm"
          style={{ pointerEvents: 'none' }}
        />
      )}
    </div>
  );
};

export default StockChart;