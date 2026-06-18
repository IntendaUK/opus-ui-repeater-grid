//React
import React, { useEffect, useRef, useState } from 'react';

/*
	Native ResizableBox. Replaces react-resizable (CJS-only at every version, and it pulls in
	react-draggable — both do require('react'), which Vite 8/Rolldown turns into a __require
	that crashes in the browser). Implements only what the grid header uses:
	  props: width, height, axis ('x' | 'y' | 'both'), resizeHandles (e.g. ['e']),
	         minConstraints/maxConstraints ([w, h]), onResize, onResizeStop, style, children.
	onResize/onResizeStop are called as (event, { size: { width, height } }) to match
	react-resizable's signature.
*/

const ResizableBox = props => {
	const {
		width,
		height,
		axis = 'both',
		resizeHandles = ['se'],
		minConstraints = [0, 0],
		maxConstraints,
		onResize,
		onResizeStop,
		style,
		children
	} = props;

	const [size, setSize] = useState({ width, height });
	const drag = useRef(null);

	useEffect(() => {
		setSize({ width, height });
	}, [width, height]);

	const clamp = (val, min, max) => {
		let next = Math.max(min || 0, val);

		if (max !== undefined)
			next = Math.min(max, next);

		return next;
	};

	const computeSize = e => {
		const { startX, startY, startW, startH } = drag.current;
		let w = startW;
		let h = startH;

		if (axis === 'x' || axis === 'both')
			w = clamp(startW + (e.clientX - startX), minConstraints[0], maxConstraints && maxConstraints[0]);
		if (axis === 'y' || axis === 'both')
			h = clamp(startH + (e.clientY - startY), minConstraints[1], maxConstraints && maxConstraints[1]);

		return { width: w, height: h };
	};

	const onHandleDown = e => {
		e.preventDefault();
		e.stopPropagation();

		drag.current = { startX: e.clientX, startY: e.clientY, startW: size.width, startH: size.height };

		const onMove = ev => {
			if (!drag.current)
				return;

			const next = computeSize(ev);
			setSize(next);

			if (onResize)
				onResize(ev, { size: next });
		};

		const onUp = ev => {
			window.removeEventListener('pointermove', onMove);
			window.removeEventListener('pointerup', onUp);

			const next = computeSize(ev);
			drag.current = null;

			if (onResizeStop)
				onResizeStop(ev, { size: next });
		};

		window.addEventListener('pointermove', onMove);
		window.addEventListener('pointerup', onUp);
	};

	return (
		<div
			className="react-resizable"
			style={{ position: 'relative', width: size.width, height: size.height, ...style }}
		>
			{children}
			{resizeHandles.map(h => (
				<span
					key={h}
					className={`react-resizable-handle react-resizable-handle-${h}`}
					onPointerDown={onHandleDown}
				/>
			))}
		</div>
	);
};

export default ResizableBox;
