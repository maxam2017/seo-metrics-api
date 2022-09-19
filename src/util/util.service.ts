import { Injectable } from '@nestjs/common';

const urlAlphabet =
  'ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW';

@Injectable()
export class UtilService {
  exclude<T, Key extends keyof T>(obj: T, ...keys: Key[]): Omit<T, Key> {
    for (const key of keys) {
      delete obj[key];
    }
    return obj;
  }

  nanoid(size = 21) {
    let id = '';

    // A compact alternative for `for (var i = 0; i < step; i++)`.
    let i = size;
    while (i--) {
      // `| 0` is more compact and faster than `Math.floor()`.
      id += urlAlphabet[(Math.random() * 64) | 0];
    }
    return id;
  }
}
