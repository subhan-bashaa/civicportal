import { createRoot } from "react-dom/client";
import React, { Suspense } from "react";
const App = React.lazy(() => import("./App"));
import ErrorBoundary from "./ErrorBoundary";
import "./index.css";

const root = createRoot(document.getElementById("root")!);

root.render(
	<React.StrictMode>
		<ErrorBoundary>
			<Suspense
				fallback={
					<div className="min-h-screen flex items-center justify-center">
						<span>Loading…</span>
					</div>
				}
			>
				<App />
			</Suspense>
		</ErrorBoundary>
	</React.StrictMode>
);
