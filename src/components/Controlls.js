import React from "react"
import "antd/dist/antd.css"
import { Button, Popconfirm, Switch } from "antd"
import { connect } from "react-redux"

import { setDirectionIsDown, setHelp, reset } from "../actions"

class Controlls extends React.Component {
  render() {
    const {
      writingDown,
      handleDirectionChange,
      handleSetHelp,
      handleReset,
    } = this.props
    return (
      <p className="no-print">
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
          <Button onClick={() => handleSetHelp(true)} size="small">
            Info
          </Button>{" "}
          <Popconfirm
            onConfirm={handleReset}
            title="Wirklich alles löschen?"
            okText="Ja, wirklich"
            cancelText="Nein"
          >
            <Button size="small">Rücksetzen</Button>
          </Popconfirm>
        </div>
      </p>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    writingDown: state.immutable.get("directionIsDown"),
  }
}

const mapDispatchToProps = dispatch => ({
  handleDirectionChange: isDown => dispatch(setDirectionIsDown(isDown)),
  handleSetHelp: isHelpOpen => dispatch(setHelp(isHelpOpen)),
  handleReset: () => dispatch(reset()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Controlls)
