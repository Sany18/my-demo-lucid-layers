import { FeaturePainter } from "@luciad/ria/view/feature/FeaturePainter";
import { getRandomColor } from "./randomColor";
import { createPoint } from "@luciad/ria/shape/ShapeFactory";

export class PointPainter extends FeaturePainter {
  constructor() {
    super();
  }

  paintBody(graphics, feature, shape, layer, map, paintState) {
    const color = getRandomColor();
    const pointShape = shape || createPoint(map.reference, feature.geometry.coordinates);
    const isHighlighted = paintState.hovered;

    graphics.drawShape(pointShape, {
      stroke: {
        color: isHighlighted ? 'black' : color,
        width: 0.2,
      },
      fill: {
        color: isHighlighted ? 'white' : color,
      },
      redius: 5,
    });
  }
}
