import { Component, ErrorInfo, ReactNode } from 'react'

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  componentDidCatch(_e: Error, _i: ErrorInfo) {}
  render() { return this.state.hasError ? <div className='p-6 text-red-500'>Something went wrong.</div> : this.props.children }
}
