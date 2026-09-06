import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../lib/supabase";

function AskDoubt() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");

  const [loading, setLoading] = useState(false);
  const [checkingUser, setCheckingUser] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      setCheckingUser(false);
    }

    checkUser();
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first ❌");
      navigate("/login");
      return;
    }

    const { error } = await supabase
      .from("doubts")
      .insert([
        {
          user_id: user.id,
          title: title,
          topic: topic,
          description: description,
          code: code,
        },
      ]);

    setLoading(false);

    if (error) {
      console.error("Error submitting doubt:", error);
      alert("Doubt submit nahi hua ❌");
      return;
    }

    alert("Doubt successfully submit ho gaya! 🎉");

    setTitle("");
    setTopic("");
    setDescription("");
    setCode("");
  }

  if (checkingUser) {
    return (
      <div className="ask-page">
        <p className="loading-text">
          Checking login...
        </p>
      </div>
    );
  }

  return (
    <div className="ask-page">

      <div className="ask-header">

        <p className="section-label">
          ASK A DOUBT
        </p>

        <h1>
          What are you stuck on?
        </h1>

        <p>
          Share your problem clearly.
          Add your code if you have one.
        </p>

      </div>


      <form
        className="doubt-form"
        onSubmit={handleSubmit}
      >

        {/* TITLE */}

        <div className="form-group">

          <label htmlFor="title">
            Doubt title
          </label>

          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="e.g. Why is my Two Sum code not working?"
            required
          />

        </div>


        {/* TOPIC */}

        <div className="form-group">

          <label htmlFor="topic">
            Topic
          </label>

          <select
            id="topic"
            value={topic}
            onChange={(e) =>
              setTopic(e.target.value)
            }
            required
          >

            <option value="" disabled>
              Select a topic
            </option>

            <option value="arrays">
              Arrays
            </option>

            <option value="strings">
              Strings
            </option>

            <option value="recursion">
              Recursion
            </option>

            <option value="linked-list">
              Linked List
            </option>

            <option value="stack-queue">
              Stack / Queue
            </option>

            <option value="trees">
              Trees
            </option>

            <option value="graphs">
              Graphs
            </option>

            <option value="dynamic-programming">
              Dynamic Programming
            </option>

          </select>

        </div>


        {/* DESCRIPTION */}

        <div className="form-group">

          <label htmlFor="description">
            Explain your doubt
          </label>

          <textarea
            id="description"
            rows="8"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Tell us what you are trying to do, what you understand, and where you are stuck..."
            required
          />

        </div>


        {/* CODE */}

        <div className="form-group">

          <label htmlFor="code">
            Your code <span>(optional)</span>
          </label>

          <textarea
            id="code"
            rows="10"
            value={code}
            onChange={(e) =>
              setCode(e.target.value)
            }
            placeholder="Paste your C++, Java, Python etc. code here..."
          />

        </div>


        {/* SUBMIT */}

        <button
          type="submit"
          className="primary-btn"
          disabled={loading}
        >

          {loading
            ? "Submitting..."
            : "Submit Doubt →"}

        </button>

      </form>

    </div>
  );
}

export default AskDoubt;