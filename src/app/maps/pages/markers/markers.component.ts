import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface MarkerColor {
  color: string,
  marker?: mapboxgl.Marker,
  centro?: [number, number] 
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styles: [`
    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 999;
    }

    li {
      cursor: pointer;
    }
  `
  ]
})
export class MarkersComponent implements AfterViewInit {

  @ViewChild('map') divMap!: ElementRef;
  private map!: mapboxgl.Map;
  public zoomLevel: number = 10;
  public center: [number, number] = [-71.299398, -41.148213,];

  public markersColor: MarkerColor [] = [];

  constructor() { }

  ngAfterViewInit() {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.center,
      zoom: this.zoomLevel
    });

    this.readLocalStorage();

    /* const markerHtml: HTMLElement = document.createElement('div');
    markerHtml.innerHTML = 'Hola mundo';

    new mapboxgl.Marker({element: markerHtml}).setLngLat(this.center).addTo(this.map); */
  }

  public addMarker() {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const newMarker = new mapboxgl.Marker({draggable: true, color}).setLngLat(this.center).addTo(this.map);

    this.markersColor.push({
      color,
      marker: newMarker
    });

    this.saveMarkers();

    newMarker.on('dragend', () => {
      this.saveMarkers();
    });
  }

  public goToMarker(marker: mapboxgl.Marker) {
    this.map.flyTo({
      center: marker.getLngLat()
    });
  }

  public saveMarkers() {
    const lngLatArr: MarkerColor[] = [];

    this.markersColor.forEach( m => {
      const color = m.color;
      const { lng, lat } = m.marker!.getLngLat();

      lngLatArr.push({
        color,
        centro: [lng, lat]
      });
    });

    localStorage.setItem('markers', JSON.stringify(lngLatArr));
  }

  readLocalStorage() {
    if (!localStorage.getItem('markers')) {
      return;
    }
    const lngLatArr: MarkerColor[] = JSON.parse(localStorage.getItem('markers')!);

    lngLatArr.forEach(m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true,
      })
      .setLngLat(m.centro!)
      .addTo(this.map);

      this.markersColor.push({
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', () => {
        this.saveMarkers();
      });
    });
  }

  deleteMarker(i: number) {
    this.markersColor[i].marker?.remove();
    this.markersColor.splice(i,1);
    this.saveMarkers();
  }

}
