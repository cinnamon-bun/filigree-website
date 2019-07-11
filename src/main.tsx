import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSProperties } from 'react';
import { nominalTypeHack } from 'prop-types';

import { Filigree } from 'filigree-text';

let range = (n : number) : number[] =>
    [...Array(n).keys()]

let sLeftHalf : CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    width: '50%',
    padding: 20,
    background: '#b8dee0',
}
let sRightHalf : CSSProperties = {
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    width: '50%',
    padding: 20,
    background: '#c1b5cb',
    overflowY: 'auto',
}
let sTextarea : CSSProperties = {
    width: '100%',
    height: 'calc(100% - 180px)',
    fontFamily: 'monospace',
    background: '#fff',
    borderRadius: 10,
    border: 'none',
    padding: 10,
}
let sOutputContainer : CSSProperties = {
    background: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
}
let sOutput : CSSProperties = {
    padding: 20,
    borderBottom: '1px solid #ddd',
}
let sErr : CSSProperties = {
    position: 'fixed',
    left: 0,
    width: '50%',
    bottom: 0,
    height: 100,
    color: 'red',
    padding: 20,
}

interface AppViewProps extends React.Props<any> { }
interface AppViewState {
    source : string;
    outputs : string[];
    n : number;
    rule : string;
    err : string | null;
}

class AppView extends React.Component<AppViewProps, AppViewState> {
    constructor(props : AppViewProps) {
        super(props);
        this.state = {
            source: 'name = [joe/susan]\nstart = Hello <name.titlecase>!',
            outputs: [],
            n: 10,
            rule: 'start',
            err: null,
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
        let fil = new Filigree(this.state.source);
        let outputs = range(this.state.n).map(n =>
            fil.generate(this.state.rule)
        );
        let err = fil.err === null ? null : fil.err.message;
        this.setState({
            outputs: outputs,
            err: err,
        });
    }
    render() {
        return <div>
            <div style={sLeftHalf}>
                <h3>Filigree online editor</h3>
                <h4>Source</h4>
                <div style={sErr}>
                    {this.state.err}
                </div>
                <textarea style={sTextarea}
                    value={this.state.source}
                    onChange={e => this.setSource(e)}
                    />
            </div>
            <div style={sRightHalf}>
                <h3 style={{textAlign: 'right'}}>
                    <a href="https://github.com/cinnamon-bun/filigree">GitHub</a>
                </h3>
                <h4>Output of "{this.state.rule}" rule</h4>
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
