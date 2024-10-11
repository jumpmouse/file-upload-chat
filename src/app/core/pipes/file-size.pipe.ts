import { Pipe, PipeTransform } from '@angular/core';

const FILE_SIZE_UNITS = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
const FILE_SIZE_UNITS_LONG = ['Kilobytes', 'Megabytes', 'Gigabytes', 'Pettabytes', 'Exabytes', 'Zettabytes', 'Yottabytes'];

@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {

  transform(sizeInBytes: number | undefined, longForm = false): string {
    if (sizeInBytes === 0) return '0KB';
    if (!sizeInBytes) return '';

    const units = longForm
      ? FILE_SIZE_UNITS_LONG
      : FILE_SIZE_UNITS;

    let power = Math.round(Math.log(sizeInBytes) / Math.log(1024));
    power = Math.min(power, units.length - 1);

    const size = sizeInBytes / Math.pow(1024, power);
    const formattedSize = Math.round(size * 100) / 100;
    const unit = units[power];

    return `${formattedSize}${unit}`;
  }
}
