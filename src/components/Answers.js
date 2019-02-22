import React from "react"
import ContentEditable from "react-contenteditable"
import { connect } from "react-redux"

import { setQuestion, ensureQuestion } from "../actions"
import { sortCoords } from "../App"

class Answers extends React.Component {
  render() {
    const {
      numbers, // not handled by react
      isRight, // not handled by react
      chars, // not handled by react
      coords, // not handled by react
      right,
      down,
      handleSetQuestion,
      handleEnsureQuestion,
    } = this.props
    return (
      <div>
        {coords.sortBy(sortCoords).map(key => {
          const number = numbers.get(key)
          if (!number) {
            return undefined
          }
          const row_i = key.get(0)
          const col_i = key.get(1)
          const prim_i = isRight ? row_i : col_i
          const sec_i = isRight ? col_i : row_i
          const question = (isRight ? right : down).getIn([prim_i, sec_i, "question"])
          const word = chars
            .get(prim_i)
            .slice(sec_i)
            .takeWhile(
              (v, k) => k === 0 || !(isRight ? right : down).getIn([prim_i, sec_i + k])
            )
            .reduce((prev, el, i) => (el ? prev + el : prev + "_"), "")
          return (
            <div style={{display: "inline-block"}} key={number.toString()}>
              {number} <i className="no-print">{word}</i>{" "}
              <ContentEditable
                tagName="span"
                html={question}
                onChange={e =>
                  handleSetQuestion(!isRight, row_i, col_i, e.target.value)
                }
                onBlur={() => handleEnsureQuestion(!isRight, row_i, col_i)}
                style={{ paddingRight: 10 }}
              />
            </div>
          )
        })}
      </div>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    right: state.immutable.get("right"),
    down: state.immutable.get("down"),
  }
}

const mapDispatchToProps = dispatch => ({
  handleSetQuestion: (isDown, row_i, col_i, question) =>
    dispatch(setQuestion(isDown, row_i, col_i, question)),
  handleEnsureQuestion: (isDown, row_i, col_i) =>
    dispatch(ensureQuestion(isDown, row_i, col_i))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Answers)
