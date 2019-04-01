import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import inputsCSS from '/vendor/beaker-app-stdlib/css/inputs.css.js'
import buttonsCSS from '/vendor/beaker-app-stdlib/css/buttons.css.js'

const cssStr = css`
:host {
  display: block;
  max-width: 600px;
}

h1 {
  font-weight: 500;
  margin-bottom: 0;
}

${inputsCSS}
${buttonsCSS}

hr {
  margin: 20px 0;
  border: 0;
  border-top: 1px solid #ccc;
}

form > div {
  margin-bottom: 30px;
}

label,
input {
  display: block;
  width: 100%;
}

label {
  margin-bottom: 6px;
}

input {
  margin-bottom: 10px;
  font-size: 16px;
  height: 40px;
  padding: 0 10px;
}

label.required:after {
  content: '*';
  color: red;
}

button[type="submit"] {
  font-weight: 500;
}
`
export default cssStr