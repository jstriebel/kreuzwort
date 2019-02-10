import React from "react"
import "antd/dist/antd.css"
import { DatePicker } from "antd"
import moment from "moment"
import ContentEditable from "react-contenteditable"
import { connect } from "react-redux"

import {
  setNewsName,
  ensureNewsName,
  setSubtitle,
  ensureSubtitle,
  setDate,
} from "../actions"

class Header extends React.Component {
  render() {
    const {
      newsName,
      subtitle,
      date,
      handleSetNewsName,
      handleEnsureNewsName,
      handleSetSubtitle,
      handleEnsureSubtitle,
      handleSetDate,
    } = this.props
    return (
      <div>
        <h1>
          <ContentEditable
            tagName="span"
            html={newsName}
            onChange={e => handleSetNewsName(e.target.value)}
            onBlur={handleEnsureNewsName}
          />{" "}
          Zeitung Magazin
        </h1>
        <div>
          <ContentEditable
            html={subtitle}
            style={{ float: "left" }}
            onChange={e => handleSetSubtitle(e.target.value)}
            onBlur={handleEnsureSubtitle}
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
  handleSetNewsName: newsName => dispatch(setNewsName(newsName)),
  handleEnsureNewsName: () => dispatch(ensureNewsName()),
  handleSetSubtitle: subtitle => dispatch(setSubtitle(subtitle)),
  handleEnsureSubtitle: () => dispatch(ensureSubtitle()),
  handleSetDate: date => dispatch(setDate(date)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
