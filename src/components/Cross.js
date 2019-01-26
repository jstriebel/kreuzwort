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
      numbers, // not handled by react, normal prop, as it can be cached
      handleCellChange,
      handleSwitchSeparation,
    } = this.props
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
      <table>
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
                  onFocus={event => event.target.select()}
                  ref={this.input_refs[row_i][col_i]}
                />
              </td>
            ))}
          </tr>
        ))}
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
