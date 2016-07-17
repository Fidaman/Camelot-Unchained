/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client, events, building, BuildingMaterial, BuildingBlock } from 'camelot-unchained';
import {Promise} from 'es6-promise';

import faker from './requester_fake';

class BuildingLoader {

  private win: any = window;
  private fake: boolean = (this.win.cuAPI == null);

  public changeBlockSelection(block: BuildingBlock) {
    if (this.fake) {
      return faker.requestBlockSelect(block);
    }

    building.requestBlockSelect(block);
  }

  public loadMaterials() {
    if (this.fake) {
      return faker.requestMaterials();
    }      
    building.requestMaterials();
  }
}

export default new BuildingLoader();
