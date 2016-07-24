/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';

import {GlobalState} from '../../services/session/reducer';
import {MaterialsState} from '../../services/session/materials';

import blockRequester from '../../../../../../services/session/requester';
import {ACTIVATE_MATERIAL_SELECTOR, DEACTIVATE_MATERIAL_SELECTOR} from '../../../../lib/BuildPane';

import {BuildingItem, BuildingItemType} from '../../../../../../lib/BuildingItem';
import {fireBuildingItemSelected} from '../../../../../../services/events';

import {events, BuildingBlock, BuildingMaterial} from 'camelot-unchained';

import MaterialView from '../MaterialView';
import ShapesView from '../ShapesView';

function select(state: GlobalState): MaterialAndShapePaneProps {
  return {
    materialsState: state.materials,
  }
}

export interface MaterialAndShapePaneProps {
  minimized?: boolean;
  dispatch?: (action: any) => void;
  materialsState?: MaterialsState;
}

export interface MaterialAndShapePaneState {
  showMatSelect: boolean;
}

class MaterialAndShapePane extends React.Component<MaterialAndShapePaneProps, MaterialAndShapePaneState> {

  private blockSelectionListener = (info: { material: BuildingMaterial, block: BuildingBlock }) => {
    this.onBlockSelect(info.block);
  }


  constructor(props: MaterialAndShapePaneProps) {
    super(props);
    this.state = { showMatSelect: false };
  }

  onBlockSelect = (block: BuildingBlock) => {
    if (block != null) {
      const item = {
        name: block.shapeId + ". " + block.shapeTags.join(', '),
        description: block.materialId + ". " + block.materialTags.join(', '),
        element: (<img src={'data:image/png;base64,' + block.icon}/>),
        id: block.id + '-' + BuildingItemType.Block,
        type: BuildingItemType.Block,
        select: () => { this.selectBlock(block) }
      } as BuildingItem;
      fireBuildingItemSelected(item);
    } else {
      fireBuildingItemSelected(null);
    }
  }


  showMatSelector = (show: boolean) => {
    const selected: BuildingMaterial = this.props.materialsState.selectedMaterial;
    events.fire(ACTIVATE_MATERIAL_SELECTOR, { selection: selected, onSelect: this.selectMaterial });
  }

  selectBlock(block: BuildingBlock) {
    blockRequester.changeBlockSelection(block);
  }

  selectMaterial = (mat: BuildingMaterial) => {
    const currentBlock = this.props.materialsState.selectedBlock;
    const requestedBlock: BuildingBlock = mat.getBlockForShape(currentBlock.shapeId);
    blockRequester.changeBlockSelection(requestedBlock);
    this.setState({ showMatSelect: false } as any);
    events.fire(DEACTIVATE_MATERIAL_SELECTOR, {});
  }

  componentWillUnmount() {
    events.fire(DEACTIVATE_MATERIAL_SELECTOR, {});
  }

  render() {

    const selectedMaterial: BuildingMaterial = this.props.materialsState.selectedMaterial;
    const selectedShape: BuildingBlock = this.props.materialsState.selectedBlock;

    return (
      <div className='build-panel__material-and-shape'>
        {
          this.props.minimized ? null : (
            <header>
              <span>Material &amp; Shape</span>
              <span className='build-panel__material-and-shape__menu'>...</span>
            </header>
          )
        }

        <div className='content'>
          <MaterialView
            selectedMaterial={selectedMaterial}
            onClick={() => this.showMatSelector(!this.state.showMatSelect) }
            />
          <ShapesView minimized={this.props.minimized}
            shapes={selectedMaterial.blocks}
            selected={selectedShape}
            selectShape={(block: BuildingBlock) => { this.selectBlock(block) } }/>
        </div>
      </div>
    )
  }
}

export default connect(select)(MaterialAndShapePane);
