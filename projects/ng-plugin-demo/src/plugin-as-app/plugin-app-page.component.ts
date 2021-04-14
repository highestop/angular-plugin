import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-plugin-app-page',
  template: `
    <span>This is a Plugin App Page</span>
    <span style="background-color: red">RED</span>
    <span style="background-color: gold">GOLD</span>
    <span style="background-color: green">GREEN</span>
  `
})
export class PluginAppPageComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.warn('[ plugin-app ] plugin-app-page inited!');
  }

  ngOnDestroy(): void {
    console.warn('[ plugin-app ] plugin-app-page destroyed!');
  }
}
