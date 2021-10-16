import { TreemapItemModel } from './treemap-item.model';

export class RectangleModel {
  name: string;
  value: number;
  weight: number;

  constructor(treemapItem: TreemapItemModel) {
    this.name = treemapItem.name;
    this.value = treemapItem.value;
  }
}
