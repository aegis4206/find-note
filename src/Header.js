import { Menu, Input, Dropdown, Search } from 'semantic-ui-react';
import { Link, useNavigate } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";


import firebaseApp from './utils/firebase';
import algolia from './utils/algolia';

function Header({ user, posts, userTable }) {
    const [inputValue, setInputValue] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();



    // React.useEffect(() => {
    //     onAuthStateChanged(getAuth(firebaseApp), (currentUser) => {
    //         setUser(currentUser)
    //     })
    // }, [])
    //上面由App傳入
    useEffect(() => {
        const res = posts.filter(item => {
            return item.title.includes(inputValue) || item.content.includes(inputValue)

        })


        res.map((item) => {
            const currentUser = userTable.filter((user) => {
                return user.uid == item.uid
            })
            item.description = item.content
            item.price = currentUser[0].displayName
            delete item.collectedBy
            delete item.commentsCount
            delete item.createdAt
            delete item.imageUrl
            delete item.likeBy
        })


        console.log(res)

        //description、orice為semantic UI預設抓取欄位
        setResults(res)
    }, [inputValue]);

    function onSearchChange(e, { value }) {
        //{value} 回傳value
        setInputValue(value)
        // algolia.search(value).then((result) => {
        //     const searchResults = result.hits.map(hit => {
        //         return {
        //             title: hit.title,
        //             description: hit.content,
        //             id: hit.objectID

        //         }
        //     })
        //     setResults(searchResults)
        // })
        //無使用algoliasearch

        // console.log(inputValue)

        // const res = posts.filter(item => {
        //     console.log(item.title.includes(inputValue))
        //     return item.title.includes(inputValue)

        // })
        // setResults(res)
        // console.log(res)
    }

    function onResultSelect(e, { result }) {
        navigate(`/posts/${result.id}`)
    }

    return (
        <Menu  >
            {/* <Menu.Item as={Link} to="/">Social Cool</Menu.Item> */}
            <Menu.Item icon='find' as={Link} to="/posts" content='記事'></Menu.Item>
            <Menu.Item position='left'>
                <Search value={inputValue} onSearchChange={onSearchChange} results={results} noResultsMessage="搜尋不到相關文章"
                    onResultSelect={onResultSelect}
                    size='mini' input={{ icon: 'search', iconPosition: 'left' }} />
                {/* <Input value={inputValue} onChange={onSearchChange}
                    size='mini' icon='search' placeholder='Search...' /> */}
            </Menu.Item>
            <Menu.Menu position='right'>

                {user !== null ? (
                    <>
                        {/* <Menu.Item as={Link} to="/new-post">
                            發表文章
                        </Menu.Item>
                        <Menu.Item as={Link} to="/my/posts">
                            會員
                        </Menu.Item>
                        <Menu.Item onClick={() => getAuth(firebaseApp).signOut()}>
                            登出
                        </Menu.Item> */}
                        <Dropdown item text='' icon='bars'>
                            <Dropdown.Menu>
                                <Dropdown.Item as={Link} to="/new-post">發表文章</Dropdown.Item>
                                <Dropdown.Item as={Link} to="/my/posts">會員</Dropdown.Item>
                                <Dropdown.Item onClick={() => getAuth(firebaseApp).signOut()} as={Link} to="/posts">登出</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>

                    </>
                ) :
                    (
                        <Menu.Item as={Link} to="/Signin">註冊/登入</Menu.Item>
                    )}

            </Menu.Menu>
        </Menu >
    )
}

export default Header;