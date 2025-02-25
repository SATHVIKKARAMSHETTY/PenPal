import React, { useEffect, useState } from "react";
import supabase from "./supabase";
import "./style.css";

const CATEGORIES = [
  { name: "Technology", color: "rgb(25, 69, 111)" },
  { name: "Science", color: "rgb(20, 86, 64)" },
  { name: "Finance", color: "rgb(115, 16, 107)" },
  { name: "Society", color: "rgb(133, 147, 54)" },
  { name: "Entertainment", color: "rgb(219, 33, 176)" },
  { name: "Health", color: "rgb(41, 112, 205)" },
  { name: "History", color: "rgb(190, 107, 5)" },
  { name: "News", color: "rgb(146, 13, 15)" },
  { name: "General", color: "rgba(134, 132, 132, 0.08)" },
];

function App() {
  const [formstate, setFormState] = useState(false);
  const [facts, setFacts] = useState([]);
  const [currCategory, setCurrCategory] = useState("All");

  useEffect(() => {
    async function getThoughts() {
      let query = supabase.from("Thoughts").select("*");
      if (currCategory !== "All") {
        query = query.eq("category", currCategory);
      }

      const { data: Thoughts, error } = await query
        .order("upvote", { ascending: true })
        .limit(100);

      if (error) {
        console.error("Error fetching thoughts:", error);
      } else {
        setFacts(Thoughts);
      }
    }

    getThoughts();
  }, [currCategory]);
  return (
    <>
      <Header setFormState={setFormState} formstate={formstate} />
      {formstate ? (
        <ShareThoughtForm setFacts={setFacts} setFormState={setFormState} />
      ) : null}
      <main className="main">
        <Categories setCurrCategory={setCurrCategory} />
        <ThoughtsList facts={facts} setFacts={setFacts} />
      </main>
    </>
  );
}

function Header({ setFormState, formstate }) {
  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="logo.png" alt="PenPal logo" height="68" width="68" />
          <h1>PenPal</h1>
        </div>
        <button
          className="btn btn-large"
          onClick={() => setFormState(!formstate)}
        >
          {formstate ? "CLOSE" : "SHARE YOUR THOUGHTS!!!"}
        </button>
      </header>
    </>
  );
}

function ShareThoughtForm({ setFacts, setFormState }) {
  const [thought, setThought] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (thought && category && thought.length <= 200) {
      // Insert the new thought into the Supabase table
      const { data: newThought, error } = await supabase
        .from("Thoughts")
        .insert([{ thought, source, category }])
        .select();

      if (error) {
        console.error("Error inserting thought:", error);
      } else {
        setFacts((prevFacts) => [newThought[0], ...prevFacts]);
      }
      setThought("");
      setSource("");
      setCategory("");
      setFormState(false);
    }
  }

  return (
    <>
      <form className="fact-form" onSubmit={handleSubmit}>
        <input
          type="text"
          required
          placeholder="Enter your thoughts"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
        />

        <span>{200 - thought.length}</span>
        <input
          type="text"
          placeholder="Source"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <select
          required
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Choose a Category:</option>
          {CATEGORIES.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <button className="btn btn-large">POST</button>
      </form>
    </>
  );
}

function Categories({ setCurrCategory }) {
  return (
    <>
      <aside>
        <ul>
          <li>
            <button
              className="btn btn-all"
              onClick={() => {
                setCurrCategory("All");
              }}
            >
              ALL
            </button>
          </li>
          {CATEGORIES.map((cat) => (
            <li key={cat.name} style={{ listStyle: "none" }}>
              <button
                className="btn btn-cat"
                onClick={() => {
                  setCurrCategory(cat.name);
                }}
                style={{ backgroundColor: cat.color }}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </>
  );
}

function ThoughtsList({ facts, setFacts }) {
  if (facts.length === 0) {
    return (
      <p className="message">
        There are no thoughts shared in this category...Be the 1st one to
        share!!!
      </p>
    );
  }
  return (
    <>
      <section>
        <ul className="facts">
          {facts.map((fact) => (
            <Fact key={fact.id} fact={fact} setFacts={setFacts} />
          ))}
        </ul>
        <p className="numbThoughts">
          There are {facts.length} Thoughts in the database. Add your own!!!
        </p>
      </section>
    </>
  );
}

function Fact({ fact, setFacts }) {
  async function handleVote(col) {
    const { data: updatedVote, error } = await supabase
      .from("Thoughts")
      .update({
        [col]: fact[col] + 1,
      })
      .eq("id", fact.id)
      .select();
    if (!error) {
      setFacts((prevFacts) =>
        prevFacts.map((f) => (f.id === fact.id ? updatedVote[0] : f))
      );
    }
  }
  const handleSourceClick = (e) => {
    if (!fact.source) {
      e.preventDefault();
      window.alert("There is no valid source for this thought.");
    }
  };
  const isDisputed = fact.upvote + fact.shockedvote < fact.downvote;
  return (
    <>
      <li className="fact">
        <p>
          {isDisputed ? "⚠️" : null}
          {fact.thought}
          {fact.source ? (
            <a
              href={fact.source}
              target="_blank"
              className="source"
              onClick={handleSourceClick}
            >
              (source)
            </a>
          ) : (
            <span
              className="source"
              onClick={handleSourceClick}
              style={{ color: "rgb(122, 4, 6)", cursor: "pointer" }}
            >
              (no source)
            </span>
          )}
        </p>
        <div className="fact-tags">
          <span
            className="tag"
            style={{
              backgroundColor:
                (CATEGORIES.find((cat) => cat.name === fact.category) || {})
                  .color || "transparent",
            }}
          >
            {fact.category}
          </span>

          <button onClick={() => handleVote("upvote")}>
            👍<strong>{fact.upvote}</strong>
          </button>
          <button onClick={() => handleVote("shockedvote")}>
            🤯<strong>{fact.shockedvote}</strong>
          </button>
          <button onClick={() => handleVote("downvote")}>
            👎<strong>{fact.downvote}</strong>
          </button>
        </div>
      </li>
    </>
  );
}

export default App;
