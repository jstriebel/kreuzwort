import { List, Map, fromJS } from "immutable"
import moment from "moment"
import times from "lodash/times"

const initialNewsName = "Super"
const initialSubtitle = "Nummer 01"
const initialQuestion = "Fragen fragen!"
const initialAbbreviation = "JFS"

const initialState = fromJS({
  version: 0,
  newsName: initialNewsName,
  subtitle: initialSubtitle,
  date: moment().format("DD.MM.YYYY"),
  directionIsDown: false,
  chars: new Array(11).fill(new Array(12).fill("")),
  abbreviation: initialAbbreviation,
  right: times(11, () => [{ question: initialQuestion }]),
  down: times(12, () => [{ question: initialQuestion }]),
  help: true,
})

const makeWordIndex = (isDown, row_i, col_i) =>
  isDown ? List(["down", col_i, row_i]) : List(["right", row_i, col_i])

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_NEWS_NAME":
      return state.set("newsName", action.newsName)
    case "ENSURE_NEWS_NAME":
      const currentNewsName = state.get("newsName")
      const newsName = currentNewsName ? currentNewsName : initialNewsName
      return state.set("newsName", newsName)
    case "SET_SUBTITLE":
      return state.set("subtitle", action.subtitle)
    case "ENSURE_SUBTITLE":
      const currentSubtitle = state.get("subtitle")
      const subtitle = currentSubtitle ? currentSubtitle : initialSubtitle
      return state.set("subtitle", subtitle)
    case "SET_DATE":
      return state.set("date", action.date)
    case "WRITE_CROSS":
      const newChar = action.chars.charAt(action.chars.length - 1)
      if (newChar === "" || newChar.match(/[a-z]/i)) {
        return state.setIn(
          ["chars", action.row_i, action.col_i],
          newChar.toUpperCase()
        )
      } else {
        return state
      }
    case "SET_DIRECTION_IS_DOWN":
      return state.set("directionIsDown", action.isDown)
    case "SWITCH_SEPARATION":
      const index = makeWordIndex(
        state.get("directionIsDown"),
        action.row_i,
        action.col_i
      )
      if (state.getIn(index)) return state.deleteIn(index)
      else return state.setIn(index, Map({ question: initialQuestion }))
    case "SET_ABBREVIATION":
      return state.set("abbreviation", action.abbreviation)
    case "ENSURE_ABBREVIATION":
      const currentAbbreviation = state.get("abbreviation")
      const abbreviation =
        currentAbbreviation.length === 3
          ? currentAbbreviation
          : initialAbbreviation
      return state.set("abbreviation", abbreviation.toUpperCase())
    case "SET_QUESTION":
      return state.setIn(
        makeWordIndex(action.isDown, action.row_i, action.col_i).push(
          "question"
        ),
        action.question
      )
    case "ENSURE_QUESTION":
      const questionIndex = makeWordIndex(
        action.isDown,
        action.row_i,
        action.col_i
      ).push("question")
      const currentQuestion = state.getIn(questionIndex)
      const question = currentQuestion ? currentQuestion : initialQuestion
      return state.setIn(questionIndex, question)
    case "RESET":
      return initialState
    case "SET_HELP":
      return state.set("help", action.isHelpOpen)
    default:
      return state
  }
}
