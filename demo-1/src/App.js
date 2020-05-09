import React, { useState, useEffect, createContext, useContext, useReducer, useMemo, useRef, useCallback } from 'react';

import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom/index';

import { Dailog } from "./dialog";

const AppContext = createContext(undefined);

const AppContextProvider = props => {
	return (
		<AppContext.Provider value={props.value}>
			{props.children}
		</AppContext.Provider>
	)
}

function AppReducer(state, action) {
	switch (action.type) {
		case 'add':
			return {
				...state,
				count: state.count + 1
			};
		case 'sub':
			return {
				...state,
				count: state.count - 1
			};
		default:
			return state
	}
}

// 自定义hooks
function useWinSize() {
	const [win, setWin] = useState({
		width: document.documentElement.clientWidth,
		height: document.documentElement.clientHeight
	});
	const onResize = useCallback(() => {
		// 针对一些函数方法
		setWin({
			width: document.documentElement.clientWidth,
			height: document.documentElement.clientHeight
		});
	}, []);
	// @js-ignore
	useEffect(() => {
		window.addEventListener('resize', onResize);
		return () => {
			window.removeEventListener('resize', onResize);
		}
	}, []);

	return win;
}

function Home() {
	useEffect(() => {
		console.log('home init');
		return () => {
			console.log('home leave');
		}
	}, []);
	return (
		<div>
			home
		</div>
	);
}

function List() {
	useEffect(() => {
		console.log('list init');
		return () => {
			console.log('list leave');
		}
	}, []);
	return (
		<div>list</div>
	);
}

function Footer() {

	const footerEle = useRef(null);

	const win = useWinSize();

	const actions = () => {
		const {innerText} = footerEle.current
		console.log(innerText);
	}

	return [
		<hr key={1} />,
		<footer key={2} ref={footerEle}>
			Footer Component
			<button onClick={() => actions()}>Click</button>
			<p>
				{`x: ${win.width}, y: ${win.height}`}
			</p>
		</footer>
	]
}

function Main({name}) {
	useMemo(() => {
		// 性能优化，当遇到匹配的变化时才去执行方法|内容|针对一些方法
		return console.log(name);
	}, [name]);

	const contexts = useContext(AppContext);
	console.log(contexts);


	return (
		<>
			<Router>
				<div>
					<ul>
						<li>
							<Link to='/'>/</Link>
						</li>
						<li>
							<Link to='/home'>/home</Link>
						</li>
						<li>
							<Link to='/list'>/list</Link>
						</li>
					</ul>
				</div>
				<Switch>
					<Route
						exact
						path='/'
						component={Home}
					/>
					<Route
						exact
						path='/home'
						component={Home}
					/>
					<Route
						exact
						path='/list'
						component={List}
					/>
				</Switch>

			</Router>
		</>
	)
}

export function App() {

	const [count, setCount] = useState(0); // 顺序记录

	const [xname, setXname] = useState('xx');

	useEffect(() => {
		console.log(count);
	}, []);

	const initialState = {
		name: 'AppReducer',
		count: 0
	}

	const [state, dispatch] = useReducer(AppReducer, {...initialState}, () => {
		return initialState;
	});
	console.warn(state.count);

	return (
		<div className="App">
			<p>{count}</p>
			<button onClick={() => setCount(count + 1)}>click add</button>
			<button onClick={() => dispatch({type: 'add'})}>BTN 1</button>
			<button onClick={() => dispatch({type: 'sub'})}>BTN 2</button>
			<button onClick={() => setXname('xx' + new Date().getTime())}>BTN 3</button>
			<AppContextProvider
				value={{
					name: 'Guhang',
					state
				}}
			>
				<Main name={xname}/>
			</AppContextProvider>
			<Footer/>
			{/*<Dailog/>*/}
		</div>
	);
}