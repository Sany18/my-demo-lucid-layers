import { Layer } from '@luciad/ria/view/Layer';
import { LayerGroup } from '@luciad/ria/view/LayerGroup';
import { ModelFactory } from './ModelFactory';
import { LayerFactory } from './LayerFactory';

export function CreateNewLayer(layerInfo) {
  async function createBingmapsLayer(layerInfo) {
    const model = await ModelFactory.createBingmapsModel(layerInfo.model);
    const layer = await LayerFactory.createBingmapsLayer(model, layerInfo.layer);
    return layer;
  }

  return new Promise<Layer | LayerGroup>((resolve, reject) => {
    switch (layerInfo.layerType) {
      case 'BingmapsLayer':
        {
          const layer = createBingmapsLayer(layerInfo);
          if (layer) resolve(layer);
          else reject();
        }
        break;
    }
  });
}
