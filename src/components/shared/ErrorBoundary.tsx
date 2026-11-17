"use client";

import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 24px",
            minHeight: "360px",
            background: "rgba(15, 23, 42, 0.65)",
            border: "1px solid rgba(239, 68, 68, 0.35)",
            borderRadius: "20px",
            textAlign: "center",
            color: "#f8fafc",
            margin: "16px 0",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "rgba(239, 68, 68, 0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px",
              color: "#f87171",
            }}
          >
            <AlertTriangle size={24} />
          </div>
          <h3
            style={{
              fontSize: "1.2rem",
              fontWeight: 700,
              margin: "0 0 8px 0",
              color: "#ffffff",
            }}
          >
            આ વિભાગ લોડ કરવામાં સમસ્યા આવી / An error occurred in this section
          </h3>
          <p
            style={{
              fontSize: "0.85rem",
              color: "rgba(255, 255, 255, 0.7)",
              maxWidth: "520px",
              lineHeight: 1.5,
              margin: "0 0 20px 0",
            }}
          >
            {this.props.moduleName
              ? `ક્ષતિ: ${this.props.moduleName} મોડ્યુલ લોડ કરવામાં અસમર્થ.`
              : "દૃશ્ય પ્રસ્તુતિ વખતે અણધારી ક્ષતિ આવી છે. કૃપા કરીને પુનઃપ્રયાસ કરો."}
            <br />
            <span style={{ fontSize: "0.78rem", color: "rgba(255, 255, 255, 0.5)" }}>
              {this.state.error?.message || "Unexpected runtime exception."}
            </span>
          </p>
          <button
            type="button"
            onClick={this.handleRetry}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "9px 20px",
              borderRadius: "9999px",
              border: "1px solid rgba(255, 255, 255, 0.25)",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#ffffff",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")}
          >
            <RefreshCw size={14} />
            <span>ફરીથી પ્રયાસ કરો / Try Again</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
