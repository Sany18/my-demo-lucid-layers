import { LayerType } from '@luciad/ria/view/LayerType';
import { RasterTileSetLayer } from '@luciad/ria/view/tileset/RasterTileSetLayer';
import { BingMapsTileSetModel } from '@luciad/ria/model/tileset/BingMapsTileSetModel';
import { FeatureLayerConstructorOptions } from '@luciad/ria/view/feature/FeatureLayer';

export class LayerFactory {
  public static createBingmapsLayer(bingModel: BingMapsTileSetModel, command: FeatureLayerConstructorOptions) {
    let options = { ...command };
    return new Promise<RasterTileSetLayer>((resolve, reject) => {
      if (typeof options === 'undefined') {
        options = {};
      }
      options.label = options.label ? options.label : 'Bingmaps';
      options.layerType = options.layerType ? options.layerType : LayerType.STATIC;
      const layer = new RasterTileSetLayer(bingModel, options);
      if (layer) {
        resolve(layer);
      } else {
        reject();
      }
    });
  }
}
