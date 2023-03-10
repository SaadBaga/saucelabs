import Head from "next/head";
import { quizAPI, apiResponse } from "@/api/quiz";
import { useEffect, useState } from "react";
import _ from "lodash";
const sha1 = require("sha1");

export default function Home() {
  const totalChancesGiven = 3;
  const [allQuestion, setAllQuestion] =  useState([]);
  const [data, setData] = useState([]);
  const [unansData, setUnansData] = useState([]);
  const [totalPoint, setTotalPoint] = useState(0);
  const [pointRemaining, setPoinRemaining] = useState(3);
  const [incorrectData, setIncorrectData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const response = await quizAPI() 
      response.map((element) => {
        element.ansGiven = false;
        element.isCorrect = null;
        element.ansValue = "";
      });
      setData(response);
      setAllQuestion(response)
      checkData(response);
      // ...
    }
    fetchData();
  }, []);

  const callAPI = async () => {
    const response = await quizAPI()
    response.map((element) => {
      element.ansGiven = false;
      element.isCorrect = null;
      element.ansValue = "";
    });
    return response;
  };

  const checkData = async (data1) => {
    const findUnAnsQ = _.find(data1, { ansGiven: false });
    if (_.isNil(findUnAnsQ)) {
      const apiData = await callAPI();
      const finalData = [];
      if (apiData && apiData.length > 0) {
        apiData.map((singEle) => {
          if (!_.find(data, { answerSha1: singEle.answerSha1 })) {
            finalData.push(singEle);
          }
        });
      }
      const mergedData = finalData; 
      const findUnAnsData = _.find(mergedData, { ansGiven: false });
      setAllQuestion(_.concat(data, apiData))
      if (!_.isNil(findUnAnsData)) {
        setUnansData([findUnAnsData]);
      } else {
        setUnansData([]);
      }
    } else {
      setUnansData([findUnAnsQ]);
    }
  };

  const submitAnswer = (item) => {
    const showData1 = [...data];
    showData1.map((single) => {
      if (single.answerSha1 === item.answerSha1) {
        single.ansGiven = true;
        if (sha1(_.trim(single.ansValue.toLowerCase())) === item.answerSha1) {
          single.isCorrect = true;
        } else {
          single.isCorrect = false;
        }
      }
    });
    setData(showData1);
    checkData(showData1);
    setAllQuestion(showData1)
    calTotalPoint();
    chancesRemaining(showData1, item);
  };

  const updateValue = (item, value) => {
    const showData1 = [...allQuestion];
    showData1.map((single) => {
      if (single.answerSha1 === item.answerSha1) {
        single.ansValue = value;
      }
    });
    setData(showData1);
  };

  const calTotalPoint = () => {
    const findUnAnsQ = _.filter(allQuestion, { isCorrect: true });
    setTotalPoint(findUnAnsQ.length || 0);
  };

  const chancesRemaining = () => {
    const findUnAnsQ = _.uniq(
      _.filter(allQuestion, { isCorrect: false }),
      "answerSha1"
    );
    setIncorrectData(findUnAnsQ);
    if (totalChancesGiven >= findUnAnsQ.length) {
      setPoinRemaining(totalChancesGiven - findUnAnsQ.length || 0);
    }
  };

  return (
    <>
      <Head>
        <title>Sauce Labs: Assignment</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="">
        <div className="flex justify-center h-screen items-center">
          <div className="shadow-2xl	border border-teal-600	order	 w-full lg:w-1/2 h-1/2  rounded p-3">
            <div className="flex justify-center text-3xl font-semibold pb-6">
              Quiz Application
            </div>
            <div className="flex">
              <div className="">
                Total Point:
                <span className="ml-1 text-emerald-600 font-medium">
                  {totalPoint}
                </span>
              </div>
              {pointRemaining > 0 ? (
                <div className="flex flex-end ml-auto">
                  Chances left:
                  <span className="ml-1 text-rose-600 font-medium">
                    {pointRemaining}
                  </span>
                </div>
              ) : null}
            </div>

            {pointRemaining < 1 ? (
              <div className="flex justify-center">
                <button
                  style={{
                    background: "blue",
                    borderRadius: "5px",
                    padding: "5px",
                    width: "100px",
                    color: "white",
                  }}
                  className="bg-green text-blue-600/100"
                  onClick={() => (window.location.href = "/")}
                >
                  Start Again
                </button>
              </div>
            ) : (
              <div className="flex flex-col">
                {unansData &&
                  unansData.length > 0 &&
                  unansData.map((item) => (
                    <div key={item.answerSha1}>
                      <div className="mt-5">
                        <p className="block text-sm font-medium text-gray-700">
                          Q: {item.question}
                        </p>
                        <div className="h-8 mt-2 rounded-md border border-gray-300">
                          <input
                            type="text"
                            name="price"
                            value={item.ansValue}
                            onChange={(e) =>
                              updateValue(item, e.target.value)
                            }
                            className="h-full outline-none block w-full rounded-md pl-2 sm:text-sm"
                          />
                        </div>
                        <div className="w-full flex justify-center mt-5">
                          <button
                            style={{
                              background: "green",
                              borderRadius: "5px",
                              padding: "5px",
                              width: "100px",
                              color: "white",
                            }}
                            className="bg-green text-blue-600/100"
                            onClick={() => submitAnswer(item)}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
