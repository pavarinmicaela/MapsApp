import { Component } from '@angular/core';

interface MenuItem {
  route: string,
  name: string
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
    `li {
      cursor: pointer
    }`
  ]
})
export class MenuComponent {

  public menuItems: MenuItem[] = [
    {
      route: 'maps/fullScreen',
      name: 'FullScreen'
    },
    {
      route: 'maps/zoomRange',
      name: 'ZoomRange'
    },
    {
      route: 'maps/markers',
      name: 'Markers'
    },
    {
      route: 'maps/properties',
      name: 'Properties'
    }
  ]

}
