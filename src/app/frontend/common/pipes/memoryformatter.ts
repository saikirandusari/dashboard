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
 * Base for binary prefixes.
 */
const base = 1024;

/**
 * Ordered array of binary suffixes.
 */
const powerSuffixes = ['', 'Ki', 'Mi', 'Gi', 'Ti', 'Pi'];

/**
 * Formats memory in bytes to a binary prefix format, e.g., 789,21 MiB.
 */
@Pipe({name: 'memoryFormatter'})
export class MemoryFormatter implements PipeTransform {
    transform(value: number) {
        let divider = 1;
        let power = 0;

        while (value / divider > base && power < powerSuffixes.length - 1) {
            divider *= base;
            power += 1;
        }

        let formatted = Math.round(value / divider);
        let suffix = powerSuffixes[power];
        return suffix ? `${formatted} ${suffix}` : formatted;
    }
}