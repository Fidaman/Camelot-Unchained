/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';

import {GlobalState} from '../../services/session/reducer';
import * as materialService from '../../services/session/materials';
import * as replaceService from '../../services/session/materials-replace';
import {MaterialsState} from '../../services/session/materials';
import requester from '../../services/session/requester';

import {BuildingItem, BuildingItemType} from '../../../../../../lib/BuildingItem';
import {fireBuildingItemSelected} from '../../../../../../services/events';

import {events, BuildingBlock, BuildingMaterial} from 'camelot-unchained';

import MaterialView from '../MaterialView';
import ShapesView from '../ShapesView';
import MaterialSelector from '../MaterialSelector';

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

  private blockSelectionListener = (info: {material: BuildingMaterial, block: BuildingBlock}) => {
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
    this.setState({ showMatSelect: show } as any);
  }

  selectBlock(block: BuildingBlock) {
    materialService.requestBlockChange(block);
  }

  selectMaterial = (mat: BuildingMaterial) => {
    materialService.requestMaterialChange(mat, this.props.materialsState.selectedBlock.shapeId);
    this.setState({ showMatSelect: false } as any);
  }

  componentDidMount() {
    events.addListener(events.clientEventTopics.handlesBlockSelect, this.blockSelectionListener);
  }

  componentWillUnmount() {
    events.removeListener(this.blockSelectionListener);
  }

  render() {
    let matSelect: any = null;
    if (this.state.showMatSelect) {
      matSelect = (
        <MaterialSelector
          materialsByType={this.props.materialsState.materialsByType}
          selectMaterial={this.selectMaterial}
          selected={this.props.materialsState.selectedMaterial} />
      )
    }

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
          {matSelect}
        </div>
      </div>
    )
  }
}

export default connect(select)(MaterialAndShapePane);
