import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-plugin-app-page',
  template: `
    <span>This is a Plugin Page</span>
  `
})
export class PluginPageComponent implements OnInit, OnDestroy {
  ngOnInit(): void {
    console.warn('[ plugin-component ] plugin-page inited!');
  }

  ngOnDestroy(): void {
    console.warn('[ plugin-component ] plugin-page destroyed!');
  }
}
