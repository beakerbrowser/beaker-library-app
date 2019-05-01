import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'

const cssStr = css`
:host {
  display: block;
  margin: 15px 0 5px;
  user-select: none;
}

h5 {
  margin: 15px 10px 5px;
  color: #666673;
  font-weight: 400;
}

a {
  display: flex;
  padding: 10px 16px;
  align-items: center;
  border: 0;
}

a i {
  margin-right: 6px;
  font-size: 16px;
  color: gray;
}

a.active {
  color: #111;
  background: rgba(0,0,0,.05);
}

hr {
  border: 0;
  border-top: 1px solid #ccc;
}
`
export default cssStr