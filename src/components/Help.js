import React from "react"
import "antd/dist/antd.css"
import { Drawer, Tabs } from "antd"
import { connect } from "react-redux"

import { setHelp } from "../actions"

class Help extends React.Component {
  render() {
    const { help, handleSetHelp } = this.props
    return (
      <Drawer
        title="Info"
        placement="right"
        width="50%"
        visible={help}
        onClose={() => handleSetHelp(false)}
      >
        <Tabs>
          <Tabs.TabPane tab="Hilfe" key="Hilfe">
            <p>
              Du kannst hier eigene Kreuzworträtsel erstellen, inspiriert vom{" "}
              <a href="https://sz-magazin.sueddeutsche.de/tag/kreuzwortraetsel">
                Kreuz mit den Worten im Süddeutschen Zeitung Magazin
              </a>
              , die unter dem Pseudonym{" "}
              <a href="https://de.wikipedia.org/wiki/CUS_(R%C3%A4tselautor)">
                CUS
              </a>{" "}
              wöchentlich erscheinen.
            </p>
            <p>
              Die meisten Inhalte können durch anklicken editiert werden:
              <ul>
                <li>Anfang des Magazintitels</li>
                <li>Untertitel (links)</li>
                <li>Datum (rechts)</li>
                <li>Lösungsbuchstaben</li>
                <li>AutorInnenkürzel (genau 3 Buchstaben)</li>
                <li>Fragen</li>
              </ul>
              Um Wortgrenzen hinzuzufügen musst du das Buchstabenfeld nach dem
              Wort markieren und Enter drücken. Dabei bitte auf die richtige
              Schreibrichtung achten.
            </p>
            <p>
              Das fertige Kreuzworträtsel kann ausgedruckt werden, die Lösungen
              und Buttons werden dabei nicht mitgedruckt.
            </p>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Über" key="Über">
            KreuzWort ist
            <ul>
              <li>
                eine{" "}
                <a href="https://jonathanstriebel.de/kreuzwort">Homepage</a> um
                selbst Kreuzworträtsel zu erstellen,
              </li>
              <li>
                dem{" "}
                <a href="https://sz-magazin.sueddeutsche.de/tag/kreuzwortraetsel">
                  Kreuz mit den Worten
                </a>{" "}
                des Süddeutschen Zeitung Magazins entlehnt,
              </li>
              <li>
                programmiert von{" "}
                <a href="https://jonathanstriebel.de">Jonathan Striebel</a>, und
              </li>
              <li>
                unter der{" "}
                <a href="https://de.wikipedia.org/wiki/MIT-Lizenz">
                  MIT-Lizenz
                </a>{" "}
                auf{" "}
                <a href="https://github.com/jstriebel/kreuzwort">
                  GitHub veröffentlicht
                </a>
                .
              </li>
            </ul>
          </Tabs.TabPane>
        </Tabs>
      </Drawer>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    help: state.immutable.get("help"),
  }
}

const mapDispatchToProps = dispatch => ({
  handleSetHelp: isHelpOpen => dispatch(setHelp(isHelpOpen)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Help)
