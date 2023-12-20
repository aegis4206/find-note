import React from 'react'
import { Item, Image, Icon, Button } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

export default function Post({ post, userTable, user }) {
    const currentUser = userTable.filter((user) => {
        return user.uid == post.uid
    })
    return (
        <>
            <Item as={Link} to={`/posts/${post.id}`}>
                <Item.Image src={post?.imageUrl || 'https://react.semantic-ui.com/images/wireframe/image.png'} size='small'></Item.Image>
                <Item.Content>
                    <Item.Meta>
                        {currentUser[0]?.photoURL ? <Image src={currentUser[0]?.photoURL} avatar></Image> : <Icon name="user circle"></Icon>}
                        {' '}
                        {post?.topic}．{currentUser[0]?.displayName || '使用者'}
                    </Item.Meta>
                    <Item.Header>{post?.title}</Item.Header>
                    <Item.Description>{post?.content}</Item.Description>
                    <Item.Extra>
                        留言 {post?.commentsCount || 0}． 按讚 {post.likeBy?.length || 0}
                    </Item.Extra>
                </Item.Content>
            </Item>
            <hr></hr>
        </>
    )
}
