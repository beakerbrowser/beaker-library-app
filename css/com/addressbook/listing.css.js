import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'

const cssStr = css`
:host {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
  padding-top: 10px;
}

.empty {
  grid-column: 1 / span 3;
  background: #fff;
  padding: 24px;
  text-align: center;
}
`
export default cssStr