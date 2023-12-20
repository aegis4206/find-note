import React, { useEffect, useState, useLayoutEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import firebaseApp from "./utils/firebase"
import { getFirestore, getDocs, collection, query, onSnapshot, orderBy, doc, limit, startAfter } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Container, Grid } from 'semantic-ui-react';


import Header from "./Header";
import Signin from './pages/Signin';
import Posts from './pages/Posts';
import NewPost from './pages/NewPost';
import Post from './pages/Post';
import Topics from './components/Topic';
import PostNavigate from './pages/PostNavigate';
import MyNavigate from './pages/MyNavigate';




function App() {
    const [topics, setTopics] = useState([]);
    const [posts, setposts] = useState([]);
    const [userTable, setUserTable] = useState([]);
    const [user, setUser] = useState();
    //user 初始化為uundefined 確認無登入才是null






    useLayoutEffect(() => {
        getDocs(collection(getFirestore(firebaseApp), "topics"))
            .then(
                (querySnapshot) => {
                    const data = querySnapshot.docs.map((doc) => {
                        return doc.data()
                    })
                    setTopics(data)
                }
            );
        //取得topices陣列
        const userT = query(collection(getFirestore(firebaseApp), "users"));
        // limet(數字) 限制回傳的數量
        onSnapshot(userT, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => {
                return doc.data()
            })
            setUserTable(data)
        })
         //取得userTable

        // getDocs(collection(getFirestore(firebaseApp), "users"))
        //     .then(
        //         (querySnapshot) => {
        //             const data = querySnapshot.docs.map((doc) => {
        //                 return doc.data()
        //             })
        //             setUserTable(data)
        //         }
        //     );
            //取得userTable

        // getDocs(collection(getFirestore(firebaseApp), "posts"))
        //     .then(
        //         (querySnapshot) => {
        //             const data = querySnapshot.docs.map((doc) => {
        //                 const id = doc.id
        //                 // return doc.data()
        //                 return ({ id, ...doc.data() })
        //             })
        //             setposts(data)
        //             console.log(data)
        //         }
        //     );
        //上面無即時監控 改為下面即時監控
        const q = query(collection(getFirestore(firebaseApp), "posts"), orderBy('createdAt', 'desc'));
        // limet(數字) 限制回傳的數量
        onSnapshot(q, (querySnapshot) => {
            const data = querySnapshot.docs.map((doc) => {
                const id = doc.id
                return ({ id, ...doc.data() })
            })
            setposts(data)
        })

        onAuthStateChanged(getAuth(firebaseApp), (currentUser) => {
            setUser(currentUser)
        })
    }, [])


    return (
        <BrowserRouter>
            <Header user={user} posts={posts} userTable={userTable}/>
            <Routes>

                {/* <Route path='/posts' exact={false}>
                    <Container>
                        <Grid>
                            <Grid.Row>
                                <Grid.Column width={3}>
                                    <Topics topics={topics} />
                                </Grid.Column>
                                <Grid.Column width={10}>
                                    <Routes>
                                        <Route path='/posts'>
                                            <Posts />
                                        </Route>
                                        <Route path='/posts/:postId'>
                                            <Post />
                                        </Route>
                                    </Routes>
                                </Grid.Column>
                                <Grid.Column width={3}></Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Container>
                </Route> */}r

                <Route path="/posts/*" element={<PostNavigate topics={topics} posts={posts} user={user} userTable={userTable}/>} />




                {/* <Route path="/" element={<Posts topics={topics} posts={posts} />} >
                </Route> */}

                {/* <Route path="/posts" element={<Posts topics={topics} posts={posts} />} >
                </Route> */}

                <Route path="/my/*" element={<MyNavigate user={user}  posts={posts} userTable={userTable}/>} />

                <Route path="/Signin" element={<Signin user={user} />} >
                </Route>
                <Route path="/new-post" element={<NewPost topics={topics} user={user} />}>
                </Route>

                {/* <Route path="/posts/:postId" element={<Post topics={topics} posts={posts} />}>
                </Route> */}
            </Routes>
        </BrowserRouter>
    )
}

export default App;