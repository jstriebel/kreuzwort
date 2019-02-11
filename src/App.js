import React from "react"
import "antd/dist/antd.css"
import { List, Map } from "immutable"
import ContentEditable from "react-contenteditable"
import { connect } from "react-redux"

import {
  setQuestion,
  ensureQuestion,
  setAbbreviation,
  ensureAbbreviation,
} from "./actions"
import Controlls from "./components/Controlls"
import Cross from "./components/Cross"
import Header from "./components/Header"
import Help from "./components/Help"

class App extends React.Component {
  render() {
    const {
      chars,
      right,
      down,
      abbreviation,
      handleSetQuestion,
      handleEnsureQuestion,
      handeSetAbbreviation,
      handleEnsureAbbreviation,
    } = this.props
    // TODO ugly
    const sortCoords = coord => coord.get(0) * 1000 + coord.get(1)
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
            {right_coords.sortBy(sortCoords).map(key => {
              const number = numbers.get(key)
              if (!number) {
                return undefined
              }
              const row_i = key.get(0)
              const col_i = key.get(1)
              const question = right.getIn([row_i, col_i, "question"])
              const word = chars
                .get(row_i)
                .slice(col_i)
                .takeWhile(
                  (v, k) => k === 0 || !right.getIn([row_i, col_i + k])
                )
                .reduce((prev, el, i) => (el ? prev + el : prev + "_"), "")
              return (
                <div key={number.toString()}>
                  {number} <i className="no-print">{word}</i>{" "}
                  <ContentEditable
                    tagName="span"
                    html={question}
                    onChange={e =>
                      handleSetQuestion(false, row_i, col_i, e.target.value)
                    }
                    onBlur={() => handleEnsureQuestion(false, row_i, col_i)}
                    style={{ paddingRight: 10 }}
                  />
                </div>
              )
            })}
            <b>Runter:</b>
            {down_coords.sortBy(sortCoords).map(key => {
              const number = numbers.get(key)
              if (!number) {
                return undefined
              }
              const row_i = key.get(0)
              const col_i = key.get(1)
              const question = down.getIn([col_i, row_i, "question"])
              const chars_transposed = chars
                .get(0)
                .zip(...chars.rest())
                .map(List)
              const word = chars_transposed
                .get(col_i)
                .slice(row_i)
                .takeWhile((v, k) => k === 0 || !down.getIn([col_i, row_i + k]))
                .reduce((prev, el, i) => (el ? prev + el : prev + "_"), "")
              return (
                <div key={number.toString()}>
                  {number} <i className="no-print">{word}</i>{" "}
                  <ContentEditable
                    tagName="span"
                    html={question}
                    onChange={e =>
                      handleSetQuestion(true, row_i, col_i, e.target.value)
                    }
                    onBlur={() => handleEnsureQuestion(true, row_i, col_i)}
                  />
                </div>
              )
            })}
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
  handleSetQuestion: (isDown, row_i, col_i, question) =>
    dispatch(setQuestion(isDown, row_i, col_i, question)),
  handleEnsureQuestion: (isDown, row_i, col_i) =>
    dispatch(ensureQuestion(isDown, row_i, col_i)),
  handeSetAbbreviation: abbreviation => dispatch(setAbbreviation(abbreviation)),
  handleEnsureAbbreviation: () => dispatch(ensureAbbreviation()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
