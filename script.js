const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

const CATEGORIES = [
  { name: "Technology", color: "rgb(25, 69, 111)" },
  { name: "Science", color: "rgb(20, 86, 64)" },
  { name: "Finance", color: "rgb(115, 16, 107)" },
  { name: "Society", color: "rgb(171, 201, 5)" },
  { name: "Entertainment", color: "rgb(219, 33, 176)" },
  { name: "Health", color: "rgb(41, 112, 205)" },
  { name: "History", color: "rgb(190, 107, 5)" },
  { name: "News", color: "rgb(146, 13, 15)" },
];

const btn = document.querySelector(".btn-large");
const form = document.querySelector(".fact-form");
const facts = document.querySelector(".facts");
const fact = document.querySelector(".fact");
facts.innerHTML = "";

getThoughts();

async function getThoughts() {
  const resp = await fetch(
    "https://ruksxzloyzpdbrdjmvvd.supabase.co/rest/v1/Thoughts",
    {
      headers: {
        apikey:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1a3N4emxveXpwZGJyZGptdnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MTczMzQsImV4cCI6MjA1NTA5MzMzNH0.oAmoE8z8QgR774B3hFFLKNwy6aLCrDeJP3bneJzqVMU",
        authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1a3N4emxveXpwZGJyZGptdnZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1MTczMzQsImV4cCI6MjA1NTA5MzMzNH0.oAmoE8z8QgR774B3hFFLKNwy6aLCrDeJP3bneJzqVMU",
      },
    }
  );
  const data = await resp.json();
  createThoughtsList(data);
}

function createThoughtsList(dataArray) {
  const htmlArr = dataArray.map(
    (fact) => `<li class="fact">
         <p>${fact.thoughts}
            <a href="${fact.source}" target="_blank" class="source">(source)</a>
        </p>
        <span class="tag" style="background-color: ${
          CATEGORIES.find((cat) => cat.name === fact.category).color
        };">${fact.category}</span>
        </li>`
  );
  const html = htmlArr.join("");
  facts.insertAdjacentHTML("afterbegin", html);
}

btn.addEventListener("click", () => {
  console.log("Button clicked");
  if (form.classList.contains("hidden")) {
    form.classList.remove("hidden");
    btn.textContent = "Close";
  } else {
    form.classList.add("hidden");
    btn.textContent = "SHARE YOUR THOUGHTS!!";
  }
});
