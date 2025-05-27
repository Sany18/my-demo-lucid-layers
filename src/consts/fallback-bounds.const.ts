import { CRSEnum } from 'enum/CRS.enum';
import { getReference } from '@luciad/ria/reference/ReferenceProvider';
import { createBounds } from '@luciad/ria/shape/ShapeFactory';

export const fallbackBounds = createBounds(getReference(CRSEnum.CRS_84), [9.0, 2.0, 53.0, 1.0]);
