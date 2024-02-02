import Styles from './ViewAllCommentsPopup.module.css'
import Comment from './Comment.jsx'
import { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import apiClient from '../../Services/apiClient'
import { Dialog, DialogContent, DialogTitle, DialogActions, Input } from '@mui/material'
import { useAuthContext } from '../../Services/authProvider'

// const test_comments = [
//   {
//     username: 'user1',
//     comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//     likes: 4
//   },
//   {
//     username: 'user2',
//     comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
//     likes: 6
//   },
//   {
//     username: 'user3',
//     comment: 'comment3',
//     likes: 5
//   },
//   {
//     username: 'user4',
//     comment: 'comment4',
//     likes: 9
//   },
//   {
//     username: 'user5',
//     comment: 'comment5',
//     likes: 0
//   },
//   {
//     username: 'user1',
//     comment: 'comment1',
//     likes: 2
//   },
//   {
//     username: 'user2',
//     comment: 'comment2',
//     likes: 8
//   },
//   {
//     username: 'user3',
//     comment: 'comment3',
//     likes: 0
//   },
//   {
//     username: 'user4',
//     comment: 'comment4',
//     likes: 0
//   },
//   {
//     username: 'user5',
//     comment: 'comment5',
//     likes: 0
//   },
//   {
//     username: 'user1',
//     comment: 'comment1',
//     likes: 0
//   },
//   {
//     username: 'user2',
//     comment: 'comment2',
//     likes: 0
//   },
//   {
//     username: 'user3',
//     comment: 'comment3',
//     likes: 0
//   },
//   {
//     username: 'user4',
//     comment: 'comment4',
//     likes: 57
//   },
//   {
//     username: 'user5',
//     comment: 'comment5',
//     likes: 467
//   }
// ]

function ViewAllCommentsPopup ( { postId } ) {
  const [open, setOpen] = useState(false)
  const [newComment, setNewComment] = useState('')
  const { user } = useAuthContext()
  var { userId, username } = user
  const [comments, setComments] = useState([])
  // const [isFetching, setIsFetching] = useState(false)

  userId = '65af2c4eba915118a4c98475' // temporary so it doesnt get erased during refresh
  username = 'vt'

  function getPostComments(postId) {
    apiClient.getPostComments(postId).then(res => {
      setComments(res.data.comments)
    });
  }

  // getPostComments(postId)

  function handleToggle() {
    getPostComments(postId)
    setOpen(!open)
    setNewComment('')
  }

  function handleAddNewComment (event) {
    if(event.keyCode === 13 && !event.shiftKey) {
      event.preventDefault()
      if(newComment !== '') {
        // console.log('Comment ', newComment)
        // // call api to add comment
        apiClient.addComment(userId, postId, newComment)
        // test_comments.push({ username: username, comment: newComment, likes: 0 })
        // getPostComments(postId)
        setNewComment('')
        // setIsFetching(true)
      }
    }
  }

  // useEffect(()=>{
  //   // setComments(test_comments)
  //   getPostComments(postId)
  // }, [postId, comments]) 
  // sends request to add comment and db is updated
  // list is re rendered when there are updates but infinite requests
  // comments are updated/re rendered almost immediately and it doesnt lag out

  useEffect(() => {
    getPostComments(postId)
  }, [postId]) // sends request to add comment and db is updated but nothing is re rendered

  // useEffect(() => {
  //   // moved everything outside and used getPostComments after new comment is added
  //   // caused a lot of lag and infinite requests
  //   // has a delay when it re renders the comments
  // }, [comments])

  // useEffect(()=> {
  //   console.log('fetching')
  //   getPostComments(postId)
  //   setIsFetching(false)
  // }, [postId, isFetching])

  return (
    <div>
      <button className={Styles['view-btn']} onClick={handleToggle}>View all comments</button>
      <Dialog
        open={open}
        onClose={handleToggle}
        scroll={'paper'}
        aria-labelledby='view-all-comments-popup'
        maxWidth='md'
      >
        <DialogTitle id='view-all-comments-popup' className={Styles['dialog-text']}>
          <CloseIcon className={Styles['close-btn']} onClick={handleToggle}/>
          <div className={Styles['total-comments']}>{`${comments.length} comments`}</div>
        </DialogTitle>
        <DialogContent className={Styles['dialog-container']}>
          {
            // comments.map((comment, i) =>
            //   // key is temporary will replace with _id later
            //   <Comment key={i} username={ comment.username } comment={ comment.comment } likes={comment.likes} />
            //   // have to get the username of the person who commented for each comment
            //   // problem is with how it is structured, it will require an extra call to get each username
            //   // and for posts with a lot of commments, it may be inefficient and slow
            // )
            comments.map((comment) =>
              <Comment key={ comment._id } username={ username } comment={ comment.commentText } likes={ comment.likes.length } />
            )
          }
        </DialogContent>
        <DialogActions className={Styles['add-comment-container']}>
          <Input
            className={Styles['add-comment-field']}
            placeholder='Add a comment'
            fullWidth
            multiline
            style={ { paddingLeft: '0.2rem', paddingRight: '0.2rem' } }
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            onKeyDown={handleAddNewComment}
          />
        </DialogActions>
      </Dialog>
    </div>
  )
};

export default ViewAllCommentsPopup