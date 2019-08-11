import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSProperties } from 'react';
import { nominalTypeHack } from 'prop-types';

import { Filigree } from 'filigree-text';

let range = (n : number) : number[] =>
    [...Array(n).keys()]

let replaceAll = (s : string, orig : string, repl : string) : string =>
    s.split(orig).join(repl);

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
    whiteSpace: 'pre-line',
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
let sButton : CSSProperties = {
    border: 'none',
    borderBottom: '3px solid #aaa',
    padding: '5px 15px',
    background: 'white',
    marginLeft: 20,
    borderRadius: 10,
    float: 'right',
}

interface AppViewProps extends React.Props<any> { }
interface AppViewState {
    source : string;
    outputs : string[];
    n : number;
    rule : string;
    err : string | null;
    showWrappers : boolean;
    autoUpdate : boolean;
}

let SOURCE = `
# This is a list of text replacement rules.

# Use <anglebrackets> to refer to another rule.
start = Welcome to the <schoolName.titlecase>!

# Use [squarebrackets] to make a list of random choices.
# These can have nested <anglebrackets> inside them!
schoolName = [
  <haunted> <institute> of <subject>
  <institute> of <haunted> <subject>
  <haunted> <subject> <institute>
  <haunted> <haunted> <haunted> <institute>
]

haunted = [
  haunted
  spooky
  mysterious
  dark
  old
]

# random choices can also go on a single line, separated by "/"
institute = [institute/school/college/academy]
subject = [wizardry/magic/spells/potions]
`.trim();

class AppView extends React.Component<AppViewProps, AppViewState> {
    constructor(props : AppViewProps) {
        super(props);
        this.state = {
            source: SOURCE,
            outputs: [],
            n: 10,
            rule: 'start',
            err: null,
            showWrappers: false,
            autoUpdate: true,
        };
    }
    componentDidMount() { 
        this.go();
    }
    setSource(s : string) {
        this.setState({source: s}, () => {
            if (this.state.autoUpdate) { this.go(); }
        });
    }
    setShowWrappers(val : boolean) {
        this.setState({showWrappers: val}, () => {
            this.go();
        });
    }
    setAutoUpdate(val : boolean) {
        this.setState({autoUpdate: val}, () => {
            if (val) { this.go(); }
        });
    }
    go() {
        let fil = new Filigree(this.state.source);
        let plainWrapperFn = (rule : string, text : string) : string =>
            replaceAll(text, '<', '&lt;');
        let decoratedWrapperFn = (rule : string, text : string) : string =>
            `<div style="padding:10px; display:inline-block; border: 1px solid #08f; border-radius:5px; white-space: normal">
                <sup style="color:#08f">${rule}</sup>
                <div style="white-space: pre-line">${text}</div>
            </div>`;
        let outputs = range(this.state.n).map(n =>
            fil.generate(this.state.rule, this.state.showWrappers ? decoratedWrapperFn : plainWrapperFn)
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
                <h4>
                    Source
                    &nbsp; &nbsp;
                    <label style={{fontWeight: 'normal'}}>
                        <input type="checkbox"
                            checked={this.state.autoUpdate}
                            onChange={(e) => this.setAutoUpdate(e.target.checked)}
                            />
                        Auto-update
                    </label>
                    <button style={sButton} type="button" onClick={() => this.go()}>Update &rarr;</button>
                </h4>
                <div style={sErr}>
                    {this.state.err}
                </div>
                <textarea style={sTextarea}
                    value={this.state.source}
                    onChange={e => this.setSource(e.target.value)}
                    />
            </div>
            <div style={sRightHalf}>
                <h3 style={{textAlign: 'right'}}>
                    <a href="https://github.com/cinnamon-bun/filigree">Documentation on GitHub</a>
                </h3>
                <h4>
                    Output of "{this.state.rule}" rule
                    &nbsp; &nbsp;
                    <label style={{fontWeight: 'normal'}}>
                        <input type="checkbox"
                            checked={this.state.showWrappers}
                            onChange={(e) => this.setShowWrappers(e.target.checked)}
                            />
                        Show structure
                    </label>
                </h4>
                <div style={sOutputContainer}>
                    {this.state.outputs.map((output, ii) =>
                        <div style={sOutput}
                            key={ii}
                            dangerouslySetInnerHTML={{__html: output}}
                            />
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
