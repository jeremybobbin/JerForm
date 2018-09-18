import React, {Component} from 'react';

import Input from './Input';

export default class JerForm extends Component {

    constructor(props) {
        super(props);
        
        this.buttonText = props.buttonText;
        this.className = props.className;
        this.inputs = props.inputs;

        this.submitHandlerProp = props.onSubmit;
        
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

    }

    validateInputs() {
        const promises = this.inputRefs.map(({current}) =>
            current.validate());
        
        return Promise.all(promises);
    }

    getInputValues() {
        const pairs = {};

        this.inputRefs.forEach(({current}) => {
            const pair = current.getKeyValue();
            pairs[pair.key] = pair.value;
        });
        return pairs;
    }

    submitHandler(e) {
        e.preventDefault();

        if(this.validateInputs()) {
            this.submitHandlerProp(this.getInputValues());
        }
    }

    render() {
        const {buttonText, inputs, className} = this;
        const inputArray = inputs.map((input, i) => 
            <Input
                key={i}
                parentClass={className}
                {...input}
            />
        );

        if(buttonText) {
            inputArray.push(
                <input
                    key={100}
                    type='submit'
                    value={buttonText}
                    className={className ?
                        `${className}-submit`
                        :
                        `form-submit`
                    }/>
            );
        }

        return (
            <form
                onSubmit={(e) => this.submitHandler(e)}>
                {inputArray}
            </form>
        );
    }
}