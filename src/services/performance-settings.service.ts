import { WebGLMap } from '@luciad/ria/view/WebGLMap';
import { QualityFactorFalloffOptions, TileSet3DLayer } from '@luciad/ria/view/tileset/TileSet3DLayer';
import { LayerTreeVisitor } from '@luciad/ria/view/LayerTreeVisitor';
import { LayerTreeNode } from '@luciad/ria/view/LayerTreeNode';
import { FeatureLayer } from '@luciad/ria/view/feature/FeatureLayer';
import { LayerGroup } from '@luciad/ria/view/LayerGroup';
import { Layer } from '@luciad/ria/view/Layer';
import { FeaturePainter } from '@luciad/ria/view/feature/FeaturePainter';
import { PointCloudPointShape } from '@luciad/ria/view/style/PointCloudPointShape';
import { ScalingMode } from '@luciad/ria/view/style/ScalingMode';
import { PointCloudStyle } from '@luciad/ria/view/style/PointCloudStyle';

const DefaultQualityFactor = 0.2;
const DefaultMaxPointCount = 2000000;

export enum IconVisibilityMode {
  AlwaysVisible = 1,
  Occlude = 0,
}

export interface PainterIconVisibilityMode {
  visibility?: IconVisibilityMode;
  worldSize?: boolean;
  opacity?: boolean;
  damageBoundary?: boolean;
}

export const PainterIconVisibilityModeDefault: PainterIconVisibilityMode = {
  visibility: IconVisibilityMode.AlwaysVisible,
  worldSize: false,
  opacity: false,
  damageBoundary: false,
};

const DefaultQualityFactorFalloff: QualityFactorFalloffOptions = {
  nearDistance: 10,
  farDistance: 100,
  farQualityFactorMultiplier: 0.5,
};

interface FeatureLayerPainter extends FeaturePainter {
  setIconVisibilityMode?: (arg: unknown) => unknown;
  _delegatePainter?: {
    setIconVisibilityMode?: (arg: unknown) => unknown;
  };
}

interface DelegatePainter {
  FeaturePainter?: unknown;
  poiPainter?: {
    setIconVisibilityMode?: (arg: unknown) => unknown;
  };
  annotationPainter?: {
    setIconVisibilityMode?: (arg: unknown) => unknown;
  };
}

export class PerformanceSettingsService {
  private qualityFactor: number = DefaultQualityFactor;
  private maxPointCount: number = DefaultMaxPointCount;
  private iconVisibilityMode: PainterIconVisibilityMode = JSON.parse(JSON.stringify(PainterIconVisibilityModeDefault));
  private qualityFactorDistanceFallOff: QualityFactorFalloffOptions = DefaultQualityFactorFalloff;

  public applyIconVisibilityMode(map: WebGLMap, newMode: PainterIconVisibilityMode) {
    this.iconVisibilityMode = { ...this.iconVisibilityMode, ...newMode };
    PerformanceSettingsService.setIconVisibilityMode(map, this.iconVisibilityMode);
  }
  public applyQualityFactor(map: WebGLMap, qualityFactor: number) {
    PerformanceSettingsService.updateAllMeshLayers(map, qualityFactor);
    this.qualityFactor = qualityFactor;
  }

  public applyQualityFactorDistanceFalloff(map: WebGLMap, qualityFactorDistanceFalloff: QualityFactorFalloffOptions) {
    PerformanceSettingsService.updateAllMeshLayersQualityFactorFalloff(map, qualityFactorDistanceFalloff);
    this.qualityFactorDistanceFallOff = qualityFactorDistanceFalloff;
  }

  public applyMaxPointCount(map: WebGLMap, maxPointCount: number) {
    PerformanceSettingsService.updateAllPointCloudLayers(map, maxPointCount);
    this.maxPointCount = maxPointCount;
  }

  getQualityFactor() {
    return this.qualityFactor;
  }

  getQualityFactorDistanceFallOff(): QualityFactorFalloffOptions {
    return this.qualityFactorDistanceFallOff;
  }

  getMaxPointCount() {
    return this.maxPointCount;
  }

  getPointCloudStyle(): PointCloudStyle {
    return {
      pointShape: PointCloudPointShape.DISC,
      pointSize: { mode: ScalingMode.PIXEL_SIZE, pixelSize: 4.0 },
    };
  }

  getPerformanceSettings() {
    return {
      performanceHints: { maxPointCount: this.getMaxPointCount() },
      qualityFactor: this.getQualityFactor(),
      qualityFactorDistanceFalloff: this.getQualityFactorDistanceFallOff(),
      pointCloudStyle: this.getPointCloudStyle(),
    };
  }

  static updateAllMeshLayers(map: WebGLMap, qualityFactor: number) {
    if (map && map.layerTree) {
      const layerTreeVisitor = {
        visitLayer: (layer: Layer) => {
          if (layer instanceof TileSet3DLayer) {
            layer.qualityFactor = qualityFactor;
          }
          return LayerTreeVisitor.ReturnValue.CONTINUE;
        },
        visitLayerGroup: (layerGroup: LayerGroup) => {
          layerGroup.visitChildren(layerTreeVisitor, LayerTreeNode.VisitOrder.TOP_DOWN);
          return LayerTreeVisitor.ReturnValue.CONTINUE;
        },
      };
      map.layerTree.visitChildren(layerTreeVisitor, LayerTreeNode.VisitOrder.TOP_DOWN);
    }
  }

  static updateAllMeshLayersQualityFactorFalloff(
    map: WebGLMap,
    qualityFactorDistanceFalloff: QualityFactorFalloffOptions,
  ) {
    if (map && map.layerTree) {
      const layerTreeVisitor = {
        visitLayer: (layer: Layer) => {
          if (layer instanceof TileSet3DLayer) {
            layer.qualityFactorDistanceFalloff = qualityFactorDistanceFalloff;
          }
          return LayerTreeVisitor.ReturnValue.CONTINUE;
        },
        visitLayerGroup: (layerGroup: LayerGroup) => {
          layerGroup.visitChildren(layerTreeVisitor, LayerTreeNode.VisitOrder.TOP_DOWN);
          return LayerTreeVisitor.ReturnValue.CONTINUE;
        },
      };
      map.layerTree.visitChildren(layerTreeVisitor, LayerTreeNode.VisitOrder.TOP_DOWN);
    }
  }

  static updateAllPointCloudLayers(map: WebGLMap, maxPoints: number) {
    if (map && map.layerTree) {
      const layerTreeVisitor = {
        visitLayer: (layer: Layer) => {
          if (layer instanceof TileSet3DLayer) {
            layer.performanceHints = { maxPointCount: maxPoints };
          }
          return LayerTreeVisitor.ReturnValue.CONTINUE;
        },
        visitLayerGroup: (layerGroup: LayerGroup) => {
          layerGroup.visitChildren(layerTreeVisitor, LayerTreeNode.VisitOrder.TOP_DOWN);
          return LayerTreeVisitor.ReturnValue.CONTINUE;
        },
      };
      map.layerTree.visitChildren(layerTreeVisitor, LayerTreeNode.VisitOrder.TOP_DOWN);
    }
  }

  static setIconVisibilityMode(map: WebGLMap, vMode: PainterIconVisibilityMode) {
    if (map && map.layerTree) {
      const layerTreeVisitor = {
        visitLayer: (layer: Layer) => {
          if (layer instanceof FeatureLayer) {
            if (layer.painter) {
              if (typeof (layer.painter as FeatureLayerPainter).setIconVisibilityMode === 'function') {
                (layer.painter as FeatureLayerPainter).setIconVisibilityMode(vMode);
                layer.painter.invalidateAll();
              }
              if (typeof (layer.painter as FeatureLayerPainter)._delegatePainter !== 'undefined') {
                if (
                  typeof ((layer.painter as FeatureLayerPainter)._delegatePainter as DelegatePainter).FeaturePainter ===
                  'function'
                ) {
                  (layer.painter as FeatureLayerPainter)._delegatePainter.setIconVisibilityMode(vMode);
                }
                if (
                  typeof ((layer.painter as FeatureLayerPainter)._delegatePainter as DelegatePainter).poiPainter !==
                  'undefined'
                ) {
                  if (
                    typeof ((layer.painter as FeatureLayerPainter)._delegatePainter as DelegatePainter).poiPainter
                      .setIconVisibilityMode === 'function'
                  )
                    (
                      (layer.painter as FeatureLayerPainter)._delegatePainter as DelegatePainter
                    ).poiPainter.setIconVisibilityMode(vMode);
                }
                if (
                  typeof ((layer.painter as FeatureLayerPainter)._delegatePainter as DelegatePainter)
                    .annotationPainter !== 'undefined'
                ) {
                  if (
                    typeof ((layer.painter as FeatureLayerPainter)._delegatePainter as DelegatePainter)
                      .annotationPainter.setIconVisibilityMode === 'function'
                  )
                    (
                      (layer.painter as FeatureLayerPainter)._delegatePainter as DelegatePainter
                    ).annotationPainter.setIconVisibilityMode(vMode);
                }
                layer.painter.invalidateAll();
              }
            }
          }
          return LayerTreeVisitor.ReturnValue.CONTINUE;
        },
        visitLayerGroup: (layerGroup: LayerGroup) => {
          layerGroup.visitChildren(layerTreeVisitor, LayerTreeNode.VisitOrder.TOP_DOWN);
          return LayerTreeVisitor.ReturnValue.CONTINUE;
        },
      };
      map.layerTree.visitChildren(layerTreeVisitor, LayerTreeNode.VisitOrder.TOP_DOWN);
    }
  }

  getIconVisibilityMode() {
    return this.iconVisibilityMode;
  }
}
