 

import { Pipe, PipeTransform } from '@angular/core';

import { PersianNumberService } from '@shared/services/persian-number.service';

/**
 * Replaces all arabic and english numbers with persian numbers.
 *
 * @example {{englishTextDigit | faNum}}
 */
@Pipe({
  name: 'faNum',
})
export class FaNumPipe implements PipeTransform {
  constructor(private persianNumberService: PersianNumberService) {}

  transform(value: string | number | null): string {
    if (value === undefined || value === null) return '';

    const strValue = value.toString();

    return this.persianNumberService.toPersian(strValue);
  }
}
