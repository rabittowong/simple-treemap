import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';

import { TreemapItemModel } from '../model/treemap-item.model';
import { RectangleModel } from '../model/rectangle.model';

@Component({
  templateUrl: './treemap-content.component.html',
  styleUrls: ['./treemap-content.component.scss'],
})
export class TreemapContentComponent implements OnInit {
  form = {
    data: {
      inputType: <string>null,
      jsonString: <string>null,
      treemapItems: <TreemapItemModel[]>[],
      rowCount: <number>null,
      canvas: <RectangleModel[][]>[],
    },
    ui: {
      error: <Map<string, string>>new Map(),
      submitted: <boolean>false,
    },
    option: {
      inputTypes: <string[]>['Table', 'Json'],
    },
  }

  constructor() {
  }

  onChangeJsonString(): void {
    try {
      this.form.data.treemapItems = JSON.parse(this.form.data.jsonString);
    } catch (error) {
      console.log('error');
      this.form.ui.error.set('jsonString', 'Cannot parse Json string as Treemap Items');
    }
  }

  onAddTreemapItem(): void {
    this.form.data.treemapItems.push(new TreemapItemModel(null, null));
  }

  onRemoveTreemapItem(index: number): void {
    this.form.data.treemapItems.splice(index, 1);
  }

  onSubmit(): void {
    this.form.ui.submitted = true;
    this.form.ui.error = new Map();

    if (!this.form.data.inputType) {
      this.form.ui.error.set('inputType', 'Please enter Input Type');
    }

    if (_.find(this.form.data.treemapItems, (i) => !i.name || i.value == null)) {
      this.form.ui.error.set('treemapItems', 'Please enter all the values');
    } else if (_.find(this.form.data.treemapItems, (i) => i.value == 0)) {
      this.form.ui.error.set('treemapItems', 'Please enter positive values');
    }

    if (!this.form.data.rowCount) {
      this.form.ui.error.set('rowCount', 'Please enter Number of Rows');
    } else if (this.form.data.rowCount > this.form.data.treemapItems.length) {
      this.form.ui.error.set('rowCount', 'Number of Rows cannot be larger then number of Items');
    }

    if (this.form.ui.error.size == 0) {
      this.generateTreemap();
    }
  }

  generateTreemap(): void {
    this.form.data.canvas = [];
    _.times(this.form.data.rowCount, () => this.form.data.canvas.push([]));

    const rectangles = this.form.data.treemapItems.map(i => new RectangleModel(i)).sort((a, b) => b.value - a.value);
    this.fillCanvas(rectangles);
    this.updateRectangleWeight();
  }

  fillCanvas(rectangles: RectangleModel[]): void {
    if (rectangles.length <= 0) {
      return;
    }

    const minWeight = _.min(this.form.data.canvas.map(r => this.totalValue(r)));
    const targetRow = this.form.data.canvas.find(r => this.totalValue(r) == minWeight);
    targetRow.push(rectangles[0]);
    this.fillCanvas(rectangles.slice(1, rectangles.length));
  }

  totalValue(rectangles: RectangleModel[]): number {
    return rectangles.reduce((a, b) => a + b.value, 0);
  }

  updateRectangleWeight(): void {
    const maxWeight = _.max(this.form.data.canvas.map(r => this.totalValue(r)));
    this.form.data.canvas.forEach(row => {
      row.forEach((r) => r.weight = r.value / maxWeight);
    });
  }

  ngOnInit(): void {
    // this.form.data.rectangles.push(new TreemapItemModel(null, null));

    this.form.data.inputType = 'Json';
    this.form.data.jsonString = '[{"name":"Banana","value":6},{"name":"Fig","value":8},{"name":"Cherry","value":4},{"name":"Dragon Fruit","value":3},{"name":"Apple","value":1},{"name":"Elderberry","value":2}]';

    // this.form.data.treemapItems.push(new TreemapItemModel('Banana', 6));
    // this.form.data.treemapItems.push(new TreemapItemModel('Fig', 8));
    // this.form.data.treemapItems.push(new TreemapItemModel('Cherry', 4));
    // this.form.data.treemapItems.push(new TreemapItemModel('Dragon Fruit', 3));
    // this.form.data.treemapItems.push(new TreemapItemModel('Apple', 1));
    // this.form.data.treemapItems.push(new TreemapItemModel('Elderberry', 2));
    this.form.data.rowCount = 3;

    this.onChangeJsonString();
    this.onSubmit();
  }
}
