import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import {
  EOrderFieldsAsc,
  EOrderFieldsDesc,
} from '../../modules/pagination/models/enums/order-fields.enum';
import { errorMessages } from '../constants/error-messages.constant';

@ValidatorConstraint()
export class IsValidOrderField implements ValidatorConstraintInterface {
  validate(value: any): boolean {
    const validFields = [
      ...Object.values(EOrderFieldsAsc),
      ...Object.values(EOrderFieldsDesc),
    ];

    return validFields.includes(value);
  }

  defaultMessage() {
    return errorMessages.INVALID_ORDER_FIELD;
  }
}
