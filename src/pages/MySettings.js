import React, { useState, useEffect } from 'react'
import { Button, Header, Modal, Segment, Input, Image, Message } from 'semantic-ui-react'
import { getAuth, updateProfile, onAuthStateChanged, EmailAuthProvider, updatePassword, reauthenticateWithCredential } from 'firebase/auth'
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import firebaseApp from '../utils/firebase';


function MyName({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayName, setDisplayName] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    function onSubmit() {

        setIsLoading(true)
        updateProfile(user,
            {
                displayName,
            }
        ).then(() => {
            setDoc(doc(getFirestore(firebaseApp), "users", user.uid), {
                displayName: displayName || "",
                photoURL: getAuth().currentUser.photoURL || "",
                uid: getAuth().currentUser.uid
            }).then(() => {
                setDisplayName('')
                setIsModalOpen(false)
                setIsLoading(false)
            })

        })
    }

    return (
        <>
            <Header size='small'>
                會員名稱
                <Button floated='right' onClick={() => setIsModalOpen(true)}>修改</Button>
            </Header>
            <Segment vertical>
                {user?.displayName}
            </Segment>
            <Modal open={isModalOpen} size='mini'>
                <Modal.Header>修改會員名稱</Modal.Header>
                <Modal.Content>
                    <Input fluid placeholder="輸入新的會員名稱" value={displayName} onChange={e => setDisplayName(e.target.value)}></Input>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setIsModalOpen(false)}>取消</Button>
                    <Button onClick={onSubmit} loading={isLoading}>修改</Button>
                </Modal.Actions>
            </Modal>
        </>
    )
}

function MyPhoto({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const previewImageUrl = file ? URL.createObjectURL(file) : user?.photoURL

    function onSubmit() {
        const storage = getStorage();
        const storageRef = ref(storage, 'gs://social-cool-b8cbe.appspot.com/post-images/' + user.uid);
        const metadata = {
            contentType: file.type
        }

        setIsLoading(true)
        uploadBytes(storageRef, file, metadata).then(() => {
            getDownloadURL(storageRef).then((imageUrl) => {

                updateProfile(user,
                    {
                        photoURL: imageUrl,
                    }
                ).then(() => {
                    setDoc(doc(getFirestore(firebaseApp), "users", user.uid), {
                        displayName: getAuth().currentUser.displayName || "",
                        photoURL: imageUrl || "",
                        uid: getAuth().currentUser.uid

                    }).then(() => {
                        setFile(null)
                        setIsModalOpen(false)
                        setIsLoading(false)
                    })
                })
            })

        });


    }



    return (
        <>
            <Header size='small'>
                會員頭貼
                <Button floated='right' onClick={() => setIsModalOpen(true)}>修改</Button>
            </Header>
            <Segment open={isModalOpen} vertical>
                <Image src={user.photoURL} avatar size='medium'></Image>
            </Segment>
            <Modal open={isModalOpen} size='mini'>
                <Modal.Header>修改會員頭貼</Modal.Header>
                <Modal.Content image>
                    <Image src={previewImageUrl} avatar size='medium' ></Image>
                    <Modal.Description>
                        <Button as='label' htmlFor='post-image'>選擇照片</Button>
                        <Input type='file' id='post-image' style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])}></Input>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => setIsModalOpen(false)}>取消</Button>
                    <Button onClick={onSubmit} loading={isLoading}>修改</Button>
                </Modal.Actions>
            </Modal>
        </>)
}

function MyPassword({ user }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = React.useState('');


    function onSubmit() {
        setIsLoading(true)
        const credential = EmailAuthProvider.credential(user.email, oldPassword)
        //取得重新驗證
        reauthenticateWithCredential(user, credential).then(() => {
            updatePassword(user, newPassword).then(() => {
                setOldPassword('')
                setNewPassword('')
                setIsModalOpen(false)
                setIsLoading(false)
            })
        }).
            catch(error => {
                switch (error.code) {
                    case 'auth/wrong-password':
                        setErrorMessage('密碼輸入錯誤');
                        break;
                    default:
                }
                setIsLoading(false);
            })
    }

    return (
        <>
            <Header size='small'>
                會員密碼
                <Button floated='right' onClick={() => setIsModalOpen(true)}>修改</Button>
            </Header>
            <Segment vertical>
                ******
            </Segment>

            <Modal open={isModalOpen} size='mini'>
                <Modal.Header>修改會員密碼</Modal.Header>
                <Modal.Content>
                    <Header size='small'>目前密碼</Header>
                    <Input fluid placeholder="輸入舊的會員密碼" value={oldPassword} onChange={e => setOldPassword(e.target.value)}></Input>
                    <Header size='small'>新密碼</Header>
                    <Input fluid placeholder="輸入新的會員密碼" value={newPassword} onChange={e => setNewPassword(e.target.value)}></Input>
                </Modal.Content>

                <Modal.Actions>
                    {errorMessage && <Message size='small' negative>{errorMessage}</Message>}
                    <Button onClick={() => setIsModalOpen(false)}>取消</Button>
                    <Button onClick={onSubmit} loading={isLoading}>修改</Button>
                </Modal.Actions>
            </Modal>
        </>
    )
}

export default function MySettings() {
    const [user, setUser] = useState({});

    useEffect(() => {
        onAuthStateChanged(getAuth(firebaseApp), (currentUser) => {
            setUser(currentUser)
        })
    }, []);


    return (
        <>
            <Header color="blue">
                會員資料
            </Header>
            <MyName user={user} />
            <MyPhoto user={user} />
            <MyPassword user={user} />
        </>

    )
}
