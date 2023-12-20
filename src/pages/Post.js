import React, { useState, useEffect, useLayoutEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom';
import { Grid, Header, Image, Icon, Container, Segment, Comment, Form } from "semantic-ui-react";
import { arrayRemove, arrayUnion, doc, onSnapshot, getFirestore, updateDoc, increment, writeBatch, serverTimestamp, collection, orderBy, query, getDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

import firebaseApp from '../utils/firebase';


export default function Post(props) {
    const { postId } = useParams();
    const [post, setPost] = useState({});
    const [commentContent, setCommentContent] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [comments, setComments] = useState([]);
    let isCollected = post.collectedBy?.includes(getAuth().currentUser.uid)
    let isLike = post.likeBy?.includes(getAuth().currentUser.uid)

    // const currentUser = props.userTable.filter((user) => {
    //     return user.uid == postId
    // })
    const currentPost= props.posts.filter((post)=>{
        return post.id==postId
    })

    const currentUser = props.userTable.filter((user) => {
        return user.uid == currentPost[0].uid
    })


    useLayoutEffect(() => {

        // getDoc(doc(getFirestore(firebaseApp), "posts", postId))
        //     .then(
        //         (querySnapshot) => {
        //             setPost(querySnapshot.data())
                    
        //         }
        //     );
        onSnapshot(doc(getFirestore(firebaseApp), "posts", postId), (querySnapshot) => {
            setPost(querySnapshot.data())
            //取得文章本體並render
        })


    }, [postId])
    // useEffect(() => {

    //     onSnapshot(doc(getFirestore(firebaseApp), "posts", postId), (querySnapshot) => {
    //         setPost(querySnapshot.data())
    //         //取得文章本體並render
    //     })
    // }, [])

    useEffect(() => {
        // onSnapshot(doc(getFirestore(firebaseApp), "posts", postId).
        //     getDocs(collection(getFirestore(firebaseApp), "comments")),
        //     (querySnapshot) => {
        //         console.log(querySnapshot.data())
        //     }

        // )
        const all = doc(getFirestore(firebaseApp), "posts", postId)
        const com = collection(all, "comments")
        const obCom = query(com, orderBy('createdAt'))
        //('createdAt') desc遞減 預設遞增

        onSnapshot(obCom, (querySnapshot) => {
            // const data = querySnapshot.docs.map((doc) => {
            //     return doc.data()
            // })

            const data = querySnapshot.docs
            setComments(data)
            //取得文章本體留言並render
        })
        // collection(getFirestore(firebaseApp), "comments")


    }, [postId])

    function toggle(isActive, field) {
        const uid = getAuth().currentUser.uid
        updateDoc(doc(getFirestore(firebaseApp), "posts", postId), {
            [field]: isActive ? arrayRemove(uid) : arrayUnion(uid),
            //不能直接傳入field會變成該欄位名 須改用[]
            //arrayUnion為firestore API可以將不重複的值加入陣列
            //arrayRemove為 將該值從陣列中刪除
        }).then(()=>{
            isActive=!isActive
        })
    }
    function onSubmit() {
        setIsLoading(true);
        const batch = writeBatch(getFirestore(firebaseApp));
        const upRef = doc(getFirestore(firebaseApp), 'posts', postId)
        const seRef = doc(collection(upRef, 'comments'))
        //upRef內的在新增集合
        //尚未知道firebase如何使用自動生成id

        batch.update(upRef, {
            commentsCount: increment(1)
        })
        batch.set(seRef, {
            content: commentContent,
            createdAt: serverTimestamp(),
            author: {
                displayName: getAuth().currentUser.displayName || "",
                photoURL: getAuth().currentUser.photoURL || "",
                uid: getAuth().currentUser.uid
            },
            uid: getAuth().currentUser.uid
        })

        batch.commit().then(() => {
            setCommentContent("");
            setIsLoading(false);
        });
    }

    //初次調用post就會先執行一次render 此時post尚未set進資料固以post?. 或 post.author?.取代

    return (

        // <Container>
        //     <Grid>
        //         <Grid.Row>
        //             <Grid.Column width={3}>
        //                 <Topics topics={props.topics} />
        //             </Grid.Column>
        //             {/* 同boostrap Row>Colum切分畫面 BS為12等分 Semantic為16等分 */}
        //             <Grid.Column width={10}>
        //                 {/* <Image src={post.author.photoURL}></Image> */}
        //                 {post.author?.photoURL ? <Image src={post.author?.photoURL}></Image> : <Icon name="user circle"></Icon>}
        //                 {post.author?.displayName || '使用者'}
        //                 <Header>
        //                     {post?.title}
        //                     <Header.Subheader>
        //                         {post?.topic}．{new Date(post.createdAt?.seconds * 1000).toLocaleString()}

        //                     </Header.Subheader>
        //                 </Header>
        //                 <Image src={post?.imageUrl}></Image>
        //                 <Segment basic vertical>{post?.content}</Segment>
        //                 <Segment basic vertical>
        //                     {/* basic無邊框預設格式 對其格線 */}
        //                     留言 {post?.commentsCount || 0} ． 按讚 {post.likeBy?.length || 0}．
        //                     <Icon name={`thumbs up${isLike ? '' : ' outline'}`} color={isLike ? 'blue' : 'grey'} link onClick={() => toggle(isLike, 'likeBy')}>
        //                     </Icon>．<Icon name={`bookmark${isCollected ? '' : ' outline'}`} color={isCollected ? 'blue' : 'grey'} link onClick={() => toggle(isCollected, 'collectedBy')}></Icon>
        //                 </Segment>
        //                 <Comment.Group>
        //                     <Form reply>
        //                         {/* reply拉高文字方塊 */}
        //                         <Form.TextArea value={commentContent} onChange={e => setCommentContent(e.target.value)}></Form.TextArea>
        //                         <Form.Button onClick={onSubmit} loading={isLoading}>留言送出</Form.Button>
        //                     </Form>
        //                     <Header>共{post?.commentsCount || 0}則留言</Header>
        //                     {
        //                         comments.map((comment) => {
        //                             return (
        //                                 <Comment>
        //                                     <Comment.Avatar src={comment?.author.photoURL}></Comment.Avatar>
        //                                     <Comment.Content>
        //                                         <Comment.Author as='span'>{comment?.author.displayName || '使用者'}</Comment.Author>
        //                                         {/* as span 原本為div有block加入後變為inline元素 */}
        //                                         <Comment.Metadata>{new Date(comment?.createdAt?.seconds * 1000).toLocaleString()}</Comment.Metadata>
        //                                         <Comment.Text>{comment?.content}</Comment.Text>
        //                                     </Comment.Content>
        //                                 </Comment>
        //                             )
        //                         })
        //                     }
        //                 </Comment.Group>

        //             </Grid.Column>
        //             <Grid.Column width={3}></Grid.Column>
        //         </Grid.Row>
        //     </Grid>
        // </Container>
        props.user !== null ?
            <>

                {/* <Image src={post.author.photoURL}></Image> */}

                {currentUser[0]?.photoURL ? <Image src={currentUser[0]?.photoURL} avatar></Image> : <Icon name="user circle"></Icon>}
                {' '}
                {currentUser[0]?.displayName || '使用者'}
                <Header>
                    {post?.title}
                    <Header.Subheader>
                        {post?.topic}．{new Date(post.createdAt?.seconds * 1000).toLocaleString()}

                    </Header.Subheader>
                </Header>
                <Image src={post?.imageUrl}></Image>
                <Segment basic vertical>{post?.content}</Segment>
                <Segment basic vertical>
                    {/* basic無邊框預設格式 對其格線 */}
                    留言 {post?.commentsCount || 0} ． 按讚 {post.likeBy?.length || 0}．
                    <Icon name={`thumbs up${isLike ? '' : ' outline'}`} color={isLike ? 'blue' : 'grey'} link onClick={() => toggle(isLike, 'likeBy')}>
                    </Icon>．<Icon name={`bookmark${isCollected ? '' : ' outline'}`} color={isCollected ? 'blue' : 'grey'} link onClick={() => toggle(isCollected, 'collectedBy')}></Icon>
                </Segment>
                <Comment.Group>
                    <Form reply>
                        {/* reply拉高文字方塊 */}
                        <Form.TextArea value={commentContent} onChange={e => setCommentContent(e.target.value)}></Form.TextArea>
                        <Form.Button onClick={onSubmit} loading={isLoading}>留言送出</Form.Button>
                    </Form>
                    <Header>共{post?.commentsCount || 0}則留言</Header>
                    {
                        comments.map((comment) => {
                            const currentUser = props.userTable.filter((user) => {
                                return user.uid === comment.data().uid
                            })
                            return (
                                <Comment key={comment?.id}>
                                    <Comment.Avatar src={currentUser[0].photoURL}></Comment.Avatar>

                                    <Comment.Content>
                                        <Comment.Author as='span'>{currentUser[0].displayName || '使用者'}</Comment.Author>
                                        {/* as span 原本為div有block加入後變為inline元素 */}
                                        <Comment.Metadata>{new Date(comment?.data().createdAt?.seconds * 1000).toLocaleString()}</Comment.Metadata>
                                        <Comment.Text>{comment?.data().content}</Comment.Text>
                                    </Comment.Content>
                                </Comment>
                            )
                        })
                    }
                </Comment.Group>

            </> : <Navigate to='/Signin' />
    )
}
