import React, { useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
	display: grid;
	grid-template-columns: 300px auto 300px;
	grid-gap: 24px;
	padding: 2rem;
`;

const DynamicArea = styled.div`
	min-width: 500px;
	.text {
		line-height: 2;
		min-width: 300px;
		vertical-align: bottom;
		margin-right: 8px;
	}
	.label {
		margin-right: 8px;
		vertical-align: bottom;
	}
	button {
		cursor: pointer;
	}
`;

const StaticArea = styled.div`
	font-size: 16px;
	text-align: left;
	border: 1px solid white;
	padding: 1rem;
	max-width: 300px;
	li {
		margin-bottom: 1rem;
	}
	h4 {
		text-align: center;
	}
`;

const VarArea = styled.div`
	margin: 1rem auto;
	min-width: 500px;
	height: auto;
	border: 1px solid white;
	padding: 2rem;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	> * {
		margin: 8px;
	}
	.var {
		font-weight: bold;
	}
	.label {
		font-size: 16px;
	}
`;

const MessageArea = styled.div`
	min-width: 100px;
	border: 1px solid white;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	.output {
		color: aqua;
	}
`;

const Message = styled.li`
	list-style: none;
	color: #fff;
	font-weight: bold;
	font-size: 18px;
`;

const ControlArea = styled.div`
	margin: 1rem auto;
	border: 1px solid white;
	padding: 2rem;
	display: flex;
	font-size: 18px;
	flex-direction: row;
	justify-content: space-evenly;
	align-items: center;
`;

const PadArea = styled.div`
	margin: 1rem auto;
	min-height: 200px;
	border: 1px solid purple;
	padding: 2rem;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const ArrayElem = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	background: transparent;
	counter-reset: box -1;
	margin: 12px 0;
	::before {
		content: ${({ name }) => name + ""};
		position: absolute;
		margin-left: -12px;
	}
`;

const ArrayBox = styled.div`
	border: 1px solid #000;
	font-size: 24px;
	height: 34px;
	width: 34px;
	cursor: pointer;
	background: ${({ j, _j, center, start, end }) =>
		j || _j
			? "pink"
			: center
			? "#63bbdb"
			: start
			? "darkgreen"
			: end
			? "#ab599d"
			: "#fff"};
	color: ${({ center }) => (center ? "#fff" : "#000")};
	opacity: 0.8;
	// border: ${({ j, _j }) => (j || _j ? "2px dotted black" : "none")};
	margin: 4px;
	${({ idx }) =>
		idx !== undefined
			? `::after {
            counter-increment: box;
            content: counter(box);
            color: #fff;
            position: absolute;
            margin-top: -20px;
            margin-left: -10px;
            font-size: 14px;
        }`
			: null}
`;

const cases = [
	"Case 1 : Right side palindrome is totally contained under current palindrome. In this case do not consider this as center.",
	"Case 2 : Current palindrome is proper suffix of input. Terminate the loop in this case. No better palindrome will be found on right.",
	"Case 3 : Right side palindrome is proper suffix and its corresponding left side palindrome is proper prefix of current palindrome. Make largest such point as next center.",
	"Case 4 : Right side palindrome is proper suffix but its left corresponding palindrome is beyond current palindrome. Do not consider this as center because it will not extend at all.",
];

const Scratchpad = () => {
	const [inputStr, setInputStr] = useState("abaxababb");
	const [inputStrArray, setInputStrArray] = useState(inputStr.split(""));
	const [isAlgoRunning] = useState(false);
	const [newCenterNeeded, setNewCenterNeeded] = useState(false);
	const [maxPalindrome, setMaxPalindrome] = useState("");
	const [messages, setMessages] = useState([]);
	const [variables, setVariables] = useState({
		start: { val: 0, color: "darkgreen", label: "Left Edge" },
		i: { val: 0, color: "skyblue", label: "Current Center" },
		end: { val: 0, color: "#ab599d", label: "Right Edge" },
		j: { val: -1, color: "pink", label: "Right Half Iterator" },
	});
	const [T, setT] = useState(new Array(inputStrArray.length).fill(0));
	const [runAlgo, setRunAlgo] = useState(false);

	const reset = () => {
		setInputStr("");
		updateInputArray("");
		updateVars(0, 0, 0, -1);
		setMessages([]);
		setMaxPalindrome("");
	};
	useEffect(() => {
		if (inputStr) updateInputArray(inputStr);
		return reset;
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (runAlgo) {
			const timer = setInterval(() => {
				executeAlgo(false);
				debugger;
				if (!runAlgo) clearInterval(timer);
			}, 3000);
			return () => clearInterval(timer);
		}
		// eslint-disable-next-line
	}, [runAlgo]);

	const updateVars = (newStart, newEnd, newI, newJ) => {
		setVariables({
			...variables,
			i: {
				...variables.i,
				val: newI !== undefined ? newI : variables.i.val,
			},
			start: { ...variables.start, val: newStart },
			end: { ...variables.end, val: newEnd },
			j: {
				...variables.j,
				val: newJ !== undefined ? newJ : variables.j.val,
			},
		});
	};

	const updateInputArray = (str) => {
		if (!str) {
			setInputStrArray([]);
			setT([].fill(0));
			return;
		}
		let newArray = getInputArray(str);
		setInputStrArray(newArray);
		setT(new Array(newArray.length).fill(0));
	};
	const onInputChange = (e) => {
		setInputStr(e.target.value);
		updateInputArray(e.target.value);
	};

	const getInputArray = (str) => {
		if (!str) return [];
		let newArray = new Array(2 * str.length + 1);
		let idx = 0;
		for (let n = 0; n < newArray.length; n++) {
			if (n % 2 === 0) {
				newArray[n] = "#";
			} else {
				newArray[n] = str[idx++];
			}
		}
		return newArray;
	};

	const executeAlgo = (executeAll) => {
		if (isAlgoRunning) return;
		let start = variables.start.val;
		let end = variables.end.val;
		while (start > 0 && end < inputStrArray.length - 1) {
			if (inputStrArray[start - 1] === inputStrArray[end + 1])
				updateVars(--start, ++end);
			if (!executeAll) break;
		}
		let _T = T;
		_T[variables.i.val] = end - start + 1;
		setT([..._T]);

		if (end === _T.length - 1) {
			setRunAlgo(false); // stop algo
			setMessages([cases[1]]);
			calculatePalindrome();
			return;
		}
		const i = variables.i.val;
		if (
			start === 0 ||
			end === inputStrArray.length - 1 ||
			inputStrArray[start - 1] !== inputStrArray[end + 1]
		) {
			if (!newCenterNeeded) {
				setNewCenterNeeded(true);
				setMessages([
					"Need to select a new center as cannot expand palindrome centered at (" +
						i +
						") further",
				]);
			} else {
				let newCenter = end + (i % 2 === 0 ? 1 : 0);
				let j = variables.j.val;
				if (j === -1) {
					j = i + 1;
					updateVars(start, end, i, j);
					setMessages([
						"Calculating next center: j= " + j + " to end= " + end,
					]);
				} else {
					while (j <= end) {
						_T[j] = Math.min(_T[i - (j - i)], 2 * (end - j) + 1);
						setT(_T);
						if (j + Math.floor(_T[i - (j - i)] / 2) === end) {
							newCenter = j;
							setMessages([
								...messages,
								"New center found : (" +
									newCenter +
									") . " +
									cases[2],
							]);
							// update j to -1
							// continue with i loop
							j = -1;
							break;
						}
						if (!executeAll) break;
					}

					if (j > end || j === -1) {
						const newI = newCenter;
						const newStart = newI - Math.floor(_T[newI] / 2);
						const newEnd = newI + Math.floor(_T[newI] / 2);
						updateVars(newStart, newEnd, newI, -1);
						setNewCenterNeeded(false);
						setMessages(["New center selected: " + newCenter]);
					} else {
						updateVars(start, end, i, ++j);
					}
				}
			}
		}

		calculatePalindrome();
	};

	const calculatePalindrome = () => {
		let max = {
			val: Number.NEGATIVE_INFINITY,
			index: 0,
		};
		for (let k = 0; k < T.length; k++) {
			if (max.val < T[k]) {
				max.val = T[k];
				max.index = k;
			}
		}
		let actualLength = Math.floor((max.val - 1) / 2);
		let startingIndex = Math.floor((max.index - actualLength) / 2);
		setMaxPalindrome(inputStr.substr(startingIndex, actualLength));
	};

	return (
		<Container>
			<StaticArea>
				<h4>Cases</h4>
				{cases && cases.map((c, idx) => <li key={idx}>{c}</li>)}
			</StaticArea>
			<DynamicArea>
				<span className="label">Input:</span>
				<input
					className="text"
					type="text"
					autoFocus="autoFocus"
					onChange={(e) => onInputChange(e)}
					value={inputStr}
				/>
				<VarArea>
					{variables &&
						Object.keys(variables).map(
							(v) =>
								variables[v].val !== -1 && (
									<div
										style={{ color: variables[v].color }}
										key={v}
									>
										<div>
											<span
												className={`var`}
											>{`${v} : `}</span>
											<span className={`val`}>
												{variables[v].val}
											</span>
										</div>
										{variables[v].label && (
											<span className="label">
												{variables[v].label}
											</span>
										)}
									</div>
								)
						)}
				</VarArea>
				<PadArea>
					<ArrayElem name="str">
						{inputStrArray.map((char, index) => (
							<ArrayBox
								key={index}
								center={index === variables.i.val}
								start={index === variables.start.val ? 1 : 0}
								end={index === variables.end.val ? 1 : 0}
								j={index === variables.j.val ? 1 : 0}
								_j={
									variables.j.val !== -1 &&
									index ===
										variables.i.val -
											(variables.j.val - variables.i.val)
										? 1
										: 0
								}
								idx={index}
								onClick={() => {
									updateVars(index, index, index);
									setMessages([]);
									//setNewCenterSelected(true);
									setNewCenterNeeded(false);
								}}
							>
								{char}
							</ArrayBox>
						))}
					</ArrayElem>
					<ArrayElem name="T">
						{T &&
							T.map((val, index) => (
								<ArrayBox
									key={index}
									center={index === variables.i.val ? 1 : 0}
									j={index === variables.j.val ? 1 : 0}
									_j={
										variables.j.val !== -1 &&
										index ===
											variables.i.val -
												(variables.j.val -
													variables.i.val)
											? 1
											: 0
									}
									// idx={index}
									// onClick={() => setVariables({...variables, i: index})}
								>
									{val}
								</ArrayBox>
							))}
					</ArrayElem>
				</PadArea>
				<ControlArea>
					{/* <span>{`Execute: `}</span> */}
					<button
						onClick={() => {
							executeAlgo(false);
						}}
					>{`Next Iteration`}</button>
					<button
						onClick={() => {
							reset();
						}}
					>{`Reset`}</button>
				</ControlArea>
			</DynamicArea>
			<MessageArea>
				<Message className="output">{`LPS: ${maxPalindrome}`}</Message>
				{messages &&
					messages.map((m, index) => (
						<Message key={index}>{m}</Message>
					))}
			</MessageArea>
		</Container>
	);
};

export default Scratchpad;
