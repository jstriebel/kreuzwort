import React from "react"
import { List } from "immutable"
import times from "lodash/times"
import { connect } from "react-redux"

import { writeCross, switchSeparation } from "../actions"

class Cross extends React.Component {
  constructor(props) {
    super(props)
    this.input_refs = times(11, () => times(12, () => React.createRef()))
  }

  render() {
    const {
      chars,
      right,
      down,
      writingDown,
      numbers, // not handled by react, normal prop, as it is cached
      handleCellChange,
      handleSwitchSeparation,
    } = this.props
    const nextLeftRef = (row_i, col_i) => {
      if (this.input_refs[row_i][col_i - 1]) {
        return this.input_refs[row_i][col_i - 1]
      } else if (this.input_refs[row_i - 1]) {
        return this.input_refs[row_i - 1][11]
      } else {
        return this.input_refs[10][11]
      }
    }
    const nextUpRef = (row_i, col_i) => {
      if (this.input_refs[row_i - 1]) {
        return this.input_refs[row_i - 1][col_i]
      } else if (this.input_refs[10][col_i - 1]) {
        return this.input_refs[10][col_i - 1]
      } else {
        return this.input_refs[10][11]
      }
    }
    const nextRightRef = (row_i, col_i) => {
      if (this.input_refs[row_i][col_i + 1]) {
        return this.input_refs[row_i][col_i + 1]
      } else if (this.input_refs[row_i + 1]) {
        return this.input_refs[row_i + 1][0]
      } else {
        return this.input_refs[0][0]
      }
    }
    const nextDownRef = (row_i, col_i) => {
      if (this.input_refs[row_i + 1]) {
        return this.input_refs[row_i + 1][col_i]
      } else if (this.input_refs[0][col_i + 1]) {
        return this.input_refs[0][col_i + 1]
      } else {
        return this.input_refs[0][0]
      }
    }
    const setNextFocus = (row_i, col_i) => {
      if (writingDown) {
        nextDownRef(row_i, col_i).current.focus()
      } else {
        nextRightRef(row_i, col_i).current.focus()
      }
    }
    const setPrevFocus = (row_i, col_i) => {
      if (writingDown) {
        nextUpRef(row_i, col_i).current.focus()
      } else {
        nextLeftRef(row_i, col_i).current.focus()
      }
    }
    return (
      <table>
        <tbody>
          {chars.map((row, row_i) => (
            <tr key={row_i}>
              {row.map((cell, col_i) => (
                <td
                  key={[row_i, col_i]}
                  style={{
                    borderLeftWidth: right.getIn([row_i, col_i]) ? "5px" : null,
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
                    onKeyDown={e => {
                      switch (e.key) {
                        case "Enter":
                          handleSwitchSeparation(row_i, col_i)
                          break
                        case "Backspace":
                          handleCellChange(row_i, col_i, "")
                          if (!cell) {
                            setPrevFocus(row_i, col_i)
                          }
                          break
                        case "Delete":
                          handleCellChange(row_i, col_i, "")
                          break
                        case "ArrowLeft":
                          nextLeftRef(row_i, col_i).current.focus()
                          break
                        case "ArrowUp":
                          nextUpRef(row_i, col_i).current.focus()
                          break
                        case "ArrowRight":
                          nextRightRef(row_i, col_i).current.focus()
                          break
                        case "ArrowDown":
                          nextDownRef(row_i, col_i).current.focus()
                          break
                        default:
                          if (e.key.match(/^[a-z]$/i)) {
                            handleCellChange(row_i, col_i, e.key)
                            setNextFocus(row_i, col_i)
                          } else return false
                      }
                    }}
                    onFocus={event => event.target.select()}
                    ref={this.input_refs[row_i][col_i]}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    chars: state.immutable.get("chars"),
    right: state.immutable.get("right"),
    down: state.immutable.get("down"),
    writingDown: state.immutable.get("directionIsDown"),
  }
}

const mapDispatchToProps = dispatch => ({
  handleCellChange: (row_i, col_i, chars) =>
    dispatch(writeCross(row_i, col_i, chars)),
  handleSwitchSeparation: (row_i, col_i) =>
    dispatch(switchSeparation(row_i, col_i)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cross)
