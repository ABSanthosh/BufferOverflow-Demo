import React, { useEffect, useRef, useState } from "react";
import Xarrow from "react-xarrows";
import { CodeBlock } from "react-code-blocks";
import "./Overflow.scss";

function Overflow() {
  const errorCodes = {
    1: "For demonstration purposes, set buffer in the range of 1-17",
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

    setStack(tempStack);
  };

  const stackStartRef1 = useRef(null);
  const stackEndRef1 = useRef(null);

  const stackStartRef2 = useRef(null);
  const stackEndRef2 = useRef(null);

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
    <div className="OverflowWrapper">
      <div className="OverflowWrapper__title">
        <h3>Basic Buffer Overflow</h3>
        <hr />
      </div>
      <div className="OverflowWrapper__content">
        <div className="OverflowWrapper__content__bottom">
          <div className="OverflowWrapper__content__left">
            <div className="OverflowWrapper__content__top">
              {errorList.map((item, index) => (
                <li key={index} className="OverflowWrapper__error">
                  {errorCodes[item]}
                </li>
              ))}
              {stack.includes("BASE POINTER") ? (
                <li className="OverflowWrapper__noError">✔️ No Overflow</li>
              ) : (
                <li className="OverflowWrapper__error">Overflow!</li>
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
                  if (parseInt(e.target.value) <= 17 || e.target.value === "") {
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
            <div className="OverflowWrapper__Attack">
              <input
                placeholder="Input"
                type="text"
                onBlur={(e) => setHighlightLine("")}
                onFocus={(e) => setHighlightLine("6")}
                onChange={(e) => {
                  setInput(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  // if (stack.length <= STACKSIZE - 1) {
                  updateStack(input);
                  // }
                }}
              >
                Attack!
              </button>
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
            </div>
          </div>
          <div className="OverflowWrapper__content__right">
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
                    <tr ref={stackStartRef1}></tr>
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

                      return (
                        <tr
                          key={index}
                          // ref={index === 0 ? stackStartRef1 : null}
                        >
                          <td className={className}>{address}</td>
                          <td className={className}>{value}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot ref={stackStartRef2} />
                </table>
                <Xarrow start={stackStartRef1} end={stackEndRef1} />
                <Xarrow start={stackStartRef2} end={stackEndRef2} />
              </>
            )}

            <table className="OverflowWrapper__content__right--kernelImage">
              <thead>
                <tr>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr className="Kernel"></tr>
                <tr className="Kernel">
                  <td>Kernel</td>
                </tr>
                <tr className="Kernel"></tr>
                <tr className="Kernel last"></tr>

                <tr className="Stack first" ref={stackEndRef1}>
                  <td></td>
                </tr>
                <tr className="Stack">
                  <td></td>
                </tr>
                <tr className="Stack">
                  <td>Stack</td>
                </tr>
                <tr className="Stack">
                  <td></td>
                </tr>
                <tr className="Stack last" ref={stackEndRef2}>
                  <td></td>
                </tr>

                <tr className="empty">
                  <td> ↓ </td>
                </tr>
                <tr className="empty"></tr>
                <tr className="empty"></tr>
                <tr className="empty"></tr>
                <tr className="empty"></tr>
                <tr className="empty"></tr>
                <tr className="empty"></tr>
                <tr className="empty">
                  <td>↑</td>
                </tr>

                <tr className="Heap first"></tr>
                <tr className="Heap">
                  <td>Heap</td>
                </tr>
                <tr className="Heap last"></tr>

                <tr className="Data first"></tr>
                <tr className="Data">
                  <td>Data</td>
                </tr>
                <tr className="Data last"></tr>

                <tr className="Text first"></tr>
                <tr className="Text">
                  <td>Text</td>
                </tr>
                <tr className="Text last"></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Overflow;
