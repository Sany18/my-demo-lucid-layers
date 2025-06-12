import { FeatureModel } from '@luciad/ria/model/feature/FeatureModel';
import { KMLModel } from '@luciad/ria/model/kml/KMLModel';
import { MemoryStore } from '@luciad/ria/model/store/MemoryStore';
import { BingMapsTileSetModel } from '@luciad/ria/model/tileset/BingMapsTileSetModel';
import { FusionTileSetModel } from '@luciad/ria/model/tileset/FusionTileSetModel';
import { HSPCTilesModel } from '@luciad/ria/model/tileset/HSPCTilesModel';
import { OGC3DTilesModel } from '@luciad/ria/model/tileset/OGC3DTilesModel';
import { UrlTileSetModel } from '@luciad/ria/model/tileset/UrlTileSetModel';
import { WMSTileSetModel } from '@luciad/ria/model/tileset/WMSTileSetModel';
import { getReference } from '@luciad/ria/reference/ReferenceProvider';
import { Point } from '@luciad/ria/shape/Point';
import { createOffsetTransformation } from '@luciad/ria/transformation/Affine3DTransformation';
import { FeatureLayer } from '@luciad/ria/view/feature/FeatureLayer';
import { KMLLayer } from '@luciad/ria/view/kml/KMLLayer';
import { LayerGroup } from '@luciad/ria/view/LayerGroup';
import { LayerTreeNode } from '@luciad/ria/view/LayerTreeNode';
import { RasterTileSetLayer } from '@luciad/ria/view/tileset/RasterTileSetLayer';
import { TileSet3DLayer } from '@luciad/ria/view/tileset/TileSet3DLayer';
import { WMSTileSetLayer } from '@luciad/ria/view/tileset/WMSTileSetLayer';
import { CRSEnum } from 'enum/CRS.enum';
import { FeatureLayerId } from 'enum/FeatureLayerId';
import { LayerGroupId } from 'enum/LayerGroupId';
import { LayerType } from 'enum/LayerType';
import { WMSLayerId } from 'enum/WMSLayerId';
import { PerformanceSettingsService } from './performance-settings.service';
import { CreateBingMapsLayerInfo,
  CreateFeatureLayerInfo,
  CreateHSPCLayerInfo,
  CreateKMLLayerInfo,
  CreateLayerGroupInfo,
  CreateLayerInfo,
  CreateLTSLayerInfo,
  CreateOGC3DTilesLayerInfo,
  CreateTMSLayerInfo,
  CreateWFSLayerInfo,
  CreateWMSLayerInfo
} from 'enum/CreateLayerInfo';

export class LayerFactory {
  public static async createLayer(
    info: CreateLayerInfo,
    performanceSettingsService: PerformanceSettingsService,
  ): Promise<LayerTreeNode> {
    switch (info.type) {
      case LayerType.LAYER_GROUP:
        return createLayerGroup(info);
      case LayerType.OGC_3D_TILES:
        return createOGC3DTilesLayer(info, performanceSettingsService);
      case LayerType.HSPC:
        return createHSPCLayer(info, performanceSettingsService);
      case LayerType.FEATURE:
        return createFeatureLayer(info);
      case LayerType.WFS:
        return createWFSLayer(info);
      case LayerType.KML:
        return createKMLLayer(info);
      case LayerType.LTS:
        return createLTSLayer(info);
      case LayerType.TMS:
        return createTMSLayer(info);
      case LayerType.WMS:
        return createWMSLayer(info);
      case LayerType.BING_MAP:
        return createBingmapsLayer(info);
    }
  }

  public static async createDefaultLayers(commandService): Promise<void> {
    await createDefaultLayerGroups(commandService);
    await createDefaultWMSLayers(commandService);
    await createDefaultFeatureLayers(commandService);
  }
}

function createLayerGroup(info: CreateLayerGroupInfo) {
  return new LayerGroup(info.layerOptions);
}

function createWMSLayer(info: CreateWMSLayerInfo) {
  const model = new WMSTileSetModel(info.modelOptions);
  return new WMSTileSetLayer(model, info.layerOptions);
}

async function createBingmapsLayer(info: CreateBingMapsLayerInfo) {
  const response = await fetch(info.uri, { headers: { 'Content-Type': 'application/json' } });
  if (!response.ok) {
    throw new Error(`Error fetching Bing Maps layer: ${response.statusText}`);
  }

  const data = await response.json();
  const resource = data.resourceSets[0].resources[0];
  resource.imageUrl = resource.imageUrl.replace('http://ecn.', 'https://ecn.');
  resource.brandLogoUri = data.brandLogoUri;
  const model = new BingMapsTileSetModel(resource);
  return new RasterTileSetLayer(model, info.layerOptions);
}

async function createOGC3DTilesLayer(
  info: CreateOGC3DTilesLayerInfo,
  performanceSettingsService: PerformanceSettingsService,
) {
  const model = await OGC3DTilesModel.create(info.url, info.modelOptions);
  return new TileSet3DLayer(model, {
    id: info.id,
    ...info.layerOptions,
    transformation: createOffsetTransformation(info.layerOptions.offsetTransformation, model.bounds.focusPoint),
    ...performanceSettingsService.getPerformanceSettings(),
  });
}

async function createHSPCLayer(info: CreateHSPCLayerInfo, performanceSettingsService: PerformanceSettingsService) {
  const model = await HSPCTilesModel.create(info.url, info.modelOptions);

  // this is a small hack to tell RIA that unreferenced models are EPSG_4978
  const focusPoint = model.reference.equals(getReference('LUCIAD:XYZ'))
    ? ({ reference: getReference(CRSEnum.EPSG_4978), x: 0, y: 0, z: 0 } as Point)
    : model.bounds.focusPoint;

  return new TileSet3DLayer(model, {
    ...info.layerOptions,
    transformation: createOffsetTransformation(info.layerOptions.offsetTransformation, focusPoint),
    ...performanceSettingsService.getPerformanceSettings(),
    id: info.layerOptions.id.toString(),
  });
}

function createTMSLayer(info: CreateTMSLayerInfo) {
  const model = new UrlTileSetModel(info.modelOptions);
  return new RasterTileSetLayer(model, info.layerOptions);
}

function createFeatureLayer(info: CreateFeatureLayerInfo) {
  const model = new FeatureModel(new MemoryStore(), info.modelOptions);
  return new FeatureLayer(model, info.layerOptions);
}

function createWFSLayer(info: CreateWFSLayerInfo) {
  const model = new FeatureModel(new MemoryStore(), info.constructorOptions);
  return new FeatureLayer(model, info.layerOptions);
}

function createKMLLayer(info: CreateKMLLayerInfo) {
  const model = new KMLModel(info.uri);
  return new KMLLayer(model, info.layerOptions);
}
function createLTSLayer(info: CreateLTSLayerInfo) {
  const model = new FusionTileSetModel(info.modelOptions);
  return new RasterTileSetLayer(model, info.layerOptions);
}

async function createDefaultLayerGroups(commandService): Promise<void> {
  const layers: CreateLayerInfo[] = [
    {
      type: LayerType.LAYER_GROUP,
      layerOptions: {
        id: LayerGroupId.WMS,
        label: 'WMS Layers',
      },
      parentId: null,
    },
    {
      type: LayerType.LAYER_GROUP,
      layerOptions: {
        id: LayerGroupId.ASSETS,
        label: 'Assets',
      },
      parentId: null,
    },
    {
      type: LayerType.LAYER_GROUP,
      layerOptions: {
        id: LayerGroupId.EXTERNAL_DATASETS,
        label: 'External Datasets',
      },
      parentId: null,
    },
  ];

  for (const layerInfo of layers) {
    await commandService.createLayer(layerInfo);
  }
}

async function createDefaultWMSLayers(commandService): Promise<void> {
  const layers: CreateLayerInfo[] = [
    {
      type: LayerType.BING_MAP,
      uri: 'https://dev.virtualearth.net/REST/v1/Imagery/Metadata/Aerial?key=AugjqbGwtwHP0n0fUtpZqptdgkixBt5NXpfSzxb7q-6ATmbk-Vs4QnqiW6fhaV-i&include=ImageryProviders',
      layerOptions: {
        id: WMSLayerId.BINGMAP,
        label: 'BingMap',
      },
      parentId: LayerGroupId.WMS,
    },
    {
      type: LayerType.WMS,
      modelOptions: {
        getMapRoot: 'https://geodienste.hamburg.de/HH_WMS_DOP',
        layers: ['DOP'],
        reference: getReference(CRSEnum.EPSG_25832),
        transparent: true,
        imageFormat: 'image/png',
      },
      layerOptions: {
        id: WMSLayerId.HAMBURG,
        label: 'Hamburg (RGB)',
        visible: false,
      },
      parentId: LayerGroupId.WMS,
    },
    {
      type: LayerType.WMS,
      modelOptions: {
        getMapRoot: 'https://www.pegelonline.wsv.de/webservices/gis/wms',
        layers: ['PegelonlineWMS'],
        queryLayers: ['PegelonlineWMS'],
        reference: getReference(CRSEnum.EPSG_25832),
        transparent: true,
        imageFormat: 'image/png',
        infoFormat: 'text/html',
      },
      layerOptions: {
        id: WMSLayerId.PEGELONLINE,
        label: 'PegelOnline (MNW/MHW)',
        visible: false,
      },
      parentId: LayerGroupId.WMS,
    },
    {
      type: LayerType.WMS,
      modelOptions: {
        getMapRoot: 'https://via.bund.de/wsv/bwastr/wms',
        layers: ['WmsBWaStr'],
        queryLayers: ['WmsBWaStr'],
        reference: getReference(CRSEnum.EPSG_25832),
        transparent: true,
        imageFormat: 'image/png',
        infoFormat: 'text/html',
      },
      layerOptions: {
        id: WMSLayerId.BUNDESWASSERSTRASSEN,
        label: 'Bundeswasserstraßen',
        visible: false,
      },
      parentId: LayerGroupId.WMS,
    },

    {
      type: LayerType.WMS,
      modelOptions: {
        getMapRoot: 'https://via.bund.de/wsv/bwastr/wms?',
        layers: ['Kilometermarken'],
        reference: getReference(CRSEnum.EPSG_25832),
        transparent: true,
        imageFormat: 'image/png',
      },
      layerOptions: {
        id: WMSLayerId.KILOMETERMARKEN,
        label: 'Kilometermarken (WSV)',
        visible: false,
      },
      parentId: LayerGroupId.WMS,
    },
    {
      type: LayerType.WMS,
      modelOptions: {
        getMapRoot: 'https://via.bund.de/wsv/bwastr/wms?',
        layers: ['Fliessrichtung'],
        reference: getReference(CRSEnum.EPSG_25832),
        transparent: true,
        imageFormat: 'image/png',
      },
      layerOptions: {
        id: WMSLayerId.FLIESSRICHTUNG,
        label: 'Fließrichtung (WSV)',
        visible: false,
      },
      parentId: LayerGroupId.WMS,
    },
    {
      type: LayerType.WMS,
      modelOptions: {
        getMapRoot: 'https://via.bund.de/wsv/bwastr/wms?',
        layers: ['Gewaessernamen'],
        reference: getReference(CRSEnum.EPSG_25832),
        transparent: true,
        imageFormat: 'image/png',
      },
      layerOptions: {
        id: WMSLayerId.GEWAESSERNAMEN,
        label: 'Gewaessernamen (WSV)',
        visible: false,
      },
      parentId: LayerGroupId.WMS,
    },
    {
      type: LayerType.WMS,
      modelOptions: {
        getMapRoot: 'https://geodienste.hamburg.de/HH_WMS_Bohrsaeulendarstellung?',
        layers: ['bohrungen'],
        queryLayers: ['bohrungen'],
        reference: getReference(CRSEnum.EPSG_25832),
        transparent: true,
        imageFormat: 'image/png',
        infoFormat: 'text/html',
      },
      layerOptions: {
        id: WMSLayerId.BOHRUNGEN,
        label: 'Bodendaten GLA',
        visible: false,
      },
      parentId: LayerGroupId.WMS,
    },
    {
      type: LayerType.WMS,
      modelOptions: {
        getMapRoot: 'https://via.bund.de/wsv/ienc/wms?',
        layers: ['WmsIENC'],
        reference: getReference(CRSEnum.EPSG_25832),
        transparent: true,
        imageFormat: 'image/png',
      },
      layerOptions: {
        id: WMSLayerId.INLANDENC,
        label: 'InlandENCs (WSV)',
        visible: false,
      },
      parentId: LayerGroupId.WMS,
    },
    {
      type: LayerType.WMS,
      modelOptions: {
        getMapRoot: 'https://via.bund.de/wsv/wind/www/wms?SERVICE=WMS&',
        layers: ['300'],
        reference: getReference(CRSEnum.EPSG_25832),
        transparent: true,
        imageFormat: 'image/png',
      },
      layerOptions: {
        id: WMSLayerId.WIND,
        label: 'WinD - Objekte f. Schiffsverkehr',
        visible: false,
      },
      parentId: LayerGroupId.WMS,
    },
    // {
    //   type: LayerTypes.KMLLayer,
    //   uri: 'https://files.dev.port-ai.de/HydroMapper.kml',
    //   layerOptions: {
    //     label: 'HydroMapper KML',
    //     visible: false,
    //   },
    //   parentId: null,
    // },
  ];

  for (const layerInfo of layers) {
    await commandService.createLayer(layerInfo);
  }
}

async function createDefaultFeatureLayers(commandService): Promise<void> {
  const layers: CreateLayerInfo[] = [
    {
      type: LayerType.FEATURE,
      modelOptions: null,
      layerOptions: {
        id: FeatureLayerId.DAMAGE,
        label: 'Damages',
        selectable: true,
        hoverable: true,
        editable: true,
      },
      autoZoom: false,
      parentId: null,
    },
    {
      type: LayerType.FEATURE,
      modelOptions: null,
      layerOptions: {
        id: FeatureLayerId.ASSET_BOUNDARY,
        label: 'Asset Boundary',
        selectable: true,
        hoverable: true,
        editable: true,
      },
      autoZoom: false,
      parentId: null,
    },
    {
      type: LayerType.FEATURE,
      modelOptions: null,
      layerOptions: {
        id: FeatureLayerId.COMMON_FILES,
        label: 'Common Files',
        selectable: true,
        hoverable: true,
        editable: true,
      },
      autoZoom: false,
      parentId: null,
    },
    {
      type: LayerType.FEATURE,
      modelOptions: null,
      layerOptions: {
        id: FeatureLayerId.MATTERPORT,
        label: 'Matterport',
        selectable: true,
        hoverable: true,
        editable: true,
      },
      autoZoom: false,
      parentId: null,
    },
    {
      type: LayerType.FEATURE,
      modelOptions: null,
      layerOptions: {
        id: FeatureLayerId.ANNOTATION,
        label: 'Annotations',
        selectable: true,
        hoverable: true,
        editable: true,
      },
      autoZoom: false,
      parentId: null,
    },
    {
      type: LayerType.FEATURE,
      modelOptions: null,
      layerOptions: {
        id: FeatureLayerId.STATIONING,
        label: 'Stationings',
        selectable: true,
        hoverable: true,
        editable: true,
      },
      autoZoom: false,
      parentId: null,
    },
    {
      type: LayerType.FEATURE,
      modelOptions: null,
      layerOptions: {
        id: FeatureLayerId.EXTERNAL_DATA,
        label: 'External Data',
        selectable: true,
        hoverable: true,
        editable: true,
      },
      autoZoom: false,
      parentId: null,
    },
    {
      type: LayerType.FEATURE,
      modelOptions: null,
      layerOptions: {
        id: FeatureLayerId.PANORAMA,
        label: 'Panoramas',
        selectable: true,
        hoverable: true,
        editable: true,
      },
      autoZoom: false,
      parentId: null,
    },
  ];

  for (const layerInfo of layers) {
    await commandService.createLayer(layerInfo);
  }
}
