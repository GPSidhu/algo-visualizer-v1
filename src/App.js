import "./App.css";
import Scratchpad from "./Scratchpad";

function App() {
	return (
		<div className="App">
			<header className="App-header">
				Understanding Manacher's Algorithm
			</header>
			<p>
				<b>Longest palindromic substring</b>
			</p>
			<br />
			<p>
				In computer science, the longest palindromic substring or
				longest symmetric factor problem is the problem of finding a
				maximum-length contiguous substring of a given string that is
				also a palindrome. For example, the longest palindromic
				substring of "bananas" is "anana".
				<a
					href="https://en.wikipedia.org/wiki/Longest_palindromic_substring"
					rel="noreferrer"
					target="_blank"
				>
					source
				</a>
			</p>
			<br />
			<p>
				<i>
					Provide an input below and see how the alogrithm works for
					each iteration by clicking "Next Iteration" button.
				</i>
			</p>
			<Scratchpad />
			<div className="footer">
				<p style={{ fontSize: "14px" }}>
					Ref: Using this{" "}
					<a
						href="https://www.youtube.com/watch?v=V-sEwsca1ak"
						rel="noreferrer"
						target="_blank"
					>
						video
					</a>{" "}
					tutorial as a source.
				</p>
				<p style={{ fontSize: "14px" }}>
					<b>Note: </b>Try to use a smaller string as the page is not
					responsive
				</p>
				<br />
				<p style={{ fontSize: "14px" }}>
					Made by{" "}
					<a
						href="https://guri-sidhu.netlify.app"
						target="_blank"
						rel="noreferrer"
					>
						<b>Gurpreet Singh</b>
					</a>{" "}
					in{" "}
					<a
						href="https://dictionary.cambridge.org/dictionary/english/hurry"
						rel="noreferrer"
						target="_blank"
					>
						Hurry
					</a>
				</p>
			</div>
		</div>
	);
}

export default App;
