import React, { useState } from 'react'
import { Container, Header, Form, Image, Button } from 'semantic-ui-react'
import firebaseApp from '../utils/firebase';
import { getFirestore, collection, addDoc, serverTimestamp, setDoc, doc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth';
import { getStorage, uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { useNavigate, Navigate } from 'react-router-dom'


function NewPost(props) {
    const navigate = useNavigate();
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [topicName, settopicName] = useState('')
    const [file, setFile] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    const previewUrl = file ? URL.createObjectURL(file) : "https://react.semantic-ui.com/images/wireframe/image.png";

    function onSubmit() {
        setIsLoading(true);

        addDoc(collection(getFirestore(firebaseApp), "posts"), {}).then((item) => {
            const storage = getStorage();
            const storageRef = ref(storage, 'gs://social-cool-b8cbe.appspot.com/post-images/' + item.id);
            const metadata = {
                contentType: file.type
            }
            uploadBytes(storageRef, file, metadata).then(() => {
                getDownloadURL(storageRef).then((imageUrl) => {
                    setDoc(doc(getFirestore(firebaseApp), "posts", item.id), {
                        title,
                        content,
                        topic: topicName,
                        createdAt: serverTimestamp(),
                        author: {
                            displayName: getAuth().currentUser.displayName || "",
                            photoURL: getAuth().currentUser.photoURL || "",
                            uid: getAuth().currentUser.uid,
                            email: getAuth().currentUser.email
                        },
                        uid: getAuth().currentUser.uid,
                        imageUrl
                    })
                        .then(() => {
                            setDoc(doc(getFirestore(firebaseApp), "users", props.user.uid), {
                                displayName: getAuth().currentUser.displayName || "",
                                photoURL: getAuth().currentUser.photoURL || "",
                                uid: getAuth().currentUser.uid
                            }).then(() => {
                                setIsLoading(false);
                                navigate("/posts");
                            })

                        })
                });
            });

        })

        // setIsLoading(false);
        // navigate("/");

        // const fileRef = getStorage(firebaseApp, 'post-images/')
        // const metadata = {
        //     contentType: file.type
        // }

        // uploadBytes(fileRef, metadata).then(() => {
        //     getDownloadURL().then((imageUrl) => {
        //         console.log(imageUrl)
        //     })
        // })


        // const storage = getStorage();
        // const storageRef = ref(storage, 'post-images/');
        // const metadata = {
        //     contentType: file.type
        // }
        // const uploadTask = uploadBytes(storageRef, file, metadata);
        // getDownloadURL(storageRef).then((downloadURL) => {
        //     console.log('File available at', downloadURL);
        // });

    }

    return (
        props.user !== null ?
            <Container>
                <Header>發表貼文</Header>
                <Form onSubmit={onSubmit}>
                    <Image src={previewUrl} size='medium'
                        floated='left'
                    ></Image>
                    <Button basic color='black' as='label' htmlFor='post-image'

                    >上傳貼文圖片</Button>
                    {/* htmlFor='post-image' 需與下方id一致才能觸發下方input */}
                    <Form.Input type='file' id='post-image' style={{ display: 'none' }}
                        onChange={(e) => {
                            setFile(e.target.files[0])
                        }}>
                    </Form.Input>
                    <Form.Input placeholder='輸入貼文標題'
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}>
                    </Form.Input>
                    <Form.TextArea placeholder='輸入貼文內容'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}>
                    </Form.TextArea>
                    <Form.Dropdown placeholder='選擇貼文主題'
                        options={
                            props.topics.map((i) => {
                                return {
                                    text: i.name,
                                    value: i.name
                                }
                            })
                        }
                        selection
                        value={topicName}
                        onChange={(e, { value }) => {
                            settopicName(value)
                        }}
                    // selection滿版變寬
                    >
                    </Form.Dropdown>
                    <Form.Button loading={isLoading}>送出</Form.Button>
                </Form>
            </Container > : <Navigate to='/posts' />
    )
}
export default NewPost