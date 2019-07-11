import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSProperties } from 'react';
import { nominalTypeHack } from 'prop-types';

let sLeftHalf : CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '50%',
    padding: 20,
    background: '#ddd',
}
let sRightHalf : CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '50%',
    padding: 20,
    background: '#ddd',
}
let sTextarea : CSSProperties = {
    width: '100%',
    height: '90%',
    fontFamily: 'monospace',
    background: '#fff',
    borderRadius: 10,
    border: 'none',
    padding: 10,
}
let sOutputContainer : CSSProperties = {
    background: '#fff',
    borderRadius: 10,
}
let sOutput : CSSProperties = {
    padding: 20,
    borderBottom: '1px solid #ddd',
}

interface AppViewProps extends React.Props<any> { }
interface AppViewState {
    source : string;
    outputs : string[];
    n : number;
}
class AppView extends React.Component<AppViewProps, AppViewState> {
    constructor(props : AppViewProps) {
        super(props);
        this.state = {
            source: 'foo = bar',
            outputs: [],
            n : 5,
        };
    }
    componentDidMount() { 
        this.go();
    }
    setSource(e : any) {
        this.setState({source: e.target.value}, () => {
            this.go();
        });
    }
    go() {
        let outputs : string[] = [];
        for (let ii = 0; ii < this.state.n; ii++) {
            outputs.push(this.state.source);
        }
        this.setState({outputs: outputs});
    }
    render() {
        return <div>
            <div style={sLeftHalf}>
                <h4>Source</h4>
                <textarea style={sTextarea}
                    value={this.state.source}
                    onChange={e => this.setSource(e)}
                    />
            </div>
            <div style={sRightHalf}>
                <h4>Output</h4>
                <div style={sOutputContainer}>
                    {this.state.outputs.map((s, ii) =>
                        <div style={sOutput} key={ii}>{s}</div>
                    )}
                </div>
            </div>
        </div>;
    }
}

ReactDOM.render(
    <AppView />,
    document.getElementById('react-slot')
);
