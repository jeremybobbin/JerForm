import React, {Component} from 'react';

import Input from './Input';

export default class JerForm extends Component {

    constructor(props) {
        super(props);
        
        this.buttonText = props.buttonText;
        this.className = props.className;
        this.inputs = props.inputs;

        this.onSubmit = props.onSubmit;
        
        this.inputRefs = [];
        
        const that = this;

        // If the input is a string, assign it to it's name attribute.
        this.inputs.forEach((input, i) => {
            const ref = React.createRef();

            if(typeof input === 'string')
                this.inputs[i] = { name: input };
            
            this.inputs[i].ref = ref;
            that.inputRefs.push(ref);
        });
        console.log('Input Refs: ');
        console.log(this.inputRefs);

    }

    validateInputs() {
        const promises = this.inputRefs.map(({current}) =>
            current.validate());
        
        return Promise.all(promises);
    }

    getInputValues() {
        const pairs = {};

        this.inputRefs.forEach(input => {
            const pair = input.getKeyValue();
            pairs[pair.key] = pair.value;
        });

        return pairs;
    }

    submitHandler(e) {
        e.preventDefault();

        if(this.validateInputs()) {
            this.onSubmit(...this.getInputValues());
        }
    }

    render() {
        
        const inputs = this.inputs.map((input, i) => 
            <Input
                key={i}
                parentClass={this.className}
                {...input}
            />
        );

        return (
            <form
                onSubmit={(e) => this.submitHandler(e)}>
                {inputs}
            </form>
        );
    }
}