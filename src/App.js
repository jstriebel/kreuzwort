import React from "react"
import "antd/dist/antd.css"
import { List, Map } from "immutable"
import ContentEditable from "react-contenteditable"
import { connect } from "react-redux"

import {
  setAbbreviation,
  ensureAbbreviation,
} from "./actions"
import Answers from "./components/Answers"
import Controlls from "./components/Controlls"
import Cross from "./components/Cross"
import Header from "./components/Header"
import Help from "./components/Help"

export const sortCoords = coord => coord.get(0) * 1000 + coord.get(1)

class App extends React.Component {
  render() {
    const {
      chars,
      right,
      down,
      abbreviation,
      handeSetAbbreviation,
      handleEnsureAbbreviation,
    } = this.props
    // TODO ugly
    const right_coords = right
      .flatMap((val, x) =>
        val.map((innerVal, y) => (innerVal ? List([x, y]) : undefined))
      )
      .filter(x => x)
    const down_coords = down
      .flatMap((val, y) =>
        val.map((innerVal, x) => (innerVal ? List([x, y]) : undefined))
      )
      .filter(x => x)
    const numbers = new Map(
      right_coords
        .filterNot(
          c =>
            c.get(1) === 11 ||
            right_coords.includes(List([c.get(0), c.get(1) + 1]))
        )
        .concat(
          down_coords.filterNot(
            c =>
              c.get(0) === 10 ||
              down_coords.includes(List([c.get(0) + 1, c.get(1)]))
          )
        )
        .toSet()
        .toList()
        .sortBy(sortCoords)
        .map((cell, i) => [cell, i + 1])
    )
    return (
      <div align="center">
        <div style={{ display: "inline-block" }}>
          <Header />
          <Controlls />
          <br />
          <Cross numbers={numbers} />
          <div align="right" style={{ marginTop: "1em", marginBottom: "1em" }}>
            <ContentEditable
              tagName="span"
              html={abbreviation}
              onChange={e => handeSetAbbreviation(e.target.value)}
              onBlur={handleEnsureAbbreviation}
              className="ant-input-sm"
            />
          </div>
          <br />
          <div
            style={{
              width: "500px",
              columnCount: 2,
              columnGap: "20px",
              textAlign: "justify",
              marginBottom: "1em",
            }}
          >
            <b>Rüber:</b>
            <Answers
              isRight={true}
              numbers={numbers}
              coords={right_coords}
              chars={chars}
            />
            <b>Runter:</b>
            <Answers
              isRight={false}
              numbers={numbers}
              coords={down_coords}
              chars={chars.get(0).zip(...chars.rest()).map(List)}
            />
          </div>
        </div>
        <Help />
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    chars: state.immutable.get("chars"),
    abbreviation: state.immutable.get("abbreviation"),
    right: state.immutable.get("right"),
    down: state.immutable.get("down"),
  }
}

const mapDispatchToProps = dispatch => ({
  handeSetAbbreviation: abbreviation => dispatch(setAbbreviation(abbreviation)),
  handleEnsureAbbreviation: () => dispatch(ensureAbbreviation()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
