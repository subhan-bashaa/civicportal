import React from "react";

interface State {
  error: Error | null;
  info: { componentStack: string } | null;
}

export default class ErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { error: null, info: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({ error, info });
    // Optionally log to an external service here
    // console.error(error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ minHeight: "100vh", padding: 24, fontFamily: "Inter, sans-serif" }}>
          <h1 style={{ color: "#b91c1c" }}>Application Error</h1>
          <p style={{ whiteSpace: "pre-wrap", background: "#fff", padding: 12, borderRadius: 6, boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
            {String(this.state.error && this.state.error.message)}
          </p>
          {this.state.info && (
            <details style={{ marginTop: 12, whiteSpace: "pre-wrap" }}>
              <summary>Stack</summary>
              <pre>{this.state.info.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}
