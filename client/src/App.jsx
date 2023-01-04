import { useState, useEffect } from "react";
import axios from "axios";

import send from "./assets/send.svg";
import user from "./assets/user.png";
import bot from "./assets/bot.png";
import loader from "./assets/loader.svg";

// const arr = [
//   {type: "user", post: "ldfldjfsdlfjdsfjdslfjdsl"},
//   {type: "bot", post: "roekjbckroedfjdfdsf fhfsdfqperyeryityrtow"}
// ]

const App = () => {

  const [input, setInput] = useState("");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    document.querySelector(".layout").scrollTop =
    document.querySelector(".layout").scrollHeight;
  }, [posts]);

  const fetchBotReponse = async () => {
    const { data } = await axios.post(
      "http://localhost:4000",
      { input },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  };

  const onSubmit = () => {
    // If input has no value not to do anything
    if (input.trim() === "") return;

    updatePosts(input);
    updatePosts("loading...", false, true);
    setInput("");
    // return promise
    fetchBotReponse().then((res) => {
      console.log(res);
      updatePosts(res.bot.trim(), true, false);
    });
  };

  const autoTypingBotResponse = (text) => {
    let index = 0;
    let interval = setInterval(() => {
      if (index < text.length) {
        setPosts((prevState) => {
          let lastItem = prevState.pop();
          if (lastItem.type !== "bot") {
            prevState.push({
              type: "bot",
              post: text.charAt(index - 1),
            });
          } else {
            prevState.push({
              type: "bot",
              post: lastItem.post + text.charAt(index - 1),
            });
          }
          return [...prevState];
        });
        index++;
      } else {
        clearInterval(interval);
      }
    }, 20);
  };

  const updatePosts = (post, isBot, isLoading) => {
    if (isBot) {
      autoTypingBotResponse(post);
    } else {
      setPosts((prevState) => {
        return [
          ...prevState,
          { type: isLoading ? "loading" : "user", post: post },
        ];
      });
    }
  };

  const onKeyUp = (e) => {
    if (e.key === "Enter" || e.which === 13) {
      onSubmit();
    }
  };

  return (
    <main className="chatGPT-app">
      <section className="chat-container">
        <div className="layout">
          {posts.map((post, index) => (
            /* conditionaly class add: if post type bot or loading then add bot class else nothing to be added */
            <div
              key={index}
              className={`chat-bubble ${
                post.type === "bot" || post.type === "loading" ? "bot" : ""
              }`}
            >
              <div className="avatar">
                <img
                  src={
                    post.type === "bot" || post.type === "loading" ? bot : user
                  }
                />
              </div>

              {post.type === "loading" ? (
                <div className="loader">
                  <img src={loader} />
                </div>
              ) : (
                <div className="post">{post.post}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <footer>
        <input
          type="text"
          placeholder="Ask Anything!"
          autoFocus
          className="composebar"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyUp={onKeyUp}
        />
        <div className="send-button" onClick={onSubmit}>
          <img src={send} />
        </div>
      </footer>
    </main>
  );
};

export default App;
