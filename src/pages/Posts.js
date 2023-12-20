import { Grid, Item, Image, Icon, Container } from "semantic-ui-react";
import React, { useState, useEffect, useRef } from 'react'
import { Waypoint } from 'react-waypoint';
import { getFirestore, getDocs, collection, query, onSnapshot, orderBy, doc, limit, startAfter, where } from "firebase/firestore";
import firebaseApp from "../utils/firebase"



import Post from "../components/Post";
import { useLocation } from "react-router-dom";

function Posts({ userTable,user }) {
    const location = useLocation()
    const urlSearchParams = new URLSearchParams(location.search)
    const currentTopic = urlSearchParams.get('topic')
    // const [topicFilter, setTopicFilter] = useState([])
    const [posts, setposts] = useState([]);
    const lastPostSnapshotRef = useRef()


    useEffect(() => {
        if (currentTopic) {
            const q = query(collection(getFirestore(firebaseApp), "posts"), where('topic', '==', currentTopic), orderBy('createdAt', 'desc'), limit(4));
            onSnapshot(q, (querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => {
                    const id = doc.id
                    return ({ id, ...doc.data() })
                })
                setposts(data)
                lastPostSnapshotRef.current = querySnapshot.docs[querySnapshot.docs.length - 1]
                //抓取 陣列的最後一篇存進去Ref
            })
        } else {
            const q = query(collection(getFirestore(firebaseApp), "posts"), orderBy('createdAt', 'desc'), limit(4));
            onSnapshot(q, (querySnapshot) => {
                const data = querySnapshot.docs.map((doc) => {
                    const id = doc.id
                    return ({ id, ...doc.data() })
                })
                setposts(data)
                lastPostSnapshotRef.current = querySnapshot.docs[querySnapshot.docs.length - 1]
            })
        }





        // setTopicFilter(props.posts)
        // if (currentTopic) {
        //     setTopicFilter(props.posts.filter((item) => {
        //         return item.topic === currentTopic
        //     }))
        // }
    }, [currentTopic]);


    return (
        // <Container>
        //     <Grid>
        //         <Grid.Row>
        //             <Grid.Column width={3}>
        //                 <Topics topics={props.topics} />
        //             </Grid.Column>
        //             {/* 同boostrap Row>Colum切分畫面 BS為12等分 Semantic為16等分 */}
        //             <Grid.Column width={10}>
        //                 <Item.Group>
        //                     {
        //                         props.posts.map((post) => {
        //                             return <Item key={post.id} as={Link} to={`/posts/${post.id}`}>
        //                                 <Item.Image src={post.imageUrl ||'https://react.semantic-ui.com/images/wireframe/image.png'} size='small'></Item.Image>
        //                                 <Item.Content>
        //                                     <Item.Meta>
        //                                         {post.author.photoURL ? <Image src={post.author.photoURL}></Image> : <Icon name="user circle"></Icon>}
        //                                         {post.topic}．{post.author.displayName || '使用者'}
        //                                     </Item.Meta>
        //                                     <Item.Header>{post.title}</Item.Header>
        //                                     <Item.Description>{post.content}</Item.Description>
        //                                     <Item.Extra>
        //                                         留言 {post.commentsCount || 0}． 按讚 {post.likeBy.length||0}
        //                                     </Item.Extra>
        //                                 </Item.Content>
        //                             </Item>
        //                         })
        //                     }
        //                 </Item.Group>
        //             </Grid.Column>
        //             <Grid.Column width={3}></Grid.Column>
        //         </Grid.Row>
        //     </Grid>
        // </Container>

        <>
            <Item.Group>
                {
                    posts.map((post) => {
                        return <Post key={post.id} post={post} userTable={userTable} user={user}/>
                    })}
            </Item.Group>
            <Waypoint onEnter={() => {
                console.log('下滑')
                if (lastPostSnapshotRef.current) {
                    if (currentTopic) {
                        const q = query(collection(getFirestore(firebaseApp), "posts"), where('topic', '==', currentTopic), orderBy('createdAt', 'desc'), startAfter(lastPostSnapshotRef.current), limit(4));
                        onSnapshot(q, (querySnapshot) => {
                            const data = querySnapshot.docs.map((doc) => {
                                const id = doc.id
                                return ({ id, ...doc.data() })
                            })
                            setposts([...posts, ...data])
                            lastPostSnapshotRef.current = querySnapshot.docs[querySnapshot.docs.length - 1]

                        })
                    } else {
                        const q = query(collection(getFirestore(firebaseApp), "posts"), orderBy('createdAt', 'desc'), startAfter(lastPostSnapshotRef.current), limit(4));
                        onSnapshot(q, (querySnapshot) => {
                            const data = querySnapshot.docs.map((doc) => {
                                const id = doc.id
                                return ({ id, ...doc.data() })
                            })
                            setposts([...posts, ...data])
                            lastPostSnapshotRef.current = querySnapshot.docs[querySnapshot.docs.length - 1]

                        })
                    }
                }

            }} onLeave={() => { console.log('leave') }} />
        </>
    )
}

export default Posts;