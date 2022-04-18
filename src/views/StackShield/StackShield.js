import React, { useEffect, useState } from "react";
import { CodeBlock } from "react-code-blocks";
import "./StackShield.scss";

function StackShield(props) {
  const errorCodes = {
    1: "For demonstration purposes, set buffer in the range of 1-17",
    2: "Program terminated!",
  };
  const [bufferSize, setBufferSize] = useState(0);
  const [errorList, setErrorList] = useState([]);
  const [highlightLine, setHighlightLine] = useState("");

  const FUNCTIONSIZE = 5;
  const STACKSIZE = 25;
  const START = 24;

  const [stack, setStack] = useState([]);
  const [input, setInput] = useState("");

  const fillStack = () => {
    let tempStack = Array(STACKSIZE).fill(0);
    tempStack[STACKSIZE - FUNCTIONSIZE - 1] = "PARAMETERS";
    tempStack[STACKSIZE - FUNCTIONSIZE - 2] = START;
    tempStack[STACKSIZE - FUNCTIONSIZE - 3] = "BASE POINTER";
    tempStack[0] = START;

    setStack(tempStack);
  };

  useEffect(() => {
    fillStack();
  }, []);

  const updateStack = (input) => {
    let tempStack = stack;
    const bufferStartIndex = tempStack.length - FUNCTIONSIZE - 3;
    const bufferEndIndex = bufferStartIndex - bufferSize;

    var inputArr = input.split("");
    for (var i = 0; i < inputArr.length; i++) {
      if (input[i] !== " ") {
        if (isNaN(input[i])) {
          tempStack[bufferEndIndex + i] = inputArr[i];
        } else if (input[i] === 0) {
          console.log("Here in noop");
          tempStack[bufferEndIndex + i] = "\\x90";
        } else {
          tempStack[bufferEndIndex + i] = parseInt(
            inputArr[i] + inputArr[i + 1]
          );
        }
      }
    }

    setStack([...tempStack]);
  };
  return (
    <div className="StackShieldWrapper">
      <div className="StackShieldWrapper__title">
        <h3>Basic Buffer Overflow</h3>
        <hr />
      </div>
      <div className="StackShieldWrapper__content">
        <div className="StackShieldWrapper__content__bottom">
          <div className="StackShieldWrapper__content__left">
            <div className="StackShieldWrapper__content__top">
              {errorList.map((item, index) => (
                <li key={index} className="StackShieldWrapper__error">
                  {errorCodes[item]}
                </li>
              ))}
              {stack.includes("BASE POINTER") ? (
                <li className="StackShieldWrapper__noError">✔️ No Overflow</li>
              ) : (
                <li className="StackShieldWrapper__error">Overflow!</li>
              )}
            </div>
            <input
              placeholder="Buffer Size"
              type="number"
              onFocus={(e) => setHighlightLine("5")}
              onBlur={(e) => {
                setHighlightLine("");
                if (stack.length === 0) {
                  fillStack();
                }
              }}
              onChange={(e) => {
                if (
                  Number.isInteger(parseInt(e.target.value)) ||
                  e.target.value === ""
                ) {
                  if (parseInt(e.target.value) <= 16 || e.target.value === "") {
                    setBufferSize(parseInt(e.target.value));
                    setErrorList([...errorList.filter((item) => item !== 1)]);
                  } else {
                    if (!errorList.includes(1)) setErrorList([...errorList, 1]);
                    setBufferSize(parseInt(e.target.value));
                  }
                } else {
                  e.preventDefault();
                }
              }}
            />
            <div className="StackShieldWrapper__Attack">
              <input
                placeholder="Input"
                type="text"
                onBlur={(e) => setHighlightLine("")}
                onFocus={(e) => setHighlightLine("6")}
                onChange={(e) => {
                  setInput(e.target.value);
                  updateStack(e.target.value);
                  if (
                    !errorList.includes(2) &&
                    stack[START - FUNCTIONSIZE - 1] !== stack[0]
                  ) {
                    setErrorList([...errorList, 2]);
                  } else {
                    setErrorList([...errorList].filter((error) => error !== 2));
                  }
                }}
              />
              <button
                disabled
                style={{ backgroundColor: "#c1c1c1", cursor: "not-allowed" }}
                onClick={() => {
                  // if (stack.length <= STACKSIZE - 1) {
                  // updateStack(input);
                  // }
                }}
              >
                Attack!
              </button>
              <i>(Auto attack)</i>
            </div>

            <CodeBlock
              text={`#include <stdio.h>
#include <string.h>
            
int main(int argc, char* argv[]){
  char buffer[${isNaN(bufferSize) ? "0" : bufferSize}];
  strcpy(buffer, argv[1]); ${input !== "" ? "//" + input : ""}
  return 1;
}`}
              language="c"
              highlight={highlightLine}
              customStyle={{
                width: "100%",
                fontFamily: `ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace`,
              }}
              showLineNumbers={true}
              theme="atomOneLight"
              codeBlock
            />
            <div className="Summary">
              <div className="legend">
                <div>
                  <label htmlFor="">Function:</label>
                  <div className="legend-value function" />
                </div>
                <div>
                  <label htmlFor="">Return Address:</label>
                  <div className="legend-value return" />
                </div>
                <div>
                  <label htmlFor="">Buffer:</label>
                  <div className="legend-value buffer" />
                </div>
                <div>
                  <label htmlFor="">Base Pointer:</label>
                  <div className="legend-value basepointer" />
                </div>
                <div>
                  <label htmlFor="">Stack Shield flag:</label>
                  <div className="legend-value copiedReturnAddress" />
                </div>
              </div>
              <div className="legend">
                <div>
                  <label htmlFor="">Return Address:</label>
                  <p>{stack[START - FUNCTIONSIZE - 1]}</p>
                </div>
                <div>
                  <label htmlFor="">Stack Shield's Address:</label>
                  <p>{stack[0]}</p>
                </div>
              </div>
            </div>
          </div>
          <div className="StackShieldWrapper__content__right">
            {stack.length !== 0 && (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>Address</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stack.map((item, index) => {
                      const address = stack.length - index - 1;
                      const value = stack[address];

                      // console.log(address, value);

                      const bufferStart = FUNCTIONSIZE + 3;
                      const bufferEnd = bufferStart + bufferSize - 1;

                      let className = "";

                      if (index < FUNCTIONSIZE) className = "function";
                      if (index === FUNCTIONSIZE + 0) className = "parameters";
                      if (index === FUNCTIONSIZE + 1) className = "return";
                      if (index === FUNCTIONSIZE + 2) className = "basepointer";
                      if (index >= bufferStart && index <= bufferEnd)
                        className = "buffer";
                      if (index === STACKSIZE - 1)
                        className = "copiedReturnAddress";

                      return (
                        <tr key={index}>
                          <td className={className}>{address}</td>
                          <td className={className}>{value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

StackShield.propTypes = {
  // bla: PropTypes.string,
};

StackShield.defaultProps = {
  // bla: 'test',
};

export default StackShield;
