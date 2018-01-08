// Copyright 2017 The Kubernetes Authors.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {Pipe, PipeTransform} from "@angular/core";

/**
 * Formats cores usage in millicores to a decimal prefix format, e.g., e.g., 321,20 kCPU.
 */
@Pipe({name: 'coreFormatter'})
export class CoreFormatter implements PipeTransform {
  readonly base = 1000;
  readonly powerSuffixes = ['', 'k', 'M', 'G', 'T'];

  transform(value: number) {
    value = value / 1000;

    let divider = 1;
    let power = 0;

    while (value / divider > this.base && power < this.powerSuffixes.length - 1) {
      divider *= this.base;
      power += 1;
    }
    let formatted = Math.round(value / divider);
    let suffix = this.powerSuffixes[power];
    return suffix ? `${formatted} ${suffix}` : formatted;
  }
}