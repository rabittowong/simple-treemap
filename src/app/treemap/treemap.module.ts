import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { TreemapContentComponent } from './treemap-content.component';
import { routes } from './treemap.routes';

@NgModule({
  declarations: [
    TreemapContentComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
  ],
})
export class TreemapModule {}
