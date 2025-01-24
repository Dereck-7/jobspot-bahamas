import React from 'react';

class FirebaseErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Firebase operation failed:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-400 rounded">
          <h2 className="text-red-700 font-medium">Something went wrong</h2>
          <p className="text-red-600">{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-red-700 underline"
          >
            Reload page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default FirebaseErrorBoundary;
