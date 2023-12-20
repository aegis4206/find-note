import React from 'react'
import { Routes, Route,  } from 'react-router-dom'
import { Grid, Container, } from 'semantic-ui-react';
import Post from './Post'
import Posts from './Posts'
import Topics from '../components/Topic';

function PostNavigate(props) {
    return (
       
            <Container>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}><Topics topics={props.topics} /></Grid.Column>
                        <Grid.Column width={10}>
                            <Routes>
                                <Route path="*" element={<Posts userTable={props.userTable} user={props.user}/>} />
                                 <Route path=":postId" element={<Post posts={props.posts} user={props.user} userTable={props.userTable}/>} />
                            </Routes>
                        </Grid.Column>
                        <Grid.Column width={2}></Grid.Column>
                    </Grid.Row>
                </Grid>
            </Container>             

    )
}

export default PostNavigate;