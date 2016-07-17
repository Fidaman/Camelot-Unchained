"use strict";
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import BuildingBlock from './BuildingBlock';

class BuildingMateriale {
    id: number;
    icon: string;
    tags: string[];
    blocks: BuildingBlock[];
    constructor(substance = <BuildingMateriale>{}){
        this.id = substance.id;
        this.icon = substance.icon;
        this.tags = substance.tags || [];
        this.blocks = substance.blocks || [];

    }

   static create() {
    let a = new BuildingMateriale();
    return a;
  }
}
export default BuildingMateriale;
