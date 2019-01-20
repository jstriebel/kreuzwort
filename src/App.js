import React from "react"
import "antd/dist/antd.css"
import { Button, DatePicker, Popconfirm, Switch } from "antd"
import { List, Map } from "immutable"
import moment from "moment"
import ContentEditable from "react-contenteditable"
import { connect } from "react-redux"

import {
  writeCross,
  setDirectionIsDown,
  switchSeparation,
  setQuestion,
  ensureQuestion,
  setNewsName,
  ensureNewsName,
  setSubtitle,
  ensureSubtitle,
  setDate,
  setAbbreviation,
  ensureAbbreviation,
  reset,
} from "./actions"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.input_refs = new Array(11)
      .fill(null)
      .map(x => new Array(12).fill(null).map(y => React.createRef()))
  }

  handleFocus(event) {
    event.target.select()
  }

  render() {
    const {
      newsName,
      subtitle,
      date,
      chars,
      abbreviation,
      right,
      down,
      writingDown,
      handleCellChange,
      handleDirectionChange,
      handleSwitchSeparation,
      handleSetQuestion,
      handleEnsureQuestion,
      handleSetNewsName,
      handleEnsureNewsName,
      handleSetSubtitle,
      handleEnsureSubtitle,
      handleSetDate,
      handeSetAbbreviation,
      handleEnsureAbbreviation,
      handleReset,
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
        .concat(down_coords)
        .toSet()
        .toList()
        .sortBy(sortCoords)
        .map((cell, i) => [cell, i + 1])
    )
    const setNextFocus = (row_i, col_i) => {
      if (writingDown) {
        if (this.input_refs[row_i + 1]) {
          this.input_refs[row_i + 1][col_i].current.focus()
        } else {
          if (this.input_refs[0][col_i + 1]) {
            this.input_refs[0][col_i + 1].current.focus()
          } else {
            this.input_refs[0][0].current.focus()
          }
        }
      } else {
        if (this.input_refs[row_i][col_i + 1]) {
          this.input_refs[row_i][col_i + 1].current.focus()
        } else {
          if (this.input_refs[row_i + 1]) {
            this.input_refs[row_i + 1][0].current.focus()
          } else {
            this.input_refs[0][0].current.focus()
          }
        }
      }
    }
    return (
      <div align="center">
        <div style={{ display: "inline-block" }}>
          <h1>
            <ContentEditable
              tagName="span"
              html={newsName}
              onChange={e => handleSetNewsName(e.target.value)}
              onBlur={handleEnsureNewsName()}
            />{" "}
            Zeitung Magazin
          </h1>
          <div>
            <ContentEditable
              html={subtitle}
              style={{ float: "left" }}
              onChange={e => handleSetSubtitle(e.target.value)}
              onBlur={handleEnsureSubtitle()}
            />
            <div style={{ float: "right" }}>
              <DatePicker
                value={moment(date, "DD.MM.YYYY")}
                onChange={(_, dateString) => handleSetDate(dateString)}
                format={"DD.MM.YYYY"}
                size="small"
                allowClear={false}
              />
            </div>
          </div>
          <br />
          <h2>DAS KREUZ MIT DEN WORTEN</h2>
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
          <br />
          <br />
          <table>
            {chars.map((row, row_i) => (
              <tr key={row_i}>
                {row.map((cell, col_i) => (
                  <td
                    key={[row_i, col_i]}
                    style={{
                      borderLeftWidth: right.getIn([row_i, col_i])
                        ? "5px"
                        : null,
                      borderTopWidth: down.getIn([col_i, row_i]) ? "5px" : null,
                    }}
                  >
                    <div className="cell-number">
                      {numbers.get(List([row_i, col_i]))}
                    </div>
                    <input
                      className="cell-char"
                      size="default"
                      value={cell}
                      onChange={e => {
                        if (e.target.value) {
                          setNextFocus(row_i, col_i)
                        }
                        handleCellChange(row_i, col_i, e.target.value)
                      }}
                      onKeyPress={e => {
                        if (e.key === "Enter") {
                          handleSwitchSeparation(row_i, col_i)
                        }
                      }}
                      onFocus={this.handleFocus}
                      ref={this.input_refs[row_i][col_i]}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </table>
          <div align="right" style={{ marginTop: "1em", marginBottom: "1em" }}>
            <ContentEditable
              tagName="span"
              html={abbreviation}
              onChange={e => handeSetAbbreviation(e.target.value)}
              onBlur={handleEnsureAbbreviation}
              style={{ paddingRight: 10 }}
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
                <div>
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
                <div>
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
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    newsName: state.immutable.get("newsName"),
    subtitle: state.immutable.get("subtitle"),
    date: state.immutable.get("date"),
    chars: state.immutable.get("chars"),
    abbreviation: state.immutable.get("abbreviation"),
    right: state.immutable.get("right"),
    down: state.immutable.get("down"),
    writingDown: state.immutable.get("directionIsDown"),
  }
}

const mapDispatchToProps = dispatch => ({
  handleCellChange: (row_i, col_i, chars) =>
    dispatch(writeCross(row_i, col_i, chars)),
  handleDirectionChange: isDown => dispatch(setDirectionIsDown(isDown)),
  handleSwitchSeparation: (row_i, col_i) =>
    dispatch(switchSeparation(row_i, col_i)),
  handleSetQuestion: (isDown, row_i, col_i, question) =>
    dispatch(setQuestion(isDown, row_i, col_i, question)),
  handleEnsureQuestion: (isDown, row_i, col_i) =>
    dispatch(ensureQuestion(isDown, row_i, col_i)),
  handleSetNewsName: newsName => dispatch(setNewsName(newsName)),
  handleEnsureNewsName: () => dispatch(ensureNewsName()),
  handleSetSubtitle: subtitle => dispatch(setSubtitle(subtitle)),
  handleEnsureSubtitle: () => dispatch(ensureSubtitle()),
  handleSetDate: date => dispatch(setDate(date)),
  handeSetAbbreviation: abbreviation => dispatch(setAbbreviation(abbreviation)),
  handleEnsureAbbreviation: () => dispatch(ensureAbbreviation()),
  handleReset: () => dispatch(reset()),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
