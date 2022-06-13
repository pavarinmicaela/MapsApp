import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
      .row {
        background-color: white;
        width: 400px;
        border-radius: 3px;
        bottom: 50px;
        left: 50px;
        padding: 10px;
        position: fixed;
        z-index:999;
      }
    `
  ]
})
export class ZoomRangeComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap!: ElementRef;
  private map!: mapboxgl.Map;
  public zoomLevel: number = 10;
  public center: [number, number] = [-71.299398, -41.148213,];

  constructor() { }

  ngOnDestroy(): void {
    this.map.off('zoom', () => {});
  }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.map.on('zoom', (event) => {
      this.zoomLevel = this.map.getZoom();
    });

    this.map.on('zoomend', (event) => {
      if (this.map.getZoom() > 19) {
        this.map.zoomTo(19);
      }
    });

    this.map.on('move', (event) => {
      const target = event.target;
      const {lng, lat} = target.getCenter();
      this.center = [lng, lat];
    });
  }

  zoomIn() {
    this.map.zoomIn();
  }

  zoomOut() {
    this.map.zoomOut();
  }

  zoomChange(zoom: string) {
    this.map.zoomTo(Number(zoom));
  }

}
