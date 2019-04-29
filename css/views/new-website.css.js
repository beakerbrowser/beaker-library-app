import {css} from '/vendor/beaker-app-stdlib/vendor/lit-element/lit-element.js'
import inputsCSS from '/vendor/beaker-app-stdlib/css/inputs.css.js'
import buttonsCSS from '/vendor/beaker-app-stdlib/css/buttons.css.js'

const cssStr = css`
:host {
  display: block;
  max-width: 600px;
  padding: 14px 20px 20px;
  margin: 20px;
  background: #fff;
  border: 1px solid #d4d7dc;
  border-radius: 4px;
}

h1 {
  font-weight: 500;
  margin: 0;
}

${inputsCSS}
${buttonsCSS}

hr {
  margin: 20px 0;
  border: 0;
  border-top: 1px solid #ccc;
}

form > div:not(:last-child) {
  margin-bottom: 30px;
}

form p {
  margin: 14px 0;
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