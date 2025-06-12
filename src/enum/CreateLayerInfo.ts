import { LayerType } from '../enum/LayerType';
import { URLTileSetModelConstructorOptions } from '@luciad/ria/model/tileset/UrlTileSetModel';
import { WMSTileSetModelConstructorOptions } from '@luciad/ria/model/tileset/WMSTileSetModel';
import { WFSFeatureStoreConstructorOptions } from '@luciad/ria/model/store/WFSFeatureStore';
import { CreateOGC3DTilesModelOptions } from '@luciad/ria/model/tileset/OGC3DTilesModel';
import { CreateHSPCTilesModelOptions } from '@luciad/ria/model/tileset/HSPCTilesModel';
import { FusionTileSetModelConstructorOptions } from '@luciad/ria/model/tileset/FusionTileSetModel';
import { RasterTileSetLayerConstructorOptions } from '@luciad/ria/view/tileset/RasterTileSetLayer';
import { FeatureLayerConstructorOptions } from '@luciad/ria/view/feature/FeatureLayer';
import { TileSet3DLayerConstructorOptions } from '@luciad/ria/view/tileset/TileSet3DLayer';
import { KMLLayerConstructorOptions } from '@luciad/ria/view/kml/KMLLayer';
import { LayerConstructorOptions } from '@luciad/ria/view/LayerTreeNode';
import { FeatureModelConstructorOptions } from '@luciad/ria/model/feature/FeatureModel';

export interface CreateLayerGroupInfo {
  type: LayerType.LAYER_GROUP;
  layerOptions: LayerConstructorOptions;
  parentId: string | null;
}

export interface CreateOGC3DTilesLayerInfo {
  id: string;
  type: LayerType.OGC_3D_TILES;
  url: string;
  modelOptions: CreateOGC3DTilesModelOptions;
  layerOptions: Omit<TileSet3DLayerConstructorOptions, 'transformation'> & {
    offsetTransformation: { x: number; y: number; z: number };
  };
  autoZoom?: boolean;
  parentId: string;
}

export interface CreateHSPCLayerInfo {
  type: LayerType.HSPC;
  url: string;
  modelOptions: CreateHSPCTilesModelOptions;
  layerOptions: Omit<TileSet3DLayerConstructorOptions, 'transformation'> & {
    offsetTransformation: { x: number; y: number; z: number };
  };
  autoZoom?: boolean;
  parentId: string;
}

export interface CreateFeatureLayerInfo {
  type: LayerType.FEATURE;
  modelOptions: FeatureModelConstructorOptions;
  layerOptions: FeatureLayerConstructorOptions;
  autoZoom?: boolean;
  parentId: string;
}

export interface CreateLTSLayerInfo {
  type: LayerType.LTS;
  modelOptions: FusionTileSetModelConstructorOptions;
  layerOptions: RasterTileSetLayerConstructorOptions;
  parentId: string;
}

export interface CreateTMSLayerInfo {
  type: LayerType.TMS;
  modelOptions: URLTileSetModelConstructorOptions;
  layerOptions: RasterTileSetLayerConstructorOptions;
  parentId: string;
}

export interface CreateWMSLayerInfo {
  type: LayerType.WMS;
  modelOptions: WMSTileSetModelConstructorOptions;
  layerOptions: RasterTileSetLayerConstructorOptions;
  parentId: string;
}

export interface CreateWFSLayerInfo {
  type: LayerType.WFS;
  constructorOptions: WFSFeatureStoreConstructorOptions;
  layerOptions: RasterTileSetLayerConstructorOptions;
  parentId: string;
}

export interface CreateKMLLayerInfo {
  type: LayerType.KML;
  uri: string;
  layerOptions: KMLLayerConstructorOptions;
  parentId: string;
}

export interface CreateBingMapsLayerInfo {
  type: LayerType.BING_MAP;
  uri: string;
  layerOptions: RasterTileSetLayerConstructorOptions;
  parentId: string;
}

export type CreateLayerInfo =
  | CreateLayerGroupInfo
  | CreateOGC3DTilesLayerInfo
  | CreateHSPCLayerInfo
  | CreateFeatureLayerInfo
  | CreateLTSLayerInfo
  | CreateTMSLayerInfo
  | CreateWMSLayerInfo
  | CreateWFSLayerInfo
  | CreateKMLLayerInfo
  | CreateBingMapsLayerInfo;
