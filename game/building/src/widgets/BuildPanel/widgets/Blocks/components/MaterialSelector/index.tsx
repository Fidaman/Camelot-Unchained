/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {BuildingMaterial} from 'camelot-unchained';

import MaterialsByType from '../../lib/MaterialsByType';

export interface MaterialSelectorProps {
  materialsByType: MaterialsByType;
  selectMaterial: (mat: BuildingMaterial) => void;
  selected: BuildingMaterial;
}

export interface MaterialSelectorState {
}

class MaterialSelector extends React.Component<MaterialSelectorProps, MaterialSelectorState> {

  constructor(props: MaterialSelectorProps) {
    super(props);
  }

  generateMaterialIcon = (mat: BuildingMaterial, selectedId: number) => {
    return (
      <img key={mat.id}
        className={mat.id == selectedId ? 'active' : ''}
        src={`data:image/png;base64, ${mat.icon}`}
        onClick={() => this.props.selectMaterial(mat) }
        />
    )
  }

  render() {
    const selectedId: number = this.props.selected ? this.props.selected.id : null;

    return (

      <div className='material-and-shape__material-selector'>
        <header>Stone Blocks</header>
        {this.props.materialsByType.stoneBlocks.map((mat: BuildingMaterial) => this.generateMaterialIcon(mat, selectedId)) }

        <header>Stone Tiles & Sheets</header>
        {this.props.materialsByType.stoneTilesAndSheets.map((mat: BuildingMaterial) => this.generateMaterialIcon(mat, selectedId)) }

        <header>Wood & Organic</header>
        {this.props.materialsByType.woodAndOrganic.map((mat: BuildingMaterial) => this.generateMaterialIcon(mat, selectedId)) }
      </div>
    )
  }
}

export default MaterialSelector;
