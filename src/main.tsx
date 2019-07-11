import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSProperties } from 'react';

interface AppViewProps extends React.Props<any> {
}
class AppView extends React.Component<AppViewProps, any> {
    constructor(props : AppViewProps) { super(props); }
    componentDidMount() {
    }
    componentWillUnmount() {
    }
    render() {
        return <div>
            Hello from React
        </div>;
    }
}

ReactDOM.render(
    <AppView />,
    document.getElementById('react-slot')
);
