import { NgModule } from '@angular/core';

import { DemoComponent } from './demo.component';

@NgModule({
  declarations: [DemoComponent],
  entryComponents: [DemoComponent],
  exports: [DemoComponent]
})
export class DemoModule {}
