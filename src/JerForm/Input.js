import React, {Component, Fragment} from 'react';

const baseDefault = {

    labelText: null,
    id: '',
    className: null,
    errorClassName: null,
    placeholder: null,
    type: 'text',

    changeHandler: (stateRef, e) => 
        stateRef.value = e.target.value,

    predicates: [{
        func: v => v.length > 0,
        errorMsg: 'This field is required.',
    }],
}

const defaults = {
    username: {
        type: 'text'
    },

    password: {
        type: 'password',
        predicates: [{
            func: v => v.length > 0,
            errorMsg: 'Password is required.'
        }],
    },

    email: {
        type: 'email',
        predicates: [{
            func: v => v.length > 0,
            errorMsg: 'Email address is required.'
        },
        {
            func: v => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v),
            errorMsg: 'That email is not valid.'
        }],
    },
    
    phone: {
        type: 'tel',
        predicates: [{
            func: v => v.length > 0,
            errorMsg: 'Phone number is required.'
        },
        {
            func: v => /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/.test(v),
            errorMsg: 'Phone number is invalid.'
        }],

    },

    remember: {
        type: 'checkbox',
        labelText: 'Keep me logged in',
        predicates: [{
            func: v => true,
            errorMsg: 'This message will never display.'
        }],
        changeHandler: (stateRef, e) =>
            stateRef.value = e.target.checked

    }
};


const attributes = [
    'id', 'className', 'errorClassName', 'parentClass', 'name',
    'placeholder', 'labelText', 'predicates', 'changeHandler', 'type'
];

export default class Input extends Component {

    constructor(props) {
        super(props);
        this.props = props;
        
        
        const {name} = props;
        if(!name) throw 'JerForm requires a name for each input.';

        const defaultValues = defaults[name];

        // First check passed in props, then check defaults by name,
        // then check base defaults, then throw.
        attributes.forEach(attr => {
            this[attr] = 
                props[attr] ||
                defaultValues[attr] ||
                baseDefault[attr];
        });

        this.state = {
            value: '',
            error: null
        };
    }


    set(callback) {
        return new Promise(resolve => {
            const stateRef = {...this.state};
            callback(stateRef);
            this.setState(stateRef, (newState) => resolve(newState));
        });
    }

    getKeyValue() {
        return {
            key: this.name,
            value: this.state.value,
        };
    }

    getClassName() {
        let className = this.className ?
            this.className
            :
            `${this.name}-input `;

        if(this.state.error) 
            className += this.errorClassName ?
                this.errorClassName
                :
                'has-error';

        return className;
    }

    getReadableName() {
        return this.placeholder
            || this.labelText
            || this.name.replace(/^\w/, c => c.toUpperCase())
            || '';
    }

    validate(otherInputs = null) {
        this.set(state => state.error = '')
            .then(() => {
                const pred = this.predicates.find(
                    ({func}) => !func(this.state.value, otherInputs)
                );
        
                if(pred) {
                    this.set(state => state.error = pred.errorMsg);
                }
        
                return true;
            });
    }

    onChange(e) {
        this.set(state =>
            this.changeHandler(state, e)
        );
    }

    render() {
        const error = this.state.error;

        const Label = () => this.labelText ?
            <label>{this.getReadableName()}</label>
            :
            <Fragment/>;

        const ErrorMessage = () => error ?
            <span className={`error-message`}>{error}</span>
            :
            <Fragment />;

        return (
            <Fragment>
                <Label />
                <input
                    type={this.type}
                    name={this.name}
                    className={this.getClassName()}
                    placeholder={this.getReadableName()}
                    onChange={(e) => this.onChange(e)}
                />
                <ErrorMessage />
            </Fragment>
        )
    }
}

// name, hasLabel(bool), labelText(string), className(string), id(string),
// placeholder, changeHandler, 