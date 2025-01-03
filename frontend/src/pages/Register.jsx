import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import cfg from '../../../server/config/config.js';

const Register = () => {
    const [values, setValues] = useState({
        users: '',
        password: '',
    })

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post(`http://${cfg.domainname}:${cfg.serverport}/register`, values)
            .then(res => {
                console.log(res);
                setValues({ users: '', password: '' });
                navigate('/');
            })
            .then(err => console.log(err))
            .catch(err => console.log(err));
    }

    return (
        <div>
            <h1>Register</h1>
            <form action="" onSubmit={handleSubmit}>
                <input type="text" name="users" value={values.users} onChange={e => setValues({ ...values, users: e.target.value })} />
                <input type="password" name="password" value={values.password} onChange={e => setValues({ ...values, password: e.target.value })} />
                <Link to="/">Login</Link>
                <button type='submit'>Sign Up</button>
            </form>
        </div>
    )
}

export default Register