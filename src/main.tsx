import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { CSSProperties } from 'react';

import { Filigree } from 'filigree-text';

//================================================================================

let SOURCE = `
# This is a list of text replacement rules
# like fancy mad-libs.

# <anglebrackets> refer to another rule.
# [squarebrackets] randomly choose from what's inside them.

start = ✨ Welcome to the <schoolName.titlecase>!  Don't [trip on/fall into/step on] the <spookyPlace>.

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
  ancient
]
institute = [institute/school/college/academy]
subject = [wizardry/magic/spells/potions]

spookyPlace = <container> of <horrors>

container = [vat/cauldron/pit/vial/chamber/dimension]
horrors = [
  bones ☠️
  snakes 🐍
  bubbling goo
  newts
  eyeballs 👀
  bats 
]
`.trim();

//================================================================================

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
    fontFamily: 'georgia, seriff',
    fontSize: 20,
    lineHeight: '1.5em',
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
}

//================================================================================

interface AppViewProps extends React.Props<any> { }
interface AppViewState {
    source : string;
    outputs : string[];
    n : number;
    rule : string;
    err : string | null;
    showWrappers : boolean;
    autoUpdate : boolean;
    deterministic : boolean;
}

class AppView extends React.Component<AppViewProps, AppViewState> {
    constructor(props : AppViewProps) {
        super(props);
        this.state = {
            source: SOURCE,
            outputs: [],
            n: 20,
            rule: 'start',
            err: null,
            showWrappers: false,
            autoUpdate: true,
            deterministic: true,
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
    setDeterministic(val : boolean) {
        this.setState({deterministic: val}, () => {
            this.go();
        });
    }
    setAutoUpdate(val : boolean) {
        this.setState({autoUpdate: val}, () => {
            if (val) { this.go(); }
        });
    }
    go() {
        let seed = this.state.deterministic ? 'abc' : undefined;
        let fil = new Filigree(this.state.source, seed);
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
                    Source code
                    &nbsp; &nbsp;
                    <div style={{float: 'right', paddingBottom: 5}}>
                        <label style={{fontWeight: 'normal', display: 'inline-block'}}>
                            <input type="checkbox"
                                checked={this.state.autoUpdate}
                                onChange={(e) => this.setAutoUpdate(e.target.checked)}
                                />
                            Update as you type
                        </label>
                        <button style={sButton} type="button" onClick={() => this.go()}>Update now &rarr;</button>
                    </div>
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
                    <label style={{fontWeight: 'normal', display: 'inline-block'}}>
                        <input type="checkbox"
                            checked={this.state.showWrappers}
                            onChange={(e) => this.setShowWrappers(e.target.checked)}
                            />
                        Show structure
                    </label>
                    &nbsp; &nbsp;
                    <label style={{fontWeight: 'normal', display: 'inline-block'}}>
                        <input type="checkbox"
                            checked={!this.state.deterministic}
                            onChange={(e) => this.setDeterministic(!e.target.checked)}
                            />
                        Random every time
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

//================================================================================

ReactDOM.render(
    <AppView />,
    document.getElementById('react-slot')
);
