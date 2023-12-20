import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Grid, Container, } from 'semantic-ui-react';
import Post from './Post'
import Posts from './Posts'
import Topics from '../components/Topic';
import MyMenu from '../components/MyMenu';
import MyPosts from './MyPosts';
import MyCollections from './MyCollections';
import MySettings from './MySettings';

function MyNavigate(props) {

    return (
        
            props.user!==null ?
                <Container>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={5}>
                                {/* <Routes>
                        <Route path="*" element={'會員選單'} />
                    </Routes> */}
                                <MyMenu />
                            </Grid.Column>
                            <Grid.Column width={10}>
                                <Routes>
                                    <Route path="/posts" element={<MyPosts posts={props.posts} userTable={props.userTable}/>} />
                                    <Route path="/collections" element={<MyCollections posts={props.posts} userTable={props.userTable}/>} />
                                    <Route path="/settings" element={<MySettings />} />

                                </Routes>
                            </Grid.Column>
                            <Grid.Column width={1}></Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Container> : <Navigate to='/posts'/>
                //<Navigate to='/posts'/> 路徑為絕對路徑
        

    )
}

export default MyNavigate;