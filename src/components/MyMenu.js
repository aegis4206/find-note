import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { List } from "semantic-ui-react";


function MyMenu() {
    const location = useLocation()
    const menuItems = [{
        name: '我的文章',
        path: 'posts'
    }, {
        name: '我的收藏',
        path: 'collections'
    }, {
        name: '會員設定',
        path: 'settings'
    }]
    console.log(location)
    return (
        <List animated selection size='large'>
            {menuItems.map((item) => {
                return (
                    <List.Item key={item.name} as={Link} to={item.path} active={'/my/'+item.path==location.pathname}>
                        {item.name}
                    </List.Item>
                )

            })}
        </List>
    )
}
export default MyMenu
