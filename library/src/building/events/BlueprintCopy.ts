/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
"use strict";

import {clientEventTopics} from '../../events/defaultTopics';
import EventEmitter from '../../events/EventEmitter'
import client from '../../core/client';

function run(emitter: EventEmitter, topic: string) {
  if(client.OnBlockSelected)
  {
    client.OnCopyBlueprint(() => {
      emitter.emit(clientEventTopics.handlesBlueprintCopy, {});
    });
  }
}

export default class BlockSelectListener {
  listening: boolean = false;
  type: string;
  topic: string = clientEventTopics.handlesBlueprintCopy;
  start(emitter: EventEmitter): void {
    if (!this.listening) {
      this.listening = true;
      run(emitter, this.topic);
    }
  }
}
