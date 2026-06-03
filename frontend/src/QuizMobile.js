import React from "react";
import "./QuizMobile.css";
import MobileHeader from "./MobileHeader";

function QuizMobile({
  questions,
  selectedAnswers,
  showResults,
  loading,
  error,
  language,
  handleOptionSelect,
  handleSubmit,
  resetQuiz
}) {

  const getText = (en, hi) =>
    language === "hindi" ? hi : en;

  const score =
    Object.keys(selectedAnswers).filter(index => {
      const q = questions[Number(index)];
      return selectedAnswers[index] === q.answer;
    }).length;

  return (
    <div className="quiz-mobile-home">

<MobileHeader />


      <div className="quiz-title-card">
        <h2>
          {getText("Story Quiz", "कहानी प्रश्नोत्तरी")}
        </h2>
      </div>

      {loading && (
        <div className="quiz-glass-card">
          Loading Questions...
        </div>
      )}

      {error && (
        <div className="quiz-glass-card error-card">
          {error}
        </div>
      )}

      {!loading &&
        questions.map((q, index) => (
          <div
            key={index}
            className="quiz-glass-card"
          >

            <div className="mobile-question">
              {index + 1}. {q.question}
            </div>

            <div className="mobile-options">

              {q.options.map(
                (option, optIndex) => {

                  const isSelected =
                    selectedAnswers[index] === option;

                  const isCorrect =
                    q.answer === option;

                  let cls =
                    "mobile-option";

                  if (showResults) {

                    if (isCorrect)
                      cls += " correct";

                    if (
                      isSelected &&
                      !isCorrect
                    )
                      cls += " incorrect";

                  } else if (
                    isSelected
                  ) {
                    cls += " selected";
                  }

                  return (
                    <button
                      key={optIndex}
                      className={cls}
                      onClick={() =>
                        !showResults &&
                        handleOptionSelect(
                          index,
                          option
                        )
                      }
                    >
                      {String.fromCharCode(
                        65 + optIndex
                      )}. {option}
                    </button>
                  );
                }
              )}

            </div>

          </div>
        ))}

      {!loading &&
        questions.length > 0 &&
        !showResults && (

          <button
            className="quiz-submit-btn"
            onClick={handleSubmit}
          >
            {getText(
              "Submit Quiz",
              "प्रश्नोत्तरी जमा करें"
            )}
          </button>
        )}

      {showResults && (

        <div className="quiz-result-card">

          <h3>
            {getText(
              "Your Score",
              "आपका परिणाम"
            )}
          </h3>

          <p>
            {score} / {questions.length}
          </p>

          <button
            className="quiz-submit-btn"
            onClick={resetQuiz}
          >
            {getText(
              "Try Again",
              "फिर से प्रयास करें"
            )}
          </button>

        </div>
      )}

    </div>
  );
}

export default QuizMobile;