/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";


import {clientEventTopics} from '../../events/defaultTopics';
import EventEmitter from '../../events/EventEmitter'
import client from '../../core/client';

import * as building from '../../building/building';
import BuildingMaterial from '../../building/classes/BuildingMaterial';
import BuildingBlock from '../../building/classes/BuildingBlock';

function run(emitter: EventEmitter, topic: string) {
  if (client.OnBlockSelected) {
    client.OnBlockSelected((blockid: number) => {
      let material = building.getMaterialForBlockId(blockid);
      let block = building.getBlockForBlockId(blockid);
      if (material) {
        emitter.emit(topic, { material: material, block: block });
      } else {
        emitter.emit(topic, building.getMissingMaterial(blockid));
      }
    });
  }
}

export default class BlockSelectListener {
  listening: boolean = false;
  type: string;
  topic: string = clientEventTopics.handlesBlockSelect;
  start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
