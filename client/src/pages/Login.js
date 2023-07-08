import React, {useState, useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

import { AuthContext } from '../context/auth'

import { useForm } from '../util/hooks';

function Login () {
    const context = useContext(AuthContext);

    const [errors, setErrors] = useState({});

    const {onChange, onSubmit, values } = useForm(logUser, {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();
    const [loginUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData}}) {
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

    function logUser() {
        loginUser();
    }
    
    return(
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
                <h1>Login</h1>
                <Form.Input
                   label="username"
                   placeholder="Username.."
                   name="username"
                   type="text"
                   value={values.username}
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
                   <Button type="submit" primary>
                      Login
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
const LOGIN_USER = gql`
    mutation login($username: String!, $password: String!)
     {
        login(username: $username, password: $password)
        {
            id username createdAt token
        }
    }
`
export default Login;