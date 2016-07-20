/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

class BuildingBlueprint {
  name: string;
  icon: string;
  index: number;

  constructor(block = <BuildingBlueprint>{}) {
    this.name = block.name;
    this.icon = block.icon;
    this.index = block.index;
  }

  static create() {
    const a = new BuildingBlueprint();
    return a;
  }

}

export default BuildingBlueprint;
