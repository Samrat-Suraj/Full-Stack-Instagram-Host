import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Posts = () => {

    const { allPost } = useSelector(store => store.post)

    return (
        <div className=''>
            {
                allPost?.map((post) => {
                    return (
                        <div key={post?._id}>
                            <Post post={post} />
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Posts