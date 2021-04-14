import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NgPluginComponentCreator,
  NgPluginInstanceStore
} from 'ng-plugin-manager';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  plugin: any = null;

  @ViewChild('container', { static: false, read: ViewContainerRef })
  container!: ViewContainerRef;

  constructor(
    private plugins: NgPluginInstanceStore,
    private creator: NgPluginComponentCreator,
    private router: Router
  ) {
    this.router.navigate(['demo', 'plugin-app-1']);
  }

  ngOnInit(): void {
    console.warn('[ app ] app-component inited!');
  }

  ngOnDestroy(): void {
    console.warn('[ app ] app-component destroyed!');
  }

  renderComponent(): void {
    this.plugin = this.plugins.get('ng-plugin-demo/plugin-component');
  }

  showComponent(): void {
    this.creator
      .createComponent('ng-plugin-demo/plugin-component')
      .create(null, this.container);
  }
}
