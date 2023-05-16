import React from "react";
import { saveAs } from "file-saver";
import autobind from "autobind-decorator";

import FileUploader from "./FileUploader";
import Brick from "components/engine/Brick";

import styles from "../styles/components/sidebar";

import QRCode from "qrcode";

class Sidebar extends React.Component {

  render() {
    const { utilsOpen, resetScene } = this.props;
    return (
      <div className={utilsOpen ? styles.visible : styles.sidebar}>
        <div className={styles.content}>
          <div className={styles.row} onClick={resetScene}>
            <div className={styles.text}>
              <i className="ion-trash-a" />
              <span>Reset scene</span>
            </div>
          </div>
          <div className={styles.row} onClick={this._exportFile}>
            <div className={styles.text}>
              <i className="ion-log-out" />
              <span>Export scene</span>
            </div>
          </div>
          <div className={styles.row}>
            <FileUploader onFinish={this._importFile}>
              <div className={styles.text}>
                <i className="ion-log-in" />
                <span>Import scene</span>
              </div>
            </FileUploader>
          </div>
          <div className={styles.row} onClick={this.qr_code}>
            <div className={styles.text}>
              <i className="ion-log-out" />
              <span>Download QR Code</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  _exportFile() {
    const { objects } = this.props;
    const fileName = "scene.json";
    const simplified = objects.map((o) => ({
      intersect: o._intersect,
      color: o._color,
      dimensions: o._dimensions,
      rotation: o._rotation,
      translation: o._translation,
    }));
    var fileToSave = new Blob([JSON.stringify(simplified)], {
      type: "application/json",
      name: fileName,
    });
    saveAs(fileToSave, fileName);
  }

  @autobind
  qr_code() {
    const { objects } = this.props;
    var jsonObject = {};
    jsonObject["instructions"] = {};
    jsonObject["instructions"]["assembly"] = "example";
    jsonObject["instructions"]["steps"] = [];

    jsonObject["assemblyId"] = "Teste";
    jsonObject["name"] = "example";
    for (let index = 0; index < objects.length; index++) {
      var color;
      var color_abbr;
      switch (objects[index]._color.toLowerCase()) {
        case "#ffffff":
          color = "white";
          color_abbr = "W";
          break;
        case "#ff0000":
          color = "red";
          color_abbr = "R";
          break;
        case "#00ff00":
          color = "green";
          color_abbr = "G";
          break;
        case "#0000ff":
          color = "blue";
          color_abbr = "B";
          break;
        case "#ffa500":
          color = "orange";
          color_abbr = "O";
          break;
        case "#ffff00":
          color = "yellow";
          color_abbr = "Y";
          break;
        case "#808080":
          color = "grey";
          color_abbr = "G";
          break;
        case "#964b00":
          color = "brown";
          color_abbr = "BR";
          break;
        case "#90ee90":
          color = "lightgreen";
          color_abbr = "G";
          break;
        case "#800080":
          color = "purple";
          color_abbr = "P";
          break;
        case "#87cefa":
          color = "lightblue";
          color_abbr = "B";
          break;
        default:
          color = "unknown";
          break;
      }
      var full_piece_id = objects[index]._dimensions.piece_id + color_abbr;
      jsonObject["piece" + (index + 1)] = full_piece_id;

      var x = objects[index].position.x / 25 + 6;
      var y = objects[index].position.z / 25 + 3;

      jsonObject["instructions"]["steps"].push({
        idPiece: full_piece_id,
        idStep: "example" + "00" + index,
        color: color,
        coordinatesA: { x: x, y: y },
        coordinatesB: {
          x: x + objects[index]._dimensions.x - 1,
          y: y + objects[index]._dimensions.z - 1,
        },
      });
    }
    this.downloadQRCode(JSON.stringify(jsonObject));
    return jsonObject;
  }

   downloadQRCode (value) {
    const canvas = document.createElement("canvas");
    QRCode.toCanvas(canvas, value)
      .then(() => {
        const dataURL = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = dataURL;
        link.download = "qrcode.png";
        link.click();
      })
      .catch((error) => {
        console.error("Error generating QR code:", error);
      });
  };

  // TODO: bad, do this in epic/saga/thunk but not here
  @autobind
  _importFile(objects) {
    const { importScene } = this.props;
    const bricks = objects.map(
      (o) =>
        new Brick(o.intersect, o.color, o.dimensions, o.rotation, o.translation)
    );
    importScene(bricks);
  }
}

export default Sidebar;
