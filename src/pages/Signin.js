import React from 'react'
import { Menu, Form, Container, Message } from 'semantic-ui-react'
import { useNavigate, Navigate } from 'react-router-dom'
// import 'firebase/compat/auth';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import firebaseApp from '../utils/firebase';


function Signin(props) {
    const navigate = useNavigate();
    const auth = getAuth(firebaseApp);
    const [activeItem, setActiveItem] = React.useState('signin');
    //設定預設 register
    const [email, setEmail] = React.useState('admin@admin.admin');
    const [password, setPassword] = React.useState('password');
    const [errorMessage, setErrorMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    function onSubmit() {
        setIsLoading(true);
        if (activeItem == 'register') {
            createUserWithEmailAndPassword(auth, email, password)
                .then((e) => {
                    console.log('this', this)
                    console.log('e', e)
                    navigate("/posts");
                    setIsLoading(false);
                }).catch(error => {
                    switch (error.code) {
                        case 'auth/email-already-in-use':
                            setErrorMessage('信箱已存在');
                            break;
                        case 'auth/invalid-email':
                            setErrorMessage('信箱格式不正確');
                            break;
                        case 'auth/weak-password':
                            setErrorMessage('密碼強度不足');
                            break;
                        default:
                    }
                    setIsLoading(false);
                })
        }
        else if (activeItem == 'signin') {
            signInWithEmailAndPassword(auth, email, password)
                .then((e) => {
                    console.log('this', this)
                    console.log('e', e)
                    navigate("/posts");
                    setIsLoading(false);
                }).catch(error => {
                    switch (error.code) {
                        case 'auth/invalid-email':
                            setErrorMessage('信箱格式不正確');
                            break;
                        case 'auth/user-not-found':
                            setErrorMessage('信箱不存在');
                            break;
                        case 'auth/wrong-password':
                            setErrorMessage('密碼錯誤');
                            break;
                        default:
                    }
                    setIsLoading(false);
                })
        }
    }

    return (
        props.user !== null ? <Navigate to='/posts' /> :
            <Container>
                {activeItem === 'signin' && <Message color='orange'>請先登入才能啟用全部功能</Message>}
                <Menu widths='2'>
                    <Menu.Item active={activeItem == 'register'} onClick={() => { setErrorMessage(''); setActiveItem('register') }}>註冊</Menu.Item>
                    <Menu.Item active={activeItem == 'signin'} onClick={() => { setErrorMessage(''); setActiveItem('signin') }}>登入</Menu.Item>
                </Menu>
                <Form onSubmit={onSubmit}>
                    <Form.Input
                        label="信箱" value={email} placeholder="請輸入信箱" onChange={(e) => setEmail(e.target.value.trim())}
                    ></Form.Input>
                    <Form.Input
                        label="密碼" value={password} placeholder="請輸入密碼" onChange={(e) => setPassword(e.target.value.trim())}
                        type="password"
                    ></Form.Input>
                    {errorMessage && <Message negative>{errorMessage}</Message>}
                    <Form.Button loading={isLoading}>
                        {activeItem == 'register' && '註冊'}
                        {activeItem == 'signin' && '登入'}
                    </Form.Button>
                </Form>
            </Container>

    )
}
export default Signin;