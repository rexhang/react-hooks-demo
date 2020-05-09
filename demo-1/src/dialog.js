import * as React from "react";

import { createPortal } from 'react-dom';

export function Dailog() {
	return createPortal(
		<div>i am dailog</div>,
		document.body
	)
}