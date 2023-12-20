import { Grid, Item, Image, Icon, Container, Header } from "semantic-ui-react";
import { getAuth } from 'firebase/auth';
import React from 'react'

import Post from "../components/Post";

function MyCollections(props) {
    console.log(props.posts)
    const myPosts = props.posts.filter((post) => {
        return post.collectedBy?.find(i=>i==getAuth().currentUser.uid)
        //post.collectedBy 尋找裡面符合uid的回傳true  回傳false代表該項目無符合

        // return post.collectedBy === getAuth().currentUser.uid
    })
    return (
        <>
            <Header color="blue">我的收藏列表</Header>
            <Item.Group>
                {
                    myPosts.map((post) => {
                        return <Post key={post.id} post={post} userTable={props.userTable}/>
                    })}
            </Item.Group>
        </>

    )
}

export default MyCollections;