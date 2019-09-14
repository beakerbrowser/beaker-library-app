import { css } from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'

const cssStr = css`
.header {
  display: flex;
  align-items: center;
  height: 26px;
  border-bottom: 1px solid #ccc;
  padding: 10px;
}

.header button {
  margin-right: 10px;
}

.spacer {
  flex: 1;
}

.header button {
  font-size: 12px;
}

.header button .fa-fw {
  font-size: 11px;
}

.search-container {
  position: relative;
  margin: 9px 7px;
}

input.search {
  font-size: 12px;
  border: 1px solid #ccc;
  background: transparent;
  outline: 0;
  box-sizing: border-box;
  width: 155px;
  border-radius: 15px;
  height: 27px;
  padding-left: 32px;
}

.search-container > i.fa-search  {
  position: absolute;
  left: 12px;
  top: 8px;
  color: rgba(0,0,0,.6);
  font-size: 11px;
}
`
export default cssStr