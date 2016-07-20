import {client, channelId, events} from 'camelot-unchained';

class BuildingRequests {

  public changeMode(mode: number) {
    setTimeout(() => {
      console.log("changeMode to " + mode)
      events.fire(events.clientEventTopics.handlesBuildingMode, { mode: mode });
    }, 500);
  }

  public commit() {
    console.log("commit");
  }

  public undo() {
    console.log("undo");
  }

  public redo() {
    console.log("redo");
  }

  public rotX() {
    console.log("rotX");
  }

  public rotY() {
    console.log("rotY");
  }

  public rotZ() {
    console.log("rotZ");
  }

  public flipX() {
    console.log("flipX");
  }

  public flipY() {
    console.log("flipY");
  }

  public flipZ() {
    console.log("flipZ");
  }
}
export default new BuildingRequests();