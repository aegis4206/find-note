import React from 'react'
import { Link, useLocation } from 'react-router-dom';
import { List } from "semantic-ui-react";


function Topics(props) {
    const location = useLocation()
    const urlSearchParams = new URLSearchParams(location.search)
    const currentTopic = urlSearchParams.get('topic')
    //取得?後的字串值


    return (
        <List animated selection size='big'>
            {props.topics.map((data) => {
                return (
                    <List.Item as={Link} to={`/posts?topic=${data.name}`} key={data.name} active={currentTopic===data.name}>
                        {data.name}
                    </List.Item>
                )

            })}
        </List>
    )
}
export default Topics
