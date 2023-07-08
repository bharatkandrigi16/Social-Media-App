import React, {useContext, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth'

import { useForm } from '../util/hooks';

function Register (props) {
    const context =  useContext(AuthContext);
    
    const [errors, setErrors] = useState({});

    const {onChange, onSubmit, values } = useForm(registerUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();
    const [addUser, { loading }] = useMutation(REGISTER_USER, {
        update(_, { data: { register: userData}}) {
            context.login(userData)
            navigate('/')
        },
        onError(err) {
            if (err.graphQLErrors.length > 0) {
                setErrors(err.graphQLErrors[0].extensions.exception.errors);
            }       
        },
        variables: values
    });

    function registerUser() {
        addUser();
    }
    
    return(
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
                <h1>Register</h1>
                <Form.Input
                   label="username"
                   placeholder="Username.."
                   name="username"
                   type="text"
                   value={values.username}
                   onChange={onChange}
                   />
                   <Form.Input
                   label="email"
                   placeholder="email.."
                   name="email"
                   type="email"
                   value={values.email}
                   onChange={onChange}
                   />
                   <Form.Input
                   label="password"
                   placeholder="password.."
                   name="password"
                   type="password"
                   value={values.password}
                   onChange={onChange}
                   />
                   <Form.Input
                   label="Confirm Password"
                   placeholder="Confirm Password.."
                   name="confirmPassword"
                   type="password"
                   value={values.confirmPassword}
                   onChange={onChange}
                   />
                   <Button type="submit" primary>
                      Register
                   </Button>
            </Form>
            {errors && Object.keys(errors).length > 0 && (<div className="ui error message">
                <ul className="list">
                    {Object.values(errors).map((value) => (
                        <li key={value}>{value}</li>
                    ))}
                </ul>
            </div>)}
        </div>
    );
}
const REGISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ) {
        register( registerInput: {
         username: $username
         email: $email
         password: $password
         confirmPassword: $confirmPassword
          }
        )
        {
            id email username createdAt token
        }
    }
`
export default Register;