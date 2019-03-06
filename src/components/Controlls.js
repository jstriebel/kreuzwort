import React from "react"
import "antd/dist/antd.css"
import { Button, Popconfirm, Switch } from "antd"
import { connect } from "react-redux"

import Immutable from "immutable"

import { setDirectionIsDown, setHelp, reset, setState } from "../actions"

function downloadText(filename, text) {
  var element = document.createElement("a")
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  )
  element.setAttribute("download", filename)

  element.style.display = "none"
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

function uploadFile(fileHandler, accept = "") {
  var element = document.createElement("input")
  element.setAttribute("type", "file")
  element.setAttribute("accept", accept)
  element.addEventListener("change", evt => fileHandler(evt.target.files[0]))

  element.style.display = "none"
  document.body.appendChild(element)

  element.click()

  document.body.removeChild(element)
}

class Controlls extends React.Component {
  render() {
    const {
      writingDown,
      state,
      handleDirectionChange,
      handleSetHelp,
      handleReset,
      handleSetState,
    } = this.props

    function exportState() {
      const exported = JSON.stringify(state.toJSON())
      // test round-trip:
      const reloaded = parseState(exported)
      if (reloaded.equals(state)) {
        downloadText("kreuzwort.cus", exported)
      } else {
        alert("Something went terribly wrong, sorry.")
        downloadText("error.cus", exported)
      }
    }

    function parseState(text) {
      return Immutable.fromJS(
        JSON.parse(text, (_, value) => (value === null ? undefined : value))
      )
    }

    function importState(file) {
      var reader = new FileReader()
      reader.onload = e => {
        handleSetState(parseState(reader.result))
      }
      reader.readAsText(file)
    }

    return (
      <div className="no-print">
        <div style={{ float: "left" }}>
          <span className="bold">Schreibrichtung: </span>
          Rüber{" "}
          <Switch
            checked={writingDown}
            style={{ background: "rgba(0, 0, 0, 0.25)" }}
            onChange={handleDirectionChange}
          />{" "}
          Runter
        </div>
        <div style={{ float: "right" }}>
          <Button.Group>
            <Button icon="download" onClick={exportState} size="small" />
            <Popconfirm
              onConfirm={() => uploadFile(importState, ".cus")}
              title="Beim Hochladen wird alles überschrieben. Fortfahren?"
              okText="Ja, wirklich"
              cancelText="Nein"
            >
              <Button icon="upload" size="small" />
            </Popconfirm>
            <Popconfirm
              onConfirm={handleReset}
              title="Wirklich alles löschen?"
              okText="Ja, wirklich"
              cancelText="Nein"
            >
              <Button size="small" icon="undo" />
            </Popconfirm>
            <Button
              icon="info-circle"
              onClick={() => handleSetHelp(true)}
              size="small"
            />
          </Button.Group>{" "}
        </div>
        <br />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    writingDown: state.immutable.get("directionIsDown"),
    state: state.immutable,
  }
}

const mapDispatchToProps = dispatch => ({
  handleDirectionChange: isDown => dispatch(setDirectionIsDown(isDown)),
  handleSetHelp: isHelpOpen => dispatch(setHelp(isHelpOpen)),
  handleReset: () => dispatch(reset()),
  handleSetState: state => dispatch(setState(state)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controlls)
