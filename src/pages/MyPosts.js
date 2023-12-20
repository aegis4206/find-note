import { Grid, Item, Image, Icon, Container, Header } from "semantic-ui-react";
import { getAuth } from 'firebase/auth';
import React from 'react'

import Post from "../components/Post";

function MyPosts(props) {
    const myPosts = props.posts.filter((post) => {
        return post.author.uid == getAuth().currentUser.uid
    })
    console.log(myPosts)
    return (
        <>
            <Header color="blue">我的文章列表</Header>
            <Item.Group>
                {
                    myPosts.map((post) => {
                        return <Post key={post.id} post={post} userTable={props.userTable}/>
                    })}
            </Item.Group>
        </>

    )
}

export default MyPosts;